from flask import Blueprint, request, jsonify
from app.services.appointment_councilor_services import get_appointments_by_email, update_appointment_status

appointments_councilor_bp = Blueprint('appointments_councilor', __name__)

@appointments_councilor_bp.route('/appointments_coun', methods=['GET'])
def get_appointments():
    counselor_email = request.args.get('counselor_email')
    print(f"Received counselor_email: {counselor_email}")  
    if not counselor_email:
        return jsonify({"response": {"success": False, "message": {"title": "Error", "message": "Counselor email is required"}}}), 400
    appointments = get_appointments_by_email(counselor_email)
    return jsonify({"response": {"success": True, "data": appointments}})


@appointments_councilor_bp.route('/appointments/update', methods=['POST'])
def update_appointment():
    data = request.get_json()
    appointment_id = data.get('appointmentId')
    status = data.get('status')
    meeting_link = data.get('meetingLink', None)
    reject_reason = data.get('rejectReason', None)

    if not appointment_id or status is None:
        return jsonify({
            "response": {"success": False, "message": {"title": "Error", "message": "Invalid data"}}
        }), 400

    result = update_appointment_status(appointment_id, status, meeting_link, reject_reason)
    return jsonify({"response": {"success": result['success'], "message": result['message']}})

