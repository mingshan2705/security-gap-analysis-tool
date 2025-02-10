import React, { useEffect, useState } from "react";

function ReportInterface({ requestId, onGenerateReport }) {
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

  const handleDownloadReport = () => {
    // Logic to download the report
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = `${report.reportName}.json`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="w-3/4 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Security Gap Analysis Report</h2>
        {requestId && (
          <button
            onClick={handleDownloadReport}
            className="ml-4 rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
          >
            Download
          </button>
        )}
      </div>
      {report ? (
        <div className="mb-4 p-6 border rounded-lg shadow-lg bg-white">
          <h3 className="text-xl font-semibold mb-2">{report.reportName}</h3>
          <p className="mb-1"><strong>Request ID:</strong> {report.requestId}</p>
          {/* <p className="mb-1"><strong>Data Classification:</strong> {report.dataClassification}</p>
          <p className="mb-1"><strong>Sensitivity Classification:</strong> {report.sensitivityClassification}</p> */}
          <p className="mb-4"><strong>Date Requested:</strong> {new Date(report.submitDate).toLocaleString()}</p>
          <h4 className="text-lg font-semibold mb-2">Report Data</h4>
          <table className="min-w-full bg-white mt-2 border">
            <thead>
              <tr>
                {Object.keys(report.testOutput[0]).map((key) => (
                  <th key={key} className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.testOutput.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value, colIndex) => (
                    <td key={colIndex} className="py-2 px-4 border-b border-gray-200 text-sm">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !requestId && <div className="text-gray-500">Please generate a report or visit recent reports to display.</div>
      )}
    </div>
  );
}

export default ReportInterface;
