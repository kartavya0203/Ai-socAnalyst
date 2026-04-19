import pandas as pd
import ipaddress


def is_private_ip(ip):
    try:
        return ipaddress.ip_address(ip).is_private
    except:
        return False


def preprocess_log(log):
    protocol_map = {
        "TCP": 1,
        "UDP": 2,
        "ICMP": 3
    }

    src_private = is_private_ip(log.src_ip)
    dst_private = is_private_ip(log.dst_ip)

    packet_size = log.packet_size
    duration = log.duration

    return pd.DataFrame([{
        "packet_size": packet_size,
        "duration": duration,
        "protocol": protocol_map.get(log.protocol.upper(), 0),

        "src_external": 0 if src_private else 1,
        "dst_external": 0 if dst_private else 1,

        "internal_lateral": 1 if src_private and dst_private else 0,

        "large_packet": 1 if packet_size > 3000 else 0,
        "long_duration": 1 if duration > 15 else 0
    }])