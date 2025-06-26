"use client";
import React, { useEffect, useState } from "react";
import { Filter, Search, X } from "lucide-react";
import Image from "next/image";

import BaseLayout from "@/components/BaseLayout";
import { FaSort } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";
import TeacherHeader from "../../components/TeacherHeader";
import { MdTune } from "react-icons/md";
import { closeSync } from "fs";

interface Student {
  id: string;
  name: string;
  course: string;
  courseType: string;
  classDateTime: string;
  courseDuration: string;
  joinDate: string;
  level: number;
  status: "Active" | "Inactive";
}

interface Class {
  id: string;
  name: string;
  instructor: string;
  schedule: string;
  students: number;
  type: string;
  status: "Ongoing" | "Completed";
}

interface Earning {
  id: string;
  studentName: string;
  course: string;
  amount: number;
  classDateTime: string;
  courseDuration: number;
  courseType: string;
  date: string;
  status: "Active" | "Pending";
}

type ViewType = "students" | "classes" | "earnings";

function Analytics() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>("students");
  const [filters, setFilters] = useState({
    name: "",
    id: "",
    course: "",
    status: "",
    date: "",
  });
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortKey, setSortKey] = useState<
    keyof Student | keyof Class | keyof Earning
  >("name"); // Default sort key
  const [studentData, setStudentData] = useState<
    { month: string; students: number }[]
  >([]);
  const [classData, setClassData] = useState<
    { month: string; classes: number }[]
  >([]);

  const earningsData = [
    { month: "Jan", earnings: 30000 },
    { month: "Feb", earnings: 35000 },
    { month: "Mar", earnings: 32000 },
    { month: "Apr", earnings: 40000 },
    { month: "May", earnings: 38000 },
    { month: "Jun", earnings: 45741 },
  ];

  const earnings: Earning[] = [
    {
      id: "PAY001",
      studentName: "Samantha William",
      course: "Tajweed",
      amount: 150,
      classDateTime: "June 20 2023",
      courseDuration: 150,
      courseType: "REGULAR ClASS",
      date: "March 15, 2024",
      status: "Active",
    },
    {
      id: "PAY002",
      studentName: "Jordan Nico",
      course: "Arabic",
      amount: 200,
      classDateTime: "June 20 2023",
      courseDuration: 150,
      courseType: "REGULAR ClASS",
      date: "March 14, 2024",
      status: "Active",
    },
    {
      id: "PAY003",
      studentName: "Nadila Adja",
      course: "Quran",
      amount: 175,
     classDateTime: "June 20 2023",
      courseDuration: 150,
       courseType: "REGULAR ClASS",
      date: "March 13, 2024",
      status: "Active",
    },
  ];


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
    course:{
      courseName:string;
    }
    preferedTeacher: string;
    totalHourse: number;
    startDate: string;
    endDate: string;
    startTime: string[];
    endTime: string[];
    scheduleStatus: string;
    sessionClassType: string;
    status: string;
    createdBy: string;
    createdDate: string;
    lastUpdatedDate: string;
    __v: number;
  }

  interface ApiResponse {
    totalCount: number;
    students: Schedule[];
  }
  const [uniqueStudentSchedules, setUniqueStudentSchedules] = useState<
    Schedule[]
  >([]);
  const [TotalStudents, setTotalStudents] = useState<number>();
  const [TotalClasses, setTotalClasses] = useState<number>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherIdToFilter = localStorage.getItem("TeacherPortalId");

        if (!teacherIdToFilter) {
          console.error("No teacher ID found in localStorage.");
          return;
        }
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("TeacherAuthToken")
            : null;

        if (!token) {
          console.error("❌ AdminAuthToken not found");
          return;
        }
        const response = await axios.get<ApiResponse>(
          "https://api.blackstoneinfomaticstech.com/classShedule",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const filteredData = response.data.students.filter(
          (item) => item.teacher.teacherId === teacherIdToFilter
        );

        // Create a Map to store unique students based on studentId
        const studentScheduleMap = new Map<string, Schedule>();
        const uniqueStudents = new Set<string>(); // To count total unique students

        filteredData.forEach((item) => {
          studentScheduleMap.set(item.student.studentId, item);
          uniqueStudents.add(item.student.studentId);
        });

        // Convert Map values (unique Schedule objects) to an array
        const uniqueSchedules = Array.from(studentScheduleMap.values());

        setUniqueStudentSchedules(uniqueSchedules);

        // Group students by month, ensuring uniqueness of students per month
        const monthlyStudentCount: { [key: string]: Set<string> } = {}; // Set to ensure uniqueness
        const monthlyClassCount: { [key: string]: number } = {};

        filteredData.forEach((item) => {
          const month = new Date(item.startDate).toLocaleString("default", {
            month: "short",
          });
          const studentId = item.student.studentId;

          // Count unique students per month
          if (!monthlyStudentCount[month]) {
            monthlyStudentCount[month] = new Set();
          }
          monthlyStudentCount[month].add(studentId);

          // Count classes per month
          if (!monthlyClassCount[month]) {
            monthlyClassCount[month] = 0;
          }
          monthlyClassCount[month] += 1;
        });

        // Convert Set of unique students per month into an array
        const formattedStudentData = Object.keys(monthlyStudentCount).map(
          (month) => ({
            month,
            students: monthlyStudentCount[month].size,
          })
        );

        // Convert class count per month into an array
        const formattedClassData = Object.keys(monthlyClassCount).map(
          (month) => ({
            month,
            classes: monthlyClassCount[month],
          })
        );

        setStudentData(formattedStudentData);
        setClassData(formattedClassData);

        // Calculate Total Students and Total Classes
        const totalStudents = uniqueStudents.size; // Unique student count
        const totalClasses = filteredData.length; // Total number of classes

        setTotalStudents(totalStudents);
        setTotalClasses(totalClasses);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredStudents = uniqueStudentSchedules.filter((schedule) => {
    return (
      schedule.student.studentFirstName
        .toLowerCase()
        .includes(filters.name.toLowerCase()) &&
      schedule.student.studentId.includes(filters.id) &&
      (filters.course === "" || schedule.package) &&
      (filters.status === "" || schedule.status === filters.status)
    );
  });

  const filteredClasses = uniqueStudentSchedules.filter((cls) => {
    return (
      cls.student.studentFirstName
        .toLowerCase()
        .includes(filters.name.toLowerCase()) &&
      cls.student.studentId.includes(filters.id) &&
      (filters.status === "" || cls.status === filters.status)
    );
  });

  const filteredEarnings = earnings.filter((earning) => {
    return (
      earning.studentName.toLowerCase().includes(filters.name.toLowerCase()) &&
      earning.id.includes(filters.id) &&
      (filters.status === "" || earning.status === filters.status)
    );
  });

  // Function to handle sorting
  const handleSort = (key: keyof Student | keyof Class | keyof Earning) => {
    const order = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(order);
    setSortKey(key);
  };

  // Sorting logic for filtered data
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const aValue = a.student[sortKey as keyof Student]?.toString() || "";
    const bValue = b.student[sortKey as keyof Student]?.toString() || "";

    if (sortOrder === "asc") {
      return aValue.localeCompare(bValue);
    }
    return bValue.localeCompare(aValue);
  });

  const sortedClasses = [...filteredClasses].sort((a, b) => {
    const aValue = a[sortKey as keyof Schedule];
    const bValue = b[sortKey as keyof Schedule];

    if (aValue == null || bValue == null) return 0; // Handle null/undefined

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }

    // Handle non-string values (objects, arrays, etc.)
    if (typeof aValue === "object" || typeof bValue === "object") {
      // Convert objects to a meaningful string representation (e.g., JSON.stringify or specific properties)
      return sortOrder === "asc"
        ? JSON.stringify(aValue).localeCompare(JSON.stringify(bValue))
        : JSON.stringify(bValue).localeCompare(JSON.stringify(aValue));
    }

    return sortOrder === "asc"
      ? aValue.toString().localeCompare(bValue.toString())
      : bValue.toString().localeCompare(aValue.toString());
  });

  const sortedEarnings = [...filteredEarnings].sort((a, b) => {
    const aValue = a[sortKey as keyof Earning];
    const bValue = b[sortKey as keyof Earning];

    if (aValue === undefined || bValue === undefined) {
      return 0; // or handle the case as needed
    }

    if (sortOrder === "asc") {
      return aValue.toString().localeCompare(bValue.toString());
    }
    return bValue.toString().localeCompare(aValue.toString());
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
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
                className={`bg-gradient-to-b from-white to-[#F6FAFF] text-left  dark:from-[#343434] dark:to-[#2A2A2A]  ${
                  activeView === "students" ? "border-[1px]" : ""
                } border-[#576CBC] rounded-xl p-4 shadow-lg cursor-pointer hover:shadow-md transition-shadow flex items-center justify-between focus:outline-none`}
              >
                <div className="flex flex-col justify-center">
                  <h3 className="text-sm font-medium text-[#0f172a] mb-4 dark:text-[#fff]">
                    Total Students
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-[28px] font-bold text-[#0f172a] dark:text-[#fff] ">
                      {TotalStudents}
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
                className={`bg-gradient-to-b from-white to-[#F6FAFF] text-left  dark:from-[#343434] dark:to-[#2A2A2A]  ${
                  activeView === "classes" ? "border-[1px]" : ""
                } border-[#576CBC] rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-md transition-shadow flex justify-between items-center focus:outline-none`}
              >
                <div className="flex flex-col justify-center">
                  <h3 className="text-sm font-medium text-[#0f172a] dark:text-[#fff] mb-4">
                    Classes
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-[28px] font-bold text-[#0f172a] dark:text-[#fff]">
                      {TotalClasses}
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
                className={`bg-gradient-to-b from-white to-[#F6FAFF] text-left  dark:from-[#343434] dark:to-[#2A2A2A] ${
                  activeView === "earnings" ? "border-[1px]" : ""
                } border-[#576CBC] rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-md transition-shadow flex justify-between items-center focus:outline-none`}
              >
                <div className="flex flex-col justify-center">
                  <h3 className="text-sm font-medium text-[#0f172a] dark:text-[#fff] mb-4">
                    Earnings
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-[#0f172a] dark:text-[#fff]">
                      $45,000
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
                    {/* Showing {currentItems.length} of {paginatedData.length} */}
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
                      <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Student ID{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Student Name{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Course{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Class Type{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Joined Date{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Level
                      </th>
                      <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white  dark:bg-[#343434] dark:divide-gray-600">
                    {sortedStudents.slice(0, 10).map((schedule) => (
                      <tr
                        key={schedule.student.studentId}
                        className={`text-[12px] h-[50px] ${"bg-[#fff] dark:bg-[#2C2C2C]"}`}
                      >
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {schedule.student.studentId}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <div className="px-3 py-2 text-[#3D8FDE] font-medium text-left">
                            {schedule.student.studentFirstName}{" "}
                          </div>
                        </td>

                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {schedule.course.courseName}
                        </td>
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {schedule.sessionClassType}
                        </td>
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {new Date(schedule.startDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          1
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-1 bg-[#4ade80]/10 text-[#299350] border border-[#299350] rounded-lg text-[11px]">
                            {schedule.status}
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
                      <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Student ID{" "}
                      </th>
                         <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Student Name{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Courses{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Class Type{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Course Duration{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Class Date{" "}
                      </th>
                       <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Time{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Status{" "}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white  dark:bg-[#343434] dark:divide-gray-600">
                    {sortedClasses.slice(0, 10).map((cls) => (
                    <tr
                        key={cls._id}
                        className={`text-[12px] h-[50px] ${"bg-[#fff] dark:bg-[#2C2C2C]"}`}
                      >
                        <td  className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">{cls._id}</td>
                        <td  className="px-3 py-2 text-[#3D8FDE] font-medium text-left">
                          {cls.student.studentFirstName}
                        </td>
                         <td  className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {cls.course.courseName}
                        </td>
                         <td  className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {cls.sessionClassType}
                        </td>
                        <td  className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {cls.totalHourse}
                        </td>
                        <td  className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                            {new Date(cls.startDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </td>
                         <td  className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          10.00
                        </td>
                       <td className="px-4 py-3">
                          <span className="px-2.5 py-1 bg-[#4ade80]/10 text-[#299350] border border-[#299350] rounded-lg text-[11px]">
                            {cls.status}
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
                      <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Student Id{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Student Name{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Course{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Class Type{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Course Duration{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Class Date{" "}
                      </th>
                       <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Time{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Amount{" "}
                      </th>
                      
                      <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Status{" "}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedEarnings.map((earning) => (
                       <tr
                        key={earning.id}
                        className={`text-[12px] h-[50px] ${"bg-[#fff] dark:bg-[#2C2C2C]"}`}
                      >
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {earning.id}
                        </td>
                        <td className="px-3 py-2 text-[#3D8FDE] font-medium text-left">
                          {earning.studentName}
                        </td>
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {earning.course}
                        </td>
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {earning.courseType}
                        </td>
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {earning.courseDuration}
                        </td>
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {earning.classDateTime}
                        </td>
                          <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          10.00
                        </td> 
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          ${earning.amount}
                        </td> 
                         <td className="px-4 py-3">
                          <span className="px-2.5 py-1 bg-[#4ade80]/10 text-[#299350] border border-[#299350] rounded-lg text-[11px]">
                            {earning.status}
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

            {isFilterOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl w-[400px] p-6 relative">
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-semibold mb-4">Filter By</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {(() => {
                          if (activeView === "students") {
                            return "Student Name";
                          } else if (activeView === "classes") {
                            return "Class Name";
                          } else {
                            return "Student Name"; // Default case for other views (like earnings)
                          }
                        })()}
                      </label>
                      <input
                        type="text"
                        value={filters.name}
                        onChange={(e) =>
                          handleFilterChange("name", e.target.value)
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4ade80] focus:border-[#4ade80] sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {(() => {
                          if (activeView === "students") {
                            return "Student ID";
                          } else if (activeView === "classes") {
                            return "Class ID";
                          } else {
                            return "Payment ID"; // Default case for earnings
                          }
                        })()}
                      </label>
                      <input
                        type="text"
                        value={filters.id}
                        onChange={(e) =>
                          handleFilterChange("id", e.target.value)
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4ade80] focus:border-[#4ade80] sm:text-sm"
                      />
                    </div>
                    {activeView === "students" && (
                      <div>
                        <label
                          htmlFor="hvbahi"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Course
                        </label>
                        <select
                          value={filters.course}
                          onChange={(e) =>
                            handleFilterChange("course", e.target.value)
                          }
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4ade80] focus:border-[#4ade80] sm:text-sm"
                        >
                          <option value="">All</option>
                          <option value="Arabic">Arabic</option>
                          <option value="Quran">Quran</option>
                          <option value="Tajweed">Tajweed</option>
                        </select>
                      </div>
                    )}
                    <div>
                      <label
                        htmlFor="hvbahi"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Status
                      </label>
                      <select
                        value={filters.status}
                        onChange={(e) =>
                          handleFilterChange("status", e.target.value)
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4ade80] focus:border-[#4ade80] sm:text-sm"
                      >
                        <option value="">All</option>
                        {(() => {
                          if (activeView === "students") {
                            return (
                              <>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                              </>
                            );
                          } else if (activeView === "classes") {
                            return (
                              <>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Completed">Completed</option>
                              </>
                            );
                          } else {
                            return (
                              <>
                                <option value="Paid">Paid</option>
                                <option value="Pending">Pending</option>
                              </>
                            );
                          }
                        })()}
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      className="px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200"
                      onClick={() => {
                        setFilters({
                          name: "",
                          id: "",
                          course: "",
                          status: "",
                          date: "",
                        });
                        setIsFilterOpen(false);
                      }}
                    >
                      Reset
                    </button>
                    <button
                      className="px-4 py-2 bg-[#4ade80] text-white rounded-md hover:bg-[#3ecf6e]"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

export default Analytics;
