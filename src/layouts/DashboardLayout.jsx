import React, { useState, useEffect } from "react";
import { Navbar, Sidebar } from "@/components";
import { Outlet } from "react-router-dom";
import ReportInterface from "@/components/ReportInterface";

function DashboardLayout() {
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [refreshReports, setRefreshReports] = useState(false);

  const handleSelectReport = (requestId) => {
    setSelectedRequestId(requestId);
  };

  const handleRefreshReports = () => {
    setRefreshReports(prev => !prev);
  };

  return (
    <div className="flex h-[100vh] overflow-hidden">
      <Navbar onSelectReport={handleSelectReport} refreshReports={refreshReports} />
      <div className="flex mt-[10dvh]">
        <Sidebar onGenerateReport={handleSelectReport} onRefreshReports={handleRefreshReports} />
        <div className="ml-[18dvw] flex h-[90vh] w-[82vw] flex-col overflow-auto">
          <ReportInterface requestId={selectedRequestId} />
          {/* Remove the Outlet component if not needed */}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;

