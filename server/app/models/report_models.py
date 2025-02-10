from firebase_admin import firestore
import logging

db = firestore.client()
logging.basicConfig(level=logging.INFO)

class UserModel:
    @staticmethod
    def get_user_by_email(email: str):
        try:
            user_ref = db.collection("users").where("email", "==", email).get()
            if user_ref:
                user_data = [doc.to_dict() for doc in user_ref]
                return user_data[0] if user_data else None
            else:
                return None
        except Exception as e:
            print(f"Error fetching user by email: {e}")
            return None

class ReportModel:
    @staticmethod
    def get_report_by_email(email: str):
        try:
            user_ref = db.collection("results").where("email", "==", email).get()
            if user_ref:
                report_data = [doc.to_dict() for doc in user_ref]
                return report_data[0] if report_data else None
            else:
                return None
        except Exception as e:
            print(f"Error fetching user by email: {e}")
            return None