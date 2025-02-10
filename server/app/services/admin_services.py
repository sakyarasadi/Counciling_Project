from app.models.admin_model import ApprovalModel
from app.models.admin_model import usersModel
from app.models.admin_model import ApprovalDeleteModel
from app.models.admin_model import ApprovedPersonModel

class ApprovalService:
    def __init__(self):
        self.approval_model = ApprovalModel()

    def fetch_approved_counselors(self):
        return self.approval_model.get_approved_counselors()
    
    def update_counselor_status(self, email, status, reason=None):
        return self.approval_model.update_status(email, status, reason)


class usersService:
    @staticmethod
    def get_all_users():
        try:
            users = usersModel.find_all()
            return users
        except Exception as e:
            raise Exception(f"Error fetching users: {e}")

class ApprovalDeleteService:
    def __init__(self):
        self.approval_model = ApprovalDeleteModel()

    def fetch_approvalDelete_counselors(self):
        return self.approval_model.get_approvalDelete_counselors()

class ApprovedPersonService:
    def __init__(self):
        self.approvedPerson_model = ApprovedPersonModel()

    def fetch_approvedPerson_counselors(self):
        return self.approvedPerson_model.get_approvedPerson_counselors()



