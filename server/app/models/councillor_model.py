from flask import current_app, g
from firebase_admin import firestore

def get_db():
    if 'db' not in g:
        g.db = firestore.client()
    return g.db

class CounselorPsychiatrist:
    @staticmethod
    def find_by_email(email):
        db = get_db()
        # Use Firestore collection reference syntax
        counselor_ref = db.collection("Councillor").where("email", "==", email).limit(1)
        results = counselor_ref.stream()
        
        # Extract the document from the Firestore result
        counselor = None
        for doc in results:
            counselor = doc.to_dict()
            counselor["_id"] = doc.id  # Optionally add the document ID if needed
            break

        if counselor:
            print(f"Counselor found: {counselor}")
        else:
            print("Counselor not found")
            
        return counselor

        return counselor

class CounselorPsychiatristModel:
    def __init__(self):
        db = get_db()
        self.db = db
        self.collection = self.db.collection('Councillor')

    def get_status_by_email(self, email):
        """
        Fetches the status of a counselor by email.
        """
        try:
            counselor = self.collection.where('email', '==', email).get()
            print(f"Counselor status: {counselor}")
            if counselor:
                # Assuming there's only one document per email
                return counselor[0].to_dict().get('status', 0)
            return None
        except Exception as e:
            print(f"Error fetching counselor status: {e}")
            return None
