"use client";

import BaseLayout from "@/components/BaseLayout";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import TeacherHeader from "@/app/teacher/components/TeacherHeader";
import { MdTune } from "react-icons/md";
import Pagination from "@/components/Pagination";

interface Student {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
}

interface Teacher {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
}

interface Schedule {
  student: Student;
  teacher: Teacher;
  _id: string;
  classDay: string[];
  package: string;
  course: {
    courseName: string;
  };
  preferedTeacher: string;
  totalHourse: number;
  startDate: string;
  endDate: string;
  startTime: string[];
  endTime: string[];
  scheduleStatus: string;
  sessionClassType: string;
  status: string;
  createdBy: string;
  createdDate: string;
  lastUpdatedDate: string;
  __v: number;
}

interface ApiResponse {
  totalCount: number;
  students: Schedule[];
}

const Totalstudents = () => {
  const [uniqueStudentSchedules, setUniqueStudentSchedules] = useState<
    Schedule[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherIdToFilter = localStorage.getItem("TeacherPortalId");

        if (!teacherIdToFilter) {
          console.error("No teacher ID found in localStorage.");
          return;
        }
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("TeacherAuthToken")
            : null;

        if (!token) {
          console.error("❌ AdminAuthToken not found");
          return;
        }
        const response = await axios.get<ApiResponse>(
          "https://api.blackstoneinfomaticstech.com/classShedule",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const filteredData = response.data.students.filter(
          (item) => item.teacher.teacherId === teacherIdToFilter
        );

        const studentScheduleMap = new Map<string, Schedule>();

        filteredData.forEach((item) => {
          studentScheduleMap.set(item.student.studentId, item);
        });

        const uniqueSchedules = Array.from(studentScheduleMap.values());

        setUniqueStudentSchedules(uniqueSchedules);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredData = uniqueStudentSchedules.filter((row) =>
    `${row.student.studentFirstName} ${row.student.studentLastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <BaseLayout>
        <TeacherHeader currentSection="Student List" />
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
                      <th className="text-left px-4 py-3 border border-[#4C6993] dark:border-[#6087C0]">
                        Student ID
                      </th>
                      <th className="text-left px-4 py-3 border border-[#4C6993] dark:border-[#6087C0]">
                        Student Name
                      </th>
                      <th className="text-left px-4 py-3 border border-[#4C6993] dark:border-[#6087C0]">
                        Course
                      </th>
                      <th className="text-left px-4 py-3 border border-[#4C6993] dark:border-[#6087C0]">
                        Class Type
                      </th>
                      <th className="text-left px-4 py-3 border border-[#4C6993] dark:border-[#6087C0]">
                        Join Date
                      </th>
                      <th className="text-left px-4 py-3 border border-[#4C6993] dark:border-[#6087C0]">
                        Level
                      </th>
                      <th className="text-left px-4 py-3 border border-[#4C6993] dark:border-[#6087C0]">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-[#343434] dark:divide-gray-600">
                    {currentData.length > 0 ? (
                      currentData.map((student) => (
                        <tr
                          key={student.student.studentId}
                          className="text-[12px] h-[50px] bg-[#fff] dark:bg-[#2C2C2C]"
                        >
                          <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                            {student.student.studentId}
                          </td>
                          <td className="px-4 py-2 text-[#3D8FDE] dark:text-[#3D8FDE] font-medium">
                            {student.student.studentFirstName}
                          </td>
                          <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                            {student.course.courseName}
                          </td>
                          <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                            {student.sessionClassType}
                          </td>
                          <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                            {new Date(student.startDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                            1
                          </td>
                          <td className="px-3 py-2 text-left">
                            <span
                              className={`text-[10px] font-semibold px-5 py-1 rounded-lg  ${
                                student.status === "Active"
                                  ? "text-[#377E36] bg-[#ECFDF3] dark:bg-[#323E31] dark:text-[#377E36] px-[18px]"
                                  : "text-[#343E59] bg-[#E4E4E4] dark:bg-[#4F4F4F] dark:text-white"
                              }`}
                            >
                              {student.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center p-4 text-gray-500"
                        >
                          No students found.
                        </td>
                      </tr>
                    )}
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
    </div>
  );
};

const data = [
  {
    name: "Samantha William",
    id: "1234567890",
    course: "Quran",
    type: "Trial Class",
    duration: "30 minutes",
    datetime: "January 2, 2020 - 9:00–10:30 AM",
    amount: "$04",
    status: "Completed",
  },
  {
    name: "Jordan Nico",
    id: "1234567890",
    course: "Tajweed",
    type: "Regular Class",
    duration: "60 minutes",
    datetime: "January 2, 2020 - 11:00–12:00 AM",
    amount: "$30",
    status: "Re Schedule",
  },
  {
    name: "Nadila Adja",
    id: "1234567890",
    course: "Arabic",
    type: "Group Class",
    duration: "45 minutes",
    datetime: "January 3, 2020 - 9:00–10:30 AM",
    amount: "$25",
    status: "Canceled",
  },
];

export default Totalstudents;
