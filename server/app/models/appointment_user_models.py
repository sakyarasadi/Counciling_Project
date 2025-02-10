from firebase_admin import firestore
from bson.objectid import ObjectId
from flask import g

def get_db():
    """
    Configuration method to return Firestore db instance
    """
    if 'db' not in g:
        g.db = firestore.client()
    return g.db

class Appointment:
    @staticmethod
    def save_appointment(appointment_data):
        db = get_db()
        appointment_collection = db.collection('Appointments')

        appointment = {
            "user_fullname": appointment_data["userFullname"],
            "user_email": appointment_data["userEmail"],
            "counselor_fullname": appointment_data["counselorFullname"],
            "counselor_email": appointment_data["counselorEmail"],
            "date": appointment_data["date"],
            "status": appointment_data["status"]
        }

        appointment_collection.add(appointment)
        return {"success": True, "message": "Appointment saved successfully"}

def get_appointments_by_user_email(email):
    db = get_db()
    appointments_ref = db.collection('Appointments')
    query = appointments_ref.where('user_email', '==', email).stream()
    
    appointments = []
    for doc in query:
        appointment = doc.to_dict()
        appointment['id'] = doc.id  # Add document ID for further reference
        appointments.append(appointment)
    
    return appointments
