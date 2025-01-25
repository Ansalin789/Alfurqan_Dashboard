'use client'

import BaseLayout from "@/components/BaseLayout";
import React, { useState } from "react";
import { Search } from "lucide-react";




const Totalstudents = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = data.filter(row =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  console.log(currentData);

  return (
    <BaseLayout>
    <div className="p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Students List</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="p-4  justify-between flex">
          <h2 className="text-[17px] font-semibold text-[#374557]">My Student List</h2>
          <div className="relative shadow-ld rounded-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="pl-9 pr-4 py-1.5 bg-[#FAFAFA] shadow-lg rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#374557] w-56"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="">
                <th className="p-3 text-gray-600 text-sm">Name</th>
                <th className="p-3 text-gray-600 text-sm">Student ID</th>
                <th className="p-3 text-gray-600 text-sm">Courses</th>
                <th className="p-3 text-gray-600 text-sm">Course Type</th>
                <th className="p-3 text-gray-600 text-sm">Join Date</th>
                <th className="p-3 text-gray-600 text-sm">Level</th>
                <th className="p-3 text-gray-600 text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {Array.from({ length: 5 }).map((_, index) => {
                const uniqueKey = `row-${index}`; // Create a unique key for each row

                return (
                  <tr
                    key={uniqueKey}
                    className="even:bg-gray-100 odd:bg-white hover:bg-gray-50"
                  >
                    <td className="p-3" style={{ width: '190px' }}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        <span className="text-gray-700">Samantha William</span>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600" style={{ width: '150px' }}>
                      1234567890
                    </td>
                    <td className="p-3 text-gray-600" style={{ width: '120px' }}>
                      Arabic
                    </td>
                    <td className="p-3 text-gray-600" style={{ width: '150px' }}>
                      Regular Class
                    </td>
                    <td className="p-3 text-gray-600" style={{ width: '150px' }}>
                      January 2, 2020
                    </td>
                    <td className="p-3 text-gray-600 font-semibold" style={{ width: '150px' }}>
                      Level 2
                    </td>
                    <td className="p-3" style={{ width: '150px' }}>
                      <span className="px-3 py-1 font-medium text-green-600 bg-green-100 rounded-full">
                        Active
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
        <div className="flex items-center justify-between p-4">
            <p className="text-[12px] text-gray-600">Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} data</p>
            <div className="flex items-center space-x-2">
              {[...Array(totalPages)].map((i, index) => (
                <button
                  key={i}
                  className={`px-3 py-1 text-[12px] ${currentPage === index + 1 ? 'text-white bg-blue-600' : 'text-gray-600 bg-gray-200'} rounded-md hover:bg-gray-300`}
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

export default Totalstudents;
