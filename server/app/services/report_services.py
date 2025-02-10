from app.models.report_models import UserModel , ReportModel

class UserService:
    @staticmethod
    def fetch_user_data(email: str):
        user_data = UserModel.get_user_by_email(email)
        if user_data:
            return {"success": True, "data": user_data, "message": "User found"}
        else:
            return {"success": False, "data": None, "message": "User not found"}

class ReportService:
    @staticmethod
    def fetch_report_data(email: str):
        report_data = ReportModel.get_report_by_email(email)
        if report_data:
            return {"success": True, "data": report_data, "message": "Report found"}
        else:
            return {"success": False, "data": None, "message": "Report not found"}