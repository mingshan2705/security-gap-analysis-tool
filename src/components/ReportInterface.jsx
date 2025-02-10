import React, { useEffect, useState } from "react";

function ReportInterface({ requestId }) {
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (requestId) {
      fetch(`http://localhost:8000/api/reports/${requestId}`)  // Update with your backend's URL and port
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched report:", data);  // Log fetched report
          setReport(data);
        });
    } else {
      setReport(null);
    }
  }, [requestId]);

  return (
    <div className="w-3/4 p-4">
      <h2 className="text-xl font-bold">Report</h2>
      {report ? (
        <div className="mb-4 p-4 border rounded">
          <h3 className="text-lg font-semibold">{report.reportName}</h3>
          <pre>{JSON.stringify(report, null, 2)}</pre>
        </div>
      ) : (
        !requestId && <div className="text-gray-500">Please generate a report or visit recent reports to display.</div>
      )}
    </div>
  );
}

export default ReportInterface;
