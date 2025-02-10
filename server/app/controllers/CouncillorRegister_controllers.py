from flask import jsonify, Blueprint, request
from app.services.CouncillorRegister_services import AuthServiceCouncillor
from app.utils.jwt_utils import token_required

approve_bp = Blueprint('approve', __name__)
    
@approve_bp.route('/takeapproval', methods=['POST'])
def Register():
    try:
        data = request.get_json()
        print("Incoming data", data)
        
        result_response = AuthServiceCouncillor.register(data)
        print("result", result_response)
        
        result = result_response.get_json()
        
        response_body = {
            "response": {
                "success": result.get("success", False),
                "data": result.get("data", {}),
                "message": result.get("message", {
                    "title": "Registration",
                    "message": "Successfully Registered"
                }),
                "meta": result.get("meta", {}),
                "errors": result.get("errors", []),
                "status": result.get("status", 201)
            }
        }
        
        return jsonify(response_body), 201 if result.get("success") else 400
    except Exception as e:
        print(f"Error in register route: {e}")
        
        response_body = {
            "response": {
                "success": False,
                "data": {},
                "message": {
                    "title": "Server Error!",
                    "message": "Failed to Register"
                },
                "meta": {},
                "errors": [str(e)],
                "status": 500
            }
        }
        return jsonify(response_body), 500