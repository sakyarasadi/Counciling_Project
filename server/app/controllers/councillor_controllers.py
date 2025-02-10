from flask import Blueprint, jsonify, request
from app.services.councillor_services import CounselorService , get_counselor_status_by_email
from app.utils.jwt_utils import token_required

counselorProfile_bp = Blueprint('counselorProfile_bp', __name__)

@counselorProfile_bp.route('/counselor', methods=['GET'])
def get_logged_in_counselor():
    try:
        email = request.headers.get('X-User-Email')  
        print(email)
        if not email:
            return jsonify({'response': {'success': False, 'message': 'Email header missing', 'status': 400}}), 400
        
        counselor = CounselorService.get_logged_in_counselor(email)
        response_body = {
            "success": True,
            "data": counselor,
            "message": "Logged-in counselor details fetched successfully",
            "status": 200
        }
        return jsonify({'response': response_body}), 200
    except Exception as e:
        response_body = {
            "success": False,
            "data": {},
            "message": "Error fetching counselor details",
            "errors": [str(e)],
            'status': 500
        }
        return jsonify({'response': response_body}), 500

@counselorProfile_bp.route('/api/counselor/status', methods=['GET'])
def get_status():
    """
    Endpoint to get the status of a counselor by email.
    """
    email = request.args.get('email')
    print(email)
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    status = get_counselor_status_by_email(email)
    print(status)
    if status is None:
        return jsonify({'error': 'Counselor not found'}), 404

    return jsonify({'status': status})
