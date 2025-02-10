# from flask import current_app, g
# from firebase_admin import firestore
# from datetime import datetime
# from bson.objectid import ObjectId

# def get_db():
#     """
#     Configuration method to return Firestore db instance
#     """
#     if 'db' not in g:
#         g.db = firestore.client()
#     return g.db

# class ResultsModel:
#     @staticmethod
#     def save_result(processed_data: dict, questions: list, answers: list, email: str):
#         db = get_db()
#         results_collection = db.collection('results')
        
#         result_document = {
#             "processed_data": processed_data,
#             "questions": questions,
#             "answers": answers,
#             "email": email,
#             "updated_at": datetime.utcnow()
#         }
        
#         # Firestore upsert equivalent with document ID as the token
#         result_ref = results_collection.document(email)
#         result_ref.set(
#             {**result_document, "created_at": datetime.utcnow()}, 
#             merge=True  # merge=True ensures existing documents are updated, and new ones are created
#         )
        
#         return result_ref.id  # Returning the document ID

from flask import current_app, g
from firebase_admin import firestore
from datetime import datetime

def get_db():
    """
    Configuration method to return Firestore db instance
    """
    if 'db' not in g:
        g.db = firestore.client()
    return g.db

class ResultsModel:
    @staticmethod
    def save_result(processed_data: dict, questions: list, answers: list, email: str):
        db = get_db()
        results_collection = db.collection('results')
        
        # Create a new document with auto-generated ID
        result_document = {
            "processed_data": processed_data,
            "questions": questions,
            "answers": answers,
            "email": email,
            "created_at": datetime.utcnow(),  # Timestamp when the document is created
        }
        
        result_ref = results_collection.add(result_document)  # Auto-generates document ID
        
        return result_ref[1].id  # Returning the document ID
