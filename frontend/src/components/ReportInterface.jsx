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
        const date = new Date(report.submitdatetime);
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
          <p className="mb-4"><strong>Date Requested:</strong> {new Date(report.submitdatetime).toLocaleString()}</p>
          <h4 className="text-lg font-semibold mb-2">Report Data</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white mt-2 border">
              <thead>
                <tr>
                  {Object.keys(report.testoutput[0]).filter(key => key !== 'testoutputid').map((key) => (
                    <th key={key} className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.testoutput.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.entries(row).filter(([key]) => key !== 'testoutputid').map(([key, value], colIndex) => (
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
