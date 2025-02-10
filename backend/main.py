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

@app.post("/api/generate-report")
async def generate_report(report_data: dict):
    reports.append(report_data)
    # ping orchestrator (the real one)
    return {"message": "Report generated successfully"}

@app.get("/api/reports")
async def get_reports():
    return reports
