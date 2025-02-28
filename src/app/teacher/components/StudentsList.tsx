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

        const response = await axios.get<ApiResponse>("https://alfurqanacademy.tech/classShedule", {
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
    <div className="p-4 w-[1250px] pr-20">
        <h2 className="text-2xl font-semibold text-gray-800 p-2">Students List</h2>
        <div className="bg-white rounded-lg border-2 border-[#1C3557] h-[340px]">
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead className="border-b-[1px] border-[#1C3557] text-[12px] font-semibold">
                <tr>
                  <th className="px-6 py-3 text-center">Assigned ID</th>
                  <th className="px-6 py-3 text-center">Name</th>
                  <th className="px-6 py-3 text-center">Student ID</th>
                  <th className="px-6 py-3 text-center">Level</th>
                  <th className="px-6 py-3 text-center">Courses</th>
                  <th className="px-6 py-3 text-center">Assigned Date</th>
                  <th className="px-6 py-3 text-center">Due Date</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {uniqueStudentSchedules.slice(0,3).map((student) => (
                  <tr
                  key={student.student.studentId}
                    className="text-[12px] font-medium mt-2"
                    style={{ backgroundColor: "rgba(230, 233, 237, 0.22)" }}
                  >
                    <td className="px-6 py-2 text-center">{student._id}</td>
                    <td className="px-6 py-2 text-center">{student.student.studentFirstName}</td>
                    <td className="px-6 py-2 text-center">{student.student.studentId}</td>
                    <td className="px-6 py-2 text-center">1</td>
                    <td className="px-6 py-2 text-center">{student.package}</td>
                    <td className="px-6 py-2 text-center">{new Date(student.startDate).toLocaleDateString()}</td>
                    <td className="px-6 py-2 text-center">{new Date(student.endDate).toLocaleDateString()}</td>
                    <td className="px-6 py-2 text-center">
                      <span
                        className={`py-1 text-[#223857] rounded-lg border-[1px] border-[#1c3557c0] bg-[#D0FECA] text-[10px] ${student.status}`}
                      >
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-4 text-right">
          <Link href="/teacher/ui/allstudents" className="text-teal-500 text-sm hover:underline">
            View all
          </Link>
        </div>
    </div>
  );
};

export default StudentList;
