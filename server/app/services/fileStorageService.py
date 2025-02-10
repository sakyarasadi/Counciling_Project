import firebase_admin
from firebase_admin import credentials, storage

def upload_file_to_storage(file, filename):
    bucket = storage.bucket()  
    blob = bucket.blob(f"chat_files/{filename}")
    blob.upload_from_file(file)
    blob.make_public()  # Make the file publicly accessible
    return blob.public_url
