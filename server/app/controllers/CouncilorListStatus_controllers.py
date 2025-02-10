from flask import Blueprint, request, jsonify
from app.services.CouncilorListStatus_services import update_request_status_service

requests_blueprint = Blueprint('requests', __name__)

@requests_blueprint.route('/requestsList/<id>/updateStatus', methods=['POST'])
def update_status(id):
    try:
        data = request.json
        status = data.get('status')
        counselor_email = data.get('counselorEmail')

        if not counselor_email:
            return jsonify({"success": False, "message": "Counselor email is required"}), 400

        success, message = update_request_status_service(id, counselor_email, status)

        if success:
            return jsonify({"success": True, "message": "Status updated successfully"})
        else:
            return jsonify({"success": False, "message": message}), 400

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
