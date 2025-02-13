"use client"

import BaseLayout3 from "@/components/BaseLayout3";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { HiOutlineFilter } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";

const feedbackData = [
  {
    id: 1,
    name: "Harry Potter",
    time: "05:30 PM | 06/12/2023",
    message: "jdlkfjdkjdw....",
    className: "Tajweed Masterclass",
    session: "Session-06",
    rating: 4.5,
    avatar: "/assets/images/student-profile.png",
  },
  {
    id: 2,
    name: "Angela Moss",
    time: "05:30 PM | 06/12/2023",
    message: "jdlkfjdkjdw....",
    className: "Arabic Masterclass",
    session: "Session-02",
    rating: 4.5,
    avatar: "/assets/images/student-profile1.png",
  },
  {
    id: 3,
    name: "Flynn Parker",
    time: "05:30 PM | 06/12/2023",
    message: "jdlkfjdkjdw....",
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
    const itemsPerPage = 5; // Changed from 2 to 5
    const totalPages = Math.ceil(feedbackData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = feedbackData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <BaseLayout3>
      <div className="p-6 w-full min-h-screen flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Feedback</h2>

        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-7xl">
          <div className="flex justify-between items-center pb-4">
            <div className="relative w-1/3">
              <FiSearch className="absolute top-3 left-3 text-gray-500" />
              <input
                type="text"
                placeholder="Search here..."
                className="border border-gray-300 rounded-md pl-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button className="bg-[#012A4A] px-4 py-2 rounded-lg flex items-center gap-2 text-white">
              <HiOutlineFilter className="text-xl" /> Filters
            </button>
          </div>

          <div className="w-full">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] font-semibold text-gray-600 py-3 border-b">
              <span className="text-left">Review</span>
              <span className="text-left">Class</span>
              <span className="text-left">Rating</span>
              <span className="text-left">Details</span>
            </div>

            {currentItems.map((item) => (
              <div key={item.id} className="grid grid-cols-[2fr_1fr_1fr_1fr] py-4 items-center border-b">
                <div className="flex items-center gap-3">
                  <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.time}</p>
                    <p className="text-sm text-gray-500 truncate">{item.message}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <img src="/assets/images/image.png" alt="Class" className="w-10 h-10 rounded object-cover" />
                  <p className="text-gray-800 truncate">{item.className}</p>
                </div>

                <div className="flex items-center gap-2">
                  <p className="font-semibold text-lg">{item.rating}</p>
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <FaStar key={i} className={i < Math.floor(item.rating) ? "text-yellow-500" : "text-gray-300"} />
                    ))}
                  </div>
                </div>

                <button className="bg-gray-300 px-2 py-2 rounded-lg text-black font-medium">View Details</button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-4">
                <p className="text-gray-500 text-sm">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, feedbackData.length)} of {feedbackData.length} data
                </p>
                <div className="flex items-center gap-2">
                    <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-gray-400 text-gray-700 disabled:opacity-50"
                    >
                    &lt;
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded ${
                        currentPage === i + 1
                            ? "bg-[#11213d] text-white"
                            : "border border-gray-400 text-gray-700"
                        }`}
                    >
                        {i + 1}
                    </button>
                    ))}
                    <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-gray-400 text-gray-700 disabled:opacity-50"
                    >
                    &gt;
                    </button>
                </div>
                </div>

        </div>
      </div>
    </BaseLayout3>
  );
};

export default FeedbackDetails;
