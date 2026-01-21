from flask import Blueprint, jsonify, request
from db.config import get_db

farmer_bp = Blueprint('farmer', __name__)

@farmer_bp.route('/farmer/<int:farmer_id>', methods=['GET'])
def get_farmer(farmer_id):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT id, name, email, phone, location FROM farmers WHERE id = %s", (farmer_id,))
    row = cur.fetchone()

    if not row:
        return jsonify({"error": "Farmer not found"}), 404

    data = {
        "id": row[0],
        "name": row[1],
        "email": row[2],
        "phone": row[3],
        "location": row[4]
    }
    return jsonify(data)


@farmer_bp.route('/farmer/<int:farmer_id>', methods=['PUT'])
def update_farmer(farmer_id):
    data = request.json
    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    location = data.get("location")

    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        """
        UPDATE farmers 
        SET name=%s, email=%s, phone=%s, location=%s 
        WHERE id=%s
        """,
        (name, email, phone, location, farmer_id)
    )
    conn.commit()

    return jsonify({"message": "Profile updated successfully"})