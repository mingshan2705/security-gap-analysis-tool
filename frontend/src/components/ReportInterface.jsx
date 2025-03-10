import React, { useEffect, useState } from "react";

function ReportInterface({ requestId, onGenerateReport }) {
  const [reports, setReports] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [viewMode, setViewMode] = useState("table"); // Default to "table" view
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (requestId) {
      if (!loadingStates[requestId]) {
        setLoadingStates((prev) => ({ ...prev, [requestId]: "in progress" }));
        const fetchReport = async () => {
          let checker;
          let running = true;

          setTimeout(() => {
            running = false;
          }, 6000000);
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
              await new Promise((resolve) => setTimeout(resolve, 40000));
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

  const formatTextWithLineBreaks = (text) => {
    return text.split(/(?=\d\.\s)/).map((line, index) => (
      <p key={index} className="mb-2">
        {line.replace(/0\.\s/g, '0. ').trim()}
      </p>
    ));
  };

  const renderTable = (data) => {
    const keys = ["ID", "Result", "Risk Statement", "Test Procedure", "Recommendation"];
    return (
      <div className="overflow-auto max-h-[60vh]">
        <table className="min-w-full bg-white mt-2 border">
          <thead>
            <tr>
              {keys.map((key) => (
                <th
                  key={key}
                  className={`py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 ${
                    key === "Risk Statement" ? "w-1/6" : ""
                  }`}
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {keys.map((key) => (
                  <td key={key} className="py-2 px-4 border-b border-gray-200 text-sm">
                    {key === "ID" ? (
                      <div
                        onMouseEnter={(e) => {
                          setTooltipContent(row.citation);
                          setTooltipPosition({ top: e.clientY + 10, left: e.clientX + 10 });
                        }}
                        onMouseLeave={() => setTooltipContent(null)}
                      >
                        {row.testoutputid}
                      </div>
                    ) : key === "Recommendation" || key === "Test Procedure" ? (
                      formatTextWithLineBreaks(row[key.toLowerCase().replace(" ", "")])
                    ) : (
                      row[key.toLowerCase().replace(" ", "")]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {tooltipContent && (
          <div
            className="fixed bg-white p-2 border rounded shadow-lg"
            style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
          >
            {tooltipContent}
          </div>
        )}
      </div>
    );
  };

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
          <div className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
          <p className="ml-4">Loading Report...</p>
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
          <div className="mb-4">
            <button
              onClick={() => setViewMode("json")}
              className={`mr-2 px-4 py-2 rounded ${viewMode === "json" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            >
              JSON View
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 rounded ${viewMode === "table" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
            >
              Table View
            </button>
          </div>
          {viewMode === "json" ? (
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[60vh]">{JSON.stringify(currentReport, null, 2)}</pre>
          ) : (
            renderTable(currentReport.testoutput)
          )}
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