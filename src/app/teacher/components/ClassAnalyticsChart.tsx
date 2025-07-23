'use client';

import { useEffect, useState } from "react";
import axios from "axios";

interface Student {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  gender: "MALE" | "FEMALE";
}

interface Teacher {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
}

interface ClassSchedule {
  _id: string;
  student: Student;
  teacher: Teacher;
  classDay: string[];
  package: string;
  preferedTeacher: string;
  totalHourse: number;
  startDate: string;
  endDate: string;
  startTime: string[];
  endTime: string[];
  scheduleStatus: string;
  classLink: string;
  status: string;
  classStatus: string;
  createdBy: string;
  createdDate: string;
  lastUpdatedDate: string;
  __v: number;
  teacherAttendee: string;
}

const COLORS = ["#B4B6FD", "#6BE7A4", "#F7A9A8"]; // Scheduled, Completed, Absent

const ClassAnalytics = () => {
  const [chartData, setChartData] = useState<number[]>([]);
  const [totalClasses, setTotalClasses] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const teacherId = localStorage.getItem("TeacherPortalId");
        const token = localStorage.getItem("TeacherAuthToken");

        if (!teacherId || !token) {
          setError("Authentication data missing.");
          setLoading(false);
          return;
        }

        const response = await axios.get<{ classSchedule: ClassSchedule[] }>(
          "https://api.blackstoneinfomaticstech.com/classShedule/teacher",
          {
            params: { teacherId },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const classSchedule = response.data.classSchedule;
        const statusCount: Record<string, number> = {
          Scheduled: 0,
          Completed: 0,
          Absent: 0,
        };

        classSchedule.forEach((cls) => {
          if (cls.classStatus?.toLowerCase() === "pending") {
            statusCount["Scheduled"] += 1;
          } else if (cls.classStatus?.toLowerCase() === "completed") {
            statusCount["Completed"] += 1;
          }
          if (cls.teacherAttendee?.toLowerCase() === "absent") {
            statusCount["Absent"] += 1;
          }
        });

        const total =
          statusCount["Scheduled"] +
          statusCount["Completed"] +
          statusCount["Absent"];

        setChartData([
          statusCount["Scheduled"],
          statusCount["Completed"],
          statusCount["Absent"],
        ]);
        setTotalClasses(total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, []);

  // SVG chart calculations
  const radiusOffset = [65, 50, 35]; // Outer to inner rings
  const total = chartData.reduce((a, b) => a + b, 0);
  const circleData = chartData.map((value, i) => {
    const percent = total ? (value / total) * 100 : 0;
    const radius = radiusOffset[i];
    const circumference = 2 * Math.PI * radius;
    const dash = (percent / 100) * circumference;
    return { radius, color: COLORS[i], dash, circumference };
  });

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    
       <div className="bg-white dark:bg-[#343434] shadow-md rounded-2xl px-6 py-4 w-full h-full">
    {/* Header */}
    <h3 className="text-[#0E1B3D] dark:text-white font-semibold text-[16px] mb-4">
      Class Analytics
    </h3>

    {/* Chart and Legend */}
    <div className="flex flex-col md:flex-row  items-center justify-between">
      {/* Left: SVG Chart */}
      <div className="relative w-[160px] h-[160px] flex items-center justify-center">
        <svg viewBox="0 0 160 160" className="w-full h-full">
          {circleData.map(({ radius, color, dash, circumference }, i) => (
            <circle
              key={i}
              cx="140"
              cy="80"
              r={radius - 2} // space around center text
              fill="transparent"
              stroke={color}
              strokeWidth="10"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeLinecap="round"
              transform="rotate(-90 80 80)"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-[28px] font-bold text-[#0E1B3D] dark:text-white leading-none">
            {totalClasses}
          </p>
          <p className="text-[11px] text-black dark:text-gray-300 font-normal text-center leading-tight mt-3">
            TOTAL<br />CLASS<br />ASSIGNED
          </p>
        </div>
      </div>

      {/* Right: Legend */}
      <div className="flex flex-col justify-center mt-6 md:mt-0 md:ml-6 w-full max-w-[220px] space-y-3">
        {["Scheduled", "Completed", "Absent"].map((label, index) => (
          <div key={label} className="flex justify-between items-center">
            <div className="flex items-center">
              <span
                className="inline-block w-3 h-3  rounded-full mr-2"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-sm font-medium text-[#1E2B4B] dark:text-white/80">
                {label}
              </span>
            </div>
            <span className="text-sm font-semibold text-[#1E2B4B] ml-2 dark:text-white/80">
              {chartData[index]}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
};

export default ClassAnalytics;
