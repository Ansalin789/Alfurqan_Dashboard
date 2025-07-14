"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdTune, MdFormatListBulleted } from "react-icons/md";
import { Search } from "lucide-react";
import { IoMdList } from "react-icons/io";
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
  level?: string;
}

const GroupStudents = () => {
  const [groupStudents, setGroupStudents] = useState<StudentWithAssignments[]>(
    []
  );
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [sessionClassType, setSessionClassType] = useState("");
  const [assignedTeacher, setAssignedTeacher] = useState("");
  const [assignedTeacherId, setAssignedTeacherId] = useState("");
  const [course, setCourse] = useState("");
  const [level, setLevel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGroups, setFilteredGroups] = useState<
    Record<string, StudentWithAssignments[]>
  >({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [assignedDate, setAssignedDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [comment, setComment] = useState("");
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  // Add these to your existing state declarations
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    studentName: "",
    studentId: "",
    assignmentName: "",
    status: "",
    fromDate: "",
    toDate: "",
    groupId: "",
    course: "",
    level: "",
  });

  const router = useRouter();
  useEffect(() => {
    setFilteredGroups(groupedStudents);
  }, [groupStudents]);
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowerQuery = query.toLowerCase();

    if (!query.trim()) {
      setFilteredGroups(groupedStudents);
      return;
    }

    const filtered = Object.entries(groupedStudents).reduce(
      (acc, [groupId, students]) => {
        const matchingStudents = students.filter((student) => {
          const studentInfo = student.studentDetails?.student;
          const fullName = `${studentInfo?.studentFirstName || ""} ${
            studentInfo?.studentLastName || ""
          }`.toLowerCase();
          const firstAssignment = student.assignment?.[0] || {};

          return (
            student.studentId?.toLowerCase()?.includes(lowerQuery) ||
            fullName.includes(lowerQuery) ||
            studentInfo?.studentEmail?.toLowerCase()?.includes(lowerQuery) ||
            studentInfo?.studentPhone?.toString()?.includes(lowerQuery) ||
            studentInfo?.studentCountry?.toLowerCase()?.includes(lowerQuery) ||
            student.studentDetails?.subscription?.subscriptionName
              ?.toLowerCase()
              ?.includes(lowerQuery) ||
            studentInfo?.preferredTeacher
              ?.toLowerCase()
              ?.includes(lowerQuery) ||
            studentInfo?.preferredFromTime
              ?.toLowerCase()
              ?.includes(lowerQuery) ||
            studentInfo?.evaluationStatus
              ?.toLowerCase()
              ?.includes(lowerQuery) ||
            firstAssignment?.assignmentName
              ?.toLowerCase()
              ?.includes(lowerQuery) ||
            firstAssignment?.assignmentStatus
              ?.toLowerCase()
              ?.includes(lowerQuery) ||
            firstAssignment?.assignmentType
              ?.toLowerCase()
              ?.includes(lowerQuery) ||
            groupId.toLowerCase().includes(lowerQuery)
          );
        });

        if (matchingStudents.length > 0) {
          acc[groupId] = matchingStudents;
        }

        return acc;
      },
      {} as Record<string, StudentWithAssignments[]>
    );

    setFilteredGroups(filtered);
  };

  const handleApplyFilters = () => {
    let filtered = { ...groupedStudents };

    // Apply each filter if it has a value
    if (filters.studentName) {
      const lowerName = filters.studentName.toLowerCase();
      filtered = Object.entries(filtered).reduce((acc, [groupId, students]) => {
        const matchingStudents = students.filter((student) => {
          const studentInfo = student.studentDetails?.student;
          const fullName = `${studentInfo?.studentFirstName || ""} ${
            studentInfo?.studentLastName || ""
          }`.toLowerCase();
          return fullName.includes(lowerName);
        });
        if (matchingStudents.length > 0) {
          acc[groupId] = matchingStudents;
        }
        return acc;
      }, {} as Record<string, StudentWithAssignments[]>);
    }

    if (filters.studentId) {
      const lowerId = filters.studentId.toLowerCase();
      filtered = Object.entries(filtered).reduce((acc, [groupId, students]) => {
        const matchingStudents = students.filter((student) =>
          student.studentId.toLowerCase().includes(lowerId)
        );
        if (matchingStudents.length > 0) {
          acc[groupId] = matchingStudents;
        }
        return acc;
      }, {} as Record<string, StudentWithAssignments[]>);
    }

    if (filters.assignmentName) {
      const lowerAssignment = filters.assignmentName.toLowerCase();
      filtered = Object.entries(filtered).reduce((acc, [groupId, students]) => {
        const matchingStudents = students.filter((student) =>
          student.assignment.some((assignment) =>
            assignment.title.toLowerCase().includes(lowerAssignment)
          )
        );
        if (matchingStudents.length > 0) {
          acc[groupId] = matchingStudents;
        }
        return acc;
      }, {} as Record<string, StudentWithAssignments[]>);
    }

    if (filters.status) {
      filtered = Object.entries(filtered).reduce((acc, [groupId, students]) => {
        const matchingStudents = students.filter((student) =>
          student.assignment.some(
            (assignment) =>
              (assignment.assignmentStatus || assignment.status) ===
              filters.status
          )
        );
        if (matchingStudents.length > 0) {
          acc[groupId] = matchingStudents;
        }
        return acc;
      }, {} as Record<string, StudentWithAssignments[]>);
    }

    if (filters.fromDate && filters.toDate) {
      const from = new Date(filters.fromDate);
      const to = new Date(filters.toDate);
      filtered = Object.entries(filtered).reduce((acc, [groupId, students]) => {
        const matchingStudents = students.filter((student) =>
          student.assignment.some((assignment) => {
            const assignedDate = new Date(assignment.assignedDate);
            return assignedDate >= from && assignedDate <= to;
          })
        );
        if (matchingStudents.length > 0) {
          acc[groupId] = matchingStudents;
        }
        return acc;
      }, {} as Record<string, StudentWithAssignments[]>);
    }

    if (filters.groupId) {
      const lowerGroupId = filters.groupId.toLowerCase();
      filtered = Object.entries(filtered).reduce((acc, [groupId, students]) => {
        if (groupId.toLowerCase().includes(lowerGroupId)) {
          acc[groupId] = students;
        }
        return acc;
      }, {} as Record<string, StudentWithAssignments[]>);
    }

    if (filters.course) {
      const lowerCourse = filters.course.toLowerCase();
      filtered = Object.entries(filtered).reduce((acc, [groupId, students]) => {
        const matchingStudents = students.filter((student) =>
          student.studentDetails?.student?.learningInterest
            ?.toLowerCase()
            .includes(lowerCourse)
        );
        if (matchingStudents.length > 0) {
          acc[groupId] = matchingStudents;
        }
        return acc;
      }, {} as Record<string, StudentWithAssignments[]>);
    }

    if (filters.level) {
      const lowerLevel = filters.level.toLowerCase();
      filtered = Object.entries(filtered).reduce((acc, [groupId, students]) => {
        const matchingStudents = students.filter((student) =>
          student.studentDetails?.languageLevel
            ?.toLowerCase()
            .includes(lowerLevel)
        );
        if (matchingStudents.length > 0) {
          acc[groupId] = matchingStudents;
        }
        return acc;
      }, {} as Record<string, StudentWithAssignments[]>);
    }

    setFilteredGroups(filtered);
    setShowFilterModal(false);
  };

  const handleResetFilters = () => {
    setFilters({
      studentName: "",
      studentId: "",
      assignmentName: "",
      status: "",
      fromDate: "",
      toDate: "",
      groupId: "",
      course: "",
      level: "",
    });
    setFilteredGroups(groupedStudents);
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

        // Filter for group students only
        const group = allStudents.filter(
          (student) => student.classType?.toUpperCase() === "GROUPCLASS"
        );

        console.log("Group students filtered:", group);
        setGroupStudents(group);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchData();
  }, []);

  // Group students by groupClassId
  const groupedStudents = groupStudents.reduce((acc, student) => {
    const groupId = student.groupClassId || "no-group";
    if (!acc[groupId]) {
      acc[groupId] = [];
    }
    acc[groupId].push(student);
    return acc;
  }, {} as Record<string, StudentWithAssignments[]>);

  const handleViewProfile = (studentId: string, assignmentId: string) => {
    if (assignmentId && assignmentId.trim() !== "") {
      router.push(`/teacher/ui/managestudentview?studentId=${studentId}&assignmentId=${assignmentId}`);
    } else {
      router.push(`/teacher/ui/managestudentview?studentId=${studentId}`);
    }
  };

  const handleClick = (courseValue?: string, levelValue?: string) => {
    const finalCourse = courseValue || course;
    const finalLevel = levelValue || level;
    
    console.log("🔍 Debug - Values being passed:");
    console.log("course:", finalCourse);
    console.log("level:", finalLevel);
    console.log("studentId:", studentId);
    console.log("studentName:", studentName);
    
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
      course: finalCourse,
      level: finalLevel,
    }).toString();

    console.log("🔍 Final URL:", `/teacher/ui/addingnewassignment?${query}`);
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

  const toggleStudentList = (groupId: string) => {
    setExpandedGroupId(expandedGroupId === groupId ? null : groupId);
  };

  return (
    <div className="md:p-0 mx-auto w-full">
      <div className="flex flex-col h-full w-full justify-between">
        <div className="flex flex-col">
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
                        Group ID
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded text-xs dark:text-[#fff] dark:border-[#5C5C5C] dark:bg-[#343434]"
                        value={filters.groupId}
                        onChange={(e) =>
                          setFilters({ ...filters, groupId: e.target.value })
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
                        Show {Object.keys(filteredGroups).length} results
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                <span className="text-left -ml-60">
                  Showing {Object.keys(filteredGroups).length} of{" "}
                  {Object.keys(groupedStudents).length}
                </span>
              </div>
            </div>

            {/* Table */}
            <table className="table-fixed w-full border border-gray-300 dark:border-gray-600">
              <thead className="text-[12px] bg-[#4C6993] text-white">
                <tr>
                  {[
                    { label: "Assignment ID", width: "w-[15%]" },
                    { label: "Student Name", width: "w-[12%]" },
                    { label: "Group ID", width: "w-[15%]" },
                    { label: "Level", width: "w-[6%]" },
                    { label: "Course", width: "w-[10%]" },
                    { label: "Assignment Name", width: "w-[15%]" },
                    { label: "Assign Date", width: "w-[11%]" },
                    { label: "Due Date", width: "w-[11%]" },
                    { label: "Status", width: "w-[12%]" },
                    { label: "Action", width: "w-[8%]" },
                  ].map((header) => (
                    <th
                      key={header.label}
                      className={`px-2 py-1 border border-[#4C6993] text-left text-wrap break-words ${header.width}`}
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
               {Object.entries(
    searchQuery || Object.values(filters).some(v => v !== '') 
      ? filteredGroups 
      : groupedStudents
  ).map(([groupId, students], groupIndex) => {
                  // Get the first student's details for the group row
                  const firstStudent = students[0];
                  const studentInfo = firstStudent.studentDetails?.student;
                  const studentDetails = firstStudent.studentDetails;

                  // If no assignments, show one row with empty assignment data
                  if (firstStudent.assignment.length === 0) {
                    // Define modalId for no-assignment case
                    const modalIdNoAssignment = `${groupId}-no-assignment`;
                    return (
                      <tr
                        key={modalIdNoAssignment}
                        className={`text-[12px] border-b border-gray-300 dark:border-gray-600 ${
                          groupIndex % 2 === 0
                            ? "bg-white dark:bg-[#2C2C2C]"
                            : "bg-[#F8F8F8] dark:bg-[#303030]"
                        }`}
                      >
                        <td className="px-3 py-2 break-words">-</td>
                        <td className="px-3 py-2 break-words relative">
                          <button
                            onClick={() => toggleStudentList(groupId)}
                            className="text-[#3D8FDE] font-medium hover:underline flex items-center gap-1"
                          >
                            <MdFormatListBulleted className="w-5 h-5 text-[#3D8FDE]" />
                            View List ({students.length} students)
                          </button>
                          {expandedGroupId === groupId && (
                            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 p-2 z-10 min-w-[100px]">
                              {students.map((student, idx) => {
                                const studentData =
                                  student.studentDetails?.student;
                                return (
                                  <div
                                    key={student.studentId}
                                    className="text-[9px] py-1 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                                  >
                                    {studentData?.studentFirstName}{" "}
                                    {studentData?.studentLastName}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2 break-words">
                          {groupId === "no-group" ? "-" : groupId}
                        </td>
                        <td className="px-3 py-2 break-words">
                          {students[0]?.level || "-"}
                        </td>
                        <td className="px-3 py-2 break-words">
                          {studentDetails?.student?.learningInterest}
                        </td>
                        <td className="px-3 py-2 break-words">-</td>
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
                                  handleViewProfile(firstStudent.studentId, "")
                                }
                              >
                                Assign
                              </button>
                              <button
                                className="block w-full px-4 py-1 text-[12px] dark:text-[#ffff]"
                                onClick={() => {
                                  setStudentId(firstStudent.studentId);
                                  setStudentName(
                                    `${studentInfo?.studentFirstName ?? ""} ${
                                      studentInfo?.studentLastName ?? ""
                                    }`
                                  );
                                  setSessionClassType(
                                    studentDetails?.classType ?? "GROUPCLASS"
                                  );
                                  setAssignedTeacher(
                                    studentDetails?.teacher?.teacherName ?? ""
                                  );
                                  setAssignedTeacherId(
                                    studentDetails?.teacher?.teacherId ?? ""
                                  );
                                  setCourse(studentDetails?.student?.learningInterest || "");
                                  setLevel(studentDetails?.languageLevel || "");
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

                  // Ensure unique assignments per group
                  const uniqueAssignmentsMap = new Map<
                    string,
                    AssignmentItem
                  >();
                  students.forEach((student) => {
                    student.assignment.forEach((item) => {
                      const id =
                        item.assignmentId ||
                        `${item.assignmentName}-${item.title}`;
                      if (!uniqueAssignmentsMap.has(id)) {
                        uniqueAssignmentsMap.set(id, item);
                      }
                    });
                  });
                  const uniqueAssignments = Array.from(
                    uniqueAssignmentsMap.values()
                  );

                  return uniqueAssignments.map(
                    (assignmentItem, assignIndex) => {
                      const modalId = `${groupId}-${assignmentItem.assignmentName}-${assignIndex}`;

                      return (
                        <tr
                          key={`${groupId}-${assignIndex}`}
                          className={`text-[12px] border-b border-gray-300 dark:border-gray-600 ${
                            groupIndex % 2 === 0
                              ? "bg-white dark:bg-[#2C2C2C]"
                              : "bg-[#F8F8F8] dark:bg-[#303030]"
                          }`}
                        >
                          <td className="px-3 py-2 break-words">
                            {assignmentItem.assignmentId || ""}
                          </td>
                          <td className="px-3 py-2 break-words relative">
                            <button
                              onClick={() => toggleStudentList(groupId)}
                              className="text-[#3D8FDE] font-medium hover:underline flex items-center gap-1"
                            >
                              <MdFormatListBulleted className="w-5 h-5 text-[#3D8FDE]" />
                              View List{" "}
                              <span className="text-[8px]">
                                ({students.length} students)
                              </span>
                            </button>
                            {expandedGroupId === groupId && (
                              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 p-2 z-10 min-w-[150px]">
                                {students.map((student, idx) => {
                                  const studentData =
                                    student.studentDetails?.student;
                                  return (
                                    <div
                                      key={student.studentId}
                                      className="text-[11px] py-1 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                                    >
                                      {studentData?.studentFirstName}{" "}
                                      {studentData?.studentLastName}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-2 break-words">
                            {groupId === "no-group" ? "-" : groupId}
                          </td>
                          <td className="px-3 py-2 break-words">
                            {assignmentItem.title}
                          </td>
                          <td className="px-3 py-2 break-words">
                            {students[0]?.level || "-"}
                          </td>
                          <td className="px-3 py-2 break-words">
                            {studentDetails?.student?.learningInterest}
                          </td>
                          <td className="px-3 py-2 break-words">
                            {assignmentItem?.assignedDate}
                          </td>
                          <td className="px-3 py-2 break-words">
                            {assignmentItem?.dueDate}
                          </td>
                          <td className={`px-3 py-2 break-words ${
  (assignmentItem?.assignmentStatus || assignmentItem?.status) === 'Completed'
    ? 'bg-green-100 text-green-700'
    : (assignmentItem?.assignmentStatus || assignmentItem?.status) === 'Pending'
    ? 'bg-orange-100 text-orange-700'
    : ''
}`}>
                            <span
                              className={`py-1 px-2 rounded-md text-[10px] flex items-center justify-center min-w-[80px]`}
                            >
                              {assignmentItem?.assignmentStatus || assignmentItem?.status || 'Not Assigned'}
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
                                            handleViewProfile(firstStudent.studentId, assignmentItem.assignmentId || "")
                                          }
                                        >
                                          View Profile
                                        </button>
                                        <button
                                          className="block w-full px-4 py-1 text-[12px] dark:text-[#ffff]"
                                          onClick={() => {
                                            setStudentId(firstStudent.studentId);
                                            setStudentName(
                                              `${studentInfo?.studentFirstName ?? ""} ${studentInfo?.studentLastName ?? ""}`
                                            );
                                            setSessionClassType(
                                              studentDetails?.classType ?? "GROUPCLASS"
                                            );
                                            setAssignedTeacher(
                                              studentDetails?.teacher?.teacherName ?? ""
                                            );
                                            setAssignedTeacherId(
                                              studentDetails?.teacher?.teacherId ?? ""
                                            );
                                            console.log("🔍 GroupStudents - Setting values for student:", firstStudent.studentId);
                                            console.log("🔍 students array:", students);
                                            console.log("🔍 students[0]:", students[0]);
                                            console.log("🔍 students[0]?.level:", students[0]?.level);
                                            console.log("🔍 studentDetails?.student?.learningInterest:", studentDetails?.student?.learningInterest);
                                            
                                            const courseValue = studentDetails?.student?.learningInterest || "";
                                            const levelValue = students[0]?.level || "";
                                            
                                            console.log("🔍 Final courseValue:", courseValue);
                                            console.log("🔍 Final levelValue:", levelValue);
                                            
                                            setCourse(courseValue);
                                            setLevel(levelValue);
                                            setOpenModalId(modalId);
                                          }}
                                        >
                                          New Assignment
                                        </button>
                                        <button
                                          className="block w-full px-4 py-1 text-[12px] text-black dark:text-[#ffff]"
                                          onClick={() =>
                                            handleViewProfile(firstStudent.studentId, assignmentItem.assignmentId || "")
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
                                            handleViewProfile(firstStudent.studentId, assignmentItem.assignmentId || "")
                                          }
                                        >
                                          View Profile
                                        </button>
                                        <button
                                          className="block w-full px-4 py-1 text-[12px] dark:text-[#ffff]"
                                          onClick={() => {
                                            setStudentId(
                                              firstStudent.studentId
                                            );
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
                                                "GROUPCLASS"
                                            );
                                            setAssignedTeacher(
                                              studentDetails?.teacher?.teacherName ??
                                                ""
                                            );
                                            setAssignedTeacherId(
                                              studentDetails?.teacher
                                                ?.teacherId ?? ""
                                            );
                                            console.log("🔍 GroupStudents - Setting values for assignment student:", firstStudent.studentId);
                                            console.log("🔍 students array:", students);
                                            console.log("🔍 students[0]:", students[0]);
                                            console.log("🔍 students[0]?.level:", students[0]?.level);
                                            console.log("🔍 studentDetails?.student?.learningInterest:", studentDetails?.student?.learningInterest);
                                            
                                            const courseValue = studentDetails?.student?.learningInterest || "";
                                            const levelValue = students[0]?.level || "";
                                            
                                            console.log("🔍 Final courseValue:", courseValue);
                                            console.log("🔍 Final levelValue:", levelValue);
                                            
                                            setCourse(courseValue);
                                            setLevel(levelValue);
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
                                      onClick={() => {
                                        console.log("🔍 GroupStudents - Create Assignment button clicked");
                                        console.log("🔍 studentDetails?.student?.learningInterest:", studentDetails?.student?.learningInterest);
                                        console.log("🔍 students[0]?.level:", students[0]?.level);
                                        
                                        const courseValue = studentDetails?.student?.learningInterest || "";
                                        const levelValue = students[0]?.level || "";
                                        
                                        console.log("🔍 Passing to handleClick - courseValue:", courseValue);
                                        console.log("🔍 Passing to handleClick - levelValue:", levelValue);
                                        
                                        handleClick(courseValue, levelValue);
                                      }}
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
                  totalPages={Math.ceil(groupStudents.length / itemsPerPage)}
                  onPageChange={setCurrentPage}
                />
        </div>
      </div>
    </div>
  );
};

export default GroupStudents;
