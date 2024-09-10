from flask import Flask, jsonify, request, render_template
import sqlite3
import face_recognition
import cv2
import numpy as np
from datetime import datetime, date
import hashlib
from firebase_sync import upload_attendance  

app = Flask(__name__)

# Initialize database
def initialize_db():
    conn = sqlite3.connect("attendance.db")
    conn.execute('''
        CREATE TABLE IF NOT EXISTS ATTENDANCE (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            NAME TEXT NOT NULL,
            TIME TEXT NOT NULL,
            DATE TEXT NOT NULL,
            HASH TEXT UNIQUE
        )
    ''')
    conn.close()

initialize_db()

# Generate a hash for attendance record uniqueness
def generate_hash(name, current_date):
    return hashlib.sha256(f"{name}_{current_date}".encode()).hexdigest()

# Endpoint to start the attendance process
@app.route('/start_attendance', methods=['GET'])
def start_attendance():
    # Initialize camera
    video_capture = cv2.VideoCapture(0)

    # Load known faces
    known_face_encodings, known_face_names = load_known_faces()

    # Ensure known faces are loaded
    if not known_face_encodings:
        return jsonify({"error": "No known faces loaded."})

    while True:
        # Capture frame from the camera
        _, frame = video_capture.read()
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Find all face locations and face encodings in the frame
        face_locations = face_recognition.face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)

        if not face_encodings:
            print("No faces detected in the frame.")
            continue  # Continue to the next frame if no faces are detected

        for face_encoding in face_encodings:
            # Compare face encodings with the known faces
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            
            if matches:  # Only proceed if there are matches
                face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
                
                if len(face_distances) > 0:
                    best_match_index = np.argmin(face_distances)

                    if matches[best_match_index]:
                        name = known_face_names[best_match_index]
                        # Mark attendance
                        mark_attendance(name)
                        return jsonify({"message": f"Attendance marked for {name}."})
            else:
                print("No matching faces found in known faces.")

        # Display the frame (optional, for debugging)
        cv2.imshow('Video', frame)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release resources
    video_capture.release()
    cv2.destroyAllWindows()

    return jsonify({"message": "Attendance process finished."})


def load_known_faces():
    known_face_encodings = []
    known_face_names = []

    # Correct paths to the image files
    files = [("Pooja", r"E:\face_recognition_attendance_webapp\ph\251065.jpg"), 
             ("Shek", r"E:\face_recognition_attendance_webapp\ph\251088.jpg"), 
             ("Vishnu", r"E:\face_recognition_attendance_webapp\ph\251116.jpg")]

    for name, file_path in files:
        try:
            image = face_recognition.load_image_file(file_path)
            encoding = face_recognition.face_encodings(image)[0]
            known_face_encodings.append(encoding)
            known_face_names.append(name)
        except Exception as e:
            print(f"Error loading face for {name} from {file_path}: {e}")
    
    return known_face_encodings, known_face_names

def mark_attendance(name):
    conn = sqlite3.connect("attendance.db")
    cur = conn.cursor()
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    current_date = date.today().strftime("%Y-%m-%d")
    record_hash = generate_hash(name, current_date)

    # Check if the user has already been marked present today
    try:
        cur.execute("SELECT * FROM ATTENDANCE WHERE NAME = ? AND DATE = ?", (name, current_date))
        if cur.fetchone():
            print(f"Error: {name}'s attendance has already been marked for today.")
            conn.close()
            return False  # Attendance already marked
        else:
            cur.execute("INSERT INTO ATTENDANCE (NAME, TIME, DATE, HASH) VALUES (?, ?, ?, ?)", (name, current_time, current_date, record_hash))
            conn.commit()
            print(f"Attendance marked for {name} at {current_time}.")
            conn.close()
            return True  # Attendance marked successfully
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        conn.close()
        return False

# Endpoint to view attendance records
@app.route('/view_attendance', methods=['GET'])
def view_attendance():
    conn = sqlite3.connect('attendance.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM ATTENDANCE")
    rows = cursor.fetchall()
    conn.close()

    records = [{"id": row[0], "name": row[1], "time": row[2], "date": row[3]} for row in rows]
    return jsonify({"records": records})

# Home route to serve the HTML page
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/sync_firebase', methods=['GET'])
def sync_firebase():
    try:
        upload_attendance()
        return jsonify({"message": "Attendance data uploaded to Firebase successfully."})
    except Exception as e:
        print(f"Error uploading to Firebase: {e}")
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
