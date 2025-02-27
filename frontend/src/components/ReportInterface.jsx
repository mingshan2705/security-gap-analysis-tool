import React, { useEffect, useState } from "react";

function ReportInterface({ requestId, onGenerateReport }) {
  const [reports, setReports] = useState({});
  const [loadingStates, setLoadingStates] = useState({});

  useEffect(() => {
    if (requestId) {
      if (!loadingStates[requestId]) {
        setLoadingStates((prev) => ({ ...prev, [requestId]: "in progress" }));
        const fetchReport = async () => {
          let checker;
          let running = true;

          setTimeout(() => {
            running = false
          }, 60000)
          while (running) {
            try {
              const response = await fetch(
                `https://sga-backend1-ekdwgybbecgbedhk.southeastasia-01.azurewebsites.net/api/reports/${requestId}`,
                { mode: "cors" }
              );
              if (!response.ok) {
                throw new Error("Failed to fetch report");
              }
              const data = await response.json();
              console.log("Fetched report:", data);
              checker = data;
            } catch (error) {
              setLoadingStates((prev) => ({ ...prev, [requestId]: "failed" }));
              break;
            }
            if (checker && checker.message && checker.message === "Report not found") {
              continue;
            }
            setReports((prev) => ({ ...prev, [requestId]: checker }));
            setLoadingStates((prev) => ({ ...prev, [requestId]: "completed" }));
            break;
          }
        };
        fetchReport();
      } else if (loadingStates[requestId] === "completed") {
        setReports((prev) => ({ ...prev, [requestId]: reports[requestId] }));
      }
    } else {
      setReports({});
      setLoadingStates({});
    }
  }, [requestId]);

  const handleDownloadReport = () => {
    fetch(
      `https://sga-backend1-ekdwgybbecgbedhk.southeastasia-01.azurewebsites.net/api/reports/${requestId}/download`,
      { mode: "cors" }
    )
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        const report = reports[requestId]; // Get the specific report
        const date = new Date(report.submitdate);
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        link.setAttribute("download", `${report.reportname}_${formattedDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      });
  };

  const currentReport = reports[requestId];
  const currentLoadingState = loadingStates[requestId];

  return (
    <div className="flex flex-col w-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Security Gap Analysis Report</h2>
        {requestId && currentLoadingState === "completed" && (
          <button
            onClick={handleDownloadReport}
            className="ml-4 rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
          >
            Download Report
          </button>
        )}
      </div>
      {currentLoadingState === "in progress" && (
        <div className="flex justify-center items-center">
          <div className="loader"></div>
          <p className="ml-4">Report generation in progress...</p>
        </div>
      )}
      {currentLoadingState === "failed" && (
        <div className="text-red-500">Failed to generate report. Please try again.</div>
      )}
      {currentLoadingState === "completed" && currentReport ? (
        <div className="flex-grow p-6 border rounded-lg shadow-lg bg-white">
          <h3 className="text-xl font-semibold mb-2">{currentReport.reportname}</h3>
          <p className="mb-1">
            <strong>Request ID:</strong> {currentReport.requestid}
          </p>
          <p className="mb-4">
            <strong>Date Requested:</strong> {new Date(currentReport.submitdatetime).toLocaleString()}
          </p>
          <h4 className="text-lg font-semibold mb-2">Report Data</h4>
          <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(currentReport, null, 2)}</pre>
        </div>
      ) : (
        !requestId && (
          <div className="text-gray-500">Please generate a report or visit recent reports to display.</div>
        )
      )}
    </div>
  );
}

export default ReportInterface;