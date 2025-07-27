from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

# Create app
app = Flask(__name__)
CORS(app)

# Load the trained model
model = joblib.load('text_mood_model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    description = data.get('description', '')

    if not description:
        return jsonify({'error': 'No description provided'}), 400

    # Predict mood
    pred_proba = model.predict_proba([description.lower().strip()])[0]
    pred_label = model.classes_[pred_proba.argmax()]
    confidence = round(pred_proba.max() * 100, 2)  # Confidence in %

    return jsonify({
        'mood': pred_label,
        'confidence': confidence
    })

if __name__ == "__main__":
    app.run(debug=True)
