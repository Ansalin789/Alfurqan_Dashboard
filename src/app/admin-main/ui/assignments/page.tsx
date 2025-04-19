"use client";

import BaseLayout4 from "@/components/BaseLayout4";
import React, { useState } from "react";
import { PiBookOpenTextFill } from "react-icons/pi";
import { BiSolidTime } from "react-icons/bi";
import { BsCalendar2Check } from "react-icons/bs";
import { FaSort } from "react-icons/fa";

const AssignmentsPage = () => {
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7; // Number of items per page
    const totalItems = 20; // Total number of items (replace with actual data length)
    // const AddAssignmentModal = ({ handleCloseModal }: { handleCloseModal: () => void }) => {
    const [selectedOption, setSelectedOption] = useState<number | null>(1);
    const [isTrueFalse, setIsTrueFalse] = useState(false); // State for True/False checkbox
    const [isChoose, setIsChoose] = useState(false); // State for Choose checkbox
    const [assignmentType, setAssignmentType] = useState("Quiz"); // State for assignment type

    const handleAddNewClick = () => {
        setShowModal(true); // Open the modal
    };

    const handleCloseModal = () => {
        setShowModal(false); // Close the modal
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = [
        {
            id: 789,
            name: "Samantha William",
            course: "Tajweed Masterclass",
            classType: "Trial Class",
            date: "January 3, 2020",
        },
        {
            id: 789,
            name: "Jordan Nico",
            course: "Tajweed Masterclass",
            classType: "Trial Class",
            date: "January 3, 2020",
        },
        {
            id: 451,
            name: "Nadia Adja",
            course: "Tajweed Masterclass",
            classType: "Group Class",
            date: "January 3, 2020",
        },
        {
            id: 621,
            name: "Nadia Adja",
            course: "Tajweed Masterclass",
            classType: "Group Class",
            date: "January 3, 2020",
        },
        {
            id: 542,
            name: "Nadia Adja",
            course: "Tajweed Masterclass",
            classType: "Regular Class",
            date: "January 3, 2020",
        },
        {
            id: 431,
            name: "Nadia Adja",
            course: "Tajweed Masterclass",
            classType: "Trial Class",
            date: "January 3, 2020",
        },
    ].slice(indexOfFirstItem, indexOfLastItem); // Get current items for the page

    return (
        <BaseLayout4>
            <div className="p-8 min-h-screen mx-auto">
                {/* Header */}
                <h2 className="text-xl font-semibold mb-4">Assignments</h2>

                <div className="flex flex-col gap-6 w-full  mx-auto">
  {/* Top Section with Cards */}
  <div className="flex flex-col lg:flex-row flex-wrap gap-6 justify-center lg:justify-between">
    {/* Profile Card */}
    <div className="relative bg-[#002D62] text-white rounded-xl w-full sm:w-64 px-4 py-4 shadow-md text-center">
      {/* Ribbon badge */}
      <div className="absolute top-2 right-2 w-[50px] h-[50px] rounded-full bg-red-700 flex items-center justify-center z-10">
        <div className="absolute w-10 h-10 rounded-full bg-[#012A4A] flex items-center justify-center z-10">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-[#813300] font-bold text-lg">1</span>
          </div>
          <div className="absolute bottom-[-24px] w-7 h-6 bg-red-700 rounded-b-[2px] [clip-path:polygon(0%_0%,100%_0%,100%_100%,50%_80%,0%_100%)]"></div>
        </div>
      </div>

      <img
        src="/assets/images/avatar.png"
        alt="Profile"
        className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
      />
      <h3 className="font-semibold text-[14px] mb-1">Angela Moss</h3>
      <p className="text-[10px] font-semibold text-cyan-500">Student ID : KOL231231293201</p>
      <p className="text-[10px] font-semibold text-cyan-500 mb-3">Arabic Language</p>

      <div className="flex justify-center mb-2">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <span key={i} className="text-yellow-400 text-lg">★</span>
          ))}
      </div>
      <button className="bg-[#88BADF] text-black font-semibold px-6 py-1 rounded-md text-[12px]">
        View Report
      </button>
    </div>

    {/* Stat Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 flex-1">
      <div className="bg-[#2D49AD] text-white rounded-xl p-4 flex items-center justify-between w-full h-40 shadow-md">
        <div>
          <p className="text-base">Total Assignments</p>
          <h2 className="text-lg font-bold mt-1">100</h2>
        </div>
        <div className="bg-[#8280ff77] p-4 rounded-3xl">
          <PiBookOpenTextFill className="text-[#2742A6]" size={30} />
        </div>
      </div>

      <div className="bg-[#667085] text-white rounded-xl p-4 flex items-center justify-between w-full h-40 shadow-md">
        <div>
          <p className="text-base">Total pending</p>
          <h2 className="text-lg font-bold mt-1">90</h2>
        </div>
        <div className="bg-[#778197] p-4 rounded-3xl">
          <BiSolidTime className="text-[#5D6472]" size={30} />
        </div>
      </div>

      <div className="bg-[#FFFFFF] text-[#6D7D93] rounded-xl p-4 flex items-center justify-between w-full h-40 shadow-md">
        <div>
          <p className="text-base">Total Completed</p>
          <h2 className="text-lg font-bold mt-1">20</h2>
        </div>
        <div className="bg-[#f8f6f6] border border-[#979797] p-4 rounded-3xl">
          <BsCalendar2Check className="text-[#717C92]" size={30} />
        </div>
      </div>
    </div>
  </div>

  {/* Bottom Filter/Action Row */}
  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
    <h3 className="font-semibold text-md text-[#012A4A]">Total Assignments</h3>
    <div className="flex flex-wrap gap-3">
      <button
        onClick={handleAddNewClick}
        className="bg-[#012A4A] px-4 py-2 rounded-lg text-white text-[12px]"
      >
        + Add New
      </button>
      <select className="border px-3 py-2 rounded-lg text-[12px] text-gray-600">
        <option>Last month</option>
        <option>This month</option>
      </select>
    </div>
  </div>
</div>


                {/* Total Assignments Table */}
                <div className="">
                    <div className="overflow-x-auto scrollbar-none mt-4 bg-white rounded-lg border-2 border-[#1C3557] h-full  flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-4"></div>
                        <table className="table-auto w-full">
                            <thead className="border-b-[1px] border-[#1C3557] text-[13px] font-semibold">
                                <tr>
                                    <th className="px-6 py-3 text-center">
                                        ID <FaSort className="inline cursor-pointer text-[10px]" />
                                    </th>
                                    <th className="px-6 py-3 text-center">
                                        Name{" "}
                                        <FaSort className="inline cursor-pointer text-[10px]" />
                                    </th>
                                    <th className="px-6 py-3 text-center">
                                        Courses{" "}
                                        <FaSort className="inline cursor-pointer text-[10px]" />
                                    </th>
                                    <th className="px-6 py-3 text-center">
                                        Class{" "}
                                        <FaSort className="inline cursor-pointer text-[10px]" />
                                    </th>
                                    <th className="px-6 py-3 text-center">
                                        Date{" "}
                                        <FaSort className="inline cursor-pointer text-[10px]" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((row, index) => (
                                    <tr
                                        key={index}
                                        className={`text-[9px] text-center font-medium mt-0 ${index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                                            }`}
                                    >
                                        <td className="px-4 py-2">{row.id}</td>
                                        <td className="px-4 py-2">{row.name}</td>
                                        <td className="px-4 py-2">{row.course}</td>
                                        <td className="px-4 py-2">{row.classType}</td>
                                        <td className="px-4 py-2">{row.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                    />
                </div>

                {/* Modal Form */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                        <div className="bg-white rounded-2xl p-6 w-[400px] max-h-[90vh] overflow-y-auto shadow-xl">
                            <h2 className="text-lg font-semibold mb-4 text-[#012A4A]">
                                Add Assignments
                            </h2>
                            <form>
                                <div className="flex gap-4 mb-4">
                                    <div className="w-1/2">
                                        <label className="block text-[12px] font-medium mb-1 text-[#012A4A]">
                                            Assignment Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder=""
                                            className="block w-full border border-[#808FA4] rounded-lg p-2 text-[12px]"
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-[12px] font-medium mb-1 text-[#012A4A]">
                                            Assignment Type
                                        </label>
                                        <select
                                            className="block w-full border border-[#808FA4] rounded-lg p-2 text-[12px]"
                                            onChange={(e) => setAssignmentType(e.target.value)}
                                        >
                                            <option>Quiz</option>
                                            <option>Reading</option>
                                            <option>Writing</option>
                                            <option>Image Identification</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-4 mb-4">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="choose"
                                            className="mr-2 accent-[#0b2447] text-[12px] py-1"
                                            onChange={() => {
                                                setIsChoose(!isChoose);
                                                if (isTrueFalse) setIsTrueFalse(false);
                                            }}
                                        />
                                        <label
                                            htmlFor="choose"
                                            className="text-[12px] font-medium text-[#012A4A]"
                                        >
                                            Choose
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="tf"
                                            className="mr-2 accent-[#0b2447]"
                                            onChange={() => {
                                                setIsTrueFalse(!isTrueFalse);
                                                if (isChoose) setIsChoose(false);
                                            }}
                                        />
                                        <label
                                            htmlFor="tf"
                                            className="text-[12px] font-medium text-[#012A4A]"
                                        >
                                            True or False
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">
                                        Enter the question
                                    </label>
                                    <textarea
                                        className="block w-full border border-[#808FA4] rounded-lg p-6 text-sm"
                                        rows={2}
                                        placeholder="Enter your question here..."
                                    />
                                </div>
                                <div className="space-y-3 mb-6">
                                    {assignmentType === "Reading" ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="choose"
                                                    className="mr-2 accent-[#0b2447] text-[12px] py-1"
                                                    onChange={() => {
                                                        setIsChoose(!isChoose);
                                                        if (isTrueFalse) setIsTrueFalse(true);
                                                    }}
                                                />
                                                <label htmlFor="choose" className="text-sm font-medium">
                                                    No Option
                                                </label>
                                            </div>

                                            {!isChoose &&
                                                [1, 2, 3, 4].map((num) => (
                                                    <label
                                                        key={num}
                                                        className={`flex w-1/2 ml-24 items-center border rounded-lg px-3 py-2 cursor-pointer transition
            ${selectedOption === num
                                                                ? "border-[#0b2447] bg-[#f0f4fa]"
                                                                : "border-gray-300 bg-white"
                                                            }
          `}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="option"
                                                            checked={selectedOption === num}
                                                            onChange={() => setSelectedOption(num)}
                                                            className="mr-3 accent-[#0b2447]"
                                                        />
                                                        <span className="text-sm font-medium">
                                                            {String.fromCharCode(96 + num)}) Answer {num}
                                                        </span>
                                                        {selectedOption === num && (
                                                            <svg
                                                                className="ml-auto text-[#0b2447]"
                                                                width="20"
                                                                height="20"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <circle
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="10"
                                                                    fill="#0b2447"
                                                                    opacity="0.1"
                                                                />
                                                                <path
                                                                    d="M7 13l3 3 7-7"
                                                                    stroke="#0b2447"
                                                                    strokeWidth="2"
                                                                    fill="none"
                                                                />
                                                            </svg>
                                                        )}
                                                    </label>
                                                ))}
                                        </div>
                                    ) : assignmentType === "Writing" ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="choose"
                                                    className="mr-2 accent-[#0b2447] text-[12px] py-1"
                                                    onChange={() => {
                                                        setIsChoose(!isChoose);
                                                        if (isTrueFalse) setIsTrueFalse(false);
                                                    }}
                                                />
                                                <label htmlFor="choose" className="text-sm font-medium">
                                                    No Option
                                                </label>
                                            </div>
                                            {[1, 2, 3, 4].map((num) => (
                                                <label
                                                    key={num}
                                                    className={`flex w-1/2 ml-24 items-center border rounded-lg px-3 py-2 cursor-pointer transition
                                    ${selectedOption === num
                                                            ? "border-[#0b2447] bg-[#f0f4fa]"
                                                            : "border-gray-300 bg-white"
                                                        }
                                `}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="option"
                                                        checked={selectedOption === num}
                                                        onChange={() => setSelectedOption(num)}
                                                        className="mr-3 accent-[#0b2447]"
                                                    />
                                                    <span className="text-sm font-medium">
                                                        {String.fromCharCode(96 + num)}) Answer {num}
                                                    </span>
                                                    {selectedOption === num && (
                                                        <svg
                                                            className="ml-auto text-[#0b2447]"
                                                            width="20"
                                                            height="20"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                fill="#0b2447"
                                                                opacity="0.1"
                                                            />
                                                            <path
                                                                d="M7 13l3 3 7-7"
                                                                stroke="#0b2447"
                                                                strokeWidth="2"
                                                                fill="none"
                                                            />
                                                        </svg>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    ) : assignmentType === "Image Identification" ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="choose"
                                                    className="mr-2 accent-[#0b2447] text-[12px] py-1"
                                                    onChange={() => {
                                                        setIsChoose(!isChoose);
                                                        if (isTrueFalse) setIsTrueFalse(false);
                                                    }}
                                                />
                                                <label htmlFor="choose" className="text-sm font-medium">
                                                    No Option
                                                </label>
                                            </div>

                                            {[1, 2, 3, 4].map((num) => (
                                                <label
                                                    key={num}
                                                    className={`flex w-1/2 ml-24 items-center border rounded-lg px-3 py-2 cursor-pointer transition
                                    ${selectedOption === num
                                                            ? "border-[#0b2447] bg-[#f0f4fa]"
                                                            : "border-gray-300 bg-white"
                                                        }
                                `}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="option"
                                                        checked={selectedOption === num}
                                                        onChange={() => setSelectedOption(num)}
                                                        className="mr-3 accent-[#0b2447]"
                                                    />
                                                    <span className="text-sm font-medium">
                                                        {String.fromCharCode(96 + num)}) Answer {num}
                                                    </span>
                                                    {selectedOption === num && (
                                                        <svg
                                                            className="ml-auto text-[#0b2447]"
                                                            width="20"
                                                            height="20"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                fill="#0b2447"
                                                                opacity="0.1"
                                                            />
                                                            <path
                                                                d="M7 13l3 3 7-7"
                                                                stroke="#0b2447"
                                                                strokeWidth="2"
                                                                fill="none"
                                                            />
                                                        </svg>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    ) : isTrueFalse ? (
                                        <>
                                            <label className="flex w-1/2 ml-24 items-center border rounded-lg px-3 py-2 cursor-pointer transition border-gray-300 bg-white">
                                                <input
                                                    type="radio"
                                                    name="option"
                                                    checked={selectedOption === 1}
                                                    onChange={() => setSelectedOption(1)}
                                                    className="mr-3 accent-[#0b2447]"
                                                />
                                                <span className="text-sm font-medium">True</span>
                                            </label>
                                            <label className="flex w-1/2 ml-24 items-center border rounded-lg px-3 py-2 cursor-pointer transition border-gray-300 bg-white">
                                                <input
                                                    type="radio"
                                                    name="option"
                                                    checked={selectedOption === 2}
                                                    onChange={() => setSelectedOption(2)}
                                                    className="mr-3 accent-[#0b2447]"
                                                />
                                                <span className="text-sm font-medium">False</span>
                                            </label>
                                        </>
                                    ) : (
                                        [1, 2, 3, 4].map((num) => (
                                            <label
                                                key={num}
                                                className={`flex w-1/2 ml-24 items-center border rounded-lg px-3 py-2 cursor-pointer transition
                                    ${selectedOption === num
                                                        ? "border-[#0b2447] bg-[#f0f4fa]"
                                                        : "border-gray-300 bg-white"
                                                    }
                                `}
                                            >
                                                <input
                                                    type="radio"
                                                    name="option"
                                                    checked={selectedOption === num}
                                                    onChange={() => setSelectedOption(num)}
                                                    className="mr-3 accent-[#0b2447]"
                                                />
                                                <span className="text-sm font-medium">
                                                    {String.fromCharCode(96 + num)}) Answer {num}
                                                </span>
                                                {selectedOption === num && (
                                                    <svg
                                                        className="ml-auto text-[#0b2447]"
                                                        width="20"
                                                        height="20"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            fill="#0b2447"
                                                            opacity="0.1"
                                                        />
                                                        <path
                                                            d="M7 13l3 3 7-7"
                                                            stroke="#0b2447"
                                                            strokeWidth="2"
                                                            fill="none"
                                                        />
                                                    </svg>
                                                )}
                                            </label>
                                        ))
                                    )}
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-[12px]"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-[#0b2447] text-white rounded-lg text-[12px]"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </BaseLayout4>
    );
};
// Pagination Component
const Pagination = ({
    currentPage,
    setCurrentPage,
    totalPages,
}: {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
}) => {
    return (
        <div className="flex justify-between items-center p-3">
            <p className="text-[9px] text-gray-600">
                Showing {currentPage * 6 - 5}-
                {Math.min(currentPage * 6, totalPages * 6)} from {totalPages * 6} data
            </p>
            <div className="flex space-x-2 text-[8px]">
                {/* Previous Button */}
                <button
                    className={`px-2 py-1 rounded ${currentPage === 1
                            ? "bg-gray-100 text-gray-400"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    &lt;
                </button>

                {/* Pagination Numbers */}
                {totalPages > 5 ? (
                    <>
                        <button
                            className={`px-2 py-1 rounded ${currentPage === 1
                                    ? "bg-[#1B2B65] text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                                }`}
                            onClick={() => setCurrentPage(1)}
                        >
                            1
                        </button>
                        {currentPage > 3 && <span className="px-2 py-1">...</span>}
                        {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                            .filter((page) => page > 1 && page < totalPages)
                            .map((page) => (
                                <button
                                    key={page}
                                    className={`px-2 py-1 rounded ${currentPage === page
                                            ? "bg-[#1B2B65] text-white"
                                            : "bg-gray-200 hover:bg-gray-300"
                                        }`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                        {currentPage < totalPages - 2 && (
                            <span className="px-2 py-1">...</span>
                        )}
                        <button
                            className={`px-2 py-1 rounded ${currentPage === totalPages
                                    ? "bg-[#1B2B65] text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                                }`}
                            onClick={() => setCurrentPage(totalPages)}
                        >
                            {totalPages}
                        </button>
                    </>
                ) : (
                    [...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            className={`px-2 py-1 rounded ${currentPage === index + 1
                                    ? "bg-[#1B2B65] text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                                }`}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))
                )}

                {/* Next Button */}
                <button
                    className={`px-2 py-1 rounded ${currentPage === totalPages
                            ? "bg-gray-100 text-gray-400"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default AssignmentsPage;
