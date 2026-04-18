# app/services/ml_service.py

from ml.model import AnomalyDetector

detector = AnomalyDetector()
detector.load()

def predict_log(dataframe):
    result = detector.predict(dataframe)
    return "anomaly" if result[0] == -1 else "normal"