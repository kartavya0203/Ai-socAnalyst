# app/services/processor.py

import pandas as pd

def preprocess_log(log):
    return pd.DataFrame([{
        "packet_size": log.packet_size,
        "duration": log.duration
    }])