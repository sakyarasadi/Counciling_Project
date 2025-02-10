from app.services.appointment_user_services import Appointment
from flask import Blueprint, jsonify, request
from app.services.appointment_user_services import get_appointments_by_email

appointmentsUser_bp = Blueprint('appointmentsUser_bp', __name__)

@appointmentsUser_bp.route('/appointmentsUser', methods=['POST'])
def create_appointment():
    data = request.get_json()
    print("data", data)
    
    result = Appointment.save_appointment(data) 
    print(result)
    
    if result["success"]:
        response = {
            "response": {
                "success": True,
                "data": {},
                "message": {
                    "title": "Appointment Saved",
                    "message": result["message"]
                },
                "meta": "",
                "errors": {},
                "status": 201
            }
        }
        return jsonify(response), 201
    else:
        response = {
            "response": {
                "success": False,
                "data": {},
                "message": {
                    "title": "Error",
                    "message": result["message"]
                },
                "meta": "",
                "errors": {},
                "status": 400
            }
        }
        return jsonify(response), 400
    
@appointmentsUser_bp.route('/appointments', methods=['GET'])
def get_appointments():
    user_email = request.args.get('user_email')
    print(user_email)
    if not user_email:
        return jsonify({"response": {"success": False, "message": {"title": "Error", "message": "Counselor email is required"}}}), 400
    
    appointments = get_appointments_by_email(user_email)
    return jsonify({"response": {"success": True, "data": appointments}})
