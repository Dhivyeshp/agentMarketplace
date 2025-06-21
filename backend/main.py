from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Dict
from passlib.context import CryptContext
from domains import get_domain_agent_executor
from cold_email import get_cold_email_agent_executor
from typing import List, Literal


app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
fake_db: Dict[str, dict] = {}

# Auth models
class UserSignup(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Auth logic
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
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    return {"message": "Login successful"}

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        agent_executor = get_cold_email_agent_executor(request.message)
        response = agent_executor.invoke({"query": request.message})
        return {"response": response["output"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str

class DomainChatRequest(BaseModel):
    messages: List[Message]

@app.post("/api/domain")
async def domain_endpoint(request: DomainChatRequest):
    try:
        agent_executor = get_domain_agent_executor()

        # Flatten chat messages into single input string
        full_chat = "\n".join(f"{m.role}: {m.content}" for m in request.messages)

        response = agent_executor.invoke({"input": full_chat})
        return {"reply": response["output"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

