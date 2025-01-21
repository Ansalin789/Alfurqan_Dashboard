"use client";
import BaseLayout from "@/components/BaseLayout";
import React, { Component } from "react";

class  Assignment extends Component {
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
      <BaseLayout>
      
      <div className="p-2">
        <h1 className="text-[25px] font-semibold p-4 text-[#272835]">Assignment</h1>
        <p className="text-[11px] font-semibold text-[#374557] px-4 -mt-3">
          Current Status
        </p>
        <div className="flex justify-center gap-6 p-2 w-[100%]">
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
                  <path
                    className="text-gray-300"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6" /* Background circle thickness */
                  ></path>
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={c.color}
                    strokeWidth="7" /* Progress circle thickness */
                    strokeDasharray={`${c.value}, 100`}
                  >
                  </path>
                </svg>
                {/* Percentage Value */}  
                <div className="absolute text-[14px] font-bold text-gray-800">
                  {c.value}%
                </div>
              </div>
              <div>
                <p className="text-gray-800 text-[14px] font-semibold mb-2">
                  {c.name}
                </p>
                <p className="text-gray-600 text-[12px] font-medium flex items-center gap-2">
                  {c.count} <span className="text-lg">{c.icon}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      </BaseLayout>
    );
  }
}

export default  Assignment;