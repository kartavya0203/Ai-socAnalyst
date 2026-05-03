# app/routes/ws.py

from fastapi import APIRouter, WebSocket, WebSocketDisconnect


router = APIRouter(prefix="")

# Track active connections
connections = []


@router.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time alert streaming"""
    await websocket.accept()
    connections.append(websocket)

    try:
        while True:
            # Keep connection alive, discard incoming messages
            await websocket.receive_text()
    except WebSocketDisconnect:
        connections.remove(websocket)


async def broadcast_alert(alert: dict):
    """Broadcast alert to all connected clients"""
    for conn in connections:
        try:
            await conn.send_json(alert)
        except Exception:
            # Silently skip failed connections
            pass
