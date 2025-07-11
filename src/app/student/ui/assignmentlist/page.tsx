"use client";

import { useEffect, useState } from "react";
import { MdTune } from "react-icons/md";
import { Search } from "lucide-react";
import {  useSearchParams } from "next/navigation";
import BaseLayout from "@/components/BaseLayout";
import TeacherHeader from "@/app/teacher/components/TeacherHeader";
import Pagination from "@/components/Pagination";
import BaseLayout2 from "@/components/BaseLayout2";
import StudentHeader from "../../components/StudentHeader";

interface AssignmentType {
  _id: string;
  studentId: string;
  studentName: string;
  sessionClassType?: string;
  assignmentName: string;
  questionName?: string;
  questionType?: string;
  typeofQuestion?: string;
  title: string;
  assignedTeacher?: string;
  assignedTeacherId?: string;
  assignmentId: string;
  assignmentType?: {
    type?: string;
    name?: string;
    chooseType?: boolean;
    trueorfalseType?: boolean;
  };
  chooseType?: boolean;
  trueorfalseType?: boolean;
  question?: string;
  hasOptions?: boolean;
  options?: {
    optionOne?: string;
    optionTwo?: string;
    optionThree?: string;
    optionFour?: string;
  };
  status?: string;
  createdDate?: string;
  createdBy?: string;
  updatedDate?: string;
  updatedBy?: string;
  level?: string;
  courses?: string;
  assignedDate?: string;
  dueDate?: string;
  answer?: string;
  answerValidation?: string;
  assignmentStatus?: string;
  __v?: number;
}

const StudentList = () => {
  const [assignments, setAssignments] = useState<AssignmentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get("assignmentId") ;

  useEffect(() => {
    if (!assignmentId) return;
    setLoading(true);
    setError(null);
    fetch(`https://api.blackstoneinfomaticstech.com/assignments/?assignmentId=${assignmentId}`)
      .then((res) => res.json())
      .then((data) => {
        setAssignments(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch assignments");
        setLoading(false);
      });
  }, [assignmentId]);

  const paginatedAssignments = assignments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(assignments.length / itemsPerPage);

  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "bg-[#ECFDF3] text-[#377E36] dark:bg-[#2E3D2E] dark:text-[#377E36]";
      case "INPROGRESS":
        return "bg-[#FDF6EC] text-[#F0AD4E] dark:bg-[#534634] dark:text-[#F0AD4E]";
      case "ASSIGNED":
        return "bg-[#FDECEC] text-[#D34645] dark:bg-[#4D3131] dark:text-[#D34645]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <BaseLayout2>
      <StudentHeader currentSection="Assignments" />
      <div className="md:p-0 mx-auto w-full">
        <div className="flex flex-col h-full w-full justify-between">
          <div className="flex flex-col">
            <div className="w-full bg-[#FAFAFB] dark:bg-[#343434] rounded-lg">


              {/* Search and Filter Bar */}
              <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434]">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by keyword"
                    className="bg-transparent outline-none text-[15px] w-52 py-3"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer">
                  <MdTune className="w-4 h-4" />
                  <span>Filter</span>
                </div>
                <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                  <span className="text-left -ml-60">
                    Showing {assignments.length} of {assignments.length}
                  </span>
                </div>
              </div>


              {/* Table */}
              {(() => {
                if (loading) {
                  return <div className="p-4 text-center">Loading assignments...</div>;
                }
                if (error) {
                  return <div className="p-4 text-center text-red-500">{error}</div>;
                }
                return (
                  <table className="table-fixed w-full">
                    <thead className="text-[13px] bg-[#4C6993] text-white">
                      <tr>
                        {[
                          "Assignment ID",
                          "Assigned By",
                          "Course",
                          "Level",
                          "Assignment Name",
                          "Class Type",
                          "Assigned Date",
                          "Due Date",
                          "Status",
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
                      {paginatedAssignments.map((assignment, index) => {
                        const status = assignment.assignmentStatus?.toUpperCase();
                        const rowBgClass =
                          index % 2 === 0
                            ? "bg-[#fff] dark:bg-[#2C2C2C]"
                            : "bg-[#F8F8F8] dark:bg-[#303030]";
                        return (
                          <tr
                            key={assignment._id || index}
                            className={`text-[10px] ${rowBgClass}`}
                          >
                            <td className="px-3 py-4 break-words text-[11px]">
                              {assignment.assignmentId}
                            </td>
                            <td className="px-3 py-4 break-words text-[11px]">
                              {assignment.assignedTeacher }
                            </td>
                            <td className="px-3 py-4 break-words text-[11px]">
                              {assignment.courses}
                            </td>
                            <td className="px-3 py-4 break-words text-[11px]">
                              {assignment.level}
                            </td>
                            <td className="px-3 py-4 break-words text-[11px]">
                              {assignment.title}
                            </td>
                            <td className="px-3 py-4 break-words text-[11px]">
                              {assignment.sessionClassType}
                            </td>
                            <td className="px-3 py-4 break-words text-[11px]">
                              {assignment.assignedDate ? new Date(assignment.assignedDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "-"}
                            </td>
                            <td className="px-3 py-4 break-words text-[11px]">
                              {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "-"}
                            </td>
                            <td className="px-3 py-4 break-words text-[11px]">
                              <span className={`py-1 px-1 rounded-md text-[8px] flex items-center justify-center w-[80px] ${getStatusStyle(assignment.assignmentStatus || "")}`}>
                                {assignment.assignmentStatus}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                );
              })()}


            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </BaseLayout2>
  );
};

export default StudentList;
