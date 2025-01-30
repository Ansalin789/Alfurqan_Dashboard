'use client';

import React from "react";

const TeachingActivity: React.FC = () => {
  return (
    <div className="bg-gradient-to-t from-[#5C92DE] to-[#324F78] border border-black text-white p-2 rounded-[15px] shadow-lg w-[100%] h-[205px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[13px] font-semibold ml-4">Teaching Activity</h2>
        <select className="bg-white text-[#35537F] py-[1px] px-1 rounded-md text-[10px] font-semibold shadow-md">
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      {/* Graph Area */}
      <div className="relative flex-1">
        {/* Gradient Graph */}
        <svg viewBox="0 0 500 200" className="w-full h-[150px]">
          {/* Gradient */}
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
              <stop offset="100%" stopColor="#1e40af" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          {/* Area Path */}
          <path
            d="M0 160 C 50 100, 100 40, 150 60 
               C 200 90, 250 150, 300 130 
               C 350 110, 400 60, 450 90 
               C 475 110, 500 160, 500 160 
               L 0 160 Z"
            fill="url(#gradient)"
          />
          {/* Horizontal Grid Lines */}
          <line x1="0" y1="40" x2="500" y2="40" stroke="#94a3b8" strokeWidth="0.5" />
          <line x1="0" y1="80" x2="500" y2="80" stroke="#94a3b8" strokeWidth="0.5" />
          <line x1="0" y1="120" x2="500" y2="120" stroke="#94a3b8" strokeWidth="0.5" />
          <line x1="0" y1="160" x2="500" y2="160" stroke="#94a3b8" strokeWidth="0.5" />
        </svg>

        {/* Tooltip */}
        <div className="absolute left-[40%] transform -translate-x-1/2 -top-[5%] flex flex-col items-center">
          {/* Gauge Icon */}
          <div className="w-[50px] h-[50px] rounded-full border-[3px] border-red-500 relative flex items-center justify-center">
            <div className="w-[6px] h-[6px] bg-red-500 rounded-full"></div>
            <div
              className="absolute w-[25px] h-[3px] bg-red-500 origin-bottom transform rotate-[30deg]"
              style={{ transformOrigin: "bottom" }}
            ></div>
          </div>
          {/* Tooltip Text */}
          <div className="bg-blue-700 text-[8px] p-1 rounded-md mt-1 shadow-lg">
            April 15, 2024
            <br />
            121 Hours
          </div>
        </div>
      </div>

      <div className="flex justify-between text-[12px] text-gray-300">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"].map((month) => (
          <span key={month} className="flex-1 text-center text-[11px]">
            {month}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TeachingActivity;
