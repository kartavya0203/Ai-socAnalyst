# ml/model.py

import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib

class AnomalyDetector:
    def __init__(self):
        self.model = IsolationForest(contamination=0.1)

    def train(self, data: pd.DataFrame):
        self.model.fit(data)

    def predict(self, data: pd.DataFrame):
        return self.model.predict(data)

    def save(self, path="ml/anomaly_model.pkl"):
        joblib.dump(self.model, path)

    def load(self, path="ml/anomaly_model.pkl"):
        self.model = joblib.load(path)