from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

# 1. Boot up the AI Brain (Load all saved artifacts)
print("Loading Machine Learning artifacts...")
try:
    model = joblib.load('jee_qualification_model.joblib')
    scaler = joblib.load('jee_scaler.joblib')
    feature_columns = joblib.load('jee_feature_columns.joblib')
    print("✅ AI Engine, Scaler, and Features are loaded and ready.")
except Exception as e:
    print(f"❌ Error loading models: {e}")
    print("Ensure all three .joblib files are in the exact same folder as this script.")

# 2. Initialize the API
app = FastAPI(title="JEE Qualification Predictor API")

# Allow the React frontend to communicate securely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Define the Expected Incoming Data (Data Validation)
class StudentData(BaseModel):
    Category: str
    Physics: float
    Chemistry: float
    Math: float

# 4. Create the Prediction Endpoint
@app.post("/predict")
def predict_qualification(data: StudentData):
    try:
        # Step A: Initialize a blank dictionary matching the exact columns the AI was trained on
        input_dict = {col: 0 for col in feature_columns}
        
        # Step B: Insert the numerical marks
        input_dict['Physics'] = data.Physics
        input_dict['Chemistry'] = data.Chemistry
        input_dict['Math'] = data.Math
        
        # Step C: Handle the One-Hot Encoded Category dynamically
        category_col = f"Category_{data.Category}"
        if category_col in input_dict:
            input_dict[category_col] = 1
        else:
            raise HTTPException(status_code=400, detail=f"Invalid Category provided: {data.Category}")
            
        # Step D: Convert to Pandas DataFrame
        df = pd.DataFrame([input_dict])
        
        # Step E: SCALE the numerical features using your loaded scaler!
        df[['Physics', 'Chemistry', 'Math']] = scaler.transform(df[['Physics', 'Chemistry', 'Math']])
        
        # Step F: Ask the AI for the Prediction and Probability
        prediction = model.predict(df)[0]
        probability = model.predict_proba(df)[0][1] 
        
        # Step G: Return the final JSON package
        total = data.Physics + data.Chemistry + data.Math
        
        return {
            "total_marks": total,
            "qualified": bool(prediction),
            "probability": round(probability * 100, 2),
            "message": "Qualified for JEE Advanced" if prediction == 1 else "Not Qualified"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))