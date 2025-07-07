// updated
"use client";

import React, { useEffect, useState } from "react";
import { MdTune } from "react-icons/md";
import { MoreVertical, Search } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";
import Modal from "react-modal";
import { FaEye } from "react-icons/fa";

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

interface Course {
  courseName: string;
  courseId: string;
}

interface ClassData {
  course: Course;
  student: Student;
  teacher: Teacher;
  _id: string;
  classDay: string[];
  package: string;
  coruse: string;
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
  const [filteredClasses, setFilteredClasses] = useState<ClassData[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    courseName: "",
    teacher: "",
    scheduleStatus: "",
    studentName: "",
    fromDate: "",
    toDate: "",
  });

  const itemsPerPage = 10;
  const [upcomingClasses, setUpcomingClasses] = useState<ClassData[]>([]);
  const [completedData, setCompletedData] = useState<ClassData[]>([]);

  useEffect(() => {
    Modal.setAppElement("body");
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const teacherId = localStorage.getItem("TeacherPortalId");
        const token = localStorage.getItem("TeacherAuthToken");
        if (!token || !teacherId) return;

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

        const classes = response.data.classSchedule;
        const now = new Date();
        console.log("Fetched classes:", classes);
        const upcoming = classes.filter((cls) =>
          ["Scheduled", "Rescheduled"].includes(cls.scheduleStatus)
        );

        const completed = classes.filter(
          (cls) => cls.scheduleStatus === "Completed"
        );

        setUpcomingClasses(upcoming);
        setCompletedData(completed);
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };
    fetchClasses();
  }, []);
  const handleRescheduleRedirect = (id: string) => {
    alert(`Reschedule for ${id}`);
    setOpenDropdownId(null);
    router.push(`/teacher/ui/teacherreschedule`);
  };
  const dataToShow: ClassData[] =
    activeTab === "upcoming" ? upcomingClasses : completedData;

  useEffect(() => {
    setFilteredClasses(dataToShow);
    setSearchQuery("");
    setCurrentPage(1);
  }, [activeTab, upcomingClasses, completedData]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = dataToShow.filter((item) => {
      const fullName =
        `${item.student.studentFirstName} ${item.student.studentLastName}`.toLowerCase();
      return (
        item._id.toLowerCase().includes(query.toLowerCase()) ||
        fullName.includes(query.toLowerCase()) ||
        item.student.studentEmail
          ?.toLowerCase()
          .includes(query.toLowerCase()) ||
        item.student.course?.toLowerCase().includes(query.toLowerCase()) ||
        item.scheduleStatus?.toLowerCase().includes(query.toLowerCase()) ||
        item.teacher.teacherName?.toLowerCase().includes(query.toLowerCase())
      );
    });
    setFilteredClasses(filtered);
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    const latestDataToShow =
      activeTab === "upcoming" ? upcomingClasses : completedData;
    let filtered = [...latestDataToShow];

    if (filters.courseName) {
      filtered = filtered.filter((c) =>
        c.course?.courseName
          ?.toLowerCase()
          .includes(filters.courseName.toLowerCase())
      );
    }

    if (filters.teacher) {
      filtered = filtered.filter((c) =>
        c.teacher.teacherName
          ?.toLowerCase()
          .includes(filters.teacher.toLowerCase())
      );
    }
    if (filters.scheduleStatus) {
      filtered = filtered.filter(
        (c) =>
          c.scheduleStatus?.toLowerCase() ===
          filters.scheduleStatus.toLowerCase()
      );
    }
    if (filters.studentName) {
      filtered = filtered.filter((c) => {
        const fullName =
          `${c.student.studentFirstName} ${c.student.studentLastName}`.toLowerCase();
        return fullName.includes(filters.studentName.toLowerCase());
      });
    }
    if (filters.fromDate && filters.toDate) {
      const from = new Date(filters.fromDate);
      const to = new Date(filters.toDate);
      filtered = filtered.filter((c) => {
        const date = new Date(c.startDate);
        return date >= from && date <= to;
      });
    }
    setFilteredClasses(filtered);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      courseName: "",
      teacher: "",
      scheduleStatus: "",
      studentName: "",
      fromDate: "",
      toDate: "",
    });
    const latestDataToShow =
      activeTab === "upcoming" ? upcomingClasses : completedData;
    setFilteredClasses(latestDataToShow);
    setIsFilterModalOpen(true);
  };

  const studentNames = Array.from(
    new Set(
      dataToShow.map(
        (c) => `${c.student.studentFirstName} ${c.student.studentLastName}`
      )
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClasses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);

  return (
    <div className="md:p-0 mt-4 mx-auto">
      <div className="h-full w-full flex flex-col justify-between">
        <div className="p-0 justify-between flex flex-col">
          <div className="flex space-x-6 px-4 py-2 rounded-md">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`relative text-[14px] transition font-medium ${
                activeTab === "upcoming"
                  ? "text-[#576CBC] font-semibold"
                  : "text-[#0A0A12] dark:text-[#fff] opacity-80"
              }`}
            >
              Scheduled ({upcomingClasses.length})
              {activeTab === "upcoming" && (
                <span className="absolute left-0 ml-5 -bottom-1 w-[60px] h-[2px] rounded-full bg-[#576CBC]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`relative text-[14px] transition font-medium ${
                activeTab === "completed"
                  ? "text-[#576CBC] font-semibold"
                  : "text-[#0A0A12] dark:text-[#fff] opacity-80"
              }`}
            >
              Completed ({completedData.length})
              {activeTab === "completed" && (
                <span className="absolute left-0 ml-5 -bottom-1 w-[60px] h-[2px] rounded-full bg-[#576CBC]" />
              )}
            </button>
          </div>

          <div className="mt-2">
            <div className="w-full bg-[#FAFAFB] dark:bg-[#343434] rounded-t-lg flex justify-between items-center px-4 py-0">
              <div className="flex justify-between items-center px-4 py-0">
                <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by keyword"
                  className="bg-transparent outline-none text-[15px] w-52 py-3"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <div
                onClick={() => setIsFilterModalOpen(true)}
                className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
              >
                <MdTune className="w-4 h-4" />
                <span>Filter</span>
              </div>
              <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                <span className="text-left -ml-60">
                  Showing {currentItems.length} Of {filteredClasses.length}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full h-[610px] bg-[#FAFAFB] dark:bg-[#343434] overflow-y-auto">
            <table
              className="table-auto w-full"
              style={{ tableLayout: "fixed" }}
            >
              <thead className="text-[12px] bg-[#4C6993] text-white">
                <tr className="font-medium">
                  <th className="text-left px-4 py-3">Class ID</th>
                  <th className="text-left px-4 py-3">Student Name</th>
                  <th className="text-left px-4 py-3">Course</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Timing</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Action</th>
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
                    <td className="px-3 py-2 text-left w-[180px] break-words whitespace-normal">
                      {item.student.studentFirstName}
                      {item.student.studentLastName}
                    </td>
                    <td className="px-3 py-2 text-left w-[180px] break-words whitespace-normal">
                      {item.course?.courseName ?? "N/A"}
                    </td>
                    <td className="px-3 py-2 text-left w-[180px] break-words whitespace-normal">
                      {new Date(item.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-3 py-2 text-left w-[180px] break-words whitespace-normal">
                      {item.startTime[0]}
                    </td>
                    <td className="px-3 py-2 text-[#010E30E5] dark:text-[#FDFDFD] text-[11px] w-[180px] break-words whitespace-normal">
                      <span
                        className={`px-2 text-[10px] text-center py-[3px] rounded-md ${
                          item.scheduleStatus === "Scheduled"
                            ? "bg-[#ECFDF3] text-[#377E36] dark:bg-[#377E3633]"
                            : item.scheduleStatus === "Rescheduled"
                            ? "bg-[#E4E4E4] text-[#343E59] dark:bg-[#DEDEDE]/20 dark:text-[#DEDEDE]"
                            : ""
                        }`}
                      >
                        {(item.scheduleStatus || "UNKNOWN").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-3 py-2 relative ">
                      {item.scheduleStatus === "Scheduled" ||
                      item.scheduleStatus === "Rescheduled" ? (
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() =>
                              setOpenDropdownId(
                                openDropdownId === item._id ? null : item._id
                              )
                            }
                            className="p-2 rounded-md"
                          >
                            <MoreVertical className="w-4 h-4 text-slate-600 dark:text-white" />
                          </button>

                          {openDropdownId === item._id && (
                            <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-[#2C2C2C] shadow-lg ring-1 ring-black ring-opacity-5">
                              <div className="py-1 text-sm text-gray-700 dark:text-white">
                                <button
                                  onClick={() => {
                                    handleRescheduleRedirect(item._id);
                                  }}
                                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-[#404040]"
                                >
                                  Reschedule
                                </button>
                                <button
                                  onClick={() => setOpenDropdownId(null)}
                                  className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-[#404040]"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <FaEye className="w-4 h-4 text-slate-600 dark:text-white" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onRequestClose={() => setIsFilterModalOpen(false)}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-xl bg-white  dark:bg-[#343434] w-[650px] "
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-40"
      >
        <div>
          <h2 className="text-[16px] font-semibold mb-6 text-[#2D2D2D] dark:text-white">
            Filter by
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-[#444] dark:text-white mb-1 block">
                Student
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm dark:bg-[#343434] dark:text-white dark:border-[#5C5C5C]"
                value={filters.studentName}
                onChange={(e) =>
                  setFilters({ ...filters, studentName: e.target.value })
                }
              >
                <option value="">Select Student</option>
                {studentNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-[#444] dark:text-white mb-1 block">
                Course
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm dark:bg-[#343434] dark:text-white dark:border-[#5C5C5C]"
                value={filters.courseName}
                onChange={(e) =>
                  setFilters({ ...filters, courseName: e.target.value })
                }
              >
                <option value="">Select Course</option>
                <option value="Quran">Quran</option>
                <option value="Arabic">Arabic</option>
                <option value="Tajweed">Tajweed</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-[#444] dark:text-white mb-1 block">
                From Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg text-sm 
               text-black dark:text-white 
               bg-white dark:bg-[#343434] 
               border-gray-300 dark:border-[#5C5C5C]
               [&::-webkit-calendar-picker-indicator]:dark:invert"
                value={filters.fromDate}
                onChange={(e) =>
                  setFilters({ ...filters, fromDate: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#444] dark:text-white mb-1 block">
                To Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg text-sm 
               text-black dark:text-white 
               bg-white dark:bg-[#343434] 
               border-gray-300 dark:border-[#5C5C5C]
               [&::-webkit-calendar-picker-indicator]:dark:invert"
                value={filters.toDate}
                onChange={(e) =>
                  setFilters({ ...filters, toDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#444] dark:text-white mb-1 block">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm dark:bg-[#343434] dark:text-white dark:border-[#5C5C5C]"
                value={filters.scheduleStatus}
                onChange={(e) =>
                  setFilters({ ...filters, scheduleStatus: e.target.value })
                }
              >
                <option value="">Select Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Rescheduled">Rescheduled</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handleResetFilters}
              className="px-5 py-2 border border-[#576CBC] text-[#576CBC] bg-white rounded-lg text-sm font-medium hover:bg-[#f6f8ff]"
            >
              Reset
            </button>
            <button
              onClick={() => {
                handleApplyFilters();
                setIsFilterModalOpen(false);
              }}
              className="px-5 py-2 bg-[#576CBC] text-white rounded-lg text-sm font-medium hover:bg-[#475ab1]"
            >
              Show {filteredClasses.length} results
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ScheduledClasses;
