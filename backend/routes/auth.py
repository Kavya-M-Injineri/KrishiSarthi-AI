from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db.config import get_db

auth = Blueprint('auth', __name__)

@auth.post("/register")
def register():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")
    location = data.get("location")

    if not email or not password or not name:
        return jsonify({"error": "Missing fields"}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    # Check if email exists
    cursor.execute("SELECT * FROM farmers WHERE email=%s", (email,))
    existing = cursor.fetchone()
    if existing:
        return jsonify({"error": "Email already exists"}), 409

    hashed_pw = generate_password_hash(password)

    cursor.execute("""
        INSERT INTO farmers (name, email, password_hash, phone, location)
        VALUES (%s, %s, %s, %s, %s)
    """, (name, email, hashed_pw, phone, location))

    db.commit()

    return jsonify({"message": "Farmer registered successfully!"}), 201



@auth.post("/login")
def login():
    data = request.json
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM farmers WHERE email=%s", (data["email"],))
    farmer = cursor.fetchone()

    if farmer and check_password_hash(farmer["password_hash"], data["password"]):
        return jsonify({"authenticated": True, "farmer_id": farmer["id"]}), 200

    return jsonify({"authenticated": False}), 401
