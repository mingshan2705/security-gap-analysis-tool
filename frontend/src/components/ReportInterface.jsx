import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
            // If the report isn't found, wait and try again
            if (
              checker &&
              checker.message &&
              checker.message === "Report not found"
            ) {
              await new Promise((resolve) => setTimeout(resolve, 10000));
              continue;
            }
            // If checker does not include "testoutput", update progress and continue polling
            if (checker && checker.processed_count !== checker.total_count) {
              setReports((prev) => ({ ...prev, [requestId]: checker }));
              await new Promise((resolve) => setTimeout(resolve, 10000));
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
        var options = { hour12: false, day: "2-digit", month: "2-digit", year: "numeric" };
        const formattedDate = new Date(currentReport.submitdatetime)
          .toLocaleString("en", options)
          .replace(",", "");
        link.setAttribute("download", `${report.reportname}-${formattedDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      });
  };

  const currentReport = reports[requestId];
  const currentLoadingState = loadingStates[requestId];

  const formatTextWithLineBreaks = (text) => {
    const result = [];
    const regex = /\d\.\s/g; // Matches a digit followed by ". " (period and space)
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Get the substring immediately preceding the match (up to 2 characters)
      const preceding = text.slice(Math.max(0, match.index - 2), match.index);

      // If the match is preceded by "= " or "= " then skip splitting at this match
      if (preceding === "= " || preceding.endsWith("=")) {
        continue;
      }

      // Extract the segment from lastIndex to the current match start
      const segment = text.slice(lastIndex, match.index);
      if (segment.trim()) {
        result.push(segment.trim());
      }
      lastIndex = match.index;
    }

    // Add the last segment from the final match to the end of the text
    const remainder = text.slice(lastIndex);
    if (remainder.trim()) {
      result.push(remainder.trim());
    }

    // Wrap each segment in a <p> tag (without adding extra headers)
    return result.map((line, index) => (
      <p key={index} className="mb-2">
        {line}
      </p>
    ));
  };

  const renderTable = (data) => {
    const keys = [
      "ID",
      "Result",
      "Risk Statement",
      "Test Procedure",
      "Recommendation",
    ];

    return (
      <div id="reportDiv" className="w-full">
        {/* Header table - always visible */}
        <table className="table-fixed w-full bg-white border">
          {/* Same column definitions for alignment */}
          <colgroup>
            <col className="w-1/12" />
            <col className="w-1/12" />
            <col className="w-2/12" />
            <col className="w-4/12" />
            <col className="w-4/12" />
          </colgroup>
          <thead>
            <tr>
              <th className="py-3 px-4 border-b border-gray-200 bg-gray-100 text-left text-base font-semibold text-gray-600">
                ID
              </th>
              <th className="py-3 px-4 border-b border-gray-200 bg-gray-100 text-left text-base font-semibold text-gray-600">
                Result
              </th>
              <th className="py-3 px-4 border-b border-gray-200 bg-gray-100 text-left text-base font-semibold text-gray-600">
                Risk Statement
              </th>
              <th className="py-3 px-4 border-b border-gray-200 bg-gray-100 text-left text-base font-semibold text-gray-600">
                Test Procedure
              </th>
              <th className="py-3 px-4 border-b border-gray-200 bg-gray-100 text-left text-base font-semibold text-gray-600">
                Recommendation
              </th>
            </tr>
          </thead>
        </table>

        {/* Scrollable body */}
        <div className="overflow-auto max-h-[60vh]">
          <table className="table-fixed w-full bg-white border">
            {/* Must use the same colgroup to match column widths */}
            <colgroup>
              <col className="w-1/12" />
              <col className="w-1/12" />
              <col className="w-2/12" />
              <col className="w-4/12" />
              <col className="w-4/12" />
            </colgroup>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm">
                    {row.testoutputid}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm">
                    {row.result}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm">
                    {row.riskstatement}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm">
                    {formatTextWithLineBreaks(row.testprocedure)}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-sm">
                    {formatTextWithLineBreaks(row.recommendation)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

  const downloadPDF = () => {
    if (!currentReport || !currentReport.testoutput) return;

    // Create a new PDF document in landscape mode
    const doc = new jsPDF("landscape");

    // Add header information
    doc.setFontSize(16);
    doc.text(currentReport.reportname, 14, 15); // Report name at x=14, y=15

    doc.setFontSize(10);
    // Date Requested
    doc.text(
      `Date Requested: ${new Date(currentReport.submitdatetime).toLocaleString()}`,
      14,
      23
    );
    // Data Classification
    doc.text(
      `Data Classification: ${currentReport.dataclassification}`,
      14,
      31
    );
    // Sensitivity Classification
    doc.text(
      `Sensitivity Classification: ${currentReport.sensitivityclassification}`,
      14,
      39
    );

    // Set the starting Y coordinate for the table so it doesn't overlap the header
    const startY = 45;

    // Define the table columns
    const columns = [
      "ID",
      "Result",
      "Risk Statement",
      "Test Procedure",
      "Recommendation",
    ];

    // Prepare the table rows with formatting applied for the "Test Procedure" and "Recommendation" columns
    const rows = currentReport.testoutput.map((row) => [
      row.testoutputid,
      row.result,
      row.riskstatement,
      formatTextWithLineBreaks(row.testprocedure)
        .map((line) => line.props.children)
        .join("\n\n"),
      formatTextWithLineBreaks(row.recommendation)
        .map((line) => line.props.children)
        .join("\n\n"),
    ]);

    // Generate the table using autoTable with the adjusted starting Y coordinate
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: startY,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [220, 220, 220] },
    });

    // Save the PDF file using the report name as the filename
    doc.save(`${currentReport.reportname}.pdf`);
  };

  return (
    <div className="flex flex-col w-full p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Security Gap Analysis Report</h2>
        {requestId && currentLoadingState === "completed" && (
          <div>
            <button
              onClick={handleDownloadReport}
              className="ml-4 rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-green-600"
            >
              Download as Excel
            </button>
            <button
              onClick={downloadPDF}
              className="ml-4 rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-red-600"
            >
              Download as PDF
            </button>
          </div>
        )}
      </div>

      {currentLoadingState === "in progress" && (
        <div className="flex flex-col justify-center items-center space-y-4 w-4/5 mx-auto">
          {/* Block 1: Spinner and Title */}
          <div className="flex items-center space-x-3">
            <div className="loader border-t-4 border-blue-500 rounded-full w-5 h-5 animate-spin"></div>
            <span className="text-lg font-semibold text-blue-600">
              Generating Report ...
            </span>
          </div>
          {/* Block 2: Progress Bar */}
          {currentReport && currentReport.total_count ? (
            <div className="w-full max-w-xl mx-auto">
              <div className="overflow-hidden h-12 flex rounded bg-blue-200">
                <div
                  style={{
                    width: `${
                      (currentReport.processed_count / currentReport.total_count) *
                      100
                    }%`,
                  }}
                  className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                ></div>
              </div>
            </div>
          ) : (
            <p className="text-blue-600 text-lg"></p>
          )}
          {/* Block 3: Progress Text */}
          {currentReport && currentReport.total_count ? (
            <div className="flex items-center justify-center">
              <span className="text-sm font-semibold uppercase text-blue-600">
                {currentReport.processed_count || 0} out of {currentReport.total_count} input files processed
              </span>
            </div>
          ) : (
            <p className="text-blue-600 text-lg"></p>
          )}
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
          <p className="mb-1">
            <strong>Date Requested:</strong> {new Date(currentReport.submitdatetime).toLocaleString()}
          </p>
          <p className="mb-1">
            <strong>Data Classification:</strong> {currentReport.dataclassification}
          </p>
          <p className="mb-4">
            <strong>Sensitivity Classification:</strong> {currentReport.sensitivityclassification}
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
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[60vh]">
              {JSON.stringify(currentReport, null, 2)}
            </pre>
          ) : (
            // Only the table container is scrollable
            renderTable(currentReport.testoutput)
          )}
        </div>
      ) : (
        !requestId && (
          <div className="text-gray-500">
            Please generate a report or visit recent reports to display.
          </div>
        )
      )}
    </div>
  );
}

export default ReportInterface;
