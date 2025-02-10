from flask import Blueprint, request, jsonify
from app.services.update_services import CounselorService

counselor_bp = Blueprint("counselor", __name__)

counselor_service = CounselorService()

@counselor_bp.route('/counselor/update', methods=['POST'])
def update_counselor():
    try:
        data = request.json
        if not data:
            return jsonify({
                "response": {
                    "success": False,
                    "data": {},
                    "message": {
                        "title": "Error",
                        "message": "Invalid data"
                    },
                    "meta": "",
                    "errors": "",
                    "status": 400
                }
            }), 400
        
        email = data.get("email")
        if not email:
            return jsonify({
                "response": {
                    "success": False,
                    "data": {},
                    "message": {
                        "title": "Error",
                        "message": "Email is required"
                    },
                    "meta": "",
                    "errors": "",
                    "status": 400
                }
            }), 400

        # Call the service to update the counselor
        success = counselor_service.update_counselor(email, data)
        if success:
            return jsonify({
                "response": {
                    "success": True,
                    "data": {},
                    "message": {
                        "title": "Success",
                        "message": "Counselor updated successfully"
                    },
                    "meta": "",
                    "errors": "",
                    "status": 200
                }
            }), 200
        else:
            return jsonify({
                "response": {
                    "success": False,
                    "data": {},
                    "message": {
                        "title": "Error",
                        "message": "Failed to update counselor"
                    },
                    "meta": "",
                    "errors": "",
                    "status": 500
                }
            }), 500
    except Exception as e:
        return jsonify({
            "response": {
                "success": False,
                "data": {},
                "message": {
                    "title": "Error",
                    "message": str(e)
                },
                "meta": "",
                "errors": str(e),
                "status": 500
            }
        }), 500
