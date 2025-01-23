'use client';


import BaseLayout from "@/components/BaseLayout";
import React, { useState } from "react";
import { BsSearch, BsThreeDots } from "react-icons/bs";
import { useRouter } from "next/navigation";


const AllStudents = () => {
  const router = useRouter();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

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
      statusColor: "bg-green-100 text-green-700",
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
      statusColor: "bg-yellow-100 text-yellow-700",
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
      statusColor: "bg-red-100 text-red-700",
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
        statusColor: "bg-red-100 text-red-700",
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
        statusColor: "bg-red-100 text-red-700",
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
        statusColor: "bg-red-100 text-red-700",
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
        statusColor: "bg-red-100 text-red-700",
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
        statusColor: "bg-red-100 text-red-700",
      },
  ];

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
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="text-sm text-gray-700 border-b last:border-none"
                  >
                    <td className="py-2 px-4">{student.id}</td>
                    <td className="py-2 px-4">{student.name}</td>
                    <td className="py-2 px-4">{student.studentId}</td>
                    <td className="py-2 px-4">{student.level}</td>
                    <td className="py-2 px-4">{student.course}</td>
                    <td className="py-2 px-4">{student.assignedDate}</td>
                    <td className="py-2 px-4">{student.dueDate}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`rounded-lg py-1 px-3 text-xs font-semibold ${student.statusColor}`}
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
