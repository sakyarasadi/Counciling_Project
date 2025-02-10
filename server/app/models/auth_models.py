from firebase_admin import firestore
import firebase_admin
from firebase_admin import credentials
from datetime import datetime, timedelta
import logging
from werkzeug.security import check_password_hash

cred = credentials.Certificate('D:/EXE.lk/Exe Github/counseling-platform/server/agry-7028f-firebase-adminsdk-4cveg-e37a331078.json')
# firebase_admin.initialize_app(cred)
firebase_admin.initialize_app(cred, {
    'storageBucket': 'agry-7028f.appspot.com'  
})

db = firestore.client()
logging.basicConfig(level=logging.INFO)

class User:
    def __init__(self, firstName, lastName, email, password, age, Status,status, session, sessionExp, nic=None, phoneNumber=None, guardianName=None, guardianPhoneNumber=None, connectionWithUser=None):
        self.firstName = firstName
        self.lastName = lastName
        self.email = email
        self.password = password
        self.age = age
        self.Status = Status
        self.status = status
        self.session = session
        self.sessionExp = sessionExp
        self.nic = nic
        self.phoneNumber = phoneNumber
        self.guardianName = guardianName
        self.guardianPhoneNumber = guardianPhoneNumber
        self.connectionWithUser = connectionWithUser
        

    def save_to_firestore(self):
        user_ref = db.collection('users').document(self.email)
        user_ref.set({
            'firstName': self.firstName,
            'lastName': self.lastName,
            'email': self.email,
            'password': self.password,
            'age': self.age,
            'Status': self.Status,
            'status': self.status,
            'session': self.session,
            'sessionExp': self.sessionExp,
            'nic': self.nic,
            'phoneNumber': self.phoneNumber,
            'guardianName': self.guardianName,
            'guardianPhoneNumber': self.guardianPhoneNumber,
            'connectionWithUser': self.connectionWithUser,
            
        })

    def save_to_firestore2(self):
        registered_person_data = db.collection('registered_person').document(self.email)
        registered_person_data.set({
            'email': self.email,
            'role': 'User',
            'fullname': self.firstName + ' ' + self.lastName,
            'password': self.password,
            'Status': 'Offline',
            'session': self.session,
            'sessionExp': self.sessionExp
        })

    @staticmethod
    def find_by_email(email):
        try:
            user_ref = db.collection('registered_person').document(email).get()
            if user_ref.exists:
                logging.info(f"User found: {user_ref.to_dict()}")
                return user_ref.to_dict()
            else:
                logging.info(f"User with email {email} not found.")
                return None
        except Exception as e:
            logging.error(f"Error finding user by email: {e}")
            return None

    def set_online(self):
        self.Status = 'online'
        self.session = 1
        self.sessionExp = (datetime.now() + timedelta(hours=1)).isoformat()
        self.update_session()

    def set_offline(self):
        self.Status = 'offline'
        self.session = 0
        self.sessionExp = ''

    def update_session(self):
        try:
            user_ref = db.collection('registered_person').document(self.email)
            user_ref.update({
                'Status': self.Status,
                'session': self.session,
                'sessionExp': self.sessionExp
            })
            logging.info(f"User session updated: {self.email}")
        except Exception as e:
            logging.error(f"Error updating user session: {e}")

    @staticmethod
    def verify_password(stored_password, provided_password):
        return check_password_hash(stored_password, provided_password)
