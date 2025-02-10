from app.models.appointment_user_models import Appointment as AppointmentModel
from app.models.appointment_user_models import get_appointments_by_user_email

class Appointment:
    @staticmethod
    def save_appointment(appointment_data):
        return AppointmentModel.save_appointment(appointment_data)

def get_appointments_by_email(email):
    return get_appointments_by_user_email(email)
