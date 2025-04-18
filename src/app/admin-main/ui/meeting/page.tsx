"use client";

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdArrowDropdownCircle } from "react-icons/io";

import { FaCalendarAlt, FaEdit, FaFilter, FaPlus } from "react-icons/fa";
import BaseLayout4 from "@/components/BaseLayout4";
import { useRouter } from "next/navigation";

const dummyData = [
  {
    _id: "1",
    meetingName: "Math Class",
    teacher: [{ teacherName: "Mr. Smith" }],
    selectedDate: new Date(),
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    meetingStatus: "Completed",
  },
  {
    _id: "2",
    meetingName: "Science Class",
    teacher: [{ teacherName: "Ms. John" }],
    selectedDate: new Date(),
    startTime: "11.00 AM",
    endTime: "12:00 AM",
    meetingStatus: "Scheduled",
  },
  {
    _id: "3",
    meetingName: "Science Class",
    teacher: [{ teacherName: "Ms. Johnson" }],
    selectedDate: new Date(),
    startTime: "12.30 PM",
    endTime: "02:00 PM",
    meetingStatus: "Scheduled",
  },
  {
    _id: "4",
    meetingName: "History Class",
    teacher: [{ teacherName: "Mr. Brown" }],
    selectedDate: new Date(),
    startTime: "03.00 AM",
    endTime: "1:00 PM",
    meetingStatus: "Completed",
  },
  {
    _id: "5",
    meetingName: "Tamil Class",
    teacher: [{ teacherName: "Mr. Red" }],
    selectedDate: new Date(), // Update as needed
    startTime: "04.00 PM", // New rescheduled time
    endTime: "05.30 PM", // New rescheduled time
    meetingStatus: "Rescheduled",
  },
  {
    _id: "6",
    meetingName: "Maths Class",
    teacher: [{ teacherName: "Mr. White" }],
    selectedDate: new Date(), // Update as needed
    startTime: "04.00 PM", // New rescheduled time
    endTime: "05.30 PM", // New rescheduled time
    meetingStatus: "Scheduled",
  },
  {
    _id: "7",
    meetingName: "Physics Class",
    teacher: [{ teacherName: "Mr. Yellow" }],
    selectedDate: new Date(), // Update as needed
    startTime: "05.00 PM", // New rescheduled time
    endTime: "05.30 PM", // New rescheduled time
    meetingStatus: "Scheduled",
  },
];
const Meeting = () => {
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const router = useRouter();
  const [showAttendeesDropdown, setShowAttendeesDropdown] = useState(false);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [isAutoClose, setIsAutoClose] = useState(false);
  const [allTeachers, setAllTeachers] = useState([
    "Lucas Johnson",
    "Emily Peterson",
    "Hannah White",
    "Oliver Martinez",
    "Isabella Garcia",
    "Ethan Lee",
    "Sophia Wilson",
    "Samantha",
    "Will Jonto",
    "El Byers",
  ]);

  console.log(setAllTeachers);

  useEffect(() => {
    if (isAutoClose) {
      const timer = setTimeout(() => {
        setIsMeetingModalOpen(false);
        setIsAutoClose(false);
      }, 3000); // 3 seconds

      return () => clearTimeout(timer); // cleanup
    }
  }, [isAutoClose]);

  const toggleTeacher = (name: string) => {
    setSelectedTeachers((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const toggleSelectAll = () => {
    if (selectedTeachers.length === allTeachers.length) {
      setSelectedTeachers([]);
    } else {
      setSelectedTeachers(allTeachers);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Optional: fetch new data here
    }
  };

  const upcomingClasses = dummyData.filter(
    (item) =>
      item.meetingStatus === "Scheduled" ||
      item.meetingStatus === "Start" ||
      item.meetingStatus === "Rescheduled"
  );
  const completedData = dummyData.filter(
    (item) => item.meetingStatus === "Completed"
  );

  const dataToShow = activeTab === "upcoming" ? upcomingClasses : completedData;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataToShow.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dataToShow.length / itemsPerPage);

  const handleOptionsClick = (id: string) => {
    setSelectedItemId((prev) => (prev === id ? null : id));
  };

  // Set the expected type for page number
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    console.log("nextPage");
    router.push("/admin-main/ui/meeting/schedule");
  };

  const handleRescheduleSubmit = () => {
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setIsRescheduleModalOpen(false);
    }, 2000); // hides message & closes modal after 3 seconds
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

  const parseDateTime = (date: string | Date, time: string): Date => {
    const dateStr =
      typeof date === "string" ? date : date.toISOString().split("T")[0];
    const normalizedTime = time.replace(".", ":").toUpperCase(); // e.g. "11.00 PM" -> "11:00 PM"
    return new Date(`${dateStr} ${normalizedTime}`);
  };

  const getMeetingStatusLabel = (
    status: string,
    selectedDate: string | Date,
    startTime: string,
    endTime?: string
  ): string => {
    const now = new Date();
    const start = parseDateTime(selectedDate, startTime);
    let end: Date | null = null;

    const normalizedStatus = status.toLowerCase();

    if (endTime) {
      end = parseDateTime(selectedDate, endTime);
      if (end < start) {
        end.setDate(end.getDate() + 1); // handle overnight meetings
      }
    }

    const isToday =
      start.getFullYear() === now.getFullYear() &&
      start.getMonth() === now.getMonth() &&
      start.getDate() === now.getDate();

    if (normalizedStatus === "scheduled" && isToday) {
      const formattedStart = start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      if (end && now >= start && now <= end) {
        return `Start`;
      }
      if (end && now < start) {
        return `Today at (${formattedStart})`;
      }
      if (end && now > end) {
        return "Completed";
      }
    }

    if (normalizedStatus === "scheduled") return "Scheduled";
    if (normalizedStatus === "reschedule" || normalizedStatus === "rescheduled")
      return "Rescheduled";
    if (normalizedStatus === "start") return "Start";
    if (normalizedStatus === "completed") return "Completed";

    return "Started";
  };

  return (
    <BaseLayout4>
      <div className="p-4 mx-auto w-[1250px]">
        <div
          className={`${
            isRescheduleModalOpen ? "blur-sm" : ""
          } transition-all duration-200`}
        >
          <h1 className="text-xl font-semibold text-gray-800 p-2">
            Scheduled Meetings
          </h1>
          <div className="flex items-center justify-between px-6 py-4 rounded-md">
            {/* Left side: Search and Filter */}
            <div className="flex items-center gap-4 -ml-5">
              <input
                type="text"
                placeholder="Search here..."
                className="px-4 py-2 text-sm rounded-md border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-[#1C3557] w-64"
              />
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#1C3557] border border-gray-300 rounded-md shadow hover:bg-gray-50 text-sm">
                <FaFilter /> Filter
              </button>
            </div>

            {/* Right side: Calendar, Add Meeting, Date Picker */}
            <div className="flex items-center gap-4">
              <button onClick={() => nextPage()}>
                <FaCalendarAlt className="text-[#1C3557]" />
              </button>

              <button
                onClick={() => setIsMeetingModalOpen(true)}
                className="flex items-center gap-2 bg-[#1C3557] text-white px-4 py-2 rounded-md shadow hover:bg-[#15294a] text-sm"
              >
                <FaPlus /> Add Meeting
              </button>

              <button
                className="relative"
                onMouseEnter={() => setIsDatePickerOpen(true)}
                onMouseLeave={() => setIsDatePickerOpen(false)}
              >
                <button
                  onClick={() => {
                    if (!selectedDate && !isDatePickerOpen) {
                      setIsDatePickerOpen(true);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow text-sm hover:bg-gray-50"
                >
                  <span>
                    {selectedDate ? selectedDate.toLocaleDateString() : "Date"}
                  </span>
                  <IoMdArrowDropdownCircle className="text-[#1C3557]" />
                </button>

                {isDatePickerOpen && (
                  <div className="absolute right-0 z-10 mt-2">
                    <DatePicker
                      onChange={(date) => {
                        setSelectedDate(date);
                        // Don't close on date select
                      }}
                      inline
                      className="border rounded-lg shadow-lg"
                    />
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-[#1C3557] h-[450px]  overflow-y-scroll scrollbar-none flex flex-col justify-between">
            {/* Tabs */}
            <div>
              <div className="flex p-3">
                <button
                  className={`py-1 px-4 rounded-lg text-sm font-medium  ${
                    activeTab === "upcoming"
                      ? "bg-[#1C3557] text-white"
                      : "bg-transparent text-black"
                  }`}
                  onClick={() => setActiveTab("upcoming")}
                >
                  Scheduled
                </button>
                <button
                  className={`py-1 px-4 rounded-lg  text-sm font-medium ml-4 ${
                    activeTab === "completed"
                      ? "bg-[#1C3557] text-white"
                      : "bg-transparent text-black"
                  }`}
                  onClick={() => setActiveTab("completed")}
                >
                  Completed
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full table-auto bg-[#fff] rounded-lg shadow text-[11px]">
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
                        <th key={header} className="px-1 py-3 text-center ">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, index) => (
                      <tr
                        key={index}
                        className={`text-[12px] font-medium  ${
                          index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                        }`}
                      >
                        <td className="px-2 py-2 text-center text-xs">
                          {item._id}
                        </td>
                        <td className="px-2 py-2 text-center text-xs">
                          {item.meetingName}
                        </td>
                        <td className="px-2 py-2 text-center text-xs">
                          {" "}
                          {item.teacher
                            .map((teacher) => teacher.teacherName)
                            .join(", ")}
                        </td>
                        <td className="px-2 py-2 text-center text-xs">
                          {new Date(item.selectedDate).toISOString()}
                        </td>

                        <td className="px-2 py-[6px] text-center text-[8px] whitespace-nowrap ">
                          {activeTab === "upcoming" ? (
                            
                              <>
                                {(() => {
                                  const label = getMeetingStatusLabel(
                                    item.meetingStatus,
                                    item.selectedDate,
                                    item.startTime,
                                    item.endTime
                                  );

                                  const className = getMeetingStatusClass(
                                    label,
                                    item.meetingStatus
                                  );
                                  const isStarted =
                                    label.toLowerCase() === "start";

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
                                      className={`text-[10px] px-2 py-[7px] rounded-lg inline-block text-center w-[130px] ${className}`}
                                    >
                                      {label}
                                    </span>
                                  );
                                })()}
                              
                            </>
                          ) : (
                            <>
                              {/* Completed Meetings */}
                              <button className="bg-[#79D67B] text-[10px] px-2 py-[7px] rounded-xl inline-block text-center w-[150px]">
                                Completed
                              </button>
                            </>
                          )}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button
                            className="bg-gray-800 hover:cursor-pointer text-center text-white p-[5px] rounded-sm pl-[7px] shadow hover:bg-gray-900"
                            onClick={() => {
                              if (activeTab === "upcoming") {
                                handleOptionsClick(item._id);
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
                              {selectedItemId === item._id && (
                                <div className="absolute bg-white shadow-lg rounded-lg -mt-4 -ml-14">
                                  <div className="py-2 px-2">
                                    <button
                                      className="block text-left px-3 py-1 text-[12px] font-medium text-[#223857] hover:bg-gray-100"
                                      onClick={() => {
                                        setIsRescheduleModalOpen(true);
                                        setSelectedItemId(null);
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
              {/* Header */}
              <h2 className="text-[14px] font-bold text-[#1C3557] mb-6">
                Add Meeting
              </h2>

              {/* Meeting ID */}
              <div className="mb-2">
                <label
                  htmlFor=" meetingID"
                  className="text-xs font-medium text-gray-700"
                >
                  Meeting ID
                </label>
                <input
                  type="text"
                  placeholder=""
                  className="w-full bg-[#f4f4f4] border border-gray-300 rounded-xl p-2 text-xs"
                />
              </div>

              {/* Meeting Title */}
              <div className="mb-2">
                <label
                  htmlFor=" meetingTitle"
                  className="text-xs font-medium text-gray-700"
                >
                  Meeting Title
                </label>
                <input
                  type="text"
                  placeholder="Weekly Meeting"
                  className="w-full bg-[#f4f4f4] border border-gray-300 rounded-xl p-2 text-xs"
                />
              </div>

              {/* Scheduled Date */}
              <div className="mb-2">
                <label
                  htmlFor=" schedule Date"
                  className="text-xs font-medium text-gray-700"
                >
                  Scheduled Date
                </label>
                <div className="flex items-center border border-gray-300 bg-[#f4f4f4] rounded-xl p-2 text-xs">
                  <input
                    type="text"
                    placeholder="11/02/2024"
                    className="w-full bg-transparent text-xs focus:outline-none"
                    readOnly
                  />
                  <span className="text-gray-500">
                    <i className="fas fa-calendar-alt" />
                  </span>
                </div>
              </div>

              {/* Scheduled Time */}
              <div className="mb-2">
                <label
                  htmlFor=" schedule Time"
                  className="text-xs font-medium text-gray-700"
                >
                  Scheduled Time
                </label>
                <div className="flex items-center border border-gray-300 bg-[#f4f4f4] rounded-xl p-2">
                  <input
                    type="text"
                    placeholder="07.30 PM"
                    className="w-full bg-transparent text-xs focus:outline-none"
                    readOnly
                  />
                  <span className="text-gray-500">
                    <i className="fas fa-clock" />
                  </span>
                </div>
              </div>

              {/* Attendees Dropdown */}
              <div className="mb-2 relative">
                <label
                  htmlFor=" attendees"
                  className="text-xs font-medium text-gray-700"
                >
                  Attendees
                </label>
                <button
                  className="flex items-center border border-gray-300 bg-[#f4f4f4] rounded-xl p-2 justify-between cursor-pointer"
                  onClick={() =>
                    setShowAttendeesDropdown(!showAttendeesDropdown)
                  }
                >
                  <span className="text-sm text-gray-600">
                    {selectedTeachers.length > 0
                      ? `${selectedTeachers.length} Selected`
                      : "Select Teachers"}
                  </span>
                  <i
                    className={`fas fa-chevron-${
                      showAttendeesDropdown ? "up" : "down"
                    } text-gray-500`}
                  />
                </button>

                {showAttendeesDropdown && (
                  <div className="absolute bg-white border border-gray-300 rounded-xl shadow-md w-full mt-2 max-h-44 overflow-y-auto z-50 p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-[#1C3557]">
                        Add Teachers
                      </span>
                    </div>

                    {/* Select All */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        Select All
                      </span>
                      <input
                        type="checkbox"
                        checked={selectedTeachers.length === allTeachers.length}
                        onChange={toggleSelectAll}
                        className="h-3 w-3"
                      />
                    </div>

                    {/* Teacher List */}
                    <div className="space-y-3 max-h-32 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300">
                      {allTeachers.map((teacher, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 bg-[#D1D5DB] rounded-full flex items-center justify-center">
                              <i className="fas fa-user text-white text-xs" />
                            </span>
                            <span className="text-xs text-gray-800">
                              {teacher}
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedTeachers.includes(teacher)}
                            onChange={() => toggleTeacher(teacher)}
                            className="h-3 w-3"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Dropdown Actions */}
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => setShowAttendeesDropdown(false)}
                        className="w-[25%] border border-[#1C3557] text-[#1C3557] py-1 rounded-lg hover:bg-gray-100 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setShowAttendeesDropdown(false)}
                        className="w-[25%] bg-[#1C3557] text-white py-1 rounded-lg hover:bg-[#15294a] text-xs"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <label
                  htmlFor=" Description"
                  className="text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  placeholder=""
                  className="w-full bg-[#f4f4f4] border border-gray-300 rounded-xl p-3 mt-1 text-sm h-24 resize-none"
                ></textarea>
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
                  onClick={() => setIsMeetingModalOpen(false)}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-6 w-[460px]">
              <h2 className="text-[14px] font-bold text-[#0F1D40] mb-6">
                Meeting Reschedule
              </h2>

              {showSuccess ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-10">
                  <div className="bg-[#108422] text-white py-6 px-6 rounded-2xl flex items-center justify-center space-x-2 max-w-[380px]">
                    <img
                      src="/assets/images/success.png"
                      alt="success"
                      className="w-5 h-5"
                    />
                    <span>Request Has Been Sent to Admin</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Meeting Title */}
                  <div className="mb-2">
                    <label
                      htmlFor=" meetingTitle"
                      className="text-xs text-[#0F1D40] font-medium block mb-1"
                    >
                      Meeting Title
                    </label>
                    <input
                      type="text"
                      placeholder="Weekly Meeting"
                      className="w-full bg-[#F8F8F8] border border-[#CBD5E1] rounded-lg px-2 py-2 text-xs text-[#94A3B8]"
                    />
                  </div>

                  {/* Scheduled Date */}
                  <div className="mb-2">
                    <label
                      htmlFor="scheduled date"
                      className="text-xs text-[#0F1D40] font-medium block mb-1"
                    >
                      Scheduled Date
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="11/02/2024"
                        readOnly
                        className="w-full bg-[#F8F8F8] border border-[#CBD5E1] rounded-lg px-2 py-2 pr-10 text-xs text-[#0F1D40]"
                      />
                      <i className="fas fa-calendar-alt absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>

                  {/* Scheduled Time */}
                  <div className="mb-2">
                    <label
                      htmlFor=" scedule time"
                      className="text-xs text-[#0F1D40] font-medium block mb-1"
                    >
                      Scheduled Time
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="07.30 PM"
                        readOnly
                        className="w-full bg-[#F8F8F8] border border-[#CBD5E1] rounded-lg px-2 py-2 pr-10 text-xs text-[#0F1D40]"
                      />
                      <i className="fas fa-clock absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>

                  {/* Attendees Dropdown */}
                  <div className="mb-2 relative">
                    <label
                      htmlFor=" attendees"
                      className="text-xs font-medium text-gray-700"
                    >
                      Attendees
                    </label>
                    <button
                      className="flex items-center border border-gray-300 bg-[#f4f4f4] rounded-xl p-2 justify-between cursor-pointer"
                      onClick={() =>
                        setShowAttendeesDropdown(!showAttendeesDropdown)
                      }
                    >
                      <span className="text-sm text-gray-600">
                        {selectedTeachers.length > 0
                          ? `${selectedTeachers.length} Selected`
                          : "Select Teachers"}
                      </span>
                      <i
                        className={`fas fa-chevron-${
                          showAttendeesDropdown ? "up" : "down"
                        } text-gray-500`}
                      />
                    </button>

                    {showAttendeesDropdown && (
                      <div className="absolute bg-white border border-gray-300 rounded-xl shadow-md w-full mt-2 max-h-44 overflow-y-auto z-50 p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-[#1C3557]">
                            Add Teachers
                          </span>
                        </div>

                        {/* Select All */}
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium text-gray-700">
                            Select All
                          </span>
                          <input
                            type="checkbox"
                            checked={
                              selectedTeachers.length === allTeachers.length
                            }
                            onChange={toggleSelectAll}
                            className="h-3 w-3"
                          />
                        </div>

                        {/* Teacher List */}
                        <div className="space-y-3 max-h-32 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300">
                          {allTeachers.map((teacher, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 bg-[#D1D5DB] rounded-full flex items-center justify-center">
                                  <i className="fas fa-user text-white text-xs" />
                                </span>
                                <span className="text-xs text-gray-800">
                                  {teacher}
                                </span>
                              </div>
                              <input
                                type="checkbox"
                                checked={selectedTeachers.includes(teacher)}
                                onChange={() => toggleTeacher(teacher)}
                                className="h-3 w-3"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Dropdown Actions */}
                        <div className="flex justify-between mt-4">
                          <button
                            onClick={() => setShowAttendeesDropdown(false)}
                            className="w-[25%] border border-[#1C3557] text-[#1C3557] py-1 rounded-lg hover:bg-gray-100 text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => setShowAttendeesDropdown(false)}
                            className="w-[25%] bg-[#1C3557] text-white py-1 rounded-lg hover:bg-[#15294a] text-xs"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label
                      htmlFor=" reason"
                      className="text-xs text-[#0F1D40] font-medium block mb-1"
                    >
                      Reason for Reschedule
                    </label>
                    <textarea
                      className="w-full bg-[#F8F8F8] border border-[#CBD5E1] rounded-lg px-2 py-2 text-sm h-28 resize-none text-[#0F1D40]"
                      placeholder="Type here..."
                      value={rescheduleReason}
                      onChange={(e) => setRescheduleReason(e.target.value)}
                    ></textarea>
                  </div>

                  {/* Footer Buttons */}
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => setIsRescheduleModalOpen(false)}
                      className="w-[28%] border border-[#1B2B65] text-[#1B2B65] py-2 rounded-lg hover:bg-gray-100 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRescheduleSubmit}
                      className="w-[28%] bg-[#1B2B65] text-white py-2 rounded-lg hover:bg-[#0f1839] text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-save" /> Reschedule
                    </button>
                  </div>
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
