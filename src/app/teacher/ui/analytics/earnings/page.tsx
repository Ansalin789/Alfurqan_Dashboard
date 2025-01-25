'use client';


import BaseLayout from "@/components/BaseLayout";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { FaSort } from 'react-icons/fa';

const Earnings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = data.filter(row =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <BaseLayout>
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-[35px] font-semibold text-gray-800 mb-6">Earnings</h1>
        <div className="bg-white rounded-2xl shadow-md">
          <div className="p-4  justify-between flex">
            <h2 className="text-[17px] font-semibold text-[#374557]">My Classes</h2>
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
            <table className="min-w-full table-auto">
              <thead className="text-[13px]">
                <tr>
                  {[
                    "Name",
                    "Student ID",
                    "Courses",
                    "Course Type",
                    "Course Duration",
                    "Class - Date & Time",
                    "Amount",
                    "Status",
                  ].map((header) => (
                    <th
                      key={header}
                      className="text-center px-4 py-2 text-[#374557] font-medium border-b-[1px] border-b-[#adacac]"
                    >
                      {header} <FaSort className="inline ml-1" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[11px] text-[#374557] font-medium">
                {currentData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 text-center">
                    <td className="px-4 py-2" style={{ width: '150px' }}>{row.name}</td>
                    <td className="px-4 py-2" style={{ width: '130px' }}>{row.id}</td>
                    <td className="px-4 py-2" style={{ width: '150px' }}>{row.course}</td>
                    <td className="px-4 py-2" style={{ width: '150px' }}>{row.type}</td>
                    <td className="px-4 py-2" style={{ width: '160px' }}>{row.duration}</td>
                    <td className="px-4 py-2 text-[10px]" style={{ width: '200px' }}>{row.datetime}</td>
                    <td className="px-4 py-2 text-gray-800" style={{ width: '120px' }}>{row.amount}</td>
                    <td className="px-4 py-2">
                        {(() => {
                            let statusClass = "";
                            if (row.status === "Completed") {
                            statusClass =
                                "bg-[#4cbc9a04] text-[#4CBC9A] rounded-lg border border-[#4CBC9A]";
                            } else if (row.status === "Re Schedule") {
                            statusClass =
                                "bg-[#fec74f2a] text-[#FEC64F] rounded-lg border border-[#FEC64F]";
                            } else {
                            statusClass =
                                "bg-[#fc6a573a] text-[#FC6B57] rounded-lg border border-[#FC6B57]";
                            }
                            return (
                            <span className={`px-3 py-1 rounded-full text-[12px] ${statusClass}`}>
                                {row.status}
                            </span>
                            );
                        })()}
                    </td>

                    <td className="px-4 py-2 text-gray-800 text-right">
                      <span className="cursor-pointer text-gray-500">...</span>
                    </td>
                  </tr>
                ))}
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

export default Earnings;
