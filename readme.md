# 🛡️ AI SOC Analyst

AI-powered Security Operations Center (SOC) platform that detects anomalous network activity using Machine Learning, analyzes threats using LLMs, and automates incident response workflows using FastAPI and n8n.

---

## 🚀 Features

* 🔍 Real-time anomaly detection using Isolation Forest
* 🤖 AI threat analysis using LLMs
* ⚡ Automated incident response workflows with n8n
* 📩 Gmail alert escalation for critical threats
* 🗄️ SQLite database for alert storage
* 📊 Alerts API for dashboard integration
* 🔐 SOC-inspired cybersecurity architecture

---

## 🏗️ Architecture

```text
Incoming Logs
   ↓
ML Anomaly Detection
   ↓
AI Threat Analysis
   ↓
FastAPI Backend
   ↓
n8n Webhook Automation
   ↓
Risk Decision Engine
   ↓
Email Alert / Response Action
```

---

## 🧠 Tech Stack

### Backend

* FastAPI
* Python
* SQLAlchemy
* SQLite

### AI / ML

* Scikit-learn
* Isolation Forest
* OpenAI API

### Automation

* n8n
* Gmail API

### Frontend (Planned / Optional)

* React
* Tailwind CSS

---

## 📂 Project Structure

```text
app/
├── main.py
├── database.py
├── routes/
├── models/
└── services/

ml/
frontend/
```

---

## ⚙️ Installation

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## 🔐 Environment Variables

Create a `.env` file in the root folder:

```env
OPENAI_API_KEY=your_openai_api_key
```

---

## 📡 API Endpoints

### POST `/log`

Send a network log for anomaly detection and AI threat analysis.

#### Example Request

```json
{
  "src_ip": "192.168.1.1",
  "dst_ip": "10.0.0.5",
  "protocol": "TCP",
  "packet_size": 5000,
  "duration": 15
}
```

---

### GET `/alerts`

Fetch all stored security alerts.

---

## 📩 Example Alert Output

```json
{
  "src_ip": "192.168.1.1",
  "risk": "High",
  "attack_type": "Possible DDoS",
  "reason": "Large packet size and abnormal session duration",
  "action": "Block IP and notify admin"
}
```

---

## 🎯 Future Improvements

* 📊 Live React SOC Dashboard
* 💬 Slack / Teams Alerts
* 🐘 PostgreSQL Migration
* 🐳 Docker Deployment
* 🔥 Real Firewall API Integration
* 📈 Threat Analytics Charts

---

## 👨‍💻 Author

Built by Kartavya

---

## 📜 License

MIT License
