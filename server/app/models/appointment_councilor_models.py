from firebase_admin import firestore
from bson.objectid import ObjectId  # If still needed for object ID conversion
from flask import g

def get_db():
    """
    Configuration method to return Firestore db instance.
    """
    if 'db' not in g:
        g.db = firestore.client()
    return g.db

def get_appointments_by_counselor_email(email):
    db = get_db()
    appointments_ref = db.collection('Appointments')
    print(f"Querying appointments for email: {email}")  # Debugging log
    query = appointments_ref.where('counselor_email', '==', email).stream()

    appointments = []
    for doc in query:
        appointment = doc.to_dict()
        appointment['id'] = doc.id  
        appointments.append(appointment)
    print(f"Appointments found: {appointments}")  # Debugging log
    return appointments


def update_appointment(appointment_id, status, meeting_link=None, reject_reason=None):
    db = get_db()
    appointment_ref = db.collection('Appointments').document(appointment_id)
    
    update_fields = {"status": status}
    if meeting_link:
        update_fields["meeting_link"] = meeting_link
    if reject_reason:
        update_fields["reject_reason"] = reject_reason

    try:
        appointment_ref.update(update_fields)
        return True
    except Exception as e:
        print(f"Error updating appointment: {e}")
        return False

