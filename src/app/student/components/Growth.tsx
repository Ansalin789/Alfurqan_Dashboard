'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface StudentLevel {
  studentId: string;
  level: string;
  monthLabel: string;
}

interface APIResponse {
  studentCount: number;
  studentCountByLevel: StudentLevel[];
  fromDate: string;
  toDate: string;
}

const Growth: React.FC = () => {
  const [monthlyLevels, setMonthlyLevels] = useState<number[]>(Array(12).fill(0));
  const [maxLevel, setMaxLevel] = useState<number>(5); // Default max level
  const [studentId, setStudentId] = useState<string | null>(null);

  const width = 1000;
  const height = 160;
  const padding = 0;

  const points = monthlyLevels.map((val, i) => {
    const x = (i / 11) * width;
    const y = height - (val / maxLevel) * (height - padding);
    return { x, y };
  });

  const getSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return '';
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const cp1x = (pts[i - 1].x + pts[i].x) / 2;
      const cp1y = pts[i - 1].y;
      const cp2x = (pts[i - 1].x + pts[i].x) / 2;
      const cp2y = pts[i].y;
      d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${pts[i].x},${pts[i].y}`;
    }
    return d;
  };

  const curvePath = getSmoothPath(points);
  const areaPath = `${curvePath} L${width},${height} L0,${height} Z`;

  useEffect(() => {

    const studentId = localStorage.getItem("StudentPortalId");
    if (!studentId) {
      console.warn("No studentId found in localStorage");
      return;
    }
    const fetchStudentLevels = async () => {
      try {
        const res = await axios.get<APIResponse>(
          `https://api.blackstoneinfomaticstech.com/alstudents/studentslevel?studentId=${studentId}`
        );
        console.log("API response:", res.data);
        const data = res.data.studentCountByLevel;

        const updatedLevels = Array(12).fill(0);
        const monthMap: { [key: string]: number } = {
          Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
          Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
        };

        let highestLevel = 5;

        data.forEach((entry) => {
          const [month] = entry.monthLabel.split(' ');
          const monthIndex = monthMap[month];
          const levelNum = parseInt(entry.level);

          if (monthIndex !== undefined) {
            updatedLevels[monthIndex] = levelNum;
            if (levelNum > highestLevel) highestLevel = levelNum;
          }
        });

        setMonthlyLevels(updatedLevels);
        setMaxLevel(highestLevel);
      } catch (error) {
        console.error('Failed to fetch student levels:', error);
      }
    };

    fetchStudentLevels();
  }, [studentId]);

  return (
    <div className="bg-white dark:bg-[#343434] rounded-xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[16px] dark:text-white font-semibold text-[#0f172a]">
          Growth
        </h2>
        <div className="bg-[#EFEFEF] dark:bg-[#565656] text-[#3E5E8A] dark:text-white py-[2px] px-2 rounded-md text-[11px] font-medium">
          <span>Monthly</span>
        </div>
      </div>

      {/* Graph */}
      <div className="flex">
        {/* Y-Axis */}
        <div className="flex flex-col justify-between text-xs text-slate-400 dark:text-gray-400 mr-3 h-[160px] pt-2 pb-4">
          {Array.from({ length: maxLevel }, (_, i) => maxLevel - i).map((label) => (
            <div key={label} className="h-[26px] flex items-center justify-end pr-1">
              <span className="block leading-none">L{label}</span>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="relative flex-1 h-[160px]">
          <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#86efac" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Area under the line */}
            <path d={areaPath} fill="url(#greenGradient)" stroke="none" />
            {/* Curved Line */}
            <path d={curvePath} fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="4" />

            {/* Bars */}
            {monthlyLevels.map((val, i) => {
              if (val === 0) return null;
              const x = (i / 11) * width;
              const barWidth = 18;
              const y = height - (val / maxLevel) * (height - padding);
              return (
                <rect
                  key={i}
                  x={x - barWidth / 2}
                  y={y}
                  width={barWidth}
                  height={height - y}
                  fill="#bbf7d0"
                  opacity={0.7}
                  rx={4}
                />
              );
            })}

            {/* Dots and labels */}
            {points.map((point, idx) => (
              <React.Fragment key={idx}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="#22c55e"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
                {monthlyLevels[idx] === maxLevel && (
                  <text
                    x={point.x}
                    y={point.y - 8}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#22c55e"
                    fontWeight="bold"
                  >
                    {monthlyLevels[idx]}
                  </text>
                )}
              </React.Fragment>
            ))}

            {/* Grid Lines */}
            {[32, 64, 96, 128].map((y) => (
              <line key={y} x1="0" y1={y} x2={width} y2={y} stroke="#e2e8f0" strokeWidth="0.6" />
            ))}
          </svg>
        </div>
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-300 mt-2 px-4">
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
          (month) => (
            <span key={month} className="w-[8%] text-center">
              {month}
            </span>
          )
        )}
      </div>
    </div>
  );
};

export default Growth;
