"use client";

import BaseLayout from "@/components/BaseLayout";
import React, { useState, useRef, useEffect } from "react";
import { MdTune } from "react-icons/md";
import { MoreVertical, Search } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import Modal from "react-modal";
import AcademicHeader from "@/app/Academic-coach/components/academicHeader";
import { PieChart, Pie, Cell } from "recharts";
import TeacherHeader from "../../components/TeacherHeader";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";

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

interface StudentDetails {
  studentDetails: {
    _id: string;
    username: string;
    password: string;
    role: string;
    status: string;
    createdDate: string;
    createdBy: string;
    updatedDate: string;
    __v: number;
    student: {
      studentId: string;
      studentEmail: string;
      studentPhone: number;
      course: string;
      package: string;
      city: string;
      country: string;
      gender: string;
    };
  };
  studentEvaluationDetails: {
    _id: string;
    academicCoachId: string;
    teacher: {
      teacherName: string;
    };
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
      preferredDate: string;
      evaluationStatus: string;
      status: string;
      createdDate: string;
      createdBy: string;
    };
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
    subscription: {
      subscriptionId: string;
      subscriptionName: string;
      subscriptionPricePerHr: number;
      subscriptionDays: number;
      subscriptionStartDate: string;
      subscriptionEndDate: string;
    };
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
    createdDate: string;
    createdBy: string;
    updatedDate: string;
    updatedBy: string;
    expectedFinishingDate: number;
    __v: number;
    teacherStatus: string;
  };
}

interface ClassSchedule {
  _id: string;
  student: {
    studentId: string;
    studentFirstName: string;
    studentLastName: string;
    studentEmail: string;
    gender: string;
  };
  teacher: {
    teacherId: string;
    teacherName: string;
    teacherEmail: string;
  };
  course: {
    courseName: string;
  };
  startDate: string;
  sessionClassType: string;
  endDate: string;
  startTime: string[];
  endTime: string[];
  scheduleStatus: string;
  status: string;
  classLink: string;
  createdBy: string;
  createdDate: string;
  lastUpdatedDate: string;
  amount: string;
  currency: string;
  classDay: string[];
  package: string;
}
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
type CardProps = {
  title: string;
  value: string | number;
  description: string;
};

const Card = ({ title, value, description }: CardProps) => (
  <div className="bg-[#7689BD] rounded-lg shadow-md p-4">
    <div className="text-[20px] text-[#fff] font font-semibold mb-4">
      {title}
    </div>
    <div className="text-[14px] text-[#fff] font-semibold ">{value}</div>
    <div className="text-[12px] text-[#fff] ">{description}</div>
  </div>
);

const ManageStudentView = () => {
  const itemsPerPage = 5;
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [data, setData] = useState<StudentDetails | null>(null);
  const [scheduledClasses, setScheduledClasses] = useState<ClassSchedule[]>([]);
  const [completedClasses, setCompletedClasses] = useState<ClassSchedule[]>([]);
  const [paginatedData, setPaginatedData] = useState<ClassSchedule[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");
  const dropdownRef = useRef<HTMLTableCellElement | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [studentListWrite, setStudentListWrite] = useState(false); // For Assign Group Class
  const totalAssignments = 8;
  const completedAssignments = 6;
  const pendingAssignments = totalAssignments - completedAssignments;
  const completionPercentage = Math.round(
    (completedAssignments / totalAssignments) * 100
  );
  const pendingPercentage = Math.round(
    (pendingAssignments / totalAssignments) * 100
  );
  const [regularStudents, setRegularStudents] = useState<
    StudentWithAssignments[]
  >([]);
  const [groupStudents, setGroupStudents] = useState<StudentWithAssignments[]>(
    []
  );
  const [selectedStudentAssignments, setSelectedStudentAssignments] = useState<
    StudentWithAssignments[]
  >([]);

  const [regularCount, setRegularCount] = useState<number>(0);
  const [groupCount, setGroupCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"Regular" | "Group">("Regular");

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherId = localStorage.getItem("TeacherPortalId");
        const token = localStorage.getItem("TeacherAuthToken");

        if (!token || !teacherId || !studentId) {
          console.warn("Missing teacherId, token, or studentId");
          return;
        }

        const res = await axios.get<StudentWithAssignments[]>(
          "http://localhost:5001/classShedule/teacher/list/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            params: { teacherId },
          }
        );

        // ✅ Filter only for selected student
        const filteredAssignments = res.data.filter(
          (item) => item.studentId === studentId
        );

        console.log("Filtered Assignments:", filteredAssignments);

        setSelectedStudentAssignments(filteredAssignments);

        // ✅ You can now split into REGULAR and GROUP if needed
        const regular = filteredAssignments.filter(
          (student) =>
            student.studentDetails?.classType?.toUpperCase() === "REGULARCLASS"
        );

        const group = filteredAssignments.filter(
          (student) =>
            student.studentDetails?.classType?.toUpperCase() === "GROUPCLASS"
        );

        setRegularStudents(regular);
        setGroupStudents(group);
        setRegularCount(regular.length);
        setGroupCount(group.length);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchData();
  }, [studentId]);

  const studentsToDisplay =
    activeTab === "Regular" ? regularStudents : groupStudents;

  // const toggleDropdown = (id: string) => {
  //   setOpenDropdownId((prev) => (prev === id ? null : id));
  // };
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
        return "bg-green-100 text-green-700";
      case "NOTCOMPLETED":
        return "bg-yellow-100 text-yellow-700";
      case "NOTASSIGNED":
        return "bg-red-100 text-red-700";
      case "ASSIGNED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const cards = [
    {
      title: "Total Assignment\nAssigned",
      count: totalAssignments,
      percentage: 100,
      ringColor: "#88A2CF",
      bgColor: "#CDD5E2",
      pieData: [{ value: 100 }],
    },
    {
      title: "Total Assignment\nCompleted",
      count: completedAssignments,
      percentage: completionPercentage,
      ringColor: "#88CF9B",
      bgColor: "#CDD5E2",
      pieData: [
        { value: completionPercentage },
        { value: 100 - completionPercentage },
      ],
    },
  ];

  //Rolebyaccess
  useEffect(() => {
    const roleAccessRaw = localStorage.getItem("AcademicRolePermission");
    if (roleAccessRaw) {
      try {
        const roleAccess = JSON.parse(roleAccessRaw);
        const modules = roleAccess?.academicmodules || roleAccess;

        setStudentListWrite(modules?.managestudents?.write === true); // ✅ already present
      } catch (error) {
        console.error("Invalid AcademicRolePermission JSON", error);
      }
    }
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = paginatedData.slice(indexOfFirstItem, indexOfLastItem);

  // Optional: reset page to 1 when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  //Student data gettingby ID
  useEffect(() => {
    const fetchData = async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("TeacherAuthToken")
          : null;

      if (!token) {
        console.error("❌ Academicoach not found");
        return;
      }

      const res = await fetch(
        `https://api.blackstoneinfomaticstech.com/alstudents/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      setData(json);
    };

    fetchData();
  }, []);

  //Classschedule against the studentId

  return (
    <BaseLayout>
      <div>
        <TeacherHeader currentSection="Assignments" />

        {/* Top section */}
        <div className="grid grid-cols-2 lg:flex-row  gap-6 mb-6">
          {/* Profile Card */}
          <div className="w-full h-[200px] grid grid-cols-2 bg-[#5E6578] rounded-lg text-white p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start">
            <div className="flex flex-col items-center sm:pr-6 sm:border-r border-white/30">
              <img
                src="/assets/images/alstudent.jpg"
                alt="profile"
                className="w-[115px] h-[115px] rounded-full object-cover border-4"
              />
              <h2 className="text-center text-[18px] font-semibold mt-1">
                {data?.studentDetails?.username}
              </h2>
              <p className="text-[12px] text-[#C9C9C9]">
                {data?.studentDetails?.student?.studentEmail}
              </p>
            </div>

            <div className="pt-2 sm:pl-6 w-full">
              <h3 className="text-[16px] font-semibold mb-2">Personal Info</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white text-[14px]">Contact</span>
                  <span className="text-[#DADADACC] text-[12px]">
                    {data?.studentDetails?.student?.studentPhone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white text-[14px]">Level</span>
                  <span className="text-[#DADADACC] text-[12px]">
                    {data?.studentEvaluationDetails?.readingLevel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white text-[14px]">Package</span>
                  <span className="text-[#DADADACC] text-[12px]">
                    {data?.studentDetails?.student?.package}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white text-[14px]">Class Type</span>
                  <span className="text-[#DADADACC] text-[12px]">
                    {data?.studentEvaluationDetails?.classType}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {cards.map((item, idx) => {
              const bgClass =
                idx === 0
                  ? "bg-gradient-to-b from-white to-[#F6FCFF] dark:from-[#343434] dark:to-[#343434]"
                  : idx === 1
                  ? "bg-gradient-to-b from-white to-[#F6FFFF] dark:from-[#343434] dark:to-[#343434]"
                  : "bg-gradient-to-b from-white to-[#F8F6FF] dark:from-[#343434] dark:to-[#343434]";

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl shadow-md ${bgClass} flex flex-col justify-between w-full h-[200px] transition transform hover:scale-[1.02]`}
                >
                  <h3 className="text-[#010E30] text-lg font-medium mb-2 leading-5 break-words whitespace-pre-line dark:text-[#fff]">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-center mt-2 gap-24 mb-10">
                    {" "}
                    {/* Changed to flex-col and centered */}
                    <span className="text-[22px] sm:text-[30px] md:text-[30px] text-[#010E30] font-semibold mt-20 dark:text-[#fff]">
                      {item.count}
                    </span>
                    <div className="relative w-[100px] h-[100px] sm:w-[110px] sm:h-[110px] md:w-[120px] md:h-[120px] -mt-7">
                      <PieChart width={120} height={120}>
                        {/* Background Circle */}
                        <Pie
                          data={[{ value: 100 }]}
                          dataKey="value"
                          innerRadius={45}
                          outerRadius={55}
                          startAngle={90}
                          endAngle={-270}
                          isAnimationActive={false}
                          stroke="none"
                        >
                          <Cell fill={item.bgColor} />
                        </Pie>

                        {/* Foreground Ring */}
                        <Pie
                          data={item.pieData}
                          dataKey="value"
                          innerRadius={42}
                          outerRadius={58}
                          startAngle={90}
                          endAngle={-270}
                          cornerRadius={2}
                          isAnimationActive={false}
                          stroke="none"
                        >
                          <Cell fill={item.ringColor} />
                          <Cell fill="transparent" />
                        </Pie>
                      </PieChart>

                      {/* Center Text */}
                      <div className="absolute inset-0 flex items-center justify-center text-[14px] sm:text-[16px] md:text-[18px] font-semibold text-[#333] dark:text-[#fff]">
                        {item.percentage}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs and Table Section */}

        <div className="w-full bg-[#FAFAFB] rounded-lg dark:bg-[#343434] mt-2">
          <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434]">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search by keyword"
                className="bg-transparent outline-none text-[15px] w-52 py-3 "
                value={searchText}
                // onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <div
              className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
              onClick={() => setIsFilterModalOpen(true)}
            >
              {/* <BsFilterLeft /> */}
              <MdTune className="w-4 h-4" />
              <span>Filter</span>
            </div>

            <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
              <span className="text-left -ml-60 ">
                Showing {currentItems.length} of {paginatedData.length}
              </span>
            </div>
          </div>

          {/* Table */}
          <table className="table-fixed w-full">
            <thead className="text-[12px] bg-[#4C6993] text-white">
              <tr>
                {[
                  "Student ID",
                  "Student Name",
                  "Assignment ID",
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
              {studentsToDisplay.map((student, studentIndex) => {
                const studentInfo = student.studentDetails?.student;
                const studentDetails = student.studentDetails;

                return student.assignment.map((assignmentItem, assignIndex) => {
                  const dropdownId = `${student.studentId}-${assignmentItem.assignmentName}-${assignIndex}`;

                  return (
                    <tr
                      key={`${student.studentId}-${assignIndex}`}
                      className={`text-[10px] ${
                        studentIndex % 2 === 0
                          ? "bg-[#fff] dark:bg-[#2C2C2C]"
                          : "bg-[#F8F8F8] dark:bg-[#303030]"
                      }`}
                    >
                      <td className="px-3 py-3 break-words">
                        {student?.studentId}
                      </td>
                      <td className="px-3 py-3 text-[#3D8FDE] font-medium break-words">
                        {studentInfo?.studentFirstName}{" "}
                        {studentInfo?.studentLastName}
                      </td>
                      <td className="px-3 py-3 break-words">
                        {assignmentItem.assignmentId || "-"}
                      </td>
                      <td className="px-3 py-3 break-words">
                        {studentDetails?.languageLevel || "-"}
                      </td>
                      <td className="px-3 py-3 break-words">
                             {studentDetails?.student?.learningInterest}
                      </td>
                      <td className="px-3 py-3 break-words">
                              {assignmentItem.title}
                        </td>
                      <td className="px-3 py-3 break-words">
                        {new Date(
                          studentDetails?.classStartDate
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-3 break-words">
                        {new Date(
                          studentDetails?.classEndDate
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-3 break-words">
                        <span
                          className={`py-1 px-2 rounded-md text-[8px] flex items-center justify-center min-w-[80px] ${getStatusStyle(
                            assignmentItem.status
                          )}`}
                        >
                          {assignmentItem.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center relative">
                        <button
                          className="text-gray-500 hover:text-gray-700 dark:text-[#ffff]"
                          onClick={() =>
                            setOpenDropdownId(
                              openDropdownId === dropdownId ? null : dropdownId
                            )
                          }
                        >
                          <BsThreeDotsVertical />
                        </button>

                        {openDropdownId === dropdownId &&
                          assignmentItem.status?.toUpperCase() ===
                            "NOT ASSIGNED" && (
                            <div className="absolute right-0 w-36 shadow-2xl space-y-2 bg-white rounded-md z-50 border border-gray-200 dark:bg-[#343434]">
                              {(() => {
                                const status =
                                  assignmentItem.status?.toUpperCase();
                                if (
                                  [
                                    "COMPLETED",
                                    "NOT COMPLETED",
                                    "ASSIGNED",
                                  ].includes(status)
                                ) {
                                  return (
                                    <>
                                      <button
                                        className="block w-full px-4 py-1 text-[12px] text-black dark:text-[#ffff]"
                                        onClick={() =>
                                          handleViewProfile(student.studentId)
                                        }
                                      >
                                        View Profile
                                      </button>
                                      <button
                                        className="block w-full px-4 py-1 text-[12px] dark:text-[#ffff]"
                                        onClick={() => setOpenDropdownId(null)}
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  );
                                } else if (status === "NOT ASSIGNED") {
                                  return (
                                    <>
                                      <button className="block w-full px-4 py-1 text-[12px] dark:text-[#ffff]">
                                        Assign
                                      </button>
                                      <button
                                        className="block w-full px-4 py-1 text-[12px] dark:text-[#ffff]"
                                        onClick={() =>
                                          setOpenModalId(dropdownId)
                                        }
                                      >
                                        New Assignment
                                      </button>
                                      <button
                                        className="block w-full px-4 py-1 text-[12px] dark:text-[#ffff]"
                                        onClick={() => setOpenDropdownId(null)}
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  );
                                } else {
                                  return (
                                    <button
                                      className="block w-full px-4 py-1 text-[12px] dark:text-[#ffff]"
                                      onClick={() => setOpenDropdownId(null)}
                                    >
                                      Cancel
                                    </button>
                                  );
                                }
                              })()}
                            </div>
                          )}

                        {/* Assignment Modal */}
                        {openModalId === dropdownId && (
                          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg w-[400px] h-[500px] p-6 border flex flex-col justify-between text-left dark:bg-[#343434]">
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
                                      className="w-full border rounded-md px-2 py-2 dark:text-[#fff] dark:bg-[#5C5C5C]"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <label className="text-sm block mb-1 dark:text-[#fff]">
                                      Due Date
                                    </label>
                                    <input
                                      type="date"
                                      className="w-full border rounded-md px-2 py-2 dark:bg-[#5C5C5C] dark:text-[#fff]"
                                    />
                                  </div>
                                </div>
                                <div className="mb-4">
                                  <label className="text-sm block mb-1 dark:text-[#fff]">
                                    Comment
                                  </label>
                                  <textarea
                                    placeholder="Write your comment here..."
                                    className="w-full border rounded-md px-2 py-2 h-28 resize-none dark:bg-[#5C5C5C] dark:text-[#fff]"
                                  ></textarea>
                                </div>
                              </div>
                              <div className="flex justify-end gap-3">
                                <button
                                  className="bg-gray-200 text-gray-800 px-4 py-2 bg-[#576CBC/10] rounded-md dark:text-[#576CBC] dark:bg-[#576CBC] dark:bg-opacity-10 dark:border-[#576CBC] border border-[#576CBC]"
                                  onClick={() => setOpenModalId(null)}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="bg-[#576CBC] text-white px-4 py-2 rounded-md dark:text-[#fff]"
                                  onClick={handleClick}
                                >
                                  Create Assignment
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                });
              })}
            </tbody>
          </table>
        </div>

        {/* <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        /> */}
      </div>

      {/*filterform  */}
      {/* <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        // users={activeTab === "regular" ? scheduledClasses : completedClasses}
      /> */}
    </BaseLayout>
  );
};

export default ManageStudentView;
