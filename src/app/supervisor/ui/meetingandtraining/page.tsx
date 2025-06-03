"use client";

import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdArrowDropdownCircle, IoMdClose } from "react-icons/io";
import { useRouter } from "next/navigation";
import { FaCalendarAlt, FaPlus, FaUserCircle } from "react-icons/fa";
import { MoreVertical, Search, User } from "lucide-react";
import BaseLayout3 from "@/components/BaseLayout3";
import { button } from "@nextui-org/react";
import axios from "axios";
import SupervisorHeader from "../../components/supervisorHeader";
import Pagination from "@/components/Pagination";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { IoPersonOutline } from "react-icons/io5";
import { MdTune } from "react-icons/md";
import { FiCalendar } from "react-icons/fi";
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
  meetingStatus: "Scheduled" | "Reschedule" | "Completed";
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
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date | null>(null);

  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);

  const [meetingTitle, setMeetingTitle] = useState("");

  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isDatePickerOpens, setIsDatePickerOpens] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:30");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const fromWrapperRef = useRef<HTMLDivElement>(null);
  const toWrapperRef = useRef<HTMLDivElement>(null);

  function focusFromInput() {
    const input = fromWrapperRef.current?.querySelector("input");
    input?.focus();
  }

  function focusToInput() {
    const input = toWrapperRef.current?.querySelector("input");
    input?.focus();
  }

  const [completedData, setCompletedData] = useState<Meeting[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<Meeting[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("purple");
  const [openTeacherDropdownId, setOpenTeacherDropdownId] = useState<
    string | null
  >(null);

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

  const colorOptions = [
    { color: "purple", hex: "#A259FF" },
    { color: "green", hex: "#4CAF50" },
    { color: "orange", hex: "#FFA500" },
    { color: "blue", hex: "#4285F4" },
  ];

  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "Arabic Teacher" | "Quran Teacher"
  >("all");
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
                meeting.meetingStatus === "Reschedule") &&
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

  // Filter teachers based on the selected filter
  const filteredTeachers =
    selectedFilter === "all"
      ? teachers
      : teachers.filter((t) => {
          const normalizedSubject = t.subject.trim(); // Normalize subject
          return selectedFilter.includes(normalizedSubject); // Check if filter includes it
        });

  // Toggle teacher selection
  const toggleSelections = (teacherName: string) => {
    setSelectedTeachers((prev) =>
      prev.includes(teacherName)
        ? prev.filter((t) => t !== teacherName)
        : [...prev, teacherName]
    );
  };
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

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleOptionsClick = (id: string) => {
    setSelectedItemId(selectedItemId === id ? null : id);
  };

  const handleRescheduleSubmit = () => {
    if (rescheduleReason.trim()) {
      setShowSuccess(true);
      setUpcomingClasses((prevClasses) =>
        prevClasses.map((item) =>
          item._id === selectedItemId
            ? { ...item, status: "Rescheduled" as Meeting["meetingStatus"] }
            : item
        )
      );

      setTimeout(() => {
        setShowSuccess(false);
        setIsRescheduleModalOpen(false);
        setRescheduleReason("");
      }, 2000);
    }
  };

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setSelectedDates(date);
      setIsDatePickerOpen(false);
      setIsDatePickerOpens(false);
      router.push("/teacher/ui/schedule/schedules");
    }
  };

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const colorTitles: Record<string, string> = {
    blue: "Interview",
    green: "Group Meeting",
    orange: "Teacher Meeting",
    purple: "Weekly Meeting",
  };

  const nextPage = () => {
    router.push("/supervisor/ui/meetingandtraining/schedule");
  };

  const handleScheduleMeeting1 = async () => {
    if (
      !meetingTitle ||
      !selectedDates ||
      !startTime ||
      !endTime ||
      selectedTeachers.length === 0
    ) {
      alert("Please fill all required fields!");
      return;
    }

    const formattedDate = selectedDates.toISOString();
    const createdDate = new Date().toISOString();

    const requestData = {
      meetingId: `weeklymeeting-${localStorage.getItem("SupervisorPortalId")}`,
      meetingName: meetingTitle,
      selectedDate: formattedDate,
      startTime,
      endTime,
      meetingStatus: "Scheduled",
      supervisor: {
        supervisorId: localStorage.getItem("SupervisorPortalId"),
        supervisorName: localStorage.getItem("SupervisorPortalName"),
        supervisorEmail: "arthi.blackstoneinfomatics@gmail.com",
        supervisorRole: "SUPERVISOR",
      },
      teacher: selectedTeachers.map((teacherName) => {
        const teacherDetails = teachers.find((t) => t.name === teacherName);
        return {
          teacherId: teacherDetails?.id ?? "UNKNOWN_ID",
          teacherName: teacherName,
          teacherEmail: teacherDetails?.email ?? "no-email@example.com",
          _id: teacherDetails?.id,
        };
      }),
      description,
      status: "Active",
      createdDate,
      createdBy: localStorage.getItem("SupervisorPortalName"),
    };

    console.log(requestData);

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("SupervisorAuthToken")
          : null;

      if (!token) {
        console.error("❌ SupervisorAuthToken not found");
        return;
      }
      const response = await axios.post(
        "https://api.blackstoneinfomaticstech.com/addMeeting",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 400
      ) {
        setIsMeetingModalOpen(false);

        setTimeout(() => {
          setIsSuccessMessageVisible(true);
          // Reset form fields after successful submission
          setMeetingTitle("");
          setSelectedDates(null);
          setStartTime("");
          setEndTime("");
          setSelectedTeachers([]);
          setDescription("");
        }, 2000);
      }
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      setIsMeetingModalOpen(false);

      setTimeout(() => {
        setIsSuccessMessageVisible(true);
        setMeetingTitle("");
        setSelectedDates(null);
        setStartTime("");
        setEndTime("");
        setSelectedTeachers([]);
        setDescription("");
      }, 2000);
    }
    setIsSuccessMessageVisible(false);
  };
  const getMeetingStatusClass = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "text-white bg-[#576CBC]";
      case "Reschedule":
        return "text-blue-600 border-blue-600 bg-blue-100";
      default:
        return "text-orange-600 border-orange-600 bg-orange-100";
    }
  };

  const getMeetingStatusLabel = (status: string, startTime: string) => {
    if (status === "Scheduled") return startTime;
    if (status === "Reschedule") return "Rescheduled";
    return "Started";
  };

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
                        Showing {currentApplicants.length} Of 50
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
                          MeetingId
                        </th>
                        <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0] w-[250px] break-words whitespace-normal">
                          MeetingName
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
                          ScheduleTime
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
                            {activeTab === "upcoming" ? (
                              <span
                                className={`text-[10px] font-semibold px-3 py-1 rounded-full ${getMeetingStatusClass(
                                  item.meetingStatus
                                )}`}
                              >
                                {getMeetingStatusLabel(
                                  item.meetingStatus,
                                  item.startTime
                                )}
                              </span>
                            ) : (
                              <button
                                className={`text-[10px] font-semibold px-3 py-1 rounded-full ${
                                  item.startTime === "Re-Schedule Requested"
                                    ? "bg-[#79d67a36] text-[#2a642b] border border-[#2a642b]"
                                    : "bg-[#1c355739] text-[#1C3557] border border-[#1C3557]"
                                }`}
                                onClick={() => {
                                  if (
                                    item.startTime === "Re-Schedule Requested"
                                  ) {
                                    setIsRescheduleModalOpen(true);
                                    setSelectedItemId(item._id);
                                  }
                                }}
                              >
                                {item.startTime}
                              </button>
                            )}
                          </td>
                          <td className="px-3 py-2 text-left w-[80px] break-words whitespace-normal">
                            <div className="relative">
                              <button
                                onClick={() => handleOptionsClick(item._id)}
                                className="p-2 rounded-md"
                              >
                                <MoreVertical className="w-4 h-4 text-slate-600 dark:text-[#FDFDFD]" />
                              </button>
                              {isDetailsModalOpen &&
                                selectedItemId === item._id && (
                                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                                    <button
                                      onClick={() => {
                                        setIsRescheduleModalOpen(true);
                                        setSelectedItemId(item._id);
                                      }}
                                      className="block w-full px-4 py-2 text-left text-[12px] text-slate-600"
                                    >
                                      Request
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
            {/* Date Input */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 dark:text-[#D6D6D6]">
                Date Range
              </label>

              <div className="flex gap-4 flex-col sm:flex-row">
                {/* From Date */}
                <div className="relative w-full" ref={fromWrapperRef}>
                  <DatePicker
                    selected={fromDate}
                    onChange={(date) => setFromDate(date)}
                    selectsStart
                    startDate={fromDate}
                    endDate={toDate}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="From Date"
                    className="w-full border rounded-md p-2 pr-8 text-[12px]  dark:bg-[#343434] dark:text-[#D6D6D6] dark:border-[#565656]"
                  />
                  <div
                    className="absolute inset-y-0 ml-40 flex items-center text-[#666E83] dark:text-[#fff] cursor-pointer dark:opacity-[60%]"
                    onClick={focusFromInput}
                  >
                    <FiCalendar size={16} />
                  </div>
                </div>

                {/* To Date */}
                <div className="relative w-full" ref={toWrapperRef}>
                  <DatePicker
                    selected={toDate}
                    onChange={(date) => setToDate(date)}
                    selectsEnd
                    startDate={fromDate}
                    endDate={toDate}
                    minDate={fromDate || undefined}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="To Date"
                    className="w-full border rounded-md p-2 pr-8 ml-[15px] dark:border-[#565656] text-[12px] dark:bg-[#343434] dark:text-[#D6D6D6]"
                  />
                  <div
                    className="absolute inset-y-0 ml-48 flex items-center text-[#666E83] dark:text-[#fff] dark:opacity-[60%] cursor-pointer"
                    onClick={focusToInput}
                  >
                    <FiCalendar size={16} />
                  </div>
                </div>
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

      {isMeetingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 ">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[390px] relative">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold text-[#1C3557]">
                Add Meeting
              </h2>
              <div className="flex space-x-2">
                {colorOptions.map((option) => (
                  <label
                    key={option.color}
                    className="flex items-center cursor-pointer"
                    title={colorTitles[option.color] || option.color} // Shows title based on color
                  >
                    <input
                      type="radio"
                      name="meetingColor"
                      value={option.color}
                      checked={selectedColor === option.color}
                      onChange={() => setSelectedColor(option.color)}
                      className="hidden"
                    />
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center`}
                      style={{ borderColor: option.hex }}
                    >
                      {selectedColor === option.color && (
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: option.hex }}
                        ></span>
                      )}
                    </span>
                  </label>
                ))}
              </div>

              <button
                onClick={() => setIsMeetingModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoMdClose size={20} />
              </button>
            </div>

            {/* Meeting Title */}
            <input
              type="text"
              className="w-full border rounded-xl p-2 mt-3 focus:outline-none focus:ring-2 focus:ring-[#1C3557]"
              placeholder="Meeting Title"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
            />

            {/* Date Picker */}
            <div className="flex items-center border rounded-xl p-2 mt-6">
              <input
                type="date"
                className="w-full text-gray-600 focus:outline-none"
                value={
                  selectedDates ? selectedDates.toISOString().split("T")[0] : ""
                }
                onChange={(e) => setSelectedDates(new Date(e.target.value))}
              />
            </div>

            {/* Time Pickers */}
            <div className="flex items-center gap-2 mt-4">
              <div>
                <label
                  htmlFor="sajibaiu"
                  className="block text-gray-700 text-sm"
                >
                  Start Time
                </label>
                <input
                  type="time"
                  className="border rounded-lg p-2 w-full"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="sajibaiu"
                  className="block text-gray-700 text-sm"
                >
                  End Time
                </label>
                <input
                  type="time"
                  className="border rounded-lg p-2 w-full"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            {/* Add Teachers Button */}

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
                    {filteredTeachers.map((teacher, index) => (
                      <div
                        key={`${teacher.name}-${index}`}
                        className="flex items-center justify-between p-2 border-b last:border-none"
                      >
                        <div className="flex items-center space-x-2">
                          <FaUserCircle className="text-[#1C3557]" size={20} />
                          <span className="text-gray-700 text-sm">
                            {teacher.name}
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          className="h-5 w-5 text-[#1C3557] border-gray-300 rounded focus:ring-[#1C3557]"
                          checked={selectedTeachers.includes(teacher.name)}
                          onChange={() => toggleSelections(teacher.name)}
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
                  key={teacher}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm"
                >
                  {teacher}
                </span>
              ))}
              {/* <button className="text-[#1C3557] border border-[#1C3557] rounded-full p-1">
                 <FaPlus size={12} />
               </button> */}
            </div>

            {/* Description */}
            <textarea
              className="w-full border rounded-xl p-2 mt-3 focus:outline-none focus:ring-2 focus:ring-[#1C3557]"
              placeholder="Add Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            {isSuccessMessageVisible && (
              <div className="fixed  flex items-center bg-[#dde0dd] border border-[#cdcfcd] text-[#191919] px-6 py-3 rounded-lg shadow-lg">
                {/* Green Check Icon */}
                <div className="w-8 h-8 flex items-center justify-center bg-[#4CAF50] rounded-full">
                  <span className="text-white text-xl">✔</span>
                </div>

                {/* Success Message */}
                <span className="ml-3 font-medium">Scheduled successfully</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button
                className="w-[45%] border border-gray-400 text-gray-700 py-2 rounded-md hover:bg-gray-100"
                onClick={() => setIsMeetingModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="w-[45%] bg-[#1C3557] text-white py-2 rounded-md hover:bg-[#15294a]"
                onClick={handleScheduleMeeting1}
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </BaseLayout3>
  );
};

export default ScheduledClasses;
