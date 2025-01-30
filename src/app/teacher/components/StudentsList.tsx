'use client';

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
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


const StudentList = () => {
  const [uniqueStudentSchedules, setUniqueStudentSchedules] = useState<Schedule[]>([]);
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
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Students List</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left bg-gray-200 text-sm text-gray-600">
                <th className="py-2 px-4">Assigned ID</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Student ID</th>
                <th className="py-2 px-4">Level</th>
                <th className="py-2 px-4">Courses</th>
                <th className="py-2 px-4">Assigned Date</th>
                <th className="py-2 px-4">Due Date</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {uniqueStudentSchedules.slice(0,3).map((student) => (
                <tr
                  key={student.student.studentId}
                  className="text-sm text-gray-700 border-b last:border-none"
                >
                  <td className="py-2 px-4">{student._id}</td>
                  <td className="py-2 px-4">{student.student.studentFirstName}</td>
                  <td className="py-2 px-4">{student.student.studentId}</td>
                  <td className="py-2 px-4">1</td>
                  <td className="py-2 px-4">{student.package}</td>
                  <td className="py-2 px-4">{new Date(student.startDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4">{new Date(student.endDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`rounded-lg py-1 px-3 text-xs font-semibold ${student.status}`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <button className="text-gray-500 hover:text-gray-700">
                      ...
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">Showing 1-3 of 100 data</p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded-md text-gray-600 border-gray-300 hover:bg-gray-200">
              1
            </button>
            <button className="px-3 py-1 border rounded-md text-white bg-teal-500">
              2
            </button>
            <button className="px-3 py-1 border rounded-md text-gray-600 border-gray-300 hover:bg-gray-200">
              3
            </button>
          </div>
        </div>
        <div className="mt-4 text-right">
          <Link href="/teacher/ui/allstudents" className="text-teal-500 text-sm hover:underline">
            View all
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
