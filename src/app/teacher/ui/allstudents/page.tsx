'use client';


import BaseLayout from "@/components/BaseLayout";
import React, { useEffect, useState } from "react";
import { BsSearch, BsThreeDots } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { IoArrowBackCircleSharp } from "react-icons/io5";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

        const response = await axios.get<ApiResponse>("http://alfurqanacademy.tech:5001/classShedule", {
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
  // Calculate the current students to display based on the current page
  const indexOfLastStudent = currentPage * itemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;

  // Function to handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <BaseLayout>
      <div className="p-8 mx-auto w-[1250px] pr-16">
      <div className="p-2">
          <IoArrowBackCircleSharp 
            className="text-[25px] bg-[#fff] rounded-full text-[#012a4a] cursor-pointer" 
            onClick={() => router.push('assignment')}
          />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 p-2 mb-10">Assignment</h1>
        <div className="bg-white rounded-lg border-2 border-[#1C3557] h-[500px] overflow-y-scroll scrollbar-none flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="p-4 justify-between flex font-medium text-gray-700">Students List</h2>
                <div className="relative shadow-ld rounded-xl">
                    <span className="absolute left-3 top-4 -translate-y-1/2 text-gray-500 w-3 h-3">
                    <BsSearch />
                    </span>
                    <input
                    type="text"
                    placeholder="Search"
                    className="pl-9 pr-4 py-1.5 bg-[#FAFAFA] shadow-lg rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#374557] w-56"
                    />
                </div>
            </div>

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
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {uniqueStudentSchedules.slice(0,3).map((student) => (
                    <tr
                      key={student._id}
                      className="text-[12px] font-medium mt-2"
                        style={{ backgroundColor: "rgba(230, 233, 237, 0.22)" }}
                    >
                      <td className="px-6 py-2 text-center">{student._id}</td>
                      <td className="px-6 py-2 text-center">{student.student.studentFirstName}</td>
                      <td className="px-6 py-2 text-center">{student._id}</td>
                      <td className="px-6 py-2 text-center">1</td>
                      <td className="px-6 py-2 text-center">{student.package}</td>
                      <td className="px-6 py-2 text-center">{new Date(student.startDate).toLocaleDateString()}</td>
                      <td className="px-6 py-2 text-center">{new Date(student.endDate).toLocaleDateString()}</td>
                      <td className="px-6 py-2 text-center">
                        <span
                          className={`text-green-600 border bg-green-100 px-1 py-[3px] rounded-lg text-[11px] ${student.status}`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-2 text-center">
                        <div className="relative">
                          <button 
                            className="text-gray-500 hover:text-gray-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(openDropdownId === student._id ? null : student._id);
                            }}
                          >
                            <BsThreeDots />
                          </button>
                          {openDropdownId === student._id && (
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
          </div>
          <div className="flex items-center justify-between align-bottom px-4 mb-1">
            <p className="text-[10px] text-gray-600">
              Showing {indexOfFirstStudent + 1}-{Math.min(indexOfLastStudent, uniqueStudentSchedules.length)} of {uniqueStudentSchedules.length} data
            </p>
            <div className="flex space-x-2 text-[10px]">
              {Array.from({ length: Math.ceil(uniqueStudentSchedules.length / itemsPerPage) }, (_, index) => (
                <button
                  key={index + 1}
                  className={`px-3 py-1 border rounded-md ${currentPage === index + 1 ? 'bg-[#223857] text-white p-3' : 'text-gray-600 border-gray-300 hover:bg-gray-200'}`}
                  onClick={() => handlePageChange(index + 1)}
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

export default AllStudents;
