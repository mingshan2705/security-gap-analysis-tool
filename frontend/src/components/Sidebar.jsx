import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

    const fileReaders = selectedFiles.map((file, index) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve({ testInputId: `T${String(index + 1).padStart(3, '0')}`, testInputName: file.name, testInputText: e.target.result });
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
        testinput: filesContent,
      };

      onGenerateReport(reportData.requestid);  // Immediately display the ReportInterface with the new requestId

      fetch("https://sga-backend1-ekdwgybbecgbedhk.southeastasia-01.azurewebsites.net/api/generate-report", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(reportData),
      }).then(response => {
        if (response.ok) {
          onRefreshReports();  // Call onRefreshReports to refresh the recent reports
        } else {
          alert("Failed to generate report.");
        }
      }).catch(() => {
        alert("Failed to generate report.");
      });
    }).catch(error => {
      console.error("Error reading files:", error);
      alert("Failed to read files.");
    });
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
        <p className="text-lg font-bold">2. Select a Data Classification</p>
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
        <p className="text-lg font-bold">3. Select a Sensitivity Classification</p>
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
      >
        Generate Report
      </button>

      <div className="mt-auto flex flex-col items-center gap-2">
        <div>User Guide</div>
        <div>Settings</div>
      </div>
    </aside>
  );
}

export default Sidebar;

