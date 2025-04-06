from fastapi import FastAPI, Request, Response, HTTPException, BackgroundTasks
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
import re

# Load environment variables
load_dotenv()

app = FastAPI()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demonstration purposes
reports = []

def process_report(report_data: dict, api_key: str, prompt_flow_model_deployment: str, prompt_flow_url: str):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}',
        "azureml-model-deployment": prompt_flow_model_deployment
    }

    print("Received report_data:", report_data)
    
    # Initialize progress fields
    total = len(report_data["testinput"])
    report_data["total_count"] = total
    report_data["processed_count"] = 0
    report_data["testoutput"] = []  # In case it is needed to show progress before complete processing

    # Add the report immediately to in-memory storage so that progress can be polled.
    reports.append(report_data)

    combined_results = []
    for i, test_input in enumerate(report_data["testinput"]):
        print("Processing test_input", i)
        single_input_data = {
            "requestid": report_data["requestid"],
            "reportname": report_data["reportname"],
            "submitdatetime": report_data["submitdatetime"],
            "dataclassification": report_data["dataclassification"],
            "sensitivityclassification": report_data["sensitivityclassification"],
            "testinput": [test_input]
        }

        try:
            response = requests.post(prompt_flow_url, json=single_input_data, headers=headers)

            if response.status_code != 200:
                error_details = {
                    "message": "Error generating report",
                    "status_code": response.status_code,
                    "response_text": response.text
                }
                print("🚨 API Error:", error_details)
                continue

            result = response.json()
            print("✅ API Request Successful!", "Number of input sent: ", len(report_data["testinput"]))
            combined_results.append(result)

        except requests.RequestException as error:
            print("⚠️ Request Exception:", error)
            continue

        # Update the processed count after each input
        report_data["processed_count"] = i + 1
        # Optionally, update testoutput with the latest combined results so far
        report_data["testoutput"] = [item for sublist in combined_results for item in sublist.get("testoutput", [])]

    # Finalize the report
    report_data["testoutput"] = [item for sublist in combined_results for item in sublist.get("testoutput", [])]
    print("Processing complete for report:", report_data["requestid"])



def format_text_with_line_breaks(text):
    result = []
    pattern = re.compile(r'\d\.\s')  # Matches a digit followed by ". " (period and space)
    last_index = 0
    
    # Iterate over each match in the text
    for match in pattern.finditer(text):
        start = match.start()
        # Look at up to 2 characters preceding the match
        preceding = text[max(0, start - 2): start]
        
        # If the match is preceded by "= " or ends with "=" then skip splitting at this match
        if preceding == "= " or preceding.endswith("="):
            continue
        
        # Extract the segment from last_index to the current match start
        segment = text[last_index:start]
        # Replace any "0. " occurrences and trim whitespace
        segment = re.sub(r'0\.\s', '0. ', segment).strip()
        if segment:
            result.append(segment)
        last_index = start

    # Add the last segment from the final match to the end of the text
    remainder = text[last_index:]
    remainder = re.sub(r'0\.\s', '0. ', remainder).strip()
    if remainder:
        result.append(remainder)

    # Join segments with a double newline (or any other separator you prefer)
    return "\n\n".join(result)


@app.post("/api/generate-report")
async def generate_report(report_data: dict, background_tasks: BackgroundTasks):
    api_key = os.getenv("PROMPT_FLOW_KEY")
    prompt_flow_model_deployment = os.getenv("PROMPT_FLOW_MODEL_DEPLOYMENT")
    prompt_flow_url = os.getenv("PROMPT_FLOW_URL")

    if not api_key:
        raise HTTPException(status_code=500, detail="API key is missing. Ensure AZURE_API_KEY is set.")

    background_tasks.add_task(process_report, report_data, api_key, prompt_flow_model_deployment, prompt_flow_url)
    return {"message": "Report generation started", "request_id": report_data["requestid"]}

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
            df = df[['testoutputid', 'result', 'riskstatement', 'testprocedure', 'recommendation', 'citation']]
            df['testprocedure'] = df['testprocedure'].apply(format_text_with_line_breaks)
            df['recommendation'] = df['recommendation'].apply(format_text_with_line_breaks)
            output = io.BytesIO()
            with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
                df.to_excel(writer, index=False, sheet_name='Report')
                worksheet = writer.sheets['Report']
                # Loop through all columns in the DataFrame and adjust the width.
                for idx, col in enumerate(df.columns):
                    # Compute the maximum length between the header and all cells in this column.
                    max_length = max(df[col].astype(str).map(len).max(), len(col)) + 2
                    worksheet.set_column(idx, idx, max_length)
                writer.book.close()
            output.seek(0)
            headers = {
                'Content-Disposition': f'attachment; filename="{report["reportname"]}.xlsx"'
            }
            return StreamingResponse(
                output, 
                headers=headers, 
                media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
    return {"message": "Report not found"}


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}


@app.delete("/api/reports/{request_id}")
async def delete_report(request_id: str):
    global reports
    reports = [report for report in reports if report["requestid"] != request_id]
    return {"message": "Report deleted successfully" if len(reports) < len(reports) else "Report not found"}