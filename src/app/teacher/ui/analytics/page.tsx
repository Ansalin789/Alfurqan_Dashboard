"use client";
import React, { useEffect, useState } from "react";
import { Filter, Search, X } from "lucide-react";
import Image from "next/image";

import BaseLayout from "@/components/BaseLayout";
import { useRouter } from "next/navigation";
import axios from "axios";
import TeacherHeader from "../../components/TeacherHeader";
import { MdTune } from "react-icons/md";
import { error } from "console";

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
    };
    course: {
      courseName: string;
    };
    studentRate?: string;
    classType?: string;
    classStartDate?: string;
    status?: string;
  };
}

interface AnalyticsData {
  totalStudents: number;
  totalClasses: number;
  totalAmount: number;
  students: {
    studentId: string;
    studentFirstname: string;
    studentLastName: string;
  }[];
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

  //cards

useEffect(() => {
  const fetchAnalytics = async () => {
    const teacherId = localStorage.getItem("TeacherPortalId");
    console.log("Teacher ID:", teacherId); // DEBUG

    if (!teacherId) {
      console.warn("teacherportalId not found in localStorage.");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5001/analyticscardcount?teacherId=${teacherId}`
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
          "http://localhost:5001/classShedule/teacher/list",
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
        setTotalCount(response.data.totalCount); // ✅ store total count
      } catch (error) {
        console.error("Error fetching class schedules:", error);
      }
    };

    fetchSchedulesByTeacher();
  }, []);

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
                      {analytics?.totalStudents}
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
                      {analytics?.totalClasses}
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
                      ${analytics?.totalAmount.toFixed(2)}
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
                    {students.slice(0, 10).map((schedule) => (
                      <tr
                        key={schedule.name}
                        className={`text-[12px] h-[50px] ${"bg-[#fff] dark:bg-[#2C2C2C]"}`}
                      >
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {schedule.studentId}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <div className="px-3 py-2 text-[#3D8FDE] font-medium text-left">
                            {schedule.name}{" "}
                          </div>
                        </td>

                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {schedule.studentDetails.student.learningInterest}
                        </td>
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {schedule.studentDetails.classType}
                        </td>

                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {
                            schedule.studentDetails.classStartDate
                              ? new Date(
                                  schedule.studentDetails.classStartDate
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                })
                              : "" // fallback text when date is undefined
                          }
                        </td>

                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          1
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-1 bg-[#4ade80]/10 text-[#299350] border border-[#299350] rounded-lg text-[11px]">
                            {schedule.studentDetails.status}
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
                      <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0] pl-10">
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
                    {uniqueStudentSchedules.slice(0, 10).map((cls) => (
                      <tr
                        key={cls._id}
                        className={`text-[12px] h-[50px] ${"bg-[#fff] dark:bg-[#2C2C2C]"}`}
                      >
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {cls._id}
                        </td>
                        <td className="px-3 py-2 text-[#3D8FDE] font-medium text-left pl-10">
                          {cls.student.studentFirstName}
                        </td>
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {cls.course.courseName}
                        </td>
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {cls.sessionClassType}
                        </td>
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {cls.totalHourse}
                        </td>
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {new Date(cls.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {cls.startTime}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-[10px] font-semibold px-5 py-1 rounded-lg ${
                              cls.scheduleStatus === "Scheduled"
                                ? "text-[#377E36] bg-[#ECFDF3] dark:bg-[#323E31] dark:text-[#377E36] px-[24px]"
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
                      <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                        Student Id{" "}
                      </th>
                      <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0] pl-4">
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
                    {uniqueStudentSchedules.map((earning) => (
                      <tr
                        key={earning._id}
                        className={`text-[12px] h-[50px] ${"bg-[#fff] dark:bg-[#2C2C2C]"}`}
                      >
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {earning._id}
                        </td>
                        <td className="px-3 py-2 text-[#3D8FDE] font-medium text-left pl-12">
                          {earning.student.studentFirstName}
                        </td>
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {earning.course.courseName}
                        </td>
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {earning.sessionClassType}
                        </td>
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {earning.totalHourse}
                        </td>
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {new Date(earning.startDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {earning.startTime}
                        </td>
                        <td className="px-3 py-2 text-[#17243E] dark:text-[#FDFDFD] text-left">
                          {earning.amount}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-[10px] font-semibold px-5 py-1 rounded-lg ${
                              earning.scheduleStatus === "Scheduled"
                                ? "text-[#377E36] bg-[#ECFDF3] dark:bg-[#323E31] dark:text-[#377E36] px-[23px]"
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
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

export default Analytics;
