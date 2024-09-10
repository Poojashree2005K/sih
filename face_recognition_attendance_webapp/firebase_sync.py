# firebase_sync.py
import firebase_admin
from firebase_admin import credentials, firestore
import sqlite3

# Initialize Firebase
cred = credentials.Certificate('E:\\new pro\\frattendance-system-firebase-adminsdk-p614x-078102d1bc.json')

# Path to your Firebase service account key
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

# Function to upload attendance data to Firebase
def upload_attendance():
    conn = sqlite3.connect('attendance.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM ATTENDANCE')
    rows = cursor.fetchall()
    conn.close()

    for row in rows:
        doc_ref = db.collection('attendance').document(str(row[0]))  # Using ID from SQLite as Firestore document ID
        doc_ref.set({
            'name': row[1],
            'time': row[2],
            'date': row[3],
            'hash': row[4]
        })
    print("Attendance data uploaded to Firebase successfully.")
