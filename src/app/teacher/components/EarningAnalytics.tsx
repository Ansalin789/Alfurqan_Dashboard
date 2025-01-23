import React from "react";

const EarningAnalytics: React.FC = () => {
  return (
    <div className="bg-blue-600 text-white p-2 rounded-lg shadow-lg w-[400px] h-[205px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[15px] font-semibold">Earning Analytics</h2>
        <button className="bg-white text-blue-600 px-2 py-1 rounded-md text-[12px] font-medium shadow-md">
          This Week
        </button>
      </div>

      {/* Chart */}
      <div className="relative">
        {/* Labels */}
        <div className="absolute top-0 left-0 flex flex-col h-full space-y-2 text-[8px] text-gray-300">
          <span>RC</span>
          <span>TC</span>
          <span>GC</span>
          <span>OT</span>
        </div>

        {/* Bars */}
        <div className="pl-10 text-[10px]">
          {/* Bar Rows */}
          {[
            { label: "RC", thisWeek: 200, lastWeek: 250 },
            { label: "TC", thisWeek: 100, lastWeek: 150 },
            { label: "GC", thisWeek: 75, lastWeek: 125 },
            { label: "OT", thisWeek: 225, lastWeek: 175 },
          ].map((item) => (
            <div key={item.label} className="mb-2">
              {/* Last Week Bar */}
              <div className="bg-yellow-400 h-1 rounded-md" style={{ width: `${item.lastWeek}px` }}></div>
              {/* This Week Bar */}
              <div className="bg-teal-400 h-1 rounded-md mt-1" style={{ width: `${item.thisWeek}px` }}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2 flex justify-center space-x-8 text-[11px] text-gray-200">
        <span>
          <span className="text-teal-400">●</span> This Week
        </span>
        <span>
          <span className="text-yellow-400">●</span> Last Week
        </span>
      </div>

      {/* Legend */}
      <div className="mt-3 flex justify-center text-[10px] text-gray-300">
        <span className="mr-3">RC - Regular Class</span>
        <span className="mr-3">TC - Trial Class</span>
        <span className="mr-3">GC - Group Class</span>
        <span>OT - Other</span>
      </div>
    </div>
  );
};

export default EarningAnalytics;
