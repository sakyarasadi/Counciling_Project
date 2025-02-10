from app.models.councilorRequestStatus_model import RequestsModel

class RequestsService:
    @staticmethod
    def get_all_requests(user_email=None):
        model = RequestsModel()
        return model.get_all_requests(user_email)
