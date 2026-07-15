"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface StatsData {
  scheduled: number;
  completed: number;
  absent: number;
}

const COLORS = {
  scheduled: "#A78BFA",
  completed: "#34D399",
  absent: "#FB7185",
};

const ClassAnalyticsChart = () => {
  const [data, setData] = useState<StatsData>({
    scheduled: 0,
    completed: 0,
    absent: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const teacherId = localStorage.getItem("TeacherPortalId");
      const token = localStorage.getItem("TeacherAuthToken");

      if (!teacherId || !token) {
        throw new Error("Authentication info missing");
      }

      const response = await axios.get<StatsData>(
        `https://api.blackstoneinfomaticstech.com/classShedule/teacher/count?teacherId=${teacherId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  const segments = [
    {
      label: "Scheduled",
      value: data.scheduled,
      color: COLORS.scheduled,
    },
    {
      label: "Completed",
      value: data.completed,
      color: COLORS.completed,
    },
    {
      label: "Absent",
      value: data.absent,
      color: COLORS.absent,
    },
  ];

  const total =
    data.scheduled +
    data.completed +
    data.absent;

  const SIZE = 140;
  const CENTER = SIZE / 2;
  const radii = [55, 46, 37];

  const getDashArray = (
    value: number,
    radius: number
  ) => {
    const circumference = 2 * Math.PI * radius;
    const percent = Math.min(value, 100);
    const dash = (percent / 100) * circumference;
    const gap = circumference - dash;

    return `${dash} ${gap}`;
  };
    return (
    <div className="w-full h-full rounded-2xl bg-white dark:bg-[#343434] shadow-md p-4 sm:p-5 flex flex-col">
      {/* Header */}
      <h2 className="text-[16px] font-semibold text-gray-900 dark:text-white">
        Class Analytics
      </h2>

      {/* Chart */}
      <div className="flex-1 flex flex-col items-center justify-center py-4">
        <div className="relative w-44 h-44 sm:w-48 sm:h-48">
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="w-full h-full overflow-visible"
          >
            {segments.map((segment, index) => (
              <circle
                key={index}
                cx={CENTER}
                cy={CENTER}
                r={radii[index]}
                fill="none"
                stroke={segment.color}
                strokeWidth={7}
                strokeLinecap="round"
                strokeDasharray={getDashArray(
                  segment.value,
                  radii[index]
                )}
                transform={`rotate(-90 ${CENTER} ${CENTER})`}
                style={{
                  transition: "stroke-dasharray .8s ease",
                }}
              />
            ))}
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              {total}
            </h3>

            <p className="mt-1 text-[9px] leading-tight uppercase tracking-wide text-center text-gray-500 dark:text-gray-300">
              Total Class
              <br />
              Assigned
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        {segments.map((item, index) => (
          <div
            key={index}
            className="rounded-xl bg-gray-50 dark:bg-[#2b2b2b] border border-gray-100 dark:border-gray-700 py-2 px-1 flex flex-col items-center"
          >
            {/* Color Dot */}
            <span
              className="w-2.5 h-2.5 rounded-full mb-1"
              style={{
                backgroundColor: item.color,
              }}
            />

            {/* Label */}
            <p className="text-[9px] sm:text-[10px] font-medium text-center text-gray-500 dark:text-gray-300 leading-tight">
              {item.label}
            </p>

            {/* Value */}
            <p className="mt-1 text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassAnalyticsChart;