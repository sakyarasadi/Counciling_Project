import os
from flask import Flask
from flask_cors import CORS
from app.mail_config import mail
from json import JSONEncoder
from bson import json_util, ObjectId
from datetime import datetime
from app.controllers.auth_controllers import auth_bp
from app.controllers.CouncillorRegister_controllers import approve_bp
from app.controllers.admin_controllers import admin_bp
from app.controllers.councillor_controllers import counselorProfile_bp
from app.controllers.results_controllers import results_bp
from app.controllers.report_controllers import reports_bp
from app.controllers.ConcilorRequest_controllers import request_controller
from app.controllers.councilorRequestStatus_controllers import requestsAll_controller
from app.controllers.councilorList_controllers import requestsAllList_controller
from app.controllers.CouncilorListStatus_controllers import requests_blueprint
from app.controllers.userChatControllers import chat_bp
from app.controllers.CouncilorChatControllers import chat_concilor_bp
from app.controllers.appointment_user_controllers import appointmentsUser_bp
from app.controllers.appointment_councilor_controllers import appointments_councilor_bp
from app.controllers.email_controllers import appointment_emailCoun_bp
from app.controllers.pdfController import pdf_bp
from app.controllers.update_controllers import counselor_bp
from app.controllers.profilePic_controllers import propic_bp
from app.controllers.userpropic_controllers import userpropic_bp

class MongoJsonEncoder(JSONEncoder):
    """
    Custom JSON encoder to handle MongoDB-specific data types.
    """
    def default(self, obj):
        """
        Convert special data types to JSON serializable formats.

        Args:
            obj: The object to serialize.

        Returns:
            JSON serializable representation of the object.
        """
        if isinstance(obj, datetime):
            return obj.strftime("%Y-%m-%d %H:%M:%S")
        if isinstance(obj, ObjectId):
            return str(obj)
        return json_util.default(obj, json_util.CANONICAL_JSON_OPTIONS)

def create_app():
    """
    Factory function to create and configure a Flask application instance.

    Returns:
        Flask application instance.
    """

    app = Flask(__name__)
    CORS(app)
    app.json_encoder = MongoJsonEncoder

     # Mail configuration
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_USERNAME'] = 'rasadi12dedduwa@gmail.com'
    app.config['MAIL_PASSWORD'] = 'teabobuogilvrrur'  # Use the App Password here
    app.config['MAIL_DEFAULT_SENDER'] = 'rasadi12dedduwa@gmail.com'

    
    mail.init_app(app)  # Initialize mail here
    print("Mail initialized successfully.")  # Debugging
  
    # Register the blueprints for the application
    app.register_blueprint(auth_bp)
    app.register_blueprint(approve_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(counselorProfile_bp)
    app.register_blueprint(results_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(request_controller)
    app.register_blueprint(requestsAll_controller)
    app.register_blueprint(requestsAllList_controller)
    app.register_blueprint(requests_blueprint)
    app.register_blueprint(chat_bp)
    app.register_blueprint(chat_concilor_bp)
    app.register_blueprint(appointmentsUser_bp)
    app.register_blueprint(appointments_councilor_bp)
    app.register_blueprint(appointment_emailCoun_bp)
    app.register_blueprint(pdf_bp)
    app.register_blueprint(counselor_bp)
    app.register_blueprint(propic_bp)
    app.register_blueprint(userpropic_bp)

    return app

