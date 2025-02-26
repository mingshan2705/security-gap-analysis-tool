import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar({ onSelectReport, refreshReports }) {
  const [recentReports, setRecentReports] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetch("https://sga-backend1-ekdwgybbecgbedhk.southeastasia-01.azurewebsites.net/api/reports", {
      mode: 'cors'
    })
      .then(response => response.json())
      .then(data => setRecentReports(data));
  }, [refreshReports]);

  const handleSelectReport = (requestId) => {
    onSelectReport(requestId);
    setDropdownOpen(false);
  };

  return (
    <header className="fixed left-[18dvw] right-0 top-0 z-50 flex h-[10dvh] items-center justify-end border bg-gray-50 px-8 py-2 text-sm font-medium shadow-lg">
      <nav className="flex items-center justify-center gap-4">
        <ul className="flex gap-4">
          <li className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="focus:outline-none"
            >
              Recent Reports
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg z-50 max-h-[50vh] overflow-y-auto">
                {recentReports.length > 0 ? (
                  recentReports.map((report, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectReport(report.requestId)}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    >
                      {report.reportName}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-700">No reports available</div>
                )}
              </div>
            )}
          </li>
        </ul>
        <div className="flex aspect-square w-12 items-center justify-center rounded-full border-2 border-black bg-gray-300">
          MS
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
