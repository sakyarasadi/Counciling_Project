from app.services.admin_services import ApprovedPersonService
from app.services.admin_services import ApprovalDeleteService
from flask import jsonify, Blueprint, request
from app.services.admin_services import usersService
from app.services.admin_services import ApprovalService

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/approvedPerson_counselors', methods=['GET'])
def get_approvedPerson_counselors():
    approvedPerson_service = ApprovedPersonService()  
    approvedPerson_counselors = approvedPerson_service.fetch_approvedPerson_counselors()
    
    response_body = {
        "success": bool(approvedPerson_counselors),
        "data": approvedPerson_counselors if approvedPerson_counselors else [],
        "message": "Approved counselors fetched successfully" if approvedPerson_counselors else "No approved counselors found",
        "meta": {},
        "errors": [],
        "status": 200 if approvedPerson_counselors else 404
    }
    return jsonify({'response': response_body}), response_body['status']

    
@admin_bp.route('/approveddelete_counselors', methods=['GET'])
def get_approvalDelete_counselors():
    approvalDelete_service = ApprovalDeleteService()  
    approvalDelete_counselors = approvalDelete_service.fetch_approvalDelete_counselors()
    
    response_body = {
        "success": bool(approvalDelete_counselors),
        "data": approvalDelete_counselors if approvalDelete_counselors else [],
        "message": "Approval delete counselors fetched successfully" if approvalDelete_counselors else "No approval delete counselors found",
        "meta": {},
        "errors": [],
        "status": 200 if approvalDelete_counselors else 404
    }
    return jsonify({'response': response_body}), response_body['status']

    
@admin_bp.route('/users_counselors', methods=['GET'])
def get_all_users():
    try:
        counselors = usersService.get_all_users()
        print(counselors)
        response_body = {
            "success": True,
            "data": counselors,
            "message": "Users fetched successfully",
            "meta": {},
            "errors": [],
            'status': 200
        }
        return jsonify({'response': response_body}), 200
    except Exception as e:
        response_body = {
            "success": False,
            "data": {},
            "message": "Error fetching users.",
            "meta": {},
            "errors": [str(e)],
            'status': 500
        }
        return jsonify({'response': response_body}), 500
    

@admin_bp.route('/approved_counselors', methods=['GET'])
def get_approved_counselors():
    approval_service = ApprovalService()  
    approved_counselors = approval_service.fetch_approved_counselors()
    
    response_body = {
        "success": bool(approved_counselors),
        "data": approved_counselors if approved_counselors else [],
        "message": "Approved counselors fetched successfully" if approved_counselors else "No approved counselors found",
        "meta": {},
        "errors": [],
        "status": 200 if approved_counselors else 404
    }
    return jsonify({'response': response_body}), response_body['status']



@admin_bp.route('/approve_counselor/<email>', methods=['POST'])
def update_status(email):
    try:
        data = request.get_json()
        status = data.get('status')
        reason = data.get('reason')  # Get the rejection reason if present

        print(f"Received Status: {status} for email: {email}, Reason: {reason}")
        
        if status is None:
            return jsonify({'success': False, 'message': {'title': 'Error', 'message': 'Status is required'}}), 400

        approval_service = ApprovalService()
        result = approval_service.update_counselor_status(email, status, reason)
        print(f"Result: {result}")

        if result:
            return jsonify({'response': {'success': True, 'message': {'title': 'Success', 'message': 'Status updated successfully'}}}), 200

        else:
            return jsonify({'response': {'success': False, 'message': {'title': 'Error', 'message': 'Failed to update status'}}}), 400

    except Exception as e:
        print(f"Error updating status: {e}")
        return jsonify({'success': False, 'message': {'title': 'Error', 'message': str(e)}}), 500


from flask import request, jsonify
from firebase_admin import firestore

@admin_bp.route('/update_counselor_status_restore', methods=['POST'])
def update_counselor_status():
    data = request.json
    email = data.get('email')
    status = data.get('status')
    print(f"Received Status: {status} for email: {email}")

    if not email or status is None:
        return jsonify({
            "response": {
                "success": False,
                "data": None,
                "message": {
                    "title": "Invalid Input",
                    "message": "Email or status is missing"
                },
                "meta": "",
                "errors": "Missing email or status",
                "status": 400
            }
        }), 400

    try:
        db = firestore.client()
        counselor_ref = db.collection('Councillor').where('email', '==', email).limit(1)
        docs = counselor_ref.stream()

        for doc in docs:
            doc.reference.update({"status": status})
            return jsonify({
                "response": {
                    "success": True,
                    "data": {"email": email, "status": status},
                    "message": {
                        "title": "Success",
                        "message": "Status updated successfully"
                    },
                    "meta": "",
                    "errors": None,
                    "status": 200
                }
            }), 200

        return jsonify({
            "response": {
                "success": False,
                "data": None,
                "message": {
                    "title": "Not Found",
                    "message": "Counselor not found"
                },
                "meta": "",
                "errors": "Counselor not found",
                "status": 404
            }
        }), 404

    except Exception as e:
        return jsonify({
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
        }), 500
    
@admin_bp.route('/update_counselor_status_delete', methods=['POST'])
def delete_counselor_status():
    data = request.json
    email = data.get('email')
    status = data.get('status')
    print(f"Received Status: {status} for email: {email}")

    if not email or status is None:
        return jsonify({
            "response": {
                "success": False,
                "data": None,
                "message": {
                    "title": "Invalid Input",
                    "message": "Email or status is missing"
                },
                "meta": "",
                "errors": "Missing email or status",
                "status": 400
            }
        }), 400

    try:
        db = firestore.client()
        counselor_ref = db.collection('Councillor').where('email', '==', email).limit(1)
        docs = counselor_ref.stream()

        for doc in docs:
            doc.reference.update({"status": status})
            return jsonify({
                "response": {
                    "success": True,
                    "data": {"email": email, "status": status},
                    "message": {
                        "title": "Success",
                        "message": "Status updated successfully"
                    },
                    "meta": "",
                    "errors": None,
                    "status": 200
                }
            }), 200

        return jsonify({
            "response": {
                "success": False,
                "data": None,
                "message": {
                    "title": "Not Found",
                    "message": "Counselor not found"
                },
                "meta": "",
                "errors": "Counselor not found",
                "status": 404
            }
        }), 404

    except Exception as e:
        return jsonify({
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
        }), 500


