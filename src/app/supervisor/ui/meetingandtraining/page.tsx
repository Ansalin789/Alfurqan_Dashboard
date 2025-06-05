"use client";

import React, { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdClose } from "react-icons/io";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
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
interface ApiResponse {
  candidateFirstName: string;
  candidateLastName: string;
  positionApplied: string; // Use this field to determine the subject
  _id: string;
  candidateEmail: string;
}
interface Meeting {
  _id: string;
  meetingId: string;
  meetingName: string;
  meetingStatus: "Scheduled" | "Rescheduled" | "Completed";
  selectedDate: string;
  startTime: string;
  endTime: string;
  description: string;
  createdDate: string;
  createdBy: string;
  supervisor: {
    supervisorId: string;
    supervisorName: string;
    supervisorEmail: string;
    supervisorRole: string;
  };
  teacher: {
    teacherId: string;
    teacherName: string;
    teacherEmail: string;
  }[];
}

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
  const [isDatePickerOpens, setIsDatePickerOpens] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [completedData, setCompletedData] = useState<Meeting[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<Meeting[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [openTeacherDropdownId, setOpenTeacherDropdownId] = useState<
    string | null
  >(null);
  const [selectedMeetingDetails, setSelectedMeetingDetails] =
    useState<Meeting | null>(null);
  const [isMeetingDetailsModalOpen, setIsMeetingDetailsModalOpen] =
    useState(false);
  const [rescheduleDate, setRescheduleDate] = useState(""); // in 'YYYY-MM-DD' format
  const [rescheduleTime, setRescheduleTime] = useState(""); // in 'HH:mm' 24h format

  const toggleTeacherDropdown = (id: string) => {
    setOpenTeacherDropdownId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenTeacherDropdownId(null); // Close dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [teachers, setTeachers] = useState<
    {
      id: string;
      name: string;
      subject: string;
      email: string;
    }[]
  >([]);
  console.log(isDatePickerOpens);

  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("AdminAuthToken")
        : null;

    if (!token) {
      console.error("❌ AdminAuthToken not found");
      return;
    }
    axios
      .get<{ totalCount: number; applicants: ApiResponse[] }>(
        "https://api.blackstoneinfomaticstech.com/applicants",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("API Response:", response.data); // ✅ Debugging step

        if (Array.isArray(response.data.applicants)) {
          const mappedTeachers = response.data.applicants.map((applicant) => ({
            id: applicant._id, // Use actual teacher ID
            name: `${applicant.candidateFirstName} ${applicant.candidateLastName}`,
            subject: applicant.positionApplied?.toLowerCase() || "unknown", // Prevents crashes if null
            email: applicant.candidateEmail || "no-email@example.com", // Use actual email
          }));
          setTeachers(mappedTeachers);
          console.log("Mapped Teachers:", mappedTeachers);
        } else {
          console.error("Unexpected API response format:", response.data);
        }
      })
      .catch((error) => console.error("Error fetching teachers:", error));
  }, []);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("SupervisorAuthToken")
            : null;

        if (!token) {
          console.error("❌ SupervisorAuthToken not found");
          return;
        }
        const response = await axios.get(
          "https://api.blackstoneinfomaticstech.com/allMeetings",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Full API Response:", response.data);

        if (
          !response.data?.data?.meetings ||
          !Array.isArray(response.data.data.meetings)
        ) {
          console.error(
            "🚨 Meetings array missing or not an array:",
            response.data
          );
          return;
        }

        const allMeetings: Meeting[] = response.data.data.meetings;

        console.log("✅ Extracted Meetings:", allMeetings);

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize for comparison

        // ✅ Use `meetingStatus` instead of `status`
        const upcomingMeetings = allMeetings
          .filter((meeting) => {
            if (!meeting.selectedDate || !meeting.meetingStatus) return false;

            const meetingDate = new Date(meeting.selectedDate);
            return (
              (meeting.meetingStatus === "Scheduled" ||
                meeting.meetingStatus === "Rescheduled") &&
              meetingDate >= today
            );
          })
          .sort(
            (a, b) =>
              new Date(a.selectedDate).getTime() -
              new Date(b.selectedDate).getTime()
          );

        const completedMeetings = allMeetings.filter(
          (meeting) => meeting.meetingStatus === "Completed"
        );

        // ✅ Extract & Group Teachers by Meeting ID
        const teachersMap: Record<string, any[]> = {};
        allMeetings.forEach((meeting) => {
          if (meeting.teacher && Array.isArray(meeting.teacher)) {
            teachersMap[meeting.meetingId] = meeting.teacher;
          }
        });

        setUpcomingClasses(upcomingMeetings);
        setCompletedData(completedMeetings);
        setTeachersByMeetingId(teachersMap);

        console.log("✅ Teachers Mapped by Meeting ID:", teachersMap);
        console.log("✅ Upcoming Meetings Set to State:", upcomingMeetings);
        console.log("✅ Completed Meetings Set to State:", completedMeetings);
      } catch (error) {
        console.error("🚨 Error fetching meetings:", error);
      }
    };

    fetchMeetings();
  }, []);

  interface Teacher {
    teacherId: string;
    teacherName: string;
    teacherEmail: string;
  }
  type TeachersByMeetingId = Record<string, Teacher[]>;
  const [teachersByMeetingId, setTeachersByMeetingId] =
    useState<TeachersByMeetingId>({});

  useEffect(() => {
    console.log(selectedTeachers);
    console.log(teachers);
  }, [teachers]);

  const dataToShow = activeTab === "upcoming" ? upcomingClasses : completedData;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataToShow.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dataToShow.length / itemsPerPage);

  // const filteredApplicants =
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplicants = currentItems.slice(startIndex, endIndex);

  const handleOptionsClick = (id: string) => {
    setSelectedItemId(selectedItemId === id ? null : id);
  };

  //   const handleViewDetails = (item: any) => {
  //   setSelectedItemId(item);
  //   setShowMeetingDetailsModal(true); // assuming you have this state and modal
  // };

  const handleRescheduleSubmit = async () => {
    if (
      !rescheduleReason.trim() ||
      !rescheduleDate ||
      !rescheduleTime ||
      !selectedItemId
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // or use context/auth provider
      const response = await fetch(
        `https://api.blackstoneinfomaticstech.com/meeting/${selectedItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            selectedDate: rescheduleDate,
            startTime: rescheduleTime,
            description: rescheduleReason,
            meetingStatus: "Rescheduled",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update meeting");
      }

      // Update frontend UI
      setUpcomingClasses((prevClasses) =>
        prevClasses.map((item) =>
          item._id === selectedItemId
            ? {
                ...item,
                meetingStatus: "Rescheduled" as Meeting["meetingStatus"],
              }
            : item
        )
      );

   setSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setIsRescheduleModalOpen(false);
        setRescheduleReason("");
      }, 2000);
    } catch (error) {
      console.error("Error during rescheduling:", error);
      alert("Could not update meeting. Please try again.");
    }
  };

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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
    const meeting = completedData.find((m) => m._id === meetingId);
    if (meeting) {
      setSelectedMeetingDetails(meeting);
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

  function startMeeting(_id: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <BaseLayout3>
      <div className="">
        <SupervisorHeader currentSection="Scheduled Meetings" />
        <div className="md:p-0 mx-auto">
          <div className="h-full w-full  flex flex-col justify-between">
            <div className="p-0 justify-between flex flex-col">
              <div
                className={`${
                  isRescheduleModalOpen ? "blur-sm" : ""
                } transition-all duration-200`}
              >
                {/* Tabs */}
                <div className="flex space-x-6  px-4 py-2 rounded-md">
                  <button
                    className={`relative text-[14px] transition font-medium ${
                      activeTab === "upcoming"
                        ? "text-[#576CBC] font-semibold"
                        : "text-[#0A0A12] dark:text-[#fff] opacity-80"
                    }`}
                    onClick={() => setActiveTab("upcoming")}
                  >
                    Scheduled ({upcomingClasses.length})
                    {activeTab === "upcoming" && (
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
                    Completed ({completedData.length})
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
                        className="bg-transparent outline-none text-[15px] w-52 py-3 "
                      />
                    </div>

                    <div
                      className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
                      onClick={() => setShowModal(true)}
                    >
                      {/* <BsFilterLeft /> */}
                      <MdTune className="w-4 h-4" />
                      <span>Filter</span>
                    </div>

                    <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                      <span className="text-left -ml-60 ">
                        Showing {currentApplicants.length} Of {dataToShow.length}
                      </span>
                    </div>
                  </div>

                  <table
                    className="table-auto xw-full"
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
                        <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0] ">
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
                      {currentItems.map((item, index) => (
                        <tr
                          key={item._id}
                          className={`text-[12px] ${
                            index % 2 === 0
                              ? "bg-[#fff] dark:bg-[#2C2C2C]"
                              : "bg-[#F8F8F8] dark:bg-[#303030]"
                          }`}
                        >
                          <td className="px-3 py-2 text-[#3D8FDE] font-medium text-left w-[180px] break-words whitespace-normal">
                            {item._id}
                          </td>
                          <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left w-[250px] break-words whitespace-normal">
                            {item.meetingName}
                          </td>
                          <td className="relative px-3 py-2 text-left text-[#17243E] dark:text-[#FDFDFD]">
                            {item.teacher.length > 1 ? (
                              <>
                                <button
                                  onClick={() =>
                                    toggleTeacherDropdown(item.meetingId)
                                  }
                                  className="flex items-center gap-2 font-medium hover:text-[#274872]"
                                >
                                  <AiOutlineMenuUnfold />
                                  View List
                                </button>

                                {openTeacherDropdownId === item.meetingId && (
                                  <div
                                    ref={dropdownRef}
                                    className="absolute z-10 mt-2 w-48 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded shadow-lg p-2"
                                  >
                                    {item.teacher.map((t, idx) => (
                                      <div
                                        key={idx}
                                        className="py-1 text-[#17243E] dark:text-[#FDFDFD]"
                                      >
                                        <span className="flex items-center gap-2">
                                          <IoPersonOutline />
                                          {t.teacherName}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </>
                            ) : (
                              <span className="flex items-center gap-2 font-medium">
                                <IoPersonOutline />
                                {item.teacher[0]?.teacherName}
                              </span>
                            )}
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
                                      className="text-[10px] font-semibold px-[11px] py-1 rounded-lg bg-[#576cbc] text-white border  "
                                      onClick={() =>
                                        router.push(
                                          `/supervisor/ui/liveclass?id=${item._id}`
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
                              <button
                                onClick={() => {
                                  if (item.meetingStatus === "Scheduled") {
                                    setIsDetailsModalOpen(true);
                                    setSelectedItemId((prev) =>
                                      prev === item._id ? null : item._id
                                    );
                                  } else if (
                                    item.meetingStatus === "Completed"
                                  ) {
                                    handleViewDetails(item._id); // ← your function to open details view
                                  }
                                }}
                                className="p-2 rounded-md"
                              >
                                <MoreVertical className="w-4 h-4 text-slate-600 dark:text-[#FDFDFD]" />
                              </button>

                              {item.meetingStatus === "Scheduled" &&
                                isDetailsModalOpen &&
                                selectedItemId === item._id && (
                                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                                    <button
                                      onClick={() => {
                                        setIsRescheduleModalOpen(true);
                                        setSelectedItemId(item._id);
                                        setIsDetailsModalOpen(false); // Close dropdown after clicking
                                      }}
                                      className="block w-full px-4 py-2 text-left text-[12px] text-slate-600"
                                    >
                                      Request Reschedule
                                    </button>
                                    <button
                                      onClick={() => setSelectedItemId(null)}
                                      className="block w-full px-4 py-2 text-left text-[12px] text-red-600 hover:bg-gray-50"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))}
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
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[500px] relative dark:bg-[#252525]">
            {/* Close Icon */}
            <button
              className="absolute top-2 right-3 text-gray-400 text-xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>

            <h2 className="text-lg font-semibold mb-4">Filter by</h2>

            {/* Date Input */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 dark:text-[#D6D6D6]">
                Date Range
              </label>

              <div className="flex gap-2 mb-2">
                <input
                  type="date"
                  className="w-1/2 px-3 py-2 border rounded text-xs text-[#343434] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                  // value={exp.fromDate}
                />
                <input
                  type="date"
                  className="w-1/2 px-3 py-2 border rounded text-xs text-[#343434] dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                  // value={exp.toDate}
                />
              </div>
            </div>

            {/* Position Applied */}
            <div className="mb-4">
              <label
                htmlFor="position"
                className="block text-sm font-medium mb-1"
              >
                Timing
              </label>
              <select className="w-full border rounded-md p-2 text-[12px] dark:bg-[#343434] dark:text-[#D6D6D6] dark:border-[#565656]">
                <option>time 1</option>
                <option>time 1</option>
                <option>time 1</option>
              </select>
            </div>

            {/* Status */}
            <div className="mb-6">
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-1"
              >
                Status
              </label>
              <select className="w-full border rounded-md p-2 text-[12px] dark:bg-[#343434] dark:text-[#D6D6D6] dark:border-[#565656]">
                <option>Shortlisted</option>
                <option>Rejected</option>
                <option>Waiting</option>
                <option>Approved</option>
                <option>New Application</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1 rounded-md border border-[#576CBC] text-[#576CBC] font-medium"
              >
                Cancel
              </button>
              <button className="px-4 py-1 rounded-md bg-[#576CBC] text-white font-medium">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MeetingDetails Modal */}
      {isMeetingDetailsModalOpen && selectedMeetingDetails && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMeetingDetailsModalOpen(false)}
          />

          {/* Modal */}
          <div className="relative z-50 bg-white rounded-lg p-6 w-[720px] max-h-[90vh] overflow-y-auto shadow-xl dark:bg-[#252525]">
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
                  Course
                </label>
                <input
                  value="-"
                  disabled
                  className="w-full px-3 py-2 text-[12px] border border-[#D4D4D4] rounded-lg dark:text-[#D6D6D6] dark:border-[#5C5C5C] dark:bg-[#343434]"
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
                  value={"60 Minutes"} // You can compute actual difference if needed
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
                {selectedMeetingDetails.teacher.map((teacher, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center px-4 py-2"
                  >
                    <span className="text-[#4F46E5]">
                      {teacher.teacherName}
                    </span>
                    {/* Placeholder logic for attendance, since it's not in interface */}
                    <span className="text-green-600 text-lg">✔</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-[12px] text-[#0D0E25] mb-1 dark:text-[#fff]">
                Meeting Description
              </label>
              <textarea
                value={selectedMeetingDetails.description ?? ""}
                disabled
                className="w-full px-3 py-2 text-[12px] border border-[#D4D4D4] rounded-lg dark:text-[#D6D6D6] dark:border-[#5C5C5C] dark:bg-[#343434]"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 border-t pt-4 dark:border-[#5C5C5C]  ">
              <button
                onClick={() => setIsMeetingDetailsModalOpen(false)}
                className="px-6 py-2 rounded-md border border-[#576CBC] font-semibold text-[#576CBC] transition"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsMeetingDetailsModalOpen(false)}
                className="px-6 py-2 rounded-md bg-[#576CBC] text-white font-semibold  transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {isRescheduleModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black bg-opacity-50" />

          {/* Modal container */}
          <div className="bg-white rounded-lg p-6 w-[600px] relative z-50 shadow-xl dark:bg-[#252525]">
            <h2 className="text-[#0D0E25] text-md font-semibold mb-4 dark:text-[#fff]">
              Reason for Re-Schedule
            </h2>

            {/* Description */}
            <label className="block text-xs font-medium text-[#0D0E25] mb-1 dark:text-white">
              Add Description
            </label>
            <textarea
              className="w-full h-32 p-3 mb-6 border border-[#D9D9D9] rounded-md text-sm text-[#0D0E25] placeholder-[#9CA3AF] resize-none focus:outline-none dark:bg-[#343434] dark:border-[#5C5C5C] dark:text-white"
              placeholder="Type here..."
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
            />

            {/* Date and Time Row */}
            <div className="flex gap-4 mb-6">
              <div className="w-1/2">
                <label className="block text-xs font-medium text-[#0D0E25] mb-1 dark:text-white">
                  Reschedule Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full text-xs px-4 py-2 border border-[#D9D9D9] rounded-md text-[#0D0E25] focus:outline-none dark:bg-[#343434] dark:border-[#5C5C5C] dark:text-white"
                  />
                </div>
              </div>

              <div className="w-1/2">
                <label className="block text-xs font-medium text-[#0D0E25] mb-1 dark:text-white">
                  Reschedule Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full text-sm px-4 py-2 border border-[#D9D9D9] rounded-md text-[#0D0E25] focus:outline-none dark:bg-[#343434] dark:border-[#5C5C5C] dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 border-t pt-4 dark:border-[#5C5C5C]  ">
              <button
                onClick={() => setIsRescheduleModalOpen(false)}
                className="px-6 py-2 rounded-md border border-[#576CBC] font-semibold text-[#576CBC] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleSubmit}
                className="px-6 py-2 rounded-md bg-[#576CBC] text-white font-semibold  transition"
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
