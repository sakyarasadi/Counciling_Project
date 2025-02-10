from flask import jsonify, Blueprint, request
from app.services.results_services import SaveResultsService

results_bp = Blueprint('results', __name__)

@results_bp.route('/save-results', methods=['POST'])
def save_results():
    data = request.json
    print(data)  
    
    processed_data = data.get('processedData', {})
    questions = data.get('questions', [])
    answers = data.get('answers', [])
    email = data.get('email')

    print(f"Token: {email}")

    if email:
        result_id = SaveResultsService.save_results(processed_data, questions, answers, email)

        response_data = {
            "response": {
                "success": True,
                "data": {
                    "result_id": result_id,
                    "processed_data": processed_data
                },
                "message": {
                    "title": "Success",
                    "message": "Data saved successfully"
                },
                "meta": "some_meta_info",  
                "errors": None,
                "status": 200
            }
        }

        return jsonify(response_data), 200
    else:
        response_data = {
            "response": {
                "success": False,
                "data": {},
                "message": {
                    "title": "Error",
                    "message": "Token is missing"
                },
                "meta": "",
                "errors": "Token is required",
                "status": 400
            }
        }

        return jsonify(response_data), 400
