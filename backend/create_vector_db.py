from pypdf import PdfReader
import os

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

documents = []

# Read all PDFs
for file in os.listdir("data"):
    if file.endswith(".pdf"):

        print(f"Processing: {file}")

        reader = PdfReader(f"data/{file}")

        text = ""

        for page in reader.pages:
            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

        documents.append(
            Document(
                page_content=text,
                metadata={"source": file}
            )
        )

print(f"\nTotal PDFs Loaded: {len(documents)}")


# Split into chunks
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100
)

split_docs = splitter.split_documents(documents)

print(f"Total Chunks Created: {len(split_docs)}")


# Embedding model
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


# Create FAISS index
vectorstore = FAISS.from_documents(
    split_docs,
    embeddings
)


# Save locally
vectorstore.save_local("vectorstore")

print("\nFAISS Vector Database Created Successfully!")