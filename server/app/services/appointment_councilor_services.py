from app.models.appointment_councilor_models import get_appointments_by_counselor_email, update_appointment

def get_appointments_by_email(email):
    return get_appointments_by_counselor_email(email)

def update_appointment_status(appointment_id, status, meeting_link=None, reject_reason=None):
    success = update_appointment(appointment_id, status, meeting_link, reject_reason)
    if success:
        return {"success": True, "message": "Appointment updated successfully"}
    else:
        return {"success": False, "message": "Failed to update appointment"}

