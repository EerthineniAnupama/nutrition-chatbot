import os

from dotenv import load_dotenv

from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

import google.generativeai as genai

load_dotenv()

# Configure Gemini
genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")

# Load Embeddings
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Load Vector DB
vectorstore = FAISS.load_local(
    "vectorstore",
    embeddings,
    allow_dangerous_deserialization=True
)

while True:

    query = input("\nAsk a question (type exit to quit): ")

    if query.lower() in ["exit", "quit", "done"]:
        break

    # Retrieve documents
    docs = vectorstore.similarity_search(
        query,
        k=3
    )

    context = "\n\n".join(
        [doc.page_content for doc in docs]
    )

    prompt = f"""
You are a nutrition assistant.

Answer only using the provided context.

Context:
{context}

Question:
{query}

If the answer is not present in the context,
say that the information is unavailable.
"""

    response = model.generate_content(prompt)

    print("\nAnswer:\n")
    print(response.text)

    print("\nSources:")
    for doc in docs:
        print("-", doc.metadata["source"])