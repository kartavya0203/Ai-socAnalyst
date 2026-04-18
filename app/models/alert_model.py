from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    src_ip = Column(String)
    dst_ip = Column(String)
    protocol = Column(String)
    packet_size = Column(Integer)
    duration = Column(Integer)

    attack_type = Column(String)
    reason = Column(String)
    risk = Column(String)
    action = Column(String)

    created_at = Column(DateTime, default=datetime.utcnow)