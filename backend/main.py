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

# Dummy orchestrator output generator
# def dummy_orchestrator(input_json):
#     sample = {
#         "requestId": f"{input_json['requestId']}",
#         "reportName": f"{input_json['reportName']}",
#         "submitDate": f"{input_json['submitDateTime']}",
#         "testOutput": [
#             {
#                 "riskStatement": f"[{input_json['dataClassification']}] generated risk statement 1",
#                 "testProcedure": "generated test procedure 1",
#                 "sourceDocumentLink": "reference document link 1",
#                 "citation": "generated citation 1",
#                 "result": "generated result 1",
#                 "recommendation": "generated recommendation 1"
#             },
#             {
#                 "riskStatement": f"[{input_json['sensitivityClassification']}] generated risk statement 2",
#                 "testProcedure": "generated test procedure 2",
#                 "sourceDocumentLink": "reference document link 2",
#                 "citation": "generated citation 2",
#                 "result": "generated result 2",
#                 "recommendation": "generated recommendation 2"
#             }
#         ]
#     }
#     return sample

@app.post("/api/generate-report")
async def generate_report(report_data: dict):
    # url = 'https://amlgenai4auditorstemp-endpoint.southeastasia.inference.ml.azure.com/score'

    # Get API key from environment variable
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

    try:
        # Send request with `requests`
        response = requests.post(prompt_flow_url, json=report_data, headers=headers)

        # If API request fails, raise HTTPException
        if response.status_code != 200:
            error_details = {
                "message": "Error generating report",
                "status_code": response.status_code,
                "response_text": response.text
            }
            print("🚨 API Error:", error_details)  # Debugging
            raise HTTPException(status_code=response.status_code, detail=error_details)

        # Parse JSON response
        result = response.json()
        print("✅ API Request Successful!", result)  # Debugging

        reports.append(result)  # Store report in memory

        return {"message": "Report generated successfully", "data": result}

    except requests.RequestException as error:
        print("⚠️ Request Exception:", error)
        raise HTTPException(status_code=500, detail="Request failed. Check backend logs for details.")
    # output_json = dummy_orchestrator(report_data)
    # reports.append(output_json)

    

@app.get("/api/reports")
async def get_reports():
    return reports

@app.get("/api/reports/{request_id}")
async def get_report_by_id(request_id: str):
    for report in reports:
        if report["requestId"] == request_id:
            return report
    return {"message": "Report not found"}

@app.get("/api/reports/{request_id}/download")
async def download_report(request_id: str):
    for report in reports:
        if report["requestId"] == request_id:
            df = pd.DataFrame(report["testOutput"])
            output = io.BytesIO()
            with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
                df.to_excel(writer, index=False, sheet_name='Report')
                writer.book.close()  # Ensure the workbook is properly closed
            output.seek(0)
            submit_date = pd.to_datetime(report["submitDate"]).strftime('%d-%m-%Y')
            headers = {
                'Content-Disposition': f'attachment; filename="{report["reportName"]}_{submit_date}.xlsx"'
            }
            return StreamingResponse(output, headers=headers, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    return {"message": "Report not found"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}