from firebase_admin import firestore

class RequestsModel:
    def __init__(self):
        self.db = firestore.client()
        self.collection_name = 'Requests'

    def get_all_requests(self, counselorEmail=None):
        collection_ref = self.db.collection(self.collection_name)
        if counselorEmail:
            query = collection_ref.where('counselorEmail', '==', counselorEmail).stream()
        else:
            query = collection_ref.stream()

        requests_list = []
        for doc in query:
            request_data = doc.to_dict()
            request_data['_id'] = doc.id  # Include the document ID
            requests_list.append(request_data)

        return requests_list

    