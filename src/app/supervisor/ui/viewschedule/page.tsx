"use client";

import BaseLayout3 from "@/components/BaseLayout3";
import React, { useState, useRef, useEffect } from "react";
import { HiOutlineDotsHorizontal, HiOutlineX } from "react-icons/hi";
import { useRouter } from "next/navigation";
import axios from "axios";
import SupervisorHeader from "../../components/supervisorHeader";
import { Search } from "lucide-react";
import { FaChevronDown } from "react-icons/fa";
import { MdTune } from "react-icons/md";
import Pagination from "@/components/Pagination";

const ViewSchedule = () => {
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

  interface Schedule {
    student: Student;
    teacher: Teacher;
    _id: string;
    classDay: string[];
    package: string;
    preferedTeacher: string;
    totalHourse: number;
    startDate: string;
    endDate: string;
    startTime: string[];
    endTime: string[];
    scheduleStatus: string;
    status: string;
    createdBy: string;
    createdDate: string;
    lastUpdatedDate: string;
    __v: number;
  }

  interface ApiResponse {
    totalCount: number;
    students: Schedule[];
  }
  const [uniqueStudentSchedules, setUniqueStudentSchedules] = useState<
    Schedule[]
  >([]);
  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);

  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("SupervisorAuthToken")
            : null;

        if (!token) {
          console.error("❌ SupervisorAuthToken not found");
          return;
        }
        const response = await axios.get<ApiResponse>(
          "https://api.blackstoneinfomaticstech.com/classShedule",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const now = new Date();
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today to start of the day

        const futureSchedules = response.data.students
          .map((schedule) => {
            const scheduleDate = new Date(schedule.startDate);
            scheduleDate.setHours(0, 0, 0, 0); // Normalize schedule date

            let isOngoing = false;
            let isFuture = false;
            let formattedTimes: string[] = [];

            schedule.startTime.forEach((time, index) => {
              if (!schedule.endTime[index]) return;

              const [startHours, startMinutes] = time.split(":").map(Number);
              const [endHours, endMinutes] = schedule.endTime[index]
                .split(":")
                .map(Number);

              const scheduleStart = new Date(schedule.startDate);
              scheduleStart.setHours(startHours, startMinutes, 0, 0);

              const scheduleEnd = new Date(schedule.startDate);
              scheduleEnd.setHours(endHours, endMinutes, 0, 0);

              if (now >= scheduleStart && now <= scheduleEnd) {
                isOngoing = true; // ✅ Mark as ongoing if current time is within the range
              }

              if (scheduleStart > now) {
                isFuture = true; // ✅ Mark as future if it hasn't started yet
              }

              formattedTimes.push(`${time} - ${schedule.endTime[index]}`);
            });

            return {
              ...schedule,
              isOngoing,
              isFuture,
              scheduleDate,
              formattedTimes,
            };
          })
          .filter((schedule): schedule is NonNullable<typeof schedule> => {
            if (!schedule) return false;
            // ✅ Keep today's schedules only if they are ongoing or in the future
            if (schedule.scheduleDate.getTime() === today.getTime()) {
              return schedule.startTime.some((time, index) => {
                const [hours, minutes] = time.split(":").map(Number);
                const scheduleStart = new Date(schedule.startDate);
                scheduleStart.setHours(hours, minutes, 0, 0);

                const [endHours, endMinutes] = schedule.endTime[index]
                  .split(":")
                  .map(Number);
                const scheduleEnd = new Date(schedule.startDate);
                scheduleEnd.setHours(endHours, endMinutes, 0, 0);

                return now <= scheduleEnd; // ✅ Keep schedules that are ongoing or upcoming today
              });
            }
            return schedule.scheduleDate > today;
          })
          .sort((a, b) => {
            if (a.isOngoing && !b.isOngoing) return -1; // Show ongoing schedules first
            if (!a.isOngoing && b.isOngoing) return 1;
            return a.scheduleDate.getTime() - b.scheduleDate.getTime(); // Sort by date
          });

        setUniqueStudentSchedules(futureSchedules);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const [showFilter, setShowFilter] = useState(false);
  const dataToShow = uniqueStudentSchedules;
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = uniqueStudentSchedules.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(uniqueStudentSchedules.length / itemsPerPage);

  const toggleMenu = (index: number) => {
    setSelectedMenu(selectedMenu === index ? null : index);
  };

  const handleLiveClassRedirect = (id: string) => {
    router.push("/supervisor/ui/liveclass");
    localStorage.setItem("showfeedbackid", id);
    localStorage.setItem("showfeedbackdirect", JSON.stringify(false));
  };

  const handleFeedbackRedirect = (id: string) => {
    router.push("/supervisor/ui/liveclass");
    localStorage.setItem("showfeedbackid", id);
    localStorage.setItem("showfeedbackdirect", JSON.stringify(true));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setSelectedMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const isToday = (date: string) => {
    const today = new Date();
    const classDate = new Date(date);
    return (
      classDate.getFullYear() === today.getFullYear() &&
      classDate.getMonth() === today.getMonth() &&
      classDate.getDate() === today.getDate()
    );
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([]);
  };

  const getEarliestTime = (times: string[]) => {
    return times.length ? times.toSorted((a, b) => a.localeCompare(b))[0] : "";
  };

  const isClassOngoing = (
    startDate: string,
    startTimes: string[],
    endTimes: string[]
  ) => {
    const now = new Date();
    const today = new Date(startDate); // This is in UTC

    // Convert `today` to local timezone (to avoid mismatch issues)
    const localToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    if (
      localToday.getFullYear() === now.getFullYear() &&
      localToday.getMonth() === now.getMonth() &&
      localToday.getDate() === now.getDate()
    ) {
      return startTimes.some((time, index) => {
        const [startHours, startMinutes] = time.split(":").map(Number);
        const [endHours, endMinutes] = endTimes[index].split(":").map(Number);

        const classStartTime = new Date(localToday);
        classStartTime.setHours(startHours, startMinutes, 0, 0);

        const classEndTime = new Date(localToday);
        classEndTime.setHours(endHours, endMinutes, 0, 0);

        return now >= classStartTime && now <= classEndTime;
      });
    }
    return false;
  };

  return (
    <BaseLayout3>
      <SupervisorHeader currentSection="Scheduled Classes" />

      <div className="w-full h-[588px] bg-[#FAFAFB] rounded-lg dark:bg-[#343434]">
        <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434] h-10">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Search className="w-4 h-4 text-gray-400 dark:text-gray-400 mt-3 " />
            <input
              type="text"
              placeholder="Search by keyword"
              className="bg-transparent outline-none  w-52 py-3 mt-3 text-[14px]"
            />
          </div>

          <div className="relative ">
            <div
              className="flex justify-between items-center w-96 bg-gray-50 dark:bg-[#343434] 
  border-y-0 border-l border-r border-gray-200 dark:border-[#606060]
  text-sm text-gray-500 py-[15.5px] mt-[12px] px-3 cursor-pointer -ml-60"
              onClick={() => setShowFilter(!showFilter)}
            >
              <div className="flex items-center gap-1">
                <MdTune className="w-4 h-4" />
                <span className="text-sm">Filter</span>
              </div>
              <FaChevronDown className="w-3 h-3" />
            </div>

            {/* Filter Popup */}
            {showFilter && (
              <div
                className="absolute top-14 left-0 bg-white dark:bg-[#343434] rounded-lg shadow-lg w-80 p-6 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
                    Filter by
                  </h3>
                  <button onClick={() => setShowFilter(false)}>
                    <HiOutlineX className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                  </button>
                </div>

                {/* Date */}
                <label className="block text-sm text-gray-700 mb-1 dark:text-white">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full mb-4 border border-gray-300 dark:bg-[#343434] dark:text-white rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Course */}
                <label className="block text-sm text-gray-700 mb-1 dark:text-white">
                  Course
                </label>
                <input
                  type="text"
                  placeholder="Course name"
                  className="w-full mb-4 border border-gray-300 dark:bg-[#343434] dark:text-white rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Course Type */}
                <label className="block text-sm text-gray-700 mb-1 dark:text-white">
                  Course Type
                </label>
                <select className="w-full mb-4 border border-gray-300 dark:bg-[#343434] dark:text-white rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Online</option>
                  <option>Offline</option>
                </select>

                {/* Timing */}
                <label className="block text-sm text-gray-700 mb-1 dark:text-white">
                  Timing
                </label>
                <input
                  type="time"
                  className="w-full mb-4 border border-gray-300 dark:bg-[#343434] dark:text-white rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Status */}
                <label className="block text-sm text-gray-700 mb-1 dark:text-white">
                  Status
                </label>
                <select className="w-full mb-4 border border-gray-300 dark:bg-[#343434] dark:text-white rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Scheduled</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>

                <hr className="my-4" />

                <div className="flex justify-between">
                  <button
                    className="px-4 py-2 rounded-md border border-indigo-300 text-indigo-600 hover:bg-indigo-50 text-sm"
                    onClick={() => setShowFilter(false)}
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 text-sm">
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
            <span className="text-left -ml-60 mt-3 text-[14px]">
              Showing {currentItems.length} Of {uniqueStudentSchedules.length}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg   flex flex-col justify-between dark:bg-[#343434]">
          <div className="overflow-x-auto">
            <table className="table-auto  w-full border-separate border-spacing-y-3">
              <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0] border border-[#4C6993]">
                <tr>
                  {[
                    "Name",
                    "Id",
                    "Courses",
                    "Courses Type",
                    "Date",
                    "Time",
                    "Status",
                  ].map((header) => (
                    <th
                      key={header}
                      className="  b whitespace-nowrap text-left px-3 py-3 font-medium border  border-[#fff]"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr
                    key={item._id}
                    className={`text-[12px]  ${
                      index % 2 === 0
                        ? "bg-[#fff] dark:bg-[#2C2C2C] "
                        : "bg-[#F8F8F8] dark:bg-[#303030]"
                    }`}
                  >
                   
                    <td className="px-3 py-2 text-[#3D8FDE] dark:text-[#3D8FDE]">
                      {item.teacher.teacherName}
                    </td>
                    <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                      {item._id}
                    </td>
                    <td className="px-6 py-3 text-center">Quran</td>
                    <td className="px-6 py-3 text-center">MasterClass</td>
                    <td className="px-6 py-3 text-center">
                      {new Date(item.startDate).toDateString()}
                    </td>
                    <td className="px-6 py-3 text-center">
                      {(() => {
                        let content;
                        console.log(
                          "Checking for:",
                          item.startDate,
                          item.startTime,
                          item.endTime
                        );
                        if (
                          isClassOngoing(
                            item.startDate,
                            item.startTime,
                            item.endTime
                          )
                        ) {
                          content = (
                            <button
                              onClick={() => handleLiveClassRedirect(item._id)}
                              className="py-1 px-2 text-black rounded-lg bg-green-500 cursor-pointer hover:opacity-80 dark:text-[#ffff]"
                            >
                              Ongoing Now ({item.startTime[0]} -{" "}
                              {item.endTime[0]})
                            </button>
                          );
                        } else if (isToday(item.startDate)) {
                          content = (
                            <span className="py-1 px-2 text-black rounded-lg bg-yellow-500 dark:text-[#ffff]">
                              Scheduled at{" "}
                              {formatTime(getEarliestTime(item.startTime))}
                            </span>
                          );
                        } else {
                          content = (
                            <span className="py-1 px-2 text-black rounded-lg dark:text-[#ffff] ">
                              Scheduled at{" "}
                              {formatTime(getEarliestTime(item.startTime))}
                            </span>
                          );
                        }
                        return content;
                      })()}
                    </td>

                    <td className="px-3 py-2">
  {item.scheduleStatus === 'Scheduled' && (
    <span className="bg-blue-100 text-[#343E59] text-[10px] font-medium px-3 py-1 rounded-sm">
      Scheduled
    </span>
  )}
  {item.scheduleStatus === 'Re-Scheduled' && (
    <span className="bg-gray-200 text-[#343E59] text-[10px] font-medium px-2 py-1 rounded-sm">
      Re-Scheduled
    </span>
  )}
  {item.scheduleStatus === 'Completed' && (
    <span className="bg-[#ECFDF3] text-[#377E36] text-[10px] px-2 py-1 font-medium  rounded-sm">
      Completed
    </span>
  )}
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div></div>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </BaseLayout3>
  );
};

export default ViewSchedule;
