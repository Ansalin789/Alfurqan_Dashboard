'use client';


import BaseLayout from "@/components/BaseLayout";
import React, { useState } from "react";
import { BsSearch, BsThreeDots } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { IoArrowBackCircleSharp } from "react-icons/io5";


const AllStudents = () => {
  const router = useRouter();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set the number of items per page to 5

  // Example student data - replace this with your actual data fetching logic
  const students = [
    {
      id: "1",
      name: "Samantha William",
      studentId: "1234567890",
      level: 2,
      course: "Arabic",
      assignedDate: "January 2, 2020",
      dueDate: "January 8, 2020",
      status: "Completed",
      statusColor: "bg-green-100 text-green-700 border border-green-700 px-4",
    },
    {
      id: "2",
      name: "Jordan Nico",
      studentId: "1234567891",
      level: 1,
      course: "Tajweed",
      assignedDate: "January 2, 2020",
      dueDate: "January 8, 2020",
      status: "Not Completed",
      statusColor: "bg-yellow-100 text-yellow-700 border border-yellow-700 px-1",
    },
    {
      id: "3",
      name: "Nadila Adja",
      studentId: "1234567892",
      level: 2,
      course: "Quran",
      assignedDate: "January 2, 2020",
      dueDate: "January 8, 2020",
      status: "Not Assigned",
      statusColor: "bg-red-100 text-red-700 border border-red-700 px-3",
    },
    {
        id: "4",
        name: "Nadila Adja",
        studentId: "1234567890",
        level: 2,
        course: "Quran",
        assignedDate: "January 2, 2020",
        dueDate: "January 8, 2020",
        status: "Not Assigned",
        statusColor: "bg-red-100 text-red-700 border border-red-700 px-3",
      },
      {
        id: "5",
        name: "Nadila Adja",
        studentId: "1234567890",
        level: 2,
        course: "Quran",
        assignedDate: "January 2, 2020",
        dueDate: "January 8, 2020",
        status: "Not Assigned",
        statusColor: "bg-red-100 text-red-700 border border-red-700 px-3",
      },
      {
        id: "6",
        name: "Nadila Adja",
        studentId: "1234567890",
        level: 2,
        course: "Quran",
        assignedDate: "January 2, 2020",
        dueDate: "January 8, 2020",
        status: "Not Assigned",
        statusColor: "bg-red-100 text-red-700 border border-red-700 px-3",
      },
      {
        id: "7",
        name: "Nadila Adja",
        studentId: "1234567890",
        level: 2,
        course: "Quran",
        assignedDate: "January 2, 2020",
        dueDate: "January 8, 2020",
        status: "Not Assigned",
        statusColor: "bg-red-100 text-red-700 border border-red-700 px-3",
      },
      {
        id: "8",
        name: "Nadila Adja",
        studentId: "1234567890",
        level: 2,
        course: "Quran",
        assignedDate: "January 2, 2020",
        dueDate: "January 8, 2020",
        status: "Not Assigned",
        statusColor: "bg-red-100 text-red-700 border border-red-700 px-3",
      },
      {
        id: "9",
        name: "Tom crr",
        studentId: "1234567890",
        level: 2,
        course: "Quran",
        assignedDate: "January 2, 2020",
        dueDate: "January 8, 2020",
        status: "Not Assigned",
        statusColor: "bg-red-100 text-red-700 border border-red-700 px-3",
      },
      {
        id: "10",
        name: "alya Adja",
        studentId: "1234567890",
        level: 2,
        course: "Quran",
        assignedDate: "January 2, 2020",
        dueDate: "January 8, 2020",
        status: "Not Assigned",
        statusColor: "bg-red-100 text-red-700 border border-red-700 px-3",
      },
  ];

  // Calculate the current students to display based on the current page
  const indexOfLastStudent = currentPage * itemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

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
                  {currentStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="text-[12px] font-medium mt-2"
                        style={{ backgroundColor: "rgba(230, 233, 237, 0.22)" }}
                    >
                      <td className="px-6 py-2 text-center">{student.id}</td>
                      <td className="px-6 py-2 text-center">{student.name}</td>
                      <td className="px-6 py-2 text-center">{student.studentId}</td>
                      <td className="px-6 py-2 text-center">{student.level}</td>
                      <td className="px-6 py-2 text-center">{student.course}</td>
                      <td className="px-6 py-2 text-center">{student.assignedDate}</td>
                      <td className="px-6 py-2 text-center">{student.dueDate}</td>
                      <td className="px-6 py-2 text-center">
                        <span
                          className={`text-green-600 border bg-green-100 px-1 py-[3px] rounded-lg text-[11px] ${student.statusColor}`}
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
                              setOpenDropdownId(openDropdownId === student.id ? null : student.id);
                            }}
                          >
                            <BsThreeDots />
                          </button>
                          {openDropdownId === student.id && (
                            <button 
                              className="absolute right-0 mr-10 w-24 shadow-2xl bg-white rounded-md  z-10 border border-gray-200"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                className="block w-full text-center px-4 py-1 text-[12px] text-black hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  router.push(`/teacher/ui/managestudentview`);
                                  setOpenDropdownId(null);
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
            <p className="text-[10px] text-gray-600">Showing {indexOfFirstStudent + 1}-{Math.min(indexOfLastStudent, students.length)} of {students.length} data</p>
            <div className="flex space-x-2 text-[10px]">
              {Array.from({ length: Math.ceil(students.length / itemsPerPage) }, (_, index) => (
                <button
                  key={index + 1}
                  className={`px-3 py-1 border rounded-md ${currentPage === index + 1 ? 'bg-[#223857] text-white' : 'text-gray-600 border-gray-300 hover:bg-gray-200'}`}
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
