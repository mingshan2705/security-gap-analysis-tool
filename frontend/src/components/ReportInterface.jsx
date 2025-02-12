import React, { useEffect, useState } from "react";

function ReportInterface({ requestId, onGenerateReport }) {
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (requestId) {
      fetch(`http://localhost:8000/api/reports/${requestId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched report:", data);
          setReport(data);
        });
    } else {
      setReport(null);
    }
  }, [requestId]);

  const handleDownloadReport = () => {
    fetch(`http://localhost:8000/api/reports/${requestId}/download`)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        const date = new Date(report.submitDate);
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        link.setAttribute('download', `${report.reportName}_${formattedDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      });
  };

  return (
    <div className="flex flex-col w-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Security Gap Analysis Report</h2>
        {requestId && (
          <button
            onClick={handleDownloadReport}
            className="ml-4 rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
          >
            Download Report
          </button>
        )}
      </div>
      {report ? (
        <div className="flex-grow p-6 border rounded-lg shadow-lg bg-white">
          <h3 className="text-xl font-semibold mb-2">{report.reportName}</h3>
          <p className="mb-1"><strong>Request ID:</strong> {report.requestId}</p>
          <p className="mb-4"><strong>Date Requested:</strong> {new Date(report.submitDate).toLocaleString()}</p>
          <h4 className="text-lg font-semibold mb-2">Report Data</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white mt-2 border">
              <thead>
                <tr>
                  {Object.keys(report.testOutput[0]).filter(key => key !== 'testOutputID').map((key) => (
                    <th key={key} className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.testOutput.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.entries(row).filter(([key]) => key !== 'testOutputID').map(([key, value], colIndex) => (
                      <td key={colIndex} className="py-2 px-4 border-b border-gray-200 text-sm">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !requestId && <div className="text-gray-500">Please generate a report or visit recent reports to display.</div>
      )}
    </div>
  );
}

export default ReportInterface;
