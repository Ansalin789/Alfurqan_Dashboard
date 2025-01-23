import React from "react";
import { FaMale, FaFemale } from "react-icons/fa";

const StudentsCard: React.FC = () => {
  return (
    <div className="bg-blue-600 text-white rounded-[20px] shadow-lg w-[200px] h-[225px] p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[14px] font-semibold">Students</h2>
        <div className="w-[20px] h-[20px] bg-white text-blue-600 rounded-full flex items-center justify-center cursor-pointer">
          ...
        </div>
      </div>

      {/* Donut Chart */}
      <div className="relative flex justify-center items-center">
        {/* Outer Circle */}
        <div className="w-[100px] h-[100px] rounded-full bg-white flex items-center justify-center relative">
          {/* Boys Slice */}
          <div
            className="absolute w-[100px] h-[100px] rounded-full"
            style={{
              background: `conic-gradient(
                #38bdf8 0%,
                #38bdf8 47%,
                transparent 47%,
                transparent 100%
              )`,
            }}
          ></div>
          {/* Girls Slice */}
          <div
            className="absolute w-[85px] h-[85px] rounded-full bg-blue-600"
            style={{
              background: `conic-gradient(
                #f472b6 0%,
                #f472b6 53%,
                transparent 53%,
                transparent 100%
              )`,
            }}
          ></div>
          {/* Inner Icon */}
          <div className="w-[50px] h-[50px] bg-blue-600 rounded-full flex items-center justify-center">
            <FaMale className="text-[12px] text-blue-400" />
            <FaFemale className="text-[12px] text-pink-400 ml-1" />
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
