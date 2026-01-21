from ultralytics import YOLO

model = YOLO("yolov8n.pt")
results = model("test.jpg", conf=0.4)

for r in results:
    print(r.names)
    print(r.boxes.cls)
