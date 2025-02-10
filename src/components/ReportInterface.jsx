import React, { useEffect, useState } from "react";

function ReportInterface({ setCurrResponse }) {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/reports")  // Update with your backend's URL and port
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched reports:", data);  // Log fetched reports
        setReports(data);
        if (data.length > 0) {
          setCurrResponse(data[data.length - 1]);
        }
      });
  }, [setCurrResponse]);

  return (
    <div className="w-3/4 p-4">
      <h2 className="text-xl font-bold">Reports</h2>
      {reports.map((report, index) => (
        <div key={index} className="mb-4 p-4 border rounded">
          <h3 className="text-lg font-semibold">{report.reportName}</h3>
          <pre>{JSON.stringify(report, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}

export default ReportInterface;
