"use client";

import BaseLayout2 from "@/components/BaseLayout2";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import MyClass from "./MyClass";
import axios from "axios";
import { MoreVertical, Search } from "lucide-react";
import { MdTune } from "react-icons/md";
import Pagination from "@/components/Pagination";
import SupervisorHeader from "@/app/supervisor/components/supervisorHeader";

interface Student {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
}

interface Teacher {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
}

interface ClassData {
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
}

interface ApiResponse {
  totalCount: number;
  classSchedule: ClassData[];
}

type SortableKeys =
  | "classID"
  | "teacherName"
  | "package"
  | "startDate"
  | "status";

const Classes = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Scheduled" | "Completed">(
    "Scheduled"
  );
  const [upcomingClasses, setUpcomingClasses] = useState<ClassData[]>([]);
  const [completedClasses, setCompletedClasses] = useState<ClassData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [popupVisible, setPopupVisible] = useState<string | null>(null);
  const [popupDirection, setPopupDirection] = useState<"up" | "down">("down");

  const itemsPerPage = 8;

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const studentId =
          typeof window !== "undefined"
            ? localStorage.getItem("StudentPortalId")
            : null;
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("StudentAuthToken")
            : null;

        if (!studentId || !token) {
          console.log("Missing studentId or authToken");
          return;
        }

        const response = await axios.get<ApiResponse>(
          "https://api.blackstoneinfomaticstech.com/classShedule/students",
          {
            params: { studentId },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const classes = response.data.classSchedule;
        const now = new Date();

        const upcoming = classes
          .filter((cls) => {
            const classDate = new Date(cls.startDate);
            const [startHours, startMinutes] = cls.startTime[0]?.split(":") || [
              0, 0,
            ];
            classDate.setHours(+startHours, +startMinutes, 0, 0);
            return (
              now < classDate &&
              (cls.scheduleStatus === "Scheduled" ||
                cls.scheduleStatus === "Rescheduled")
            );
          })
          .sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );

        const completed = classes
          .filter((cls) => cls.scheduleStatus === "Completed")
          .sort(
            (a, b) =>
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
        setUpcomingClasses(upcoming);
        setCompletedClasses(completed);
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };

    fetchClasses();
  }, []);

  const filteredClasses =
    activeTab === "Scheduled" ? upcomingClasses : completedClasses;
  const displayedClasses = filteredClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePopupToggle = (classId: string) => {
    setPopupVisible(popupVisible === classId ? null : classId);
  };

  const handleReschedule = (classId: string) => {
    router.push(`/student/ui/Reschedule?classId=${classId}`);
  };

  const handleCancel = (classId: string) => {
    console.log(`Cancel clicked for classId: ${classId}`);
    setPopupVisible(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClasses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);

  return (
    <BaseLayout2>
      <div className="mx-auto max-w-screen-2xl sm:px-1 md:px-2 lg:px-4 ">
        <SupervisorHeader currentSection="Scheduled Meetings" />
        <MyClass />

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6 py-6 px-2 sm:px-4">
          {["Scheduled", "Completed"].map((tab) => (
            <button
              key={tab}
              className={`relative text-sm sm:text-base md:text-lg transition font-medium ${
                activeTab === tab
                  ? "text-[#576CBC] font-medium "
                  : "text-[#010E30] dark:text-white"
              }`}
              onClick={() => setActiveTab(tab as "Scheduled" | "Completed")}
            >
              {tab} (
              {tab === "Scheduled"
                ? upcomingClasses.length
                : completedClasses.length}
              )
              {activeTab === tab && (
                <span className="absolute left-0 -bottom-1 w-full h-[2px] rounded-full bg-[#576CBC]" />
              )}
            </button>
          ))}
        </div>

        <div className="w-full bg-[#FAFAFB] rounded-lg dark:bg-[#343434] overflow-x-auto scrollbar-none">
          <div className="flex flex-col md:flex-row items-start md:items-center px-4 relative gap-4 md:gap-0">
            <div className="flex-1 flex items-center gap-2 text-sm text-gray-500 justify-start px-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by keyword"
                className="bg-transparent outline-none text-sm w-full max-w-[200px] py-2"
              />
            </div>
            <div className="flex-1 flex items-center gap-2 text-sm text-gray-400 cursor-pointer justify-start border-y-0 border-l-2 border-r-2 border-gray-300 dark:border-[#868585] h-full md:h-[40px] px-4">
              <MdTune className="w-5 h-5" />
              <span>Filter</span>
            </div>
            <div className="flex-1 flex items-center text-sm  px-4 text-gray-500 justify-start">
              <span>
                Showing {displayedClasses.length} of {filteredClasses.length}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full border-collapse table-auto">
              <thead>
                <tr>
                  {[
                    "Class ID",
                    "Teacher Name",
                    "Course",
                    "Date",
                    "Time",
                    "Status",
                    "Action",
                  ].map((col, idx) => (
                    <th
                      key={col}
                      className="px-4 py-3.5 text-center font-light border text-sm border-[#4C6993] bg-[#4C6993] text-white dark:bg-[#6087C0]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      No classes found.
                    </td>
                  </tr>
                ) : (
                  currentItems.map((cls, index) => (
                    <tr
                      key={cls._id}
                      className={`${
                        index % 2 === 0
                          ? "bg-white dark:bg-[#2C2C2C]"
                          : "bg-[#F8F8F8] dark:bg-[#303030]"
                      }`}
                    >
                      <td className="px-4 py-3 text-xs text-center break-words">
                        {cls._id}
                      </td>
                      <td className="px-4 py-3 text-xs text-center text-[#576CBC]">
                        {cls.teacher?.teacherName || "N/A"}
                      </td>
                      <td className="px-4 py-3  text-xs text-center">
                        {cls.package}
                      </td>
                      <td className="px-4 py-3  text-xs text-center">
                        {new Date(cls.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3  text-xs text-center">
                        {cls.startTime[0]} - {cls.endTime[0]}
                      </td>
                      <td className="px-4 py-3 text-xs text-center">
                        <span
                          className={`px-3 py-1 rounded-sm text-xs font-semibold inline-block ${
                            cls.scheduleStatus === "Scheduled"
                              ? "bg-[#ECFDF3] text-[#377E36] dark:bg-[#408d4033]"
                              : cls.scheduleStatus === "Completed"
                              ? "bg-[#ECFDF3] text-[#377E36] dark:bg-[#408d4033]"
                              : "bg-gray-200 text-gray-600 dark:bg-[#DEDEDE33] dark:text-[#ECFDF3]"
                          }`}
                        >
                          {cls.scheduleStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center relative">
                        {activeTab === "Scheduled" &&
                        (cls.scheduleStatus === "Scheduled" ||
                          cls.scheduleStatus === "Rescheduled") ? (
                          <>
                           {popupVisible === cls._id && (
                              <div
                          className="absolute right-0 z-50 w-40 bottom-2 bg-white border rounded-lg shadow-lg dark:bg-[#2C2C2C] ">

                                <button
                                  onClick={() => handleReschedule(cls._id)}
                                  className="block w-full px-4 py-2 text-center text-xs text-gray-700 dark:text-[#ECFDF3] hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                  Request Reschedule
                                </button>
                                <div className="w-full h-px bg-[#D4D4D4] mx-auto" />
                                <button
                                  onClick={() => handleCancel(cls._id)}
                                  className="block w-full px-4 py-2 text-center text-xs text-gray-700 hover:bg-gray-100 dark:text-[#ECFDF3] dark:hover:bg-gray-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                            <button
                              onClick={(e) => handlePopupToggle(cls._id)}
                              className="inline-flex justify-center p-1"
                            >
                              <MoreVertical className="w-4 h-4 text-slate-900 dark:text-white" />
                            </button>
                          
                          </>
                        ) : activeTab === "Completed" ? (
                          <div className="flex justify-center">
                            <MoreVertical className="w-4 h-4 text-slate-900 dark:text-white" />
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </BaseLayout2>
  );
};

export default Classes;
