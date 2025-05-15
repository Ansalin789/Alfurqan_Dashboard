"use client";

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdArrowDropdownCircle, IoMdClose } from "react-icons/io";

import {
  FaCalendarAlt,
  FaEdit,
  FaFilter,
  FaPlus,
  FaUserCircle,
} from "react-icons/fa";
import BaseLayout4 from "@/components/BaseLayout4";
import { useRouter } from "next/navigation";
import axios from "axios";
import { User } from "lucide-react";

// Define interfaces for data structure
interface Teacher {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  _id: string;
}

interface Meeting {
  _id: string; // meetingId
  meetingName: string;
  selectedDate: string; // ISO date format
  meetingStatus: string;
  description: string;
  startTime: string;
  endTime: string;
  status: string;
  createdDate: string; // ISO date format
  createdBy: string;
  updatedDate: string; // ISO date format
  updatedBy: string;
  teachers: Teacher[]; // Array of arrays of teacher objects
}

interface MeetingsResponse {
  message: string;
  data: {
    totalCount: number;
    meetings: Meeting[];
  };
}

export interface User {
  _id: string;
  userName: string;
  email: string;
  password: string;
  role: string[];
  profileImage: string | null;
  status: string;
  createdBy: string;
  lastUpdatedBy: string;
  userId: string;
  lastLoginDate: string;
  createdDate: string;
  lastUpdatedDate: string;
  __v: number;
  gender: string;
}

export interface UsersResponse {
  users: User[];
  totalCount: number;
}

const Meeting = () => {
  const [meetingsData, setMeetingsData] = useState<MeetingsResponse | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date | null>(null);
  const router = useRouter();
  const [isAutoClose, setIsAutoClose] = useState(false);
  const [meetingName, setMeetingName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "Arabic Teacher" | "Quran Teacher"
  >("all");
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  // Toggle teacher selection
  const toggleSelections = (teacher: Teacher) => {
    setSelectedTeachers((prev) =>
      prev.some((t) => t.teacherId === teacher.teacherId)
        ? prev.filter((t) => t.teacherId !== teacher.teacherId)
        : [...prev, teacher]
    );
  };

  useEffect(() => {
    console.log(selectedTeachers);
    console.log(teachers);
  }, [teachers]);

  const [selectedTeachers, setSelectedTeachers] = useState<Teacher[]>([]);
  useEffect(() => {
   const token =
    typeof window !== "undefined" ? localStorage.getItem("AdminAuthToken") : null;

  if (!token) {
    console.error("❌ AdminAuthToken not found");
    return;
  }
    if (token) {
      ScheduleClass(token); // call your function with token
    } else {
      console.log("No auth token found.");
    }
  }, []);
  
  const ScheduleClass = async (token: string) => {
    try {
      const response = await axios.get<{ totalCount: number; users: User[] }>(
        "https://api.blackstoneinfomaticstech.com/otheremployees",
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
  
      console.log("API Response:", response.data); // ✅ Debugging step
  
      const userList = response.data.users;
  
      if (Array.isArray(userList)) {
        const mappedTeachers = userList.map((user) => ({
          teacherId: user._id,
          teacherName: user.userName,
          teacherEmail: user.email ?? "no-email@example.com",
          _id: user._id,
        }));
  
        setTeachers(mappedTeachers);
        console.log("Mapped Teachers:", mappedTeachers);
      } else {
        console.error("Unexpected API response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };
  

  // Ensure selectedDate is properly formatted
  const handleSubmit = async () => {
    // Convert selectedDate to string (ISO format) if it's not null
    const formattedDate = (selectedDates ?? new Date()).toISOString();

    const data = {
      selectedDate: formattedDate,
      meetingName,
      startTime,
      endTime,
      teacher: selectedTeachers,
      description,
      status: "Active",
      meetingStatus: "Scheduled",
      createdDate: new Date().toISOString(),
      createdBy: "Admin",
      updatedDate: new Date().toISOString(),
    };

    try {
      const token =
    typeof window !== "undefined" ? localStorage.getItem("AdminAuthToken") : null;

  if (!token) {
    console.error("❌ AdminAuthToken not found");
    return;
  }
      const response = await fetch("https://api.blackstoneinfomaticstech.com/addadminMeeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
                      "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Meeting scheduled successfully");
        setIsMeetingModalOpen(false);
      } else {
        alert("Failed to schedule the meeting");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while scheduling the meeting");
    }
  };

  useEffect(() => {
    async function fetchMeetings() {
      const token =
    typeof window !== "undefined" ? localStorage.getItem("AdminAuthToken") : null;

  if (!token) {
    console.error("❌ AdminAuthToken not found");
    return;
  }
      const response = await fetch("https://api.blackstoneinfomaticstech.com/allAdminMeeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
                      "Authorization": `Bearer ${token}`,
        },
      });
      const data: MeetingsResponse = await response.json();
      console.log(data);
      setMeetingsData(data);
    }
    fetchMeetings();
  }, []);

  useEffect(() => {
    if (isAutoClose) {
      const timer = setTimeout(() => {
        setIsMeetingModalOpen(false);
        setIsAutoClose(false);
      }, 3000); // 3 seconds

      return () => clearTimeout(timer); // cleanup
    }
  }, [isAutoClose]);

  const handleOptionsClick = (id: string) => {
    setSelectedItemId((prev) => (prev === id ? null : id));
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Optional: fetch new data here
    }
  };

 

  // Set the expected type for page number
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    console.log("nextPage");
    router.push("/admin-main/ui/meeting/schedule");
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleReason.trim() || !selectedItemId) return;

    try {
           const token =
    typeof window !== "undefined" ? localStorage.getItem("AdminAuthToken") : null;

  if (!token) {
    console.error("❌ AdminAuthToken not found");
    return;
  }

      const response = await fetch(
        `https://api.blackstoneinfomaticstech.com/allAdminMeeting/${selectedItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
                                  "Authorization": `Bearer ${token}`,

          },
          body: JSON.stringify({
            selectedDate: "2025-05-01T10:00:00.000Z", // Replace with dynamic value if needed
            startTime: "10:00", // Replace with dynamic input if needed
            endTime: "11:00", // Replace with dynamic input if needed
            meetingStatus: "rescheduled",
            updatedBy: "Admin",
          }),
        }
      );

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setIsRescheduleModalOpen(false);
          setRescheduleReason("");
          setSelectedItemId(null);
        }, 2000);
      } else {
        console.error("Failed to update meeting");
      }
    } catch (error) {
      console.error("Error updating meeting:", error);
    }
  };
  

  // Expect 'status' as a string
  const getMeetingStatusClass = (
    label: string,
    meetingStatus: string
  ): string => {
    const normalizedLabel = label.toLowerCase();
    const normalizedStatus = meetingStatus.toLowerCase();

    if (normalizedLabel === "start") {
      return "text-white bg-[#F66969]"; // ongoing
    }

    if (normalizedLabel.startsWith("today at")) {
      return "text-white bg-[#012A4A]"; // upcoming today
    }

    if (
      normalizedStatus === "rescheduled" ||
      normalizedStatus === "reschedule"
    ) {
      return "text-black bg-[#79D67B]"; // green
    }

    if (normalizedLabel === "completed" || normalizedStatus === "completed") {
      return "text-black bg-[#79D67B]"; // green
    }

    if (normalizedStatus === "scheduled") {
      return "text-white bg-gray-500"; // scheduled but not today
    }

    return "text-white bg-gray-400"; // fallback/default
  };

// 1. First, declare helper functions
const parseDateTime = (date: string | Date, time?: string): Date => {
  let parsed: Date;

  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split("-").map(Number);
    parsed = new Date(year, month - 1, day);
  } else {
    parsed = new Date(date);
  }

  if (typeof time === "string" && /^\d{2}:\d{2}$/.test(time)) {
    const [hours, minutes] = time.split(":").map(Number);
    parsed.setHours(hours, minutes, 0, 0);
  } else {
    parsed.setHours(0, 0, 0, 0);
  }

  return parsed;
};

const getMeetingStatusLabel = (
  status: string,
  selectedDate: string | Date,
  startTime?: string,
  endTime?: string
): string => {
  const now = new Date();
  const start = parseDateTime(selectedDate, startTime);
  let end: Date | null = null;

  if (endTime) {
    end = parseDateTime(selectedDate, endTime);
    if (end < start) {
      end.setDate(end.getDate() + 1); // Overnight
    }
  }

  const isToday =
    start.getFullYear() === now.getFullYear() &&
    start.getMonth() === now.getMonth() &&
    start.getDate() === now.getDate();

  if (end && now >= start && now <= end) {
    return "Start";
  }

  if (end && now > end) {
    return "Completed";
  }

  if (isToday && now < start) {
    return "Today at " + start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const normalizedStatus = status.toLowerCase();
  if (normalizedStatus === "reschedule" || normalizedStatus === "rescheduled") {
    return "Rescheduled";
  }

  if (normalizedStatus === "completed") {
    return "Completed";
  }

  return "Scheduled";
};

// 2. Then access and filter the data
const allMeetings = meetingsData?.data?.meetings || [];

const upcomingClasses = allMeetings.filter((item) => {
  const label = getMeetingStatusLabel(
    item.meetingStatus,
    item.selectedDate,
    item.startTime,
    item.endTime
  );
  return label !== "Completed";
});

const completedData = allMeetings.filter((item) => {
  const label = getMeetingStatusLabel(
    item.meetingStatus,
    item.selectedDate,
    item.startTime,
    item.endTime
  );
  return label === "Completed";
});

const dataToShow = activeTab === "upcoming" ? upcomingClasses : completedData;

const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = dataToShow.slice(indexOfFirstItem, indexOfLastItem);

const totalPages = Math.ceil(dataToShow.length / itemsPerPage);

  


  return (
    <BaseLayout4>
      <div className=" p-8 w-full  mx-auto h-full">
        <div
          className={`transition-all duration-200 ${
            isRescheduleModalOpen ? "blur-sm" : ""
          }`}
        >
          {/* Consistent Padding Wrapper */}
          <div className="px-1">
            {/* Heading */}
            <h1 className="text-xl font-semibold text-gray-800 py-2">
              Scheduled Meetings
            </h1>
          </div>

          <div className="flex items-center justify-between py-4 rounded-md">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search here..."
                className="px-4 py-2 text-sm rounded-md border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-[#1C3557] w-64"
              />
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#1C3557] border border-gray-300 rounded-md shadow hover:bg-gray-50 text-sm">
                <FaFilter /> Filter
              </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <button onClick={() => nextPage()}>
                <FaCalendarAlt className="text-[#1C3557]" />
              </button>
              <button
                onClick={() => setIsMeetingModalOpen(true)}
                className="flex items-center gap-2 bg-[#1C3557] text-white px-4 py-2 rounded-xl shadow hover:bg-[#15294a] text-sm"
              >
                <FaPlus /> Add Meeting
              </button>

              {/* Date Picker */}
              <div className="relative">
                <button
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow text-sm hover:bg-gray-50"
                >
                  <span>
                    {selectedDates
                      ? selectedDates.toLocaleDateString()
                      : "Date"}
                  </span>
                  <IoMdArrowDropdownCircle className="text-[#1C3557]" />
                </button>
                {isDatePickerOpen && (
                  <div className="absolute right-0 z-10 mt-2">
                    <DatePicker
                      onChange={(date) => setSelectedDates(date)}
                      inline
                      className="border rounded-lg shadow-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-[#1C3557] h-full overflow-y-scroll scrollbar-none flex flex-col justify-between">
            {/* Tabs */}
            <div>
              <div className="flex gap-4 p-4 border-b">
                <button
                  className={`px-4 py-1 rounded-xl text-sm ${
                    activeTab === "upcoming"
                      ? "bg-[#1C3557] text-white"
                      : "bg-transparent text-black"
                  }`}
                  onClick={() => {
                    setActiveTab("upcoming");
                    setCurrentPage(1);
                  }}
                >
                  Scheduled
                </button>
                <button
                  className={`px-4 py-1 rounded-xl text-sm ${
                    activeTab === "Completed"
                      ? "bg-[#1C3557] text-white"
                      : "bg-transparent text-black"
                  }`}
                  onClick={() => {
                    setActiveTab("Completed");
                    setCurrentPage(1);
                  }}
                >
                  Completed
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full table-auto bg-[#fff] rounded-lg shadow text-[11px] h-full">
                  <thead className="border-b-[1px] border-[#1C3557] text-[12px] font-semibold">
                    <tr>
                      {[
                        "MeetingId",
                        "MeetingName",
                        "Attendees",
                        "Date",
                        "ScheduleTime",
                        "Action",
                      ].map((header) => (
                        <th key={header} className="px-1 py-3 text-center">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((meeting, index) => (
                      <tr
                        key={meeting._id}
                        className={`text-[12px] font-medium ${
                          index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                        }`}
                      >
                        <td className="px-2 py-2 text-center text-xs">
                          {meeting._id}
                        </td>{" "}
                        {/* Meeting ID */}
                        <td className="px-2 py-2 text-center text-xs">
                          {meeting.meetingName}
                        </td>
                        <td className="px-2 py-2 text-center text-xs ">
                          <select className="p-2 ">
                            <option disabled selected>
                              View List
                            </option>
                            {meeting.teachers.flat().map(
                              (
                                teacher // Flatten the array of teachers
                              ) => (
                                <option
                                  key={teacher._id}
                                  value={teacher.teacherId}
                                >
                                  {teacher.teacherName}
                                </option>
                              )
                            )}
                          </select>
                        </td>
                        <td className="px-2 py-2 text-center text-xs">
                          {new Date(meeting.selectedDate).toLocaleDateString()}
                        </td>
                        <td className="px-2 py-[6px] text-center text-[8px] whitespace-nowrap">
                          {activeTab === "upcoming" ? (
                            (() => {
                              const label = getMeetingStatusLabel(
                                meeting.meetingStatus,
                                meeting.selectedDate,
                                meeting.startTime,
                                meeting.endTime
                              );
                              const className = getMeetingStatusClass(
                                label,
                                meeting.meetingStatus
                              );
                              const isStarted = label.toLowerCase() === "start";

                              return isStarted ? (
                                <button
                                  onClick={() =>
                                    router.push(
                                      `/admin-main/ui/meeting/liveclass/`
                                    )
                                  }
                                  className={`text-[10px] px-2 py-[7px] rounded-xl text-white inline-block text-center w-[130px] cursor-pointer ${className}`}
                                >
                                  {label}
                                </button>
                              ) : (
                                <span
                                  className={`text-[10px] px-2 py-[7px] rounded-xl inline-block text-center w-[130px] ${className}`}
                                >
                                  {label}
                                </span>
                              );
                            })()
                          ) : (
                            <button className="bg-[#79D67B] text-[10px] px-2 py-[7px] rounded-xl inline-block text-center w-[150px]">
                              Completed
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            className="bg-gray-800 hover:cursor-pointer text-center text-white p-[5px] rounded-sm pl-[7px] shadow hover:bg-gray-900"
                            onClick={() => {
                              if (activeTab === "upcoming") {
                                handleOptionsClick(meeting._id);
                              } else {
                                setIsDetailsModalOpen(true);
                              }
                            }}
                          >
                            <FaEdit size={8} />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {activeTab === "upcoming" && (
                            <>
                              {/* <button 
                              className="text-xl"
                              onClick={() => handleOptionsClick(item.id)}
                            >
                              .
                            </button> */}
                              {selectedItemId === meeting._id && (
                                <div className="absolute bg-white shadow-lg rounded-lg -mt-4 -ml-14">
                                  <div className="py-2 px-2">
                                    <button
                                      className="block text-left px-3 py-1 text-[12px] font-medium text-[#223857] hover:bg-gray-100"
                                      onClick={() => {
                                        setIsRescheduleModalOpen(true);
                                        setSelectedItemId(meeting._id); // ← this sets the ID for API call
                                      }}
                                    >
                                      Request
                                    </button>
                                    <button
                                      className="block text-left px-3 py-1 text-[12px] font-medium text-[#223857] hover:bg-gray-100"
                                      onClick={() => {
                                        setSelectedItemId(null);
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center p-4">
                <p className="text-[10px] text-gray-600">
                  Showing {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, dataToShow.length)} from{" "}
                  {dataToShow.length} data
                </p>
                <div className="flex space-x-2 text-[10px]">
                  <button
                    className={`px-2 py-1 rounded ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      className={`px-2 py-1 rounded ${
                        currentPage === index + 1
                          ? "bg-[#1B2B65] text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    className={`px-2 py-1 rounded ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Meeting Modal */}

        {isMeetingModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center ">
            <div className="bg-white rounded-xl shadow-lg px-6 py-8 w-[460px]">
              <h2 className="text-[14px] font-bold text-[#1C3557] mb-6">
                Add Meeting
              </h2>

              {/* Meeting Name */}
              <div className="mb-2">
                <label
                  htmlFor="meetingTitle"
                  className="text-xs font-medium text-gray-700"
                >
                  Meeting Title
                </label>
                <input
                  type="text"
                  placeholder="Weekly Meeting"
                  value={meetingName}
                  onChange={(e) => setMeetingName(e.target.value)}
                  className="w-full bg-[#f4f4f4] border border-gray-300 rounded-xl p-2 text-xs"
                />
              </div>

              {/* Scheduled Date */}
              <div className="mb-2">
                <label
                  htmlFor="scheduleDate"
                  className="text-xs font-medium text-gray-700"
                >
                  Scheduled Date
                </label>
                <input
                  type="date"
                  className="w-full bg-[#f4f4f4] border border-gray-300 rounded-xl p-2 text-xs"
                  value={
                    selectedDates
                      ? selectedDates.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => setSelectedDates(new Date(e.target.value))}
                />
              </div>

              {/* Scheduled Time */}
              <div className="mb-2">
                <label
                  htmlFor="scheduleTime"
                  className="text-xs font-medium text-gray-700"
                >
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-[#f4f4f4] border border-gray-300 rounded-xl p-2 text-xs"
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="scheduleTime"
                  className="text-xs font-medium text-gray-700"
                >
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-[#f4f4f4] border border-gray-300 rounded-xl p-2 text-xs"
                />
              </div>

              {/* Attendees Dropdown */}
              <div className="mb-2 relative">
                <button
                  className="flex items-center border text-[12px] rounded-xl p-2 cursor-pointer mt-4 pl-2"
                  onClick={() => setIsTeacherModalOpen(true)}
                >
                  <User className="w-6 h-4 text-gray-600" /> Add Teacher
                </button>

                {/* Teacher Modal */}
                {isTeacherModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-4 w-[300px] relative">
                      {/* Close Button */}
                      <button
                        onClick={() => setIsTeacherModalOpen(false)}
                        className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
                      >
                        <IoMdClose size={20} />
                      </button>

                      {/* Filter Buttons */}
                      <div className="flex space-x-4 mb-4">
                        <button
                          className={`px-4 py-1 rounded-lg ${
                            selectedFilter === "Quran Teacher"
                              ? "bg-gray-500 text-white"
                              : "border"
                          }`}
                          onClick={() => setSelectedFilter("Quran Teacher")}
                        >
                          Quran
                        </button>
                        <button
                          className={`px-4 py-1 rounded-lg ${
                            selectedFilter === "Arabic Teacher"
                              ? "bg-gray-500 text-white"
                              : "border"
                          }`}
                          onClick={() => setSelectedFilter("Arabic Teacher")}
                        >
                          Arabic
                        </button>
                        <button
                          className={`px-4 py-1 rounded-lg ${
                            selectedFilter === "all"
                              ? "bg-gray-500 text-white"
                              : "border"
                          }`}
                          onClick={() => setSelectedFilter("all")}
                        >
                          All
                        </button>
                      </div>

                      {/* Teacher List */}
                      <div className="border p-2 rounded-md max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                        {teachers.map((teacher, index) => (
                          <div
                            key={`${teacher._id}`}
                            className="flex items-center justify-between p-2 border-b last:border-none"
                          >
                            <div className="flex items-center space-x-2">
                              <FaUserCircle
                                className="text-[#1C3557]"
                                size={20}
                              />
                              <span className="text-gray-700 text-sm">
                                {teacher.teacherName}
                              </span>
                            </div>
                            <input
                              type="checkbox"
                              className="h-5 w-5 text-[#1C3557] border-gray-300 rounded focus:ring-[#1C3557]"
                              checked={selectedTeachers.some(
                                (t) => t._id === teacher.teacherId
                              )}
                              onChange={() => toggleSelections(teacher)}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Done Button */}
                      <button
                        onClick={() => setIsTeacherModalOpen(false)}
                        className="w-full mt-4 bg-[#1C3557] text-white py-2 rounded-lg hover:bg-[#15294a]"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}

                {/* Selected Teachers */}
                <div className="flex mt-2 space-x-2">
                  {selectedTeachers.map((teacher) => (
                    <span
                      key={teacher._id}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm"
                    >
                      {teacher.teacherName}
                    </span>
                  ))}
                  {/* <button className="text-[#1C3557] border border-[#1C3557] rounded-full p-1">
                 <FaPlus size={12} />
               </button> */}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  placeholder=""
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#f4f4f4] border border-gray-300 rounded-xl p-3 mt-1 text-sm h-24 resize-none"
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setIsMeetingModalOpen(false)}
                  className="w-[38%] border border-[#1C3557] text-[#1C3557] py-2 rounded-xl hover:bg-gray-100 text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="w-[38%] bg-[#1C3557] text-white py-2 rounded-xl hover:bg-[#15294a] flex items-center justify-center text-xs"
                >
                  <i className="fas fa-save mr-2" /> Schedule
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reschedule Modal */}
        {isRescheduleModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <div className="bg-gray-100 rounded-3xl p-6 w-96 relative z-50">
              <h2 className="text-xl mb-4 text-gray-700">
                Reason for Re-Schedule
              </h2>
              {showSuccess ? (
                <div className="bg-[#108422] text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2 mb-4 mx-auto max-w-[280px]">
                  <img src="/assets/images/success.png" alt="" />
                  <span>Request Has Been Sent to Admin</span>
                </div>
              ) : (
                <>
                  <textarea
                    className="w-full p-4 border rounded-2xl mb-4 h-32 resize-none bg-white"
                    placeholder="Type here..."
                    value={rescheduleReason}
                    onChange={(e) => setRescheduleReason(e.target.value)}
                  />
                  <button
                    onClick={handleRescheduleSubmit}
                    className="w-32 bg-[#1B2B65] text-white py-2 rounded-full hover:bg-[#0f1839] mx-auto block"
                  >
                    Submit
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/*DetailsOpen */}

        {isDetailsModalOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center ">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 overflow-y-auto max-h-[90vh] scrollbar-none">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  Meeting Details
                </h2>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              {/* Input Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor=" meetingID"
                    className="text-[12px] text-gray-700 font-semibold"
                  >
                    Meeting ID
                  </label>
                  <input
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 text-xs"
                    value="Weekly Meeting"
                    disabled
                  />
                </div>
                <div>
                  <label
                    htmlFor=" meetingTitle"
                    className="text-[12px] text-gray-700 font-semibold"
                  >
                    Meeting Title
                  </label>
                  <input
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 text-xs"
                    value=""
                    disabled
                  />
                </div>
                <div>
                  <label
                    htmlFor=" Scheduled Date "
                    className="text-[12px] text-gray-700 font-semibold"
                  >
                    Scheduled Date
                  </label>
                  <input
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 text-xs"
                    value="Weekly Meeting"
                    disabled
                  />
                </div>
                <div>
                  <label
                    htmlFor=" meetingDuration"
                    className="text-[12px] text-gray-700 font-semibold"
                  >
                    Meeting Duration
                  </label>
                  <input
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 text-xs"
                    value=""
                    disabled
                  />
                </div>
                <div>
                  <label
                    htmlFor=" Scheduled Time From"
                    className="text-[12px] text-gray-700 font-semibold"
                  >
                    Scheduled Time From
                  </label>
                  <input
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 text-xs"
                    value="07:30 PM"
                    disabled
                  />
                </div>
                <div>
                  <label
                    htmlFor=" Scheduled Time To"
                    className="text-[12px] text-gray-700 font-semibold"
                  >
                    Scheduled Time To
                  </label>
                  <input
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 text-xs"
                    value="08:30 PM"
                    disabled
                  />
                </div>
              </div>

              {/* Attendance Table */}
              <div className="border rounded-md overflow-hidden mb-6 ">
                <table className="w-full text-left">
                  <thead className="bg-slate-800 text-white text-[12px]">
                    <tr>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-xs">
                    {[
                      { name: "Lucas Johnson", isPresent: true },
                      { name: "Emily Peterson", isPresent: true },
                      { name: "Hannah White", isPresent: true },
                      { name: "Oliver Martinez", isPresent: false },
                    ].map((person, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2 flex items-center gap-2">
                          <div className="bg-slate-100 p-2 rounded-full">
                            <svg
                              className="w-5 h-5 text-slate-600"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          </div>
                          {person.name}
                        </td>
                        <td className="px-4 py-2">
                          {person.isPresent ? (
                            <span className="w-5 h-5 inline-block rounded-full bg-green-500 text-white text-xs text-center leading-5">
                              ✔
                            </span>
                          ) : (
                            <span className="w-5 h-5 inline-block rounded-full bg-red-500 text-white text-xs text-center leading-5">
                              ✖
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Meeting Minutes */}
              <div className="mb-6">
                <label
                  htmlFor=" meetingMinutes"
                  className="text-xs font-semibold mb-1 block"
                >
                  Meeting Minutes
                </label>
                <div className="bg-gray-100 border p-6 rounded-lg text-xs text-gray-700 ">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </div>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center">
                {/* Prev Button */}
                <button
                  className="px-4 py-2 text-xs bg-gray-100 border rounded hover:bg-gray-200 disabled:opacity-50"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {/* Page Buttons */}
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 || // Always show first
                        page === totalPages || // Always show last
                        Math.abs(page - currentPage) <= 1 // Show near current
                    )
                    .reduce((acc: (number | "...")[], page, i, arr) => {
                      if (i > 0 && page - (arr[i - 1] as number) > 1) {
                        acc.push("...");
                      }
                      acc.push(page);
                      return acc;
                    }, [])
                    .map((page) =>
                      typeof page === "number" ? (
                        <button
                          key={`page-${page}`}
                          className={`w-5 h-5 rounded border text-xs ${
                            currentPage === page
                              ? "bg-slate-800 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                          onClick={() => goToPage(page)}
                        >
                          {page}
                        </button>
                      ) : (
                        <span
                          key={`ellipsis-${Math.random()
                            .toString(36)
                            .substr(2, 5)}`}
                          className="px-2 text-sm"
                        >
                          ...
                        </span>
                      )
                    )}
                </div>

                {/* Next Button */}
                <button
                  className="px-4 py-2 text-xs bg-gray-100 border rounded hover:bg-gray-200 disabled:opacity-50"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseLayout4>
  );
};

export default Meeting;
