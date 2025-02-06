from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy

app = Flask(__name__)
CORS(app)

nlp = spacy.load("D:/EXE.lk/Exe Github/counseling-platform/API2/API2/model-last")

condition_thresholds = {
    "anxiety": [0, 1],
    "schizophrenia": [2, 3],
    "depression": [4, 5],
    "stress": [6, 7],
    "bipolar": [8, 9]
}

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    answers = data.get('answers', [])
    print(answers)

    if not isinstance(answers, list):
        return jsonify({"error": "Answers must be provided as a list."}), 400
    
    if len(answers) != 10:
        return jsonify({"error": "Exactly 10 answers are required."}), 400
    
    # Check for empty or invalid answers
    if any(not isinstance(answer, str) or not answer.strip() for answer in answers):
        return jsonify({"error": "All answers must be non-empty strings."}), 400

    detailed_results = {}

    for condition, indices in condition_thresholds.items():
        for index in indices:
            pos_count, neg_count = analyze_answer(answers[index], condition)

            detailed_results[f"{condition}_answer_{index + 1}"] = {
                "positive_word_count": pos_count,
                "negative_word_count": neg_count,
            }

    return jsonify({"detailed_results": detailed_results})

def analyze_answer(answer, condition):
    """Analyze an answer and return the count of positive and negative words."""
    doc = nlp(answer)
    positive_count = 0
    negative_count = 0

    for ent in doc.ents:
        if ent.label_ == f"{condition.upper()}_POSITIVE":
            positive_count += 1
        elif ent.label_ == f"{condition.upper()}_NEGATIVE":
            negative_count += 1

    return positive_count, negative_count

if __name__ == '__main__':
    app.run(debug=True, port=5001)


