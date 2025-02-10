import firebase_admin
from firebase_admin import credentials, firestore, initialize_app
import configparser
import os
import secrets
from flask_cors import CORS
from app.factory import create_app

# Initialize the Flask app
app = create_app()
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# Set a secret key for session management
app.config['SECRET_KEY'] = secrets.token_hex(24)

# Load Firebase credentials and initialize Firebase
firebase_cred = credentials.Certificate('D:/EXE.lk/Exe Github/counseling-platform/server/agry-7028f-firebase-adminsdk-4cveg-e37a331078.json')

if not firebase_admin._apps:
    firebase_app = initialize_app(firebase_cred)
else:
    firebase_app = firebase_admin.get_app()

# Initialize Firestore client
db = firestore.client()

def load_config():
    """
    Load configuration settings from a config file.

    Returns:
        ConfigParser object with loaded configuration if successful, None otherwise.
    """
    config = configparser.ConfigParser()
    try:
        config.read("config")
        return config
    except Exception as e:
        print(f"Error reading config file: {e}")
        return None

if __name__ == "__main__":
    config = load_config()

    if config:
        app.config['DEBUG'] = True
        app.config['FIREBASE_CREDENTIALS'] = firebase_cred

        if not firebase_app:
            print("Firebase initialization failed.")
        else:
            print("Firebase initialized successfully.")
            app.run(debug=True, port=5000)
    else:
        print("Application cannot start without proper configuration.")

# import firebase_admin
# from firebase_admin import credentials, firestore, initialize_app
# import configparser
# import os
# import secrets
# from flask_cors import CORS
# from flask_mail import Mail
# from app.factory import create_app

# # Initialize the Flask app
# app = create_app()
# CORS(app, supports_credentials=True)

# # Set a secret key for session management
# app.config['SECRET_KEY'] = secrets.token_hex(24)

# # Load Firebase credentials and initialize Firebase
# firebase_cred = credentials.Certificate('D:/EXE.lk/Exe Github/counseling-platform/server/agry-7028f-firebase-adminsdk-4cveg-e37a331078.json')

# if not firebase_admin._apps:
#     firebase_app = initialize_app(firebase_cred)
# else:
#     firebase_app = firebase_admin.get_app()

# # Initialize Firestore client
# db = firestore.client()

# # Mail configuration
# app.config['MAIL_SERVER'] = 'smtp.gmail.com'
# app.config['MAIL_PORT'] = 587
# app.config['MAIL_USE_TLS'] = True
# app.config['MAIL_USE_SSL'] = False
# app.config['MAIL_USERNAME'] = 'rasadi12dedduwa@gmail.com'
# app.config['MAIL_PASSWORD'] = os.getenv('dedduwa1234')  
# app.config['MAIL_DEFAULT_SENDER'] = 'rasadi12dedduwa@gmail.com'

# # Initialize Flask-Mail
# mail = Mail(app)

# def load_config():
#     """
#     Load configuration settings from a config file.

#     Returns:
#         ConfigParser object with loaded configuration if successful, None otherwise.
#     """
#     config = configparser.ConfigParser()
#     try:
#         config.read("config")
#         return config
#     except Exception as e:
#         print(f"Error reading config file: {e}")
#         return None

# if __name__ == "__main__":
#     config = load_config()

#     if config:
#         app.config['DEBUG'] = True
#         app.config['FIREBASE_CREDENTIALS'] = firebase_cred

#         if not firebase_app:
#             print("Firebase initialization failed.")
#         else:
#             print("Firebase initialized successfully.")
#             app.run(debug=True, port=5000)
#     else:
#         print("Application cannot start without proper configuration.")
