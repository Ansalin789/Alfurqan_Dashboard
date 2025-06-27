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

  const radiusOffset = [65, 50, 35]; // Radius for Scheduled, Completed, Absent
  const total = chartData.reduce((a, b) => a + b, 0);
  const circleData = chartData.map((value, i) => {
    const percent = total ? (value / total) * 100 : 0;
    const radius = radiusOffset[i];
    const circumference = 2 * Math.PI * radius;
    const dash = (percent / 100) * circumference;
    return { radius, color: COLORS[i], dash, circumference };
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white dark:bg-[#343434] shadow-md rounded-2xl px-6 py-4 flex flex-col md:flex-row items-center justify-between w-full h-full">
      {/* SVG Chart */}
      <div className="relative w-[200px] h-[200px] flex items-center justify-center">
        <svg viewBox="0 0 160 160" className="w-full h-full">
          {circleData.map(({ radius, color, dash, circumference }, i) => (
            <circle
              key={i}
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke={color}
              strokeWidth="6"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeLinecap="round"
              transform="rotate(-90 80 80)"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-[28px] font-bold text-[#0E1B3D] dark:text-white">
            {totalClasses}
          </p>
          <p className="text-xs text-[#7B7E8E] dark:text-gray-300 font-semibold mt-1">
            TOTAL CLASS ASSIGNED
          </p>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="flex flex-col w-full max-w-[300px] mt-6 md:mt-0 md:ml-6">
        <h3 className="text-[#0E1B3D] dark:text-white font-bold text-[18px] mb-4">
          Class Analytics
        </h3>
        <div className="space-y-3">
          {["Scheduled", "Completed", "Absent"].map((label, index) => (
            <div key={label} className="flex justify-between items-center">
              <div className="flex items-center">
                <span
                  className="inline-block w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-[#1E2B4B] dark:text-white/80 font-medium text-sm">
                  {label}
                </span>
              </div>
              <span className="text-[#1E2B4B] dark:text-white/80 font-semibold text-sm">
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
