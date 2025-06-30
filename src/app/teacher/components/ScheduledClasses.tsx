"use client";

import React, { useEffect, useState } from "react";
import { MdTune } from "react-icons/md";
import { Search } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination"; // use same pagination as TrailManagement

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
  const [filteredClasses, setFilteredClasses] = useState<ClassData[]>([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [upcomingClasses, setUpcomingClasses] = useState<ClassData[]>([]);
  const [completedData, setCompletedData] = useState<ClassData[]>([]);

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

        const upcoming = classes.filter((cls) => {
          const classDate = new Date(cls.startDate);
          const timeString = cls.startTime[0] ?? "";
          const [h, m] = timeString.split(":").map(Number);
          classDate.setHours(h, m, 0, 0);
          return now < classDate;
        });

        const completed = classes.filter((cls) => {
          const classDate = new Date(cls.startDate);
          const timeString = cls.startTime[0] ?? "";
          const [h, m] = timeString.split(":").map(Number);
          classDate.setHours(h, m, 0, 0);
          return now >= classDate;
        });

        setUpcomingClasses(upcoming);
        setCompletedData(completed);
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };
    fetchClasses();
  }, []);

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
      const fullName = `${item.student.studentFirstName} ${item.student.studentLastName}`.toLowerCase();
      return (
        item.student.studentId?.toLowerCase().includes(query.toLowerCase()) ||
        fullName.includes(query.toLowerCase()) ||
        item.student.studentEmail?.toLowerCase().includes(query.toLowerCase()) ||
        item.student.course?.toLowerCase().includes(query.toLowerCase())
      );
    });
    setFilteredClasses(filtered);
    setCurrentPage(1);
  };

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
              <div className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer">
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
            <table className="table-auto w-full" style={{ tableLayout: "fixed" }}>
              <thead className="text-[12px] bg-[#4C6993] text-white">
                <tr className="font-medium">
                  <th className="text-left px-4 py-3">Meeting ID</th>
                  <th className="text-left px-4 py-3">Student Name</th>
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
                    <td className="px-3 py-2 text-[#3D8FDE] font-medium">
                      {item._id}
                    </td>
                    <td className="px-3 py-2">
                      {item.student.studentFirstName} {item.student.studentLastName}
                    </td>
                    <td className="px-3 py-2">
                      {new Date(item.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-3 py-2">{item.startTime[0]}</td>
                    <td className="px-3 py-2">{item.status}</td>
                    <td className="px-3 py-2">-</td>
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
    </div>
  );
};

export default ScheduledClasses;
