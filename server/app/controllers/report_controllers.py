from flask import jsonify, Blueprint, request
from app.services.report_services import UserService , ReportService

reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/api/get-user', methods=['GET'])
def get_user():
    email = request.headers.get("X-User-Email")
    if not email:
        return jsonify({"success": False, "message": "Email header is missing"}), 400

    response = UserService.fetch_user_data(email)
    return jsonify({"response": response}), 200 if response["success"] else 404

@reports_bp.route('/api/get-report', methods=['GET'])
def get_report():
    email = request.headers.get("X-User-Email")
    if not email:
        return jsonify({"success": False, "message": "Email header is missing"}), 400
    response = ReportService.fetch_report_data(email)
    return jsonify({"response": response}), 200 if response["success"] else 404