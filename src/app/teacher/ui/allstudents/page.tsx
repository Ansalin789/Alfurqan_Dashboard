'use client';


import BaseLayout from "@/components/BaseLayout";
import React, { useEffect, useState } from "react";
import { BsSearch, BsThreeDots } from "react-icons/bs";
import { useRouter } from "next/navigation";
import axios from "axios";
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

const AllStudents = () => {
  const router = useRouter();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
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
  const handleviewcontrol=(studentId:string)=>{
    router.push(`/teacher/ui/managestudentview`);
    setOpenDropdownId(null);
    localStorage.setItem('studentviewcontrol',studentId);
  };
  return (
    <BaseLayout>
      <div className="p-6 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Assignment</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold mb-4">Students List</h2>
            <div className="relative w-40">
                <span className="absolute inset-y-0 left-4 text-[12px] flex items-center text-gray-400">
                <BsSearch />
                </span>
                <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-2 py-1 rounded-xl shadow-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-300 text-[12px] text-gray-600 placeholder-gray-400"
                />
            </div>
            </div>

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
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {uniqueStudentSchedules.map((student) => (
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
                      <div className="relative">
                        <button 
                          className="text-gray-500 hover:text-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownId(openDropdownId === student.student.studentId  ? null : student.student.studentId );
                          }}
                        >
                          <BsThreeDots />
                        </button>
                        {openDropdownId === student.student.studentId && (
                          <button 
                            className="absolute right-0 mr-10 w-24 shadow-2xl bg-white rounded-md  z-10 border border-gray-200"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="block w-full text-center px-4 py-1 text-[12px] text-black hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                handleviewcontrol(student.student.studentId)
                              }}
                            >
                              View
                            </button>
                            <button
                              className="block w-full text-center px-4 py-1 text-[12px] text-black hover:bg-gray-100 cursor-pointer"
                              onClick={() => setOpenDropdownId(null)}
                            >
                              Cancel
                            </button>
                          </button>
                        )}
                      </div>
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
        </div>
      </div>
    </BaseLayout>
  );
};

export default AllStudents;
