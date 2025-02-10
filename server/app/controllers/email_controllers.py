# from flask import Blueprint, request, jsonify
# from app.services.email_services import send_email, schedule_email

# appointment_emailCoun_bp = Blueprint('appointment_email', __name__)

# @appointment_emailCoun_bp.route('/sendAppointmentEmail', methods=['POST'])
# def send_appointment_email():
#     data = request.json
#     print("Received request data:", data)  # Debugging: Print received data
    
#     date = data.get('date')
#     counselor_email = data.get('counselor_email')
#     counselor_name = data.get('counselor_fullname')
#     user_name = data.get('user_fullname')
#     user_email = data.get('user_email')

#     print(f"Sending appointment email to {counselor_email} and {user_email}...")  # Debugging
    
#     try:
#         # Send immediate emails
#         print("Sending immediate email to user...")  # Debugging
#         send_email(user_email, "Appointment Confirmation", 
#                    f"Your appointment is on {date} with {counselor_name}.")
        
#         print("Sending immediate email to counselor...")  # Debugging
#         send_email(counselor_email, "New Appointment", 
#                    f"You have an appointment with {user_name} on {date}.")

#         # Schedule reminder emails (1 day before the appointment)
#         print("Scheduling reminder email for counselor...")  # Debugging
#         schedule_email(date, counselor_email, "Appointment Reminder", 
#                        f"You have an appointment with {user_name} tomorrow.")
        
#         print("Scheduling reminder email for user...")  # Debugging
#         schedule_email(date, user_email, "Appointment Reminder", 
#                        f"Reminder: Your appointment with {counselor_name} is tomorrow.")

#         return jsonify({"message": "Emails sent and scheduled successfully."}), 200
#     except Exception as e:
#         print("Error in sending emails:", str(e))  
#         return jsonify({"error": str(e)}), 500


from flask import Blueprint, request, jsonify
from app.services.email_services import send_email, schedule_email

appointment_emailCoun_bp = Blueprint('appointment_email', __name__)

@appointment_emailCoun_bp.route('/sendAppointmentEmail', methods=['POST'])
def send_appointment_email():
    data = request.json
    print("Received request data:", data)  # Debugging: Print received data
    
    date = data.get('date')
    counselor_email = data.get('counselor_email')
    counselor_name = data.get('counselor_fullname')
    user_name = data.get('user_fullname')
    user_email = data.get('user_email')

    print(f"Sending appointment email to {counselor_email} and {user_email}...")  # Debugging
    
    try:
        # Send immediate emails
        print("Sending immediate email to user...")  # Debugging
        send_email(user_email, "Appointment Confirmation", 
                   f"Your appointment is on {date} with {counselor_name}.")
        
        print("Sending immediate email to counselor...")  # Debugging
        send_email(counselor_email, "New Appointment", 
                   f"You have an appointment with {user_name} on {date}.")

        # Schedule reminder emails (1 day before the appointment)
        print("Scheduling reminder email for counselor...")  # Debugging
        schedule_email(date, counselor_email, "Appointment Reminder", 
                       f"You have an appointment with {user_name} tomorrow.")
        
        print("Scheduling reminder email for user...")  # Debugging
        schedule_email(date, user_email, "Appointment Reminder", 
                       f"Reminder: Your appointment with {counselor_name} is tomorrow.")

        response = {
            "response": {
                "success": True,
                "data": data,
                "message": {
                    "title": "Success",
                    "message": "Emails sent and scheduled successfully."
                },
                "meta": "",
                "errors": "",
                "status": 200
            }
        }
        return jsonify(response), 200
    except Exception as e:
        print("Error in sending emails:", str(e))  
        response = {
            "response": {
                "success": False,
                "data": None,
                "message": {
                    "title": "Error",
                    "message": str(e)
                },
                "meta": "",
                "errors": str(e),
                "status": 500
            }
        }
        return jsonify(response), 500
