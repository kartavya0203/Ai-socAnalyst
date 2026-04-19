import pandas as pd
import joblib

from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler


class AnomalyDetector:
    def __init__(self):
        self.scaler = StandardScaler()

        self.model = IsolationForest(
            n_estimators=200,
            contamination=0.08,
            random_state=42
        )

    def train(self, data: pd.DataFrame):
        scaled = self.scaler.fit_transform(data)
        self.model.fit(scaled)

    def predict(self, data: pd.DataFrame):
        scaled = self.scaler.transform(data)
        return self.model.predict(scaled)

    def score(self, data: pd.DataFrame):
        scaled = self.scaler.transform(data)

        raw_score = self.model.decision_function(scaled)[0]

        confidence = round((1 - raw_score) * 50)

        confidence = max(1, min(99, confidence))

        return confidence

    def save(self, path="ml/anomaly_model.pkl"):
        joblib.dump(
            {
                "model": self.model,
                "scaler": self.scaler
            },
            path
        )

    def load(self, path="ml/anomaly_model.pkl"):
        data = joblib.load(path)
        self.model = data["model"]
        self.scaler = data["scaler"]