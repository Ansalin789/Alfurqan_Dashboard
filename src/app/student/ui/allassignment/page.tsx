"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdTune } from "react-icons/md";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Add this at the top
import SupervisorHeader from "@/app/supervisor/components/supervisorHeader";
import BaseLayout from "@/components/BaseLayout";
import TeacherHeader from "@/app/teacher/components/TeacherHeader";

export interface AssignmentItem {
  assignmentId?: string;
  assignmentType: string;
  status: string;
  assignmentName: string;
  title: string;
}

export interface StudentCoreInfo {
  studentId: string;
  name: string;
}

export interface EvaluationStudentInfo {
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
  preferredDate: string;
  evaluationStatus: string;
  status: string;
  createdDate: string;
  createdBy: string;
}

export interface EvaluationTeacherInfo {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
}

export interface EvaluationSubscriptionInfo {
  subscriptionName: string;
}

export interface StudentEvaluationDetails {
  student: EvaluationStudentInfo;
  teacher: EvaluationTeacherInfo;
  subscription: EvaluationSubscriptionInfo;
  _id: string;
  academicCoachId: string;
  classType: string;
  classDay: string[];
  startTime: string[];
  endTime: string[];
  isLanguageLevel: boolean;
  languageLevel: string;
  isReadingLevel: boolean;
  readingLevel: string;
  isGrammarLevel: boolean;
  grammarLevel: string;
  hours: number;
  planTotalPrice: number;
  classStartDate: string;
  classEndDate: string;
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
  studentStatus: string;
  classStatus: string;
  comments: string;
  trialClassStatus: string;
  invoiceStatus: string;
  paymentLink: string;
  paymentStatus: string;
  teacherStatus: string;
  status: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string;
  expectedFinishingDate: number;
  assignedTeacherId: string;
  assignedTeacherEmail: string;
  __v: number;
}

export interface StudentWithAssignments extends StudentCoreInfo {
  studentDetails: StudentEvaluationDetails;
  assignment: AssignmentItem[];
}

const hardcodedAssignments: StudentWithAssignments[] = [
  {
    studentId: "S001",
    name: "Assignment 1",
    studentDetails: {
      _id: "1",
      student: {
        studentId: "S001",
        studentFirstName: "Ali",
        studentLastName: "Khan",
        studentEmail: "ali.khan@example.com",
        learningInterest: "Math",
      } as EvaluationStudentInfo,
      teacher: {
        teacherId: "T001",
        teacherName: "Mr. Ahmed",
        teacherEmail: "ahmed@example.com",
      },
      subscription: {
        subscriptionName: "Basic",
      },
      classType: "REGULARCLASS",
      classStartDate: "2025-07-01T00:00:00Z",
      classEndDate: "2025-07-10T00:00:00Z",
  classStatus: "INPROGRESS",
        languageLevel: "Beginner",
    } as StudentEvaluationDetails,
    assignment: [],
  },
  {
    studentId: "S002",
    name: "Assignment 2",
    studentDetails: {
      _id: "2",
      student: {
        studentId: "S002",
        studentFirstName: "Sara",
        studentLastName: "Ali",
        studentEmail: "sara.ali@example.com",
        learningInterest: "Science",
      } as EvaluationStudentInfo,
      teacher: {
        teacherId: "T002",
        teacherName: "Ms. Fatima",
        teacherEmail: "fatima@example.com",
      },
      subscription: {
        subscriptionName: "Premium",
      },
      classType: "GROUPCLASS",
      classStartDate: "2025-07-05T00:00:00Z",
      classEndDate: "2025-07-15T00:00:00Z",
      classStatus: "COMPLETED",
      languageLevel: "Intermediate",
    } as StudentEvaluationDetails,
    assignment: [],
  },
  {
    studentId: "S003",
    name: "Assignment 3",
    studentDetails: {
      _id: "3",
      student: {
        studentId: "S003",
        studentFirstName: "Joe",
        studentLastName: "Ali",
        studentEmail: "joe.ali@example.com",
        learningInterest: "Science",
      } as EvaluationStudentInfo,
      teacher: {
        teacherId: "T003",
        teacherName: "Ms. Fatima",
        teacherEmail: "fatima@example.com",
      },
      subscription: {
        subscriptionName: "Premium",
      },
      classType: "REGULARCLASS",
      classStartDate: "2025-07-05T00:00:00Z",
      classEndDate: "2025-07-15T00:00:00Z",
      classStatus: "ASSIGNED",
      languageLevel: "Intermediate",
    } as StudentEvaluationDetails,
    assignment: [],
  },
];

const StudentList = () => {
  const [regularStudents, setRegularStudents] = useState<
    StudentWithAssignments[]
  >([]);
  const [groupStudents, setGroupStudents] = useState<StudentWithAssignments[]>(
    []
  );

  const [regularCount, setRegularCount] = useState<number>(0);
  const [groupCount, setGroupCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"Pending" | "Completed">("Pending");

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Filter assignments by classStatus for tabs
    const pending = hardcodedAssignments.filter(
      (student) => student.studentDetails?.classStatus?.toUpperCase() !== "COMPLETED"
    );
    const completed = hardcodedAssignments.filter(
      (student) => student.studentDetails?.classStatus?.toUpperCase() === "COMPLETED"
    );
    setRegularStudents(pending);
    setGroupStudents(completed);
    setRegularCount(pending.length);
    setGroupCount(completed.length);
  }, []);

  const studentsToDisplay = activeTab === "Pending" ? regularStudents : groupStudents;

  const toggleDropdown = (id: string) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };
  const router = useRouter(); // Add this

  const handleViewProfile = (studentId: string) => {
    router.push(`/teacher/ui/managestudentview?studentId=${studentId}`);
  };

  const handleClick = () => {
    console.log("Create Assignment clicked");
    // Add assignment creation logic
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
    <BaseLayout>
      <TeacherHeader currentSection="Assignments" />

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
                    Showing {studentsToDisplay.length} of{" "}
                    {studentsToDisplay.length}
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
                {studentsToDisplay.map((student, index) => {
                  const studentInfo = student.studentDetails?.student;
                  const assignmentInfo = student.studentDetails;
                  const status = assignmentInfo?.classStatus?.toUpperCase();
                  const isNotAssigned = status === "NOTASSIGNED";
                  const isCompleted = status === "COMPLETED";
                  const isAssigned = status === "ASSIGNED" || status === "INPROGRESS";

                  return (
                    <tr
                      key={index}
                      className={`text-[10px] ${
                        index % 2 === 0
                          ? "bg-[#fff] dark:bg-[#2C2C2C]"
                          : "bg-[#F8F8F8] dark:bg-[#303030]"
                      }`}
                    >
                      <td className="px-3 py-3 break-words text-[11px]">
                        {studentInfo?.studentId}
                      </td>
                      <td className="px-3 py-3 text-[#3D8FDE] font-medium break-words text-[11px]">
                        {studentInfo?.studentFirstName}{" "}
                        {studentInfo?.studentLastName}
                      </td>
                      <td className="px-3 py-3 break-words text-[11px]">
                        {studentInfo?.learningInterest || "-"}
                      </td>

                      <td className="px-3 py-3 break-words text-[11px]">
                        {assignmentInfo?.languageLevel || "-"}
                      </td>
                      <td className="px-3 py-3 break-words text-[11px]">
                        {studentInfo?.studentId}
                      </td>
                      <td className="px-3 py-3 break-words text-[11px]">
                        {assignmentInfo?.classType}
                      </td>

                         <td className="px-3 py-3 break-words text-[11px]">
                       
                          {new Date(assignmentInfo.classStartDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              }
                            )}
                      </td>
                      <td className="px-3 py-3 break-words text-[11px]">
                             {new Date(assignmentInfo.classEndDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              }
                            )}
                      </td>
                      <td className="px-3 py-3 break-words">
                        <span
                          className={`py-1 px-2 rounded-md text-[8px] flex items-center justify-center min-w-[80px] ${getStatusStyle(
                            assignmentInfo?.classStatus
                          )}`}
                        >
                          {assignmentInfo?.classStatus}
                        </span>
                      </td>
                         <td className="px-4 py-2 text-center relative text-[11px]">
                        <button
                          className={`text-gray-500 hover:text-gray-700 dark:text-[#ffff] ${
                            isNotAssigned || isCompleted ? "opacity-40 cursor-not-allowed" : ""
                          }`}
                          onClick={() => {
                            if (!isNotAssigned && !isCompleted) toggleDropdown(student.studentId);
                          }}
                          disabled={isNotAssigned || isCompleted}
                        >
                          <BsThreeDotsVertical />
                        </button>
                        {openDropdownId === student.studentId && isAssigned && (
                          <div className="absolute right-0 w-40 p-2 shadow-2xl space-y-2 bg-white rounded-md z-50 border border-gray-200 dark:bg-[#343434]">
                            <button
                              className="block w-full px-4 py-1 text-[11px] text-black dark:text-[#ffff]"
                              onClick={() => setOpenDropdownId(null)}
                            >
                              Start Assignment
                            </button>
                            <button
                              className="block w-full px-4 py-1 text-[11px] text-black dark:text-[#ffff]"
                              onClick={() => setOpenDropdownId(null)}
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
                        {openDropdownId === student.studentId && isCompleted && (
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
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default StudentList;
