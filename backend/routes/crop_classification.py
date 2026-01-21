from flask import Blueprint, request, jsonify
from ultralytics import YOLO
import os

crop_classify = Blueprint("crop_classify", __name__)

# Load model once when server starts
model_path = os.path.join("backend","models", "crops_classification", "best.pt")
model = YOLO(model_path)

@crop_classify.route("/classify", methods=["POST"])
def classify_crop():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = request.files["image"]
    image_path = "temp_image.jpg"
    image.save(image_path)

    results = model(image_path)

    # best class index & confidence
    index = results[0].probs.top1
    confidence = float(results[0].probs.top1conf)

    # Map index → label
    label = results[0].names[index]

    return jsonify({
        "label": label,
        "class_id": index,
        "confidence": confidence
    })