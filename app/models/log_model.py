# app/models/log_model.py
from pydantic import BaseModel

class Log(BaseModel):
    src_ip: str
    dst_ip: str
    protocol: str
    packet_size: int
    duration: float