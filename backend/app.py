from services.ai_service import (
    ask_ai,
    ask_contract_question,
    rewrite_clause
)
from services.contract_generator import generate_contract
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
        "summary": summary,
        "contract_text":text
    })
@app.route("/generate", methods=["POST"])
def generate():
    data = request.json

    contract = generate_contract(data)

    return jsonify({
        "contract": contract
    })


@app.route("/test-ai")
def test_ai():

    response = ask_ai("This is a simple employment contract between ABC Pvt ltd and John Doe for a period of 1 year.")

    return jsonify({
        "response": response
    })
@app.route("/chat", methods=["POST"])
def chat_with_contract():

    data = request.get_json()

    contract_text = data.get("contract_text", "")
    question = data.get("question", "")

    if not contract_text or not question:
        return jsonify({
            "error": "Contract text and question are required."
        }), 400

    answer = ask_contract_question(contract_text, question)

    return jsonify({
        "answer": answer
    })
@app.route("/rewrite-clause", methods=["POST"])
def rewrite_contract_clause():

    data = request.get_json()

    original_clause = data.get("original_clause", "")

    if not original_clause:
        return jsonify({
            "error": "Original clause is required."
        }), 400

    rewritten_clause = rewrite_clause(original_clause)

    return jsonify({
        "rewritten_clause": rewritten_clause
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)