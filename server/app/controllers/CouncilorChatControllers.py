from flask import Blueprint, request, jsonify
from app.services.userChatServices import create_chat_service, get_chat_history_service

chat_concilor_bp = Blueprint('chat_concilor', __name__)

@chat_concilor_bp.route('/create-chat-councilor', methods=['POST'])
def create_chat():
    try:
        data = request.json
        print("Received data:", data)  
        
        user_fullname = data.get("userFullname")
        user_email = data.get("userEmail")
        counselor_fullname = data.get("counselorFullname")
        counselor_email = data.get("counselorEmail")
        message_data = data.get("messageData")  

        if not all([user_fullname, user_email, counselor_fullname, counselor_email, message_data]):
            return jsonify({"response": {"success": False, "message": "All fields are required"}}), 400

        result = create_chat_service(user_fullname, user_email, counselor_fullname, counselor_email, message_data)
        return jsonify({"response": {"success": True, "data": result}}), 201
    except Exception as e:
        print("Error in create_chat route:", str(e))  
        return jsonify({"response": {"success": False, "message": str(e)}}), 500



@chat_concilor_bp.route('/chat-history-councilor', methods=['GET'])
def get_chat_history():
    try:
        user_email = request.args.get("userEmail")
        counselor_email = request.args.get("counselorEmail")

        if not all([user_email, counselor_email]):
            return jsonify({"response": {"success": False, "message": "Missing required query parameters"}}), 400

        chat_history = get_chat_history_service(user_email, counselor_email)
        return jsonify({"response": {"success": True, "data": chat_history}}), 200
    except Exception as e:
        return jsonify({"response": {"success": False, "message": str(e)}}), 500

