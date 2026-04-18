import requests

N8N_WEBHOOK_URL = "http://localhost:5678/webhook/abc43435-2715-4681-a0e0-33b79ea2aef0"

def trigger_automation(log, analysis):
    payload = {
        "src_ip": log.src_ip,
        "dst_ip": log.dst_ip,
        "protocol": log.protocol,
        "packet_size": log.packet_size,
        "duration": log.duration,
        "analysis": analysis
    }

    try:
        response = requests.post(N8N_WEBHOOK_URL, json=payload)
        # app/services/automation_service.py

        print("Status:", response.status_code)
        print("Response:", response.text)
    except Exception as e:
        print("Automation failed:", e)