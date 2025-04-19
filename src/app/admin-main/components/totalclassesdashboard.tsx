"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

type TimeFrame = "Last Week" | "Last Month" | "Last Year"

export default function TotalClasses() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("Last Week")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const classData = [
    { type: "Completed", count: 110, color: "bg-gray-900" },
    { type: "Pending", count: 30, color: "bg-blue-300" },
    { type: "Rescheduled", count: 75, color: "bg-purple-500" },
    { type: "Cancelled", count: 70, color: "bg-blue-500" },
  ]

  const maxCount = Math.max(...classData.map(item => item.count), 125)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const selectTimeFrame = (selected: TimeFrame) => {
    setTimeFrame(selected)
    setIsDropdownOpen(false)
  }

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
                {(["Last Week", "Last Month", "Last Year"] as TimeFrame[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => selectTimeFrame(option)}
                    className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex flex-wrap justify-center h-[50px] sm:h-[75px] md:h-[100px] xl:h-[200px]">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between text-gray-700 text-xs pl-1 pr-2  sm:block">
          {[125, 100, 75, 50, 25, 0].map((label) => (
            <div key={label} className="h-8 flex items-center justify-end">
              {label}
            </div>
          ))}
        </div>

        {/* Bar Chart */}
        <div className="flex-1 flex flex-col items-center justify-end px-4 sm:px-8 py-4">
          <div className="flex-1 w-full flex items-end justify-center gap-4 sm:gap-6 md:gap-10 lg:gap-14 h-full">
            {classData.map((item) => (
              <div key={item.type} className="flex flex-col items-center h-full" style={{ minWidth: '60px', maxWidth: '100px' }}>
                {/* Bar container */}
                <div className="flex-1 w-full flex flex-col justify-end items-center">
                  {/* Actual bar */}
                  <div
                    className={`w-full sm:w-[30%] md:w-[50%] lg:w-[70%] xl:w-[90%] rounded-t-md ${item.color}`}
                    style={{
                      height: `${(item.count / maxCount) * 100}%`,
                      minHeight: '2px',
                    }}
                  ></div>
                </div>

                {/* Bar Label */}
                <span className="text-xs text-gray-700 mt-2 text-center">{item.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}