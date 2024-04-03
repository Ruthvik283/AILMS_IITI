import React from "react";

const DescriptionCard = ({ matterContent, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-xl mx-auto">
        <div className="flex justify-between items-center px-6 py-4 bg-gray-100 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-800">Description</h2>
          <button
            className="text-gray-500 hover:text-gray-700 transition duration-200"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4">
          <p className="text-gray-700 leading-relaxed">{matterContent}</p>
        </div>
      </div>
    </div>
  );
};

export default DescriptionCard;