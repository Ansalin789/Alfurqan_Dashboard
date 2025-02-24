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
      <div className="p-4 w-[1250px] mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 p-2 -ml-4">
          Current Status
        </h2>
        <div className="flex justify-center gap-6 p-4 -ml-14">
          {cards.map((c) => (
            <div
              key={c.id}
              className="w-[330px] h-[150px] bg-white rounded-lg shadow-md flex items-center p-4"
            >
              {/* Circular Progress */}
              <div className="mr-6 flex justify-center items-center relative">
                <svg
                  className="w-[100px] h-[90px] transform rotate-[-90deg]"
                  viewBox="0 0 36 36"
                >
                  {/* Background Circle */}
                  <path
                    className="text-gray-300"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4" /* Background circle thickness */
                  ></path>
                  {/* Progress Circle */}
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={c.color}
                    strokeWidth="4.5" /* Progress circle thickness */
                    strokeDasharray={`${c.value}, 100`}
                  ></path>
                </svg>
                {/* Percentage Value */}
                <div className="absolute text-[14px] font-bold text-gray-800">
                  {c.value}%
                </div>
              </div>
              {/* Text and Icon */}
              <div>
                <p className="text-gray-800 text-[14px] font-semibold mb-2">
                  {c.name}
                </p>
                <p className="text-gray-600 text-[12px] font-medium flex items-center gap-2">
                  {c.count} <span className="text-2xl">{c.icon}</span>
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
