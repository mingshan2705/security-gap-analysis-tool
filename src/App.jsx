import { Home, Chat, NewChat } from "@/sections";
import { DashboardLayout } from "@/layouts";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="flex">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<NewChat />} />
          <Route path="chat" element={<Chat />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
