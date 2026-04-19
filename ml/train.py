import pandas as pd
import random

from model import AnomalyDetector


# --------------------------
# Generate Normal Traffic
# --------------------------
def normal_row():
    protocol = random.choice([1, 2])  # TCP / UDP

    return {
        "packet_size": random.randint(100, 1400),
        "duration": random.randint(1, 5),
        "protocol": protocol,
        "src_external": 0,
        "dst_external": 0,
        "internal_lateral": 1,
        "large_packet": 0,
        "long_duration": 0
    }


# --------------------------
# Create Dataset
# --------------------------
rows = []

for _ in range(5000):
    rows.append(normal_row())

df = pd.DataFrame(rows)


# --------------------------
# Train Model
# --------------------------
detector = AnomalyDetector()

detector.train(df)

detector.save()

print("✅ New anomaly model trained and saved.")
print("Rows used:", len(df))
print("Columns:", list(df.columns))