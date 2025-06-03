"use client";

import React, { useState } from "react";
import BaseLayout3 from "@/components/BaseLayout3";
import SupervisorHeader from "../../components/supervisorHeader";
import { FaChevronDown, FaStar } from "react-icons/fa";
import { HiOutlineFilter } from "react-icons/hi";
import { FiCalendar, FiSearch } from "react-icons/fi";
import { Search } from "lucide-react";
import Pagination from "@/components/Pagination";
import { ImAttachment } from "react-icons/im";
import { MoreVertical } from "lucide-react";
import { HiOutlineX } from "react-icons/hi";
import { MdTune } from "react-icons/md";

// Dummy data
const dummyApplicants = [
  {
    _id: "1",
    Review: "John Doe",

    Feedback: "john.doe@example.com",
    class: "Software Engineer",
    Deatils: "Pending",
    level: 3,
  },
  {
    _id: "2",
    Review: "John Doe",

    Feedback: "john.doe@example.com",
    class: "Software Engineer",
    Deatils: "Pending",
    level: 3,
  },
  {
    _id: "3",
    Review: "John Doe",

    Feedback: "john.doe@example.com",
    class: "Software Engineer",
    Deatils: "Pending",
    level: 3,
  },
  {
    _id: "4",
    Review: "John Doe",

    Feedback: "john.doe@example.com",
    class: "Software Engineer",
    Deatils: "Pending",
    level: 3,
  },
  {
    _id: "5",
    Review: "John Doe",

    Feedback: "john.doe@example.com",
    class: "Software Engineer",
    Deatils: "Pending",
    level: 3,
  },
  {
    _id: "6",
    Review: "John Doe",

    Feedback: "john.doe@example.com",
    class: "Software Engineer",
    Deatils: "Pending",
    level: 3,
  },
  {
    _id: "7",
    Review: "John Doe",

    Feedback: "john.doe@example.com",
    class: "Software Engineer",
    Deatils: "Pending",
    level: 3,
  },
  {
    _id: "8",
    Review: "John Doe",

    Feedback: "john.doe@example.com",
    class: "Software Engineer",
    Deatils: "Pending",
    level: 3,
  },
  {
    _id: "9",
    Review: "John Doe",

    Feedback: "john.doe@example.com",
    class: "Software Engineer",
    Deatils: "Pending",
    level: 3,
  },
  {
    _id: "10",
    Review: "John Doe",

    Feedback: "john.doe@example.com",
    class: "Software Engineer",
    Deatils: "Pending",
    level: 3,
  },
  {
    _id: "12",
    Review: "John Doe",

    Feedback: "john.doe@example.com",
    class: "Software Engineer",
    Deatils: "Pending",
    level: 3,
  },
  {
    _id: "13",
    Review: "John Doe",

    Feedback: "john.doe@example.com",
    class: "Software Engineer",
    Deatils: "Pending",
    level: 3,
  },
  {
    _id: "14",
    Review: "John Doe",

    Feedback: "john.doe@example.com",
    class: "Software Engineer",
    Deatils: "Pending",
    level: 3,
  },
];
const items = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
}));
const FeedbackDetails: React.FC = () => {
  const [applicants, setApplicants] = useState(dummyApplicants);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(applicants.length / itemsPerPage);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = applicants.slice(indexOfFirst, indexOfLast);

  const [showModal, setShowModal] = useState(false);
  const handleDetailsClick = (applicant: {
    _id: string;
    Review: string;
    Feedback: string;
    class: string;
    Deatils: string;
    level: number;
  }) => {
    console.log("Details clicked for:", applicant);
    // You can open a modal, navigate to a page, or show more info here
  };

  // Placeholder functions for actions
  const handleMenuClick = (id: string) => {
    // Implement menu click logic
  };

  const handleEdit = (applicant: any) => {
    // Implement edit logic
  };

  const handleViewDetails = (applicant: any) => {
    // Implement view details logic
  };

  return (
    <BaseLayout3>
      <SupervisorHeader currentSection="Feedback" />
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-3 md:space-y-0">
          <div className="flex flex-wrap gap-2 mb-0">
            {/* Add any additional controls here */}
          </div>
        </div>

        <div className="w-full h-[588px] bg-[#FAFAFB] rounded-lg dark:bg-[#343434]">
          {/* Header Search & Filter */}
          <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434]">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search by keyword"
                className="bg-transparent outline-none text-[15px] w-52 py-3"
              />
            </div>

            <div className="relative ">
              {/* Filter Button: Tune + Filter Left, Arrow Right */}
              <div
                className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                <div className="flex items-center gap-1">
                  <MdTune className="w-4 h-4" />
                  <span className="text-sm">Filter</span>
                </div>
              </div>

              {/* Filter Popup */}
              {/* {showFilter && (
                <div
                  className="absolute top-14 left-0 bg-white  dark:bg-[#343434] rounded-lg shadow-lg w-80 p-6 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-[#ffff]">
                      Filter by
                    </h3>
                    <button onClick={() => setShowFilter(false)}>
                      <HiOutlineX className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                    </button>
                  </div>
                  <label className="block text-sm text-gray-700 mb-1 dark:text-[#ffff]">
                    Class
                  </label>{" "}
                  <br />
                  <select className="w-full border border-gray-300  dark:bg-[#343434] dark:text-[#ffff] rounded-md p-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Trail Class</option>
                    <option>Other Class</option>
                  </select>
                  <hr className="my-4" />
                  <div className="flex justify-between">
                    <button
                      className="px-4 py-2 rounded-md border border-indigo-300 text-indigo-600 hover:bg-indigo-50 text-sm"
                      onClick={() => setShowFilter(false)}
                    >
                      Cancel
                    </button>
                    <button className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 text-sm">
                      Submit
                    </button>
                  </div>
                </div>
              )} */}

              {showModal && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center"
                  // onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-white p-6 rounded-lg w-96 relative dark:bg-[#252525]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-[#ffff]">
                      Filter by
                    </h3>
                    <button onClick={() => setShowModal(false)}>
                      <HiOutlineX className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                    </button>
                  </div>
                  <label className="block text-sm text-gray-700 mb-1 dark:text-[#ffff]">
                    Class
                  </label>{" "}
                  <br />
                  <select className="w-full border border-gray-300  dark:bg-[#343434] dark:text-[#ffff] rounded-md p-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Trail Class</option>
                    <option>Other Class</option>
                  </select>
                  <hr className="my-4" />
                  <div className="flex justify-between">
                    <button
                      className="px-4 py-2 rounded-md border border-indigo-300 text-indigo-600 hover:bg-indigo-50 text-sm"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 text-sm">
                      Submit
                    </button>
                  </div>
                  </div>
                  
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
              <span className="text-left -ml-60 mt-3 text-[14px]">
                Showing {currentItems.length} Of {applicants.length}
              </span>
            </div>
          </div>

          {/* Table */}
          <table
            className="table-auto  w-full "
            style={{ width: "100%", tableLayout: "fixed" }}
          >
            <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
              <tr className="font-medium">
                <th className="text-left px-3 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                  Review
                </th>
                <th className="text-left px-3 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                  Feedback
                </th>
                <th className="text-left px-3 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                  Class
                </th>

                <th className="text-left px-3 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                  Level
                </th>
                <th className="text-left px-3 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((applicant, index) => (
                <tr
                  key={applicant._id}
                  className={`text-[12px]  ${
                    index % 2 === 0
                      ? "bg-[#fff] dark:bg-[#2C2C2C] "
                      : "bg-[#F8F8F8] dark:bg-[#303030]"
                  }`}
                >
                  <td className="px-3 py-4 text-[#17243E]  dark:text-[#FDFDFD]">
                    {applicant.Review}
                  </td>

                  <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                    {applicant.Feedback}
                  </td>

                  <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD]">
                    {applicant.class}
                  </td>

                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={`star-${star}`}
                          className={`w-4 h-4 ${
                            (Number(applicant?.level) || 0) >= star
                              ? "text-[#FAAB3C]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      className="text-xs px-3 py-1 rounded-md bg-[#4C6993] text-white dark:bg-[#6087C0] hover:bg-[#3b5574] dark:hover:bg-[#4e72a0] transition-colors"
                      onClick={() => handleDetailsClick(applicant)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </BaseLayout3>
  );
};

export default FeedbackDetails;
