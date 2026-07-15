"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const TeachingActivity: React.FC = () => {
  const [monthlyHours, setMonthlyHours] = useState<number[]>(
    Array(12).fill(0)
  );

  const [view, setView] = useState("Monthly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachingActivity();
  }, []);

  const fetchTeachingActivity = async () => {
    try {
      const token = localStorage.getItem("TeacherAuthToken");
      const teacherId = localStorage.getItem("TeacherPortalId");

      if (!token || !teacherId) {
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "https://api.blackstoneinfomaticstech.com/classShedule",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const schedules = response.data.students.filter(
        (item: any) => item.teacher?.teacherId === teacherId
      );

      const data = Array(12).fill(0);

      schedules.forEach((schedule: any) => {
        if (!schedule.startDate) return;

        const month = new Date(schedule.startDate).getMonth();

        schedule.classDay?.forEach((_: any, index: number) => {
          const start = schedule.startTime?.[index];
          const end = schedule.endTime?.[index];

          if (!start || !end) return;

          const [sh, sm] = start.split(":").map(Number);
          const [eh, em] = end.split(":").map(Number);

          const startMinutes = sh * 60 + sm;
          const endMinutes = eh * 60 + em;

          const duration = Math.max(
            0,
            (endMinutes - startMinutes) / 60
          );

          data[month] += duration;
        });
      });

      setMonthlyHours(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const chartHeight = 170;
  const chartWidth = 900;
  const padding = 20;

  const maxValue = Math.max(...monthlyHours, 1);

  const yLabels = useMemo(() => {
    const steps = 5;

    return Array.from({ length: steps + 1 }, (_, i) =>
      Math.round(maxValue - (maxValue / steps) * i)
    );
  }, [maxValue]);  const points = monthlyHours.map((value, index) => {
    const x = (index / (MONTHS.length - 1)) * chartWidth;
    const y =
      chartHeight -
      (value / maxValue) * (chartHeight - padding);

    return { x, y };
  });

  const getSmoothPath = (
    pts: { x: number; y: number }[]
  ) => {
    if (pts.length < 2) return "";

    let d = `M ${pts[0].x} ${pts[0].y}`;

    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];

      const cp1x = (prev.x + curr.x) / 2;
      const cp1y = prev.y;

      const cp2x = (prev.x + curr.x) / 2;
      const cp2y = curr.y;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }

    return d;
  };

  const linePath = getSmoothPath(points);

  const areaPath = `
    ${linePath}
    L ${chartWidth} ${chartHeight}
    L 0 ${chartHeight}
    Z
  `;

  const gridLines = Array.from({ length: 5 }, (_, i) => ({
    y: ((i + 1) * chartHeight) / 6,
  }));

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        Loading...
      </div>
    );
  }  return (
    <div className="bg-white dark:bg-[#343434] rounded-2xl shadow-sm p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[16px] font-semibold text-gray-900 dark:text-white">
          Teaching Activity
        </h2>

        <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="text-xs px-3 py-1 rounded-lg bg-gray-100 dark:bg-[#4B4B4B] dark:text-white outline-none"
        >
          <option>Monthly</option>
          <option>Weekly</option>
        </select>
      </div>

      <div className="flex flex-1">
        {/* Y Axis */}
        <div className="w-10 flex flex-col justify-between text-[11px] text-gray-400 dark:text-gray-500 pb-2">
          {yLabels.map((label, index) => (
            <span key={index}>{label}h</span>
          ))}
        </div>

        {/* Graph */}
        <div className="flex-1 overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
            className="w-full h-[180px]"
          >
            <defs>
              <linearGradient
                id="activityGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#4ADE80"
                  stopOpacity="0.45"
                />
                <stop
                  offset="100%"
                  stopColor="#4ADE80"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {gridLines.map((line, index) => (
              <line
                key={index}
                x1="0"
                y1={line.y}
                x2={chartWidth}
                y2={line.y}
                stroke="#E5E7EB"
                strokeDasharray="4 4"
              />
            ))}

            {/* Area */}
            <path
              d={areaPath}
              fill="url(#activityGradient)"
            />

            {/* Line */}
            <path
              d={linePath}
              fill="none"
              stroke="#22C55E"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Points */}
            {points.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  fill="#22C55E"
                  stroke="#fff"
                  strokeWidth="2"
                />

                <circle
                  cx={point.x}
                  cy={point.y}
                  r="9"
                  fill="#22C55E"
                  opacity="0.15"
                />
              </g>
            ))}
          </svg>

          {/* Month Labels */}
          <div className="flex justify-between mt-3 px-1">
            {MONTHS.map((month) => (
              <span
                key={month}
                className="text-[11px] text-gray-500 dark:text-gray-400"
              >
                {month}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachingActivity;