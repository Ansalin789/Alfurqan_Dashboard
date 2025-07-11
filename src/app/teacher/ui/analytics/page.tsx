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
  studentDetails: {
    student: {
      learningInterest?: string;
      languageLevel?: string;
      createdDate?: string;
      status?: string;
      level?:string;
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
          students
            .map((item) => item.studentDetails.classType)
            .filter(Boolean)
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
        const course = item.studentDetails?.course?.courseName?.toLowerCase() || "";
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
          const status = item.studentDetails?.student.status?.toLowerCase() || "";
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
                className={`bg-gradient-to-b from-white to-[#F6FAFF] text-left dark:from-[#343434] dark:to-[#2A2A2A] ${
                  activeView === "students" ? "border-[1px]" : ""
                } border-[#576CBC] rounded-xl p-4 shadow-lg cursor-pointer hover:shadow-md transition-shadow flex items-center justify-between focus:outline-none`}
              >
                <div className="flex flex-col justify-center">
                  <h3 className="text-sm font-medium text-[#0f172a] mb-4 dark:text-[#fff]">
                    Total Students
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
                className={`bg-gradient-to-b from-white to-[#F6FAFF] text-left dark:from-[#343434] dark:to-[#2A2A2A] ${
                  activeView === "classes" ? "border-[1px]" : ""
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
                    src="/assets/images/Classes.svg"
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
                className={`bg-gradient-to-b from-white to-[#F6FAFF] text-left dark:from-[#343434] dark:to-[#2A2A2A] ${
                  activeView === "earnings" ? "border-[1px]" : ""
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
                      `Showing ${filteredStudents.slice(0, 10).length} of ${
                        filteredStudents.length
                      }`}
                    {activeView === "classes" &&
                      `Showing ${currentItems.length} of ${filteredClasses.length}`}
                    {activeView === "earnings" &&
                      `Showing ${currentItems.length} of ${filteredClasses.length}`}
                  </span>
                </div>
              </div>

              {activeView === "students" && (
                <table
                  className="table-auto xw-full"
                  style={{ width: "100%", tableLayout: "fixed" }}
                >
                  <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                    <tr className="font-medium">
                      <th className="text-left px-4 py-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        Student ID{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        Student Name{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        Course{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        Class Type{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        Joined Date{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        Level
                      </th>
                      <th className="text-left px-4 py-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white  dark:bg-[#343434] dark:divide-gray-600">
                    {filteredStudents.slice(0, 10).map((schedule) => (
                      <tr
                        key={schedule.name}
                        className={`text-[12px] h-[50px] ${"bg-[#fff] dark:bg-[#2C2C2C]"}`}
                      >
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left overflow-hidden text-ellipsis whitespace-nowrap">
                          {schedule.studentId}
                        </td>
                        <td className="px-4 py-2 text-center overflow-hidden text-ellipsis whitespace-nowrap">
                          <div className="px-3 py-2 text-[#3D8FDE] font-medium text-left">
                            {schedule.name}{" "}
                          </div>
                        </td>

                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left overflow-hidden text-ellipsis whitespace-nowrap">
                          {schedule.studentDetails.student?.learningInterest || "-"}
                        </td>
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left overflow-hidden text-ellipsis whitespace-nowrap">
                          {schedule.studentDetails.classType}
                        </td>

                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left overflow-hidden text-ellipsis whitespace-nowrap">
                          {
                             schedule.studentDetails.student?.createdDate
                              ? new Date(
                                schedule.studentDetails.student?.createdDate
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                })
                              : "" // fallback text when date is undefined
                          }
                        </td>

                        <td className="px-3 py-2 pl-6 text-[#17243E] dark:text-[#FDFDFD] text-left overflow-hidden text-ellipsis whitespace-nowrap">
                          {schedule.studentDetails.student.level}
                        </td>
                        <td className="px-4 py-3 overflow-hidden text-ellipsis whitespace-nowrap ">
                          <span className="px-2.5 py-1 bg-[#4ade80]/10 text-[#299350] rounded-lg text-[11px] ">
                            {schedule.studentDetails.student.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeView === "classes" && (
                <table
                  className="table-auto xw-full"
                  style={{ width: "100%", tableLayout: "fixed" }}
                >
                  <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                    <tr className="font-medium">
                      <th className="text-left px-4 py-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        Student ID{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap pl-10">
                        Student Name{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        Courses{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        Class Type{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        Course Duration{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        Class Date{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        Time{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        Status{" "}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white  dark:bg-[#343434] dark:divide-gray-600">
                    {filteredClasses
                      .slice(indexOfFirstItem, indexOfLastItem)
                      .map((cls) => (
                        <tr
                          key={cls._id}
                          className={`text-[12px] h-[50px] ${"bg-[#fff] dark:bg-[#2C2C2C]"}`}
                        >
                          <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left overflow-hidden text-ellipsis whitespace-nowrap">
                            {cls._id}
                          </td>
                          <td className="px-3 py-2 text-[#3D8FDE] font-medium text-left pl-10 overflow-hidden text-ellipsis whitespace-nowrap">
                            {cls.student.studentFirstName}
                          </td>
                          <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left overflow-hidden text-ellipsis whitespace-nowrap">
                            {cls.course.courseName}
                          </td>
                          <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left overflow-hidden text-ellipsis whitespace-nowrap">
                            {cls.sessionClassType}
                          </td>
                          <td className="px-3 py-2 pl-4 text-[#17243E] dark:text-[#FDFDFD] text-left overflow-hidden text-ellipsis whitespace-nowrap">
                            30 min
                          </td>
                          <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left overflow-hidden text-ellipsis whitespace-nowrap">
                            {new Date(cls.startDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left overflow-hidden text-ellipsis whitespace-nowrap">
                            {cls.startTime}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap align-middle">
  <span
    className={`text-[10px] font-semibold py-1 px-2 rounded-lg inline-block w-[120px] text-center leading-tight break-words ${
      cls.scheduleStatus === "Scheduled"
        ? "text-[#377E36] bg-[#ECFDF3] dark:bg-[#323E31] dark:text-[#377E36]"
        : cls.scheduleStatus === "Request Reschedule"
        ? "text-[#6B4F00] bg-[#FDF6EC] dark:bg-[#4F4300] dark:text-[#FFC107]"
        : "text-[#343E59] bg-[#E4E4E4] dark:bg-[#4F4F4F] dark:text-white"
    }`}
  >
    {cls.scheduleStatus}
  </span>
</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}

              {activeView === "earnings" && (
                <table
                  className="table-auto xw-full"
                  style={{ width: "100%", tableLayout: "fixed" }}
                >
                  <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                    <tr className="font-medium">
                      <th className="text-left px-4 py-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        Student Id{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap pl-4">
                        Student Name{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        Course{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        Class Type{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        Course Duration{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        Class Date{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        Time{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        Amount{" "}
                      </th>

                      <th className="text-left px-4 py-3 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                        Status{" "}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(filteredClasses.length > 0
                      ? filteredClasses
                      : uniqueStudentSchedules
                    )
                      .slice(indexOfFirstItem, indexOfLastItem)
                      .map((earning) => (
                        <tr
                          key={earning._id}
                          className={`text-[12px] h-[50px] ${"bg-[#fff] dark:bg-[#2C2C2C]"}`}
                        >
                          <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left overflow-hidden text-ellipsis whitespace-nowrap">
                            {earning._id}
                          </td>
                          <td className="px-3 py-2 text-[#3D8FDE] font-medium text-left pl-12 overflow-hidden text-ellipsis whitespace-nowrap">
                            {earning.student.studentFirstName}
                          </td>
                          <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left overflow-hidden text-ellipsis whitespace-nowrap">
                            {earning.course.courseName}
                          </td>
                          <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left overflow-hidden text-ellipsis whitespace-nowrap">
                            {earning.sessionClassType}
                          </td>
                          <td className="px-3 py-2 pl-4 text-[#17243E] dark:text-[#FDFDFD] text-left overflow-hidden text-ellipsis whitespace-nowrap">
                            30 min
                          </td>
                          <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left overflow-hidden text-ellipsis whitespace-nowrap">
                            {new Date(earning.startDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left overflow-hidden text-ellipsis whitespace-nowrap">
                            {earning.startTime}
                          </td>
                          <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left overflow-hidden text-ellipsis whitespace-nowrap">
                            {earning.amount ? earning.amount : 0}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap pr-10">
  <span
    className={`text-[10px] font-semibold py-1 px-1 rounded-lg inline-block w-[120px] text-center leading-tight break-words ${
      earning.scheduleStatus === "Scheduled"
        ? "text-[#377E36] bg-[#ECFDF3] dark:bg-[#323E31] dark:text-[#377E36]"
        : earning.scheduleStatus === "Request Reschedule"
        ? "text-[#6B4F00] bg-[#FDF6EC] dark:bg-[#4F4300] dark:text-[#FFC107]"
        : "text-[#343E59] bg-[#E4E4E4] dark:bg-[#4F4F4F] dark:text-white"
    }`}
  >
    {earning.scheduleStatus}
  </span>
</td>



                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="flex justify-end">
              <button
                className=" mt-4 text-[#576CBC] border border-[#576CBC] bg-[#fff] rounded-md px-4 py-2 text-sm font-medium hover:bg-[#dbe2f3] transition duration-200 dark:bg-[#2E3343]"
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

                <h2 className="text-lg font-semibold mb-5 dark:text-white">
                  Filter by
                </h2>

                {/* Course Name */}
                <div className="mb-4">
                  <label className="text-sm font-medium mb-1 block dark:text-[#D6D6D6]">
                    Course Name
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded text-sm dark:bg-[#343434] dark:text-white dark:border-[#5C5C5C] text-gray-400"
                    value={filters.courseName}
                    onChange={(e) =>
                      setFilters({ ...filters, courseName: e.target.value })
                    }
                  >
                    <option value="" className="text-gray-400 opacity-60">Select Course</option>
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
                    className="w-full px-3 py-2 border rounded text-sm dark:bg-[#343434] dark:text-white dark:border-[#5C5C5C] text-gray-400"
                    value={filters.studentName}
                    onChange={(e) =>
                      setFilters({ ...filters, studentName: e.target.value })
                    }
                  >
                    <option value="" className="text-gray-400 opacity-60">Select Student</option>
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
                    className="w-full px-3 py-2 border rounded text-sm dark:bg-[#343434] dark:text-white dark:border-[#5C5C5C] text-gray-400"
                    value={filters.classType}
                    onChange={(e) =>
                      setFilters({ ...filters, classType: e.target.value })
                    }
                  >
                    <option value="" className="text-gray-400 opacity-60">Select ClassType</option>
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
                    className="block text-sm text-gray-700 mb-1 dark:text-white"
                  >
                    Timing
                  </label>
                  <input
                    value={filters.time}
                    onChange={(e) =>
                      setFilters({ ...filters, time: e.target.value })
                    }
                    type="time"
                    className="w-full mb-4 border border-gray-300 dark:bg-[#343434] dark:text-white rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400 placeholder:opacity-60"
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
                      className="w-1/2 px-3 py-2 border rounded text-xs dark:bg-[#343434] dark:text-white dark:border-[#5C5C5C] placeholder:text-gray-400 placeholder:opacity-80"
                      value={filters.fromDate}
                      onChange={(e) =>
                        setFilters({ ...filters, fromDate: e.target.value })
                      }
                      placeholder="From"
                    />
                    <input
                      type="date"
                      className="w-1/2 px-3 py-2 border rounded text-xs dark:bg-[#343434] dark:text-white dark:border-[#5C5C5C] placeholder:text-gray-600 "
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
                    className="px-4 py-2 rounded-md border border-[#576CBC] text-[#576CBC] font-medium hover:bg-[#EEF1FF] dark:hover:bg-[#343434]"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleApplyFilters}
                    className="px-4 py-2 rounded-md bg-[#576CBC] text-white font-medium hover:bg-[#455bb1]"
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
