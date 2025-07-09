"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const UpcomingTable = () => {
  interface ClassEvent {
    _id: string;
    classDay: string[];
    package: string;
    preferedTeacher: string;
    totalHours: number;
    startDate: string;
    endDate: string;
    startTime: string[];
    endTime: string[];
    scheduleStatus: string;
    status: string;
    teacher: {
      teacherName: string;
    };
    course:{
        courseName: string;
    }
  }

  const [classes, setClasses] = useState<ClassEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const studentId = localStorage.getItem("StudentPortalId");
        const token = localStorage.getItem("StudentAuthToken");
  
        if (!token || !studentId) return;
  
        const response = await axios.get(
          "https://api.blackstoneinfomaticstech.com/classShedule/students",
          {
            params: { studentId },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const now = new Date();
  
        const upcoming = response.data.classSchedule
          .filter((cls: ClassEvent) => {
            const classDate = new Date(cls.startDate);
            const [startHour, startMinute] = cls.startTime[0]?.split(":") || ["00", "00"];
            classDate.setHours(+startHour, +startMinute, 0, 0);
  
            return (
              now < classDate &&
              cls.scheduleStatus === "Scheduled" // ✅ Only Scheduled
            );
          })
          .sort((a: ClassEvent, b: ClassEvent) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          )
          .slice(0, 5); // Limit to 5
  
        setClasses(upcoming);
      } catch (err) {
        console.error("Error fetching student classes", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchClasses();
  }, []);
  

  return (
    <div className="bg-white rounded-xl shadow-lg dark:bg-[#343434]">
      <div className="overflow-x-auto scrollbar-none h-full">
        <div className="overflow-y-auto h-[338px] rounded-xl scrollbar-none">
          <table className="min-w-full text-xs border-collapse table-fixed px-4">
            <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#44699d]">
              <tr>
                {["Class ID", "Teacher Name", "Course", "Date", "Time", "Status"].map((col) => (
                  <th
                    key={col}
                    className="py-4 px-2 font-semibold border border-[#466993] dark:border-[#466993]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-[11px] text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : classes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-[11px] text-gray-500">
                    No upcoming classes.
                  </td>
                </tr>
              ) : (
                classes.map((cls, index) => (
                  <tr
                    key={cls._id}
                    className={`text-[10px] px-2 py-4 border-none outline-none ${
                      index % 2 === 0 ? "bg-[#fff] dark:bg-[#2c2c2c]" : "bg-[#F8F8F8] dark:bg-[#303030]"
                    }`}
                  >
                    <td className="py-4 px-2 text-center">{cls._id}</td>
                    <td className="py-2 px-2 text-center text-[#3D8FDE]">{cls.teacher.teacherName}</td>
                    <td className="py-2 px-2 text-center">{cls.course.courseName}</td>
                    <td className="px-4 py-3 text-center ">
  {new Date(cls.startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })}
</td>

                    <td className="py-2 px-2 text-center">Starts at {cls.startTime[0]}</td>
                    <td className="py-2 px-2 text-center">
  <span
    className={`px-2 py-1 rounded-sm text-[10px] font-semibold ${
      cls.scheduleStatus === "Scheduled"
        ? "bg-[#ECFDF3] text-[#377E36] dark:bg-[#408d4033]"
        : "text-gray-800 dark:text-white"
    }`}
  >
    {cls.scheduleStatus}
  </span>
</td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
          <span className="text-left -ml-60">{/* Footer if needed */}</span>
        </div>
      </div>
    </div>
  );
};

export default UpcomingTable;
