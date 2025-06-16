'use client';

import axios from "axios";
import React, { useState, useEffect } from "react";

interface Student {
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  studentPhone: number;
  studentCountry: string;
  preferredTeacher: string;
  learningInterest: string;
}

interface Evaluation {
  _id: string;
  classStartDate: string;
  classStartTime: string;
  classEndTime: string;
  student: Student;
}

const UpcomingClasses: React.FC = () => {
  const [classes, setClasses] = useState<
    { id: string; date: string; time: string; title: string; color: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  // Define the color cycle
  const colorCycle = [
    "blue-400",
    "emerald-400",
    "purple-400",
    "rose-400",
    "amber-400"
  ];

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("AcademicCoachAuthToken") : null;

        if (!token) {
          console.error("❌ AcademicCoachAuthToken not found");
          return;
        }

        const academicId = localStorage.getItem("AcademicCoachPortalId");

        const response = await axios.get(
          `https://api.blackstoneinfomaticstech.com/evaluationlist`,
          {
            method: "GET",
            params: { academicCoachId: academicId },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data) {
          throw new Error(`Failed to fetch classes: ${response.statusText}`);
        }

        const data = response.data;
        const upcomingClasses = data.evaluation
          .filter((item: Evaluation) => {
            const classStartDate = new Date(item.classStartDate);
            const now = new Date();
            return classStartDate > now;
          })
          .sort((a: Evaluation, b: Evaluation) => {
            return (
              new Date(a.classStartDate).getTime() -
              new Date(b.classStartDate).getTime()
            );
          })
          .slice(0, 2)
          .map((item: Evaluation, index: number) => ({
            id: item._id,
            date: new Date(item.classStartDate).toLocaleDateString("en-GB", {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }).replace(/\//g, '-'),
            time: `${item.classStartTime} - ${item.classEndTime}`,
            title: item.student.learningInterest || "Class",
            color: colorCycle[index % colorCycle.length],
          }));

        setClasses(upcomingClasses);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      }
    };

    fetchClasses();
  }, []);

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="pl-4 py-4">
      {/* <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Upcoming Classes</h3>
        <button className="text-sm px-2 py-1 bg-gray-100 rounded-md text-blue-600">
          Today
        </button>
      </div> */}
      <div className="relative border-l-2 border-dotted border-[#000] dark:border-[#fff] ml-5 space-y-6">
        {classes.length === 0 ? (
          <p className="text-center text-gray-600 text-sm">No upcoming classes.</p>
        ) : (
          classes.map((classItem, index) => {
            const colors = [
              "bg-[#d77277]",
              "bg-[#72B0D7]",
              "bg-[#BF63B3]",
              "bg-[#BFBC63]",
              "bg-[#BF8C63]",
              "bg-[#6EBF63]"
            ];
            const textColors = [
              "text-[#d77277]",
              "text-[#72B0D7]",
              "text-[#BF63B3]",
              "text-[#BFBC63]",
              "text-[#BF8C63]",
              "text-[#6EBF63]"
            ];
            const currentColor = colors[index % colors.length];
            const currentTextColor = textColors[index % textColors.length];

            return (
              <div key={classItem.id} className="relative flex items-start">
                {/* Time and dot */}
                <div className="absolute -left-[46px] mt-6 flex flex-row items-center gap-2 justify-between">
                  <span className="text-xs font-medium text-gray-700 dark:text-[#fff]">{classItem.time.split(' ')[0]}</span>
                  <div
                    className={`w-[10px] h-[10px] rounded-full ${currentColor} ml-[3px]`}
                  />
                </div>

                {/* Card */}
                <div className="bg-[#f4f4f4] dark:bg-[#404040] rounded-md p-2 w-full shadow-sm ml-4">
                  <div className="flex justify-between text-[10px] text-gray-500 dark:text-[#fff] dark:opacity-85">
                    <span>{classItem.date}</span>
                    <span>{classItem.time}</span>
                  </div>
                  <h4 className={`text-[14px] font-medium ${currentTextColor}`}>
                    {classItem.title}
                  </h4>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UpcomingClasses;
