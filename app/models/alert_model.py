# app/models/alert_model.py

from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base
from sqlalchemy import Boolean



class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)

    src_ip = Column(String)
    dst_ip = Column(String)

    protocol = Column(String)
    packet_size = Column(Integer)
    duration = Column(Integer)

    prediction = Column(String)      # NEW
    confidence = Column(Integer)     # NEW

    attack_type = Column(String)
    reason = Column(String)
    risk = Column(String)
    action = Column(String)
    country = Column(String, default="Unknown")
    isp = Column(String, default="Unknown")
    is_private = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)