# File: train_behavior_model.py

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
import joblib

# Step 1: Load Dataset
df = pd.read_csv('dog_behavior_dataset.csv')

# Step 2: Separate Features and Labels
X = df['description']
y = df['mood']

# Step 3: Create Pipeline (TF-IDF + Logistic Regression)
model = make_pipeline(
    TfidfVectorizer(),
    LogisticRegression(max_iter=1000)
)

# Step 4: Train Model
model.fit(X, y)

# Step 5: Save Trained Model
joblib.dump(model, 'behavior_mood_model.pkl')

print("✅ Model trained and saved as 'behavior_mood_model.pkl'")
