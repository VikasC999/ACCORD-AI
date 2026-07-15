from services.ai_service import ask_ai
from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF

from dotenv import load_dotenv
import os
load_dotenv()


app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/")
def home():
    return {"message": "AccordAI Backend is Running 🚀"}


@app.route("/health")
def health():
    return {"status": "OK"}


@app.route("/upload", methods=["POST"])
def upload_pdf():

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    doc = fitz.open(filepath)

    text = ""

    for page in doc:
        text += page.get_text()

    doc.close()

    summary = ask_ai(text)

    return jsonify({
        "filename": file.filename,
        "summary": summary
    })


@app.route("/test-ai")
def test_ai():

    response = ask_ai("This is a simple employment contract between ABC Pvt ltd and John Doe for a period of 1 year.")

    return jsonify({
        "response": response
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)