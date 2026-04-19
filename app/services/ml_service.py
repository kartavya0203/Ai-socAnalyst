from ml.model import AnomalyDetector

detector = AnomalyDetector()
detector.load()


def predict_log(dataframe):
    result = detector.predict(dataframe)[0]
    confidence = detector.score(dataframe)

    prediction = "anomaly" if result == -1 else "normal"

    return {
        "prediction": prediction,
        "confidence": confidence
    }