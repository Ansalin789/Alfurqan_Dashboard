"use client";

import React, { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdClose } from "react-icons/io";
import { useRouter } from "next/navigation";
import { FaEye, FaUserCircle } from "react-icons/fa";
import { CheckCircle, MoreVertical, Search, User, XCircle } from "lucide-react";
import BaseLayout3 from "@/components/BaseLayout3";
import axios from "axios";
import SupervisorHeader from "../../components/supervisorHeader";
import Pagination from "@/components/Pagination";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { IoPersonOutline } from "react-icons/io5";
import { MdTune } from "react-icons/md";
import SuccessPopup from "../../components/successPopup";
import FailedPopup from "../../components/failedPopup";
import { setTime } from "react-datepicker/dist/date_utils";
import { getSocket } from "@/app/utils/socket";

interface ApiResponse {
  candidateFirstName: string;
  candidateLastName: string;
  positionApplied: string;
  _id: string;
  candidateEmail: string;
}

interface Teacher {
  teacherId: string;
  teacherName: string;
  participantName: string;
  participantEmail: string;
  teacherEmail: string;
  attendee?: string;
}

interface BaseMeeting {
  _id: string;
  meetingName: string;
  meetingId: string;
  selectedDate: string;
  startTime: string;
  endTime: string;
  description?: string;
  meetingminutes?: string;
  meetingStatus: "Completed" | "Scheduled" | "Pending" | string;
  duration?: string;
  status: "Active" | "Inactive" | string;
  createdDate: string;
  createdBy: string;
  updatedDate?: string;
  updatedBy?: string;
  __v?: number;
  supervisor?: {
    supervisorId: string;
    supervisorName: string;
    supervisorEmail: string;
  };
  admin?: {
    adminId: string;
    adminName: string;
    adminEmail: string;
    adminRole: string;
  };
}

interface Meeting extends BaseMeeting {
  participants: any;
  type: "regular";
  teacher: Teacher[];
}

interface GroupedMeeting extends BaseMeeting {
  type: "grouped";
  participants: Teacher[];
}

type AnyMeeting = Meeting | GroupedMeeting;

const ScheduledClasses = () => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [failedMessage, setFailedMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [completedData, setCompletedData] = useState<Meeting[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<Meeting[]>([]);
  const [groupedMeetings, setGroupedMeetings] = useState<GroupedMeeting[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [openTeacherDropdownId, setOpenTeacherDropdownId] = useState<
    string | null
  >(null);
  const [selectedMeetingDetails, setSelectedMeetingDetails] =
    useState<Meeting | null>(null);
  const [isMeetingDetailsModalOpen, setIsMeetingDetailsModalOpen] =
    useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleStartTime, setRescheduleStartTime] = useState("");
  const [rescheduleEndTime, setRescheduleEndTime] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [timing, setTiming] = useState("");
  const [status, setStatus] = useState("");

  // Enhanced type guard functions
  const isGroupedMeeting = (item: AnyMeeting): item is GroupedMeeting => {
    return item.type === "grouped" && "participants" in item;
  };

  const isRegularMeeting = (item: AnyMeeting): item is Meeting => {
    return item.type === "regular" && "teacher" in item;
  };

  // Safe teacher access helper functions
  const getTeacherName = (teacher: any): string => {
    if (!teacher || typeof teacher !== "object") return "No teacher";

    // Handle array case
    if (Array.isArray(teacher)) {
      const first = teacher[0];
      return first?.participantName || first?.teacherName || "No teacher";
    }

    // Handle single object case
    return teacher.participantName || teacher.teacherName || "No teacher";
  };

  const getTeacherArray = (teacher: any): Teacher[] => {
    if (!teacher) return [];
    if (Array.isArray(teacher)) return teacher;
    if (typeof teacher === "object" && (teacher.participantName || teacher.teacherName))
      return [teacher];
    return [];
  };

  // Group meetings function
  const groupMeetingsByMeetingId = (meetings: Meeting[]): Meeting[] => {
    const groupedMap = new Map();

    meetings.forEach((meeting) => {
      // Use meetingId as key if available; otherwise fallback to _id to keep unique
      const key = meeting.meetingId || meeting._id;

      if (!groupedMap.has(key)) {
        // Initialize with the meeting data, clearing the teacher array to accumulate participants
        groupedMap.set(key, {
          ...meeting,
          teacher: [],
        });
      }

      // Aggregate participants (teachers) into the grouped entry
      const group = groupedMap.get(key);
      if (Array.isArray(meeting.teacher)) {
        group.teacher.push(...meeting.teacher);
      }
    });

    return Array.from(groupedMap.values());
  };

  const filterMeetingsBySearch = (meetings: AnyMeeting[]) => {
    if (!searchText.trim()) return meetings;

    const searchLower = searchText.toLowerCase();
    return meetings.filter((meeting) => {
      const nameMatch = meeting.meetingName?.toLowerCase().includes(searchLower);
      const idMatch = meeting.meetingId?.toLowerCase().includes(searchLower);
      const dateMatch = new Date(meeting.selectedDate)
        .toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
        .toLowerCase()
        .includes(searchLower);
      const timingMatch = meeting.startTime?.toLowerCase().includes(searchLower);
      const statusMatch = meeting.meetingStatus
        ?.toLowerCase()
        .includes(searchLower);

      let attendeeMatch = false;
      if (isGroupedMeeting(meeting)) {
        attendeeMatch = meeting.participants.some(
          (p) =>
            p.participantName?.toLowerCase().includes(searchLower) ||
            p.teacherName?.toLowerCase().includes(searchLower)
        );
      } else if (isRegularMeeting(meeting)) {
        const teachers = getTeacherArray(meeting.teacher);
        attendeeMatch = teachers.some(
          (t) =>
            t.participantName?.toLowerCase().includes(searchLower) ||
            t.teacherName?.toLowerCase().includes(searchLower)
        );
      }

      return (
        nameMatch ||
        idMatch ||
        dateMatch ||
        timingMatch ||
        statusMatch ||
        attendeeMatch
      );
    });
  };

  // Get combined data for display
  const getDataToShow = (): AnyMeeting[] => {
    if (activeTab === "upcoming") {
      return [...upcomingClasses];
    } else {
      return [...completedData];
    }
  };

  const dataToShow = filterMeetingsBySearch(getDataToShow());
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataToShow.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dataToShow.length / itemsPerPage);

  const toggleTeacherDropdown = (id: string) => {
    setOpenTeacherDropdownId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenTeacherDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [teachers, setTeachers] = useState<
    { id: string; name: string; subject: string; email: string }[]
  >([]);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("SupervisorAuthToken")
        : null;

    if (!token) {
      console.error("❌ AdminAuthToken not found");
      return;
    }

    axios
      .get<{ totalCount: number; applicants: ApiResponse[] }>(
        "https://api.alfurqanapp.com/applicants",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (Array.isArray(response.data.applicants)) {
          const mappedTeachers = response.data.applicants.map((applicant) => ({
            id: applicant._id,
            name: `${applicant.candidateFirstName} ${applicant.candidateLastName}`,
            subject: applicant.positionApplied?.toLowerCase() || "unknown",
            email: applicant.candidateEmail || "no-email@example.com",
          }));
          setTeachers(mappedTeachers);
        }
      })
      .catch((error) => console.error("Error fetching teachers:", error));
  }, []);

  useEffect(() => {
    const id =
      typeof window !== "undefined"
        ? localStorage.getItem("SupervisorPortalID")
        : null;
    const socket = getSocket(id ?? "");
    const handleList = (data: { data: Meeting }) => {
      console.log("📩 Received WebSocket Data:", data);
      setUpcomingClasses((prev) => [...prev, data.data]);
    };
    socket.on("addmeeting", handleList);
    return () => {
      socket.off("addmeeting", handleList);
    };
  }, []);

  useEffect(() => {
    const fetchMeetings = async () => {
      const supervisorId = localStorage.getItem("SupervisorPortalID");
      const token = localStorage.getItem("SupervisorAuthToken");

      if (!token) {
        console.error("❌ SupervisorAuthToken not found");
        return;
      }

      if (!supervisorId) {
        console.error("❌ SupervisorPortalID not found");
        return;
      }

      try {
        const response = await axios.get(
          `https://api.alfurqanapp.com/allMeetings?supervisorId=${supervisorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const allMeetings: Meeting[] = response.data.meetings.map(
          (meeting: any) => {
            // Determine source for teacher data: use 'teacher' array if present/non-empty, else 'participants'
            let rawTeacher = meeting.teacher;
            if ((!rawTeacher || (Array.isArray(rawTeacher) && rawTeacher.length === 0)) && meeting.participants) {
              rawTeacher = meeting.participants;
            }

            return {
              ...meeting,
              type: "regular" as const,
              // Ensure teacher is always a properly formatted array
              teacher: Array.isArray(rawTeacher)
                ? rawTeacher.filter((t: any) => t && typeof t === "object")
                : rawTeacher && typeof rawTeacher === "object"
                  ? [rawTeacher]
                  : [],
            };
          }
        );

        // Group ALL meetings by ID
        const unifiedMeetings = groupMeetingsByMeetingId(allMeetings);

        const upcomingMeetings = unifiedMeetings.filter((meeting) => {
          const statusOk =
            meeting.meetingStatus === "Scheduled" ||
            meeting.meetingStatus === "Rescheduled";
          return statusOk;
        });

        const completedMeetings = unifiedMeetings.filter(
          (meeting) => meeting.meetingStatus === "Completed"
        );

        setUpcomingClasses(upcomingMeetings);
        setCompletedData(completedMeetings);
        // groupedMeetings state is no longer used
        setGroupedMeetings([]);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchMeetings();
  }, []);



  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplicants = currentItems.slice(startIndex, endIndex);

  const handleRescheduleSubmit = async () => {
    if (
      !rescheduleReason.trim() ||
      !rescheduleDate ||
      !rescheduleStartTime ||
      !rescheduleEndTime ||
      !selectedItemId
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("SupervisorAuthToken");
      if (!token) {
        setFailedMessage("Not authenticated. Please login.");
        setFailed(true);
        return;
      }

      const isoDate = new Date(rescheduleDate).toISOString();

      // Always use DB `_id` in URL to avoid ObjectId cast errors; include `meetingId` in body
      const meetingObj = upcomingClasses.find((m) => m._id === selectedItemId);
      const targetId = selectedItemId; // must be Mongo _id

      const response = await fetch(
        `https://api.alfurqanapp.com/meeting/${targetId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            selectedDate: isoDate,
            startTime: rescheduleStartTime,
            endTime: rescheduleEndTime,
            description: rescheduleReason,
          })


        }
      );

      let result: any = null;
      try {
        result = await response.json();
      } catch (e) {
        console.warn("No JSON in reschedule response", e);
      }

      console.log("Reschedule response:", response.status, result);

      if (!response.ok) {
        const msg = result?.message || result || `Status ${response.status}`;
        setFailedMessage(String(msg));
        setFailed(true);
        return;
      }

      // Update UI using _id (selectedItemId holds _id)
      setUpcomingClasses((prevClasses) =>
        prevClasses.map((item) =>
          item._id === selectedItemId
            ? {
              ...item,
              meetingStatus: "Rescheduled" as Meeting["meetingStatus"],
              selectedDate: isoDate,
              startTime: rescheduleStartTime,
              endTime: rescheduleEndTime,
              description: rescheduleReason,
            }
            : item
        )
      );

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIsRescheduleModalOpen(false);
        setRescheduleReason("");
      }, 2000);
    } catch (error) {
      console.error("Error during rescheduling:", error);
      setFailedMessage("Could not update meeting. Please try again.");
      setFailed(true);
    }
  };

  const getMeetingStatusClass = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "text-[#377E36] bg-[#ECFDF3] dark:bg-[#323E31] dark:text-[#377E36] px-[18px]";
      case "Rescheduled":
        return "text-[#343E59] bg-[#E4E4E4] dark:bg-[#4F4F4F] dark:text-white";
      default:
        return "text-[#377E36] bg-[#ECFDF3]";
    }
  };

  const handleViewDetails = (meetingId: string) => {
    // Only allow viewing details in completed tab
    if (activeTab !== "completed") {
      return; // Don't do anything if not in completed tab
    }

    // Search in the combined data that's currently being displayed
    const meeting = dataToShow.find((m) => {
      if (isRegularMeeting(m)) {
        return m._id === meetingId;
      } else if (isGroupedMeeting(m)) {
        return m._id === meetingId;
      }
      return false;
    });

    if (meeting) {
      // For grouped meetings, we need to convert them to the Meeting type for the modal
      if (isGroupedMeeting(meeting)) {
        // Convert GroupedMeeting to Meeting format for the modal
        const meetingForModal: Meeting = {
          ...meeting,
          type: "regular",
          teacher: meeting.participants,
        };
        setSelectedMeetingDetails(meetingForModal);
      } else {
        setSelectedMeetingDetails(meeting);
      }
      setIsMeetingDetailsModalOpen(true);
    } else {
      console.error("Meeting not found for ID:", meetingId);
    }
  };

  const isStartMeetingNow = (
    selectedDate: string,
    startTime: string,
    endTime: string
  ): boolean => {
    const now = new Date();
    const date = new Date(selectedDate);
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const start = new Date(date);
    start.setHours(startHour, startMin, 0, 0);

    const end = new Date(date);
    end.setHours(endHour, endMin, 0, 0);

    return now >= start && now <= end;
  };

  const handleFilter = async () => {
    setShowModal(false);
    const token = localStorage.getItem("SupervisorAuthToken");

    const params: any = {};
    if (fromDate) params["dateRange.from"] = fromDate;
    if (toDate) params["dateRange.to"] = toDate;
    if (timing) params["startTime"] = timing;
    if (status) params["meetingStatus"] = status;

    // Use the same supervisor ID as in the initial fetch
    const supervisorId = "67a467bcc346aaaea402f760";
    if (supervisorId) params["supervisorId"] = supervisorId;

    try {
      const response = await axios.get(
        "https://api.alfurqanapp.com/allMeetings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params,
        }
      );

      const meetings: Meeting[] = response.data.meetings || [];

      // 1. Normalize data (same as fetchMeetings)
      const normalizedMeetings: Meeting[] = meetings.map((meeting: any) => {
        let rawTeacher = meeting.teacher;
        if ((!rawTeacher || (Array.isArray(rawTeacher) && rawTeacher.length === 0)) && meeting.participants) {
          rawTeacher = meeting.participants;
        }
        return {
          ...meeting,
          type: "regular" as const,
          teacher: Array.isArray(rawTeacher)
            ? rawTeacher.filter((t: any) => t && typeof t === "object")
            : rawTeacher && typeof rawTeacher === "object"
              ? [rawTeacher]
              : [],
        };
      });

      // 2. Group meetings
      const unifiedMeetings = groupMeetingsByMeetingId(normalizedMeetings);

      // 3. Filter client-side to ensure accuracy (and handle auto- meetings)
      const filteredMeetings = unifiedMeetings.filter((meeting) => {
        const isAuto = meeting.meetingId?.startsWith("auto-");
        if (isAuto) return false;

        // Apply filters locally if provided (in case backend ignores them)
        if (status && meeting.meetingStatus !== status) return false;
        // Date/Time filters are harder to apply strictly client-side without more parsing logic,
        // but status is critical for the "Rescheduled" bug.
        // Assuming backend handles date/time generally okay, or we accept loose match there.

        return true;
      });

      setUpcomingClasses(
        filteredMeetings.filter((m) => m.meetingStatus !== "Completed")
      );
      setCompletedData(
        filteredMeetings.filter((m) => m.meetingStatus === "Completed")
      );
      setGroupedMeetings([]); // Clear this as we used unifiedMeetings in upcomingClasses
    } catch (error) {
      console.error("❌ Error fetching filtered meetings:", error);
    }
  };

  return (
    <BaseLayout3>
      <div className="">
        <SupervisorHeader currentSection="Scheduled Meetings" />
        <div className="md:p-0 mx-auto">
          <div className="h-full w-full flex flex-col justify-between">
            <div className="p-0 justify-between flex flex-col">
              <div
                className={`${isRescheduleModalOpen ? "blur-sm" : ""
                  } transition-all duration-200`}
              >
                {/* Tabs */}
                <div className="flex space-x-6 px-4 py-2 rounded-md">
                  <button
                    className={`relative text-[14px] transition font-medium ${activeTab === "upcoming"
                      ? "text-[#576CBC] font-semibold"
                      : "text-[#0A0A12] dark:text-[#fff] opacity-80"
                      }`}
                    onClick={() => setActiveTab("upcoming")}
                  >
                    Scheduled (
                    {groupedMeetings.filter(
                      (g) =>
                        g.meetingStatus === "Scheduled" ||
                        g.meetingStatus === "Rescheduled"
                    ).length + upcomingClasses.length}
                    )
                    {activeTab === "upcoming" && (
                      <span className="absolute left-0 ml-5 -bottom-1 w-[60px] h-[2px] rounded-full bg-[#576CBC] dark:text-[#576CBC]" />
                    )}
                  </button>

                  <button
                    className={`relative text-[14px] transition font-medium ${activeTab === "completed"
                      ? "text-[#576CBC] font-semibold"
                      : "text-[#0A0A12] dark:text-[#fff] opacity-80"
                      }`}
                    onClick={() => setActiveTab("completed")}
                  >
                    Completed (
                    {groupedMeetings.filter(
                      (g) => g.meetingStatus === "Completed"
                    ).length + completedData.length}
                    )
                    {activeTab === "completed" && (
                      <span className="absolute left-0 ml-3 -bottom-1 w-[60px] h-[3px] rounded-full bg-[#576CBC]" />
                    )}
                  </button>
                </div>

                <div className="w-full h-[610px] bg-[#FAFAFB] rounded-lg dark:bg-[#343434] mt-2">
                  <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434]">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by keyword"
                        className="bg-transparent outline-none text-[15px] w-52 py-3"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                      />
                    </div>

                    <div
                      className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
                      onClick={() => setShowModal(true)}
                    >
                      <MdTune className="w-4 h-4" />
                      <span>Filter</span>
                    </div>

                    <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                      <span className="text-left -ml-60">
                        Showing {currentApplicants.length} Of{" "}
                        {dataToShow.length}
                      </span>
                    </div>
                  </div>

                  <table
                    className="table-auto w-full"
                    style={{ width: "100%", tableLayout: "fixed" }}
                  >
                    <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                      <tr className="font-medium">
                        <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0] w-[180px] break-words whitespace-normal">
                          Meeting ID
                        </th>
                        <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0] w-[250px] break-words whitespace-normal">
                          Meeting Name
                        </th>
                        <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                          Attendees
                        </th>
                        <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                          Date
                        </th>
                        <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                          Timing
                        </th>
                        <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                          Status
                        </th>
                        <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item, index) => {
                        if (isGroupedMeeting(item)) {
                          // Render Grouped Meeting
                          return (
                            <tr
                              key={item.meetingId}
                              className={`text-[12px] ${index % 2 === 0
                                ? "bg-[#fff] dark:bg-[#2C2C2C]"
                                : "bg-[#F8F8F8] dark:bg-[#303030]"
                                }`}
                            >
                              <td className="px-3 py-3 text-[#3D8FDE] font-medium text-left w-[180px] break-words whitespace-normal">
                                {item.meetingId}
                              </td>
                              <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left w-[250px] break-words whitespace-normal">
                                {item.meetingName}
                              </td>
                              <td className="px-3 py-2 text-left text-[#17243E] dark:text-[#FDFDFD]">
                                <div className="relative">
                                  <button
                                    onClick={() =>
                                      toggleTeacherDropdown(item.meetingId)
                                    }
                                    className="flex items-center gap-2 font-medium hover:text-[#5c5c5c] dark:hover:text-[#5c5c5c]"
                                  >
                                    <AiOutlineMenuUnfold />
                                    View List ({item.participants.length})
                                  </button>

                                  {openTeacherDropdownId === item.meetingId && (
                                    <div className="absolute z-10 mt-2 w-72 bg-white rounded shadow-lg p-3 dark:bg-[#343434] border border-gray-200 dark:border-gray-600">
                                      <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                                        <h4 className="font-semibold text-sm mb-2 text-[#17243E] dark:text-[#FDFDFD]">
                                          Attendees:
                                        </h4>
                                        {item.participants.map(
                                          (participant, idx) => (
                                            <div
                                              key={`${participant.teacherId}-${idx}`}
                                              className="py-2 text-[#17243E] dark:text-[#FDFDFD] border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                                            >
                                              <div className="flex items-center gap-2">
                                                <IoPersonOutline className="flex-shrink-0" />
                                                <div>
                                                  <div className="font-medium">
                                                    {participant.participantName ||
                                                      participant.teacherName ||
                                                      "Unknown Teacher"}
                                                  </div>
                                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {participant.participantEmail ||
                                                      "No email"}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                                {new Date(item.selectedDate)
                                  .toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "2-digit",
                                    year: "numeric",
                                  })
                                  .replace(",", ",")}{" "}
                              </td>
                              <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left w-[80px] break-words whitespace-normal">
                                {item.startTime}
                              </td>
                              <td className="px-3 py-2 text-left">
                                <span
                                  className={`text-[10px] font-semibold px-3 py-1 rounded-lg ${getMeetingStatusClass(
                                    item.meetingStatus
                                  )}`}
                                >
                                  {item.meetingStatus}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-left w-[80px] break-words whitespace-normal ">
                                {activeTab === "completed" ? (
                                  <button
                                    onClick={() => handleViewDetails(item._id)}
                                    className="p-2 rounded-md"
                                  >
                                    <FaEye className="w-4 h-4 text-slate-600 dark:text-[#FDFDFD] cursor-pointer" />
                                  </button>
                                ) : (
                                  <div className="p-2">
                                    <FaEye className="w-4 h-4 text-slate-600 dark:text-[#FDFDFD] cursor-not-allowed" />{" "}
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        } else if (isRegularMeeting(item)) {
                          // Render Regular Meeting
                          return (
                            <tr
                              key={item._id}
                              className={`text-[12px] ${index % 2 === 0
                                ? "bg-[#fff] dark:bg-[#2C2C2C]"
                                : "bg-[#F8F8F8] dark:bg-[#303030]"
                                }`}
                            >
                              <td className="px-3 py-2 text-[#3D8FDE] font-medium text-left w-[180px] break-words whitespace-normal">
                                {item.meetingId}
                              </td>
                              <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left w-[250px] break-words whitespace-normal">
                                {item.meetingName}
                              </td>
                              <td className="px-3 py-2 text-left text-[#17243E] dark:text-[#FDFDFD]">
                                <div className="relative">
                                  {getTeacherArray(item.teacher).length > 1 ? (
                                    <>
                                      <button
                                        onClick={() =>
                                          toggleTeacherDropdown(item._id)
                                        }
                                        className="flex items-center gap-2 font-medium hover:text-[#5c5c5c] dark:hover:text-[#5c5c5c]"
                                      >
                                        <AiOutlineMenuUnfold />
                                        View List (
                                        {getTeacherArray(item.teacher).length})
                                      </button>

                                      {openTeacherDropdownId === item._id && (
                                        <div className="absolute z-10 mt-2 w-48 bg-white rounded shadow-lg p-2 dark:bg-[#343434]">
                                          {getTeacherArray(item.teacher).map(
                                            (teacher, idx) => (
                                              <div
                                                key={idx}
                                                className="py-1 text-[#17243E] dark:text-[#FDFDFD]"
                                              >
                                                <span className="flex items-center gap-2">
                                                  <IoPersonOutline />
                                                  {teacher.teacherName ||
                                                    teacher.participantName ||
                                                    "Unknown Teacher"}
                                                </span>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <span className="flex items-center gap-2 font-medium">
                                      <IoPersonOutline />
                                      {getTeacherName(item.teacher)}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                                {new Date(item.selectedDate)
                                  .toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "2-digit",
                                    year: "numeric",
                                  })
                                  .replace(",", ",")}{" "}
                              </td>
                              <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left w-[80px] break-words whitespace-normal">
                                {item.startTime}
                              </td>
                              <td className="px-3 py-2 text-left">
                                {(() => {
                                  let content;
                                  if (activeTab === "upcoming") {
                                    if (
                                      isStartMeetingNow(
                                        item.selectedDate,
                                        item.startTime,
                                        item.endTime
                                      )
                                    ) {
                                      content = (
                                        <button
                                          className="text-[10px] font-semibold px-[11px] py-1 rounded-lg bg-[#576cbc] text-white border"
                                          onClick={() =>
                                            router.push(
                                              `/supervisor/ui/meetingvideocall?id=${item._id}`
                                            )
                                          }
                                        >
                                          Start Meeting
                                        </button>
                                      );
                                    } else {
                                      content = (
                                        <span
                                          className={`text-[10px] font-semibold px-3 py-1 rounded-lg ${getMeetingStatusClass(
                                            item.meetingStatus
                                          )}`}
                                        >
                                          {item.meetingStatus}
                                        </span>
                                      );
                                    }
                                  } else {
                                    content = (
                                      <span className="text-[10px] font-semibold px-3 py-1 rounded-lg bg-[#ECFDF3] text-[#377E36] dark:bg-[#2E3D2E] dark:text-[#377E36]">
                                        {item.meetingStatus}
                                      </span>
                                    );
                                  }
                                  return content;
                                })()}
                              </td>
                              <td className="px-3 py-2 text-left w-[80px] break-words whitespace-normal">
                                <div className="relative">
                                  {activeTab === "upcoming" ? (
                                    // Upcoming tab - open Reschedule modal for actions
                                    item.meetingStatus === "Rescheduled" ? (
                                      <button
                                        type="button"
                                        disabled
                                        className="p-2 rounded-md opacity-50 cursor-not-allowed"
                                      >
                                        <MoreVertical className="w-4 h-4 text-slate-600 dark:text-[#FDFDFD]" />
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          setIsRescheduleModalOpen(true);
                                          setSelectedItemId(item._id);
                                        }}
                                        type="button"
                                        className="p-2 rounded-md"
                                      >
                                        <MoreVertical className="w-4 h-4 text-slate-600 dark:text-[#FDFDFD] cursor-pointer" />
                                      </button>
                                    )
                                  ) : (
                                    // Completed tab - show Eye for viewing details
                                    <button
                                      onClick={() =>
                                        handleViewDetails(item._id)
                                      }
                                      className="p-2 rounded-md"
                                    >
                                      <FaEye className="w-4 h-4 text-slate-600 dark:text-[#FDFDFD] cursor-pointer" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        }
                        return null;
                      })}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-30">
          <div className="bg-white p-6 rounded-lg w-[500px] relative dark:bg-[#252525]">
            <button
              className="absolute top-2 right-3 text-gray-400 text-xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>

            <h2 className="text-lg font-semibold mb-4">Filter by</h2>

            <div className="mb-4">
              <label className="text-sm font-medium mb-1 dark:text-[#D6D6D6]">
                Date Range
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="date"
                  className="w-1/2 px-3 py-2 border rounded text-xs text-[#343434] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
                <input
                  type="date"
                  className="w-1/2 px-3 py-2 border rounded text-xs text-[#343434] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="timimg"
                className="block text-sm text-gray-700 mb-1 dark:text-white"
              >
                Timing
              </label>
              <input
                value={timing}
                onChange={(e) => setTiming(e.target.value)}
                type="time"
                className="w-full mb-4 border border-gray-300 dark:bg-[#343434] dark:text-white rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-1"
              >
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded-md p-2 text-[12px] dark:bg-[#343434] dark:text-[#D6D6D6] dark:border-[#565656]"
              >
                <option value="">Select status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Rescheduled">Rescheduled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1 rounded-md border border-[#576CBC] text-[#576CBC] font-medium"
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 rounded-md bg-[#576CBC] text-white font-medium"
                onClick={handleFilter}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Details Modal */}
      {isMeetingDetailsModalOpen && selectedMeetingDetails && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <button
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMeetingDetailsModalOpen(false)}
          ></button>
          <div className="relative z-50 bg-white rounded-lg p-6 w-[720px] max-h-[90vh] overflow-y-auto shadow-xl dark:bg-[#252525]">
            <button
              onClick={() => setIsMeetingDetailsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 text-lg font-bold"
            >
              <IoMdClose />
            </button>
            <h2 className="text-md font-semibold text-[#0D0E25] mb-6 dark:text-[#fff]">
              Meeting Details
            </h2>
            {/* Grid Fields */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-[12px] text-[#0D0E25] mb-1 dark:text-[#fff]">
                  Meeting ID
                </label>
                <input
                  value={selectedMeetingDetails.meetingId}
                  disabled
                  className="w-full px-3 py-2 text-[12px] border border-[#D4D4D4] rounded-lg dark:text-[#D6D6D6] dark:border-[#5C5C5C] dark:bg-[#343434]"
                />
              </div>
              <div>
                <label className="block text-[12px] text-[#0D0E25] mb-1 dark:text-[#fff]">
                  Meeting Name
                </label>
                <input
                  value={selectedMeetingDetails.meetingName}
                  disabled
                  className="w-full px-3 py-2 text-[12px] border  border-[#D4D4D4] rounded-lg dark:text-[#D6D6D6] dark:border-[#5C5C5C] dark:bg-[#343434]"
                />
              </div>
              <div>
                <label className="block text-[12px] text-[#0D0E25] mb-1 dark:text-[#fff]">
                  Date
                </label>
                <input
                  value={selectedMeetingDetails.selectedDate}
                  disabled
                  className="w-full px-3 py-2 text-[12px] border border-[#D4D4D4] rounded-lg dark:text-[#D6D6D6] dark:border-[#5C5C5C] dark:bg-[#343434]"
                />
              </div>
              <div>
                <label className="block text-[12px] text-[#0D0E25] mb-1 dark:text-[#fff]">
                  Duration
                </label>
                <input
                  value={selectedMeetingDetails.duration}
                  disabled
                  className="w-full px-3 py-2 text-[12px] border border-[#D4D4D4] rounded-lg dark:text-[#D6D6D6] dark:border-[#5C5C5C] dark:bg-[#343434]"
                />
              </div>
              <div>
                <label className="block text-[12px] text-[#0D0E25] mb-1 dark:text-[#fff]">
                  Meeting Time
                </label>
                <input
                  value={`${selectedMeetingDetails.startTime} - ${selectedMeetingDetails.endTime}`}
                  disabled
                  className="w-full px-3 py-2 text-[12px] border border-[#D4D4D4] rounded-lg dark:text-[#D6D6D6] dark:border-[#5C5C5C] dark:bg-[#343434]"
                />
              </div>
            </div>

            {/* Attendance */}
            <div className="mb-6 rounded-xl overflow-hidden dark:bg-[#343434] text-white border ">
              <div className="flex justify-between items-center bg-[#576CBC] text-white px-6 py-3 text-sm font-semibold">
                <span>Name</span>
                <span>Attendance</span>
              </div>
              <div className="divide-y max-h-40 overflow-y-auto text-sm">
                {getTeacherArray(selectedMeetingDetails.teacher).map(
                  (teacher, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center px-4 py-2"
                    >
                      <span className="text-[#4F46E5]">
                        {teacher.teacherName ||
                          teacher.participantName ||
                          "Unknown Teacher"}
                      </span>
                      <span
                        className={`text-lg ${teacher.attendee === "present"
                          ? "text-green-600"
                          : "text-red-500"
                          }`}
                      >
                        {teacher.attendee === "present" ? "✔" : "✘"}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-[12px] text-[#0D0E25] mb-1 dark:text-[#fff]">
                Meeting Description
              </label>
              <textarea
                value={selectedMeetingDetails.meetingminutes}
                disabled
                className="w-full px-3 py-2 text-[12px] border border-[#D4D4D4] rounded-lg dark:text-[#D6D6D6] dark:border-[#5C5C5C] dark:bg-[#343434]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {isRescheduleModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="bg-white rounded-lg p-6 w-[600px] relative z-50 shadow-xl dark:bg-[#252525]">
            <h2 className="text-[#0D0E25] text-md font-semibold mb-4 dark:text-[#fff]">
              Reason for Re-Schedule
            </h2>
            <label className="block text-xs font-medium text-[#0D0E25] mb-1 dark:text-white">
              Add Description
            </label>
            <textarea
              className="w-full h-32 p-3 mb-6 border border-[#D9D9D9] rounded-md text-sm text-[#0D0E25] placeholder-[#9CA3AF] resize-none focus:outline-none dark:bg-[#343434] dark:border-[#5C5C5C] dark:text-white"
              placeholder="Type here..."
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
            />
            <div className="flex gap-4 mb-6">
              <div className="w-1/2">
                <label className="block text-xs font-medium text-[#0D0E25] mb-1 dark:text-white">
                  Reschedule Date
                </label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full text-xs px-4 py-2 border border-[#D9D9D9] rounded-md text-[#0D0E25] focus:outline-none dark:bg-[#343434] dark:border-[#5C5C5C] dark:text-white"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-xs font-medium text-[#0D0E25] mb-1 dark:text-white">
                  Reschedule Start Time
                </label>
                <input
                  type="time"
                  value={rescheduleStartTime}
                  onChange={(e) => setRescheduleStartTime(e.target.value)}
                  className="w-full text-sm px-4 py-2 border border-[#D9D9D9] rounded-md text-[#0D0E25] focus:outline-none dark:bg-[#343434] dark:border-[#5C5C5C] dark:text-white"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-xs font-medium text-[#0D0E25] mb-1 dark:text-white">
                  Reschedule End Time
                </label>
                <input
                  type="time"
                  value={rescheduleEndTime}
                  onChange={(e) => setRescheduleEndTime(e.target.value)}
                  className="w-full text-sm px-4 py-2 border border-[#D9D9D9] rounded-md text-[#0D0E25] focus:outline-none dark:bg-[#343434] dark:border-[#5C5C5C] dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t pt-4 dark:border-[#5C5C5C]">
              <button
                onClick={() => setIsRescheduleModalOpen(false)}
                className="px-6 py-2 rounded-md border border-[#576CBC] font-semibold text-[#576CBC] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleSubmit}
                className="px-6 py-2 rounded-md bg-[#576CBC] text-white font-semibold transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <SuccessPopup onClose={() => setSuccess(false)} title="ReSchedule" />
      )}
      {failed && (
        <FailedPopup onClose={() => setFailed(false)} title={failedMessage} />
      )}
    </BaseLayout3>
  );
};

export default ScheduledClasses;
