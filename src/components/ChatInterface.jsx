import React, { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import Markdown from "react-markdown";

function ReportInterface({ reportContent }) {
  const [content, setContent] = useState("No report generated yet.");

  useEffect(() => {
    if (reportContent) {
      setContent(reportContent);
    }
  }, [reportContent]);

  return (
    <section className="flex h-full w-1/2 flex-col gap-4 p-2">
      <div className="flex w-1/2 items-center justify-center gap-2 self-center rounded-lg border-2 border-gray-200 bg-gray-100 px-4 py-2 text-center">
        <h2 className="text-xl font-semibold">Report 📄</h2>
      </div>
      <div className="scrollbar flex h-full flex-col gap-4 overflow-x-hidden overflow-y-scroll rounded-md border-2 border-gray-200 p-4">
        <Markdown>{content}</Markdown>
      </div>
    </section>
  );
}

ReportInterface.propTypes = {
  reportContent: PropTypes.string,
};

export default ReportInterface;
