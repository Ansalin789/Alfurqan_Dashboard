import React from "react";

const Total = () => {
  return (
    <div className="flex justify-center items-center gap-6 p-4">
      {/* Card 1 */}
      <div className="bg-white shadow-md rounded-lg p-10 flex items-center gap-4">
        <div className="relative">
          <svg className="w-16 h-16">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="#FBBF24"
              strokeWidth="8"
              strokeDasharray="176"
              strokeDashoffset="35"
              fill="none"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
            80%
          </div>
        </div>
        <div>
          <h3 className="text-gray-800 font-semibold">Total Assignment Assigned</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-gray-800">25</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 16l-2 2m0 0l2 2m-2-2h16m-4-4H4a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2v-4a2 2 0 00-2-2z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white shadow-md rounded-lg p-10 flex items-center gap-4">
        <div className="relative">
          <svg className="w-16 h-16">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="#34D399"
              strokeWidth="8"
              strokeDasharray="176"
              strokeDashoffset="67"
              fill="none"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
            62%
          </div>
        </div>
        <div>
          <h3 className="text-gray-800 font-semibold">Total Assignment Completed</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-gray-800">10</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 16l-2 2m0 0l2 2m-2-2h16m-4-4H4a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2v-4a2 2 0 00-2-2z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Total;
