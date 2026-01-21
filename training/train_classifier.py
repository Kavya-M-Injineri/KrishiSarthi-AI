import os
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader

# Paths
DATA_DIR = r"d:\Eco-Themed Farming Platform\training\soil_dataset"
SAVE_PATH = "D:/Eco-Themed Farming Platform/backend/models/soil/soil_class.pth"


# Hyperparams
BATCH_SIZE = 16
EPOCHS = 10
LR = 1e-4

# Device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)

# Data augmentation + normalization
transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
])

# Load dataset
dataset = datasets.ImageFolder(DATA_DIR, transform=transform)
loader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True)

class_names = dataset.classes
print("Soil Classes:", class_names)

# Load EfficientNet-B0
model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.IMAGENET1K_V1)

# Replace classifier for your soil classes
model.classifier = nn.Sequential(
    nn.Dropout(0.3),
    nn.Linear(1280, len(class_names))
)

model = model.to(device)

criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=LR)

print("Training model...")

for epoch in range(EPOCHS):
    model.train()
    total_loss = 0

    for imgs, labels in loader:
        imgs, labels = imgs.to(device), labels.to(device)

        optimizer.zero_grad()
        out = model(imgs)
        loss = criterion(out, labels)
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    print(f"Epoch {epoch+1}/{EPOCHS} — Loss: {total_loss:.4f}")

# Create folder automatically
os.makedirs(os.path.dirname(SAVE_PATH), exist_ok=True)

# Save model (full model state_dict)
torch.save(model.state_dict(), SAVE_PATH)

print(f"Saved model → {SAVE_PATH}")
