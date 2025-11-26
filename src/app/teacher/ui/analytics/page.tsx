"use client";
import React, { useEffect, useState } from "react";
import { CloudSun, Filter, Search, X } from "lucide-react";
import Image from "next/image";

import BaseLayout from "@/components/BaseLayout";
import { useRouter } from "next/navigation";
import axios from "axios";
import TeacherHeader from "../../components/TeacherHeader";
import { MdTune } from "react-icons/md";
import Modal from "react-modal";
import { clearScreenDown } from "node:readline";

interface Student {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
}

interface Teacher {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
}

interface Schedule {
  student: Student;
  teacher: Teacher;
  _id: string;
  classDay: string[];
  package: string;
  course: {
    courseName: string;
  };
  preferedTeacher: string;
  totalHourse: number;
  startDate: string;
  endDate: string;
  startTime: string[];
  endTime: string[];
  amount: string;
  scheduleStatus: string;
  sessionClassType: string;
  status: string;
  createdBy: string;
  createdDate: string;
  lastUpdatedDate: string;
  __v: number;
}

interface ClassScheduleResponse {
  totalCount: number;
  classSchedule: Schedule[];
}

interface SimpleStudent {
  studentId: string;
  name: string;
  level?: string;
  studentDetails: {
    student: {
      studentFirstName?: string;
      studentId?: string;
      learningInterest?: string;
      languageLevel?: string;
      createdDate?: string;
      status?: string;
      level?: string;
    };
    course: {
      courseName: string;
    };
    studentRate?: string;
    classType?: string;
  };
}

interface AnalyticsData {
  totalclasses: number;
  totalstudents: number;
  totalhours: number;
  totalearnings: number;
}

type ViewType = "students" | "classes" | "earnings";

function Analytics() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<ViewType>("students");

  const [students, setStudents] = useState<SimpleStudent[]>([]);

  const [uniqueStudentSchedules, setUniqueStudentSchedules] = useState<
    Schedule[]
  >([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClasses, setFilteredClasses] = useState<Schedule[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredStudents, setFilteredStudents] = useState<SimpleStudent[]>([]);

  const [filters, setFilters] = useState({
    courseName: "",
    classType: "",
    studentName: "",
    fromDate: "",
    toDate: "",
    time: "",
  });

  // helper to return tailwind / inline classes for status badges
  const getStatusClasses = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("completed && active")) {
      return "text-[#377E36] bg-[#ECFDF3] dark:bg-[#163216] dark:text-[#7EE08A]";
    }
    if (
      s.includes("student absent") ||
      s.includes("teacher absent") ||
      s === "absent" ||
      s.includes("absent")
    ) {
      return "text-[#B91C1C] bg-[#FFF1F1] dark:bg-[#3A1212] dark:text-[#FFB4B4]";
    }
    // default / other statuses
    return "text-[#343E59] bg-[#E4E4E4] dark:bg-[#4F4F4F] dark:text-white";
  };

  // Get unique values for dropdowns from API data based on active view
  const getCourseNames = () => {
    if (activeView === "students") {
      return Array.from(
        new Set(
          students
            .map((item) => item.studentDetails.student?.learningInterest)
            .filter(Boolean)
        )
      );
    } else {
      return Array.from(
        new Set(
          uniqueStudentSchedules
            .map((item) => item.course?.courseName)
            .filter(Boolean)
        )
      );
    }
  };

  const getClassTypes = () => {
    if (activeView === "students") {
      return Array.from(
        new Set(
          students.map((item) => item.studentDetails.classType).filter(Boolean)
        )
      );
    } else {
      return Array.from(
        new Set(
          uniqueStudentSchedules
            .map((item) => item.sessionClassType)
            .filter(Boolean)
        )
      );
    }
  };

  const courseNames = getCourseNames();
  const classTypes = getClassTypes();

  //cards

  useEffect(() => {
    const fetchAnalytics = async () => {
      const teacherId = localStorage.getItem("TeacherPortalId");
      console.log("Teacher ID:", teacherId); // DEBUG

      if (!teacherId) {
        console.warn("teacherportalId not found in localStorage.");
        return;
      }

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("TeacherAuthToken")
          : null;

      if (!token) {
        console.error("❌ TeacherAuthToken not found");
        return;
      }

      try {
        const res = await axios.get(
          `https://api.blackstoneinfomaticstech.com/dashboard/teacher/counts?teacherId=${teacherId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Analytics data fetched:", res.data); // DEBUG
        setAnalytics(res.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchAnalytics();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const teacherId = localStorage.getItem("TeacherPortalId");

        if (!teacherId) {
          console.error("No teacher ID found in localStorage.");
          return;
        }

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("TeacherAuthToken")
            : null;

        if (!token) {
          console.error("❌ TeacherAuthToken not found");
          return;
        }

        const response = await axios.get<SimpleStudent[]>(
          "https://api.blackstoneinfomaticstech.com/classShedule/teacher/list",
          {
            params: { teacherId },
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setStudents(response.data);
        console.log("Students fetched:", response.data); // DEBUG
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchSchedulesByTeacher = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("TeacherAuthToken")
            : null;
        const teacherIdToFilter = localStorage.getItem("TeacherPortalId");

        if (!token || !teacherIdToFilter) {
          console.error("Missing token or teacher ID");
          return;
        }

        const response = await axios.get<ClassScheduleResponse>(
          `https://api.blackstoneinfomaticstech.com/classShedule/teacher?teacherId=${teacherIdToFilter}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUniqueStudentSchedules(response.data.classSchedule);
        setFilteredClasses(response.data.classSchedule); // <-- initialize filteredClasses
        setTotalCount(response.data.totalCount); // ✅ store total count
      } catch (error) {
        console.error("Error fetching class schedules:", error);
      }
    };

    fetchSchedulesByTeacher();
  }, []);

  //filters

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (activeView === "students") {
      // Search in students data
      const filtered = students.filter((item) => {
        const name = item.name?.toLowerCase() || "";
        const course =
          item.studentDetails?.course?.courseName?.toLowerCase() || "";
        const classType = item.studentDetails?.classType?.toLowerCase() || "";
        const status = item.studentDetails?.student.status?.toLowerCase() || "";
        const studentId = item.studentId?.toLowerCase() || "";

        return (
          studentId.includes(query.toLowerCase()) ||
          name.includes(query.toLowerCase()) ||
          course.includes(query.toLowerCase()) ||
          classType.includes(query.toLowerCase()) ||
          status.includes(query.toLowerCase())
        );
      });
      setFilteredStudents(filtered);
    } else {
      // Search in classes/earnings data
      const filtered = uniqueStudentSchedules.filter((item) => {
        const fullName =
          `${item.student.studentFirstName} ${item.student.studentLastName}`.toLowerCase();
        return (
          item._id.toLowerCase().includes(query.toLowerCase()) ||
          fullName.includes(query.toLowerCase()) ||
          item.student.studentEmail
            ?.toLowerCase()
            .includes(query.toLowerCase()) ||
          item.course.courseName?.toLowerCase().includes(query.toLowerCase()) ||
          item.scheduleStatus?.toLowerCase().includes(query.toLowerCase()) ||
          item.teacher.teacherName?.toLowerCase().includes(query.toLowerCase())
        );
      });
      setFilteredClasses(filtered);
    }

    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    // Apply filters based on active view
    if (activeView === "students") {
      // Filter students data (SimpleStudent[])
      let filtered = [...students];

      if (filters.courseName) {
        filtered = filtered.filter((item) =>
          item.studentDetails.course.courseName
            ?.toLowerCase()
            .includes(filters.courseName.toLowerCase())
        );
      }

      if (filters.classType) {
        filtered = filtered.filter((item) =>
          item.studentDetails.classType
            ?.toLowerCase()
            .includes(filters.classType.toLowerCase())
        );
      }

      if (filters.studentName) {
        filtered = filtered.filter((item) => item.name === filters.studentName);
      }

      if (filters.fromDate && filters.toDate) {
        const from = new Date(filters.fromDate);
        const to = new Date(filters.toDate);
        filtered = filtered.filter((item) => {
          const dateStr = item.studentDetails.student.createdDate;
          if (!dateStr) return false;
          const date = new Date(dateStr);
          return date >= from && date <= to;
        });
      }

      setFilteredStudents(filtered);
    } else {
      // Filter classes/earnings data (Schedule[])
      let filtered = [...uniqueStudentSchedules];

      if (filters.courseName) {
        filtered = filtered.filter(
          (item) =>
            item.course?.courseName.toLowerCase().trim() ===
            filters.courseName.toLowerCase().trim()
        );
      }

      if (filters.classType) {
        filtered = filtered.filter(
          (item) => item.sessionClassType === filters.classType
        );
      }

      if (filters.studentName) {
        filtered = filtered.filter((item) => {
          const fullName = `${item.student.studentFirstName} ${item.student.studentLastName}`;
          return fullName === filters.studentName;
        });
      }

      if (filters.fromDate && filters.toDate) {
        const from = new Date(filters.fromDate);
        const to = new Date(filters.toDate);
        filtered = filtered.filter((item) => {
          const startDate = new Date(item.startDate);
          return startDate >= from && startDate <= to;
        });
      }

      setFilteredClasses(filtered);
    }

    console.log("Filters applied:", filters);
    setCurrentPage(1);
    setIsFilterModalOpen(false); // close modal after applying
  };

  const handleResetFilters = () => {
    setFilters({
      courseName: "",
      classType: "",
      studentName: "",
      fromDate: "",
      toDate: "",
      time: "",
    });

    // Reset based on active view
    if (activeView === "students") {
      setFilteredStudents(students); // show all students again
    } else {
      setFilteredClasses(uniqueStudentSchedules); // show all classes again
    }

    setSearchQuery(""); // optionally clear search
    setIsFilterModalOpen(false); // close modal
  };

  useEffect(() => {
    // Only apply filters to students view
    if (activeView === "students") {
      let filtered = [...students];

      if (filters.courseName) {
        filtered = filtered.filter((item) =>
          item.studentDetails.course.courseName
            ?.toLowerCase()
            .includes(filters.courseName.toLowerCase())
        );
      }

      if (filters.classType) {
        filtered = filtered.filter((item) =>
          item.studentDetails.classType
            ?.toLowerCase()
            .includes(filters.classType.toLowerCase())
        );
      }

      if (filters.studentName) {
        filtered = filtered.filter((item) => item.name === filters.studentName);
      }

      if (filters.fromDate && filters.toDate) {
        const from = new Date(filters.fromDate);
        const to = new Date(filters.toDate);
        filtered = filtered.filter((item) => {
          const dateStr = item.studentDetails.student.createdDate;
          if (!dateStr) return false;
          const date = new Date(dateStr);
          return date >= from && date <= to;
        });
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();

        filtered = filtered.filter((item) => {
          const name = item.name?.toLowerCase() || "";
          const course =
            item.studentDetails?.course?.courseName?.toLowerCase() || "";
          const classType = item.studentDetails?.classType?.toLowerCase() || "";
          const status =
            item.studentDetails?.student.status?.toLowerCase() || "";
          const studentId = item.studentId?.toLowerCase() || "";

          return (
            studentId.includes(query) ||
            name.includes(query) ||
            course.includes(query) ||
            classType.includes(query) ||
            status.includes(query)
          );
        });
      }

      setFilteredStudents(filtered);
    }
  }, [students, filters, searchQuery, activeView]);

  // Get student names based on active view
  const getStudentNames = () => {
    if (activeView === "students") {
      return Array.from(new Set(students.map((item) => item.name)));
    } else {
      return Array.from(
        new Set(
          uniqueStudentSchedules.map(
            (item) =>
              `${item.student.studentFirstName} ${item.student.studentLastName}`
          )
        )
      );
    }
  };

  const studentNames = getStudentNames();

  const itemsPerPage = 10; // ✅ Add this line to fix the error

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClasses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);

  // table header definitions + renderer
  const tableHeaders = {
    students: [
      { label: "Student ID", width: "w-[10%]" },
      { label: "Student Name", width: "w-[14%]" },
      { label: "Course", width: "w-[14%]" },
      { label: "Class Type", width: "w-[10%]" },
      { label: "Joined Date", width: "w-[14%]" },
      { label: "Level", width: "w-[10%]" },
      { label: "Status", width: "w-[8%]" },
    ],
    classes: [
      { label: "Student ID", width: "w-[10%]" },
      { label: "Student Name", width: "w-[14%]" },
      { label: "Courses", width: "w-[14%]" },
      { label: "Class Type", width: "w-[12%]" },
      { label: "Course Duration", width: "w-[10%]" },
      { label: "Class Date", width: "w-[12%]" },
      { label: "Time", width: "w-[10%]" },
      { label: "Status", width: "w-[8%]" },
    ],
    earnings: [
      { label: "Student Id", width: "w-[10%]" },
      { label: "Student Name", width: "w-[14%]" },
      { label: "Course", width: "w-[12%]" },
      { label: "Class Type", width: "w-[12%]" },
      { label: "Course Duration", width: "w-[10%]" },
      { label: "Class Date", width: "w-[12%]" },
      { label: "Time", width: "w-[10%]" },
      { label: "Amount", width: "w-[8%]" },
      { label: "Status", width: "w-[8%]" },
    ],
  };

  const renderTableHeader = (headers: { label: string; width: string }[]) => (
    <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
      <tr className="font-medium">
        {headers.map((h, idx) => (
          <th
            key={h.label}
            className={`px-3 py-2 text-left font-medium border border-[#4C6993] dark:border-[#6087C0] whitespace-nowrap ${h.width
              } ${idx === 0
                ? "sticky left-0 z-20 bg-[#4C6993] text-white dark:bg-[#6087C0]"
                : idx === headers.length - 1
                  ? "sticky right-0 z-20 bg-[#4C6993] text-white dark:bg-[#6087C0]"
                  : ""
              }`}
          >
            {h.label}
          </th>
        ))}
      </tr>
    </thead>
  );

  return (
    <BaseLayout>
      <div className="">
        <TeacherHeader currentSection="Analytics" />
        <div className="md:p-0 mx-auto">
          <div className="h-full w-full  flex flex-col justify-between">
            <div className="grid grid-cols-3 gap-4">
              {/* Total Students Card */}
              <button
                type="button"
                onClick={() => setActiveView("students")}
                className={`bg-gradient-to-b from-white to-[#F6FAFF] text-left dark:from-[#343434] dark:to-[#2A2A2A] ${activeView === "students" ? "border-[1px]" : ""
                  } border-[#576CBC] rounded-xl p-4 shadow-lg cursor-pointer hover:shadow-md transition-shadow flex items-center justify-between focus:outline-none`}
              >
                <div className="flex flex-col justify-center">
                  <h3 className="text-sm font-medium text-[#0f172a] mb-4 dark:text-[#fff]">
                    Students
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-[28px] font-bold text-[#0f172a] dark:text-[#fff]">
                      {analytics?.totalstudents}
                    </p>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full bg-[#e0e7ff] flex items-center justify-center dark:bg-[#2C2C2C]">
                  <Image
                    src="/assets/images/Layer 49.svg"
                    alt="Student Icon"
                    width={32}
                    height={32}
                  />
                </div>
              </button>

              {/* Classes Card */}
              <button
                type="button"
                onClick={() => setActiveView("classes")}
                className={`bg-gradient-to-b from-white to-[#F6FAFF] text-left dark:from-[#343434] dark:to-[#2A2A2A] ${activeView === "classes" ? "border-[1px]" : ""
                  } border-[#576CBC] rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-md transition-shadow flex justify-between items-center focus:outline-none`}
              >
                <div className="flex flex-col justify-center">
                  <h3 className="text-sm font-medium text-[#0f172a] dark:text-[#fff] mb-4">
                    Classes
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-[28px] font-bold text-[#0f172a] dark:text-[#fff]">
                      {analytics?.totalclasses}
                    </p>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full bg-[#E3FAFF] dark:bg-[#2C2C2C] flex items-center justify-center">
                  <Image
                    src="/assets/images/classes.svg"
                    alt="Classes Icon"
                    width={32}
                    height={32}
                  />
                </div>
              </button>

              {/* Earnings Card */}
              <button
                type="button"
                onClick={() => setActiveView("earnings")}
                className={`bg-gradient-to-b from-white to-[#F6FAFF] text-left dark:from-[#343434] dark:to-[#2A2A2A] ${activeView === "earnings" ? "border-[1px]" : ""
                  } border-[#576CBC] rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-md transition-shadow flex justify-between items-center focus:outline-none`}
              >
                <div className="flex flex-col justify-center">
                  <h3 className="text-sm font-medium text-[#0f172a] dark:text-[#fff] mb-4">
                    Earnings
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-[#0f172a] dark:text-[#fff]">
                      ${analytics?.totalearnings.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full bg-[#dcfce7] dark:bg-[#2C2C2C] flex items-center justify-center">
                  <Image
                    src="/assets/images/Earnings.svg"
                    alt="Earnings Icon"
                    width={32}
                    height={32}
                  />
                </div>
              </button>
            </div>

            <div className="w-full bg-[#FAFAFB] rounded-lg dark:bg-[#343434] mt-6">
              <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434]">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by keyword"
                    className="bg-transparent outline-none text-[15px] w-52 py-3 "
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>

                <div
                  onClick={() => setIsFilterModalOpen(true)}
                  className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
                >
                  <MdTune className="w-4 h-4" />
                  <span>Filter</span>
                </div>

                <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
                  <span className="text-left -ml-60 ">
                    {activeView === "students" &&
                      `Showing ${filteredStudents.slice(0, 10).length} of ${filteredStudents.length
                      }`}
                    {activeView === "classes" &&
                      `Showing ${currentItems.length} of ${filteredClasses.length}`}
                    {activeView === "earnings" &&
                      `Showing ${currentItems.length} of ${filteredClasses.length}`}
                  </span>
                </div>
              </div>

              {activeView === "students" && (
                <div className="overflow-x-auto">
                  {" "}
                  {/* allow horizontal scroll on small screens */}
                  <table
                    className="table-auto w-full"
                    style={{ width: "100%", tableLayout: "auto" }}
                  >
                    {renderTableHeader(tableHeaders.students)}
                    <tbody className="bg-white dark:bg-[#343434] dark:divide-gray-600">
                      {filteredStudents.slice(0, 10).map((schedule) => (
                        <tr
                          key={schedule.studentId}
                          className="text-[12px] h-[50px] bg-[#fff] dark:bg-[#2C2C2C] border-b border-gray-200 dark:border-gray-700"
                        >
                          {/* Student ID */}
                          <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left break-words">
                            {schedule.studentDetails.student?.studentId ||
                              schedule.studentId ||
                              "-"}
                          </td>

                          {/* Student Name */}
                          <td className="px-3 py-2 text-left">
                            <div className="text-[#3D8FDE] font-medium">
                              {schedule.studentDetails.student
                                ?.studentFirstName ||
                                schedule.name ||
                                "-"}
                            </div>
                          </td>

                          {/* Course / Learning Interest */}
                          <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left break-words">
                            {schedule.studentDetails.student
                              ?.learningInterest || "-"}
                          </td>

                          {/* Class Type */}
                          <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left break-words">
                            {(() => {
                              const val = schedule.studentDetails.classType
                              return val
                                ? `${val.charAt(0).toUpperCase()}${val.slice(1).toLowerCase()}`
                                : "-";
                            })()}
                          </td>

                          {/* Joined Date */}
                          <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left break-words">
                            {schedule.studentDetails.student?.createdDate
                              ? new Date(
                                schedule.studentDetails.student.createdDate
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              })
                              : "-"}
                          </td>

                          {/* Level */}
                          <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left break-words">
                            {schedule.level || "-"}
                          </td>

                          {/* Status */}
                          <td className="px-3 py-2 text-left">
                            <span
                              className={`px-2.5 py-1 rounded-lg text-[11px] inline-block font-semibold
      ${schedule.studentDetails.student?.status === "Active"
                                  ? "text-[#0A8F40] bg-[#E8F5E9]"
                                  : schedule.studentDetails.student?.status === "Inactive"
                                    ? "text-[#B91C1C] bg-[#FEE2E2]"
                                    : "text-gray-600 bg-gray-200 dark:bg-[#4F4F4F]" // default/unknown
                                }`}
                            >
                              {schedule.studentDetails.student?.status || "-"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeView === "classes" && (
                <div className="overflow-x-auto">
                  <table
                    className="table-auto w-full"
                    style={{ width: "100%", tableLayout: "auto" }}
                  >
                    {renderTableHeader(tableHeaders.classes)}
                    <tbody className="bg-white dark:bg-[#343434] dark:divide-gray-600">
                      {filteredClasses
                        .slice(indexOfFirstItem, indexOfLastItem)
                        .map((cls) => (
                          <tr
                            key={cls._id}
                            className="text-[12px] h-[50px] bg-[#fff] dark:bg-[#2C2C2C]"
                          >
                            <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left break-words">
                              {cls.student.studentId}
                            </td>

                            <td className="px-3 py-2 text-[#3D8FDE] font-medium text-left break-words">
                              {cls.student.studentFirstName}
                            </td>

                            <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left break-words">
                              {cls.course.courseName}
                            </td>

                            <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left break-words">
                              {cls.sessionClassType}
                            </td>

                            <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left break-words">
                              30 min
                            </td>

                            <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left break-words">
                              {new Date(cls.startDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </td>

                            <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left break-words">
                              {cls.startTime}
                            </td>

                            <td className="px-4 py-3 text-left">
                              <span
                                className={`text-[10px] font-semibold py-1 px-2 rounded-lg inline-block text-left leading-tight break-words ${getStatusClasses(
                                  cls.scheduleStatus
                                )}`}
                              >
                                {cls.scheduleStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeView === "earnings" && (
                <div className="overflow-x-auto">
                  <table
                    className="table-auto w-full"
                    style={{ width: "100%", tableLayout: "auto" }}
                  >
                    {renderTableHeader(tableHeaders.earnings)}
                    <tbody>
                      {(filteredClasses.length > 0
                        ? filteredClasses
                        : uniqueStudentSchedules
                      )
                        .slice(indexOfFirstItem, indexOfLastItem)
                        .map((earning) => (
                          <tr
                            key={earning._id}
                            className="text-[12px] h-[50px] bg-[#fff] dark:bg-[#2C2C2C]"
                          >
                            <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left break-words">
                              {earning.student.studentId}
                            </td>

                            <td className="px-3 py-2 text-[#3D8FDE] font-medium text-left break-words">
                              {earning.student.studentFirstName}
                            </td>

                            <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left break-words">
                              {earning.course.courseName}
                            </td>

                            <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left break-words">
                              {earning.sessionClassType}
                            </td>

                            <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left break-words">
                              30 min
                            </td>

                            <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left break-words">
                              {new Date(earning.startDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </td>

                            <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left break-words">
                              {earning.startTime}
                            </td>

                            <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left break-words">
                              {earning.amount ? earning.amount : 0}
                            </td>

                            <td className="px-3 py-2 text-left">
                              <span
                                className={`text-[10px] font-semibold py-1 px-1 rounded-lg inline-block text-left leading-tight break-words ${getStatusClasses(
                                  earning.scheduleStatus
                                )}`}
                              >
                                {earning.scheduleStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                className=" mt-4 text-[12px] text-[#576CBC] border border-[#576CBC] bg-[#fff] rounded-md px-3 py-1 font-medium hover:bg-[#dbe2f3] transition duration-200 dark:bg-[#2E3343]"
                onClick={() => {
                  if (activeView === "students") {
                    router.push("/teacher/ui/analytics/totalstudents");
                  } else if (activeView === "classes") {
                    router.push("/teacher/ui/analytics/classes");
                  } else {
                    router.push("/teacher/ui/analytics/earnings");
                  }
                }}
              >
                View All
              </button>
            </div>

            {/* Filter Modal */}
            <Modal
              isOpen={isFilterModalOpen}
              onRequestClose={() => setIsFilterModalOpen(false)}
              className="fixed inset-0 flex justify-center items-center z-50"
              overlayClassName="fixed inset-0 bg-black bg-opacity-40"
            >
              <div className="bg-white dark:bg-[#252525] p-6 rounded-lg w-[500px] relative shadow-xl">
                {/* Close Icon */}
                <button
                  className="absolute top-2 right-3 text-gray-400 text-2xl"
                  onClick={() => setIsFilterModalOpen(false)}
                >
                  &times;
                </button>

                <h2 className="text-[16px] font-semibold mb-5 dark:text-white">
                  Filter by
                </h2>

                {/* Course Name */}
                <div className="mb-4">
                  <label className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]">
                    Course Name
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded text-xs dark:bg-[#343434] dark:text-white dark:border-[#5C5C5C] text-gray-400"
                    value={filters.courseName}
                    onChange={(e) =>
                      setFilters({ ...filters, courseName: e.target.value })
                    }
                  >
                    <option value="" className="text-gray-400 opacity-60">
                      Select Course
                    </option>
                    {courseNames.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Student Name */}
                <div className="mb-4">
                  <label className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]">
                    Student Name
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded text-xs dark:bg-[#343434] dark:text-white dark:border-[#5C5C5C] text-gray-400"
                    value={filters.studentName}
                    onChange={(e) =>
                      setFilters({ ...filters, studentName: e.target.value })
                    }
                  >
                    <option value="" className="text-gray-400 opacity-60">
                      Select Student
                    </option>
                    {studentNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Class Type */}
                <div className="mb-4">
                  <label className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]">
                    Class Type
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded text-xs dark:bg-[#343434] dark:text-white dark:border-[#5C5C5C] text-gray-400"
                    value={filters.classType}
                    onChange={(e) =>
                      setFilters({ ...filters, classType: e.target.value })
                    }
                  >
                    <option value="" className="text-gray-400 opacity-60">
                      Select ClassType
                    </option>
                    {classTypes.map((classType) => (
                      <option key={classType} value={classType}>
                        {classType}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Time */}
                <div className="mb-4">
                  <label
                    htmlFor="timimg"
                    className="block text-sm mb-1 dark:text-[#D6D6D6]"
                  >
                    Timing
                  </label>
                  <input
                    value={filters.time}
                    onChange={(e) =>
                      setFilters({ ...filters, time: e.target.value })
                    }
                    type="time"
                    className="w-full mb-4 py-2 border dark:border-[#5c5c5c] dark:bg-[#343434] dark:text-white rounded p-1 text-xs  [&::-webkit-calendar-picker-indicator]:dark:invert"
                    placeholder="Select Time"
                  />
                </div>

                {/* From & To Dates */}
                <div className="mb-5">
                  <label className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]">
                    Date Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="w-1/2 px-3 py-2 border rounded text-xs dark:bg-[#343434] dark:text-white dark:border-[#5C5C5C] placeholder:text-gray-400 placeholder:opacity-80 [&::-webkit-calendar-picker-indicator]:dark:invert"
                      value={filters.fromDate}
                      onChange={(e) =>
                        setFilters({ ...filters, fromDate: e.target.value })
                      }
                      placeholder="From"
                    />
                    <input
                      type="date"
                      className="w-1/2 px-3 py-2 border rounded text-xs dark:bg-[#343434] dark:text-white dark:border-[#5C5C5C] placeholder:text-gray-600 [&::-webkit-calendar-picker-indicator]:dark:invert"
                      value={filters.toDate}
                      onChange={(e) =>
                        setFilters({ ...filters, toDate: e.target.value })
                      }
                      placeholder="To"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleResetFilters}
                    className="px-3 py-1 text-[12px] rounded-md border border-[#576CBC] text-[#576CBC] font-medium hover:bg-[#EEF1FF] dark:hover:bg-[#343434]"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleApplyFilters}
                    className="px-3 py-1 text-[12px] rounded-md bg-[#576CBC] text-white font-medium hover:bg-[#455bb1]"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

export default Analytics;
