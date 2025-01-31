'use client';

import Link from "next/link";
import React from "react";

const StudentList = () => {
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
                {[
                  {
                    id: "1234567890",
                    name: "Samantha William",
                    studentId: "1234567890",
                    level: 2,
                    course: "Arabic",
                    assignedDate: "January 2, 2020",
                    dueDate: "January 8, 2020",
                    status: "Completed",
                    statusColor: "bg-green-100 text-green-700 px-5",
                  },
                  {
                    id: "1234567890",
                    name: "Jordan Nico",
                    studentId: "1234567890",
                    level: 1,
                    course: "Tajweed",
                    assignedDate: "January 2, 2020",
                    dueDate: "January 8, 2020",
                    status: "Not Completed",
                    statusColor: "bg-yellow-100 text-yellow-700 px-3",
                  },
                  {
                    id: "1234567890",
                    name: "Nadila Adja",
                    studentId: "1234567890",
                    level: 2,
                    course: "Quran",
                    assignedDate: "January 2, 2020",
                    dueDate: "January 8, 2020",
                    status: "Not Assigned",
                    statusColor: "bg-red-100 text-red-700 px-4",
                  },
                  {
                    id: "1234567890",
                    name: "Nadila Adja",
                    studentId: "1234567890",
                    level: 2,
                    course: "Quran",
                    assignedDate: "January 2, 2020",
                    dueDate: "January 8, 2020",
                    status: "Not Assigned",
                    statusColor: "bg-red-100 text-red-700 px-4",
                  },
                  {
                    id: "1234567890",
                    name: "Nadila Adja",
                    studentId: "1234567890",
                    level: 2,
                    course: "Quran",
                    assignedDate: "January 2, 2020",
                    dueDate: "January 8, 2020",
                    status: "Not Assigned",
                    statusColor: "bg-red-100 text-red-700 px-4",
                  },
                ].map((student) => (
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
                        className={`py-1 text-[#223857] rounded-lg border-[1px] border-[#1c3557c0] bg-[#D0FECA] text-[10px] ${student.statusColor}`}
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
