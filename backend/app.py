from services.ai_service import (
    ask_ai,
    ask_contract_question,
    rewrite_clause
)
from services.contract_generator import generate_contract
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import fitz  # PyMuPDF
from database import db
from dotenv import load_dotenv
import os
from utils.docx_generator import create_docx
load_dotenv()
from models import User, Contract
from flask_bcrypt import Bcrypt
from datetime import timedelta
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
)

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///accordai.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
bcrypt = Bcrypt(app)
app.config["JWT_SECRET_KEY"] = "accordai-secret-key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=12)


jwt = JWTManager(app)

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
@jwt_required()
def generate_contract_route():

    data = request.json

    user_id = get_jwt_identity()

    contract = generate_contract(data)

    new_contract = Contract(
        user_id=int(user_id),
        contract_type=data.get("contractType", "Unknown"),
        mode="Generated",
        title=f"{data.get('contractType', 'Contract')} - {data.get('clientName', 'Untitled')}",
        content=contract,
    )

    db.session.add(new_contract)
    db.session.commit()

    return jsonify({
        "contract": contract
    })
@app.route("/my-contracts", methods=["GET"])
@jwt_required()
def get_my_contracts():

    user_id = get_jwt_identity()

    contracts = Contract.query.filter_by(user_id=int(user_id)).order_by(
        Contract.created_at.desc()
    ).all()

    contract_list = []

    for contract in contracts:
        contract_list.append({
            "id": contract.id,
            "title": contract.title,
            "contract_type": contract.contract_type,
            "mode": contract.mode,
            "created_at": contract.created_at.strftime("%d %b %Y"),
        })

    return jsonify(contract_list)

@app.route("/contract/<int:contract_id>", methods=["GET"])
@jwt_required()
def get_contract(contract_id):

    user_id = int(get_jwt_identity())

    contract = Contract.query.filter_by(
        id=contract_id,
        user_id=user_id
    ).first()

    if not contract:
        return jsonify({
            "message": "Contract not found"
        }), 404

    return jsonify({
        "id": contract.id,
        "title": contract.title,
        "contract_type": contract.contract_type,
        "mode": contract.mode,
        "content": contract.content,
        "created_at": contract.created_at.strftime("%d %b %Y")
    })

@app.route("/download-docx/<int:contract_id>", methods=["GET"])
@jwt_required()
def download_docx(contract_id):

    user_id = int(get_jwt_identity())

    contract = Contract.query.filter_by(
        id=contract_id,
        user_id=user_id
    ).first()

    if not contract:
        return jsonify({
            "message": "Contract not found"
        }), 404

    output_path = f"generated_contract_{contract.id}.docx"

    create_docx(
        contract.title,
        contract.content,
        output_path
    )

    return send_file(
        output_path,
        as_attachment=True,
        download_name=f"{contract.title}.docx"
    )
@app.route("/download-enhanced-docx", methods=["POST"])
@jwt_required()
def download_enhanced_docx():

    data = request.json

    title = data.get("title", "Enhanced Contract")
    content = data.get("content", "")

    output_path = "enhanced_contract.docx"

    create_docx(title, content, output_path)

    return send_file(
        output_path,
        as_attachment=True,
        download_name=f"{title}.docx"
    )

@app.route("/register", methods=["POST"])
def register():
    data = request.json

    full_name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")

    if not full_name or not email or not password:
        return jsonify({
            "message": "All fields are required"
        }), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({
            "message": "Email already registered"
        }), 409
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    new_user = User(
    full_name=full_name,
    email=email,
    password=hashed_password
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully",
    }),201

@app.route("/login", methods=["POST"])
def login():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "message": "Email and password are required"
        }), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({
            "message": "Invalid email or password"
        }), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({
            "message": "Invalid email or password"
        }), 401
    access_token = create_access_token(identity=str(user.id))

    return jsonify({
    "message": "Login successful",
    "token": access_token,
    "user": {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email
    }
}), 200


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
with app.app_context():
    db.create_all()

with app.app_context():
    contracts = Contract.query.all()

    for contract in contracts:
        print(contract.id, contract.title)

if __name__ == "__main__":
    app.run(debug=True, port=5000)