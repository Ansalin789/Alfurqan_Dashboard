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
import { Search, User } from "lucide-react";
import { button } from "@nextui-org/react";
import AdminHeader from "../../components/AdminHeader";
import Pagination from "@/components/Pagination";

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
  const [dashboardRead, setdashboardRead] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "Arabic Teacher" | "Quran Teacher"
  >("all");
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    meetingName: "",
    attendeeName: "",
    status: "",
    fromDate: "",
    toDate: "",
  });
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [meetingMinutes, setMeetingMinutes] = useState<string>("");

  const getDuration = (startTime?: string, endTime?: string): string => {
    if (!startTime || !endTime) return "-";

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    let start = new Date();
    let end = new Date();

    start.setHours(startHour, startMinute, 0);
    end.setHours(endHour, endMinute, 0);

    // Handle overnight sessions
    if (end < start) end.setDate(end.getDate() + 1);

    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / 1000 / 60 / 60);
    const minutes = Math.floor((durationMs / 1000 / 60) % 60);

    return `${hours}h ${minutes}m`;
  };

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
      typeof window !== "undefined"
        ? localStorage.getItem("AdminAuthToken")
        : null;

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
            Authorization: `Bearer ${token}`,
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
        typeof window !== "undefined"
          ? localStorage.getItem("AdminAuthToken")
          : null;

      if (!token) {
        console.error("❌ AdminAuthToken not found");
        return;
      }
      const response = await fetch(
        "https://api.blackstoneinfomaticstech.com/addadminMeeting",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

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
    const roleAccessRaw = localStorage.getItem("AdminRolePermission");

    if (roleAccessRaw) {
      try {
        const roleAccess = JSON.parse(roleAccessRaw);
        const hasRead = roleAccess?.meetings?.read ?? false;
        console.log(hasRead);
        setdashboardRead(hasRead);
      } catch (error) {
        console.error("Invalid JSON in AdminRolePermission:", error);
      }
    }
    async function fetchMeetings() {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("AdminAuthToken")
          : null;

      if (!token) {
        console.error("❌ AdminAuthToken not found");
        return;
      }
      const response = await fetch(
        "https://api.blackstoneinfomaticstech.com/allAdminMeeting",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data: MeetingsResponse = await response.json();
      console.log("all meeting ", data);
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
        typeof window !== "undefined"
          ? localStorage.getItem("AdminAuthToken")
          : null;

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
            Authorization: `Bearer ${token}`,
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
      return "text-black bg-[#ECFDF3]"; // green
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
      return (
        "Today at " +
        start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }

    const normalizedStatus = status.toLowerCase();
    if (
      normalizedStatus === "reschedule" ||
      normalizedStatus === "rescheduled"
    ) {
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
  // Get unique meeting names
  const meetingNames = Array.from(
    new Set(allMeetings.map((m) => m.meetingName))
  );

  // Get unique attendee (teacher) names
  const attendeeNames = Array.from(
    new Set(
      allMeetings.flatMap((m) =>
        m.teachers?.map((t) => t.teacherName).filter(Boolean)
      )
    )
  );

  const completedData = allMeetings.filter((item) => {
    const label = getMeetingStatusLabel(
      item.meetingStatus,
      item.selectedDate,
      item.startTime,
      item.endTime
    );
    return label === "Completed";
  });
  const baseData = activeTab === "upcoming" ? upcomingClasses : completedData;

  const dataToShow = filteredMeetings;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataToShow.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(dataToShow.length / itemsPerPage);

  const handleApplyFilters = () => {
    const lowerQuery = searchQuery.toLowerCase();
    const from = filters.fromDate ? new Date(filters.fromDate) : null;
    const to = filters.toDate ? new Date(filters.toDate) : null;

    const filtered = baseData.filter((item) => {
      const meetingDate = new Date(item.selectedDate);

      const attendeeMatch = item.teachers.some((t) =>
        (t.teacherName?.toLowerCase() || "").includes(
          filters.attendeeName.toLowerCase()
        )
      );

      const searchMatch =
        item.meetingName.toLowerCase().includes(lowerQuery) ||
        item.teachers.some((t) =>
          t.teacherName.toLowerCase().includes(lowerQuery)
        );

      return (
        (!filters.meetingName ||
          item.meetingName
            .toLowerCase()
            .includes(filters.meetingName.toLowerCase())) &&
        (!filters.attendeeName || attendeeMatch) &&
        (!filters.status ||
          item.meetingStatus
            .toLowerCase()
            .includes(filters.status.toLowerCase())) &&
        (!from || meetingDate >= from) &&
        (!to || meetingDate <= to) &&
        (!searchQuery || searchMatch)
      );
    });

    setFilteredMeetings(filtered);
    setCurrentPage(1);
    setIsFilterModalOpen(false);
  };

  useEffect(() => {
    setFilteredMeetings(baseData);
  }, [activeTab, meetingsData]);
useEffect(() => {
  console.log("Teachers Loaded:", teachers);
}, [teachers]);

  return (
    <BaseLayout4>
      <AdminHeader currentSection={"Meeting"}></AdminHeader> {/* Right Side */}
      <div className="flex items-center gap-4">
        <button onClick={() => nextPage()} disabled={!dashboardRead}>
          <FaCalendarAlt className="text-[#1C3557]" />
        </button>
        <button
          onClick={() => setIsMeetingModalOpen(true)}
          className="flex items-center gap-2 bg-[#1C3557] text-white px-4 py-2 rounded-xl shadow hover:bg-[#15294a] text-sm"
          disabled={!dashboardRead}
        >
          <FaPlus /> Add Meeting
        </button>
      </div>
      <div className="md:p-0 mt-4 mx-auto">
        <div className="h-full w-full flex flex-col justify-between">
          <div className="p-0 justify-between flex flex-col">
            <div className="flex space-x-6 px-4 py-2 rounded-md">
              <button
                className={`relative text-[14px] transition font-medium ${
                  activeTab === "upcoming"
                    ? "text-[#576CBC] font-semibold"
                    : "text-[#0A0A12] dark:text-[#fff] opacity-80"
                }`}
                onClick={() => {
                  setActiveTab("upcoming");
                  setCurrentPage(1);
                }}
              >
                Scheduled ({upcomingClasses.length})
              </button>
              <button
                className={`relative text-[14px] transition font-medium ${
                  activeTab === "Completed"
                    ? "text-[#576CBC] font-semibold"
                    : "text-[#0A0A12] dark:text-[#fff] opacity-80"
                }`}
                onClick={() => {
                  setActiveTab("Completed");
                  setCurrentPage(1);
                }}
              >
                Completed ({completedData.length})
              </button>
            </div>

            <div className="mt-2">
              <div className="w-full h-11 bg-[#FAFAFB] dark:bg-[#343434] rounded-t-lg flex justify-between items-center px-4 py-0">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by Meeting Name or Attendee"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="..."
                  />
                </div>
                <div
                  className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer"
                  onClick={() => setIsFilterModalOpen(true)}
                >
                  <FaFilter size={16} />
                  <span>Filter</span>
                </div>
                <div className="text-sm text-gray-500">
                  Showing {currentItems.length} of {dataToShow.length}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto scrollbar-none">
              <table
                className="w-full table-auto border-collapse text-[13px]"
                style={{ tableLayout: "fixed" }}
              >
                <thead className="text-[12px] bg-[#4C6993] text-white">
                  <tr>
                    <th className="text-left px-4 py-3 w-[190px]">
                      Meeting ID
                    </th>
                    <th className="text-left px-4 py-3 w-[150px]">
                      Meeting Name
                    </th>
                    <th className="text-left px-4 py-3 w-[150px]">Attendees</th>
                    <th className="text-left px-4 py-3  w-[150px]">Date</th>
                    <th className="text-left px-4 py-3 w-[150px]">Time</th>
                    <th className="text-left px-4 py-3 w-[150px]">Status</th>
                    <th className="text-left px-4 py-3 w-[150px]">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems.map((meeting, index) => {
                    const label = getMeetingStatusLabel(
                      meeting.meetingStatus,
                      meeting.selectedDate,
                      meeting.startTime,
                      meeting.endTime
                    );
                    const statusClass = getMeetingStatusClass(
                      label,
                      meeting.meetingStatus
                    );
                    const isStarted = label.toLowerCase() === "start";

                    return (
                      <tr
                        key={meeting._id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-3 py-3 text-[11px] text-left break-words whitespace-normal">
                          {meeting._id}
                        </td>
                        <td className="px-3 py-3 text-[11px] text-left break-words whitespace-normal">
                          {meeting.meetingName}
                        </td>
                        <td className="px-3 py-3 text-[11px] text-left break-words whitespace-normal">
                          <select className=" bg-transparent">
                            <option disabled selected>
                              View List
                            </option>
                            {meeting.teachers.flat().map((t) => (
                              <option key={t._id}>{t.teacherName}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-3 text-[11px] text-left break-words whitespace-normal">
                          {new Date(meeting.selectedDate).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-3 text-[11px] text-left break-words whitespace-normal">
                          {meeting.startTime || "-"}
                        </td>
                        <td className="text-[#010E30E5] dark:text-[#FDFDFD] text-[11px] w-[180px] break-words whitespace-normal">
                          {isStarted ? (
                            <button
                              onClick={() =>
                                router.push(`/admin-main/ui/meeting/liveclass/`)
                              }
                              className={`px-3 py-3 text-[11px] text-left break-words  whitespace-normal ${statusClass}`}
                            >
                              {label}
                            </button>
                          ) : (
                            <span
                              className={` font-semibold text-[11px] text-center  rounded-md bg-[#ECFDF3] text-[#377E36] dark:bg-[#377E3633] px-3 py-2 ${statusClass}`}
                            >
                              {label}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <button
                            className="bg-gray-800 hover:bg-gray-900 text-white p-[5px] rounded-sm shadow"
                            onClick={() => {
                              setSelectedMeeting(meeting); // ✅ set selected meeting for details modal
                              setMeetingMinutes(meeting.description || ""); // optional: prefill minutes
                              setIsDetailsModalOpen(true);
                            }}
                          >
                            <FaEdit size={10} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
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
                  selectedDates ? selectedDates.toISOString().split("T")[0] : ""
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
                            checked={selectedTeachers.some((t) => t.teacherId === teacher.teacherId)}

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
      {isDetailsModalOpen && selectedMeeting && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white w-[600px] rounded-2xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <h2 className="text-lg font-semibold text-[#1C3557] mb-4">
              Meeting Details
            </h2>

            {/* Top Form Section */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-[13px] text-gray-700 mb-6">
              <div>
                <label className="block text-xs font-medium mb-1">
                  Meeting ID
                </label>
                <input
                  type="text"
                  disabled
                  value={`#${selectedMeeting._id}`}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Meeting Title
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedMeeting.meetingName}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Scheduled Date
                </label>
                <input
                  type="text"
                  disabled
                  value={new Date(
                    selectedMeeting.selectedDate
                  ).toLocaleDateString()}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Meeting Duration
                </label>
                <input
                  type="text"
                  disabled
                  value={(() => {
                    const start = new Date(
                      `1970-01-01T${selectedMeeting.startTime}`
                    );
                    const end = new Date(
                      `1970-01-01T${selectedMeeting.endTime}`
                    );
                    const diff = (end.getTime() - start.getTime()) / 60000;
                    const hrs = Math.floor(diff / 60);
                    const mins = diff % 60;
                    return `${hrs}h ${mins}m`;
                  })()}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Scheduled Time- From
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedMeeting.startTime}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">
                  Scheduled Time- To
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedMeeting.endTime}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
            </div>

            {/* Attendance Table */}
            <div className="mt-4 mb-6 border rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-[#4C6993] text-white text-xs">
                  <tr>
                    <th className="px-4 py-2 font-medium">Name</th>
                    <th className="px-4 py-2 font-medium">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedMeeting.teachers.flat().map((teacher, index) => (
                    <tr
                      key={teacher._id || index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-2 text-[#3065B5] hover:underline cursor-pointer">
                        {teacher.teacherName}
                      </td>
                      <td className="px-4 py-2">
                        <span className="inline-block w-5 h-5 text-white text-xs leading-5 text-center rounded-full bg-green-500">
                          ✔
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Meeting Minutes */}
            <div className="mb-6">
              <label
                htmlFor="meetingMinutes"
                className="text-xs font-semibold mb-1 block"
              >
                Meeting Minutes
              </label>
              <textarea
                id="meetingMinutes"
                value={meetingMinutes}
                onChange={(e) => setMeetingMinutes(e.target.value)}
                placeholder="Write your comment here..."
                className="w-full bg-white border border-gray-300 rounded-lg p-3 text-xs text-gray-700 h-28 resize-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-6 py-2 rounded-md border border-[#576CBC] text-[#576CBC] text-xs"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const token = localStorage.getItem("AdminAuthToken");
                  if (!token || !selectedMeeting) return;

                  await fetch(
                    `https://api.blackstoneinfomaticstech.com/allAdminMeeting/${selectedMeeting._id}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        description: meetingMinutes,
                        updatedBy: "Admin",
                      }),
                    }
                  );

                  alert("Meeting Minutes saved.");
                  setIsDetailsModalOpen(false);
                }}
                className="px-6 py-2 rounded-md bg-[#576CBC] text-white text-xs"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[600px]">
            <h2 className="text-lg font-semibold mb-4">Filter Meetings</h2>
            <div className="grid grid-cols-2 gap-4">
              <select
                value={filters.meetingName}
                onChange={(e) =>
                  setFilters({ ...filters, meetingName: e.target.value })
                }
                className="p-2 border rounded text-sm"
              >
                <option value="">Select Meeting</option>
                {meetingNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>

              <select
                value={filters.attendeeName}
                onChange={(e) =>
                  setFilters({ ...filters, attendeeName: e.target.value })
                }
                className="p-2 border rounded text-sm"
              >
                <option value="">Select Attendee</option>
                {attendeeNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>

              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="p-2 border rounded"
              >
                <option value="">Select Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Rescheduled">Rescheduled</option>
                <option value="Completed">Completed</option>
              </select>
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) =>
                  setFilters({ ...filters, fromDate: e.target.value })
                }
                className="p-2 border rounded"
              />
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) =>
                  setFilters({ ...filters, toDate: e.target.value })
                }
                className="p-2 border rounded"
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setFilters({
                    meetingName: "",
                    attendeeName: "",
                    status: "",
                    fromDate: "",
                    toDate: "",
                  });
                  setSearchQuery(""); // optional: reset search too
                  setIsFilterModalOpen(false);
                }}
                className="px-4 py-2 border border-[#576CBC] text-[#576CBC] rounded"
              >
                Reset
              </button>
              <button
                onClick={handleApplyFilters} // ✅ Apply the filters
                className="px-4 py-2 bg-[#576CBC] text-white rounded"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </BaseLayout4>
  );
};

export default Meeting;
