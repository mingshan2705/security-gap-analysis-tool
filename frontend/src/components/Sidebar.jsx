import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa"; // Import the info icon
import ClassificationModal from "./ClassificationModal";

function Sidebar({ onDataClassificationChange, onSensitivityClassificationChange, selectedDataClassification, selectedSensitivityClassification, onGenerateReport, onRefreshReports }) {
  const dataClassificationOptions = [
    { title: "Confidential", description: "" },
    { title: "Confidential (Cloud-Eligible)", description: "" },
    { title: "Restricted", description: "" },
    { title: "Official (Closed)", description: "" },
    { title: "Official (Open)", description: "" },
  ];

  const sensitivityClassificationOptions = [
    { title: "Sensitive High", description: "" },
    { title: "Sensitive Normal", description: "" },
    { title: "Sensitive Low", description: "" },
  ];

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [reportName, setReportName] = useState("");
  const [dataClassification, setDataClassification] = useState(selectedDataClassification || dataClassificationOptions[0].title);
  const [sensitivityClassification, setSensitivityClassification] = useState(selectedSensitivityClassification || sensitivityClassificationOptions[0].title);
  const [requestCount, setRequestCount] = useState(() => {
    const savedCount = localStorage.getItem('requestCount');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isSensitivityModalOpen, setIsSensitivityModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  useEffect(() => {
    setDataClassification(selectedDataClassification || dataClassificationOptions[0].title);
  }, [selectedDataClassification]);

  useEffect(() => {
    setSensitivityClassification(selectedSensitivityClassification || sensitivityClassificationOptions[0].title);
  }, [selectedSensitivityClassification]);

  useEffect(() => {
    localStorage.setItem('requestCount', requestCount);
  }, [requestCount]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => file.type === "text/plain");

    if (validFiles.length !== files.length) {
      alert("Please upload only .txt files.");
      event.target.value = ''; // Clear the file input
      return;
    }

    setSelectedFiles(validFiles);
    console.log("Files uploaded:", validFiles.map(file => file.name));
  };

  const handleGenerateReport = () => {
    if (selectedFiles.length === 0 || !reportName) {
      alert("Please upload files and enter a report name.");
      return;
    }

    setIsLoading(true); // Set loading state to true

    const fileReaders = selectedFiles.map((file, index) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve({
          testinputid: `T${String(index + 1).padStart(3, '0')}`,
          testinputname: file.name,
          testinputtext: e.target.result
        });
        reader.onerror = reject;
        reader.readAsText(file);
      });
    });

    Promise.all(fileReaders).then(filesContent => {
      setRequestCount(prevCount => {
        const newCount = prevCount + 1;
        localStorage.setItem('requestCount', newCount);
        return newCount;
      });

      const reportData = {
        requestid: `sga${String(requestCount + 1).padStart(4, '0')}`,
        reportname: reportName,
        submitdatetime: new Date().toISOString(),
        dataclassification: dataClassification,
        sensitivityclassification: sensitivityClassification,
        testinput: filesContent, // List of objects with the specified format
      };

      onGenerateReport(reportData.requestid);  // Immediately display the ReportInterface with the new requestId

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800000); // 30 minutes timeout

      fetch("https://sga-backend1-ekdwgybbecgbedhk.southeastasia-01.azurewebsites.net/api/generate-report", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(reportData),
        signal: controller.signal
      }).then(response => {
        clearTimeout(timeoutId); // Clear the timeout
        if (response.ok) {
          checkReportStatus(reportData.requestid); // Check the status of the report generation
        } else {
          setIsLoading(false); // Set loading state to false
          alert("Failed to generate report.");
        }
      }).catch((error) => {
        if (error.name === 'AbortError') {
          alert("Report generation timed out.");
        } else {
          alert("Failed to generate report.");
        }
        setIsLoading(false); // Set loading state to false
      });
    }).catch(error => {
      setIsLoading(false); // Set loading state to false
      console.error("Error reading files:", error);
      alert("Failed to read files.");
    });
  };

  const checkReportStatus = (requestId) => {
    const interval = setInterval(() => {
      fetch(`https://sga-backend1-ekdwgybbecgbedhk.southeastasia-01.azurewebsites.net/api/reports/${requestId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      }).then(response => response.json())
        .then(data => {
          if (data.message !== "Report not found") {
            clearInterval(interval); // Clear the interval
            setIsLoading(false); // Set loading state to false
            onRefreshReports(); // Call onRefreshReports to refresh the recent reports
          }
        }).catch(() => {
          clearInterval(interval); // Clear the interval
          setIsLoading(false); // Set loading state to false
          alert("Failed to check report status.");
        });
    }, 30000); // Check every 30 seconds

    setTimeout(() => {
      clearInterval(interval); // Clear the interval after 10 minutes
      setIsLoading(false); // Set loading state to false
      alert("Report generation timed out.");
    }, 1800000); // 30 minutes
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-[18dvw] flex flex-col items-center gap-4 border-r bg-white p-4 text-sm font-medium shadow-lg">
      <Link to="/">
        <div className="flex items-center rounded-md border-2 border-gray-300 p-[2vh] text-[2.8vh] font-bold tracking-wider transition-colors duration-100 hover:bg-gray-100">
          <h1 className="pb-[1.5vh] text-blue-400">SECURITY</h1>
          <h1 className="pt-[1.5vh] text-slate-600">BOT</h1>
        </div>
      </Link>

      {/* File Upload */}
      <div className="w-full flex flex-col gap-2 border-b pb-4">
        <p className="text-lg font-bold">1. Upload Files (.txt only)</p>
        <input
          type="file"
          accept=".txt"
          multiple
          onChange={handleFileUpload}
          className="rounded border px-2 py-1 text-sm"
        />
      </div>

      {/* Security Guidelines Selection */}
      <div className="w-full flex flex-col gap-2 border-b pb-4">
        <p className="text-lg font-bold flex items-center">
          2. Select a Data Classification
          <button
            onClick={() => setIsDataModalOpen(true)}
            className="ml-2 text-blue-500 hover:text-blue-700"
          >
            <FaInfoCircle />
          </button>
        </p>
        <select
          value={dataClassification}
          onChange={(e) => {
            setDataClassification(e.target.value);
            onDataClassificationChange(e.target.value);
          }}
          className="rounded border px-2 py-1 text-sm"
        >
          {dataClassificationOptions.map((option) => (
            <option key={option.title} value={option.title}>
              {option.title}
            </option>
          ))}
        </select>
      </div>

      {/* Sensitivity Guidelines Selection */}
      <div className="w-full flex flex-col gap-2 border-b pb-4">
        <p className="text-lg font-bold flex items-center">
          3. Select a Sensitivity Classification
          <button
            onClick={() => setIsSensitivityModalOpen(true)}
            className="ml-2 text-blue-500 hover:text-blue-700"
          >
            <FaInfoCircle />
          </button>
        </p>
        <select
          value={sensitivityClassification}
          onChange={(e) => {
            setSensitivityClassification(e.target.value);
            onSensitivityClassificationChange(e.target.value);
          }}
          className="rounded border px-2 py-1 text-sm"
        >
          {sensitivityClassificationOptions.map((option) => (
            <option key={option.title} value={option.title}>
              {option.title}
            </option>
          ))}
        </select>
      </div>

      {/* Report Name Input */}
      <div className="w-full flex flex-col gap-2 border-b pb-4">
        <p className="text-lg font-bold">4. Enter Report Name</p>
        <input
          type="text"
          placeholder="Report Name"
          value={reportName}
          onChange={(e) => setReportName(e.target.value)}
          className="rounded border px-2 py-1 text-sm"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerateReport}
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
        disabled={isLoading} // Disable button when loading
      >
        {isLoading ? "Generating Report..." : "Generate Report"} {/* Show loading text */}
      </button>

      <div className="mt-auto flex flex-col items-center gap-2">
        <div>User Guide</div>
        <div>Settings</div>
      </div>

      <ClassificationModal isOpen={isDataModalOpen} onClose={() => setIsDataModalOpen(false)} type="data" />
      <ClassificationModal isOpen={isSensitivityModalOpen} onClose={() => setIsSensitivityModalOpen(false)} type="sensitivity" />
    </aside>
  );
}

export default Sidebar;

