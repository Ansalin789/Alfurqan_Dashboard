'use client';

import Link from "next/link";
import React from "react";

const StudentList = () => {
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
                  statusColor: "bg-green-100 text-green-700",
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
                  statusColor: "bg-yellow-100 text-yellow-700",
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
                  statusColor: "bg-red-100 text-red-700",
                },
              ].map((student, index) => (
                <tr
                  key={index}
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
