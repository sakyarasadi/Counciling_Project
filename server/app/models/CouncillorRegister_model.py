from app.models.auth_models import firebase_admin 
from firebase_admin import firestore
from datetime import datetime, timedelta
import logging
from werkzeug.security import check_password_hash

db = firestore.client()
logging.basicConfig(level=logging.INFO)

class Councillor:
    def __init__(self, fullname, email, nic, age, password, phoneNumber, counselorId, experience, educationInstitute, degreeOrDiploma, Status, status,session, sessionExp):
        self.fullname = fullname
        self.email = email
        self.nic = nic
        self.age = age
        self.password = password
        self.phoneNumber = phoneNumber
        self.counselorId = counselorId
        self.experience = experience
        self.educationInstitute = educationInstitute
        self.degreeOrDiploma = degreeOrDiploma
        self.Status = Status
        self.status = status
        self.session = session
        self.sessionExp = sessionExp

    def save_to_firestore_1(self):
        user_ref = db.collection('Councillor').document(self.email)
        user_ref.set({
            'fullname': self.fullname,
            'email': self.email,
            'nic': self.nic,
            'age': self.age,
            'password': self.password,
            'phoneNumber': self.phoneNumber,
            'counselorId': self.counselorId,
            'experience': self.experience,
            'educationInstitute': self.educationInstitute,
            'degreeOrDiploma': self.degreeOrDiploma,
            'Status': self.Status,
            'status': self.status,
            'session': self.session,
            'sessionExp': self.sessionExp
            
        })

    def save_to_firestore_2(self):
        registered_person_data = db.collection('registered_person').document(self.email)
        registered_person_data.set({
            'email': self.email,
            'role': 'Counselor_Psychiatrist',
            'fullname': self.fullname,
            'password': self.password,
            'Status': 'Offline',
            'session': self.session,
            'sessionExp': self.sessionExp
        })

    