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
    <div className="bg-white rounded-lg shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
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
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
      <div className="h-64 flex">
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between text-gray-500 text-xs pr-2">
          {[125, 100, 75, 50, 25, 0].map((label) => (
            <div key={label} className="h-6 flex items-center justify-end">
              {label}
            </div>
          ))}
        </div>

        {/* Bar Chart - Centered Container */}
        <div className="flex-1 flex flex-col">
          {/* Centered Bars */}
          <div className="flex-1 flex items-end justify-center gap-x-5 h-full pl-4">
            {classData.map((item) => (
              <div key={item.type} className="flex flex-col items-center h-full" style={{ width: '100px' }}>
               
                
                {/* Bar container */}
                <div className="flex-1 w-full flex flex-col justify-end items-center">
                  {/* Actual bar - centered and narrow */}
                  <div
                    className={`w-14 rounded-t-md ${item.color}`}
                    style={{
                      height: `${(item.count / maxCount) * 100}%`,
                      minHeight: '2px'
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