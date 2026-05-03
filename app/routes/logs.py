# app/routes/logs.py

import asyncio
from fastapi import APIRouter
from app.models.log_model import Log
from app.services.processor import preprocess_log
from app.services.ml_service import predict_log
from app.services.ai_service import analyze_alert
from app.services.automation_service import trigger_automation

from app.database import SessionLocal
from app.models.alert_model import Alert
# from app.services.threat_intel import get_basic_intel
from app.services.threat_intel import get_threat_intel
from app.routes.ws import broadcast_alert

router = APIRouter()


@router.post("/log")
async def receive_log(log: Log):

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
        # Get basic threat intel (cost-effective)
        intel = get_threat_intel(log.src_ip, confidence)
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
            action=ai_analysis["action"],

            # NEW
            country=intel["country"],
            isp=intel["isp"],
            is_private=intel["is_private"],
        )

            db.add(new_alert)
            db.commit()

            # Broadcast alert to all connected WebSocket clients
            try:
                asyncio.create_task(broadcast_alert({
                "id": new_alert.id,
                "src_ip": new_alert.src_ip,
                "dst_ip": new_alert.dst_ip,
                "protocol": new_alert.protocol,
                "packet_size": new_alert.packet_size,
                "duration": new_alert.duration,
                "confidence": new_alert.confidence,
                "risk": new_alert.risk,
                "attack_type": new_alert.attack_type,
                "reason": new_alert.reason,
                "action": new_alert.action,
                "country": new_alert.country,
                "isp": new_alert.isp,
                "is_private": new_alert.is_private,
                "prediction": new_alert.prediction,
                "created_at": new_alert.created_at.isoformat() if new_alert.created_at else None,
            }))
            except Exception as e:
                print(f"WebSocket broadcast failed: {e}")

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