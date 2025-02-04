import React, { useState } from "react";
import Report from "@/components/Report";
import ChatInterface from "@/components/ChatInterface";

function Chat() {
  const [currResponse, setCurrResponse] = useState({
    message: "",
    risk: "No Risks",
    recommendation: "No Recommendations",
  });

  return (
    <main className="flex h-full w-full justify-between divide-x-2">
      <ChatInterface setCurrResponse={setCurrResponse} />
      <Report currResponse={currResponse} />
    </main>
  );
}

export default Chat;
