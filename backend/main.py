from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Update with your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demonstration purposes
reports = []

# Dummy orchestrator output generator
def dummy_orchestrator(input_json):
    sample = {
        "requestId": f"{input_json['requestId']}",
        "reportName": f"{input_json['reportName']}",
        "submitDate": f"{input_json['submitDateTime']}",
        "testOutput": [
            {
                "testOutputID": "output 1",
                "riskStatement": f"[{input_json['dataClassification']}] generated risk statement 1",
                "testProcedure": "generated test procedure 1",
                "sourceDocumentLink": "reference document link 1",
                "citation": "generated citation 1",
                "result": "generated result 1",
                "recommendation": "generated recommendation 1"
            },
            {
                "testOutputID": "output 2",
                "riskStatement": f"[{input_json['sensitivityClassification']}] generated risk statement 2",
                "testProcedure": "generated test procedure 2",
                "sourceDocumentLink": "reference document link 2",
                "citation": "generated citation 2",
                "result": "generated result 2",
                "recommendation": "generated recommendation 2"
            }
        ]
    }
    return sample

@app.post("/api/generate-report")
async def generate_report(report_data: dict):
    # ping orchestrator (the real one)
    output_json = dummy_orchestrator(report_data)
    reports.append(output_json)

    return {"message": "Report generated successfully"}

@app.get("/api/reports")
async def get_reports():
    return reports

@app.get("/api/reports/{request_id}")
async def get_report_by_id(request_id: str):
    for report in reports:
        if report["requestId"] == request_id:
            return report
    return {"message": "Report not found"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
