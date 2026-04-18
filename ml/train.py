# ml/train.py

import pandas as pd
from model import AnomalyDetector

# Create dummy dataset (you can replace later)
data = pd.DataFrame({
    "packet_size": [100, 200, 150, 3000, 5000],
    "duration": [1, 2, 1.5, 10, 12]
})

detector = AnomalyDetector()
detector.train(data)

detector.save()

print("Model trained and saved")