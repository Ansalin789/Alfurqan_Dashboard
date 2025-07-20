"use client";

import { useState, useEffect } from "react";
import Modal from "react-modal";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Pagination from "@/components/Pagination";

import Dashboard from "../../components/evaluationcard";
import BaseLayout4 from "@/components/BaseLayout4";
import { MdTune } from "react-icons/md";
import axios from "axios";
import AdminHeader from "../../components/AdminHeader";

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

const TrailSection = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<TransformedUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();
  useEffect(() => {
    Modal.setAppElement("body");
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("AdminAuthToken")
        : null;

    if (!token) {
      console.error("❌ AdminAuthToken not found");
      return;
    }
    if (token) {
      getAllUsers(token); // call your function with token
    } else {
      console.log("No auth token found.");
    }
  }, []);
  // Fetch API Data
  const getAllUsers = async (token: string) => {
    try {
      if (!token) {
        setErrorMessage("Authentication token missing. Please log in again.");
        setIsLoading(false);
        return;
      }
      const adminId = localStorage.getItem("AdminPortalId");
      // setIsLoading(true);
      const response = await axios.get(
        `https://api.blackstoneinfomaticstech.com/alltrialclass`,
        {
          params: { adminId: adminId },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Raw API Response:", JSON.stringify(response.data, null, 2));
      if (!response) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.data;
      setFilteredUsers(data.evaluation); // Show all data
      setErrorMessage(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchTerm(query);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

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

  return (
    <BaseLayout4>
      <AdminHeader currentSection="Trail Management" />
      <div className="h-full w-full py-2 md:mr-10 scrollbar-none">
        <div className="w-full bg-[#FAFAFB] rounded-lg dark:bg-[#343434]">
          <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434]">
            <div className="flex items-center gap-2 text-sm text-gray-500 px-2">
              <Search className="w-3 h-3 text-gray-400 dark:text-gray-400 -mt-[1px]" />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none text-[12px] w-52 py-3"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div
              className="flex items-center gap-2 text-[12px] text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <MdTune className="w-4 h-4" />
              <span>Filter</span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-gray-400 dark:text-gray-400">
              <span className="text-left -ml-60 ">
                Showing {filteredUsers.length === 0 ? 0 : indexOfFirstItem + 1}{" "}
                to {Math.min(indexOfLastItem, filteredUsers.length)} of{" "}
                {filteredUsers.length}
              </span>
            </div>
          </div>

          {/* Table Section */}
          <table
            className="table-auto w-full"
            style={{ width: "100%", tableLayout: "fixed" }}
          >
              <thead className="text-[11px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
              <tr className="font-medium">
              {[
                  { label: "Trial ID", width: "w-[10%]" },
                  { label: "Student Name", width: "w-[12%]" },
                  { label: "Contact", width: "w-[10%]" },
                  { label: "Country", width: "w-[8%]" },
                  { label: "Course", width: "w-[10%]" },
                  { label: "Preferred Teacher", width: "w-[10%]" },
                  { label: "Assigned Teacher", width: "w-[10%]" },
                  { label: "Date", width: "w-[10%]" },
                  { label: "Time", width: "w-[10%]" },
                ].map((header, i) => (
                  <th
                    key={header.label}
                    className={`text-left px-3 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0] break-words ${header.width}`}
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
                    className={`text-[11px] ${
                      index % 2 === 0 ? "bg-[#fff] dark:bg-[#2C2C2C] "
                                : "bg-[#F8F8F8] dark:bg-[#303030]"
                    }`}
                  >
                    <td className="px-3 py-2 text-[#010E30E5] dark:text-white text-[10px] break-words w-[10%]">
                      {item._id}
                    </td>
                    <td className="px-5 py-2 text-[#3D8FDE] font-medium text-left text-[10px] break-words w-[12%]">
                      {item.student.studentFirstName}{" "}
                      {item.student.studentLastName}
                    </td>
                    <td className="px-3 py-2 text-[#010E30E5] dark:text-white text-[10px] break-words w-[10%]">
                      {item.student.studentPhone}
                    </td>
                    <td className="px-3 py-2 text-[#010E30E5] dark:text-white text-[10px] w-[8%]">
                      {item.student.studentCountry}
                    </td>
                    <td className="px-3 py-2 text-[#010E30E5] dark:text-white text-[10px] w-[10%]">
                      {item.student.learningInterest}
                    </td>
                    <td className="px-3 py-2 text-[#010E30E5] dark:text-white text-[10px] w-[10%]">
                      {item.student.preferredTeacher}
                    </td>
                    <td className="px-3 py-2 text-[#010E30E5] dark:text-white text-[10px] w-[10%]">
                      {item.assignedTeacher}
                    </td>
                    <td className="px-3 py-2 text-[#010E30E5] dark:text-white text-[10px] w-[8%]">
                      {item.classStartDate
                        ? new Date(item.classStartDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : ""}
                    </td>
                    <td className="px-3 py-2 text-[#010E30E5] dark:text-white text-[10px] w-[8%]">
                      {item.classStartTime}
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
        {/* Pagination */}
        <div className="">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredUsers.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </BaseLayout4>
  );
};

export default TrailSection;
