import requests
import random
import time

URL = "http://127.0.0.1:8000/log"

# -----------------------------
# Normal Traffic
# -----------------------------
def normal_traffic():
    return {
        "src_ip": f"192.168.1.{random.randint(2,254)}",
        "dst_ip": f"10.0.0.{random.randint(2,20)}",
        "protocol": random.choice(["TCP", "UDP"]),
        "packet_size": random.randint(100, 1200),
        "duration": random.randint(1, 5)
    }

# -----------------------------
# Port Scan
# -----------------------------
def port_scan():
    return {
        "src_ip": f"45.67.{random.randint(1,255)}.{random.randint(1,255)}",
        "dst_ip": f"10.0.0.{random.randint(2,20)}",
        "protocol": "TCP",
        "packet_size": random.randint(40, 150),
        "duration": 1
    }

# -----------------------------
# DDoS Attack
# -----------------------------
def ddos():
    return {
        "src_ip": f"103.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}",
        "dst_ip": "10.0.0.5",
        "protocol": "UDP",
        "packet_size": random.randint(3000, 9000),
        "duration": random.randint(10, 25)
    }

# -----------------------------
# Data Exfiltration
# -----------------------------
def exfiltration():
    return {
        "src_ip": f"172.16.{random.randint(1,50)}.{random.randint(1,255)}",
        "dst_ip": "185.199.108.153",
        "protocol": "TCP",
        "packet_size": random.randint(5000, 12000),
        "duration": random.randint(20, 60)
    }

# -----------------------------
# Send Request
# -----------------------------
def send_log(data):
    try:
        res = requests.post(URL, json=data)
        print("Sent:", data, "=>", res.json())
    except Exception as e:
        print("Error:", e)

# -----------------------------
# Main Test Run
# -----------------------------
for i in range(200):

    event = random.choices(
        population=[
            normal_traffic,
            port_scan,
            ddos,
            exfiltration
        ],
        weights=[65, 15, 10, 10],
        k=1
    )[0]

    send_log(event())

    time.sleep(0.4)