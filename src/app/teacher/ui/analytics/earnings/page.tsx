"use client";

import TeacherHeader from "@/app/teacher/components/TeacherHeader";
import BaseLayout from "@/components/BaseLayout";
import Pagination from "@/components/Pagination";
import axios from "axios";
import { Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { MdTune } from "react-icons/md";
import { useRouter } from "next/navigation";

interface ClassScheduleResponse {
  totalCount: number;
  classSchedule: Schedule[];
}

interface Schedule {
  _id: string;
  student: {
    studentId: string;
    studentFirstName: string;
    studentLastName: string;
    studentEmail: string;
    gender: string;
  };
  teacher: {
    teacherId: string;
    teacherName: string;
    teacherEmail: string;
  };
  course: {
    courseId: string;
    courseName: string;
  };
  classDay: string[];
  package: string;
  totalHourse: number;
  startDate: string;
  endDate: string;
  startTime: string[]; // ["09:30"]
  endTime: string[];
  scheduleStatus: string;
  classLink: string;
  status: string;
  createdBy: string;
  sessionClassType: string;
  sessionStarttime: string;
  sessionsEndtime: string;
  createdDate: string;
  lastUpdatedDate: string;
  __v: number;
  amount: string;
  sessionStatus: string;
}

const Earnings = () => {
  const [uniqueStudentSchedules, setUniqueStudentSchedules] = useState<
    Schedule[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({
    studentId: "",
    studentName: "",
    courseName: "",
    classType: "",
    scheduleStatus: "",
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    const fetchSchedulesByTeacher = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("TeacherAuthToken")
            : null;
        const teacherIdToFilter = localStorage.getItem("TeacherPortalId");

        if (!token || !teacherIdToFilter) {
          console.error("Missing token or teacher ID");
          return;
        }

        const response = await axios.get<ClassScheduleResponse>(
          `https://api.blackstoneinfomaticstech.com/classShedule/teacher?teacherId=${teacherIdToFilter}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUniqueStudentSchedules(response.data.classSchedule);
      } catch (error) {
        console.error("Error fetching class schedules:", error);
      }
    };

    fetchSchedulesByTeacher();
  }, []);

  const uniqueCourses = Array.from(new Set(uniqueStudentSchedules.map(s => s.course.courseName)));
const uniqueClassTypes = Array.from(new Set(uniqueStudentSchedules.map(s => s.sessionClassType)));
const uniqueStatuses = Array.from(new Set(uniqueStudentSchedules.map(s => s.scheduleStatus)));


const filteredData = uniqueStudentSchedules.filter((row) => {
  const studentFullName = `${row.student.studentFirstName} ${row.student.studentLastName}`.toLowerCase();

  const matchesSearchTerm = studentFullName.includes(searchTerm.toLowerCase());

  const matchesStudentId = filterCriteria.studentId
    ? row.student.studentId.toLowerCase().includes(filterCriteria.studentId.toLowerCase())
    : true;

  const matchesStudentName = filterCriteria.studentName
    ? studentFullName.includes(filterCriteria.studentName.toLowerCase())
    : true;

  const matchesCourseName = filterCriteria.courseName
    ? row.course.courseName === filterCriteria.courseName
    : true;

  const matchesClassType = filterCriteria.classType
    ? row.sessionClassType === filterCriteria.classType
    : true;

  const matchesScheduleStatus = filterCriteria.scheduleStatus
    ? row.scheduleStatus === filterCriteria.scheduleStatus
    : true;

  const matchesFromDate = filterCriteria.fromDate
    ? new Date(row.startDate) >= new Date(filterCriteria.fromDate)
    : true;

  const matchesToDate = filterCriteria.toDate
    ? new Date(row.endDate) <= new Date(filterCriteria.toDate)
    : true;

  return (
    matchesSearchTerm &&
    matchesStudentId &&
    matchesStudentName &&
    matchesCourseName &&
    matchesClassType &&
    matchesScheduleStatus &&
    matchesFromDate &&
    matchesToDate
  );
});


  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilterCriteria((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <BaseLayout>
      <TeacherHeader currentSection="Earnings" showBackButton ={true} showBackPath="/teacher/ui/analytics"/>
      <div className="md:p-0 mx-auto">
        <div className="h-full w-full flex flex-col justify-between">
          <div className="w-full bg-[#FAFAFB] rounded-lg dark:bg-[#343434] mt-6">
            <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434]">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by keyword"
                  className="bg-transparent outline-none text-[15px] w-52 py-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div
                className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
                onClick={() => setIsFilterModalOpen(true)}
              >
                <MdTune className="w-4 h-4" />
                <span>Filter</span>
              </div>

              <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                <span className="text-left -ml-60 ">
                  Showing {currentData.length} of {filteredData.length}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table
                className="table-auto w-full"
                style={{ tableLayout: "fixed" }}
              >
                <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                  <tr className="font-medium">
                    {(
                      [
                        "Student ID",
                        "Name",
                        "Courses",
                        "Course Type",
                        "Course Duration",
                        "Date",
                        "Time",
                        "Amount",
                        "Status",
                      ] as const
                    ).map((header) => (
                      <th
                        key={header}
                        className={`text-left px-4 py-3 border border-[#4C6993] dark:border-[#6087C0] ${
                          header === "Name" ? "" : ""
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="text-[11px]">
                  {currentData.map((row) => {
                    const { student, startTime, endTime } = row;

                    return (
                      <tr
                        key={row._id}
                        className="text-[12px] h-[50px] bg-[#fff] dark:bg-[#2C2C2C]"
                      >
                        <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                          {student.studentId}
                        </td>
                        <td className="px-4 py-2 text-left font-medium text-[#3D8FDE]">
                          {student.studentFirstName}
                        </td>
                        <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                          {row.course.courseName}
                        </td>
                        <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                          {row.sessionClassType}
                        </td>
                        <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                          {row.totalHourse}
                        </td>
                        <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                          {new Date(row.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                          {startTime?.[0]} - {endTime?.[0]}
                        </td>
                        <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                          {row.amount}
                        </td>
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          <span
                            className={`font-semibold px-3 py-1 rounded-md text-[10px] ${
                              row.scheduleStatus === "Scheduled"
                                ? "bg-[#ECFDF3] dark:bg-[#374336] dark:text-[#377E36] text-[#377E36] px-[18px]"
                                : row.scheduleStatus === "Rescheduled"
                                ? "bg-[#E4E4E4] text-[#000] dark:bg-[#555] dark:text-[#fff]"
                                : "bg-[#ECFDF3] dark:bg-[#374336] dark:text-[#377E36] text-[#377E36]"
                            }`}
                          >
                            {row.scheduleStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-[#252525] rounded-lg p-6 w-full max-w-lg relative">
            <button
              aria-label="Close filter"
              onClick={() => setIsFilterModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            <h3 className="text-[16px] font-semibold mb-4">Filter by</h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm block mb-1">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  className="w-full px-3 py-2 text-xs  border dark:border-[#5c5c5c] rounded bg-transparent dark:bg-[#343434]"
                  placeholder="Enter student ID"
                  value={filterCriteria.studentId}
                  onChange={handleFilterChange}
                />
              </div>

              <div>
                <label className="text-sm block mb-1">Student Name</label>
                <input
                  type="text"
                  name="studentName"
                  className="w-full px-3 py-2 text-xs border rounded bg-transparent dark:bg-[#343434] dark:border-[#5c5c5c]"
                  placeholder="Enter student name"
                  value={filterCriteria.studentName}
                  onChange={handleFilterChange}
                />
              </div>

<div>
  <label className="text-sm block mb-1">Course Name</label>
  <select
    name="courseName"
    className="w-full px-3 py-2 text-xs dark:border-[#5c5c5c] border rounded bg-transparent dark:bg-[#343434]"
    value={filterCriteria.courseName}
    onChange={handleFilterChange}
  >
    <option value="">Select Course</option>
    {uniqueCourses.map((course, i) => (
      <option key={i} value={course}>{course}</option>
    ))}
  </select>
</div>

<div>
  <label className="text-sm block mb-1">Class Type</label>
  <select
    name="classType"
    className="w-full px-3 py-2 text-xs dark:border-[#5c5c5c] border rounded bg-transparent dark:bg-[#343434]"
    value={filterCriteria.classType}
    onChange={handleFilterChange}
  >
    <option value="">Select Class Type</option>
    {uniqueClassTypes.map((type, i) => (
      <option key={i} value={type}>{type}</option>
    ))}
  </select>
</div>




              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm block mb-1">From Date</label>
                  <input
                    type="date"
                    name="fromDate"
                    className="w-full dark:bg-[#343434] text-xs dark:border-[#5c5c5c] px-3 py-2 border rounded bg-transparent dark:[color-scheme:dark]"
                    value={filterCriteria.fromDate}
                    onChange={handleFilterChange}
                  />
                </div>
                <div>
                  <label className="text-sm block mb-1">To Date</label>
                  <input
                    type="date"
                    name="toDate"
                    className="w-full dark:bg-[#343434] px-3 py-2 text-xs dark:border-[#5c5c5c] border rounded bg-transparent dark:[color-scheme:dark]"
                    value={filterCriteria.toDate}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>

             <div>
  <label className="text-sm block mb-1">Status</label>
  <select
    name="scheduleStatus"
    className="w-full dark:bg-[#343434] py-2 px-3 text-xs dark:border-[#5c5c5c] border rounded bg-transparent"
    value={filterCriteria.scheduleStatus}
    onChange={handleFilterChange}
  >
    <option value="">Select Status</option>
    {uniqueStatuses.map((status, i) => (
      <option key={i} value={status}>{status}</option>
    ))}
  </select>
</div>
            </div>

            <div className="flex items-center justify-end mt-6">
              <div className="flex items-center gap-3">
                <button
                  className="px-3 py-1 text-[12px] rounded-md border border-[#576CBC] text-[#576CBC] font-medium hover:bg-[#EEF1FF] dark:hover:bg-[#343434]"
                  onClick={() =>
                    setFilterCriteria({
                      studentId: "",
                      studentName: "",
                      courseName: "",
                      classType: "",
                      scheduleStatus: "",
                      fromDate: "",
                      toDate: "",
                    })
                  }
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 text-[12px] rounded-md bg-[#576CBC] text-white font-medium hover:bg-[#455bb1]"
                  onClick={() => {
                    setIsFilterModalOpen(false);
                    setCurrentPage(1);
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </BaseLayout>
  );
};

export default Earnings;
