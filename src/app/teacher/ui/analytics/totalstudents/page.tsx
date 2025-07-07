"use client";

import BaseLayout from "@/components/BaseLayout";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import TeacherHeader from "@/app/teacher/components/TeacherHeader";
import { MdTune } from "react-icons/md";
import Pagination from "@/components/Pagination";

interface SimpleStudent {
  studentId: string;
  name: string;
  studentDetails: {
    student: {
      learningInterest?: string;
      languageLevel?: string;
    
    };
      studentRate?:string;
    classType?: string;
    classStartDate?: string;
    status?: string;
  };
}

const Totalstudents = () => {
  const [students, setStudents] = useState<SimpleStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  const teacherId = localStorage.getItem("TeacherPortalId");
console.log("Teacher ID used in API:", teacherId);




useEffect(() => {
  const fetchStudents = async () => {
    try {
       const teacherId =  typeof window !== "undefined"
      ? localStorage.getItem("TeacherPortalId")
      : null; 

      const token = localStorage.getItem("TeacherAuthToken");

      if (!teacherId || !token) {
        console.error("Missing teacherId or token in localStorage");
        return;
      }

      const response = await axios.get<SimpleStudent[]>(
        "https://api.blackstoneinfomaticstech.com/classShedule/teacher/list",
        {
          params: { teacherId },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  fetchStudents();
}, []);


  const filteredData = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                      <th className="text-left px-4 py-3 border border-[#4C6993] dark:border-[#6087C0] pl-10">
                        Name
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
                    {students.length > 0 ? (
                      students.map((student) => (
                        <tr
                          key={student.studentId}
                          className="text-[12px] h-[50px] bg-[#fff] dark:bg-[#2C2C2C]"
                        >
                          <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                            {student.studentId}
                          </td>
                          <td className="px-4 py-2 text-[#3D8FDE] dark:text-[#3D8FDE] font-medium pl-10">
                            {student.name}
                          </td>
                          <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                            {student.studentDetails?.student?.learningInterest}
                          </td>
                          <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                            {student.studentDetails?.classType}
                          </td>
                          <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                            {student.studentDetails?.classStartDate
                              ? new Date(
                                  student.studentDetails.classStartDate
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                })
                              : "-"}
                          </td>
                          <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                            {student.studentDetails.studentRate}
                          </td>
                          <td className="px-3 py-2 text-left">
                            <span
                              className={`text-[10px] font-semibold px-5 py-1 rounded-lg ${
                                student.studentDetails?.status === "Active"
                                  ? "text-[#377E36] bg-[#ECFDF3] dark:bg-[#323E31] dark:text-[#377E36] px-[18px]"
                                  : "text-[#343E59] bg-[#E4E4E4] dark:bg-[#4F4F4F] dark:text-white"
                              }`}
                            >
                              {student.studentDetails?.status}
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

export default Totalstudents;
