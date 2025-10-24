from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from deepface import DeepFace
import joblib
import re
import spacy
import numpy as np
import tempfile
import os

app = FastAPI()

model = joblib.load(r"G:\CW\Fourth Year\Hello UPI\Backend\pythonServer\nlp_model.pkl")
vectorizer = joblib.load(r"G:\CW\Fourth Year\Hello UPI\Backend\pythonServer\vectorizer.pkl")

def process_transaction(input_sentence: str):
    input_cleaned = input_sentence.lower().strip()
    input_vector = vectorizer.transform([input_cleaned])

    prediction = model.predict(input_vector)[0]

    if prediction != 1:
        return {"Message": "Invalid transaction command."}

    amount_match = re.search(r'(\d+)\s*(rs|rupees|dollars)?', input_sentence, re.IGNORECASE)
    receiver_match = re.search(
        r'(?:send|transfer|pay|give|move|deposit|make a payment of)\s+'
        r'(?:(?:\d+\s*(?:rs|rupees|dollars)?\s*(?:to\s+)?)|(?:to\s+))?'
        r'([a-zA-Z]+(?:\s+[a-zA-Z]+)*)',
        input_sentence,
        re.IGNORECASE
    )

    if not amount_match or not receiver_match:
        return {"Message": "Invalid transaction command: Missing amount or receiver."}

    amount = amount_match.group(1)
    receiver = receiver_match.group(1).strip().title()

    return {
        "Amount": amount,
        "Receiver": receiver,
        "Message": "Transaction processed successfully."
    }


class InputData(BaseModel):
    sentence: str


@app.post("/extract")
def extract(data: InputData):
    result = process_transaction(data.sentence)
    return result





REFERENCE_FACE_PATH = "DP.jpg"


@app.post("/recognise")
async def verify_face(file: UploadFile = File(...)):

    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
    temp_file.write(await file.read())
    temp_file.close()

    try:
        result = DeepFace.verify(
            img1_path=REFERENCE_FACE_PATH,
            img2_path=temp_file.name,
            enforce_detection=False
        )

        verified = result.get("verified", False)
        return {
            "verified": verified,
            "distance": result.get("distance"),
            "model": result.get("model"),
            "status": "Face recognized!" if verified else "Face not matched."
        }

    except Exception as e:
        return {"error": str(e)}

    finally:
        os.remove(temp_file.name)
