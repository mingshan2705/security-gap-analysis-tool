import React from "react";
import { Link } from "react-router-dom";

function NewChat() {

  const dataClassification = [
    { title: "Confidential", description: "" },
    { title: "Confidential (Cloud-Eligible)", description: "" },
    { title: "Restricted", description: "" },
    { title: "Official (Closed)", description: "" },
    { title: "Official (Open)", description: "" },
  ];
  const sensitivityClassification = [
    { title: "Sensitive High", description: "" },
    { title: "Sensitive Normal", description: "" },
    { title: "Sensitive Low", description: "" },
  ];

  const questions = [

    {
      title: "Data Classification",
      description: "Please select the data classification of your system",
      options: dataClassification,
    },
    {
      title: "Sensitivity Classification",
      description:
        "Please select the sensitivity classification of your system",
      options: sensitivityClassification,
    },
  ];

  return (
    <section className="flex h-[90dvh] w-full flex-col gap-6 p-2">
      <h2 className="text-0 text-2xl font-semibold">
        Security Guidelines Selection
      </h2>
      {questions.map((question) => (
        <SelectionRow
          title={question.title}
          description={question.description}
          options={question.options}
        />
      ))}
      <Link to="/dashboard/chat" className="w-24">
        <button className="text-bold w-full rounded-lg bg-blue-300 px-4 py-2 text-white transition-colors duration-150 ease-in-out hover:bg-blue-400">
          Next
        </button>
      </Link>
    </section>
  );
}

function SelectionRow({ title, description, options }) {
  return (
    <div className="flex gap-4">
      <div className="w-1/2 rounded-lg bg-gray-100 px-4 py-2">
        <h3 className="font-semibold text-blue-500">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
      <select
        name=""
        id=""
        className="rounded-md border-2 border-gray-200 px-4"
      >
        {options.map((option) => (
          <option value={option.title} className="text-sm">
            {option.title} {option.description && "-"} {option.description}
          </option>
        ))}
      </select>
    </div>
  );
}

export default NewChat;
