from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import re
import spacy
import numpy as np

app = FastAPI()

nlp = spacy.load("en_core_web_md")
model = joblib.load(r"G:\CW\Fourth Year\Hello UPI\Backend\pythonServer\model.pkl")

def preprocess_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'\d+', '{amount}', text)
    text = re.sub(r'rs|rupees|dollars', '{currency}', text)
    text = re.sub(r'\b[a-zA-Z]+\b', '{receiver}', text)
    return text

def process_transaction(input_sentence: str) -> str:
    input_cleaned = preprocess_text(input_sentence)
    input_vector = nlp(input_cleaned).vector
    prediction = model.predict([input_vector])[0]

    if prediction != 1:
        return "Invalid transaction command."

    amount_match = re.search(r'(rs|rupees|dollars)?\s*(\d+)', input_sentence, re.IGNORECASE)
    receiver_match = re.search(r'(?:send|transfer|pay|give|move|deposit|make a payment of)\s+(?:\d+\s*(?:rs|rupees|dollars)?\s*(?:to\s+)?|to\s+)?([a-zA-Z]+)', input_sentence, re.IGNORECASE)

    if not amount_match or not receiver_match:
        return "Invalid transaction command: Missing amount or receiver."

    amount_str = amount_match.group(2)
    receiver_str = receiver_match.group(1)
    
    result = {
        "Amount": amount_str,
        "Receiver": receiver_str,
        "Message": "Transaction processed."
    }
    
    return result

class InputData(BaseModel):
    sentence: str

@app.post("/extract")
def extract(data: InputData):
    result = process_transaction(data.sentence)
    return result
