import os
import io
import fitz  # PyMuPDF
from docx import Document
from PIL import Image
import pytesseract

SUPPORTED_EXTENSIONS = (".pdf", ".docx", ".png", ".jpg", ".jpeg")

MIN_TEXT_LENGTH = 20


def _ocr_image(image):
    return pytesseract.image_to_string(image)


def extract_text_from_pdf(filepath):
    doc = fitz.open(filepath)
    pages = []

    for page in doc:
        page_text = page.get_text().strip()

        if len(page_text) < MIN_TEXT_LENGTH:
            pixmap = page.get_pixmap(dpi=300)
            image = Image.open(io.BytesIO(pixmap.tobytes("png")))
            page_text = _ocr_image(image).strip()

        pages.append(page_text)

    doc.close()
    return "\n".join(pages)


def extract_text_from_docx(filepath):
    document = Document(filepath)
    return "\n".join(p.text for p in document.paragraphs if p.text.strip())


def extract_text_from_image(filepath):
    image = Image.open(filepath)
    return _ocr_image(image).strip()


def extract_text(filepath, filename):
    ext = os.path.splitext(filename)[1].lower()

    if ext == ".pdf":
        return extract_text_from_pdf(filepath)
    if ext == ".docx":
        return extract_text_from_docx(filepath)
    if ext in (".png", ".jpg", ".jpeg"):
        return extract_text_from_image(filepath)

    raise ValueError(f"Unsupported file type: {ext}")
