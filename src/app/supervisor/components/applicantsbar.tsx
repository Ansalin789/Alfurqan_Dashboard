"use client";
import "./DateRange.css";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const ApplicationChart = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<any[]>([
    {
      startDate: new Date(new Date().setDate(new Date().getDate() - 6)), // 6 days ago
      endDate: new Date(), // today
      key: "selection",
    },
  ]);
  const [applicationData, setApplicationData] = useState([]);

  const fetchData = async (fromDate: string, toDate: string) => {
    try {
      const res = await fetch(
        `https://api.blackstoneinfomaticstech.com?fromDate=${fromDate}&toDate=${toDate}`
      );
      const data = await res.json();
      
      // Get last 7 days of data
      const last7Days = data.slice(-7);
      
      // Transform to expected format
      const transformed = last7Days.map((item: any) => ({
        date: format(new Date(item.date), "dd MMM"),
        applied: item.totalApplied,
        shortlisted: item.shortlisted,
      }));
      setApplicationData(transformed);
    } catch (error) {
      console.error("Failed to fetch application data", error);
    }
  };

  const handleRangeChange = (ranges: any) => {
    const start = ranges.selection.startDate;
    const end = ranges.selection.endDate;

    if (start && end) {
      // Ensure the range is not more than 7 days
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 7) {
        // If more than 7 days, adjust the end date to be 7 days from start
        const newEnd = new Date(start);
        newEnd.setDate(newEnd.getDate() + 6);
        ranges.selection.endDate = newEnd;
      }

      setDateRange([ranges.selection]);
      setShowCalendar(false);
      fetchData(format(ranges.selection.startDate, "yyyy-MM-dd"), format(ranges.selection.endDate, "yyyy-MM-dd"));
    }
  };

  useEffect(() => {
    // Initial load
    const start = dateRange[0].startDate;
    const end = dateRange[0].endDate;
    if (start && end) {
      fetchData(format(start, "yyyy-MM-dd"), format(end, "yyyy-MM-dd"));
    }
  }, []);

  const formattedDate =
    dateRange[0].startDate && dateRange[0].endDate
      ? format(dateRange[0].startDate, "dd MMM") ===
        format(dateRange[0].endDate, "dd MMM")
        ? format(dateRange[0].startDate, "dd MMM")
        : `${format(dateRange[0].startDate, "dd MMM")}–${format(
            dateRange[0].endDate,
            "dd MMM"
          )}`
      : "";

  return (
    <div className="w-full relative">
      <div className="bg-white rounded-xl h-[270px] dark:bg-[#343434] shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[#010E30] text-[14px] mt-0 ml-4 font-semibold dark:text-[#ffff]">
            Application
          </h3>

          <div className="flex items-center gap-2 px-2 py-2 relative">
            <div className="flex items-center gap-1">
              <div className="w-[10px] h-[10px] rounded-[2px] bg-[#a6c1ff]" />
              <span className="text-[10px] font-light text-[#010E30] dark:text-white">
                Applied
              </span>
            </div>

            <div className="flex items-center gap-1">
              <div className="w-[10px] h-[10px] rounded-[2px] bg-[#d5e0ff]" />
              <span className="text-[10px] font-light text-[#010E30] dark:text-white">
                Shortlisted
              </span>
            </div>

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
              <span className="text-[#576CBC] dark:text-[#DDDDDD]">
                {formattedDate || "Select Date"}
              </span>
            </div>

            {showCalendar && (
              <div className="absolute right-0 top-[30px] z-50 scale-90 origin-top-right">
                <DateRange
                  className="custom-date-range"
                  editableDateInputs={true}
                  onChange={handleRangeChange}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                  rangeColors={["transparent"]}
                />
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="text-black dark:text-white/80">
          <ResponsiveContainer width="100%" height={210}>
            <BarChart
              data={applicationData}
              margin={{ top: 0, right: 10, left: 0, bottom: 5 }}
              barCategoryGap="25%" // Decrease this to make bars thicker
            >
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "currentColor" }}
                padding={{ left: 4, right: 20 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 8, fill: "currentColor" }}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{ fontSize: "10px", borderRadius: "8px" }}
              />
              <Bar
                dataKey="applied"
                stackId="a"
                fill="#a6c1ff"
                radius={[0, 0, 12, 12]}
              />
              <Bar
                dataKey="shortlisted"
                stackId="a"
                fill="#d5e0ff"
                radius={[12, 12, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ApplicationChart;
