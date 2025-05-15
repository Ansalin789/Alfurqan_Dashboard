"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

type TimeFrame = "Last Week" | "Last Month" | "Last Year";

interface ClassRecord {
  date: string;
  classCompleted: number;
  classPending: number;
  classReschedule: number;
  classCancelled: number;
}

interface ChartItem {
  type: string;
  count: number;
  color: string;
}

const getDateRangeParam = (timeFrame: TimeFrame) => {
  switch (timeFrame) {
    case "Last Month":
      return "monthly";
    case "Last Year":
      return "yearly";
    default:
      return "weekly";
  }
};

export default function TotalClasses() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("Last Week");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [classData, setClassData] = useState<ChartItem[]>([]);

  const fetchClassData = async (token: string, range: TimeFrame) => {
    try {
      const res = await fetch(
        `https://api.blackstoneinfomaticstech.com/dashboard/admin/totalclass?dateRange=${getDateRangeParam(range)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const data: ClassRecord[] = await res.json();
  
      const totals = data.reduce(
        (acc, item) => {
          acc.classCompleted += item.classCompleted;
          acc.classPending += item.classPending;
          acc.classReschedule += item.classReschedule;
          acc.classCancelled += item.classCancelled;
          return acc;
        },
        {
          classCompleted: 0,
          classPending: 0,
          classReschedule: 0,
          classCancelled: 0,
        }
      );
  
      const chartData: ChartItem[] = [
        { type: "Completed", count: totals.classCompleted, color: "bg-gray-900" },
        { type: "Pending", count: totals.classPending, color: "bg-blue-300" },
        { type: "Rescheduled", count: totals.classReschedule, color: "bg-purple-500" },
        { type: "Cancelled", count: totals.classCancelled, color: "bg-blue-500" },
      ];
  
      setClassData(chartData);
    } catch (error) {
      console.error("Failed to fetch class data:", error);
    }
  };
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('AdminAuthToken');
      if (token) {
        fetchClassData(token, timeFrame);
      } else {
        console.log("No auth token found.");
      }
    }
  }, [timeFrame]);
  

  const maxCount = Math.max(...classData.map((item) => item.count), 1);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectTimeFrame = (selected: TimeFrame) => {
    setTimeFrame(selected);
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-gray-800">Total Classes</h2>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-200 rounded-md px-3 py-1"
          >
            {timeFrame} <ChevronDown className="ml-1 h-4 w-4" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                {(["Last Week", "Last Month", "Last Year"] as TimeFrame[]).map(
                  (option) => (
                    <button
                      key={option}
                      onClick={() => selectTimeFrame(option)}
                      className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                    >
                      {option}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart Section */}
      <div className="h-48 flex">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between text-gray-700 text-xs pl-1 pr-2">
          {Array.from({ length: 5 }, (_, i) =>
            Math.round((maxCount / 4) * (4 - i))
          ).map((label, index) => (
            <div key={index} className="h-6 flex items-center justify-end">
              {label}
            </div>
          ))}
        </div>

        {/* Bar Chart */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-end justify-between sm:justify-center sm:gap-x-3 md:gap-x-8 lg:gap-x-10 h-full pl-4">
            {classData.map((item) => (
              <div
                key={item.type}
                className="flex flex-col items-center h-full"
                style={{ minWidth: "40px" }}
              >
                {/* Bar container */}
                <div className="flex-1 w-full flex flex-col justify-end items-center">
                  {/* Actual bar */}
                  <div
                    className={`w-8 sm:w-10 md:w-10 rounded-t-md ${item.color}`}
                    style={{
                      height: `${(item.count / maxCount) * 100}%`,
                      minHeight: "2px",
                    }}
                    title={`${item.count} ${item.type}`}
                  ></div>
                </div>

                {/* Bar Label */}
                <span className="text-xs text-gray-700 mt-2 text-center">
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
