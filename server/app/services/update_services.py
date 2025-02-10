from app.models.update_models import CounselorModel

class CounselorService:
    def __init__(self):
        self.model = CounselorModel()

    def update_counselor(self, email: str, data: dict):
        # Exclude fields that should not be updated
        update_fields = {k: v for k, v in data.items() if k not in ["email", "password", "counselorId"]}
        
        # Pass the email and filtered data to the model for updating
        return self.model.update_counselor(email, update_fields)
