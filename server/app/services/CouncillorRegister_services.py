from flask import jsonify, make_response, current_app
from werkzeug.security import generate_password_hash,check_password_hash
from firebase_admin import auth
from app.models.CouncillorRegister_model import Councillor
import logging
import jwt
from datetime import datetime, timedelta

class AuthServiceCouncillor:
    @staticmethod
    def register(data):
        fullname = data.get('fullname')
        email = data.get('email')
        nic = data.get('nic')
        age = data.get('age')
        password = generate_password_hash(data.get('password'))
        phoneNumber = data.get('phoneNumber')
        counselorId = data.get('counselorId')
        experience = data.get('experience')
        educationInstitute = data.get('educationInstitute')
        degreeOrDiploma = data.get('degreeOrDiploma')
        Status = 'offline'
        status = 0
        session = 0
        sessionExp = ''

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

        user = Councillor(
                fullname,
                email,
                nic,
                age,
                password,
                phoneNumber,
                counselorId,
                experience,
                educationInstitute,
                degreeOrDiploma,
                Status,
                status,
                session,
                sessionExp
            )
        
        try:
            user_record = auth.create_user(email=email, password=data.get('password'))
            user.save_to_firestore_1()
            user.save_to_firestore_2()
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
    
   