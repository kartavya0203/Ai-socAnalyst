import sqlite3

conn = sqlite3.connect("soc.db")
cursor = conn.cursor()

cursor.execute("DELETE FROM alerts")

conn.commit()
conn.close()

print("Alerts table cleaned successfully.")