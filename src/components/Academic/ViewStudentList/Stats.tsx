import React from 'react';

const Stats = () => {
  return (
    <div className=" md:flex-row space-y-4 md:space-y-3 md:space-x-6 w-full md:w-1/3">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-[100%] text-center ml-6">
        <h3 className="text-2xl font-semibold">97%</h3>
        <p className="text-gray-500">Attendance</p>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-[100%] text-center">
        <h3 className="text-2xl font-semibold">64%</h3>
        <p className="text-gray-500">Performance</p>
      </div>
    </div>
  );
};

export default Stats;
