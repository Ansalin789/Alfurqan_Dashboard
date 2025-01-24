'use client';
import React from "react";
import { FaMale, FaFemale } from "react-icons/fa";

const StudentsCard: React.FC = () => {
  return (
    <div className="bg-[#324F78] text-white rounded-[15px] shadow-lg w-[100%] h-[205px] p-4">
      {/* Header */}
      <div className="flex justify-center items-center mb-2 -mt-2 bg-[#fff] text-center rounded-md">
        <h2 className="text-[14px] font-semibold text-[#242424] text-center py-[1px]">Students</h2>
      </div>

      {/* Donut Chart */}
      <div className="relative flex justify-center items-center">
        {/* Outer Donut Circle */}
        <div className="relative w-[100px] h-[100px] rounded-full">
          {/* Donut Gradient */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(#fff 0% 47%, #83DBFC 47% 100%)`,
            }}
          ></div>

          {/* Two-Color Inner Circle with Rounded Edges */}
          <div
            className="absolute inset-[10px] w-[80px] h-[80px] rounded-full bg-[#324F78]"
            style={{
              clipPath: "inset(0 round 50px)",
              background: `conic-gradient(#FF5BBE 0% 47%, #fff 47% 100%)`,
            }}
          ></div>

          {/* Innermost Blue Circle with Icons */}
          <div className="absolute inset-[20px] w-[60px] h-[60px] bg-[#324F78] rounded-full flex items-center justify-center">
            <FaMale className="text-[18px] text-blue-400" />
            <FaFemale className="text-[18px] text-pink-400 ml-1" />
          </div>
        </div>
      </div>

      {/* Legends */}
      <div className="mt-4 flex justify-around text-center text-[12px]">
        {/* Boys */}
        <div>
          <div className="flex items-center justify-center space-x-1">
            <span className="w-[8px] h-[8px] bg-blue-400 rounded-full"></span>
            <span className="font-bold">45,414</span>
          </div>
          <span className="text-gray-300">Boys (47%)</span>
        </div>
        {/* Girls */}
        <div>
          <div className="flex items-center justify-center space-x-1">
            <span className="w-[8px] h-[8px] bg-pink-400 rounded-full"></span>
            <span className="font-bold">40,270</span>
          </div>
          <span className="text-gray-300">Girls (53%)</span>
        </div>
      </div>
    </div>
  );
};

export default StudentsCard;
