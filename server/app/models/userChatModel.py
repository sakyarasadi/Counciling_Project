from firebase_admin import  firestore

db = firestore.client()

class ChatModel:
    def __init__(self):
        self.collection = db.collection("Chat")

    def create_chat(self, chat_data):
        new_chat_ref = self.collection.document()
        new_chat_ref.set(chat_data)
        return new_chat_ref.id

    def get_chat_history(self, user_email, counselor_email):
        chats = self.collection.where("userEmail", "==", user_email).where("counselorEmail", "==", counselor_email).stream()
        chat_history = []
        for chat in chats:
            chat_data = chat.to_dict()
            print("Debug - Chat Document:", chat_data)  # Log chat data for verification
            if "messages" in chat_data:
                # Safeguard to ensure timestamps are parsed correctly
                for message in chat_data["messages"]:
                    if 'timestamp' in message:
                        try:
                            message['timestamp'] = str(message['timestamp'])
                        except Exception as e:
                            print("Error parsing timestamp:", e)
                chat_history.extend(chat_data["messages"])
        
        chat_history.sort(key=lambda msg: msg['timestamp'])
        return chat_history

