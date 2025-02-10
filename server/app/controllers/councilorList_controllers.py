from flask import Blueprint, jsonify, request
from app.services.councilorList_services import RequestsService

requestsAllList_controller = Blueprint('requestsAllList_controller', __name__)

@requestsAllList_controller.route('/requestsList', methods=['GET'])
def get_all_requests():
    try:
        counselorEmail = request.headers.get('X-User-Email')
        data = RequestsService.get_all_requests(counselorEmail)
        
        if data:
            response = {
                'success': True,
                'data': data,
                'message': {
                    'title': 'Success',
                    'message': 'Requests fetched successfully.'
                },
                'meta': '',
                'errors': None,
                'status': 200
            }
        else:
            response = {
                'success': False,
                'data': [],
                'message': {
                    'title': 'No Data',
                    'message': 'No data found.'
                },
                'meta': '',
                'errors': None,
                'status': 404
            }

        return jsonify({'response': response}), response['status']

    except Exception as e:
        response = {
            'success': False,
            'data': [],
            'message': {
                'title': 'Error',
                'message': str(e)
            },
            'meta': '',
            'errors': None,
            'status': 500
        }
        return jsonify({'response': response}), 500
        
