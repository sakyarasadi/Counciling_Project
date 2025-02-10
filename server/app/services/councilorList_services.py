from app.models.councilorList_model import RequestsModel

class RequestsService:
    @staticmethod
    def get_all_requests(counselorEmail=None):
        model = RequestsModel()
        return model.get_all_requests(counselorEmail)

    