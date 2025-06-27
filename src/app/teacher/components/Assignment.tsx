"use client";

import React from "react";
import { PieChart, Pie, Cell } from "recharts";

function Assignment() {
  // Hardcoded values
  const totalAssignments = 8;
  const completedAssignments = 6;
  const pendingAssignments = totalAssignments - completedAssignments;

  const completionPercentage = Math.round((completedAssignments / totalAssignments) * 100);
  const pendingPercentage = Math.round((pendingAssignments / totalAssignments) * 100);

  const cards = [
    {
      title: "Total Assignment Assigned",
      count: totalAssignments,
      percentage: 100,
      ringColor: "#7DB5CB",
      bgColor: "#CDD5E2",
      pieData: [{ value: 100 }],
    },
    {
      title: "Total Assignment Completed",
      count: completedAssignments,
      percentage: completionPercentage,
      ringColor: "#88CF9B",
      bgColor: "#CDD5E2",
      pieData: [
        { value: completionPercentage },
        { value: 100 - completionPercentage },
      ],
    },
    {
      title: "Total Assignment Pending",
      count: pendingAssignments,
      percentage: pendingPercentage,
      ringColor: "#FC6B57",
      bgColor: "#CDD5E2",
      pieData: [
        { value: pendingPercentage },
        { value: 100 - pendingPercentage },
      ],
    },
  ];

  return (
    <div className="md:p-0 mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {cards.map((item, idx) => {
          const bgClass =
            idx === 0
              ? "bg-gradient-to-b from-white to-[#F6FCFF] dark:from-[#343434] dark:to-[#343434]"
              : idx === 1
              ? "bg-gradient-to-b from-white to-[#F6FFFF]  dark:from-[#343434] dark:to-[#343434]"
              : "bg-gradient-to-b from-white to-[#F8F6FF]  dark:from-[#343434] dark:to-[#343434]";

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl shadow-md w-full ${bgClass}   transition transform hover:scale-[1.02] `}
            >
              <h3 className="text-[#010E30] text-[14px] font-medium mb-2 leading-5 dark:text-[#ffff]">
                {item.title.split(" ").slice(0, 3).join(" ")} <br /> {item.title.split(" ").slice(3).join(" ")}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-[28px] text-[#010E30] font-semibold dark:text-[#ffff]">
                  {item.count}
                </span>
                <div className="relative w-[80px] h-[80px]">
                  <PieChart width={80} height={80}>
                    <Pie
                      data={[{ value: 100 }]}
                      dataKey="value"
                      innerRadius={28}
                      outerRadius={36}
                      startAngle={90}
                      endAngle={-270}
                      isAnimationActive={false}
                      stroke="none"
                    >
                      <Cell fill={item.bgColor} />
                    </Pie>
                    <Pie
                      data={item.pieData}
                      dataKey="value"
                      innerRadius={26}
                      outerRadius={40}
                      startAngle={90}
                      endAngle={-270}
                      cornerRadius={2}
                      isAnimationActive={false}
                      stroke="none"
                    >
                      <Cell fill={item.ringColor} />
                      <Cell fill="transparent" />
                    </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex items-center justify-center text-[14px] font-semibold text-[#333] dark:text-[#ffff]">
                    {item.percentage}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Assignment;
