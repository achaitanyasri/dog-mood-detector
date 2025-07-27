# dog-mood-detector🐾

A web application that detects your dog's mood from an image or a description of its behavior. Built with React (frontend) and Flask (backend), using a machine learning model trained on real dog behavior data.

## Features

- **Image Upload:** Detect your dog's mood from a photo (powered by Nyckel API).
- **Behavior Description:** Enter a description or select example behaviors to predict mood using a custom-trained ML model.
- **Mood Suggestions:** Get personalized suggestions based on detected mood.

## Project Structure

```
app.py
train_model.py
dog_behavior_dataset.csv
text_mood_model.pkl
/ public
    index.html
/ src
    App.js
    App.css
    App.test.js
    index.css
    index.js
    reportWebvitals.js
    setupTest.js
    components/
        ImageUploader.js
        EmotionBar.js
        MoodResult.js
    ...
```

## Getting Started

### Prerequisites

- Python 3.7+
- Node.js & npm

### Backend Setup (Flask)

1. **Install dependencies:**
    ```sh
    pip install flask flask-cors scikit-learn pandas joblib
    ```

2. **Train the model (optional, already included):**
    ```sh
    python train_model.py
    ```

3. **Run the Flask server:**
    ```sh
    python app.py
    ```
    The backend will be available at `http://localhost:5000`.

### Frontend Setup (React)

1. **Install dependencies:**
    ```sh
    npm install
    ```

2. **Build for production:**
    ```sh
    npm run build
    ```
    This will generate a production-ready build in the `build/` folder.

3. **Start the React app:**
    ```sh
    npm start
    ```
    The frontend will run at `http://localhost:3000`.

## Usage

- **Upload Image:** Select an image of your dog to detect its mood.
- **Describe Behavior:** Type a description or choose example behaviors to predict mood.
- **See Results:** The app displays the detected mood, confidence, and suggestions.

## Model Training

- The model is trained on [`train_model.py`](train_model.py) using scikit-learn's `TfidfVectorizer` and `LogisticRegression`.
- Training scripts: [`train_model.py`](train_model.py)

## API

- **POST** `/predict`
    - Request: `{ "description": "Your dog's behavior description" }`
    - Response: `{ "mood": "Happy", "confidence": 97.5 }`

---

Built by Chaitanya • Powered by React & Flask
