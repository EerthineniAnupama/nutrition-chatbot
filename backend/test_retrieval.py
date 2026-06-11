from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

# Load embedding model
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Load FAISS DB
vectorstore = FAISS.load_local(
    "vectorstore",
    embeddings,
    allow_dangerous_deserialization=True
)

query = "foods containing vitamin c"

results = vectorstore.similarity_search(
    query,
    k=3
)

for i, doc in enumerate(results, start=1):
    print("\n" + "="*50)
    print(f"RESULT {i}")
    print("="*50)

    print("\nSOURCE:")
    print(doc.metadata["source"])

    print("\nCONTENT:")
    print(doc.page_content[:1000])