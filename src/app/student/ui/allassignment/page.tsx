"use client";

import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdTune } from "react-icons/md";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation"; // Add this at the top
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
  const [pendingAssignments, setPendingAssignments] = useState<AssignmentType[]>([]);
  const [completedAssignments, setCompletedAssignments] = useState<AssignmentType[]>([]);
  const [regularCount, setRegularCount] = useState<number>(0);
  const [groupCount, setGroupCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"Pending" | "Completed">("Pending");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("StudentAuthToken") : null;
        const studentId = localStorage.getItem("StudentPortalId");
        if (!token || !studentId) {
          console.error("Missing token or student ID");
          setLoading(false);
          return;
        }
        const res = await fetch(`https://api.blackstoneinfomaticstech.com/assignments/student?studentId=${studentId}`);
        if (!res.ok) throw new Error("Failed to fetch assignments");
        const data = await res.json();
        const allAssignments = (data.data || []) as AssignmentType[];
        setAssignments(allAssignments);
        // Filter by assignmentStatus for tabs
        const pending = allAssignments.filter(a => a.assignmentStatus?.toUpperCase() !== "COMPLETED");
        const completed = allAssignments.filter(a => a.assignmentStatus?.toUpperCase() === "COMPLETED");
        setPendingAssignments(pending);
        setCompletedAssignments(completed);
        setRegularCount(pending.length);
        setGroupCount(completed.length);
      } catch (err: any) {
        setError(err.message || "Error fetching assignments");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const assignmentsToDisplay = activeTab === "Pending" ? pendingAssignments : completedAssignments;
  const paginatedAssignments = assignmentsToDisplay.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(assignmentsToDisplay.length / itemsPerPage);

  const toggleDropdown = (id: string) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };
  const router = useRouter(); // Add this

  const handleViewProfile = (studentId: string) => {
    router.push(`/teacher/ui/managestudentview?studentId=${studentId}`);
  };

  const handleClick = () => {
    console.log("Create Assignment clicked");
    router.push(`/teacher/ui/addingnewassignment`);
  };

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

  // Fix tab logic: use correct tab types and mapping
  const tabOptions = [
    { type: "Pending", label: "Pending", count: regularCount },
    { type: "Completed", label: "Completed", count: groupCount },
  ];

  return (
      <BaseLayout2>
        <StudentHeader currentSection="Assignments" />
  
        <div className="md:p-0 mx-auto w-full">
          <div className="flex flex-col h-full w-full justify-between">
            <div className="flex flex-col">
              {/* Tabs */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
                <div className="flex flex-wrap gap-4 font-semibold">
                  {tabOptions.map(({ type, label, count }) => (
                    <button
                      key={type}
                      onClick={() => setActiveTab(type as "Pending" | "Completed")}
                      className={
                        activeTab === type
                          ? "text-[#576CBC] border-b-2 text-[16px] border-[#576CBC]"
                          : "text-[#010E30] dark:text-white text-[16px]"
                      }
                    >
                      {label} ({count})
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
                      className="bg-transparent outline-none text-[15px] w-52 py-3"
                    />
                  </div>
  
                  <div className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer">
                    <MdTune className="w-4 h-4" />
                    <span>Filter</span>
                  </div>
  
                  <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                    <span className="text-left -ml-60">
                      Showing {assignmentsToDisplay.length} of{" "}
                      {assignmentsToDisplay.length}
                    </span>
                  </div>
                </div>
  
                {/* Table */}
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
                  {paginatedAssignments.map((assignment, index) => {
                    const status = assignment.assignmentStatus?.toUpperCase();
                    const isNotAssigned = status === "NOTASSIGNED";
                    const isCompleted = status === "COMPLETED";
                    const isAssigned = status === "ASSIGNED" || status === "INPROGRESS";
                    const rowBgClass = index % 2 === 0 ? "bg-[#fff] dark:bg-[#2C2C2C]" : "bg-[#F8F8F8] dark:bg-[#303030]";

                    return (
                      <tr key={assignment._id || index} className={`text-[10px] ${rowBgClass}`}>
                        <td className="px-3 py-3 break-words text-[11px]">
                          {assignment.assignmentId}
                        </td>
                        <td className="px-3 py-3 text-[#3D8FDE] font-medium break-words text-[11px]">
                          {assignment.studentName}
                        </td>
                        <td className="px-3 py-3 break-words text-[11px]">
                          {assignment.courses || "-"}
                        </td>
  
                        <td className="px-3 py-3 break-words text-[11px]">
                          {assignment.level || "-"}
                        </td>
                        <td className="px-3 py-3 break-words text-[11px]">
                          {assignment.assignmentName || assignment.title || "-"}
                        </td>
                        <td className="px-3 py-3 break-words text-[11px]">
                          {assignment.sessionClassType || "-"}
                        </td>
  
                           <td className="px-3 py-3 break-words text-[11px]">
                         
                            {assignment.assignedDate ? new Date(assignment.assignedDate || '').toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                }
                              ) : "-"}
                        </td>
                        <td className="px-3 py-3 break-words text-[11px]">
                               {assignment.dueDate ? new Date(assignment.dueDate || '').toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                }
                              ) : "-"}
                        </td>
                        <td className="px-3 py-3 break-words">
                          <span
                            className={`py-1 px-2 rounded-md text-[8px] flex items-center justify-center ${getStatusStyle(
                              assignment.assignmentStatus || ""
                            )}`}
                          >
                            {assignment.assignmentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center relative text-[11px]">
                          {(() => {
                            let buttonClass = "text-gray-500 hover:text-gray-700 dark:text-[#ffff] ";
                            if (isNotAssigned || isCompleted) {
                              buttonClass += "opacity-40 cursor-not-allowed";
                            }
                            const handleClick = () => {
                              if (!isNotAssigned && !isCompleted) {
                                toggleDropdown(assignment._id);
                              }
                            };
                            const isButtonDisabled = isNotAssigned || isCompleted;
                            return (
                              <button
                                className={buttonClass}
                                onClick={handleClick}
                                disabled={isButtonDisabled}
                              >
                                <BsThreeDotsVertical />
                              </button>
                            );
                          })()}
                          {openDropdownId === assignment._id && isAssigned && (
                            <div className="absolute right-0 w-40 p-2 shadow-2xl space-y-2 bg-white rounded-md z-50 border border-gray-200 dark:bg-[#343434]">
                              <button
                                className="block w-full px-4 py-1 text-[11px] text-black dark:text-[#ffff]"
                                onClick={() => {
                                  setOpenDropdownId(null);
                                  router.push(
                                    `/student/ui/startassignment?assignmentId=${assignment.assignmentId}`
                                  );
                                }}
                              >
                                Start Assignment
                              </button>
                              <button
                                className="block w-full px-4 py-1 text-[11px] text-black dark:text-[#ffff]"
                                onClick={() => {
                                  setOpenDropdownId(null);
                                  router.push(
                                    `/student/ui/assignmentlist?assignmentId=${assignment.assignmentId}`
                                  );
                                }}
                              >
                                View List
                              </button>
                              <button
                                className="block w-full px-4 py-1 text-[11px] dark:text-[#ffff]"
                                onClick={() => setOpenDropdownId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                          {openDropdownId === assignment._id && isCompleted && (
                            <div className="absolute right-0 w-36 shadow-2xl space-y-2 bg-white rounded-md z-50 border border-gray-200 dark:bg-[#343434] opacity-40 pointer-events-none">
                              <button
                                className="block w-full px-4 py-1 text-[11px] text-black dark:text-[#ffff]"
                                disabled
                              >
                                Start Assignment
                              </button>
                              <button
                                className="block w-full px-4 py-1 text-[11px] text-black dark:text-[#ffff]"
                                disabled
                              >
                                View List
                              </button>
                              <button
                                className="block w-full px-4 py-1 text-[11px] dark:text-[#ffff]"
                                disabled
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
