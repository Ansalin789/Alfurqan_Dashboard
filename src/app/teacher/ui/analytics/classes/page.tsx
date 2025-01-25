'use client';

import BaseLayout from "@/components/BaseLayout";
import { Search } from "lucide-react";
import React, { useState } from "react";
const Classes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = data.filter(row =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  console.log(currentData);

  const getStatus = (index: number) => {
    if (index % 3 === 0) {
      return { text: "Completed", style: "text-green-600 bg-green-50 border-[1px] border-green-600 rounded-lg" };
    } else if (index % 3 === 1) {
      return { text: "Re Schedule", style: "text-yellow-600 bg-yellow-50 border-[1px] border-yellow-600 rounded-lg" };
    } else {
      return { text: "Canceled", style: "text-red-600 bg-red-50 border-[1px] border-red-600 rounded-lg" };
    }
  };

  return (
    <BaseLayout>
      <div className="p-8 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">My Classes</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="p-4 justify-between flex">
            <h2 className="text-[17px] font-semibold text-[#374557]">My Classes List</h2>
            <div className="relative shadow-ld rounded-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#374557] w-4 h-4" />
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
                <tr>
                  <th className="p-3 text-gray-600 text-[11px]">Name</th>
                  <th className="p-3 text-gray-600 text-[11px]">Student ID</th>
                  <th className="p-3 text-gray-600 text-[11px]">Courses</th>
                  <th className="p-3 text-gray-600 text-[11px]">Course Type</th>
                  <th className="p-3 text-gray-600 text-[11px]">Course Duration</th>
                  <th className="p-3 text-gray-600 text-[11px]">Class - Date & Time</th>
                  <th className="p-3 text-gray-600 text-[11px]">Status</th>
                  <th className="p-3 text-gray-600 text-[11px]">Action</th>
                </tr>
              </thead>
              <tbody className="text-[11px]">
                {Array.from({ length: 5 }).map((_, index) => {
                  const status = getStatus(index);
                  const uniqueKey = `row-${index}`; // Generate a unique key

                  return (
                    <tr key={uniqueKey}>
                      <td className="p-3" style={{ width: '190px' }}>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-xl"></div>
                          <span className="text-gray-700">Samantha William</span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600" style={{ width: '130px' }}>1234567890</td>
                      <td className="p-3 text-gray-600" style={{ width: '100px' }}>Quran</td>
                      <td className="p-3 text-gray-600" style={{ width: '130px' }}>Trial Class</td>
                      <td className="p-3 text-gray-600" style={{ width: '150px' }}>30 minutes</td>
                      <td className="p-3 text-gray-600" style={{ width: '250px' }}>
                        January 2, 2020 - 9:00–10:30 AM
                      </td>
                      <td className="p-3" style={{ width: '150px' }}>
                        <span className={`px-3 py-1 font-medium ${status.style} rounded-full`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600 text-sm">
                        <span className="cursor-pointer text-xl">...</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
          <div className="flex items-center justify-between p-4">
            <p className="text-[10px] text-gray-600">Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} data</p>
            <div className="flex items-center space-x-2">
              {[...Array(totalPages)].map((i, index) => (
                <button
                  key={i}
                  className={`px-3 py-1 text-[11px] ${currentPage === index + 1 ? 'text-white bg-blue-600' : 'text-gray-600 bg-gray-200'} rounded-md hover:bg-gray-300`}
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
