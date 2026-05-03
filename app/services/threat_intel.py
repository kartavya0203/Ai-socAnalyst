import ipaddress
import time
import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("ABUSEIPDB_API_KEY")

THREAT_CACHE = {}
CACHE_TTL = 60 * 60  # 1 hour


def is_private_ip(ip: str) -> bool:
    try:
        return ipaddress.ip_address(ip).is_private
    except ValueError:
        return True


def get_cached(ip: str):
    entry = THREAT_CACHE.get(ip)

    if not entry:
        return None

    if time.time() - entry["timestamp"] > CACHE_TTL:
        del THREAT_CACHE[ip]
        return None

    return entry["data"]


def set_cache(ip: str, data: dict):
    THREAT_CACHE[ip] = {
        "data": data,
        "timestamp": time.time()
    }


def fetch_abuseipdb(ip: str):
    try:
        url = "https://api.abuseipdb.com/api/v2/check"

        headers = {
            "Key": API_KEY,
            "Accept": "application/json"
        }

        params = {
            "ipAddress": ip,
            "maxAgeInDays": 90
        }

        res = requests.get(url, headers=headers, params=params, timeout=5)
        data = res.json()["data"]

        return {
            "country": data["countryCode"],
            "isp": data["isp"],
            "abuse_score": data["abuseConfidenceScore"],
            "usage_type": data["usageType"]
        }

    except Exception:
        return {
            "country": "Unknown",
            "isp": "Unknown",
            "abuse_score": 0,
            "usage_type": "Unknown"
        }


def get_threat_intel(ip: str, confidence: int):
    cached = get_cached(ip)
    if cached:
        return {**cached, "cached": True}

    private = is_private_ip(ip)

    # Base response
    result = {
        "ip": ip,
        "is_private": private,
        "country": "Local Network" if private else "Unknown",
        "isp": "Local" if private else "Unknown",
        "abuse_score": 0,
        "usage_type": "Unknown"
    }

    # Only call API if needed
    if not private and confidence >= 60:
        api_data = fetch_abuseipdb(ip)
        result.update(api_data)

    set_cache(ip, result)

    return {**result, "cached": False}