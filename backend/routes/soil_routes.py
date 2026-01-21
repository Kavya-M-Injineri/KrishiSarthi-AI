# backend/routes/soil_routes.py
import os
import io
import json
import tempfile
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import torch
import torch.nn as nn
import torchvision.transforms as T
from torchvision import models
from PIL import Image
import numpy as np

soil_bp = Blueprint("soil", __name__)

MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "models", "soil")
CLASS_WEIGHTS_PATH = os.path.join(MODEL_DIR, "soil_class.pth")
REG_WEIGHTS_PATH = os.path.join(MODEL_DIR, "npk_reg.pth")

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Your 7 classes
SOIL_CLASSES = ["Alluvial", "Black", "Loamy", "Red", "Sandy", "Clay", "Laterite"]

SOIL_COLOR_CATS = ["brown", "light-brown", "red", "yellow", "black", "gray"]

IMG_SIZE = 224
transform = T.Compose([
    T.Resize((IMG_SIZE, IMG_SIZE)),
    T.CenterCrop(IMG_SIZE),
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]),
])


def build_backbone_and_heads(num_classes=len(SOIL_CLASSES), feature_dim=1280):
    eff = models.efficientnet_b0(pretrained=True)

    class FeatureExtractor(nn.Module):
        def __init__(self, eff_model):
            super().__init__()
            self.features = eff_model.features
            self.avgpool = nn.AdaptiveAvgPool2d(1)

        def forward(self, x):
            x = self.features(x)
            x = self.avgpool(x)
            return torch.flatten(x, 1)

    backbone = FeatureExtractor(eff)

    classifier = nn.Sequential(
        nn.Linear(feature_dim, 512),
        nn.ReLU(),
        nn.Dropout(0.25),
        nn.Linear(512, num_classes)
    )

    color_emb_dim = 8
    reg_input = feature_dim + 1 + color_emb_dim

    regressor = nn.Sequential(
        nn.Linear(reg_input, 512),
        nn.ReLU(),
        nn.Dropout(0.2),
        nn.Linear(512, 128),
        nn.ReLU(),
        nn.Linear(128, 5)
    )

    color_embedding = nn.Embedding(len(SOIL_COLOR_CATS), color_emb_dim)

    return (backbone.to(DEVICE),
            classifier.to(DEVICE),
            regressor.to(DEVICE),
            color_embedding.to(DEVICE))


BACKBONE, CLASSIFIER, REGRESSOR, COLOR_EMB = build_backbone_and_heads()


def try_load_weights():
    loaded = False
    try:
        if os.path.exists(CLASS_WEIGHTS_PATH):
            CLASSIFIER.load_state_dict(torch.load(CLASS_WEIGHTS_PATH,
                                                  map_location=DEVICE))
            print("Loaded classifier:", CLASS_WEIGHTS_PATH)
            loaded = True
    except Exception as e:
        print("Failed classifier load:", e)

    try:
        if os.path.exists(REG_WEIGHTS_PATH):
            REGRESSOR.load_state_dict(torch.load(REG_WEIGHTS_PATH,
                                                 map_location=DEVICE))
            print("Loaded regressor:", REG_WEIGHTS_PATH)
            loaded = True
    except Exception as e:
        print("Failed regressor load:", e)

    return loaded


WEIGHTS_LOADED = try_load_weights()


def pil_from_file_storage(file):
    return Image.open(io.BytesIO(file.read())).convert("RGB")


def preprocess_image(pil_img):
    return transform(pil_img).unsqueeze(0).to(DEVICE)


def soil_color_to_index(color):
    color = (color or "").lower()
    return SOIL_COLOR_CATS.index(color) if color in SOIL_COLOR_CATS else 0


def heuristic_estimate(pil_img, ph_value, color):
    idx = soil_color_to_index(color)
    defaults = [
        (50, 30, 40),
        (45, 25, 38),
        (30, 20, 30),
        (25, 15, 20),
        (35, 20, 45),
        (40, 22, 35),
    ]
    N, P, K = defaults[idx]

    ph_adj = max(0.0, 1.0 - abs(ph_value - 7.0) * 0.05)
    N, P, K = int(N * ph_adj), int(P * ph_adj), int(K * ph_adj)

    brightness = np.array(pil_img.resize((50, 50))).mean() / 255.0
    moisture = int(30 + (1 - brightness) * 70)
    organic = round(1.5 + brightness * 2.5, 2)

    guess_type = ["Alluvial", "Red", "Sandy", "Black"][idx % 4]

    return {
        "soil_type": guess_type,
        "npk": {"N": N, "P": P, "K": K},
        "moisture": moisture,
        "organic_matter": organic
    }


def run_models_on_image(pil_img, ph_value, color):
    if not WEIGHTS_LOADED:
        return heuristic_estimate(pil_img, ph_value, color)

    x = preprocess_image(pil_img)

    with torch.no_grad():
        feat = BACKBONE(x)

        logits = CLASSIFIER(feat)
        soil_idx = torch.argmax(torch.softmax(logits, dim=1)).item()
        soil_type = SOIL_CLASSES[soil_idx]

        color_idx = torch.tensor([soil_color_to_index(color)], dtype=torch.long, device=DEVICE)
        ph_t = torch.tensor([[ph_value]], dtype=torch.float32, device=DEVICE)
        color_vec = COLOR_EMB(color_idx)

        reg_in = torch.cat([feat, ph_t, color_vec], dim=1)
        N, P, K, moisture, organic = REGRESSOR(reg_in).cpu().numpy()[0]

    return {
        "soil_type": soil_type,
        "npk": {"N": int(N), "P": int(P), "K": int(K)},
        "moisture": int(moisture),
        "organic_matter": float(organic)
    }


def generate_fertilizer_suggestions(npk, soil_type):
    return [{"name": "DAP", "amount": "50 kg/acre"}]


def recommend_crops(soil_type):
    return [{"name": "Wheat", "suitability": 90}]


@soil_bp.route("/soil/analyze", methods=["POST"])
def analyze_soil():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        img_file = request.files["image"]
        ph_raw = request.form.get("ph")
        color = request.form.get("color")

        ph_value = float(ph_raw)

        pil_img = pil_from_file_storage(img_file)

        result = run_models_on_image(pil_img, ph_value, color)

        result.update({
            "fertilizers": generate_fertilizer_suggestions(result["npk"], result["soil_type"]),
            "recommended_crops": recommend_crops(result["soil_type"]),
            "model_loaded": WEIGHTS_LOADED
        })

        return jsonify(result)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": "Server error",
            "detail": str(e)
        }), 500