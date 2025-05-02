"use client";

import BaseLayout4 from "@/components/BaseLayout4";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaFilter,
} from "react-icons/fa";

export interface TransformedUser {
  _id: string;
  academicCoachId: string;
  student: {
    studentId: string;
    studentFirstName: string;
    studentLastName: string;
    studentEmail: string;
    studentGender: string;
    studentPhone: number;
    studentCity: string;
    studentCountry: string;
    studentCountryCode: string;
    learningInterest: string;
    numberOfStudents: number;
    preferredTeacher: string;
    preferredFromTime: string;
    preferredToTime: string;
    timeZone: string;
    referralSource: string;
    preferredDate: string; // ISO Date string
    evaluationStatus: string;
    status: string;
    createdDate: string; // ISO Date string
    createdBy: string;
  };
  teacher: {
    teacherName: string;
  };
  subscription: {
    subscriptionName: string;
  };
  classDay: string[]; // e.g., ["Monday", "Tuesday"]
  startTime: string[]; // e.g., ["09:00", "09:00"]
  endTime: string[]; // e.g., ["09:30", "09:30"]
  isLanguageLevel: boolean;
  languageLevel: string;
  isReadingLevel: boolean;
  readingLevel: string;
  isGrammarLevel: boolean;
  grammarLevel: string;
  hours: number;
  planTotalPrice: number;
  classStartDate: string; // ISO Date string
  classEndDate: string; // ISO Date string
  classStartTime: string;
  classEndTime: string;
  accomplishmentTime: string;
  studentRate: number;
  gardianName: string;
  gardianEmail: string;
  gardianPhone: string;
  gardianCity: string;
  gardianCountry: string;
  gardianTimeZone: string;
  gardianLanguage: string;
  assignedTeacher: string;
  assignedTeacherId: string;
  assignedTeacherEmail: string;
  studentStatus: string;
  classStatus: string;
  comments: string;
  trialClassStatus: string;
  invoiceStatus: string;
  paymentLink: string;
  paymentStatus: string;
  status: string;
  createdDate: string; // ISO Date string
  createdBy: string;
  updatedDate: string; // ISO Date string
  updatedBy: string;
  expectedFinishingDate: number;
  teacherStatus: string;
  __v: number;
}

const Trailclasslist = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState<TransformedUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null)


  const itemsPerPage = 11;

  const getAllUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://api.blackstoneinfomaticstech.com/alltrialclass");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      const pendingClasses = data.evaluation.filter(
        (item: { trialClassStatus: string }) =>
          item.trialClassStatus === "COMPLETED"
      );
      setFilteredUsers(pendingClasses); // Only pending data
      setErrorMessage(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  const router = useRouter();


    useEffect(() => {
      getAllUsers(); // Fetch users when component mounts
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  
    const filteredItems = currentItems.filter((item) => {
      const searchFields = [
        item._id,
        `${item.student.studentFirstName} ${item.student.studentLastName}`,
        item.student.studentPhone,
        item.student.studentCountry,
        item.student.learningInterest,
        item.student.preferredTeacher,
        item.assignedTeacher,
        item.classStartTime,
        item.classStatus,
        item.paymentStatus,
        item.status,
      ];
      return searchFields.some((field) =>
        field
          ? field.toString().toLowerCase().includes(searchTerm.toLowerCase())
          : false
      );
    });
  
    const handleSearch = (query: string) => {
      setSearchQuery(query);
      setCurrentPage(1);
    };

    const goToNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };
  
    const goToPrevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };
  
    const goToPage = (pageNumber: number) => {
      setCurrentPage(pageNumber);
    };
  
    // Calculate page numbers to display
    const getPageNumbers = () => {
      const pageNumbers = [];
      const maxVisiblePages = 5; // Maximum number of page buttons to show
  
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Show first page, current page, and last page with ellipses
        const leftBound = Math.max(1, currentPage - 1);
        const rightBound = Math.min(totalPages, currentPage + 1);
  
        if (leftBound > 1) {
          pageNumbers.push(1);
          if (leftBound > 2) {
            pageNumbers.push(-1); // -1 represents ellipsis
          }
        }
  
        for (let i = leftBound; i <= rightBound; i++) {
          pageNumbers.push(i);
        }
  
        if (rightBound < totalPages) {
          if (rightBound < totalPages - 1) {
            pageNumbers.push(-1); // -1 represents ellipsis
          }
          pageNumbers.push(totalPages);
        }
      }
  
      return pageNumbers;
  };
  


  return (
    <BaseLayout4>
      <div className="py-2 px-4 mx-auto w-full ">
        <div className="flex items-center space-x-2">
          <h2 className="text-[18px] font-semibold ">Scheduled Trial Class</h2>
        </div>
        <div className="flex flex-1 mt-8 space-x-4 items-center justify-between overflow-y-scroll scrollbar-none ">
          <div className="flex">
            <input
              type="text"
              placeholder="Search here..."
              className="border rounded-lg px-2 text-[12px] mr-4 shadow"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <button className="flex items-center bg-gray-200 p-2 rounded-lg shadow text-[12px]">
              <FaFilter className="mr-2" /> Filter
            </button>
          </div>
          <div className="flex">
            <select className="border rounded-lg p-2 shadow text-[12px]">
              <option>Duration: Last month</option>
              <option>Duration: Last week</option>
              <option>Duration: Last year</option>
            </select>
          </div>
        </div>
        <div className="bg-white rounded-lg border-2 border-[#1C3557] h-[580px] overflow-y-scroll scrollbar-none flex flex-col justify-between mt-4">
          <div>
            <div className="overflow-x-auto">
               <table className="min-w-full rounded-lg shadow bg-[#fff]">
                <thead className="border-b-[1px] border-[#1C3557] text-[11px] font-semibold">
                  <tr>
                    {[
                      "Trial ID",
                      "Student Name",
                      "Mobile",
                      "Country",
                      "Course",
                      "Preferred Teacher",
                      "Assigned Teacher",
                      "Time",
                      "Class Status",
                      "Payment Status",
                      "Student Status",
                    ].map((header, i) => (
                      <th
                        key={i}
                        className="p-3 text-center w-[120px] break-words"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-[9px] font-medium">
                  {filteredItems.length > 0 ? (
                    filteredItems.slice(0, 5).map((item, index) => (
                      <tr
                        key={item._id}
                        className={
                          index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                        }
                      >
                        <td className="p-3 text-center break-words">
                          {item._id}
                        </td>
                        <td className="p-3 text-center break-words">
                          {item.student.studentFirstName}{" "}
                          {item.student.studentLastName}
                        </td>
                        <td className="p-3 text-center break-words">
                          {item.student.studentPhone}
                        </td>
                        <td className="p-3 text-center break-words">
                          {item.student.studentCountry}
                        </td>
                        <td className="p-3 text-center break-words">
                          {item.student.learningInterest}
                        </td>
                        <td className="p-3 text-center break-words">
                          {item.student.preferredTeacher}
                        </td>
                        <td className="p-3 text-center break-words">
                          {item.assignedTeacher}
                        </td>
                        <td className="p-3 text-center break-words">
                          {item.classStartTime}
                        </td>
                        {/* Trial Class Status */}
                        <td className="p-3 text-center break-words">
                          <span
                            className={`min-w-[60px] inline-block text-[7px] text-center py-[3px] rounded-md ${
                              item.trialClassStatus === "COMPLETED"
                                ? "bg-yellow-100 text-yellow-800 border border-yellow-900 px-3"
                                : "bg-green-100 text-green-800 border border-green-900 px-2"
                            }`}
                          >
                            {item.trialClassStatus}
                          </span>
                        </td>
                        {/* Payment Status */}
                        <td className="p-3 text-center break-words">
                          <span
                            className={`min-w-[60px] inline-block text-[7px] text-center py-[3px] rounded-md ${
                              item.paymentStatus === "PAID"
                                ? "bg-yellow-100 text-yellow-800 border border-yellow-900 px-3"
                                : "bg-green-100 text-green-800 border border-green-900 px-2"
                            }`}
                          >
                            {item.paymentStatus}
                          </span>
                        </td>
                        {/* Account Status */}
                        <td className="p-3 text-center break-words">
                          <span
                            className={`min-w-[60px] inline-block text-[7px] text-center py-[3px] rounded-md ${
                              item.status === "Active"
                                ? "bg-yellow-100 text-yellow-800 border border-yellow-900 px-3"
                                : "bg-green-100 text-green-800 border border-green-900 px-2"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="p-4 text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex items-center justify-between p-4">
            <p className="text-[11px] text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{" "}
              {filteredUsers.length} data
            </p>

            <div className="flex items-center space-x-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`p-1 rounded-lg shadow text-[10px] ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-900"
                }`}
              >
                <FaChevronLeft size={8} />
              </button>

              {getPageNumbers().map((pageNumber, index) =>
                pageNumber === -1 ? (
                  <span key={index} className="px-2">
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => goToPage(pageNumber)}
                    className={`w-5 h-5 rounded-lg shadow text-[11px] ${
                      currentPage === pageNumber
                        ? "bg-gray-800 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              )}

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-1 rounded-lg shadow text-[10px] ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-900"
                }`}
              >
                <FaChevronRight size={8} />
              </button>
            </div>
          </div>
        </div>
      </div>

    </BaseLayout4>
  );
};

export default Trailclasslist;
