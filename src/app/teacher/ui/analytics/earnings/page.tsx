"use client";

import TeacherHeader from "@/app/teacher/components/TeacherHeader";
import BaseLayout from "@/components/BaseLayout";
import Pagination from "@/components/Pagination";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { FaSort } from "react-icons/fa";
import { MdTune } from "react-icons/md";

const Earnings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = data.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <BaseLayout>
      <TeacherHeader currentSection="My Earnings" />
      <div className="md:p-0 mx-auto">
        <div className="h-full w-full  flex flex-col justify-between">
          <div className="w-full bg-[#FAFAFB] rounded-lg dark:bg-[#343434] mt-6">
            <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434]">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by keyword"
                  className="bg-transparent outline-none text-[15px] w-52 py-3 "
                  // value={searchText}
                  // onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <div
                className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
                // onClick={() => setIsFilterModalOpen(true)}
              >
                {/* <BsFilterLeft /> */}
                <MdTune className="w-4 h-4" />
                <span>Filter</span>
              </div>

              <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                <span className="text-left -ml-60 ">
                  {/* Showing {currentItems.length} of {paginatedData.length} */}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table
                className="table-auto w-full"
                style={{ tableLayout: "fixed" }}
              >
                <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                  <tr className="font-medium">
                    {[
                      "Student ID",
                      "Name",

                      "Courses",
                      "Course Type",
                      "Course Duration",
                      "date",
                      "Amount",
                      "Status",
                    ].map((header) => (
                      <th
                        key={header}
                        className="text-left px-4 py-3 border border-[#4C6993] dark:border-[#6087C0]"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-[11px]">
                  {currentData.map((row, index) => (
                    <tr
                      key={row.id}
                      className="text-[12px] h-[50px] bg-[#fff] dark:bg-[#2C2C2C]"
                    >
                      <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                        {row.name}
                      </td>
                      <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                        {row.id}
                      </td>

                      <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                        {row.course}
                      </td>
                      <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                        {row.type}
                      </td>
                      <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                        {row.duration}
                      </td>
                      <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                         {new Date(row.datetime).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            }
                          )}
                      </td>
                      <td className="px-4 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                        {row.amount}
                      </td>
                      <td className="text-[10px] font-semibold px-5 py-2 rounded-lg ">
                        <span className="text-[#377E36] bg-[#ECFDF3] dark:bg-[#323E31] dark:text-[#377E36] px-[18px] py-1  rounded-lg">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
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
