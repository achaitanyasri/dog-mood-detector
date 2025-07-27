# File: train_model.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib

# 1. Load the CSV
data = pd.read_csv('dog_behavior_dataset.csv')

# 2. Preprocessing
data['description'] = data['description'].str.lower().str.strip()

# 3. Split into X and y
X = data['description']
y = data['mood']

# 4. Train-Test Split (for evaluation)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 5. Create a Pipeline
model = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', LogisticRegression(max_iter=1000, random_state=42))
])

# 6. Train the Model
model.fit(X_train, y_train)

# 7. Save the Model and Vectorizer
joblib.dump(model, 'text_mood_model.pkl')

print("\n✅ Model trained and saved as 'text_mood_model.pkl'!")

# Optional: Evaluate quickly
print("\nValidation Accuracy:", model.score(X_test, y_test))
