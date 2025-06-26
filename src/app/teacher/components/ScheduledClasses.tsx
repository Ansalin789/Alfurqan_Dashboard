"use client";

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { useRouter } from "next/navigation";
import { MdTune } from "react-icons/md";
import { Search } from "lucide-react";
import Modal from "react-modal";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filteredClasses, setFilteredClasses] = useState<ClassData[]>([]);
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
        const teacherId =
          typeof window !== "undefined"
            ? localStorage.getItem("TeacherPortalId")
            : null;
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("TeacherAuthToken")
            : null;

        if (!token) {
          console.error("❌ TeacherAuthToken not found");
          return;
        }
        if (!teacherId || !token) {
          console.log("Missing studentId or authToken");
          return;
        }

        const response = await axios.get<ApiResponse>(
          "https://api.blackstoneinfomaticstech.com/classShedule/teacher",
          {
            params: { teacherId },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const FilterModal = ({
          isOpen,
          onClose,
          onApplyFilters,
          classes,
        }: {
          isOpen: boolean;
          onClose: () => void;
          onApplyFilters: (filters: {
            country: string;
            course: string;
            teacher: string;
            status: string;
          }) => void;
          classes: ClassData[];
        }) => {
          const [filters, setFilters] = useState({
            country: "",
            course: "",
            teacher: "",
            status: "",
          });

          const uniqueCountries = Array.from(
            new Set(classes.map((c) => c.student.country))
          );
          const uniqueCourses = Array.from(
            new Set(classes.map((c) => c.student.course))
          );
          const uniqueTeachers = Array.from(
            new Set(classes.map((c) => c.teacher.teacherName))
          );

          const handleApply = () => {
            onApplyFilters(filters);
            onClose();
          };

          const handleReset = () => {
            setFilters({ country: "", course: "", teacher: "", status: "" });
          };

          return (
            <Modal
              isOpen={isOpen}
              onRequestClose={onClose}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  p-8 rounded-lg  w-[500px]"
              overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
              <div className="bg-white p-6 rounded-lg w-[320px] relative dark:bg-[#252525]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
                    Filter by
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 text-xl absolute top-4 right-4"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Country */}
                  <select
                    value={filters.country}
                    onChange={(e) =>
                      setFilters({ ...filters, country: e.target.value })
                    }
                  >
                    <option value="">Select Country</option>
                    {uniqueCountries.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>

                  {/* Course */}
                  <select
                    value={filters.course}
                    onChange={(e) =>
                      setFilters({ ...filters, course: e.target.value })
                    }
                  >
                    <option value="">Select Course</option>
                    {uniqueCourses.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>

                  {/* Teacher */}
                  <select
                    value={filters.teacher}
                    onChange={(e) =>
                      setFilters({ ...filters, teacher: e.target.value })
                    }
                  >
                    <option value="">Select Teacher</option>
                    {uniqueTeachers.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>

                  {/* Status */}
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                  >
                    <option value="">Select Status</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Re-Schedule Requested">
                      Re-Schedule Requested
                    </option>
                  </select>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleReset}
                      className="w-full border border-[#576CBC] text-[#576CBC] rounded-md text-sm"
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleApply}
                      className="w-full bg-[#576CBC] text-white rounded-md text-sm"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </Modal>
          );
        };

        const classes = response.data.classSchedule;

        const now = new Date();
        const upcoming = classes.filter((cls) => {
          const classDate = new Date(cls.startDate);
          const timeString = cls.startTime[0] ?? "";
          const [startHours, startMinutes] = timeString.split(":").map(Number);
          classDate.setHours(startHours, startMinutes, 0, 0);
          return now < classDate;
        });

        const completed = classes.filter(
          (cls) => new Date(cls.startDate) <= now
        );
        console.log(upcoming);
        console.log(completed);
        setUpcomingClasses(upcoming);
        setCompletedData(completed);
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };
    fetchClasses();
  }, []);
  useEffect(() => {
    setFilteredClasses(dataToShow); // Initially show all
  }, [upcomingClasses, completedData, activeTab]);
  const dataToShow = activeTab === "upcoming" ? upcomingClasses : completedData;
  const currentView = filteredClasses; // filtered instead of raw

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
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const source = activeTab === "upcoming" ? upcomingClasses : completedData;

    const filtered = source.filter((item) => {
      const fullName =
        `${item.student.studentFirstName} ${item.student.studentLastName}`.toLowerCase();
      return (
        item.student.studentId?.toLowerCase().includes(query.toLowerCase()) ||
        fullName.includes(query.toLowerCase()) ||
        item.student.studentEmail
          ?.toLowerCase()
          .includes(query.toLowerCase()) ||
        item.student.course?.toLowerCase().includes(query.toLowerCase())
      );
    });

    setFilteredClasses(filtered);
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
        {/* Tabs */}
        <div className="flex space-x-6 px-4 py-2">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`relative pb-2 ${
              activeTab === "upcoming"
                ? "text-[#576CBC] font-semibold"
                : "text-gray-600 dark:text-[#ffffff]"
            }`}
          >
            Upcoming
            {activeTab === "upcoming" && (
              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-[80px] h-[2px] bg-[#576CBC] rounded-full"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`relative pb-2 ${
              activeTab === "completed"
                ? "text-[#576CBC] font-semibold"
                : "text-gray-600 dark:text-[#ffffff]"
            }`}
          >
            Completed
            {activeTab === "completed" && (
              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-[80px] h-[2px] bg-[#576CBC] rounded-full"></span>
            )}
          </button>
        </div>

        {/* Search + Filter Bar */}
        <div className="flex justify-between items-center px-4 mt-4 bg-[#FAFAFB] dark:bg-[#1F1F1F] py-2 rounded-md border dark:border-[#444]">
  {/* Search Field */}
  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
    <Search className="w-4 h-4" />
    <input
      type="text"
      placeholder="Search by keyword"
      value={searchQuery}
      onChange={(e) => handleSearch(e.target.value)}
      className="outline-none bg-transparent text-sm placeholder-gray-400 dark:placeholder-gray-500 w-48"
    />
  </div>

  {/* Filter Button */}
  <div
    className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 border-l border-r border-gray-300 dark:border-[#444] px-4 py-1 cursor-pointer select-none"
    onClick={() => setIsFilterModalOpen(true)}
  >
    <MdTune className="w-4 h-4" />
    <span>Filter</span>
    <span className="text-[10px]">&#9662;</span> {/* Down caret ▼ */}
  </div>

  {/* Showing Count */}
  <div className="text-[12px] text-gray-500 dark:text-gray-400 whitespace-nowrap border-l border-gray-300 dark:border-[#444] px-4">
    Showing {currentItems.length} of {filteredClasses.length}
  </div>
</div>


        {/* Table */}
        <div className="w-full h-full mt-4">
          <div className="w-full h-[588px] bg-[#FAFAFB] rounded-lg dark:bg-[#343434] overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                <tr>
                  {["Id", "Name", "Courses", "Date", "Status", "Action"].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-3 py-2 text-left font-medium border border-[#4C6993] dark:border-[#6087C0] break-words"
                      >
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
                    className={`text-[12px] ${
                      index % 2 === 0
                        ? "bg-[#fff] dark:bg-[#2C2C2C]"
                        : "bg-[#F8F8F8] dark:bg-[#303030]"
                    }`}
                  >
                    <td className="px-3 py-2 text-[11px] break-words">
                      {item._id}
                    </td>
                    <td className="px-3 py-2 text-[11px] break-words">
                      {item.student.studentFirstName}
                    </td>
                    <td className="px-3 py-2 text-[11px] break-words">
                      {item.student.course ?? "Quran"}
                    </td>
                    <td className="px-3 py-2 text-[11px] break-words">
                      {new Date(
                        item?.startDate ?? "2022-01-01"
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 text-[11px] break-words">
                      {activeTab === "completed" ? (
                        <span className="px-2 py-[3px] rounded-md bg-[#ECFDF3] text-[#377E36] text-[10px]">
                          {item.status}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleStatusClick(item.status)}
                          className={`px-2 py-[3px] rounded-md text-[10px] ${
                            item.status === "Re-Schedule Requested"
                              ? "bg-[#FDF6EC] text-[#F0AD4E] border border-[#F0AD4E]"
                              : "bg-[#FDECEC] text-[#D34645] border border-[#D34645]"
                          }`}
                        >
                          {item.status}
                        </button>
                      )}
                    </td>
                    <td className="px-3 py-2 text-[11px]">
                      {activeTab === "upcoming" && (
                        <div className="relative">
                          <button
                            className="text-xl"
                            onClick={() => handleOptionsClick(Number(item._id))}
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
                                  onClick={() => setSelectedItemId(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-between items-center px-4">
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
                <img src="/assets/images/success.png" alt="success" />
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
