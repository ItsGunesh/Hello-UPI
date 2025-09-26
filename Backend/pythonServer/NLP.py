import pandas as pd
import numpy as np
import re
import spacy
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib   

# Load the SpaCy model
nlp = spacy.load("en_core_web_md")

# Load the dataset
data = pd.read_csv(r'G:\CW\Fourth Year\Hello UPI\Backend\pythonServer\dataset.csv')

# Data Preprocessing
def preprocess_text(text):
    text = text.lower()  # Convert to lowercase
    text = re.sub(r'\d+', '{amount}', text)  # Replace digits with placeholder
    text = re.sub(r'rs|rupees|dollars', '{currency}', text)  # Replace currencies with placeholder
    text = re.sub(r'\b[a-zA-Z]+\b', '{receiver}', text)  # Replace receiver names with placeholder
    return text

data['cleaned_sentence'] = data['sentence'].apply(preprocess_text)

# Features and Labels
X = data['cleaned_sentence']
y = data['label']

# Convert text data to numerical features using embeddings
X_embeddings = np.vstack([nlp(sentence).vector for sentence in X])

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X_embeddings, y, test_size=0.2, random_state=42)

# Train a RandomForest Classifier
model = RandomForestClassifier()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))


joblib.dump(model, "model.pkl")
print("Model saved as model.pkl")

# Function to process new transaction requests
def process_transaction(input_sentence):
    # Preprocess and predict
    input_cleaned = preprocess_text(input_sentence)
    input_vector = nlp(input_cleaned).vector
    prediction = model.predict([input_vector])[0]
    
    if prediction != 1:
        return "Invalid transaction."
    
    # Extract the amount and receiver name
    amount_match = re.search(r'(rs|rupees|dollars)?\s*(\d+)', input_sentence, re.IGNORECASE)  
    receiver_match = re.search(r'(?:send|transfer|pay|give|move|deposit|make a payment of)\s+(?:\d+\s*(?:rs|rupees|dollars)?\s*(?:to\s+)?|to\s+)?([a-zA-Z]+)', input_sentence, re.IGNORECASE)
  
    
    if not amount_match or not receiver_match:
        return "Invalid transaction: Missing amount or receiver."

    amount_str = amount_match.group(2)  
    receiver_str = receiver_match.group(1)  

    return f"Amount = {amount_str}\nReceiver = {receiver_str}\nTransaction processed."

while True:
    input_sentence = input("Enter your transaction request (or type 'exit' to quit): ")
    if input_sentence.lower() == 'exit':
        break
    print(process_transaction(input_sentence))
