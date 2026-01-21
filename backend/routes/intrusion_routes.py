import os
import tempfile
from flask import Blueprint, request, jsonify
from ultralytics import YOLO

intrusion_bp = Blueprint("intrusion", __name__)

# Load model ONCE
model = YOLO("yolov8n.pt")

ANIMAL_CLASSES = {
    "cow", "sheep", "horse", "dog", "cat",
    "elephant", "bear", "zebra", "giraffe",
    "bird", "boar"
}

@intrusion_bp.route("/intrusion/detect", methods=["POST"])
def detect_intrusion():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = request.files["image"]

    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        image.save(tmp.name)
        img_path = tmp.name

    results = model(img_path, conf=0.4)
    os.remove(img_path)

    detected = []
    for r in results:
        for cls_id in r.boxes.cls:
            name = r.names[int(cls_id)]
            if name in ANIMAL_CLASSES:
                detected.append(name)

    if not detected:
        return jsonify({"detected": False})

    return jsonify({
        "detected": True,
        "animal": max(set(detected), key=detected.count),
        "count": len(detected),
        "risk": "High" if len(detected) > 2 else "Medium"
    })
