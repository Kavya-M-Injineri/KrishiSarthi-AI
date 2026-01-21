import os
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import models, transforms
from PIL import Image
from torch.utils.data import Dataset, DataLoader

CSV_PATH = "D:/Eco-Themed Farming Platform/training/soil_regression_data.csv"
SAVE_PATH = "D:/Eco-Themed Farming Platform/backend/models/soil/npk_reg.pth"
IMG_DIR = "D:/Eco-Themed Farming Platform/training/soil_dataset"
BATCH_SIZE = 8
EPOCHS = 8
LR = 1e-4

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

COLOR_CATS = ["brown","light-brown","red","yellow","black","gray"]
IMG_SIZE = 224

transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
])

class SoilRegressionDataset(Dataset):
    def __init__(self):
        self.df = pd.read_csv(CSV_PATH)

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        row = self.df.iloc[idx]
        img_path = os.path.join(IMG_DIR, row["image"])
        img = Image.open(img_path).convert("RGB")
        img = transform(img)

        ph = torch.tensor([row["ph"]], dtype=torch.float32)
        color_idx = COLOR_CATS.index(row["color"])
        targets = torch.tensor([
            row["N"], row["P"], row["K"],
            row["moisture"], row["organic_matter"]
        ], dtype=torch.float32)
        return img, ph, color_idx, targets

dataset = SoilRegressionDataset()
loader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True)

# Backbone
eff = models.efficientnet_b0(pretrained=True)
class FeatureExtractor(nn.Module):
    def __init__(self, eff):
        super().__init__()
        self.features = eff.features
        self.pool = nn.AdaptiveAvgPool2d(1)

    def forward(self, x):
        x = self.features(x)
        x = self.pool(x)
        return torch.flatten(x, 1)

backbone = FeatureExtractor(eff).to(device)

# Regressor
color_emb = nn.Embedding(len(COLOR_CATS), 8)
regressor = nn.Sequential(
    nn.Linear(1280+1+8, 512),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(512, 128),
    nn.ReLU(),
    nn.Linear(128, 5)
)

color_emb = color_emb.to(device)
regressor = regressor.to(device)

criterion = nn.MSELoss()
optimizer = optim.Adam(list(backbone.parameters()) + 
                       list(color_emb.parameters()) + 
                       list(regressor.parameters()), lr=LR)

print("Training NPK regressor...")

for epoch in range(EPOCHS):
    total_loss = 0
    for img, ph, color_idx, target in loader:
        img = img.to(device)
        ph = ph.to(device)
        color_idx = color_idx.to(device)
        target = target.to(device)

        feat = backbone(img)
        color_vec = color_emb(color_idx)
        x = torch.cat([feat, ph, color_vec], dim=1)

        out = regressor(x)
        loss = criterion(out, target)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    print(f"Epoch {epoch+1}/{EPOCHS} - Loss: {total_loss:.4f}")

torch.save({
    "regressor": regressor.state_dict(),
    "embedding": color_emb.state_dict()
}, SAVE_PATH)

print(f"Saved regressor model → {SAVE_PATH}")
