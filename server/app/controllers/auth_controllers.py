from flask import jsonify, Blueprint, request
from app.services.auth_services import AuthService
from app.utils.jwt_utils import token_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/protected-route', methods=['GET'])
@token_required 
def protected_route(current_user):
    return jsonify({'message': f'Hello, {current_user["email"]}!'}), 200
    
@auth_bp.route('/register', methods=['POST'])
def Register():
    try:
        data = request.get_json()
        print("Incoming data", data)
        
        result_response = AuthService.register(data)
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


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print("Incoming login data:", data)  
        result = AuthService.login(data)
        print("Result:", result) 
        return result
    except Exception as e:
        print(f"Error in login route: {e}")
        response_body = {
            "success": False,
            "data": {},
            "message": {'Title': 'Server Error!', 'message': 'Failed to Login'},
            "meta": {},
            "errors": [str(e)],
            'status': 500
        }
        return jsonify({'response': response_body}), 500
