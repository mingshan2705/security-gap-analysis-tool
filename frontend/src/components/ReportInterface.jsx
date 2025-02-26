import React, { useEffect, useState } from "react";

function ReportInterface({ requestId, onGenerateReport }) {
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (requestId) {
      fetch(`https://sga-backend1-ekdwgybbecgbedhk.southeastasia-01.azurewebsites.net/api/reports/${requestId}`, {
        mode: 'cors'
      })
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
    fetch(`https://sga-backend1-ekdwgybbecgbedhk.southeastasia-01.azurewebsites.net/api/reports/${requestId}/download`, {
      mode: 'cors'
    })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        const date = new Date(report.submitdate);
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        link.setAttribute('download', `${report.reportname}_${formattedDate}.xlsx`);
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
          <h3 className="text-xl font-semibold mb-2">{report.reportname}</h3>
          <p className="mb-1"><strong>Request ID:</strong> {report.requestid}</p>
          <p className="mb-4"><strong>Date Requested:</strong> {new Date(report.submitdate).toLocaleString()}</p>
          <h4 className="text-lg font-semibold mb-2">Report Data</h4>
          <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(report, null, 2)}</pre>
        </div>
      ) : (
        !requestId && <div className="text-gray-500">Please generate a report or visit recent reports to display.</div>
      )}
    </div>
  );
}

export default ReportInterface;
