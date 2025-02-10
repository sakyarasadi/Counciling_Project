from app.models.userChatModel import ChatModel
from firebase_admin import firestore

chat_model = ChatModel()

def create_chat_service(user_fullname, user_email, counselor_fullname, counselor_email, message_data):
    chat_ref = chat_model.collection.where("userEmail", "==", user_email).where("counselorEmail", "==", counselor_email).get()

    if chat_ref:
        # Append to existing chat's messages
        chat_doc_id = chat_ref[0].id
        chat_model.collection.document(chat_doc_id).update({
            "messages": firestore.ArrayUnion([message_data])
        })
        return {"chatId": chat_doc_id, "message": "Message added to chat"}
    else:
        # Create a new chat document if one doesn't exist
        chat_data = {
            "userFullname": user_fullname,
            "userEmail": user_email,
            "counselorFullname": counselor_fullname,
            "counselorEmail": counselor_email,
            "messages": [message_data]  # Initial message array
        }
        chat_id = chat_model.create_chat(chat_data)
        return {"chatId": chat_id, "message": "Chat created and message added"}


def get_chat_history_service(user_email, counselor_email):
    chat_history = chat_model.get_chat_history(user_email, counselor_email)
    return chat_history
