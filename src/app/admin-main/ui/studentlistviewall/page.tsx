"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaFilter } from "react-icons/fa";
import BaseLayout4 from "@/components/BaseLayout4";
import axios from "axios";
import AdminHeader from "../../components/AdminHeader";
import Pagination from "@/components/Pagination";
import { Search } from "lucide-react";
import { MdTune } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";

export interface StudentInfo {
  studentId: string;
  studentEmail: string;
  studentPhone: number;
  gender: string;
  package: string;
  course: string;
  city: string;
  country: string;
}

export interface Student {
  evaluation: any;
  _id: string;
  student: StudentInfo;
  username: string;
  password: string;
  teacherName: string;
  joiningDate: string; // ✅ should be string, not number
  role: string;
  status: string;
  createdDate: string; // ISO string
  createdBy: string;
  updatedDate: string;
  __v: number;
  classScheduleCount: number;
  level: number;
}

export interface StudentsResponse {
  students: Student[];
}


const TrailManagement = () => {
  const [openPopup, setOpenPopup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Fetch students data from API
  const [students, setStudents] = useState<Student[]>([]); // Initialize as an empty array
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const search = searchQuery.toLowerCase();
  
    const filtered = students.filter((student) => {
      const joiningDate = student.evaluation?.[0]?.joiningDate;
      const formattedJoiningDate = joiningDate
        ? new Date(joiningDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).toLowerCase()
        : "";
  
      return (
        student._id?.toLowerCase().includes(search) ||
        student.username?.toLowerCase().includes(search) ||
        student.teacherName?.toLowerCase().includes(search) ||
        student.student.course?.toLowerCase().includes(search) ||
        student.student.studentPhone?.toString().includes(search) ||
        student.classScheduleCount?.toString().includes(search) ||
        formattedJoiningDate.includes(search) ||
        (student.level !== null &&
          student.level !== undefined &&
          student.level.toString().includes(search))
      );
    });
  
    setFilteredStudents(filtered);
    setCurrentPage(1); // Reset to page 1 when search changes
  }, [searchQuery, students]);
  useEffect(() => {
    const search = searchQuery.toLowerCase();
  
    const filtered = students.filter((student) => {
      const joiningDate = student.evaluation?.[0]?.joiningDate;
      const formattedJoiningDate = joiningDate
        ? new Date(joiningDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).toLowerCase()
        : "";
  
      return (
        student._id?.toLowerCase().includes(search) ||
        student.username?.toLowerCase().includes(search) ||
        student.teacherName?.toLowerCase().includes(search) ||
        student.student.course?.toLowerCase().includes(search) ||
        student.student.studentPhone?.toString().includes(search) ||
        student.classScheduleCount?.toString().includes(search) ||
        formattedJoiningDate.includes(search) ||
        (student.level !== null &&
          student.level !== undefined &&
          student.level.toString().includes(search))
      );
    });
  
    setFilteredStudents(filtered);
    setCurrentPage(1); // Reset to page 1 when search changes
  }, [searchQuery, students]);
    

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("AdminAuthToken")
        : null;

    if (!token) {
      console.error("❌ AdminAuthToken not found");
      return;
    }
    if (token) {
      fetchStudents(token); // call your function with token
    } else {
      console.log("No auth token found.");
    }
  }, []);
  const fetchStudents = async (token: string) => {
    try {
      const response = await axios.get(
        "http://localhost:5001/alstudents",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const uniqueStudentsMap = new Map();
      response.data.students.forEach((student: Student) => {
        uniqueStudentsMap.set(student.student.studentId, student);
      });

      const uniqueStudents = Array.from(uniqueStudentsMap.values());

      // Sort in a separate step
      const sortedStudents = uniqueStudents.sort(
        (a, b) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );

      setStudents(sortedStudents);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudent = filteredStudents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setOpenPopup(null);
    }
  };

  useEffect(() => {
    if (openPopup !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openPopup]);

  const handleViewDetails = (studentId: string) => {
    router.push(`/admin-main/ui/studentlist?studentId=${studentId}`);
  };

  return (
    <BaseLayout4>
      <AdminHeader currentSection="Student Lists" />

      <div className="w-full mx-auto bg-[#FAFAFB] rounded-lg">
        {/* Top Bar: Search / Filter / Showing Info */}
        <div className="w-full bg-[#FAFAFB] dark:bg-[#343434] rounded-t-lg flex justify-between items-center px-4 py-0">
          {/* Search */}
          <div className="flex justify-between items-center px-4 py-0">
            <Search className="w-3 h-3 text-gray-400 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search by keyword"
              className="bg-transparent outline-none text-[12px] ml-1 w-52 py-3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter */}
          <div className="flex justify-left gap-2 text-[12px] text-gray-500 dark:border-[#606060] border-r-2 border-l-2 px-48 cursor-pointer">
            <MdTune className="w-4 h-4" />
            <span>Filter</span>
          </div>

          {/* Showing Info */}
          <div className="text-[12px] justify-left text-gray-500">
            Showing{" "}
            {Math.min(startIndex + itemsPerPage, filteredStudents.length)} of{" "}
            {filteredStudents.length}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full max-w-[1255px] rounded-b-lg bg-white border border-gray-200">
          <table className="w-full min-w-[900px] text-[12px] table-auto">
            <thead className="bg-[#4C6993] text-white justify-left sticky top-0">
              <tr>
                {[
                  "Student ID",
                  "Student Name",
                  "Date of Joining",
                  "Teacher Name",
                  "Course Name",
                  "Contact",
                  "Scheduled Classes",
                  "Level",
                  "Action",
                ].map((header) => (
                  <th
                    key={header}
                    className="py-4 px-2 font-semibold text-[12px] text-left"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedStudent.length > 0 ? (
                paginatedStudent.map((student, index) => (
                  <tr
                    key={student.student.studentId}
                    className={`${
                      index % 2 === 0 ? "bg-[#FAFAFB]" : "bg-[#F1F3F9]"
                    } text-center text-[11px]`}
                  >
                    <td className="py-3 px-2 text-left ">{student._id}</td>
                    <td className="py-3 px-2 text-left text-blue-600 cursor-pointer">
                      {student.username}
                    </td>
            <td className="py-3 px-2 text-left">
  {new Date(student.evaluation[0].joiningDate).toString() !== "Invalid Date"
    ? new Date(student.evaluation[0].joiningDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : ""} {/* Display "N/A" if the date is invalid */}
</td>

                    <td className="py-3 px-2 text-left">{student.teacherName}</td>
                    <td className="py-3 px-2 text-left">
                      {student.student.course}
                    </td>
                    <td className="py-3 px-2 text-left">
                      {student.student.studentPhone}
                    </td>
                    <td className="py-3 px-2 text-left">
                      {student.classScheduleCount}
                    </td>
                    <td className="py-3 px-2 text-left">{student.level}</td>
                    <td className="py-3 px-2 text-left relative">
                      <div className="relative inline-block">
                        <button
                          className="text-gray-600 hover:text-black"
                          onClick={() =>
                            setOpenPopup(
                              openPopup === student._id ? null : student._id
                            )
                          }
                        >
                          <BsThreeDotsVertical />
                        </button>
                        {openPopup === student._id && (
                          <div
                            ref={popupRef}
                            className="absolute right-0 mt-2 w-32 bg-white shadow-md border rounded-lg z-50 text-[11px]"
                          >
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-100"
                              onClick={() => handleViewDetails(student._id)}
                            >
                              View Details
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                              Edit
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-4 text-center text-gray-400">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredStudents.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />
    </BaseLayout4>
  );
};

export default TrailManagement;
