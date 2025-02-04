import React from "react";
import { Navbar, Sidebar } from "@/components";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="flex">
      <Navbar />
      <Sidebar />
      <div className="mt-[10dvh] flex h-[90dvh] w-[85dvw] flex-col">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;

