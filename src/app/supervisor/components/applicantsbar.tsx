"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DateRange } from "react-date-range";
import { format, addDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const applicationdata = [
  { date: "08 Nov", applied: 12, shortlisted: 6 },
  { date: "09 Nov", applied: 10, shortlisted: 5 },
  { date: "10 Nov", applied: 8, shortlisted: 4 },
  { date: "11 Nov", applied: 7, shortlisted: 5 },
  { date: "12 Nov", applied: 9, shortlisted: 5 },
  { date: "13 Nov", applied: 8, shortlisted: 5 },
  { date: "14 Nov", applied: 11, shortlisted: 6 },
];

const ApplicationChart = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<any[]>([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

  const handleRangeChange = (ranges: any) => {
    const start = ranges.selection.startDate;
    const end = ranges.selection.endDate;

    if (start && end) {
      setDateRange([ranges.selection]);
      setShowCalendar(false);
    }
  };

  const formattedDate =
    dateRange[0].startDate && dateRange[0].endDate
      ? `${format(dateRange[0].startDate, "dd MMM")}–${format(
          dateRange[0].endDate,
          "dd MMM"
        )}`
      : "";

  return (
    <div className="w-full relative">
      <div className="bg-white rounded-xl h-[270px] dark:bg-[#343434]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[#010E30] text-[14px] mt-0 ml-4 font-semibold dark:text-[#ffff]">
            Application
          </h3>

          <div className="flex items-center gap-2 px-2 py-2 relative">
            {/* Legend - Applied */}
            <div className="flex items-center gap-1">
              <div className="w-[10px] h-[10px] rounded-[2px] bg-[#a6c1ff]" />
              <span className="text-[10px] font-light text-[#010E30] dark:text-white">
                Applied
              </span>
            </div>

            {/* Legend - Shortlisted */}
            <div className="flex items-center gap-1">
              <div className="w-[10px] h-[10px] rounded-[2px] bg-[#d5e0ff]" />
              <span className="text-[10px] font-light text-[#010E30] dark:text-white">
                Shortlisted
              </span>
            </div>

            {/* Date Picker Toggle */}
            <div
              className="flex items-center p-1 gap-1 text-[10px] bg-[#efefef] dark:bg-[#565656] rounded-md text-[#ddd] cursor-pointer"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <svg
                className="w-3 h-3 -mt-[1px] text-[#576cbc] dark:text-[#ddd]"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 2V5M16 2V5M3 10H21M5 6H19C20.1046 6 21 6.89543 21 8V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V8C3 6.89543 3.89543 6 5 6Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span>{formattedDate || "Select Date"}</span>
            </div>

            {/* Calendar Dropdown */}
            {showCalendar && (
              <div className="absolute right-0 top-[38px] z-50">
                <DateRange
                  editableDateInputs={true}
                  onChange={handleRangeChange}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                  rangeColors={["#0D356D"]}
                />
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="text-black dark:text-white/80">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={applicationdata} barSize={30} barGap={0}>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: "currentColor", // uses text color from parent
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10,
                  fill: "currentColor", // uses text color from parent

                 }}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{ fontSize: "12px", borderRadius: "8px" }}
              />
              <Bar
                dataKey="applied"
                stackId="a"
                fill="#a6c1ff"
                radius={[0, 0, 8, 8]}
              />
              <Bar
                dataKey="shortlisted"
                stackId="a"
                fill="#d5e0ff"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ApplicationChart;
