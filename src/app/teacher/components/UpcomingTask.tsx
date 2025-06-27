'use client';

import axios from "axios";
import { useState, useEffect } from "react";
import { FaBook } from "react-icons/fa";

interface ClassItem {
  id: string;
  date: string;
  time: string;
  title: string;
  color: string;
  icon: JSX.Element;
  teacher: string;
}

const UpcomingTask: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const teacherId = localStorage.getItem("TeacherPortalId");
        const token = typeof window !== "undefined"
          ? localStorage.getItem("TeacherAuthToken")
          : null;

        if (!token) {
          console.error("❌ TeacherAuthToken not found");
        }

        const response = await axios.get(
          "https://api.blackstoneinfomaticstech.com/classShedule/teacher",
          {
            params: { teacherId },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fetchedClasses = response.data.classSchedule.map((item: any) => ({
          id: item._id,
          date: new Date(item.startDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }).replace(/\//g, "-"),
          time: `${item.startTime[0]} - ${item.endTime[0]}`,
          title: item.package,
          teacher: item.teacher.teacherName,
          color: "",
          icon: <FaBook className="text-sm" />,
        }));

        const sorted = fetchedClasses
          .sort((a: ClassItem, b: ClassItem) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 7);

        setClasses(sorted);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, []);

  const dotColors = [
    "bg-[#d77277]",
    "bg-[#72B0D7]",
    "bg-[#BF63B3]",
    "bg-[#BFBC63]",
    "bg-[#BF8C63]",
    "bg-[#6EBF63]",
  ];

  const textColors = [
    "text-[#d77277]",
    "text-[#72B0D7]",
    "text-[#BF63B3]",
    "text-[#BFBC63]",
    "text-[#BF8C63]",
    "text-[#6EBF63]",
  ];

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-white dark:bg-[#343434] w-full rounded-xl px-4 pt-4 pb-6">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="font-semibold text-lg text-[#010e30] dark:text-white">
          Upcoming Tasks
        </h2>
        <span className="bg-[#EBEFFF] dark:bg-[#576CBC33] text-[#6B73FF] text-xs font-medium px-2 py-1 rounded-md">
          Today
        </span>
      </div>

      <div className="relative">
        {/* Vertical Dotted Line */}
        <div className="absolute left-[48px] top-0 bottom-0 border-l-2 border-dotted border-black dark:border-white" />

        <div className="space-y-4 pl-[8px]">
          {classes.length === 0 ? (
            <p className="text-center text-gray-500 text-sm p-4">No tasks scheduled.</p>
          ) : (
            classes.map((classItem, index) => {
              const dotColor = dotColors[index % dotColors.length];
              const textColor = textColors[index % textColors.length];
              const startTime = classItem.time.split("-")[0].trim();

              return (
                <div key={classItem.id} className="flex items-start gap-2 relative w-full">
                  {/* Time */}
                  <div className="w-[38px] text-[12px] text-black dark:text-white mt-[3px] text-right pr-1">
                    {startTime}
                  </div>

                  {/* Dot */}
                  <div className="flex items-center justify-center mt-[3px] w-[12px]">
                    <div className={`w-[10px] h-[10px] rounded-full ${dotColor}`} />
                  </div>

                  {/* Task Box */}
                  <div className="flex-1 bg-[#f4f4f4] dark:bg-[#404040] rounded-md px-3 py-2">
                    <h4 className={`text-[14px] font-semibold capitalize ${textColor}`}>
                      {classItem.title}
                    </h4>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingTask;
