"use client";

import TeacherHeader from "@/app/teacher/components/TeacherHeader";
import BaseLayout from "@/components/BaseLayout";
import Pagination from "@/components/Pagination";
import axios from "axios";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { MdTune } from "react-icons/md";

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

  const filteredData = uniqueStudentSchedules.filter((row) =>
    row.student.studentFirstName
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  console.log(currentData);

  return (
    <BaseLayout>
      <TeacherHeader currentSection="Earnings" />
      <div className="md:p-0 mx-auto">
        <div className="h-full w-full  flex flex-col justify-between">
          <div className="w-full bg-[#FAFAFB] rounded-lg dark:bg-[#343434] mt-6">
            <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434]">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by keyword"
                  className="bg-transparent outline-none text-[15px] w-52 py-3 "
                  // value={searchText}
                  // onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <div
                className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
                // onClick={() => setIsFilterModalOpen(true)}
              >
                {/* <BsFilterLeft /> */}
                <MdTune className="w-4 h-4" />
                <span>Filter</span>
              </div>

              <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                <span className="text-left -ml-60 ">
                  {/* Showing {currentItems.length} of {paginatedData.length} */}
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
                    {[
                      "Student ID",
                      "Name",
                      "Courses",
                      "Course Type",
                      "Course Duration",
                      "date",
                      "Time",
                      "Amount",
                      "Status",
                    ].map((header) => (
                      <th
                        key={header}
                        className={`text-left px-4 py-3 border border-[#4C6993] dark:border-[#6087C0] ${
                          header === "Name" ? "pl-20" : ""
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="text-[11px]">
                  {currentData.map((row, index) => {
                    const { student, startTime, endTime } = row; // Destructure from `row`

                    return (
                      <tr
                        key={row._id}
                        className="text-[12px] h-[50px] bg-[#fff] dark:bg-[#2C2C2C]"
                      >
                        <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                          {student.studentId}
                        </td>
                        <td className="px-4 py-2 text-left font-medium text-[#3D8FDE] pl-20">
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
    </BaseLayout>
  );
};

export default Earnings;
