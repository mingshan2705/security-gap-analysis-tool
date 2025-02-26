from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
import urllib.request
import json
import os
import ssl
import requests

# Load environment variables
load_dotenv()

app = FastAPI()

# Allow CORS for your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demonstration purposes
reports = []

@app.post("/api/generate-report")
async def generate_report(report_data: dict):
    api_key = os.getenv("PROMPT_FLOW_KEY")
    prompt_flow_model_deployment = os.getenv("PROMPT_FLOW_MODEL_DEPLOYMENT")
    prompt_flow_url = os.getenv("PROMPT_FLOW_URL")

    if not api_key:
        raise HTTPException(status_code=500, detail="API key is missing. Ensure AZURE_API_KEY is set.")

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}',
        "azureml-model-deployment": prompt_flow_model_deployment
    }

    report_data["status"] = "in progress"
    reports.append(report_data)

    try:
        response = requests.post(prompt_flow_url, json=report_data, headers=headers)

        if response.status_code != 200:
            error_details = {
                "message": "Error generating report",
                "status_code": response.status_code,
                "response_text": response.text
            }
            print("🚨 API Error:", error_details)
            report_data["status"] = "error"
            raise HTTPException(status_code=response.status_code, detail=error_details)

        result = response.json()
        print("✅ API Request Successful!", result)

        report_data.update(result)
        report_data["status"] = "completed"

        return {"message": "Report generated successfully", "data": result}

    except requests.RequestException as error:
        print("⚠️ Request Exception:", error)
        report_data["status"] = "error"
        raise HTTPException(status_code=500, detail="Request failed. Check backend logs for details.")

@app.get("/api/reports")
async def get_reports():
    return reports

@app.get("/api/reports/{request_id}")
async def get_report_by_id(request_id: str):
    for report in reports:
        if report["requestid"] == request_id:
            return report
    return {"message": "Report not found"}

@app.get("/api/reports/{request_id}/download")
async def download_report(request_id: str):
    for report in reports:
        if report["requestid"] == request_id:
            df = pd.DataFrame(report["testoutput"])
            output = io.BytesIO()
            with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
                df.to_excel(writer, index=False, sheet_name='Report')
                writer.book.close()
            output.seek(0)
            submit_date = pd.to_datetime(report["submitdatetime"]).strftime('%d-%m-%Y')
            headers = {
                'Content-Disposition': f'attachment; filename="{report["reportname"]}_{submit_date}.xlsx"'
            }
            return StreamingResponse(output, headers=headers, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    return {"message": "Report not found"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}