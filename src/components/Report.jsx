import React, { useState, useEffect } from "react";
import Markdown from "react-markdown";

function Report({ currResponse }) {
  const [currTab, setCurrTab] = useState("Report");
  const tabs = ["Report", "Reference", "Thought Process"];

  return (
    <section className="flex h-full w-1/2 flex-col gap-4 p-2">
      <div className="flex gap-2 text-center">
        {tabs.map((tab) => (
          <button
            className={`cursor-pointer rounded-lg border-2 border-gray-300 px-4 py-2 transition-colors duration-150 ease-in-out hover:bg-gray-200 ${currTab === tab && "bg-gray-200"}`}
            onClick={() => setCurrTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {currTab === "Report" ? (
        <ReportTab currResponse={currResponse} />
      ) : currTab === "Reference" ? (
        <ReferenceTab />
      ) : (
        <ThoughtProcessTab />
      )}
    </section>
  );
}

function ReportTab({ currResponse }) {
  return (
    <div className="scrollbar flex h-full flex-col gap-4 overflow-y-scroll rounded-md border-2 border-gray-200 p-2">
      <div className="flex items-center justify-between">
        <div className="rounded-lg border-2 border-gray-300 px-4 py-2 text-xl font-bold">
          <h3>Security Gap Analysis Report</h3>
        </div>
        <button className="rounded-lg bg-gray-200 p-2 transition-colors duration-150 ease-in-out hover:bg-gray-400">
          Download Report
        </button>
      </div>
      <div className="flex h-full flex-col gap-3 px-2">
        <div>
          <h4 className="text-lg font-semibold text-red-600">Risks</h4>
          <div className="rounded-md border border-gray-300 p-2">
            <p>These are the following gaps that are identified:</p>
            <ChatDisplay message={currResponse.risk} risk={true} />
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-green-600">
            Recommendations
          </h4>
          <div className="rounded-md border border-gray-300 p-2">
            <p>These are the following recommendations:</p>
            <ChatDisplay message={currResponse.recommendation} risk={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ReferenceTab() {
  return (
    <div className="flex h-full flex-col gap-4 rounded-md border-2 border-gray-200 p-2">
      References
    </div>
  );
}

function ThoughtProcessTab() {
  return (
    <div className="flex h-full flex-col gap-4 rounded-md border-2 border-gray-200 p-2">
      Thought Process
    </div>
  );
}
export default Report;

function ChatDisplay({ message, risk }) {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // reset the current text if the message changes
    if (currentText.length > 0 && currentText.charAt(0) !== message.charAt(0)) {
      setCurrentText("");
      setCurrentIndex(0);
    }
    if (currentIndex < message.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + message[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, 1);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, message]);

  return (
    <span
      className={`w-full rounded-lg px-4 py-2 text-sm font-medium ${risk ? "text-red-500" : "text-green-500"} `}
    >
      <Markdown>{currentText}</Markdown>
    </span>
  );
}
