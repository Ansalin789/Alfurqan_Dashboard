"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const TeachingActivity: React.FC = () => {
  const [monthlyHours, setMonthlyHours] = useState<number[]>(Array(12).fill(0));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = localStorage.getItem("TeacherAuthToken");
        const teacherId = localStorage.getItem("TeacherPortalId");

        if (!auth || !teacherId) {
          console.error("Missing authentication token or teacher ID.");
          return;
        }

        const response = await axios.get("http://localhost:5001/classShedule", {
          headers: { Authorization: `Bearer ${auth}` },
        });

        const filteredData = response.data.students.filter(
          (item: any) => item.teacher.teacherId === teacherId
        );

        const monthlyData = Array(12).fill(0);

        filteredData.forEach((schedule: any) => {
          if (!schedule.startDate || !schedule.startTime || !schedule.endTime) return;

          const startDate = new Date(schedule.startDate);
          const monthIndex = startDate.getMonth();

          schedule.classDay.forEach((_: any, index: number) => {
            if (!schedule.startTime[index] || !schedule.endTime[index]) return;

            const startHour = parseInt(schedule.startTime[index].split(":")[0], 10);
            const endHour = parseInt(schedule.endTime[index].split(":")[0], 10);

            if (isNaN(startHour) || isNaN(endHour)) return; // Prevent NaN values

            const dailyHours = Math.max(0, endHour - startHour); // Ensure non-negative values

            monthlyData[monthIndex] += dailyHours;
          });
        });

        setMonthlyHours(monthlyData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to generate SVG path
  const getGraphPath = (monthlyHours: number[]) => {
    const width = 680;
    const height = 160;
    const padding = 10;
    const maxHours = Math.max(...monthlyHours, 1); // Avoid division by zero

    let path = `M0 ${height}`;

    monthlyHours.forEach((hours, i) => {
      const x = (i / 11) * width; // Spread points evenly
      const y = height - (hours / maxHours) * (height - padding); // Scale correctly

      path += ` L${x} ${y}`;
    });

    path += ` L${width} ${height} L0 ${height} Z`; // Close the shape properly

    return path;
  };

  return (
    <div className="bg-gradient-to-t from-[#5C92DE] to-[#324F78] border border-black text-white p-2 rounded-[15px] shadow-lg w-[100%] h-[205px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[13px] font-semibold ml-4">Teaching Activity</h2>
        <select className="bg-white text-[#35537F] py-[1px] px-1 rounded-md text-[10px] font-semibold shadow-md">
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      <div className="relative flex-1">
  <svg viewBox="0 0 1000 190" className="w-full h-full">
    <defs>
      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
        <stop offset="100%" stopColor="#1e40af" stopOpacity="0.8" />
      </linearGradient>
    </defs>

    {/* Ensure the graph starts at Jan by mapping data correctly */}
    <path d={getGraphPath(monthlyHours)} fill="url(#gradient)" stroke="#ffffff" strokeWidth="2" />

    {/* Horizontal Grid Lines - Full Width */}
    {[40, 80, 120, 160].map((y) => (
      <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="#94a3b8" strokeWidth="0.5" />
    ))}
  </svg>
</div>


      {/* X-Axis Labels */}
      <div className="flex  text-[12px] text-gray-300">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
          (month) => (
            <span key={month} className="flex-1 text-center text-[11px]">
              {month}
            </span>
          )
        )}
      </div>
    </div>
  );
};

export default TeachingActivity;
