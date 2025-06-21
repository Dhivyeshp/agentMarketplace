import requests
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.tools import tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain.memory import ConversationBufferMemory

load_dotenv()

@tool
def check_domain(Names: list[str]) -> list:
    """
    Check the availability of domain names using the GoDaddy API (OTE environment).

    Args:
        Names (list): A list of domain names (strings) to check for availability.
                      Example: ["example.com", "mycoolsite.io"]

    Returns:
        list: A list of dictionaries, each containing a domain name as the key and its availability as the value.
              The value is either:
                - True (available)
                - False (taken)
                - "unknown" if availability can't be determined
                - A string with an error message if an exception occurs

    Example:
        check_domain(["openai.com", "nonexistent12345.io"])
        => [{"openai.com": False}, {"nonexistent12345.io": True}]
    
    Note:
        This function uses the GoDaddy OTE (test) environment and does not perform real domain registrations.
    """
    headers = {
        "Authorization": "sso-key 3mM44Ywf7c9xX2_WXtd2RJ7sLBumEn6oeRFyi:ES45PwsSuXH2s2e4uLgnZH",
        "Accept": "application/json"
    }
    results = []
    for name in Names:
        request_url = f"https://api.ote-godaddy.com/v1/domains/available?domain={name}"
        response = requests.get(request_url, headers=headers)
        try:
            data = response.json()
            results.append({name: data.get("available", "unknown")})
        except Exception as e:
            results.append({name: f"error: {e}"})
    return results

domain_tools = [check_domain]
domain_llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash").bind_tools(domain_tools)
domain_memory = ConversationBufferMemory(memory_key="agent_scratchpad", return_messages=True)


system_message = (
    "You are an AI domain name assistant.\n\n"
    "Before generating any domain name suggestions, first ask the user about their preferences, "
    "including the type of domain extensions they prefer (e.g., .com, .io, .net, .org, etc.).\n"
    "Wait for the user to specify their preferences before proceeding.\n\n"
    "Workflow:\n"
    "1️⃣ Based on the user's preferences and input, generate a list of potential domain names.\n"
    "2️⃣ Use the function `check_domain()` to check if each generated domain name is available.\n"
    "    - Only suggest domain names that are confirmed available.\n"
    "    - Always call `check_domain()` with a list of domain names.\n"
    "    - Do not assume availability — always confirm using the function.\n"
    "    - If the user provides their own domain names, you may also pass those directly to `check_domain()`.\n"
    "3️⃣ Present the available domains clearly to the user.\n"
    "4️⃣ If no domains are available, automatically suggest similar alternatives and re-check their availability.\n"
    "5️⃣ Do NOT register or purchase domains — your role is advisory only.\n"
    "✅ Ensure domain suggestions are relevant, appropriate, and easy to read.\n"
    "⚠️ Do NOT repeat domain checks unnecessarily — only re-check when the list changes or the user requests it.\n"
)


prompt = ChatPromptTemplate.from_messages([
    ("system", system_message),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])


def get_domain_agent_executor():
    agent = create_tool_calling_agent(domain_llm, tools=domain_tools, prompt=prompt)
    return AgentExecutor(agent=agent, tools=domain_tools, verbose=True, memory=domain_memory)