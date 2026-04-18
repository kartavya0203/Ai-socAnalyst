# app/services/ai_service.py

import json
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def analyze_alert(log, prediction):

    prompt = f"""
Return ONLY valid JSON.

{{
  "attack_type": "",
  "reason": "",
  "risk": "Low/Medium/High",
  "action": ""
}}

Log:
Source IP: {log.src_ip}
Destination IP: {log.dst_ip}
Protocol: {log.protocol}
Packet Size: {log.packet_size}
Duration: {log.duration}
Prediction: {prediction}
"""

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    content = response.choices[0].message.content.strip()

    # Remove markdown wrappers if model gives ```json
    content = content.replace("```json", "").replace("```", "").strip()

    return json.loads(content)