"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface StatsData {
  scheduled: number;
  completed: number;
  absent: number;
}

const COLORS = {
  scheduled: "#B1A7F2", // light purple
  completed: "#6BE6C1", // green
  absent: "#FFA9A9", // pink
};

const ClassAnalyticsChart = () => {
  const [data, setData] = useState<StatsData>({
    scheduled: 0,
    completed: 0,
    absent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const teacherId = localStorage.getItem("TeacherPortalId");
      const token = localStorage.getItem("TeacherAuthToken");

      if (!teacherId || !token) throw new Error("Authentication info missing");

      const response = await axios.get<StatsData>(
        `https://api.blackstoneinfomaticstech.com/classShedule/teacher/count?teacherId=${teacherId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setData({
        scheduled: response.data.scheduled || 0,
        completed: response.data.completed || 0,
        absent: response.data.absent || 0,
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "API Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="w-full h-full flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  const segments = [
    { label: "Scheduled", value: data.scheduled, color: COLORS.scheduled },
    { label: "Completed", value: data.completed, color: COLORS.completed },
    { label: "Absent", value: data.absent, color: COLORS.absent },
  ];

  const radii = [66, 58, 48];
  const SIZE = 112;
  const CENTER = SIZE / 2;

  const getDashArray = (value: number, radius: number) => {
    const circumference = 2 * Math.PI * radius;
    const percent = Math.min(value, 100);
    const dash = (percent / 100) * circumference;
    const gap = circumference - dash;
    return `${dash} ${gap}`;
  };

  return (
    <div className="w-full h-full bg-white dark:bg-[#343434] rounded-2xl shadow p-4 sm:p-6 flex flex-col">
      <h2 className="text-[clamp(14px,2vw,18px)] font-bold text-gray-900 dark:text-white mb-6">
        Class Analytics
      </h2>

      {/* Chart + Legend */}
      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center w-full">
        {/* Donut Chart */}
        <div className="relative w-[40vw] max-w-[220px] aspect-square">
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="w-full h-full overflow-visible"
          >
            {segments.map((seg, i) => {
              const radius = radii[i];
              return (
                <circle
                  key={i}
                  cx={CENTER}
                  cy={CENTER}
                  r={radius}
                  stroke={seg.color}
                  strokeWidth={6}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={getDashArray(seg.value, radius)}
                  transform={`rotate(-90 ${CENTER} ${CENTER})`}
                  style={{ transition: "stroke-dasharray 0.8s ease-in-out" }}
                />
              );
            })}
          </svg>

          {/* Center value */}
          <div className="absolute -mt-7 inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-[24px] font-extrabold text-gray-900 dark:text-white">
              {data.scheduled + data.completed + data.absent}
            </div>
            <div className="text-[8px] text-gray-500 dark:text-gray-300 uppercase text-center -mt-1 leading-tight">
              TOTAL CLASS <br /> ASSIGNED
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col space-y-2 mt-6 sm:mt-0 sm:ml-10 w-[70%] sm:w-40">
          {segments.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between w-full gap-1"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-[clamp(10px,1.2vw,14px)] h-[clamp(10px,1.2vw,14px)] rounded-md"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700 dark:text-white text-[clamp(10px,1.5vw,14px)] font-medium">
                  {item.label}
                </span>
              </div>
              <span className="text-gray-900 dark:text-white text-[clamp(10px,1.5vw,14px)] font-bold text-right">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassAnalyticsChart;
