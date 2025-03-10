import React from "react";

function ClassificationModal({ isOpen, onClose, type }) {
  if (!isOpen) return null;

  const dataClassificationContent = (
    <div>
      <ul className="list-disc list-inside">
        <li><strong>RESTRICTED</strong> - Cause some damage to an Agency;</li>
        <li><strong>CONFIDENTIAL</strong> - Cause some damage to national interests, or serious damage to an Agency; CONFIDENTIAL data that ONLY causes damage to an Agency (with no damage to national interest) shall be marked as CONFIDENTIAL (CLOUD-ELIGIBLE).</li>
        <li><strong>SECRET</strong> - Causes serious damage to national security or interests;</li>
        <li><strong>TOP SECRET</strong> - Causes exceptionally grave damage to national security.</li>
        <li>Data that is not classified as "RESTRICTED, "CONFIDENTIAL", "SECRET" or "TOP SECRET", shall be assigned one of the following security classifications:</li>
        <li><strong>OFFICIAL (CLOSED)</strong> - Deemed unsuitable or not useful to be disclosed to the public domain;</li>
        <li><strong>OFFICIAL (OPEN)</strong> - Deemed suitable and useful to be disclosed to the public domain.</li>
      </ul>
    </div>
  );

  const sensitivityClassificationContent = (
    <div>
      <p className="mt-2"><strong>For INDIVIDUALS</strong>, agencies shall assign one of the following sensitivity classifications to data on individuals, based on the potential impact to the individual if the data is disclosed without authorization:</p>
      <ul className="list-disc list-inside">
        <li><strong>NON-SENSITIVE</strong> - Negligible or no physical, financial, or emotional damage to the individual, including personal information that is generally available or is reasonably expected to be generally available;</li>
        <li><strong>SENSITIVE NORMAL</strong> - Causes some temporary or minor emotional distress or disturbance to the individual;</li>
        <li><strong>SENSITIVE HIGH</strong> - Causes serious physical, financial, or sustained emotional damage or social stigma to the individual.</li>
      </ul>
      <p className="mt-2"><strong>For ENTITIES</strong>, Data on entities shall be assigned one of the following sensitivity classifications, based on the following potential impact to the entity if it is disclosed without authorization:</p>
      <ul className="list-disc list-inside">
        <li><strong>NON-SENSITIVE</strong> - Negligible or no impact to an entity's processes or operations, including entity information that is generally available or is reasonably expected to be generally available;</li>
        <li><strong>SENSITIVE NORMAL</strong> - Cause some reduction in competitiveness or a compromise of the entity's legitimate interests;</li>
        <li><strong>SENSITIVE HIGH</strong> - Cause sustained financial loss.</li>
      </ul>
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">{type === "data" ? "Data Classification" : "Sensitivity Classification"}</h2>
        {type === "data" ? dataClassificationContent : sensitivityClassificationContent}
        <button
          onClick={onClose}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ClassificationModal;
