from firebase_admin import firestore

db = firestore.client()

class CounselorModel:
    def __init__(self):
        self.collection = db.collection("Councillor")

    def get_counselor_by_email(self, email: str):
        # Fetch document by email
        doc_ref = self.collection.document(email)
        doc = doc_ref.get()
        if doc.exists:
            return doc.to_dict()
        return None

    def update_counselor(self, email: str, updated_data: dict):
        try:
            # Reference the document by email and update the fields
            doc_ref = self.collection.document(email)
            doc = doc_ref.get()

            if not doc.exists:
                raise ValueError(f"Counselor with email {email} does not exist.")

            doc_ref.update(updated_data)
            return True
        except Exception as e:
            print(f"Error updating counselor: {e}")
            return False
