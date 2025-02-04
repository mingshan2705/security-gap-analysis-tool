import React, { useState, useEffect, useRef } from "react";
import api from "@/api";
import Markdown from "react-markdown";
import { FaArrowUp } from "react-icons/fa";
import { CgAttachment } from "react-icons/cg";

function ChatInterface({ setCurrResponse }) {
  const textAreaRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const resizeTextArea = () => {
    if (!textAreaRef.current) {
      return;
    }
    textAreaRef.current.style.height = "auto"; // will not work without this!
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
  };

  useEffect(() => {
    resizeTextArea();
    window.addEventListener("resize", resizeTextArea);
  }, []);

  async function sendMessage() {
    const currInput = input;
    setInput("");
    setMessages([
      ...messages,
      { role: "user", message: currInput },
      { role: "bot", message: "..." },
    ]);
    await api
      .post(`/chatbot`, {
        message: currInput,
      })
      .then((response) => {
        console.log(response);
        setCurrResponse(response.data);
        setMessages([
          ...messages,
          { role: "user", message: currInput },
          { role: "bot", message: response.data.message },
        ]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <section className="flex h-full w-1/2 flex-col gap-4 p-2">
      <div className="flex w-1/2 items-center justify-center gap-2 self-center rounded-lg border-2 border-gray-200 bg-gray-100 px-4 py-2 text-center">
        <h2 className="text-xl font-semibold">Chat 💬</h2>
      </div>
      <div className="scrollbar flex h-full flex-col gap-4 overflow-x-hidden overflow-y-scroll rounded-md border-2 border-gray-200 p-4">
        {messages.map((chatMessage) => {
          return chatMessage.role === "user" ? (
            <UserChat message={chatMessage.message} />
          ) : (
            <BotChat message={chatMessage.message} />
          );
        })}
      </div>
      <form className="flex w-full flex-1 items-center justify-between gap-2 rounded-xl bg-gray-200 px-4 py-2">
        <label
          htmlFor="file"
          className="cursor-pointer rounded-full bg-gray-50 p-2"
        >
          <CgAttachment />
        </label>
        <input type="file" id="file" multiple={false} hidden />
        <div className="relative flex max-h-[25dvh] min-w-0 flex-1 flex-col">
          <textarea
            rows={1}
            ref={textAreaRef}
            dir="auto"
            placeholder="Enter your query..."
            className="max-h-1/4 m-0 w-full resize-none overflow-y-scroll border-0 bg-transparent px-0 outline-none focus:ring-0 focus-visible:ring-0"
            id="prompt-textarea"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              resizeTextArea();
            }}
            onKeyDown={(e) => e.ctrlKey && e.key === "Enter" && sendMessage()}
          >
            {input}
          </textarea>
        </div>

        <button className="rounded-full bg-gray-50 p-2" type="submit">
          <FaArrowUp />
        </button>
      </form>
    </section>
  );
}

function UserChat({ message }) {
  return (
    <div className="flex min-w-[50%] max-w-[75%] flex-col gap-2 self-end break-words rounded-l-xl rounded-tr-xl bg-blue-200 px-4 py-2 text-sm font-medium">
      <div className="w-20 rounded-lg border-2 border-blue-500 bg-white p-2 text-center text-blue-500">
        User
      </div>
      <Markdown>{message}</Markdown>
    </div>
  );
}

function BotChat({ message }) {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [currentText]);

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
    <div className="flex min-w-[50%] max-w-[75%] flex-col gap-2 self-start break-words rounded-r-xl rounded-tl-xl bg-gray-200 px-4 py-2 text-sm font-medium">
      <div className="w-20 rounded-lg border-2 border-gray-500 bg-white p-2 text-center text-gray-500">
        AI
      </div>
      <Markdown>{currentText}</Markdown>
      <div ref={endRef} />
    </div>
  );
}

export default ChatInterface;
