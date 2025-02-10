from firebase_admin import firestore

db = firestore.client()

class RequestModel:
    @staticmethod
    def update_request_status(request_id, counselor_email, status):
        doc_ref = db.collection('Requests').document(request_id)
        doc = doc_ref.get()

        if not doc.exists:
            return False, "Request not found"

        # Update the request status, counselorEmail, and any other required fields
        doc_ref.update({
            'status': status,
            'counselorEmail': counselor_email
        })
        return True, "Updated successfully"
