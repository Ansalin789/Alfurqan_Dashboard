"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface StatsData {
  scheduled: number;
  completed: number;
  absent: number;
}

const COLORS = {
  scheduled: "#B1A7F2", // Purple
  completed: "#6BE6C1", // Green
  absent: "#FFA9A9",   // Red
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

  const total = data.scheduled + data.completed + data.absent;

  if (loading) {
    return (
      <div className="w-full h-full bg-white rounded-xl shadow-md p-3 flex items-center justify-center">
        <div className="text-sm text-gray-600">Loading class analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-white rounded-xl shadow-md p-3 flex items-center justify-center">
        <div className="text-sm text-red-600 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white dark:bg-[#343434] rounded-xl shadow-md p-3 flex flex-col overflow-hidden">
      {/* Heading */}
      <h2 className="text-base font-semibold dark:text-[#FFFFFF] text-gray-900 mt-3 text-left">
        Class Analytics
      </h2>

      {/* Content area that fills available space without overflowing */}
      <div className="flex flex-col md:flex-row items-center justify-center flex-1 gap-2 min-h-0">
        {/* Donut Chart - sized to always fit */}
        <div className="relative flex-shrink-0 aspect-square w-2/5 max-w-[110px]">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {[
              { scale: 0.9, color: COLORS.scheduled, value: data.scheduled },
              { scale: 0.7, color: COLORS.completed, value: data.completed },
              { scale: 0.5, color: COLORS.absent, value: data.absent },
            ].map((circle, i) => {
              const radius = 50 * circle.scale;
              const circumference = 2 * Math.PI * radius;
              const dashLength = (circle.value / (total || 1)) * circumference;
              const gapLength = circumference - dashLength;

              return (
                <circle
                  key={i}
                  r={radius}
                  cx="50"
                  cy="50"
                  stroke={circle.color}
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${dashLength} ${gapLength}`}
                  transform="rotate(-90 50 50)"
                />
              );
            })}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-lg font-extrabold text-gray-900 dark:text-[#FFFFFF] leading-none">
              {total}
            </div>
            <div className="text-[9px] text-gray-700 dark:text-[#FFFFFF] text-center leading-tight uppercase mt-0.5">
              TOTAL CLASS <br /> ASSIGNED
            </div>
          </div>
        </div>

        {/* Legend - compact and always fits */}
        <div className="w-full space-y-1.5 max-w-[120px]">
          {[
            { label: "Scheduled", value: data.scheduled, color: COLORS.scheduled },
            { label: "Completed", value: data.completed, color: COLORS.completed },
            { label: "Absent", value: data.absent, color: COLORS.absent },
          ].map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-800 dark:text-[#FFFFFF] text-xs">
                  {item.label}
                </span>
              </div>
              <span className="font-semibold text-xs dark:text-[#FFFFFF] text-gray-900">
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