import os

from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv

from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables
load_dotenv()


# Configure Gemini
genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")


# Load embeddings model
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


# Load FAISS vector database
vectorstore = FAISS.load_local(
    "vectorstore",
    embeddings,
    allow_dangerous_deserialization=True
)


# FastAPI app



# Request model
class Question(BaseModel):
    question: str


# Health check route
@app.get("/")
def home():
    return {
        "message": "Nutrition Chatbot Backend Running"
    }


# Chat endpoint
@app.post("/chat")
def chat(data: Question):

    try:
        # Retrieve relevant chunks
        docs = vectorstore.similarity_search(
            data.question,
            k=3
        )

        # Build context
        context = "\n\n".join(
            [doc.page_content for doc in docs]
        )

        # Prompt
        prompt = f"""
You are a helpful nutrition assistant.

Answer ONLY using the provided context.

Context:
{context}

Question:
{data.question}

If the answer is not available in the context,
say:
"I could not find that information in my nutrition knowledge base."
"""

        # Gemini response
        response = model.generate_content(prompt)

        return {
            "answer": response.text,
            "sources": [
                doc.metadata.get("source", "Unknown")
                for doc in docs
            ]
        }

    except Exception as e:
        return {
            "error": str(e)
        }