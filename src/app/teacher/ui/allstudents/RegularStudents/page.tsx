"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdTune } from "react-icons/md";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";

export interface AssignmentItem {
  assignmentId?: string;
  assignmentType: string;
  status: string;
  assignmentName: string;
  title: string;
  assignmentStatus: string;
  assignedDate: string;
  dueDate: string;
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
  id: string;
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
  classType: string;
  groupClassId: string;
  assignment: AssignmentItem[];
}

const RegularStudents = () => {
  const router = useRouter();

  const [regularStudents, setRegularStudents] = useState<
    StudentWithAssignments[]
  >([]);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [sessionClassType, setSessionClassType] = useState("");
  const [assignedTeacher, setAssignedTeacher] = useState("");
  const [assignedTeacherId, setAssignedTeacherId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<StudentWithAssignments[]>(
    []
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [assignedDate, setAssignedDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [comment, setComment] = useState("");
  const itemsPerPage = 10;

  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const day = date.getDate(); // e.g., 7
    const month = String(date.getMonth() + 1).padStart(2, "0"); // e.g., 06
    const year = date.getFullYear(); // e.g., 2025
    return `${day}-${month}-${year}`;
  };
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    studentName: "",
    studentId: "",
    assignmentName: "",
    status: "",
    fromDate: "",
    toDate: "",
    course: "",
    level: "",
  });
  const [filteredStudents, setFilteredStudents] = useState<
    StudentWithAssignments[]
  >([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const handleApplyFilters = () => {
    let result = [...regularStudents];

    // Apply each filter if it has a value
    if (filters.studentName) {
      const lowerName = filters.studentName.toLowerCase();
      result = result.filter((student) => {
        const studentInfo = student.studentDetails?.student;
        const fullName = `${studentInfo?.studentFirstName || ""} ${
          studentInfo?.studentLastName || ""
        }`.toLowerCase();
        return fullName.includes(lowerName);
      });
    }

    if (filters.studentId) {
      const lowerId = filters.studentId.toLowerCase();
      result = result.filter((student) =>
        student.studentId.toLowerCase().includes(lowerId)
      );
    }

    if (filters.assignmentName) {
      const lowerAssignment = filters.assignmentName.toLowerCase();
      result = result.filter((student) =>
        student.assignment.some((assignment) =>
          assignment.title.toLowerCase().includes(lowerAssignment)
        )
      );
    }

    if (filters.status) {
      result = result.filter((student) =>
        student.assignment.some(
          (assignment) =>
            (assignment.assignmentStatus || assignment.status) ===
            filters.status
        )
      );
    }

    if (filters.fromDate && filters.toDate) {
      const from = new Date(filters.fromDate);
      const to = new Date(filters.toDate);
      result = result.filter((student) =>
        student.assignment.some((assignment) => {
          const assignedDate = new Date(assignment.assignedDate);
          return assignedDate >= from && assignedDate <= to;
        })
      );
    }

    if (filters.course) {
      const lowerCourse = filters.course.toLowerCase();
      result = result.filter((student) =>
        student.studentDetails?.student?.learningInterest
          ?.toLowerCase()
          .includes(lowerCourse)
      );
    }

    if (filters.level) {
      const lowerLevel = filters.level.toLowerCase();
      result = result.filter((student) =>
        student.studentDetails?.languageLevel
          ?.toLowerCase()
          .includes(lowerLevel)
      );
    }

    setFilteredStudents(result);
    setIsFiltered(true);
    setShowFilterModal(false);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      studentName: "",
      studentId: "",
      assignmentName: "",
      status: "",
      fromDate: "",
      toDate: "",
      course: "",
      level: "",
    });
    setFilteredStudents([]);
    setIsFiltered(false);
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

        console.log("Fetching data for teacherId:", teacherId);

        const res = await axios.get<StudentWithAssignments[]>(
          "https://api.blackstoneinfomaticstech.com/classShedule/teacher/list",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            params: { teacherId },
          }
        );

        const allStudents = res.data;
        console.log("API Response:", allStudents);

        // Filter for regular students only
        const regular = allStudents.filter(
          (student) => student.classType?.toUpperCase() === "REGULARCLASS"
        );

        console.log("Regular students filtered:", regular);
        setRegularStudents(regular);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchData();
  }, []);

  const handleViewProfile = (studentId: string) => {
    router.push(`/teacher/ui/managestudentview?studentId=${studentId}`);
  };
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowerQuery = query.toLowerCase();

    const filtered = regularStudents.filter((user) => {
      const studentInfo = user.studentDetails?.student;
      const fullName = `${studentInfo?.studentFirstName || ""} ${
        studentInfo?.studentLastName || ""
      }`.toLowerCase();
      const firstAssignment = user.assignment?.[0] || {};

      return (
        user.studentId?.toLowerCase()?.includes(lowerQuery) ||
        fullName.includes(lowerQuery) ||
        studentInfo?.studentEmail?.toLowerCase()?.includes(lowerQuery) ||
        studentInfo?.studentPhone?.toString()?.includes(lowerQuery) ||
        studentInfo?.studentCountry?.toLowerCase()?.includes(lowerQuery) ||
        user.studentDetails?.subscription?.subscriptionName
          ?.toLowerCase()
          ?.includes(lowerQuery) ||
        studentInfo?.preferredTeacher?.toLowerCase()?.includes(lowerQuery) ||
        studentInfo?.preferredFromTime?.toLowerCase()?.includes(lowerQuery) ||
        studentInfo?.evaluationStatus?.toLowerCase()?.includes(lowerQuery) ||
        firstAssignment?.assignmentName?.toLowerCase()?.includes(lowerQuery) ||
        firstAssignment?.assignmentStatus
          ?.toLowerCase()
          ?.includes(lowerQuery) ||
        firstAssignment?.assignmentType?.toLowerCase()?.includes(lowerQuery)
      );
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleClick = () => {
    const query = new URLSearchParams({
      title,
      assignedDate,
      dueDate,
      comment,
      studentId,
      studentName,
      sessionClassType,
      assignedTeacher,
      assignedTeacherId,
    }).toString();

    router.push(`/teacher/ui/addingnewassignment?${query}`);
  };

  useEffect(() => {
    const metaData = localStorage.getItem("assignmentMeta");
    if (metaData) {
      const { title, assignedDate, dueDate, comment } = JSON.parse(metaData);
      setTitle(title);
      setAssignedDate(assignedDate);
      setDueDate(dueDate);
      setComment(comment);
    }
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Not Completed":
        return "bg-yellow-100 text-yellow-700";
      case "Not Assigned":
        return "bg-red-100 text-red-700";
      case "Assigned":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="md:p-0 mx-auto w-full">
      <div className="flex flex-col h-full w-full justify-between">
        <div className="flex flex-col">
          {/* Header */}
          {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
            <div className="flex flex-wrap gap-4 font-semibold">
              <h2 className="text-[#576CBC] border-b-2 text-[16px] border-[#576CBC]">
                Regular Students ({regularStudents.length})
              </h2>
            </div>
          </div> */}

          {/* Search + Filter */}
          <div className="w-full bg-[#FAFAFB] dark:bg-[#343434] rounded-lg">
            <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434]">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by keyword"
                  className="bg-transparent outline-none text-[15px] w-52 py-3"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer">
                <MdTune className="w-4 h-4" />
                <span onClick={() => setShowFilterModal(true)}>Filter</span>
              </div>
              {showFilterModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-30">
                  <div className="bg-white p-5 rounded-lg w-[400px] relative dark:bg-[#252525]">
                    <button
                      className="absolute top-2 right-3 text-gray-400 text-xl"
                      onClick={() => setShowFilterModal(false)}
                    >
                      &times;
                    </button>
                    <h2 className="text-lg font-semibold mb-4 dark:text-[#fff]">
                      Filter Students
                    </h2>

                    <div className="mb-4">
                      <label className="text-sm font-medium mb-1 dark:text-[#D6D6D6]">
                        Student Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded text-xs dark:text-[#fff] dark:border-[#5C5C5C] dark:bg-[#343434]"
                        value={filters.studentName}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            studentName: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="mb-4">
                      <label className="text-sm font-medium mb-1 dark:text-[#D6D6D6]">
                        Student ID
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded text-xs dark:text-[#fff] dark:border-[#5C5C5C] dark:bg-[#343434]"
                        value={filters.studentId}
                        onChange={(e) =>
                          setFilters({ ...filters, studentId: e.target.value })
                        }
                      />
                    </div>

                    <div className="mb-4">
                      <label className="text-sm font-medium mb-1 dark:text-[#D6D6D6]">
                        Assignment Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded text-xs dark:text-[#fff] dark:border-[#5C5C5C] dark:bg-[#343434]"
                        value={filters.assignmentName}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            assignmentName: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="mb-4">
                      <label className="text-sm font-medium mb-1 dark:text-[#D6D6D6]">
                        Course
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded text-xs dark:text-[#fff] dark:border-[#5C5C5C] dark:bg-[#343434]"
                        value={filters.course}
                        onChange={(e) =>
                          setFilters({ ...filters, course: e.target.value })
                        }
                      />
                    </div>

                    <div className="mb-4">
                      <label className="text-sm font-medium mb-1 dark:text-[#D6D6D6]">
                        Level
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded text-xs dark:text-[#fff] dark:border-[#5C5C5C] dark:bg-[#343434]"
                        value={filters.level}
                        onChange={(e) =>
                          setFilters({ ...filters, level: e.target.value })
                        }
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1 dark:text-[#D6D6D6]">
                        Assignment Date
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="date"
                          className="w-1/2 px-3 py-2 border rounded text-xs dark:text-[#fff] dark:border-[#5C5C5C] dark:bg-[#343434] [&::-webkit-calendar-picker-indicator]:dark:invert"
                          value={filters.fromDate}
                          onChange={(e) =>
                            setFilters({ ...filters, fromDate: e.target.value })
                          }
                        />
                        <input
                          type="date"
                          className="w-1/2 px-3 py-2 border rounded text-xs dark:text-[#fff] dark:border-[#5C5C5C] dark:bg-[#343434] [&::-webkit-calendar-picker-indicator]:dark:invert"
                          value={filters.toDate}
                          onChange={(e) =>
                            setFilters({ ...filters, toDate: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="text-sm font-medium mb-1 dark:text-[#D6D6D6]">
                        Status
                      </label>
                      <select
                        className="w-full border rounded-md p-2 text-[12px] dark:text-[#fff] dark:border-[#5C5C5C] dark:bg-[#343434]"
                        value={filters.status}
                        onChange={(e) =>
                          setFilters({ ...filters, status: e.target.value })
                        }
                      >
                        <option value="">Select status</option>
                        <option value="Completed">Completed</option>
                        <option value="Not Completed">Not Completed</option>
                        <option value="Not Assigned">Not Assigned</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={handleResetFilters}
                        className="px-4 py-1 rounded-md border border-[#576CBC] text-[#576CBC] font-medium dark:text-[#576CBC] dark:border-[#576CBC]"
                      >
                        Reset
                      </button>
                      <button
                        className="px-4 py-1 rounded-md bg-[#576CBC] text-white font-medium"
                        onClick={handleApplyFilters}
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                <span className="text-left -ml-60">
                  Showing{" "}
                  {isFiltered
                    ? filteredStudents.length
                    : searchQuery
                    ? filteredUsers.length
                    : regularStudents.length}{" "}
                  of {regularStudents.length}{" "}
                </span>
              </div>
            </div>

            {/* Table */}
            <table className="table-fixed w-full border border-gray-300 dark:border-gray-600">
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
                {(isFiltered
                  ? filteredStudents
                  : searchQuery
                  ? filteredUsers
                  : regularStudents
                ).map((student, studentIndex) => {
                  const studentInfo = student.studentDetails?.student;
                  const studentDetails = student.studentDetails;

                  // Define modalId for both cases
                  const modalIdNoAssignment = `${student.studentId}-no-assignment`;

                  // If no assignments, show one row with empty assignment data
                  if (student.assignment.length === 0) {
                    return (
                      <tr
                        key={modalIdNoAssignment}
                        className={`text-[12px] border-b border-gray-300 dark:border-gray-600 ${
                          studentIndex % 2 === 0
                            ? "bg-white dark:bg-[#2C2C2C]"
                            : "bg-[#F8F8F8] dark:bg-[#303030]"
                        }`}
                      >
                        <td className="px-3 py-2 break-words">
                          {student?.studentId}
                        </td>
                        <td className="px-3 py-2 text-[#3D8FDE] font-medium break-words">
                          {studentInfo?.studentFirstName}{" "}
                          {studentInfo?.studentLastName}
                        </td>
                        <td className="px-3 py-2 break-words">-</td>
                        <td className="px-3 py-2 break-words">-</td>
                        <td className="px-3 py-2 break-words">
                          {studentDetails?.student?.learningInterest}
                        </td>
                        <td className="px-3 py-2 break-words"></td>
                        <td className="px-3 py-2 break-words">-</td>
                        <td className="px-3 py-2 break-words">-</td>
                        <td className="px-3 py-2 break-words">
                          <span
                            className={`py-1 px-2 rounded-md text-[10px] flex items-center justify-center min-w-[80px] ${getStatusStyle(
                              "Not Assigned"
                            )}`}
                          >
                            Not Assigned
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center relative">
                          <button
                            className="text-gray-500 hover:text-gray-700 dark:text-[#ffff]"
                            onClick={() =>
                              setOpenDropdownId(
                                openDropdownId === modalIdNoAssignment
                                  ? null
                                  : modalIdNoAssignment
                              )
                            }
                          >
                            <BsThreeDotsVertical />
                          </button>

                          {openDropdownId === modalIdNoAssignment && (
                            <div className="absolute right-0 w-36 shadow-2xl space-y-2 bg-white rounded-md z-50 border border-gray-200 dark:bg-[#343434]">
                              <button
                                className="block w-full px-4 py-1 text-[12px] text-black dark:text-[#ffff]"
                                onClick={() =>
                                  handleViewProfile(student.studentId)
                                }
                              >
                                Assign
                              </button>
                              <button
                                className="block w-full px-4 py-1 text-[12px] dark:text-[#ffff]"
                                onClick={() => {
                                  setStudentId(student.studentId);
                                  setStudentName(
                                    `${studentInfo?.studentFirstName ?? ""} ${
                                      studentInfo?.studentLastName ?? ""
                                    }`
                                  );
                                  setSessionClassType(
                                    studentDetails?.classType ?? "REGULARCLASS"
                                  );
                                  setAssignedTeacher(
                                    studentDetails?.assignedTeacherEmail ?? ""
                                  );
                                  setAssignedTeacherId(
                                    studentDetails?.teacher?.teacherId ?? ""
                                  );
                                  setOpenModalId(modalIdNoAssignment);
                                }}
                              >
                                New Assignment
                              </button>
                              <button
                                className="block w-full px-4 py-1 text-[12px] dark:text-[#ffff]"
                                onClick={() => setOpenDropdownId(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          )}

                          {/* Assignment Modal for students with no assignments */}
                          {openModalId === modalIdNoAssignment && (
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
                                      value={title}
                                      onChange={(e) => setTitle(e.target.value)}
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
                                        value={assignedDate}
                                        onChange={(e) =>
                                          setAssignedDate(e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <label className="text-sm block mb-1 dark:text-[#fff]">
                                        Due Date
                                      </label>
                                      <input
                                        type="date"
                                        className="w-full border rounded-md px-2 py-2 dark:bg-[#5C5C5C] dark:text-[#fff]"
                                        value={dueDate}
                                        onChange={(e) =>
                                          setDueDate(e.target.value)
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="mb-4">
                                    <label className="text-sm block mb-1 dark:text-[#fff]">
                                      Comment
                                    </label>
                                    <textarea
                                      placeholder="Write your comment here..."
                                      value={comment}
                                      onChange={(e) =>
                                        setComment(e.target.value)
                                      }
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
                                    onClick={() => handleClick()}
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
                  }

                  // Ensure unique assignments per student
                  const uniqueAssignmentsMap = new Map<
                    string,
                    AssignmentItem
                  >();
                  student.assignment.forEach((item) => {
                    const id =
                      item.assignmentId ||
                      `${item.assignmentName}-${item.title}`;
                    if (!uniqueAssignmentsMap.has(id)) {
                      uniqueAssignmentsMap.set(id, item);
                    }
                  });
                  const uniqueAssignments = Array.from(
                    uniqueAssignmentsMap.values()
                  );

                  return uniqueAssignments.map(
                    (assignmentItem, assignIndex) => {
                      const modalId = `${student.studentId}-${assignmentItem.assignmentName}-${assignIndex}`;

                      return (
                        <tr
                          key={`${student.studentId}-${assignIndex}`}
                          className={`text-[12px] border-b border-gray-300 dark:border-gray-600 ${
                            studentIndex % 2 === 0
                              ? "bg-white dark:bg-[#2C2C2C]"
                              : "bg-[#F8F8F8] dark:bg-[#303030]"
                          }`}
                        >
                          <td className="px-3 py-2 break-words">
                            {student?.studentId}
                          </td>
                          <td className="px-3 py-2 text-[#3D8FDE] font-medium break-words">
                            {studentInfo?.studentFirstName}{" "}
                            {studentInfo?.studentLastName}
                          </td>
                          <td className="px-3 py-2 break-words">
                            {assignmentItem.assignmentId || "-"}
                          </td>
                          <td className="px-3 py-2 break-words">
                            {studentDetails?.languageLevel || "-"}
                          </td>
                          <td className="px-3 py-2 break-words">
                            {studentDetails?.student?.learningInterest}
                          </td>
                          <td className="px-3 py-2 break-words">
                            {assignmentItem.title}
                          </td>
                          <td className="px-3 py-2 break-words">
                            {formatDate(assignmentItem?.assignedDate)}
                          </td>
                          <td className="px-3 py-2 break-words">
                            {formatDate(assignmentItem?.dueDate)}
                          </td>
                          <td className="px-3 py-2 break-words">
                            <span
                              className={`py-1 px-2 rounded-md text-[10px] flex items-center justify-center min-w-[80px] ${getStatusStyle(
                                assignmentItem?.assignmentStatus ||
                                  assignmentItem?.status
                              )}`}
                            >
                              {assignmentItem?.assignmentStatus ||
                                assignmentItem?.status ||
                                "Not Assigned"}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-center relative">
                            <button
                              className="text-gray-500 hover:text-gray-700 dark:text-[#ffff]"
                              onClick={() =>
                                setOpenDropdownId(
                                  openDropdownId === modalId ? null : modalId
                                )
                              }
                            >
                              <BsThreeDotsVertical />
                            </button>

                            {openDropdownId === modalId && (
                              <div className="absolute right-0 w-36 shadow-2xl space-y-2 bg-white rounded-md z-50 border border-gray-200 dark:bg-[#343434]">
                                {(() => {
                                  const status =
                                    assignmentItem.assignmentStatus ||
                                    assignmentItem.status;
                                  if (status === "Completed") {
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
                                          onClick={() => {
                                            setStudentId(student.studentId);
                                            setStudentName(
                                              `${
                                                studentInfo?.studentFirstName ??
                                                ""
                                              } ${
                                                studentInfo?.studentLastName ??
                                                ""
                                              }`
                                            );
                                            setSessionClassType(
                                              studentDetails?.classType ??
                                                "REGULARCLASS"
                                            );
                                            setAssignedTeacher(
                                              studentDetails?.assignedTeacherEmail ??
                                                ""
                                            );
                                            setAssignedTeacherId(
                                              studentDetails?.teacher
                                                ?.teacherId ?? ""
                                            );
                                            setOpenModalId(modalId);
                                          }}
                                        >
                                          New Assignment
                                        </button>
                                        <button
                                          className="block w-full px-4 py-1 text-[12px] text-black dark:text-[#ffff]"
                                          onClick={() =>
                                            handleViewProfile(student.studentId)
                                          }
                                        >
                                          Assign
                                        </button>
                                        <button
                                          className="block w-full px-4 py-1 text-[12px] dark:text-[#ffff]"
                                          onClick={() =>
                                            setOpenDropdownId(null)
                                          }
                                        >
                                          Cancel
                                        </button>
                                      </>
                                    );
                                  } else if (
                                    status === "Not Completed" ||
                                    status === "Assigned"
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
                                          onClick={() =>
                                            setOpenDropdownId(null)
                                          }
                                        >
                                          Cancel
                                        </button>
                                      </>
                                    );
                                  } else if (status === "Not Assigned") {
                                    return (
                                      <>
                                        <button
                                          className="block w-full px-4 py-1 text-[12px] text-black dark:text-[#ffff]"
                                          onClick={() =>
                                            handleViewProfile(student.studentId)
                                          }
                                        >
                                          Assign
                                        </button>
                                        <button
                                          className="block w-full px-4 py-1 text-[12px] dark:text-[#ffff]"
                                          onClick={() => {
                                            setStudentId(student.studentId);
                                            setStudentName(
                                              `${
                                                studentInfo?.studentFirstName ??
                                                ""
                                              } ${
                                                studentInfo?.studentLastName ??
                                                ""
                                              }`
                                            );
                                            setSessionClassType(
                                              studentDetails?.classType ??
                                                "REGULARCLASS"
                                            );
                                            setAssignedTeacher(
                                              studentDetails?.assignedTeacherEmail ??
                                                ""
                                            );
                                            setAssignedTeacherId(
                                              studentDetails?.teacher
                                                ?.teacherId ?? ""
                                            );
                                            setOpenModalId(modalId);
                                          }}
                                        >
                                          New Assignment
                                        </button>
                                        <button
                                          className="block w-full px-4 py-1 text-[12px] dark:text-[#ffff]"
                                          onClick={() =>
                                            setOpenDropdownId(null)
                                          }
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
                            {openModalId === modalId && (
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
                                        value={title}
                                        onChange={(e) =>
                                          setTitle(e.target.value)
                                        }
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
                                          value={assignedDate}
                                          onChange={(e) =>
                                            setAssignedDate(e.target.value)
                                          }
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <label className="text-sm block mb-1 dark:text-[#fff]">
                                          Due Date
                                        </label>
                                        <input
                                          type="date"
                                          className="w-full border rounded-md px-2 py-2 dark:bg-[#5C5C5C] dark:text-[#fff]"
                                          value={dueDate}
                                          onChange={(e) =>
                                            setDueDate(e.target.value)
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="mb-4">
                                      <label className="text-sm block mb-1 dark:text-[#fff]">
                                        Comment
                                      </label>
                                      <textarea
                                        placeholder="Write your comment here..."
                                        value={comment}
                                        onChange={(e) =>
                                          setComment(e.target.value)
                                        }
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
                                      onClick={() => handleClick()}
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
                    }
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(regularStudents.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default RegularStudents;
