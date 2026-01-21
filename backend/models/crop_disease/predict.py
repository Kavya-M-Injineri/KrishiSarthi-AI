# backend/models/crop_disease/predict.py
import os
from ultralytics import YOLO
from PIL import Image
import numpy as np

MODEL_PATH = os.path.join(os.path.dirname(__file__), "best.pt")

# Load model once when module is imported
model = YOLO(MODEL_PATH)

# class mapping: depends on how your YOLO model was trained
# if you trained with class names in YAML, model.names will have them.
def predict_image(image_path, conf_threshold=0.25):
    """
    Run YOLO model on image_path.
    Returns a list of detections:
    [ { 'class_id': int, 'label': 'Rust', 'confidence': 0.92, 'box': [x1,y1,x2,y2] }, ... ]
    """
    results = model.predict(source=image_path, conf=conf_threshold, imgsz=640)  # returns Results list

    detections = []
    # results may contain multiple frames; take first
    if len(results) == 0:
        return detections

    r = results[0]
    boxes = r.boxes  # ultralytics Boxes object
    for box in boxes:
        cls = int(box.cls.cpu().numpy()[0])
        conf = float(box.conf.cpu().numpy()[0])
        xyxy = box.xyxy.cpu().numpy()[0].tolist()  # [x1,y1,x2,y2]
        # get label from model.names if available
        label = model.names.get(cls, str(cls)) if hasattr(model, "names") else str(cls)

        detections.append({
            "class_id": cls,
            "label": label,
            "confidence": conf,
            "box": [float(x) for x in xyxy],
        })

    return detections