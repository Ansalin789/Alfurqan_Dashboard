"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import axios from "axios";

const CourseOverview = () => {
const [dashboardCounts, setDashboardCounts] = useState({
  totalLevel: 0,
  totalAttendance: 0, // percentage
  totalClasses: 0,
  presentCount: 0,    // <-- add this
  totalDuration: "0 Hr",
});


  useEffect(() => {
    const fetchData = async () => { 
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("StudentAuthToken")
            : null;

        if (!token) {
          console.error("❌ StudentAuthToken not found");
          return;
        }

        const studentId = localStorage.getItem("StudentPortalId");
        const courseName = localStorage.getItem("StudentCourseName");

        const response = await axios.get(
          "http://localhost:5001/dashboard/student/counts",
          {
            params: { studentId, courseName },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", response.data);
        setDashboardCounts({
          totalLevel: Number(response.data.totalLevel) || 0,
          totalAttendance: Number(response.data.totalAttendance) || 0,
          totalClasses: Number(response.data.totalClasses) || 0,
          presentCount: 0, // Not provided in response
          totalDuration: String(response.data.totalDuration) || "0",
        });
      } catch (error) {
        console.error("Error fetching dashboard counts:", error);
      }
    };

    fetchData();
  }, []);

  const data = [
    {
        title: "Level",
        value: `${Math.floor(dashboardCounts.totalLevel)}`,
        percentage: Math.floor(dashboardCounts.totalLevel),
        ringColor: "#7DB5CB",
        bgColor: "#E7EFF2",
      },
      
    {
      title: "Attendance",
      value: `${Math.floor(dashboardCounts.totalAttendance)}%`,
      percentage:  Math.floor(dashboardCounts.totalAttendance),
      ringColor: "#9AD7D6",
      bgColor: "#E7EFF2",
    },
    {
      title: "Total Classes",
      value: `${Math.floor(dashboardCounts.totalClasses)}%`,
      percentage: Math.floor(dashboardCounts.totalClasses),
      ringColor: "#8B93D2",
      bgColor: "#E7EFF2",
    },
    {
        title: "Duration",
        value: `${Math.floor(Number(dashboardCounts.totalDuration))} Hr`,
        percentage: Math.floor(Number(dashboardCounts.totalDuration)),
        ringColor: "#B690D5",
        bgColor: "#E7EFF2",
      },     
  ];

  return (
    <div>
      <h5 className="text-[16px] font-semibold text-[#010E30] dark:text-white mb-4">
        Course Overview <span className="text-[#6786FB]">(Quran)</span>
      </h5>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl shadow-lg w-full bg-gradient-to-b from-white to-[#F9FAFB] dark:from-[#343434] dark:to-[#2A2A2A]"
          >
            <h3 className="text-[#010E30] dark:text-white text-[14px] font-medium mb-2">
              {item.title}
            </h3>
            <div className="flex justify-center">
              <div className="relative w-[80px] h-[80px]">
                <PieChart width={80} height={80}>
                  <Pie
                    data={[{ value: 100 }]}
                    dataKey="value"
                    innerRadius={26}
                    outerRadius={35}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                    isAnimationActive={false}
                  >
                    <Cell fill={item.bgColor} />
                  </Pie>
                  <Pie
                    data={[
                      { value: item.percentage },
                      { value: 100 - item.percentage },
                    ]}
                    dataKey="value"
                    innerRadius={24}
                    outerRadius={38}
                    startAngle={90}
                    endAngle={-270}
                    cornerRadius={2}
                    stroke="none"
                    isAnimationActive={false}
                  >
                    <Cell fill={item.ringColor} />
                    <Cell fill="transparent" />
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex items-center justify-center text-[14px] font-semibold text-[#010E30] dark:text-white">
                  {item.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseOverview;
