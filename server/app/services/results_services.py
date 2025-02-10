from app.models.results_models import ResultsModel

class SaveResultsService:
    @staticmethod
    def save_results(processed_data, questions, answers, email):
        result_id = ResultsModel.save_result(processed_data, questions, answers, email)
        return result_id