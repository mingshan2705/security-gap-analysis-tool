import React from "react";
import { Navbar, Sidebar } from "@/components";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="flex h-[100vh] overflow-hidden">
      <Navbar />
      <div className="flex mt-[10dvh]">
        <Sidebar />
        <div className="ml-[18dvw] flex h-[90vh] w-[82vw] flex-col overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;

