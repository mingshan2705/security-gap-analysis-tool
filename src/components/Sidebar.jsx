import React, { useState } from "react";
import { Link } from "react-router-dom";

function Sidebar({ onDataClassificationChange, onSensitivityClassificationChange, selectedDataClassification, selectedSensitivityClassification }) {
  const chatList = [
    { chatId: 1, title: "Report No. 1" },
    { chatId: 2, title: "Report No. 2" },
    { chatId: 3, title: "Report No. 3" },
  ];

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

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file && file.type === "text/plain") {
      setSelectedFile(file);
      console.log("File uploaded:", file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        console.log("File content:", fileContent);
        // Here you would typically send the fileContent to your backend or
        // perform other processing.  For example:
        // fetch('/api/upload', { 
        //   method: 'POST',
        //   body: JSON.stringify({ content: fileContent })
        // }).then(...);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a .txt file.");
      event.target.value = ''; // Clear the file input
      setSelectedFile(null);
    }
  };

  return (
    <aside className="flex h-[100dvh] w-[15dvw] flex-col items-center gap-5 border bg-white p-4 text-lg font-medium shadow-lg">
      <Link to="/">
        <div className="flex items-center rounded-md border-2 border-gray-300 p-2 text-2xl font-bold tracking-wider transition-colors duration-100 hover:bg-gray-100">
          <h1 className="pb-2 text-blue-400">SECURITY</h1>
          <h1 className="pt-2 text-slate-600">BOT</h1>
        </div>
      </Link>

      {/* File Upload */}
      <div className="flex w-full flex-col gap-2 border-b-2 border-t-2 border-gray-300 p-2">
        <p className="text-sm font-bold">1. Upload File (.txt only)</p>
        <input
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          className="rounded-md border-2 border-gray-200 px-2 py-1 text-sm"
        />
        {selectedFile && <p className="text-xs mt-1">Selected: {selectedFile.name}</p>}
      </div>

      {/* Security Guidelines Selection */}
      <div className="flex w-full flex-col gap-2 border-b-2 border-t-2 border-gray-300 p-2 mt-4">
        <p className="text-sm font-bold">2. Select a Data Classification</p>
        <select
          value={selectedDataClassification}
          onChange={(e) => onDataClassificationChange(e.target.value)}
          className="rounded-md border-2 border-gray-200 px-2 py-1 text-sm"
        >
          {dataClassificationOptions.map((option) => (
            <option key={option.title} value={option.title}>
              {option.title}
            </option>
          ))}
        </select>


      {/* Sensitivity Guidelines Selection */}
      <div className="flex w-full flex-col gap-2 border-b-2 border-t-2 border-gray-300 p-2 mt-4"></div>
        <p className="text-sm font-bold">3. Select a Sensitivity Classification</p>
        <select
          value={selectedSensitivityClassification}
          onChange={(e) => onSensitivityClassificationChange(e.target.value)}
          className="rounded-md border-2 border-gray-200 px-2 py-1 text-sm"
        >
          {sensitivityClassificationOptions.map((option) => (
            <option key={option.title} value={option.title}>
              {option.title}
            </option>
          ))}
        </select>
      </div>

      {/* Generate Button */}
      <button className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
        Generate Report
      </button>

      {/* Commented out Recent Reports */}
      {/*
      <div className="flex max-h-fit w-full flex-col justify-between gap-2 border-b-2 border-t-2 border-gray-300 mt-4">
        <p className="text-sm font-bold">Recent Reports</p>
        <div className="flex flex-col gap-4 overflow-x-hidden">
          {chatList.map((chat) => (
            <p
              key={chat.chatId}
              className="w-full cursor-pointer rounded-md p-2 text-sm transition-colors duration-150 ease-in-out hover:bg-gray-300"
            >
              {chat.title}
            </p>
          ))}
        </div>
      </div>
      */}

      <div className="justify-betwen mt-auto flex flex-col items-center gap-1">
        <div>User Guide</div>
        <div>Settings</div>
      </div>
    </aside>
  );
}

export default Sidebar;

