from app.models.councillor_model import CounselorPsychiatrist , CounselorPsychiatristModel
from bson import ObjectId
import logging

class CounselorService:
    @staticmethod
    def get_logged_in_counselor(email):
        try:
            counselor = CounselorPsychiatrist.find_by_email(email)
            if not counselor:
                raise Exception("Counselor not found")
            counselor['_id'] = str(counselor['_id'])
            print(f"Counselor data retrieved: {counselor}")
            return counselor
        except Exception as e:
            print(f"Error fetching counselor details: {e}")
            raise Exception(f"Service Layer Error: {str(e)}")
        
def get_counselor_status_by_email(email):
    model = CounselorPsychiatristModel()
    logging.info(f"Fetching counselor status by email: {email}")
    return model.get_status_by_email(email)


