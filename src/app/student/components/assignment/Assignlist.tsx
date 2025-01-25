"use client";
import React, { Component } from "react";

class AssignList extends Component {
  render() {
    const cards = [
      {
        id: "card1",
        name: "Total Assignment Assigned",
        value: 80,
        count: 25,
        icon: "📋",
        color: "#FFCC00",
      },
      {
        id: "card2",
        name: "Total Assignment Completed",
        value: 62,
        count: 10,
        icon: "📄",
        color: "#00CC99",
      },
      {
        id: "card3",
        name: "Total Assignment Pending",
        value: 62,
        count: 15,
        icon: "⏳",
        color: "#FF6666",
      },
    ];

    return (
      <div className="p-4 md:p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Current Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div
              key={c.id}
              className="w-full bg-white rounded-lg shadow-lg flex items-center p-4"
            >
              {/* Circular Progress */}
              <div className="mr-4 md:mr-6 flex justify-center items-center relative">
                <svg
                  className="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] transform rotate-[-90deg]"
                  viewBox="0 0 36 36"
                >
                  {/* Background Circle */}
                  <path
                    className="text-gray-200"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4.5"
                  ></path>
                  {/* Progress Circle */}
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={c.color}
                    strokeWidth="5"
                    strokeDasharray={`${c.value}, 100`}
                  ></path>
                </svg>
                {/* Percentage Value */}
                <div className="absolute text-sm sm:text-base font-bold text-gray-800">
                  {c.value}%
                </div>
              </div>
              {/* Text and Icon */}
              <div className="flex flex-col justify-center">
                <p className="text-gray-800 text-sm sm:text-base font-semibold mb-1">
                  {c.name}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm font-medium flex items-center gap-2">
                  {c.count} <span className="text-lg">{c.icon}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default AssignList;
