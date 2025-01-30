'use client'

import BaseLayout from "@/components/BaseLayout";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";

const Totalstudents = () => {
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
    students: Schedule[];
  }

  const [uniqueStudentSchedules, setUniqueStudentSchedules] = useState<Schedule[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = localStorage.getItem("TeacherAuthToken");
        const teacherIdToFilter = localStorage.getItem("TeacherPortalId");

        if (!teacherIdToFilter) {
          console.error("No teacher ID found in localStorage.");
          return;
        }

        const response = await axios.get<ApiResponse>("http://localhost:5001/classShedule", {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        });

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

  // Filter students based on search term
  const filteredData = uniqueStudentSchedules.filter((row) =>
    `${row.student.studentFirstName} ${row.student.studentLastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <BaseLayout>
      <div className="p-8 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Students List</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="p-4 flex justify-between">
            <h2 className="text-[17px] font-semibold text-[#374557]">My Student List</h2>
            <div className="relative shadow-lg rounded-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by Name"
                className="pl-9 pr-4 py-1.5 bg-[#FAFAFA] shadow-lg rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#374557] w-56"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-gray-600 text-sm">Name</th>
                  <th className="p-3 text-gray-600 text-sm">Student ID</th>
                  <th className="p-3 text-gray-600 text-sm">Courses</th>
                  <th className="p-3 text-gray-600 text-sm"> Course Type</th>
                  <th className="p-3 text-gray-600 text-sm">Start Date</th>
                  <th className="px-4 py-3 font-medium text-sm">Level</th>
                  <th className="p-3 text-gray-600 text-sm">Status</th>
                </tr>
              </thead>
              <tbody className="text-[12px]">
                {currentData.length > 0 ? (
                  currentData.map((student, index) => (
                    <tr key={student.student.studentId} className="even:bg-gray-100 odd:bg-white hover:bg-gray-50">
                      <td className="p-3" style={{ width: "190px" }}>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                          <span className="text-gray-700">
                            {student.student.studentFirstName} {student.student.studentLastName}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">{student.student.studentId}</td>
                      <td className="p-3 text-gray-600">{student.package}</td>
                      <td className="p-3 text-gray-600">{student.scheduleStatus}</td>
                      <td className="p-3 text-gray-600">{new Date(student.startDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                               <span className="text-[#1e293b] text-sm">Level 1</span>
                                  <div className="w-5 h-5 bg-[#1e293b] rounded-full text-white flex items-center justify-center text-xs">
                                  </div>
                                   </div>
                               </td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 font-medium ${
                            student.status === "Active"
                              ? "text-green-600 bg-green-100"
                              : "text-red-600 bg-red-100"
                          } rounded-full`}
                        >
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center p-4 text-gray-500">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4">
            <p className="text-[12px] text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} students
            </p>
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }).map((i:any, index) => (
                <button
                  key={i}
                  className={`px-3 py-1 text-[12px] ${
                    currentPage === index + 1 ? "text-white bg-blue-600" : "text-gray-600 bg-gray-200"
                  } rounded-md hover:bg-gray-300`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Totalstudents;
