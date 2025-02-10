import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Sidebar({ onDataClassificationChange, onSensitivityClassificationChange, selectedDataClassification, selectedSensitivityClassification }) {
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
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    setDataClassification(selectedDataClassification || dataClassificationOptions[0].title);
  }, [selectedDataClassification]);

  useEffect(() => {
    setSensitivityClassification(selectedSensitivityClassification || sensitivityClassificationOptions[0].title);
  }, [selectedSensitivityClassification]);

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
      setRequestCount(prevCount => prevCount + 1);
      const reportData = {
        requestId: `sga${String(requestCount + 1).padStart(4, '0')}`,
        reportName,
        submitDateTime: new Date().toISOString(),
        dataClassification,
        sensitivityClassification,
        testInput: filesContent,
      };

      fetch("http://localhost:8000/api/generate-report", {  // Update with your backend's URL and port
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      }).then(response => {
        if (response.ok) {
          alert("Report generated successfully!");
        } else {
          alert("Failed to generate report.");
        }
      });
    }).catch(error => {
      console.error("Error reading files:", error);
      alert("Failed to read files.");
    });
  };

  return (
    <aside className="flex h-[100dvh] w-[18dvw] flex-col items-center gap-[1.5vh] border bg-white p-[2.5vh] text-[1.8vh] font-medium shadow-lg">
      <Link to="/">
        <div className="flex items-center rounded-md border-2 border-gray-300 p-[1.5vh] text-[2.5vh] font-bold tracking-wider transition-colors duration-100 hover:bg-gray-100">
          <h1 className="pb-[0.8vh] text-blue-400">SECURITY</h1>
          <h1 className="pt-[0.8vh] text-slate-600">BOT</h1>
        </div>
      </Link>

      {/* File Upload */}
      <div className="flex w-full flex-col gap-[1.5vh] border-b-2 border-t-2 border-gray-300 p-[2.5vh]">
        <p className="text-[1.8vh] font-bold">1. Upload Files (.txt only)</p>
        <input
          type="file"
          accept=".txt"
          multiple
          onChange={handleFileUpload}
          className="rounded-md border-2 border-gray-200 px-[1.5vh] py-[0.8vh] text-[1.5vh]"
        />
        {selectedFiles.length > 0 && (
          <div className="text-[1.3vh] mt-[0.8vh]">
            {selectedFiles.map(file => (
              <p key={file.name}>Selected: {file.name}</p>
            ))}
          </div>
        )}
      </div>

      {/* Security Guidelines Selection */}
      <div className="flex w-full flex-col gap-[1.5vh] border-b-2 border-t-2 border-gray-300 p-[1.5vh] mt-[0vh]">
        <p className="text-[1.8vh] font-bold">2. Select a Data Classification</p>
        <select
          value={dataClassification}
          onChange={(e) => {
            setDataClassification(e.target.value);
            onDataClassificationChange(e.target.value);
          }}
          className="rounded-md border-2 border-gray-200 px-[1.5vh] py-[0.8vh] text-[1.8vh]"
        >
          {dataClassificationOptions.map((option) => (
            <option key={option.title} value={option.title}>
              {option.title}
            </option>
          ))}
        </select>
      </div>

      {/* Sensitivity Guidelines Selection */}
      <div className="flex w-full flex-col gap-[1.5vh] border-b-2 border-t-2 border-gray-300 p-[2vh] mt-[0vh]">
        <p className="text-[1.8vh] font-bold">3. Select a Sensitivity Classification</p>
        <select
          value={sensitivityClassification}
          onChange={(e) => {
            setSensitivityClassification(e.target.value);
            onSensitivityClassificationChange(e.target.value);
          }}
          className="rounded-md border-2 border-gray-200 px-[1.5vh] py-[0.8vh] text-[1.8vh]"
        >
          {sensitivityClassificationOptions.map((option) => (
            <option key={option.title} value={option.title}>
              {option.title}
            </option>
          ))}
        </select>
      </div>

      {/* Report Name Input */}
      <div className="flex w-full flex-col gap-[1.5vh] border-b-2 border-t-2 border-gray-300 p-[2vh] mt-[0vh]">
        <p className="text-[1.8vh] font-bold">4. Enter Report Name</p>
        <input
          type="text"
          placeholder="Report Name"
          value={reportName}
          onChange={(e) => setReportName(e.target.value)}
          className="rounded-md border-2 border-gray-200 px-[1.5vh] py-[0.8vh] text-[1.8vh]"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerateReport}
        className="mt-[2.5vh] rounded-md bg-blue-500 px-[5vh] py-[1.2vh] text-[1.8vh] text-white hover:bg-blue-600"
      >
        Generate Report
      </button>

      <div className="justify-betwen mt-auto flex flex-col items-center gap-[0.8vh]">
        <div>User Guide</div>
        <div>Settings</div>
      </div>
    </aside>
  );
}

export default Sidebar;

