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

    processed = preprocess_log(log)
    prediction = predict_log(processed)

    ai_analysis = None

    if prediction == "anomaly":

        ai_analysis = analyze_alert(log, prediction)

        db = SessionLocal()

        new_alert = Alert(
            src_ip=log.src_ip,
            dst_ip=log.dst_ip,
            protocol=log.protocol,
            packet_size=log.packet_size,
            duration=log.duration,
            attack_type=ai_analysis["attack_type"],
            reason=ai_analysis["reason"],
            risk=ai_analysis["risk"],
            action=ai_analysis["action"]
        )

        db.add(new_alert)
        db.commit()
        db.close()

        trigger_automation(log, ai_analysis)

    return {
        "prediction": prediction,
        "analysis": ai_analysis
    }

@router.get("/alerts")
def get_alerts():

    db = SessionLocal()
    alerts = db.query(Alert).all()
    db.close()

    return alerts