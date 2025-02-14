"use client"

import BaseLayout3 from "@/components/BaseLayout3";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { HiOutlineFilter } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";

const data = [
  {
    id: 1,
    name: "Harry Potter",
    time: "05:30 PM | 06/12/2023",
    message: "Excellent class!",
    className: "Tajweed Masterclass",
    session: "Session-06",
    rating: 4.5,
    avatar: "/assets/images/student-profile.png",
  },
  {
    id: 2,
    name: "Angela Moss",
    time: "05:30 PM | 06/12/2023",
    message: "Great session!",
    className: "Arabic Masterclass",
    session: "Session-02",
    rating: 4.5,
    avatar: "/assets/images/student-profile1.png",
  },
  {
    id: 3,
    name: "Flynn Parker",
    time: "05:30 PM | 06/12/2023",
    message: "Good session!",
    className: "Quran Masterclass",
    session: "Session-12",
    rating: 4.5,
    avatar: "/assets/images/student-profile.png",
  },
  {
    id: 4,
    name: "John Doe",
    time: "04:00 PM | 07/12/2023",
    message: "Great session!",
    className: "Islamic Studies",
    session: "Session-08",
    rating: 5,
    avatar: "/assets/images/student-profile1.png",
  },
];

const FeedbackDetails = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState({ review: "", className: "", rating: "" });

    const itemsPerPage = 5;
    const dataToShow = data.filter(item => 
        item.name.toLowerCase().includes(filterCriteria.review.toLowerCase()) ||
        item.className.toLowerCase().includes(filterCriteria.className.toLowerCase()) ||
        item.rating.toString().includes(filterCriteria.rating)
    );

    const paginatedData = dataToShow.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataToShow.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(dataToShow.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
          setCurrentPage(pageNumber);
        }
      };

    const handleFilterChange = () => {
        setFilter(JSON.stringify(filterCriteria));
        setCurrentPage(1);
        setIsPopupOpen(false);
    };

  return (
    <BaseLayout3>
      <div className="p-8 mx-auto w-[1250px] pr-16">
        <h2 className="text-2xl font-semibold text-gray-800 p-2 mb-8">Feedback</h2>

        <div className="bg-white rounded-lg border-2 border-[#1C3557] h-[450px]  flex flex-col justify-between">
          <div className="flex justify-between items-center p-2">
            <div className="relative w-40 ml-2 mt-2">
              <FiSearch className="absolute top-[6px] left-2 text-gray-500" />
              <input
                type="text"
                placeholder="Search here..."
                className="border border-gray-300 rounded-lg pl-10 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-[12px]"
              />
            </div>
            <button 
                className="bg-[#012A4A] text-[12px] px-3 py-1 rounded-lg flex items-center gap-2 text-white"
                onClick={() => setIsPopupOpen(true)}
            >
                <HiOutlineFilter className="text-[12px]" /> Filters
            </button>
          </div>

          {/* Popup for filtering */}
          {isPopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-5 rounded-lg shadow-lg">
                    <h3 className="text-[17px] text-center font-semibold mb-4">Filter Feedback</h3>
                    <div>
                        <label className="block mb-2 text-[14px]">Review:</label>
                        <input 
                            type="text" 
                            value={filterCriteria.review} 
                            onChange={(e) => setFilterCriteria({ ...filterCriteria, review: e.target.value })} 
                            className="border border-gray-300 rounded-lg p-2 w-full mb-4"
                        />
                        <label className="block mb-2 text-[14px]">Class:</label>
                        <input 
                            type="text" 
                            value={filterCriteria.className} 
                            onChange={(e) => setFilterCriteria({ ...filterCriteria, className: e.target.value })} 
                            className="border border-gray-300 rounded-lg p-2 w-full mb-4"
                        />
                        <label className="block mb-2 text-[14px]">Rating:</label>
                        <input 
                            type="text" 
                            value={filterCriteria.rating} 
                            onChange={(e) => setFilterCriteria({ ...filterCriteria, rating: e.target.value })} 
                            className="border border-gray-300 rounded-lg p-2 w-full mb-4"
                        />
                    </div>
                    <button 
                        className="bg-[#012A4A] text-white px-3 py-2 rounded-lg text-[12px] ml-6"
                        onClick={handleFilterChange}
                    >
                        Apply Filter
                    </button>
                    <button 
                        className="bg-gray-300 text-black px-3 py-2 rounded-lg text-[12px] ml-2"
                        onClick={() => setIsPopupOpen(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
          )}

          <div className="w-full">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] font-semibold text-gray-600 py-3 px-3 border-b">
              <span className="text-center text-[13px] text-[#012a4a]">Review</span>
              <span className="text-center text-[13px] text-[#012a4a]">Class</span>
              <span className="text-center text-[13px] text-[#012a4a]">Rating</span>
              <span className="text-center text-[13px] text-[#012a4a]">Details</span>
            </div>

            {currentItems.map((item, index) => (
              <div key={item.id} className={`grid grid-cols-[2fr_1fr_1fr_1fr] py-2 items-center ${index % 2 === 0 ? 'bg-[#faf9f9]' : 'bg-[#ebebeb]'}`}>
                <div className="flex items-center gap-3 pl-4 ml-36">
                  <img src={item.avatar} alt={item.name} className="w-6 h-6 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate text-[13px]">{item.name}</p>
                    <p className="text-gray-500 text-[10px]">{item.time}</p>
                    <p className="text-gray-700 truncate text-[12px]">{item.message}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-6">
                  <img src="/assets/images/dashdash.png" alt="Class" className="w-6 h-6 rounded object-cover"/>
                  <p className="text-gray-800 truncate text-[13px]">{item.className}</p>
                </div>

                <div className="flex items-center gap-2 ml-14">
                  <p className="font-semibold text-[13px]">{item.rating}</p>
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <FaStar key={i} className={i < Math.floor(item.rating) ? "text-yellow-500" : "text-gray-300"} />
                    ))}
                  </div>
                </div>

                <button className="bg-gray-300 px-2 py-2 ml-10 rounded-lg text-black font-medium text-[13px] w-36">View Details</button>
              </div>
            ))}
          </div>

            <div>
                <div className="flex justify-between items-center p-4">
                <p className="text-[10px] text-gray-600">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, dataToShow.length)} from {dataToShow.length} data
                </p>
                <div className="flex space-x-2 text-[10px]">
                    {/* Previous Button */}
                    <button
                    className={`px-2 py-1 rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300'}`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    >
                    &lt;
                    </button>

                    {/* Pagination Numbers */}
                    {totalPages > 5 ? (
                    <>
                        {/* First Page */}
                        <button
                        className={`px-2 py-1 rounded ${
                            currentPage === 1 ? 'bg-[#1B2B65] text-white' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        onClick={() => handlePageChange(1)}
                        >
                        1
                        </button>

                        {/* Left Ellipsis */}
                        {currentPage > 3 && <span className="px-2 py-1">...</span>}

                        {/* Pages Around Current */}
                        {Array.from(
                        { length: 3 },
                        (_, i) => currentPage - 1 + i
                        )
                        .filter((page) => page > 1 && page < totalPages)
                        .map((page) => (
                            <button
                            key={page}
                            className={`px-2 py-1 rounded ${
                                currentPage === page ? 'bg-[#1B2B65] text-white' : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                            onClick={() => handlePageChange(page)}
                            >
                            {page}
                            </button>
                        ))}

                        {/* Right Ellipsis */}
                        {currentPage < totalPages - 2 && <span className="px-2 py-1">...</span>}

                        {/* Last Page */}
                        <button
                        className={`px-2 py-1 rounded ${
                            currentPage === totalPages ? 'bg-[#1B2B65] text-white' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        onClick={() => handlePageChange(totalPages)}
                        >
                        {totalPages}
                        </button>
                    </>
                    ) : (
                    // Display all pages when totalPages <= 5
                    [...Array(totalPages)].map((_, index) => (
                        <button
                        key={index + 1}
                        className={`px-2 py-1 rounded ${
                            currentPage === index + 1 ? 'bg-[#1B2B65] text-white' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        onClick={() => handlePageChange(index + 1)}
                        >
                        {index + 1}
                        </button>
                    ))
                    )}

                    {/* Next Button */}
                    <button
                    className={`px-2 py-1 rounded ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300'}`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    >
                    &gt;
                    </button>
                </div>
                </div>
            </div>
        </div>
      </div>
    </BaseLayout3>
  );
};

export default FeedbackDetails;
