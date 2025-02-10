from flask import jsonify, make_response, current_app
from werkzeug.security import generate_password_hash,check_password_hash
from firebase_admin import auth
from app.models.auth_models import User
import logging
import jwt
from datetime import datetime, timedelta

class AuthService:
    @staticmethod
    def register(data):
        firstName = data.get('firstName')
        lastName = data.get('lastName')
        email = data.get('email')
        password = generate_password_hash(data.get('password'))
        age = data.get('age')
        Status = 'offline'
        status = 0
        session = 0
        sessionExp = ''
        nic = data.get('nic')
        phoneNumber = data.get('phoneNumber')
        guardianName = data.get('guardianName')
        guardianPhoneNumber = data.get('guardianPhoneNumber')
        connectionWithUser = data.get('connectionWithUser')

        logging.info(f"Registering user: {data}") 

        try:
            auth.get_user_by_email(email)
            response_body = {
                "success": False,
                "data": {},
                "message": 'This email already exists. Try another email.',
                "meta": {},
                "errors": [],
                'status': 400
            }
            return make_response(jsonify(response_body), 400)
        except auth.UserNotFoundError:
            pass 

        user = User(
                firstName,
                lastName,
                email,
                password,
                age,
                Status,
                status,
                session,
                sessionExp,
                nic,
                phoneNumber,
                guardianName,
                guardianPhoneNumber,
                connectionWithUser,
                
                
            )
        
        try:
            user_record = auth.create_user(email=email, password=data.get('password'))
            user.save_to_firestore()
            user.save_to_firestore2()
            response_body = {
                "success": True,
                "data": {},
                "message": "Successfully Registered",
                "meta": {},
                "errors": [],
                'status': 201
            }
            return make_response(jsonify(response_body), 201)
        except Exception as e:
            logging.error(f"Error registering user: {e}")
            response_body = {
                "success": False,
                "data": {},
                "message": str(e),
                "meta": {},
                "errors": [str(e)],
                'status': 400
            }
            return make_response(jsonify(response_body), 400)
    
    @staticmethod
    def login(data):
        email = data.get('email')
        password = data.get('password')

        try:
            user_data = User.find_by_email(email)
            logging.info(f"User data: {user_data}")
            
            if not user_data or not User.verify_password(user_data['password'], password):
                logging.error(f"Authentication failed for user: {email}") 
                return {
                    "success": False,
                    "data": {},
                    "message": {
                        "title": "Error",
                        "message": "Invalid email or password"
                    },
                    "meta": "",
                    "errors": ["Invalid email or password"],
                    "status": 401
                }, 401 
            
            # Extract the role before removing it from user_data
            fullname = user_data.pop('fullname', 'fullname')  
            firstName, lastName = fullname.split(' ')[0], fullname.split(' ')[1] if ' ' in fullname else ("User", "")
            user_data['status'] = user_data.get('status', 'Offline')
            role = user_data.pop('role', 'role')
            
            user_data.setdefault('age', 0)  # Default age to 0 if missing
            user_data.setdefault('session', 0)
            user_data.setdefault('sessionExp', '')
            user_data.setdefault('Status', 'Offline')
            
            user = User(firstName, lastName, **user_data)
            
            logging.info(f"User found and created: {user_data}")
            user.set_online() 
            
            token = jwt.encode({
                'sub': email,
                'iat': datetime.utcnow(),
                'exp': datetime.utcnow() + timedelta(hours=1)  
            }, 'your_secret_key', algorithm='HS256')
            
            logging.info(f"User logged in: {email}")
            
            response_body = {
                "success": True,
                "data": {
                    "fullname": f"{user.firstName} {user.lastName}",
                    "email": user.email,
                    "role": role,  # Include role in response
                    "token": token,
                },
                "message": {"title": "Login Successful", "message": "You have successfully logged in."},
                "meta": {},
                "errors": [],
                "status": 200
            }
            return jsonify({"response": response_body}), 200

        except Exception as e:
            logging.error(f"Error during login process: {e}")
            response_body = {
                "success": False,
                "data": {},
                "message": {
                    'Title': 'Server Error!',
                    'message': 'An error occurred during login'
                },
                "meta": {},
                "errors": [str(e)],
                'status': 500
            }
            return make_response(jsonify(response_body), 500)
