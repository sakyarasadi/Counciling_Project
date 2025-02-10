from app.models.ConcilorRequest_models import RequestModel

class RequestService:
    def __init__(self):
        self.request_model = RequestModel()

    def create_request(self, counselor_fullname, counselor_email, user_fullname, user_email, status=0):
        request_data = {
            "counselorFullname": counselor_fullname,
            "counselorEmail": counselor_email,
            "userFullname": user_fullname,
            "userEmail": user_email,
            "status": status,
        }

        doc_ref = self.request_model.create_request(request_data)
        if doc_ref:
            return {"success": True, "message": "Request created successfully."}
        else:
            return {"success": False, "message": "Failed to create request."}
