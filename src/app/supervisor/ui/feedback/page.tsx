"use client";

import BaseLayout3 from "@/components/BaseLayout3";
import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { HiOutlineFilter } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import axios from "axios";

// Define the interface for API response
interface SupervisorFeedback {
  _id: string;
  supervisor?: {
    supervisorFirstName: string;
    supervisorLastName: string;
    supervisorEmail: string;
  };
  teacher?: {
    teacherName: string;
    teacherEmail: string;
  };
  course?: {
    courseName: string;
  };
  supervisorRating?: {
    knowledgeofstudentsandcontent: number;
    assessmentofstudents: number;
    communicationandcollaboration: number;
    professionalism: number;
  };
  feedbackmessage?: string;
  createdDate?: string;
  startTime?: string;
}

// Define API Response Structure
interface ApiResponse {
  totalCount: number;
  applicants: SupervisorFeedback[];
}

const FeedbackDetails = () => {
  const [feedbackData, setFeedbackData] = useState<SupervisorFeedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [filterCriteria, setFilterCriteria] = useState<{ review: string; className: string }>({
    review: "",
    className: "",
  });
console.log(isPopupOpen);
  const itemsPerPage = 5;

  // Fetch API data
  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        const supervisorId = localStorage.getItem("SupervisorPortalId");

        if (!supervisorId) {
          console.error("No Supervisor ID found in localStorage");
          setFeedbackData([]);
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5001/supervisorfeedback", {
          params: { supervisorId },
        });

        if (Array.isArray(response.data.applicants)) {
          setFeedbackData(response.data.applicants);
        } else {
          setFeedbackData([]);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setFeedbackData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // Filter Data
  const filteredData = feedbackData.filter((item) =>
    (item.feedbackmessage?.toLowerCase() ?? "").includes(filterCriteria.review.toLowerCase()) ||
    (item.course?.courseName?.toLowerCase() ?? "").includes(filterCriteria.className.toLowerCase())
  );

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (loading) return <p className="text-center">Loading feedback...</p>;

  return (
    <BaseLayout3>
      <div className="p-8 mx-auto w-[1250px] pr-16">
        <h2 className="text-2xl font-semibold text-gray-800 p-2 mb-8">Feedback</h2>

        <div className="bg-white rounded-lg border-2 border-[#1C3557] h-[450px] flex flex-col justify-between">
          <div className="flex justify-between items-center p-2">
            <div className="relative w-40 ml-2 mt-2">
              <FiSearch className="absolute top-[6px] left-2 text-gray-500" />
              <input
                type="text"
                placeholder="Search here..."
                className="border border-gray-300 rounded-lg pl-10 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-[12px]"
                onChange={(e) => setFilterCriteria({ ...filterCriteria, review: e.target.value })}
              />
            </div>
            <button
              className="bg-[#012A4A] text-[12px] px-3 py-1 rounded-lg flex items-center gap-2 text-white"
              onClick={() => setIsPopupOpen(true)}
            >
              <HiOutlineFilter className="text-[12px]" /> Filters
            </button>
          </div>

          {/* Feedback List */}
          <div className="w-full">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] font-semibold text-gray-600 py-3 px-3 border-b">
              <span className="text-left text-[13px] text-[#012a4a]">Review</span>
              <span className="text-left text-[13px] text-[#012a4a]">Class</span>
              <span className="text-left text-[13px] text-[#012a4a]">Rating</span>
              <span className="text-left text-[13px] text-[#012a4a]">Details</span>
            </div>

            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <div
                  key={item._id}
                  className={`grid grid-cols-[2fr_1fr_1fr_1fr] py-2 items-center ${
                    index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                  }`}
                >
                  <div className="flex items-center gap-3 pl-4">
                    <img
                      src="/assets/images/student-profile1.png"
                      alt="Teacher Avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate text-[13px]">
                        {item.teacher?.teacherName ?? "Unknown Teacher"}
                      </p>
                      <p className="text-gray-500 text-[10px]">
                        {item.createdDate ? new Date(item.createdDate).toLocaleString() : "No Date"}
                      </p>
                      <p className="text-gray-700 truncate text-[12px]">
                        {item.feedbackmessage ?? "No feedback available"}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-800 truncate text-[13px]">
                    {item.course?.courseName ?? "No class info"}
                  </p>

                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[13px]">4.5</p>
                    <FaStar className="text-yellow-500" />
                  </div>

                  <div className="flex justify-left">
                    <button className="px-3 py-1 text-[12px] font-semibold text-white bg-[#012A4A] rounded-md">
                      Active
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center p-4">No matching feedback found.</p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between gap-4 mt-4 px-3">
            <span className="text-[12px] text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredData.length)} from {filteredData.length} data
            </span>

            <div className="flex items-center">
              <button className="px-2 py-1 text-gray-400" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                &lt;
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button key={i + 1} className={`w-5 h-5 rounded-md text-[12px] ${currentPage === i + 1 ? "bg-[#012A4A] text-white" : "bg-gray-100 text-gray-700"}`} onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>
              ))}

              <button className="px-2 py-1 text-gray-400" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
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
