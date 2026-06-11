from pypdf import PdfReader

pdf_path = "data\EMROPUB_2019_en_23536.pdf"

reader = PdfReader(pdf_path)

text = ""

for page in reader.pages:
    text += page.extract_text()

print(text[:2000])   # first 2000 chars