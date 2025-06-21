from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Dict
from passlib.context import CryptContext
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain.tools import tool
import os
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import base64
from email.message import EmailMessage
from vector import retriever  

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


fake_db: Dict[str, dict] = {}

class UserSignup(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

@app.post("/api/signup")
async def signup(user: UserSignup):
    if user.email in fake_db:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user.password)
    fake_db[user.email] = {"email": user.email, "hashed_password": hashed_pw}

    return {"message": "User created successfully"}

@app.post("/api/login")
async def login(user: UserLogin):
    db_user = fake_db.get(user.email)
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    return {"message": "Login successful"}

load_dotenv()
CLIENT_FILE = 'client_secret.json'
SCOPES = ['https://mail.google.com/']

class EmailDraftStore:
    def __init__(self, user_gmail):
        self.user_gmail = user_gmail
        self.drafts = {}
        self.current_draft = None

    def create_draft(self, draft_name):
        if draft_name in self.drafts:
            return f"Draft '{draft_name}' already exists."
        self.drafts[draft_name] = {"Subject": None, "Body": None, "From": self.user_gmail, "To": None}
        self.current_draft = draft_name
        return f"Created and switched to draft '{draft_name}'."

    def switch_draft(self, draft_name):
        if draft_name not in self.drafts:
            return f"Draft '{draft_name}' does not exist."
        self.current_draft = draft_name
        return f"Switched to draft '{draft_name}'."

    def save_draft(self, subject, body):
        if not self.current_draft:
            return "No draft selected. Create or switch to a draft first."
        self.drafts[self.current_draft]["Subject"] = subject
        self.drafts[self.current_draft]["Body"] = body
        return f"Draft '{self.current_draft}' saved."

    def set_recipients(self, recipients):
        if not self.current_draft:
            return "No draft selected. Create or switch to a draft first."
        self.drafts[self.current_draft]["To"] = recipients
        return f"Recipients set for draft '{self.current_draft}'."

    def edit_draft(self, placeholder, value):
        if not self.current_draft:
            return "No draft selected. Create or switch to a draft first."
        body = self.drafts[self.current_draft]["Body"]
        if not body or placeholder not in body:
            return f"Placeholder '{placeholder}' not found in draft '{self.current_draft}'."
        self.drafts[self.current_draft]["Body"] = body.replace(placeholder, value)
        return f"Updated draft '{self.current_draft}' with {placeholder} -> {value}"

    def get(self, field):
        if not self.current_draft:
            return None
        return self.drafts[self.current_draft].get(field)

    def get_current_draft_name(self):
        return self.current_draft or "None"
    
email_draft_store = EmailDraftStore(user_gmail="saikarthikbattula@gmail.com")

def getCreds():
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_FILE, SCOPES)
            creds = flow.run_local_server()
        with open('token.json', "w") as token:
            token.write(creds.to_json())
    return creds

creds = getCreds()

@tool
def create_draft(draft_name: str):
    """Create a new draft and switch to it."""
    return email_draft_store.create_draft(draft_name)

@tool
def switch_draft(draft_name: str):
    """Switch to an existing draft."""
    return email_draft_store.switch_draft(draft_name)

@tool
def save_draft(subject: str, body: str):
    """Save or update the current email draft."""
    return email_draft_store.save_draft(subject, body)

@tool
def set_recipients(recipients: str):
    """Set the recipients for the draft."""
    return email_draft_store.set_recipients(recipients)

@tool
def edit_draft(placeholder: str, value: str):
    """
    Replace a placeholder in the current draft body with a user-provided value.

    Args:
        placeholder (str): The placeholder text in the email body to replace, e.g. "{name}"
        value (str): The replacement value, e.g. "Alice"
    
    Returns:
        str: A message confirming the replacement or an error if the placeholder is not found.
    """
    
    return email_draft_store.edit_draft(placeholder, value)

@tool
def show_draft():
    """Show current draft details."""
    current = email_draft_store.get_current_draft_name()
    if current == "None":
        return "No draft selected."
    to = email_draft_store.get('To') or "None"
    subject = email_draft_store.get('Subject') or "None"
    body = email_draft_store.get('Body') or "None"
    return f"Draft: {current}\nTo: {to}\nSubject: {subject}\nBody: {body}"

@tool
def send_email():
    """Send the current email draft."""
    required_fields = ["Subject", "Body", "From", "To"]
    for field in required_fields:
        if not email_draft_store.get(field):
            raise ValueError(f"Missing required field: {field}")
    try:
        service_gmail = build('gmail','v1',credentials=creds)
        message = EmailMessage()
        message.set_content(email_draft_store.get("Body"))
        message["To"] = email_draft_store.get("To")
        message["From"] = email_draft_store.get("From")
        message["Subject"] = email_draft_store.get("Subject")
        encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
        send_message = {"raw": encoded_message}
        send_message = service_gmail.users().messages().send(userId="me", body=send_message).execute()
        return f"Email sent from draft '{email_draft_store.get_current_draft_name()}'"
    except HttpError as error:
        return f"An error occurred: {error}"
    except ValueError as error:
        return "RUN IT BACK!"

tools = [create_draft, switch_draft, save_draft, set_recipients, edit_draft, show_draft, send_email]

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash").bind_tools(tools)

def build_prompt(query):
    docs = retriever.invoke(query)
    context = "\n".join(f"Email: {doc.metadata['email']}, Content: {doc.page_content}" for doc in docs)
    
    current_draft = email_draft_store.get_current_draft_name()
    subject = email_draft_store.get("Subject") or "None"
    body = email_draft_store.get("Body") or "None"
    recipients = email_draft_store.get("To") or "None"
    
    system_message = (
        f"You are an AI cold email assistant.\n\n"
        f"Current draft: {current_draft}\n"
        f"📌 Context from email descriptions:\n{context}\n\n"
        f"Current Draft Content:\n"
        f"Subject: {subject}\n"
        f"Body: {body}\n"
        f"Recipients: {recipients}\n\n"
        "Workflow:\n"
        "1️⃣ Create or switch drafts using `create_draft()` or `switch_draft()`.\n"
        "2️⃣ Save or edit the current draft using `save_draft()` or `edit_draft()`.\n"
        "3️⃣ Set recipients with `set_recipients()`. If the user describes a recipient (e.g., 'a beginner coder who learns fast'), use the retriever context to find the best match and extract their email.\n"
        "    - Only call `set_recipients()` if the match is confident.\n"
        "    - If not confident, ask the user for clarification or the actual email.\n"
        "    - When setting recipients, you may use multiple emails if multiple matches are found. Use `set_recipients()` with comma-separated emails. Extract emails only, not names or extra text.\n"
        "4️⃣ Send the current draft using `send_email()` — only when the user explicitly says something like 'send the email', 'I'm ready to send', etc.\n"
        "5️⃣ Show current draft anytime with `show_draft()`.\n"
        "⚠️ Do NOT overwrite or delete existing drafts unless the user clearly asks.\n"
        "⚠️ Do NOT send the email just because user asked to 'show draft'. Showing and sending are separate actions.\n"
        "✅ Always ensure subject and body are not 'None' before sending or saving.\n"
    )

    return ChatPromptTemplate.from_messages([
        ("system", system_message),
        ("human", "{query}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])

# Define a request body model for chat
class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        prompt = build_prompt(request.message)
        agent = create_tool_calling_agent(llm, tools=tools, prompt=prompt)
        agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=False)
        response = agent_executor.invoke({"query": request.message})
        return {"response": response["output"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
