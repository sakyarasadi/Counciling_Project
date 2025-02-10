import firebase_admin
from firebase_admin import credentials, storage
from flask import Blueprint, jsonify, request
from flask_cors import CORS

userpropic_bp = Blueprint('userpropic_bp', __name__)

@userpropic_bp.route("/api/userpropic", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"success": False, "message": "No file provided."}), 400

    file = request.files["file"]
    email = request.form.get("email")
    if not email:
        return jsonify({"success": False, "message": "Email is required."}), 400

    try:
        bucket = storage.bucket()
        # Find the current max version
        blobs = list(bucket.list_blobs(prefix=f"userpropic_files/{email}/"))
        existing_versions = [
            int(blob.name.split('_')[-1].split('.')[0])
            for blob in blobs if blob.name.split('_')[-1].split('.')[0].isdigit()
        ]
        next_version = max(existing_versions, default=0) + 1

        # Upload the file with the next version
        filename = f"{email}_{next_version}.png"
        blob = bucket.blob(f"userpropic_files/{email}/{filename}")
        blob.upload_from_file(file.stream, content_type=file.content_type)
        blob.make_public()
        public_url = blob.public_url

        return jsonify({"success": True, "message": "File uploaded.", "url": public_url})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@userpropic_bp.route("/api/userpropic", methods=["GET"])
def get_profile_picture():
    email = request.args.get("email")
    if not email:
        return jsonify({"success": False, "message": "Email is required."}), 400

    try:
        bucket = storage.bucket()
        blobs = list(bucket.list_blobs(prefix=f"userpropic_files/{email}/"))
        if not blobs:
            return jsonify({"success": False, "message": "Profile picture not found."}), 404

        # Sort blobs by version
        blobs.sort(key=lambda blob: int(blob.name.split('_')[-1].split('.')[0]), reverse=True)
        last_uploaded = blobs[0]
        public_url = last_uploaded.public_url

        return jsonify({"success": True, "url": public_url})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
