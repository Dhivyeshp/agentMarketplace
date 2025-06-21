import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
import pandas as pd
from dotenv import load_dotenv

load_dotenv()
df = pd.read_csv("emails.csv")
embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-exp-03-07", task_type="RETRIEVAL_DOCUMENT")

db_location ="./chrome_langchain_db"
add_documents = not os.path.exists(db_location)

if add_documents:
    documents = []
    ids = []
    
    for i, row in df.iterrows():
        document = Document(
            page_content =  row["Description"],
            metadata = {
                "email": row["Email"]
            },
           id = str(i)
        )
    ids.append(str(i))
    documents.append(document)
    
vector_store = Chroma(
    collection_name="Emails",
    persist_directory=db_location,
    embedding_function=embeddings
)

if add_documents:
    vector_store.add_documents(documents=documents, ids=ids)
    
retriever = vector_store.as_retriever(
    search_kwargs={"k": 5}
)