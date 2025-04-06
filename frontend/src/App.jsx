import { Home } from "@/sections";
import { DashboardLayout } from "@/layouts";
import { Routes, Route } from "react-router-dom";
import React from "react";
import ReportInterface from "./components/ReportInterface";

function App() {
  return (
    <div className="flex">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="report" element={<ReportInterface />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
