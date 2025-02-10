from firebase_admin import firestore
import logging

db = firestore.client()
logging.basicConfig(level=logging.INFO)

class ApprovalModel:
    def __init__(self):
        self.collection = db.collection('Councillor')

    def get_approved_counselors(self):
        try:
            docs = self.collection.stream()
            for doc in docs:
                data = doc.to_dict()
                if isinstance(data.get('status'), str) and data['status'] == "0":
                    self.collection.document(doc.id).update({"status": 0})
            

            int_docs = self.collection.where('status', '==', 0).stream()
            str_docs = self.collection.where('status', '==', '0').stream()
            approved_counselors = [doc.to_dict() for doc in int_docs] + [doc.to_dict() for doc in str_docs]
            logging.info(f"Fetched approved counselors with status 0: {approved_counselors}")

            return approved_counselors
        except Exception as e:
            logging.error(f"Error fetching approved counselors: {e}")
            return None
        
    def update_status(self, email, status, reason=None):
        try:
            doc_ref = self.collection.document(email)
            update_data = {'status': str(status)}
            if reason:  # Include reason if provided
                update_data['rejection_reason'] = reason
            result = doc_ref.update(update_data)
            print(f"Status updated for counselor_id: {email}")
            return True
        except Exception as e:
            print(f"Error updating status: {e}")
            return False


class ApprovalDeleteModel:
    def __init__(self):
        self.collection = db.collection('Councillor')

    def get_approvalDelete_counselors(self):
        try:
            docs = self.collection.stream()
            for doc in docs:
                data = doc.to_dict()
                if isinstance(data.get('status'), str) and data['status'] == "-1":
                    self.collection.document(doc.id).update({"status": -1})

            int_docs = self.collection.where('status', '==', -1).stream()
            str_docs = self.collection.where('status', '==', '-1').stream()
            approvalDelete_counselors = [doc.to_dict() for doc in int_docs] + [doc.to_dict() for doc in str_docs]
            logging.info(f"Fetched all data for approved delete counselors: {approvalDelete_counselors}")
            return approvalDelete_counselors
        except Exception as e:
            print(f"Error fetching approval delete counselors: {e}")
            return None
        

class ApprovedPersonModel:
    def __init__(self):
        self.collection = db.collection('Councillor')

    def get_approvedPerson_counselors(self):
        try:
            docs = self.collection.stream()
            for doc in docs:
                data = doc.to_dict()
                if isinstance(data.get('status'), str) and data['status'] == "1":
                    self.collection.document(doc.id).update({"status": 1})

            int_docs = self.collection.where('status', '==', 1).stream()
            str_docs = self.collection.where('status', '==', '1').stream()
            approvedPerson_counselors = [doc.to_dict() for doc in int_docs] + [doc.to_dict() for doc in str_docs]
            logging.info(f"Fetched all data for approved counselors: {approvedPerson_counselors}")
            return approvedPerson_counselors
        except Exception as e:
            print(f"Error fetching approved person counselors: {e}")
            return None

class usersModel:
    @staticmethod
    def find_all():
        try:
            # Fetch all documents from the 'users' collection
            users_ref = db.collection('users').stream()
            
            # Convert documents to dictionary format for easier processing
            users = [user.to_dict() for user in users_ref]  # Use to_dict() directly if serialize_doc is not defined
            
            # Log fetched data for debugging
            logging.info(f"Fetched users data: {users}")
            
            return users
        except Exception as e:
            logging.error(f"Error fetching users: {e}")
            raise Exception(f"Error fetching users: {e}")




