from flask import Blueprint, request, jsonify
from app.services.ConcilorRequest_services import RequestService

request_controller = Blueprint('request_controller', __name__)
request_service = RequestService()

@request_controller.route('/createRequest', methods=['POST'])
def create_request():
    try:
        data = request.json
        print(data)
        counselor_fullname = data.get('counselorFullname')
        counselor_email = data.get('counselorEmail')
        user_fullname = data.get('userFullname')
        user_email = data.get('userEmail')
        status = data.get('status', 0)

        result = request_service.create_request(counselor_fullname, counselor_email, user_fullname, user_email, status)

        response = {
            "success": result["success"],
            "data": result.get("data", {}),
            "message": {
                "title": "Request Creation" if result["success"] else "Request Failed",
                "message": result["message"]
            },
            "meta": "Request creation process",
            "errors": result.get("errors", ""),
            "status": 200 if result["success"] else 400
        }

        return jsonify({"response": response}), response["status"]
    except Exception as e:
        print(f"Error in create_request endpoint: {e}")
        response = {
            "success": False,
            "data": {},
            "message": {
                "title": "Error",
                "message": "An error occurred while processing the request."
            },
            "meta": "Error in request creation",
            "errors": str(e),
            "status": 500
        }
        return jsonify({"response": response}), 500