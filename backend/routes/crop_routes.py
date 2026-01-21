# backend/routes/crop_routes.py
import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from models.crop_disease.predict import predict_image
from db import get_db
from datetime import datetime

crop = Blueprint("crop", __name__)

# configure upload folder
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXT = {"png", "jpg", "jpeg", "bmp", "webp"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXT

@crop.post("/scan-crop")
def scan_crop():
    """
    Expects multipart/form-data with:
      - image: the uploaded file
      - farmer_id (optional): to link to DB
    Returns JSON with detections array and saved image path.
    """
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Unsupported file type"}), 400

    filename = secure_filename(f"{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{file.filename}")
    save_path = os.path.join(UPLOAD_DIR, filename)
    file.save(save_path)

    # Run model prediction
    try:
        detections = predict_image(save_path, conf_threshold=0.30)
    except Exception as e:
        current_app.logger.exception("Model prediction failed")
        return jsonify({"error": "Model prediction failed", "detail": str(e)}), 500

    # Optionally store scan in DB if farmer_id provided
    farmer_id = request.form.get("farmer_id") or request.form.get("farmerId") or request.form.get("farmer")
    try:
        if farmer_id:
            db = get_db()
            cursor = db.cursor()
            # For simplicity store top label (highest confidence) if exists
            top_label = detections[0]["label"] if detections else None
            top_conf = detections[0]["confidence"] if detections else None

            cursor.execute(
                "INSERT INTO crop_scans (farmer_id, image_path, crop_type, disease, confidence) VALUES (%s, %s, %s, %s, %s)",
                (farmer_id, save_path, None, top_label, float(top_conf) if top_conf else None),
            )
            db.commit()
            cursor.close()
    except Exception as e:
        current_app.logger.exception("DB insert failed")
        # do not fail entire request; return detection but warn
        return jsonify({"warning": "DB insert failed", "detail": str(e), "detections": detections}), 200

    return jsonify({"image": save_path, "detections": detections}), 200