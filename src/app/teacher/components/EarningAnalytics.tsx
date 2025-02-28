import React from "react";

const EarningAnalytics = () => {
  return (
    <div className="bg-[#3E68A1] text-white p-4 rounded-2xl shadow-lg w-[100%] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[13px] font-semibold ml-4">Earning Analytics</h2>
        {/* Dropdown for Weekly/Monthly selection */}
        <select className="bg-[#F7F8FA] text-[#3E5E8A] py-[1px] px-1 rounded-md text-[10px] font-semibold">
          <option value="weekly">This Week</option>
          <option value="monthly">This Month</option>
        </select>
      </div>

      {/* Chart */}
      <div className="relative">
        {/* Vertical Lines */}
        <div className="absolute left-8 top-[15px] text-[15px] w-full h-full flex">
          {[0, 25, 50, 75, 100, 125, 150, 175, 200].map((value) => (
            <div
              key={value}
              className="flex flex-col items-center text-[10px]"
              style={{ width: `${100 / 10}%`, fontSize: '10px' }}
            >
              {/* Dotted Line */}
              <div className="h-full border-l border-dashed border-gray-400"></div>
              {/* Number */}
              <span className="text-gray-300 text-xs mt-1">${value}</span>
            </div>
          ))}
        </div>

        {/* Bar Chart */}
        <div className="space-y-1 relative left-2">
          {[
            { label: "RC", value1: 50, value2: 60 },
            { label: "TC", value1: 50, value2: 75 },
            { label: "GC", value1: 40, value2: 60 },
            { label: "OT", value1: 75, value2: 90 },
          ].map(({ label, value1, value2 }) => (
            <div key={label} className="flex items-center">
              {/* Label */}
              <span className="w-12 text-[12px] font-normal">{label}</span>
              {/* Bars */}
              <div className="flex-1">
                <div
                  className="bg-teal-400 h-[5px] rounded-md mb-1"
                  style={{ width: `${(value1 / 100) * 100}%` }}
                ></div>
                <div
                  className="bg-yellow-400 h-[5px] rounded-md"
                  style={{ width: `${(value2 / 100) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="text-[11px] mt-[25px] text-[#969696] flex justify-between">
        <span>RC - Regular Class</span>
        <span>TC - Trial Class</span>
        <span>GC - Group Class</span>
        <span>OT - Other</span>
      </div>
    </div>
  );
};

export default EarningAnalytics;
