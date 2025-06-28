"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdTune } from "react-icons/md";
import BaseLayout from '@/components/BaseLayout';
import SupervisorHeader from '../../components/TeacherHeader';
import axios from "axios";

interface ApiResponse {
  totalCount: number;
  assignments: Assignment[];
}

export interface Assignment {
  _id: string;
  studentId: string;
  studentName: string;
  assignmentName: string;
  assignedTeacher: string;
  assignedTeacherId: string;
  assignmentType: string;
  chooseType: boolean;
  trueorfalseType: boolean;
  question: string;
  hasOptions: boolean;
  options: {
    optionOne: string;
    optionTwo: string;
    optionThree: string;
    optionFour: string;
  };
  audioFile: string;
  uploadFile: string;
  status: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string;
  level: string;
  courses: string;
  assignedDate: string;
  dueDate: string;
  answer: string;
  answerValidation: string;
  assignmentStatus: string;
  sessionClassType?: string;
  __v: number;
}

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "inactive":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const StudentList = () => {
  const [activeTab, setActiveTab] = useState<string>("Regular");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [regularStudents, setRegularStudents] = useState<Assignment[]>([]);
  const [groupStudents, setGroupStudents] = useState<Assignment[]>([]);
  const [regularCount, setRegularCount] = useState(0);
  const [groupCount, setGroupCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const handleClick = () => {
    console.log('clicked')
    router.push("/teacher/ui/addingnewassignment");
  };

const handleViewProfile = (studentId: string) => {
  localStorage.setItem("studentManageID", studentId);
  router.push(`/teacher/ui/managestudentview`); // ✅ Add leading slash
};


  const toggleDropdown = (assignmentId: string) => {
    setOpenDropdownId((prev) => (prev === assignmentId ? null : assignmentId));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherId = localStorage.getItem("TeacherPortalId");
        const token = localStorage.getItem("TeacherAuthToken");

        if (!token || !teacherId) {
          console.warn("Missing teacherId or token");
          return;
        }

        const res = await axios.get<ApiResponse>(
          "http://localhost:5001/allAssignment",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const teacherAssignments = res.data.assignments.filter(
          (a) => a.assignedTeacherId === teacherId
        );

        const uniqueMap = new Map<string, Assignment>();
        for (const assign of teacherAssignments) {
          if (!uniqueMap.has(assign.studentId)) {
            uniqueMap.set(assign.studentId, assign);
          }
        }

        const uniqueList = Array.from(uniqueMap.values());

        const regular = uniqueList.filter(
          (student) =>
            student.sessionClassType?.toUpperCase() === "REGULARCLASS"
        );
        const group = uniqueList.filter(
          (student) => student.sessionClassType?.toUpperCase() === "GROUPCLASS"
        );

        setRegularStudents(regular);
        setGroupStudents(group);
        setRegularCount(regular.length);
        setGroupCount(group.length);
      } catch (error) {
        console.error("Error fetching assignments", error);
      }
    };

    fetchData();
  }, []);

  const studentsToDisplay =
    activeTab === "Regular" ? regularStudents : groupStudents;

  return (
    <BaseLayout>
          <SupervisorHeader currentSection="Dashboard" />
    
   <div className="md:p-0 mx-auto w-full">
      <div className="flex flex-col h-full w-full justify-between">
        <div className="flex flex-col">
          {/* Tabs */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-4 font-semibold">
              {[
                { type: "Regular", count: regularCount },
                { type: "Group", count: groupCount },
              ].map(({ type, count }) => (
                <button
                  key={type}
                  onClick={() => setActiveTab(type)}
                  className={
                    activeTab === type
                      ? "text-[#576CBC] border-b-2 text-[16px] border-[#576CBC]"
                      : "text-[#010E30] dark:text-white text-[16px]"
                  }
                >
                  {type} Students ({count})
                </button>
              ))}
            </div>
          </div>

          {/* Search + Filter */}
          <div className="w-full bg-[#FAFAFB] dark:bg-[#343434] rounded-lg">
            <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434]">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by keyword"
                  className="bg-transparent outline-none text-[15px] w-52 py-3 "
                  // value={searchText}
                  // onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <div
                className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
                // onClick={() => setIsFilterModalOpen(true)}
              >
                {/* <BsFilterLeft /> */}
                <MdTune className="w-4 h-4" />
                <span>Filter</span>
              </div>

              <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                <span className="text-left -ml-60 ">
                  Showing {studentsToDisplay.length} of{" "}
                  {studentsToDisplay.length}
                </span>
              </div>
            </div>

            {/* Table */}
            <table className="table-fixed w-full">
              <thead className="text-[12px] bg-[#4C6993] text-white">
                <tr>
                  {[
                    "Assignment ID",
                    "Student Name",
                    "Student ID",
                    "Level",
                    "Course",
                    "Assignment Name",
                    "Assigned Date",
                    "Due Date",
                    "Status",
                    "Action",
                  ].map((header, idx) => (
                    <th
                      key={idx}
                      className="px-2 py-1 border border-[#4C6993] text-left text-wrap break-words"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {studentsToDisplay.map((student, index) => (
                  <tr
                    key={index}
                    className={`text-[12px] ${
                      index % 2 === 0
                        ? "bg-[#fff] dark:bg-[#2C2C2C]"
                        : "bg-[#F8F8F8] dark:bg-[#303030]"
                    }`}
                  >
                    <td className="px-3 py-3 break-words">{student._id}</td>
                    <td className="px-3 py-3 text-[#3D8FDE] font-medium">
                      {student.studentName}
                    </td>
                    <td className="px-3 py-3 whitespace-normal break-all w-40">
                      {student.studentId}
                    </td>{" "}
                    <td className="px-3 py-3">{student.level}</td>
                    <td className="px-3 py-3">{student.courses}</td>
                    <td className="px-3 py-3">{student.assignmentName}</td>
                    <td className="px-3 py-3">
                      {new Date(student.assignedDate).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3">
                      {new Date(student.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`py-1 px-2 rounded-md text-[10px] flex items-center justify-center min-w-[80px] ${getStatusStyle(
                          student.status
                        )}`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center relative">
                      <button
                        className="text-gray-500 hover:text-gray-700 dark:text-[#ffff]"
                        onClick={() => toggleDropdown(student._id)}
                      >
                        <BsThreeDotsVertical />
                      </button>
                      {openDropdownId === student._id && (
                        <div className="absolute right-0 w-36 shadow-2xl space-y-2 bg-white rounded-md z-50 border border-gray-200b dark:bg-[#343434]">
                          <button
                            className="block w-full px-4 py-1 text-[12px] text-black dark:text-[#ffff]"
                            onClick={() => handleViewProfile(student.studentId)}
                          >
                            View Profile
                          </button>
                          <button className="block w-full px-4 py-1 text-[12px] 0 dark:text-[#ffff]">
                            Assign
                          </button>
                          <button
                            className="block w-full px-4 py-1 text-[12px]  dark:text-[#ffff]"
                            onClick={() => setIsModalOpen(true)}
                          >
                            New Assignment
                          </button>
                          {isModalOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
                              <div className="bg-white rounded-lg w-[400px] h-[500px] p-6 border  flex flex-col justify-between text-left dark:bg-[#343434]">
                                <div>
                                  <h2 className="text-lg font-semibold mb-4 dark:text-[#fff]">
                                    Assign
                                  </h2>

                                  <div className="mb-4">
                                    <label className="text-sm block mb-1 dark:text-[#fff]">
                                      Title
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Enter title"
                                      className="w-full border rounded-md px-2 py-2 dark:text-[#fff] dark:bg-[#5C5C5C]"
                                    />
                                  </div>

                                  <div className="flex gap-4 mb-4">
                                    <div className="flex-1">
                                      <label className="text-sm block mb-1 dark:text-[#fff]">
                                        Assigned Date
                                      </label>
                                      <input
                                        type="date"
                                        className="w-full border  rounded-md px-2 py-2 dark:text-[#fff] dark:bg-[#5C5C5C]"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <label className="text-sm block mb-1 dark:text-[#fff]">
                                        Due Date
                                      </label>
                                      <input
                                        type="date"
                                        className="w-full border  rounded-md px-2 py-2 dark:bg-[#5C5C5C] dark:text-[#fff]"
                                      />
                                    </div>
                                  </div>

                                  <div className="mb-4">
                                    <label className="text-sm block mb-1 dark:text-[#fff]">
                                      Comment
                                    </label>
                                    <textarea
                                      placeholder="Write your comment here..."
                                      className="w-full border border-gray-300 rounded-md px-2 py-2 h-28 resize-none dark:bg-[#5C5C5C] dark:text-[#fff]"
                                    ></textarea>
                                  </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                  <button
                                    className="bg-gray-200 text-gray-800 px-4 py-2 bg-[#576CBC/10] rounded-md dark:text-[#576CBC] dark:bg-[#576CBC] dark:bg-opacity-10 dark:border-[#576CBC] border border-[#576CBC]"
                                    onClick={() => setIsModalOpen(false)}
                                  >
                                    Cancel
                                  </button>
                                  <button className="bg-[#576CBC] text-white px-4 py-2 rounded-md dark:text-[#fff]"
                                  onClick={handleClick}>
                                    Create Assignment
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* View All */}
          <div className="mt-4 text-right">
            <Link
              href="/teacher/ui/allstudents"
              className="text-[#576CBC] text-[14px] border border-[#576CBC] px-3 py-1 rounded-md bg-white"
            >
              View All
            </Link>
          </div>
        </div>
      </div>
    </div>
    </BaseLayout>
  );
};

export default StudentList;
