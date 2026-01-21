import os
import tempfile
from flask import Blueprint, request, jsonify
from ultralytics import YOLO

wildlife_bp = Blueprint("wildlife", __name__)

# Load YOLOv8 COCO model (animals included)
MODEL_PATH = "yolov8n.pt"   # auto-downloads if not present
model = YOLO(MODEL_PATH)

# Animal threat mapping
THREAT_MAP = {
    "elephant": "High",
    "bear": "High",
    "zebra": "Medium",
    "cow": "Low",
    "dog": "Low",
    "horse": "Low",
    "sheep": "Low",
    "cat": "Low",
    "bird": "Low",
    "deer": "High"
}

@wildlife_bp.route("/wildlife/detect", methods=["POST"])
def detect_wildlife():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]

    # Save image temporarily
    temp_dir = tempfile.mkdtemp()
    img_path = os.path.join(temp_dir, file.filename)
    file.save(img_path)

    # Run YOLO
    results = model(img_path, conf=0.4)[0]

    animals = []
    for box in results.boxes:
        cls_id = int(box.cls[0])
        label = model.names[cls_id]
        conf = float(box.conf[0]) * 100

        animals.append({
            "name": label,
            "confidence": round(conf, 2)
        })

    if not animals:
        return jsonify({
            "message": "No wildlife detected",
            "animals": [],
            "threatLevel": "None"
        })

    # Count animals
    animal_names = [a["name"] for a in animals]
    main_animal = max(set(animal_names), key=animal_names.count)
    count = animal_names.count(main_animal)

    threat = THREAT_MAP.get(main_animal, "Medium")
    if count > 2 and threat != "Low":
        threat = "High"

    response = {
        "animal": main_animal.title(),
        "confidence": max(a["confidence"] for a in animals),
        "count": count,
        "threatLevel": threat,
        "location": "Farm vicinity",
        "time": "Just now",
        "actions": [
            "Install fencing or barriers",
            "Use motion-activated alarms",
            "Avoid night-time crop exposure",
            "Coordinate with nearby farmers"
        ],
        "prevention": [
            "Solar fencing",
            "Noise deterrents",
            "Watch towers",
            "Community monitoring"
        ]
    }

    return jsonify(response)
