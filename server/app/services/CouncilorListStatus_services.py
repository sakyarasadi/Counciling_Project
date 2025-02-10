from app.models.CouncilorListStatus_models import RequestModel

def update_request_status_service(request_id, counselor_email, status):
    try:
        success, message = RequestModel.update_request_status(request_id, counselor_email, status)
        return success, message
    except Exception as e:
        return False, str(e)
