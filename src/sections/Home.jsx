import React from "react";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

function Home() {
  return (
    <main className="flex h-screen w-screen items-center justify-center gap-4">
      <div className="flex flex-col gap-4">
        <div className="group flex items-center self-center p-2 text-4xl font-bold tracking-wider duration-100">
          <h1 className="pb-2 text-blue-400 transition-all duration-150 ease-in-out group-hover:pb-0">
            SECURITY GAP
          </h1>
          <h1 className="pt-2 text-slate-600 transition-all duration-150 ease-in-out group-hover:pt-0">
            ANALYSIS ASSISTANT
          </h1>
        </div>
        <p className="text-xl font-semibold">
          <p className="bg-gradient-to-r from-sky-200 to-blue-700 bg-clip-text text-transparent">
            SUPERCHARGE your security posture
          </p>
        </p>
        <p className="text-sm">
          Configuration checks could take a lot of time and is very manually
          intensive.
        </p>
        <Link to="/dashboard/chat">
          <button className="w-full rounded-2xl bg-blue-400 p-4 font-semibold text-white transition-colors duration-150 hover:bg-blue-500">
            Get Started
          </button>
        </Link>
      </div>
      <div className="h-1/2 w-1 rounded-full bg-gray-200"></div>
      <div className="flex flex-col gap-4">
        <div className="w-80 self-end rounded-t-full rounded-bl-full bg-blue-200 px-7 py-2 text-sm font-medium text-gray-600">
          <TypeAnimation
            sequence={[
              1000,
              "What are the current gaps in my configuration?",
              1000,
              "What are some of the recommendations for my configuration?",
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />
        </div>
      </div>
    </main>
  );
}

export default Home;
