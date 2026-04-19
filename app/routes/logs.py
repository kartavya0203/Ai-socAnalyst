# app/routes/logs.py

from fastapi import APIRouter
from app.models.log_model import Log
from app.services.processor import preprocess_log
from app.services.ml_service import predict_log
from app.services.ai_service import analyze_alert
from app.services.automation_service import trigger_automation

from app.database import SessionLocal
from app.models.alert_model import Alert

router = APIRouter()


@router.post("/log")
def receive_log(log: Log):

    # -----------------------------
    # Step 1: Preprocess input log
    # -----------------------------
    processed = preprocess_log(log)

    # -----------------------------
    # Step 2: ML Prediction
    # -----------------------------
    ml_result = predict_log(processed)

    prediction = ml_result["prediction"]
    confidence = ml_result["confidence"]

    ai_analysis = None

    # -----------------------------
    # Step 3: If anomaly detected
    # -----------------------------
    if prediction == "anomaly":

        # Cost optimization:
        # Use OpenAI only for high confidence threats
        if confidence >= 60:
            ai_analysis = analyze_alert(log, prediction)

        # Low confidence anomalies handled locally
        else:
            ai_analysis = {
                "attack_type": "Suspicious Activity",
                "reason": "Anomalous traffic pattern detected by ML engine.",
                "risk": "Medium",
                "action": "Monitor source IP and investigate if repeated."
            }

        # -----------------------------
        # Step 4: Save alert in DB
        # -----------------------------
        db = SessionLocal()

        try:
            new_alert = Alert(
                src_ip=log.src_ip,
                dst_ip=log.dst_ip,

                protocol=log.protocol,
                packet_size=log.packet_size,
                duration=log.duration,

                prediction=prediction,
                confidence=confidence,

                attack_type=ai_analysis["attack_type"],
                reason=ai_analysis["reason"],
                risk=ai_analysis["risk"],
                action=ai_analysis["action"]
            )

            db.add(new_alert)
            db.commit()

        finally:
            db.close()

        # -----------------------------
        # Step 5: Trigger Automation
        # -----------------------------
        trigger_automation(log, ai_analysis)

    # -----------------------------
    # Step 6: API Response
    # -----------------------------
    return {
        "prediction": prediction,
        "confidence": confidence,
        "analysis": ai_analysis
    }


@router.get("/alerts")
def get_alerts():

    db = SessionLocal()

    try:
        alerts = db.query(Alert).all()
        return alerts

    finally:
        db.close()