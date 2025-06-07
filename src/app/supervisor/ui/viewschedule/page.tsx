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
    scheduleStatus: "Scheduled" | "Re-scheduled" | "Ongoing" | "Completed" | "Ready to Start";
    status: string;
    createdBy: string;
    createdDate: string;
    lastUpdatedDate: string;
    __v: number;
    scheduleDate?: Date;
    isOngoing?: boolean;
    isFuture?: boolean;
    formattedTimes?: string[];
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

  const [activeTab, setActiveTab] = useState<string>("scheduled");
  const [upcomingClasses, setUpcomingClasses] = useState<Schedule[]>([]);
  const [completedClasses, setCompletedClasses] = useState<Schedule[]>([]);

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
        today.setHours(0, 0, 0, 0);

        const allSchedules = response.data.students.map((schedule) => {
          const scheduleDate = new Date(schedule.startDate);
          scheduleDate.setHours(0, 0, 0, 0);

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
              isOngoing = true;
            }

            if (scheduleStart > now) {
              isFuture = true;
            }

            formattedTimes.push(`${time} - ${schedule.endTime[index]}`);
          });

          // Update status based on conditions
          let updatedStatus = schedule.scheduleStatus;
          if (isOngoing) {
            updatedStatus = "Ongoing";
          } else if (schedule.scheduleStatus === "Re-scheduled") {
            updatedStatus = "Re-scheduled";
          } else if (schedule.scheduleStatus === "Completed") {
            updatedStatus = "Completed";
          } else if (isToday(schedule.startDate)) {
            if (isStartMeetingNow(schedule.startDate, schedule.startTime[0], schedule.endTime[0])) {
              updatedStatus = "Ready to Start";
            } else {
              updatedStatus = "Scheduled";
            }
          } else if (isFuture || (schedule.scheduleDate && schedule.scheduleDate > today)) {
            updatedStatus = "Scheduled";
          }

          return {
            ...schedule,
            scheduleStatus: updatedStatus,
            isOngoing,
            isFuture,
            scheduleDate,
            formattedTimes,
          };
        });

        // Filter scheduled classes (future dates or ongoing today)
        const scheduled = allSchedules.filter((schedule) => {
          // If status is completed, don't show in scheduled
          if (schedule.scheduleStatus === "Completed") {
            return false;
          }

          return ["Scheduled", "Re-scheduled", "Ongoing"].includes(schedule.scheduleStatus);
        });

        // Filter completed classes
        const completed = allSchedules.filter((schedule) => {
          return schedule.scheduleStatus === "Completed";
        });

        setUpcomingClasses(scheduled);
        setCompletedClasses(completed);
        setUniqueStudentSchedules(scheduled); // Default to scheduled classes
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Update displayed data when tab changes
  useEffect(() => {
    if (activeTab === "scheduled") {
      setUniqueStudentSchedules(upcomingClasses);
    } else if (activeTab === "completed") {
      setUniqueStudentSchedules(completedClasses);
    }
  }, [activeTab, upcomingClasses, completedClasses]);

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
    router.push(`/supervisor/ui/meetingvideocall?id=${id}`);
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

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "text-[#377E36] bg-[#ECFDF3] dark:bg-[#323E31] dark:text-[#377E36] px-[18px]";
      case "Re-scheduled":
        return "text-[#343E59] bg-[#E4E4E4] dark:bg-[#4F4F4F] dark:text-white";
      case "Ongoing":
        return "text-[#576CBC] bg-[#F3F6FF] dark:bg-[#2C3B6C] dark:text-[#576CBC]";
      case "Completed":
        return "text-[#377E36] bg-[#ECFDF3] dark:bg-[#323E31] dark:text-[#377E36]";
      case "Ready to Start":
        return "text-[#576CBC] bg-[#F3F6FF] dark:bg-[#2C3B6C] dark:text-[#576CBC]";
      default:
        return "text-[#377E36] bg-[#ECFDF3]";
    }
  };


  const isStartMeetingNow = (
    selectedDate: string,
    startTime: string,
    endTime: string
  ): boolean => {
    const now = new Date();

    // Parse date and combine with start and end times
    const date = new Date(selectedDate);

    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const start = new Date(date);
    start.setHours(startHour, startMin, 0, 0);

    const end = new Date(date);
    end.setHours(endHour, endMin, 0, 0);

    return now >= start && now <= end;
  };

  return (
    <BaseLayout3>
      <SupervisorHeader currentSection="Scheduled Classes" />
      {/* Tabs */}
      <div className="flex space-x-6 px-4 py-2 rounded-md">
        <button
          className={`relative text-[14px] transition font-medium ${
            activeTab === "scheduled"
              ? "text-[#576CBC] font-semibold"
              : "text-[#0A0A12] dark:text-[#fff] opacity-80"
          }`}
          onClick={() => setActiveTab("scheduled")}
        >
          Scheduled ({upcomingClasses.length})
          {activeTab === "scheduled" && (
            <span className="absolute left-0 ml-5 -bottom-1 w-[60px] h-[2px] rounded-full bg-[#576CBC] dark:text-[#576CBC]" />
          )}
        </button>

        <button
          className={`relative text-[14px] transition font-medium ${
            activeTab === "completed"
              ? "text-[#576CBC] font-semibold"
              : "text-[#0A0A12] dark:text-[#fff] opacity-80"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          Completed ({completedClasses.length})
          {activeTab === "completed" && (
            <span className="absolute left-0 ml-3 -bottom-1 w-[60px] h-[3px] rounded-full bg-[#576CBC]" />
          )}
        </button>
      </div>
      <div className="w-full h-[588px] bg-[#FAFAFB] rounded-lg dark:bg-[#343434]">
        <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434] h-10">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search by keyword"
              className="bg-transparent outline-none text-[15px] w-52 py-3 "
            />
          </div>

          <div className="relative ">
            <div
              className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] mt-2 py-[13px] border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
              onClick={() => setShowFilter(!showFilter)}
            >
              {/* <BsFilterLeft /> */}
              <MdTune className="w-4 h-4" />
              <span>Filter</span>
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
                <label
                  htmlFor="date"
                  className="block text-sm text-gray-700 mb-1 dark:text-white"
                >
                  Date
                </label>
                <input
                  type="date"
                  className="w-full mb-4 border border-gray-300 dark:bg-[#343434] dark:text-white rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Course */}
                <label
                  htmlFor="course"
                  className="block text-sm text-gray-700 mb-1 dark:text-white"
                >
                  Course
                </label>
                <input
                  type="text"
                  placeholder="Course name"
                  className="w-full mb-4 border border-gray-300 dark:bg-[#343434] dark:text-white rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Course Type */}
                <label
                  htmlFor="course type"
                  className="block text-sm text-gray-700 mb-1 dark:text-white"
                >
                  Course Type
                </label>
                <select className="w-full mb-4 border border-gray-300 dark:bg-[#343434] dark:text-white rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Online</option>
                  <option>Offline</option>
                </select>

                {/* Timing */}
                <label
                  htmlFor="timimg"
                  className="block text-sm text-gray-700 mb-1 dark:text-white"
                >
                  Timing
                </label>
                <input
                  type="time"
                  className="w-full mb-4 border border-gray-300 dark:bg-[#343434] dark:text-white rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Status */}
                <label
                  htmlFor="status"
                  className="block text-sm text-gray-700 mb-1 dark:text-white"
                >
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
            <span className="text-left -ml-60 ">
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
                      className="whitespace-nowrap text-left px-6 py-3 font-medium border  border-[#4C6993] "
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
                    <td className="px-6 py-2 text-[#3D8FDE] dark:text-[#3D8FDE] text-left">
                      {item.teacher.teacherName}
                    </td>
                    <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                      {item._id}
                    </td>
                    <td className="px-6 py-3 text-left">Quran</td>
                    <td className="px-6 py-3 text-left">MasterClass</td>
                    <td className="px-6 py-3 text-left">
                      {new Date(item.startDate).toDateString()}
                    </td>
                    <td className="px-6 py-3 text-left">
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
                          if (
                            isStartMeetingNow(
                              item.startDate,
                              item.startTime[0],
                              item.endTime[0]
                            )
                          ) {
                            content = (
                              <button
                                // onClick={() => handleLiveClassRedirect(item._id)}
                                className="text-[10px] font-semibold px-[11px] py-1 rounded-lg bg-[#576cbc] text-white border cursor-pointer hover:opacity-80"
                                onClick={() =>
                                  router.push(
                                    `/supervisor/ui/meetingvideocall?id=${item._id}`
                                  )
                                }>
                                Start Meeting
                              </button>
                            );
                          } else {
                            content = (
                              <span className="py-1 px-2 text-black rounded-lg bg-yellow-500 dark:text-[#ffff]">
                                Scheduled at{" "}
                                {formatTime(getEarliestTime(item.startTime))}
                              </span>
                            );
                          }
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

                    <td className="px-3 py-2 text-left">
                      <span className={`text-[10px] font-semibold px-3 py-1 rounded-lg ${getStatusClass(item.scheduleStatus)}`}>
                        {item.scheduleStatus}
                      </span>
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
