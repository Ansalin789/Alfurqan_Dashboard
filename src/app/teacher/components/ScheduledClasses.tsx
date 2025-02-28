"use client";

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Student {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  city: string;
  country: string;
  trailId: string;
  course: string;
  classStatus: string;
}

interface Teacher {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
}

interface ClassData {
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
  classSchedule: ClassData[];
}

const ScheduledClasses = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [upcomingClasses, setUpcomingClasses] = useState<ClassData[]>([]);
  const [completedData, setCompletedData] = useState<ClassData[]>([]);
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const teacherId = localStorage.getItem("TeacherPortalId");
        const authToken = localStorage.getItem("TeacherAuthToken");
        if (!teacherId || !authToken) {
          console.log("Missing studentId or authToken");
          return;
        }

        const response = await axios.get<ApiResponse>(
          "http://localhost:5001/classShedule/teacher",
          {
            params: { teacherId },
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        const classes = response.data.classSchedule;

        const now = new Date();
        const upcoming = classes.filter((cls) => {
          const classDate = new Date(cls.startDate);
          const [startHours, startMinutes] = cls.startTime[0]
            .split(":")
            .map(Number);
          classDate.setHours(startHours, startMinutes, 0, 0);
          return now < classDate;
        });

        const completed = classes.filter(
          (cls) => new Date(cls.startDate) <= now
        );

        setUpcomingClasses(upcoming);
        setCompletedData(completed);
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };
    fetchClasses();
  }, []);

  const dataToShow = activeTab === "upcoming" ? upcomingClasses : completedData;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataToShow.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dataToShow.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleOptionsClick = (id: number) => {
    setSelectedItemId(selectedItemId === id ? null : id);
  };

  const handleRescheduleSubmit = () => {
    if (rescheduleReason.trim() && selectedItemId) {
      setShowSuccess(true);
      setUpcomingClasses((prevClasses: ClassData[]) =>
        prevClasses.map((item) =>
          Number(item._id) === selectedItemId // Convert item._id to a number
            ? { ...item, status: "Re-Schedule Requested" }
            : item
        )
      );
    } else {
      alert("Please provide a reason and select a class to reschedule.");
    }

    setTimeout(() => {
      setShowSuccess(false);
      setIsRescheduleModalOpen(false);
      setRescheduleReason("");
    }, 2000);
  };

  const handleStatusClick = (status: string) => {
    if (status.includes("Available")) {
      router.push("/teacher/ui/liveclass");
    }
  };

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setIsDatePickerOpen(false);
      router.push("/teacher/ui/schedule/schedules");
    }
  };

  return (
    <div className="p-4">
      <div
        className={`${
          isRescheduleModalOpen ? "blur-sm" : ""
        } transition-all duration-200`}
      >
        <h1 className="text-2xl font-semibold text-gray-800 p-2">
          Scheduled Classes
        </h1>
        <div className="bg-white rounded-lg border-2 border-[#1C3557] h-[450px] overflow-y-scroll scrollbar-none flex flex-col justify-between">
          {/* Tabs */}
          <div>
            <div className="flex">
              <button
                className={`py-3 px-2 ml-5 ${
                  activeTab === "upcoming"
                    ? "text-[#1C3557] border-b-2 border-[#1C3557] font-semibold"
                    : "text-gray-600"
                } focus:outline-none text-[13px]`}
                onClick={() => setActiveTab("upcoming")}
              >
                Upcoming ({upcomingClasses.length})
              </button>
              <button
                className={`py-3 px-6 ${
                  activeTab === "completed"
                    ? "text-[#1C3557] border-b-2 border-[#1C3557] font-semibold"
                    : "text-gray-600"
                } focus:outline-none text-[13px]`}
                onClick={() => setActiveTab("completed")}
              >
                Completed ({completedData.length})
              </button>
            </div>
            <div className="flex justify-end px-[50px] mt-[2px] h-6 relative">
              <div className="flex items-center border border-[#1C3557] rounded-md overflow-hidden">
                <button
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="flex items-center space-x-2 shadow-lg p-1 rounded-lg text-gray-600 hover:text-gray-800"
                >
                  <span className="text-[14px]">
                    {selectedDate ? selectedDate.toLocaleDateString() : "Date"}
                  </span>
                  <IoMdArrowDropdownCircle />
                </button>
                {isDatePickerOpen && (
                  <div className="absolute right-0 z-10 mt-72">
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateSelect}
                      inline
                      className="border rounded-lg shadow-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="border-b-[1px] border-[#1C3557] text-[12px] font-semibold">
                  <tr>
                    {["Id", "Name", "Courses", "Date", "Status"].map(
                      (header) => (
                        <th key={header} className="px-6 py-3 text-center">
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr
                      key={item._id}
                      className={`text-[12px] font-medium mt-2 ${
                        index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                      }`}
                    >
                      <td className="px-6 py-2 text-center">{item._id}</td>
                      <td className="px-6 py-2 text-center">
                        {item.student.studentFirstName}
                      </td>
                      <td className="px-6 py-2 text-center">
                        {item.student.course ?? "Quran"}
                      </td>
                      <td className="px-6 py-2 text-center">
                        {new Date(
                          item?.startDate ?? "2022-01-01"
                        ).toLocaleDateString()}{" "}
                      </td>
                      <td className="px-6 py-2 text-center">
                        {activeTab === "completed" ? (
                          <span className="text-green-600 border text-[12px] border-green-600 bg-green-100 px-3 py-1 rounded-lg">
                            {item.status}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleStatusClick(item.status)}
                            className={`${
                              item.status === "Re-Schedule Requested"
                                ? "bg-[#79d67a36] text-[#2a642b] border border-[#2a642b] px-3"
                                : "bg-[#1c355739] text-[#1C3557] border border-[#1C3557] px-6"
                            } py-1 rounded-lg`}
                          >
                            {item.status}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-2 text-center">
                        {activeTab === "upcoming" && (
                          <>
                            <button
                              className="text-xl"
                              onClick={() =>
                                handleOptionsClick(Number(item._id))
                              }
                            >
                              ...
                            </button>
                            {selectedItemId === Number(item._id) && (
                              <div className="absolute right-0 mt-1 w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1">
                                  <button
                                    className="block w-full text-left px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-100"
                                    onClick={() => {
                                      setIsRescheduleModalOpen(true);
                                      setSelectedItemId(Number(item._id));
                                    }}
                                  >
                                    Request
                                  </button>
                                  <button
                                    className="block w-full text-left px-4 py-2 text-[12px] text-[#a72222] hover:bg-gray-100"
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
    </div>
  );
};

export default ScheduledClasses;
