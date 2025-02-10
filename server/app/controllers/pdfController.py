import firebase_admin
from firebase_admin import credentials, storage
from flask import Blueprint, jsonify, request , send_file
from flask_cors import CORS
import os
import tempfile

pdf_bp = Blueprint('pdf_bp', __name__)

@pdf_bp.route("/api/upload-pdf", methods=["POST"])
def upload_pdf():
    if "file" not in request.files:
        return jsonify({"success": False, "message": "No file provided."}), 400

    file = request.files["file"]
    email = request.form.get("email")
    if not email:
        return jsonify({"success": False, "message": "Email is required."}), 400

    try:
        bucket = storage.bucket()
        blobs = list(bucket.list_blobs(prefix=f"pdf_file/{email}_"))
        
        # Find the highest suffix for existing files
        max_suffix = 0
        for blob in blobs:
            filename = blob.name.split("/")[-1]  # Extract filename
            if filename.startswith(email) and "_user_details" in filename:
                try:
                    suffix = int(filename.split("_")[-3])  # Get the numeric suffix
                    max_suffix = max(max_suffix, suffix)
                except ValueError:
                    continue

        # Increment the suffix for the new file
        new_suffix = max_suffix + 1
        filename = f"{email}_{new_suffix}_user_details.pdf"
        blob = bucket.blob(f"pdf_file/{filename}")
        blob.upload_from_file(file.stream, content_type="application/pdf")
        blob.make_public()
        public_url = blob.public_url

        return jsonify({"success": True, "message": "File uploaded.", "url": public_url})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@pdf_bp.route("/api/downloadpdf", methods=["GET"])
def download_pdf():
    email = request.args.get("email")
    if not email:
        return jsonify({"success": False, "message": "Email is required."}), 400

    try:
        bucket = storage.bucket()
        blobs = list(bucket.list_blobs(prefix=f"pdf_file/{email}_"))
        
        # Find the latest uploaded file by suffix
        max_suffix = 0
        latest_blob = None
        for blob in blobs:
            filename = blob.name.split("/")[-1]  # Extract filename
            if filename.startswith(email) and "_user_details" in filename:
                try:
                    suffix = int(filename.split("_")[-3])  # Get the numeric suffix
                    if suffix > max_suffix:
                        max_suffix = suffix
                        latest_blob = blob
                except ValueError:
                    continue

        if not latest_blob:
            return jsonify({"success": False, "message": "No files found for the given email."}), 404

        # Download the latest file to a temporary directory
        filename = latest_blob.name.split("/")[-1]
        temp_dir = tempfile.gettempdir()
        temp_file = os.path.join(temp_dir, filename)
        latest_blob.download_to_filename(temp_file)

        response = send_file(temp_file, as_attachment=True, download_name=filename, mimetype="application/pdf")
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Credentials", "true")

        return response
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
