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
import { Search } from "lucide-react";
import { MdTune } from "react-icons/md";
import Pagination from "@/components/Pagination";
import AcademicHeader from "@/app/Academic-coach/components/academicHeader";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const token =
    typeof window !== "undefined" ? localStorage.getItem("AdminAuthToken") : null;

  if (!token) {
    console.error("❌ AdminAuthToken not found");
    return;
  }
    if (token) {
      getAllUsers(token); // Or call the function that performs the GET request
    } else {
      console.log("No auth token found.");
    }
  }, []);
  const getAllUsers = async (token: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("https://api.blackstoneinfomaticstech.com/alltrialclass",{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
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


  // Filtering logic
  const filteredItemsAll = filteredUsers.filter((item) => {
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
        ? field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        : false
    );
  });

  const totalPages = Math.ceil(filteredItemsAll.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredItems = filteredItemsAll.slice(indexOfFirstItem, indexOfLastItem);
  
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
    <AcademicHeader currentSection="Scheduled Trail Class" />
      <div className="py-2 px-4 mx-auto w-full ">
        <div className="w-full bg-[#FAFAFB] rounded-lg dark:bg-[#343434] mt-4">
          <div className="flex justify-between items-center p-2 -ml-2">
            <div className="flex items-center gap-2 text-sm text-gray-500 px-2">
              <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none text-[15px] w-52 py-3"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 ml-48 cursor-pointer">
              <MdTune className="w-4 h-4" />
              <span>Filter</span>
            </div>
            <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
              <span className="text-left ml-60 ">
                Showing {filteredItemsAll.length === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItemsAll.length)} of {filteredItemsAll.length}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full table-fixed">
              <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                <tr>
                  {[
                    { label: "Trial ID", width: "w-[10%]" },
                    { label: "Student Name", width: "w-[12%]" },
                    { label: "Mobile", width: "w-[10%]" },
                    { label: "Country", width: "w-[8%]" },
                    { label: "Course", width: "w-[10%]" },
                    { label: "Preferred Teacher", width: "w-[10%]" },
                    { label: "Assigned Teacher", width: "w-[10%]" },
                    { label: "Date", width: "w-[10%]" },
                    { label: "Time", width: "w-[10%]" },
                    { label: "Class Status", width: "w-[8%]" },
                    { label: "Student Status", width: "w-[10%]" },
                    { label: "Payment Status", width: "w-[8%]" },

                  ].map((header, i) => (
                    <th
                      key={header.label}
                      className={`px-3 py-2 text-left font-medium border border-[#4C6993] dark:border-[#6087C0] break-words ${header.width}`}
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <tr
                      key={item._id}
                      className={`text-[12px] ${
                        index % 2 === 0 ? "bg-[#fff]" : "bg-[#F8F8F8]"
                      }`}
                    >
                      <td className="px-3 py-2 text-[#010E30E5] text-[11px] break-words w-[10%]">
                        {item._id}
                      </td>
                      <td className="px-5 py-2 text-[#3D8FDE] font-medium text-left text-[11px] break-words w-[12%]">
                        {item.student.studentFirstName} {item.student.studentLastName}
                      </td>
                      <td className="px-3 py-2 text-[#010E30E5] text-[11px] break-words w-[10%]">
                        {item.student.studentPhone}
                      </td>
                      <td className="px-3 py-2 text-[#010E30E5] text-[11px] w-[8%]">
                        {item.student.studentCountry}
                      </td>
                      <td className="px-3 py-2 text-[#010E30E5] text-[11px] w-[10%]">
                        {item.student.learningInterest}
                      </td>
                      <td className="px-3 py-2 text-[#010E30E5] text-[11px] w-[10%]">
                        {item.student.preferredTeacher}
                      </td>
                      <td className="px-3 py-2 text-[#010E30E5] text-[11px] w-[10%]">
                        {item.assignedTeacher}
                      </td>
                      <td className="px-3 py-2 text-[#010E30E5] text-[11px] w-[8%]">
                        {item.classStartDate
                          ? new Date(item.classStartDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : ""}
                      </td>
                      <td className="px-3 py-2 text-[#010E30E5] text-[11px] w-[8%]">
                        {item.classStartTime}
                      </td>
                      {/* Class Status */}
                      <td className="px-3 py-2 text-[11px]">
                        <span
                          className={`px-1 text-[10px] text-center py-[3px] rounded-md ${
                            item.trialClassStatus === "COMPLETED"
                              ? "bg-[#ECFDF3] text-[#377E36] px-2 border border-[#377E36]"
                              : item.trialClassStatus === "INPROGRESS"
                              ? "bg-[#FDECEC] text-[#D34645] px-3 border border-[#D34645]"
                              : "bg-[#FDF6EC] text-[#F0AD4E] px-3 border border-[#F0AD4E]"
                          }`}
                        >
                          {item.trialClassStatus}
                        </span>
                      </td>
                      
                      {/* Student Status */}
                      <td className="px-3 py-2 text-[11px]">
                        <span
                          className={`px-1 text-[10px] text-center py-[3px] rounded-md ${
                            item.status === "Active"
                              ? "bg-[#ECFDF3] text-[#377E36] px-3 border border-[#377E36]"
                              : item.status === "PENDING"
                              ? "bg-[#FDF6EC] text-[#F0AD4E] px-3 border border-[#F0AD4E]"
                              : "bg-[#FDECEC] text-[#D34645] px-3 border border-[#D34645]"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      {/* Payment Status */}
                      <td className="px-3 py-2 text-[11px]">
                        <span
                          className={`px-1 text-[10px] text-center py-[3px] rounded-md ${
                            item.paymentStatus === "PAID"
                              ? "bg-[#ECFDF3] text-[#377E36] px-4 border border-[#377E36]"
                              : item.paymentStatus === "PENDING"
                              ? "bg-[#FDF6EC] text-[#F0AD4E] px-3 border border-[#F0AD4E]"
                              : "bg-[#FDECEC] text-[#D34645] px-3 border border-[#D34645]"
                          }`}
                        >
                          {item.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={12} className="p-4 text-center">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

    </BaseLayout4>
  );
};

export default Trailclasslist;
