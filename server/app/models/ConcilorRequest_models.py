from firebase_admin import firestore

class RequestModel:
    def __init__(self):
        self.collection = firestore.client().collection('Requests')

    def create_request(self, request_data):
        try:
            doc_ref = self.collection.add(request_data)
            return doc_ref
        except Exception as e:
            print(f"Error creating request: {e}")
            return None
