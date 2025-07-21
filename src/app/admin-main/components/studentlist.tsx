"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaFilter } from "react-icons/fa";
import axios from "axios";
import { Search, MoreVertical } from "lucide-react";
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
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [isFilterPopupOpen, setFilterPopupOpen] = useState(false);
  
  // const handleFilterChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setFilterCriteria((prev) => ({ ...prev, [name]: value }));
  // };
  

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("AdminAuthToken");
      if (token) {
        fetchStudents(token); // pass token into the function
      } else {
        console.log("No auth token found.");
      }
    }
  }, []);

  const fetchStudents = async (token: string) => {
    try {
      const response = await axios.get(
        "http://localhost:5001/alstudents",
        {
          method: "GET",
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

      const sorted = uniqueStudents.sort(
        (a, b) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );

      setAllStudents(sorted); // ✅ store all students
      setStudents(sorted.slice(0, 5)); // ✅ store latest 5
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  const [searchText, setSearchText] = useState("");
  const [duration, setDuration] = useState("Last month");
  const [filteredStudents, setFilteredStudents] = useState(students);

  // Search and filter logic
  useEffect(() => {
    let filtered = students;

    if (searchText) {
      filtered = filtered.filter(
        (studentId) =>
          studentId.username
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          studentId.student?.studentEmail
            ?.toLowerCase()
            .includes(searchText.toLowerCase())
      );
    }

    if (duration === "Last week") {
      filtered = filtered.filter(
        (s) =>
          new Date(s.createdDate) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
    } else if (duration === "Last month") {
      filtered = filtered.filter(
        (s) =>
          new Date(s.createdDate) >
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
    } else if (duration === "Last year") {
      filtered = filtered.filter(
        (s) =>
          new Date(s.createdDate) >
          new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
      );
    }

    setFilteredStudents(filtered);
  }, [searchText, duration, students]);

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
        <div
          className="flex items-center gap-2 text-[12px] text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
          onClick={() => setFilterPopupOpen(true)}
        >
          <MdTune className="w-4 h-4" />
          <span>Filter</span>
        </div>

        {/* Showing Info */}
        <div className="text-[12px] justify-left text-gray-500">
          Showing {students.length} of {allStudents.length}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-y-scroll scrollbar-none h-[270px] rounded-b-lg bg-white border border-gray-200">
        <table className="w-full min-w-[900px] table-auto">
          <thead className="bg-[#4C6993] text-white sticky top-0">
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
            {students.length > 0 ? (
              students
                .filter((student) => {
                  const search = searchQuery.toLowerCase();
                  const joiningDate = student.evaluation?.[0]?.joiningDate;
                  const formattedJoiningDate = joiningDate
                    ? new Date(joiningDate)
                        .toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                        .toLowerCase()
                    : "";
                  return (
                    student._id.toLowerCase().includes(search) ||
                    student.username.toLowerCase().includes(search) ||
                    student.teacherName
                      .toString()
                      .toLowerCase()
                      .includes(search) ||
                    student.student.course
                      .toString()
                      .toLowerCase()
                      .includes(search) ||
                    student.student.studentPhone
                      .toString()
                      .toLowerCase()
                      .includes(search) ||
                    formattedJoiningDate.includes(search) ||
                    student.classScheduleCount
                      .toString()
                      .toLowerCase()
                      .includes(search) ||
                    student.level.toString().toLowerCase().includes(search)
                  );
                })
                .map((student, index) => (
                  <tr
                    key={student.student.studentId}
                    className={`${
                      index % 2 === 0 ? "bg-[#FAFAFB]" : "bg-[#F1F3F9]"
                    } text-left text-[11px]`}
                  >
                    <td className="py-3 px-2">{student._id}</td>
                    <td className="py-3 px-2 text-blue-600 cursor-pointer">
                      {student.username}
                    </td>
                    <td className="py-3 px-2 text-left">
                      {new Date(
                        student.evaluation[0].joiningDate
                      ).toString() !== "Invalid Date"
                        ? new Date(
                            student.evaluation[0].joiningDate
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : ""}{" "}
                      {/* Display "N/A" if the date is invalid */}
                    </td>
                    <td className="py-3 px-2">{student.teacherName}</td>
                    <td className="py-3 px-2">{student.student.course}</td>{" "}
                    <td className="py-3 px-2">
                      {student.student.studentPhone}
                    </td>
                    <td className="py-3 px-2">{student.classScheduleCount}</td>
                    <td className="py-3 px-2">{student.level}</td>
                    <td className="py-3 px-2 relative">
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

      {/* {isFilterPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-lg relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Filter</h2>
              <button
                onClick={() => setFilterPopupOpen(false)}
                className="text-gray-500 text-xl focus:outline-none"
              >
                &times;
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="teacherName" className="text-sm text-gray-700">
                  Teacher Name
                </label>
                <input
                  type="text"
                  name="teacherName"
                  value={filterCriteria.teacherName}
                  onChange={handleFilterChange}
                  placeholder="Enter name"
                  className="w-full mt-1 rounded-lg border px-4 py-2 text-sm text-gray-700 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="course" className="text-sm text-gray-700">
                  Course
                </label>
                <select
                  name="course"
                  value={filterCriteria.course}
                  onChange={handleFilterChange}
                  className="w-full mt-1 rounded-lg border px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none"
                >
                  <option value="">Select designation</option>
                  <option value="QUARAN">Qaran</option>
                </select>
              </div>
              <div>
                <label htmlFor="joiningDate" className="text-sm text-gray-700">
                  Joining Date
                </label>
                <input
                  type="date"
                  name="joiningDate"
                  value={filterCriteria.joiningDate}
                  onChange={handleFilterChange}
                  className="w-full mt-1 rounded-lg border px-4 py-2 text-sm text-gray-700 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={applyFilters}
                className="bg-[#012A4A] text-white px-4 py-2 text-sm font-medium rounded-xl"
              >
                Show{employees.length} Results
              </button>
              <button
                onClick={resetFilters}
                className="border border-gray-300 px-4 py-2 text-sm font-medium rounded-xl text-gray-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )} */}

    </div>
  );
};

export default TrailManagement;
