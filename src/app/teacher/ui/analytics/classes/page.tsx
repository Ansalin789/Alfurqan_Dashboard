'use client';

import BaseLayout from "@/components/BaseLayout";
import axios from "axios";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaSort } from "react-icons/fa";

const Classes = () => {
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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = localStorage.getItem("TeacherAuthToken");
        const teacherIdToFilter = localStorage.getItem("TeacherPortalId");
         
        console.log(auth);
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
          (item:any) => item.teacher.teacherId === teacherIdToFilter
        );

        const studentScheduleMap = new Map<string, Schedule>();

        filteredData.forEach((item:any) => {
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

  const filteredData = uniqueStudentSchedules.filter(row =>
    row.student.studentFirstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  console.log(currentData);

  const getStatus = (index: number) => {
    if (index % 3 === 0) {
      return { text: "Completed", style: "text-green-600 bg-green-100 border-[1px] border-green-600 rounded-lg px-4" };
    } else if (index % 3 === 1) {
      return { text: "Re Schedule", style: "text-yellow-600 bg-yellow-100 border-[1px] border-yellow-600 rounded-lg px-3" };
    } else {
      return { text: "Canceled", style: "text-red-600 bg-red-100 border-[1px] border-red-600 rounded-lg px-5" };
    }
  };

  return (
    <BaseLayout>
      <div className="p-8 mx-auto w-[1250px] pr-16">
        <h1 className="text-2xl font-semibold text-gray-800 p-2 mb-10">My Classes</h1>
        <div className="bg-white rounded-lg border-2 border-[#1C3557] h-[500px] overflow-y-scroll scrollbar-none flex flex-col justify-between">
          <div>
            <div className="p-4 pt-6 justify-between flex">
              <h2 className="text-lg pl-10 font-semibold text-[#1e293b] mb-3">صفي</h2>
              <div className="relative">
                <Search className="absolute left-3 top-4 -translate-y-1/2 text-gray-500 w-3 h-3" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-9 pr-4 py-1.5 bg-[#FAFAFA] shadow-md rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#223857] w-56"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="border-b-[1px] border-[#1C3557] text-[12px] font-semibold">
                  <tr>
                    <th className="px-3 py-3 text-center">
                      Name <FaSort className="inline w-3 h-3" />
                    </th>
                    <th className="px-3 py-3 text-center">
                      Student ID <FaSort className="inline w-3 h-3" />
                    </th>
                    <th className="px-3 py-3 text-center">
                      Courses <FaSort className="inline w-3 h-3" />
                    </th>
                    <th className="px-3 py-3 text-center">
                      Course Type <FaSort className="inline w-3 h-3" />
                    </th>
                    <th className="px-3 py-3 text-center">
                      Course Duration <FaSort className="inline w-3 h-3" />
                    </th>
                    <th className="px-3 py-3 text-center">
                      Class - Date & Time <FaSort className="inline w-3 h-3" />
                    </th>
                    <th className="px-3 py-3 text-center">
                      Status <FaSort className="inline w-3 h-3" />
                    </th>
                    <th className="px-3 py-3 text-center">
                      Action <FaSort className="inline w-3 h-3" />
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[11px]">
                {filteredData.map((schedule, index) => {
    const { student,scheduleStatus, startTime,endTime } = schedule;
    const uniqueKey = `row-${index}`; // Generate a unique key for each row


                    return (
                      <tr key={uniqueKey} className="text-[12px] font-medium mt-2"
                      style={{ backgroundColor: "rgba(230, 233, 237, 0.22)" }}>
                        <td className="px-3 py-2 text-center">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#DBDBDB] rounded-md"></div>
                            <span className="px-6 py-2 text-center">Trail Class</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-center">{student.studentId}</td>
                        <td className="px-3 py-2 text-center">Quran</td>
                        <td className="px-3 py-2 text-center">{schedule.package}</td>
                        <td className="px-3 py-2 text-center">{`${schedule.totalHourse} hours`}</td>
                        <td className="px-3 py-2 text-center">
                        {`${new Date(schedule.startDate).toLocaleDateString()} - ${startTime.join("–")} to ${new Date(schedule.endDate).toLocaleDateString()} - ${endTime.join("–")}`}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className={`px-3 py-1 font-medium ${getStatus} rounded-full`}>
                          {scheduleStatus}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className="cursor-pointer text-xl">...</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 mt-5">
            <p className="text-[11px] text-gray-600">Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} data</p>
            <div className="flex items-center space-x-2">
              {[...Array(totalPages)].map((i, index) => (
                <button
                  key={i}
                  className={`px-3 py-1 text-[10px] ${currentPage === index + 1 ? 'text-white bg-[#1C3557]' : 'text-gray-600 bg-gray-200'} rounded-md hover:bg-gray-800`}
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

export default Classes;
