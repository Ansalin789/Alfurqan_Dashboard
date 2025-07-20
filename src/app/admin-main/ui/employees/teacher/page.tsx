"use client";

import React, { useEffect, useState } from "react";
import BaseLayout4 from "@/components/BaseLayout4";
import { dateFnsLocalizer, Views } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaUserGraduate } from "react-icons/fa6";
import { FaRegEye, FaCalendarAlt } from "react-icons/fa";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import TeacherHeader from "@/app/teacher/components/TeacherHeader";
import { Search } from "lucide-react";
import { MdTune } from "react-icons/md";
import Pagination from "@/components/Pagination";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
interface StudentData {
  studentId: string;
  name: string;
  studentDetails: StudentDetails;
}

interface StudentDetails {
  student: Student;
  teacher: Teacher;
  subscription: Subscription;
  _id: string;
  academicCoachId: string;
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
  status: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string;
  expectedFinishingDate: number;
  assignedTeacherId: string;
  assignedTeacherEmail: string;
  __v: number;
  teacherStatus: string;
}

interface Student {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  studentGender?: string;
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

interface Teacher {
  teacherName: string;
}

interface Subscription {
  subscriptionName: string;
}

interface User {
  _id: string;
  userName: string;
  email: string;
  password: string;
  role: string[];
  profileImage: string | null;
  status: string;
  createdBy: string;
  lastUpdatedBy: string;
  userId: string;
  lastLoginDate: string;
  createdDate: string;
  lastUpdatedDate: string;
  gender: string;
  position: string;
  contact: string;
  country: string;
  city: string;
}
interface ScheduledClass {
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
  _id: string;
  classDay: string[];
  package: string;
  startDate: string;
  endDate: string;
  startTime: string[];
  endTime: string[];
  scheduleStatus: string;
  classLink: string;
  status: string;
  createdBy: string;
  sessionClassType: string;
  sessionStarttime: string;
  sessionsEndtime: string;
  createdDate: string;
  lastUpdatedDate: string;
  amount: string;
}

interface WageData {
  _id: string;
  employeeId: string;
  employeeName: string;
  classType: {
    className: string;
    hoursMins: string;
    rate: string;
    currency: string;
  };
  status: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string;
}

interface MonthlyData {
  year: number;
  month: number; // 1 to 12
  totalclasses: number;
  totalstudents: number;
  totalhours: number;
  totalearnings: number;
}

interface TeacherCounts {
  totalclasses: number;
  totalstudents: number;
  totalhours: number;
  totalearnings: number;
  monthlyData?: MonthlyData[];
}

interface Student {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
}

interface ShiftSchedule {
  date: string;
  day: string;
  fromTime: string;
  toTime: string;
}

const Teacher = () => {
  const [activeTab, setActiveTab] = useState("Studentslist");
  const [view, setView] = useState<"month" | "week" | "day" | "agenda">(
    "agenda"
  );
  const tabs = [
    "Studentslist",
    "ScheduledClass",
    "Earnings",
    "Payments",
    "Wages",
    "WorkingHours",
  ];
  const searchParams = useSearchParams();
  const employeeId = searchParams.get("teacherId");

  const [users, setUsers] = useState<User>();
  const [scheduledclass, setScheduledClass] = useState<ScheduledClass[]>([]);
  const [wages, setWages] = useState<WageData[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [teacherCounts, setTeacherCounts] = useState<TeacherCounts>({
    totalclasses: 0,
    totalstudents: 0,
    totalhours: 0,
    totalearnings: 0,
  });
  const [schedule, setSchedule] = useState<ShiftSchedule[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchScheduledClass, setSearchScheduledClass] = useState("");
  const [searchPayments, setSearchPayments] = useState("");
  const [searchWages, setSearchWages] = useState("");
  const [searchWorkingHours, setSearchWorkingHours] = useState("");
  const [searchEarnings, setSearchEarnings] = useState("");
  // Filtered Earnings (months)
  const filteredEarningsMonths = Array.from({ length: 12 })
    .map((_, index) => {
      const monthNumber = index + 1;
      const currentYear = new Date().getFullYear();
      const monthName = new Date(0, index).toLocaleString("default", {
        month: "short",
      });
      const monthly = teacherCounts.monthlyData?.find(
        (item) => item.month === monthNumber && item.year === currentYear
      );
      return {
        key: `${monthName}-${currentYear}`,
        monthName,
        currentYear,
        monthly,
      };
    })
    .filter((row) => {
      const searchFields = [row.monthName, row.currentYear];
      return searchFields.some((field) =>
        field
          ? field
              .toString()
              .toLowerCase()
              .includes(searchEarnings.toLowerCase())
          : false
      );
    });

  const [earningsPage, setEarningsPage] = useState(1);
  const earningsPerPage = 5;
  const totalEarningsPages = Math.ceil(
    filteredEarningsMonths.length / earningsPerPage
  );
  const paginatedEarnings = filteredEarningsMonths.slice(
    (earningsPage - 1) * earningsPerPage,
    earningsPage * earningsPerPage
  );

  const events = [
    {
      title: "Evaluation Class (20)",
      start: new Date(2024, 0, 2),
      end: new Date(2024, 0, 2),
    },
    {
      title: "To-Do Task (01)",
      start: new Date(2024, 0, 2),
      end: new Date(2024, 0, 2),
    },
    {
      title: "Meeting (01)",
      start: new Date(2024, 0, 17),
      end: new Date(2024, 0, 17),
    },
  ];

  const statusStyle = {
    Complete: "bg-[#002F56] text-white",
    Pending: "bg-gray-300 text-gray-700",
    Rescheduled: "bg-yellow-300 text-black",
  };

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("AdminAuthToken")
        : null;

    if (!token) {
      console.error("❌ AdminAuthToken not found");
      return;
    }

    if (token && employeeId && employeeId !== "null") {
      fetchUsers(token);
      fetchSchedule(token);
      fetchWages(token);
      fetchClasses(token);
    } else {
      console.log("No auth token or employee ID found.");
    }
  }, [employeeId]); // re-run if employeeId changes

  const fetchUsers = async (token: string) => {
    try {
      const response = await axios.get(
        `https://api.blackstoneinfomaticstech.com/users/${employeeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchSchedule = async (token: string) => {
    try {
      const response = await axios.get(
        `https://api.blackstoneinfomaticstech.com/classShedule/teacher?teacherId=${employeeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setScheduledClass(response.data.classSchedule);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem("AdminAuthToken");
        console.log(
          "Sending request with teacherId:",
          employeeId,
          "Token:",
          token
        );

        const res = await axios.get(
          `https://api.blackstoneinfomaticstech.com/dashboard/teacher/counts`,
          {
            params: { teacherId: employeeId },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", res.data);
        setTeacherCounts(res.data);
      } catch (error: any) {
        console.error("Error fetching teacher counts:", error.message);
        if (error.response) {
          console.error("Server responded with:", error.response.data);
        }
      }
    };

    fetchCounts();
  }, []);

  const fetchWages = async (token: string) => {
    try {
      const response = await axios.get(
        `https://api.blackstoneinfomaticstech.com/empwages/${employeeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      const wagesArray = Array.isArray(data) ? data : [data];
      setWages(wagesArray);
    } catch (error) {
      console.error("Error fetching wages:", error);
    }
  };

  const fetchClasses = async (token: string) => {
    try {
      const res = await axios.get<StudentData[]>(
        `https://api.blackstoneinfomaticstech.com/classShedule/teacher/list?teacherId=${employeeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents(res.data);
    } catch (error) {
      console.error("Failed to fetch classes", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("AdminAuthToken")
          : null;

      if (!token) {
        console.error("❌ AdminAuthToken not found");
        return;
      }
      try {
        const res = await axios.get(
          `https://api.blackstoneinfomaticstech.com/shiftschedule/${employeeId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSchedule(res.data);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };

    fetchData();
  }, []);

  const CustomToolbar = (toolbar: any) => (
    <div className="flex justify-center items-center py-2 px-4">
      <h2 className="text-xl font-semibold text-center">{toolbar.label}</h2>
    </div>
  );

  const router = useRouter();

  const handleclickcalender = () => {
    router.push(
      `/admin-main/ui/employees/teacher/calendar?teacherId=${employeeId}`
    );
  };

  const formatTime = (timeStr: string): string => {
    const [hour, minute] = timeStr.split(":");
    const date = new Date();
    date.setHours(Number(hour), Number(minute));
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // disables AM/PM
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchTerm(query);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredStudents = students.filter((item) => {
    const student = item.studentDetails?.student;
    const searchFields = [
      item.studentId,
      student?.studentFirstName,
      student?.studentLastName,
      student?.studentCountry,
      student?.learningInterest,
      student?.preferredTeacher,
      student?.status,
    ];
    return searchFields.some((field) =>
      field
        ? field.toString().toLowerCase().includes(searchTerm.toLowerCase())
        : false
    );
  });
  const currentItems = filteredStudents.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Filtered scheduled classes for search
  const filteredScheduledClass = scheduledclass.filter((event) => {
    const searchFields = [
      event.student.studentFirstName,
      event.student.studentId,
      event.sessionClassType,
      event.startDate,
    ];
    return searchFields.some((field) =>
      field
        ? field
            .toString()
            .toLowerCase()
            .includes(searchScheduledClass.toLowerCase())
        : false
    );
  });

  // Filtered Payments
  const filteredPayments = scheduledclass.filter((item) => {
    const searchFields = [
      new Date(item.startDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      item.amount,
      item.amount === "0" ? "Pending" : "Paid",
    ];
    return searchFields.some((field) =>
      field
        ? field.toString().toLowerCase().includes(searchPayments.toLowerCase())
        : false
    );
  });

  // Filtered Wages
  const filteredWages = Array.isArray(wages)
    ? wages.filter((item) => {
        const searchFields = [
          item.classType?.className || "",
          item.classType?.rate || "",
          item.classType?.currency || "",
        ];
        return searchFields.some((field) =>
          field.toString().toLowerCase().includes(searchWages.toLowerCase())
        );
      })
    : [];

  // Filtered Working Hours
  const filteredWorkingHours = schedule.filter((item) => {
    const searchFields = [item.day, item.date];
    return searchFields.some((field) =>
      field
        ? field
            .toString()
            .toLowerCase()
            .includes(searchWorkingHours.toLowerCase())
        : false
    );
  });

  const [wagesPage, setWagesPage] = useState(1);
  const wagesPerPage = 5;
  const totalWagesPages = Math.ceil(filteredWages.length / wagesPerPage);
  const paginatedWages = filteredWages.slice(
    (wagesPage - 1) * wagesPerPage,
    wagesPage * wagesPerPage
  );

  return (
    <BaseLayout4>
      <TeacherHeader currentSection="Employees" />
      <div className="p-4 min-h-screen w-full">
        <div className="grid grid-cols-5 gap-2">
          {/* Left Card */}
          <div className="col-span-3 bg-[#5E6578] text-white px-4 py-3 rounded-lg shadow-sm flex flex-row">
            {/* Profile Section */}
            <div className="flex flex-col items-center w-[30%] pr-4 py-6 border-r border-[#BCBCBC]">
              <div className="w-[90px] h-[90px] rounded-full overflow-hidden border border-white">
                <img
                  src="/assets/images/Avatar.png"
                  alt="Avatar"
                  className="object-cover w-full h-full"
                />
              </div>
              <h2 className="text-sm font-semibold mt-2">{users?.userName}</h2>
              <p className="text-[10px] text-gray-300">{users?.email}</p>
            </div>

            {/* Info Section */}
            <div className="flex-1 px-4">
              <h2 className="text-sm font-semibold mb-3 pt-5">Personal Info</h2>
              <div className="grid grid-cols-2 gap-y-3 text-xs">
                <div className="gap-y-4">
                  <div className="py-2 flex flex-row justify-between">
                    <p className="text-gray-300">Contact</p>
                    <p className="text-gray-300 px-2 text-[10px]">
                      {users?.contact}
                    </p>
                  </div>
                  <div className="py-2 flex flex-row justify-between">
                    <p className="text-gray-300">Country</p>
                    <p className="text-gray-300 px-2 text-[10px]">
                      {users?.country}
                    </p>
                  </div>

                  <div className="py-2 flex flex-row justify-between">
                    <p className="text-gray-300">Gender</p>
                    <p className="text-gray-300 px-2 text-[10px]">
                      {users?.gender || "Male"}
                    </p>
                  </div>
                </div>
                <div className="border-l border-l-white pl-4">
                  <div className="py-2 flex flex-row justify-between">
                    <p className="text-gray-300">Nationality</p>
                    <p className="text-gray-300 px-2 text-[10px]">
                      {users?.country}
                    </p>
                  </div>

                  <div className="py-2 flex flex-row justify-between">
                    <p className="text-gray-300">Course</p>
                    <p className="text-gray-300 px-2 text-[10px]">
                      {users?.position}
                    </p>
                  </div>
                  <div className="py-2 flex flex-row justify-between">
                    <p className="text-gray-300">Employment</p>
                    <p className="text-gray-300 px-2 text-[10px]">Full Time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Analytics Panel */}
          <div className="col-span-2 bg-[#7689BD] px-3 py-3 rounded-lg shadow-sm text-white">
            <div className="bg-[#ADB5E0] text-[#0F2C59] text-xs px-3 py-[4px] rounded-md w-[90px] outline-none mb-3">
              <span>Quran</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "30", label: "Students" },
                { value: "3", label: "Absent Days" },
                { value: "20", label: "Total Classes" },
                { value: "5", label: "Days On Leave" },
                { value: "$500", label: "Total Earned" },
                { value: "2", label: "Rescheduled" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="border border-[#9DA4C4] rounded-lg p-2 bg-[#7689BD]"
                >
                  <p className="text-base font-semibold text-white">
                    {item.value}
                  </p>
                  <p className="text-xs text-[#E0E2F1]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/*Table card */}
        <div className="mt-4  h-min">
          <div className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-3 py-[7px] text-xs font-medium focus:outline-none transition-all duration-200 ${
                  activeTab === tab
                    ? "border-b border-b-[#576CBC] text-[#576CBC]"
                    : "text-[#010E30] dark:text-white"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="py-2">
            {activeTab === "Studentslist" && (
              <div className="">
                <div className="rounded-xl overflow-hidden">
                <div className="flex flex-row sm:flex-row justify-between items-stretch px-16 gap-4 py-0 bg-[#FAFAFB] dark:bg-[#343434]">
                <input
                      type="text"
                      placeholder="Search"
                      className="bg-transparent outline-none text-[12px] w-32 py-3"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                    <div className="relative">
                      <button
                      className="flex items-center gap-2 text-[12px] text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 cursor-pointer"
                      onClick={() => setIsFilterModalOpen(true)}
                      >
                        <MdTune className="w-4 h-4" />
                        <span>Filter</span>
                      </button>
                    </div>
                    <span className="text-[12px] text-gray-400 dark:text-gray-400 py-3">
                      Showing {filteredStudents.length === 0 ? 0 : 1} to{" "}
                      {filteredStudents.length} of {filteredStudents.length}
                    </span>
                  </div>
                  <div className="overflow-x-auto max-h-none">
                    <table
                      className="w-full min-w-[900px] text-sm text-left table-auto"
                      style={{ width: "100%", tableLayout: "fixed" }}
                    >
                      <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                        <tr className="font-medium">
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Student ID
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Student's name
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Country
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Subject
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Duration
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-[10px] text-[#1D2939]">
                        {filteredStudents.slice(-5).reverse().length > 0 ? (
                          filteredStudents
                            .slice(-5)
                            .reverse()
                            .map((item, index) => {
                              const student = item.studentDetails?.student;
                              return (
                                <tr
                                  key={item.studentId || index}
                                  className={`text-center dark:text-white ${
                                    index % 2 === 0
                                      ? "bg-[#fff] dark:bg-[#2C2C2C]"
                                      : "bg-[#F8F8F8] dark:bg-[#303030]"
                                  }`}
                                >
                                  <td className="p-3">{item.studentId}</td>
                                  <td className="p-3">
                                    {student?.studentFirstName}
                                  </td>
                                  <td className="p-3">
                                    {student?.studentCountry}
                                  </td>
                                  <td className="p-3">
                                    {student?.learningInterest}
                                  </td>
                                  <td className="p-3">30 min</td>
                                </tr>
                              );
                            })
                        ) : (
                          <tr>
                            <td colSpan={6} className="p-4 text-center">
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-transparent border border-[#576CBC] text-[#576CBC] dark:bg-[#2e3343] text-[11px] px-3 py-1 rounded-md shadow transition"
                    onClick={() => {
                      router.push(
                        `/admin-main/ui/employees/teacher/studentlist?teacherId=${employeeId}`
                      );
                    }}
                  >
                    View All
                  </button>
                </div>
              </div>
            )}

            {activeTab === "ScheduledClass" && (
              <div className="space-y-2 -mt-8">
                <div className="justify-end text-end">
                  <button
                    className={`font-medium text-[14px] ${
                      view === "month"
                        ? "text-black"
                        : "text-white bg-[#576CBC] py-[4px] px-2 rounded"
                    }`}
                    onClick={handleclickcalender}
                  >
                    <FaCalendarAlt />
                  </button>
                </div>
                <div className="rounded-xl overflow-hidden">
                  <div className="flex justify-between items-center px-4 py-0 bg-[#FAFAFB] dark:bg-[#343434]">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Search className="w-3 h-3 text-gray-400 dark:text-gray-400 -mt-[1px]" />
                      <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent outline-none text-[12px] w-52 py-3"
                        value={searchScheduledClass}
                        onChange={(e) =>
                          setSearchScheduledClass(e.target.value)
                        }
                      />
                    </div>
                    <div
                      className="flex items-center gap-2 text-[12px] text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
                      onClick={() => setIsFilterModalOpen(true)}
                    >
                      <MdTune className="w-4 h-4" />
                      <span>Filter</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-gray-400 dark:text-gray-400">
                      <span className="text-left ml-60 ">
                        Showing {filteredScheduledClass.length === 0 ? 0 : 1} to{" "}
                        {filteredScheduledClass.length} of{" "}
                        {filteredScheduledClass.length}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-x-auto max-h-none">
                    <table
                      className="w-full min-w-[900px] text-sm text-left table-auto"
                      style={{ width: "100%", tableLayout: "fixed" }}
                    >
                      <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                        <tr className="font-medium">
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Student name
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Student ID
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Courses
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Class Type
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Course Duration
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Date
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Time
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-[10px] text-[#1D2939]">
                        {filteredScheduledClass.length > 0 ? (
                          filteredScheduledClass
                            .slice(-5)
                            .reverse()
                            .map((event, index) => (
                              <tr
                                key={event._id}
                                className={`text-center dark:text-white ${
                                  index % 2 === 0
                                    ? "bg-[#fff] dark:bg-[#2C2C2C]"
                                    : "bg-[#F8F8F8] dark:bg-[#303030]"
                                }`}
                              >
                                <td className="p-3">
                                  {event.student.studentFirstName}
                                </td>
                                <td className="p-3 text-blue-600 font-medium">
                                  {event.student.studentId}
                                </td>
                                <td className="p-3">Quran</td>
                                <td className="p-3">
                                  {event.sessionClassType}
                                </td>
                                <td className="p-3">30 Min</td>
                                <td className="p-3">
                                  {new Date(event.startDate).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )}
                                </td>
                                <td className="p-3">
                                  {formatTime(event.startTime[0])} –{" "}
                                  {formatTime(event.endTime[0])}
                                </td>
                                <td className="p-3">
                                  <span
                                    className={`text-[9px] dark:bg-[#2E3C2E] dark:text-[#377E36] font-semibold px-3 py-[2px] rounded-md inline-block ${
                                      statusStyle[
                                        event.scheduleStatus as keyof typeof statusStyle
                                      ]
                                    }`}
                                  >
                                    {event.scheduleStatus}
                                  </span>
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan={8} className="p-4 text-center">
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-transparent border border-[#576CBC] text-[#576CBC] dark:bg-[#2e3343] text-[11px] px-3 py-1 rounded-md shadow transition"
                    onClick={() => {
                      router.push(
                        `/admin-main/ui/employees/teacher/scheduledclass?teacherId=${employeeId}`
                      );
                    }}
                  >
                    View All
                  </button>
                </div>
              </div>
            )}

            {activeTab === "Earnings" && (
              <div className="space-y-2">
                <div className="rounded-xl overflow-hidden">
                  <div className="flex justify-between items-center px-4 py-0 bg-[#FAFAFB] dark:bg-[#343434]">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Search className="w-3 h-3 text-gray-400 dark:text-gray-400 -mt-[1px]" />
                      <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent outline-none text-[12px] w-52 py-3"
                        value={searchEarnings}
                        onChange={(e) => setSearchEarnings(e.target.value)}
                      />
                    </div>
                    <div
                      className="flex items-center gap-2 text-[12px] text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
                      onClick={() => setIsFilterModalOpen(true)}
                    >
                      <MdTune className="w-4 h-4" />
                      <span>Filter</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-gray-400 dark:text-gray-400">
                      <span className="text-left ml-60 ">
                        Showing{" "}
                        {filteredEarningsMonths.length === 0
                          ? 0
                          : (earningsPage - 1) * earningsPerPage + 1}{" "}
                        to{" "}
                        {Math.min(
                          earningsPage * earningsPerPage,
                          filteredEarningsMonths.length
                        )}{" "}
                        of {filteredEarningsMonths.length}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-x-auto max-h-none">
                    <table
                      className="w-full min-w-[900px] text-sm text-left table-auto"
                      style={{ width: "100%", tableLayout: "fixed" }}
                    >
                      <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                        <tr className="font-medium">
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Month
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Total Classes
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Total Hours
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Total Earnings
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-[10px] text-[#1D2939]">
                        {paginatedEarnings.length > 0 ? (
                          paginatedEarnings.map((row, index) => (
                            <tr
                              key={row.key}
                              className={`text-center dark:text-white ${
                                index % 2 === 0
                                  ? "bg-[#fff] dark:bg-[#2C2C2C]"
                                  : "bg-[#F8F8F8] dark:bg-[#303030]"
                              }`}
                            >
                              <td className="p-3">{`${row.monthName} ${row.currentYear}`}</td>
                              <td className="p-3">
                                {row.monthly?.totalclasses ?? 0}
                              </td>
                              <td className="p-3">
                                {row.monthly?.totalhours ?? 0}
                              </td>
                              <td className="p-3">
                                ${row.monthly?.totalearnings ?? 0}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="p-4 text-center">
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {totalEarningsPages > 1 && (
                  <div className="flex justify-end mt-2">
                    <Pagination
                      currentPage={earningsPage}
                      totalPages={totalEarningsPages}
                      onPageChange={setEarningsPage}
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === "Payments" && (
              <div className="space-y-6">
                <div className="rounded-xl overflow-hidden">
                  <div className="flex justify-between items-center px-4 py-0 bg-[#FAFAFB] dark:bg-[#343434]">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Search className="w-3 h-3 text-gray-400 dark:text-gray-400 -mt-[1px]" />
                      <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent outline-none text-[12px] w-52 py-3"
                        value={searchPayments}
                        onChange={(e) => setSearchPayments(e.target.value)}
                      />
                    </div>
                    <div
                      className="flex items-center gap-2 text-[12px] text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
                      onClick={() => setIsFilterModalOpen(true)}
                    >
                      <MdTune className="w-4 h-4" />
                      <span>Filter</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-gray-400 dark:text-gray-400">
                      <span className="text-left ml-60 ">
                        Showing {filteredPayments.length === 0 ? 0 : 1} to{" "}
                        {filteredPayments.length} of {filteredPayments.length}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-x-auto max-h-none">
                    <table
                      className="w-full min-w-[900px] text-sm text-left table-auto"
                      style={{ width: "100%", tableLayout: "fixed" }}
                    >
                      <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                        <tr className="font-medium">
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Payment Date
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Amount
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Description
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Payment Method
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Status
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-[10px] text-[#1D2939]">
                        {filteredPayments
                          .slice(-5)
                          .reverse()
                          .map((item, index) => (
                            <tr
                              key={item._id}
                              className={`text-center dark:text-white ${
                                index % 2 === 0
                                  ? "bg-[#fff] dark:bg-[#2C2C2C]"
                                  : "bg-[#F8F8F8] dark:bg-[#303030]"
                              }`}
                            >
                              <td className="p-3">
                                {new Date(item.startDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </td>
                              <td className="p-3">
                                {item.amount === "0" ? "-" : item.amount}
                              </td>
                              <td className="p-3">Monthly Salary</td>
                              <td className="p-3">Bank Transfer</td>
                              <td className="p-3">
                                <span
                                  className={`inline-flex items-center justify-center gap-1 px-3 py-[1px] rounded-md text-[10px] font-semibold
                                  ${
                                    item.amount === "0"
                                      ? "bg-red-100 text-[#D34645] dark:bg-[#D3464533] dark:bg-opacity-20 dark:text-[#D34645]"
                                      : "bg-green-100 text-green-700 dark:bg-[#2E3C2E] dark:text-[#377E36] px-6"
                                  }
                                `}
                                >
                                  {item.amount === "0" ? "Pending" : "Paid"}
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <button className="text-blue-500 text-[11px]">
                                  Download
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-transparent border border-[#576CBC] text-[#576CBC] dark:bg-[#2e3343] text-[11px] px-3 py-1 rounded-md shadow transition"
                    onClick={() => {
                      router.push(
                        `/admin-main/ui/employees/teacher/payments?teacherId=${employeeId}`
                      );
                    }}
                  >
                    View All
                  </button>
                </div>
              </div>
            )}

            {activeTab === "Wages" && (
              <div className="space-y-6">
                <div className="rounded-xl overflow-hidden">
                  <div className="flex justify-between items-center px-4 py-0 bg-[#FAFAFB] dark:bg-[#343434]">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Search className="w-3 h-3 text-gray-400 dark:text-gray-400 -mt-[1px]" />
                      <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent outline-none text-[12px] w-52 py-3"
                        value={searchWages}
                        onChange={(e) => setSearchWages(e.target.value)}
                      />
                    </div>
                    <div
                      className="flex items-center gap-2 text-[12px] text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
                      onClick={() => setIsFilterModalOpen(true)}
                    >
                      <MdTune className="w-4 h-4" />
                      <span>Filter</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-gray-400 dark:text-gray-400">
                      <span className="text-left ml-60 ">
                        Showing{" "}
                        {filteredWages.length === 0
                          ? 0
                          : (wagesPage - 1) * wagesPerPage + 1}{" "}
                        to{" "}
                        {Math.min(
                          wagesPage * wagesPerPage,
                          filteredWages.length
                        )}{" "}
                        of {filteredWages.length}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-x-auto max-h-none">
                    <table
                      className="w-full min-w-[900px] text-sm text-left table-auto"
                      style={{ width: "100%", tableLayout: "fixed" }}
                    >
                      <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                        <tr className="font-medium">
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Class Name
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Rate
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Currency
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Duration
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-[10px] text-[#1D2939]">
                        {paginatedWages.length > 0 ? (
                          paginatedWages.map((item, index) => (
                            <tr
                              key={item._id}
                              className={`text-center dark:text-white ${
                                index % 2 === 0
                                  ? "bg-[#fff] dark:bg-[#2C2C2C]"
                                  : "bg-[#F8F8F8] dark:bg-[#303030]"
                              }`}
                            >
                              <td className="p-3">
                                {item.classType?.className || "-"}
                              </td>
                              <td className="p-3">
                                {item.classType?.rate || "-"}
                              </td>
                              <td className="p-3">
                                {item.classType?.currency || "-"}
                              </td>
                              <td className="p-3">
                                {item.classType?.hoursMins
                                  ? `${item.classType.hoursMins} mins`
                                  : "-"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="p-4 text-center">
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {totalWagesPages > 1 && (
                  <div className="flex justify-end mt-4">
                    <Pagination
                      currentPage={wagesPage}
                      totalPages={totalWagesPages}
                      onPageChange={setWagesPage}
                    />
                  </div>
                )}
              </div>
            )}

            {activeTab === "WorkingHours" && (
              <div className="space-y-6">
                <div className="rounded-xl overflow-hidden">
                  <div className="flex justify-between items-center px-4 py-0 bg-[#FAFAFB] dark:bg-[#343434]">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Search className="w-3 h-3 text-gray-400 dark:text-gray-400 -mt-[1px]" />
                      <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent outline-none text-[12px] w-52 py-3"
                        value={searchWorkingHours}
                        onChange={(e) => setSearchWorkingHours(e.target.value)}
                      />
                    </div>
                    <div
                      className="flex items-center gap-2 text-[12px] text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
                      onClick={() => setIsFilterModalOpen(true)}
                    >
                      <MdTune className="w-4 h-4" />
                      <span>Filter</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-gray-400 dark:text-gray-400">
                      <span className="text-left ml-60 ">
                        Showing {filteredWorkingHours.length === 0 ? 0 : 1} to{" "}
                        {filteredWorkingHours.length} of{" "}
                        {filteredWorkingHours.length}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-x-auto max-h-none">
                    <table
                      className="w-full min-w-[900px] text-sm text-left table-auto"
                      style={{ width: "100%", tableLayout: "fixed" }}
                    >
                      <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                        <tr className="font-medium">
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Day
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Date
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Working Hours
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            GMT
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-[10px] text-[#1D2939]">
                        {filteredWorkingHours
                          .slice(-5)
                          .reverse()
                          .map((item, index) => (
                            <tr
                              key={index}
                              className={`text-center dark:text-white ${
                                index % 2 === 0
                                  ? "bg-[#fff] dark:bg-[#2C2C2C]"
                                  : "bg-[#F8F8F8] dark:bg-[#303030]"
                              }`}
                            >
                              <td className="p-3">{item.day}</td>
                              <td className="p-3">{item.date}</td>
                              <td className="p-3">{`${item.fromTime} - ${item.toTime}`}</td>
                              <td className="p-3">GMT</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-transparent border border-[#576CBC] text-[#576CBC] dark:bg-[#2e3343] text-[11px] px-3 py-1 rounded-md shadow transition"
                    onClick={() => {
                      router.push(
                        `/admin-main/ui/employees/teacher/workinghours?teacherId=${employeeId}`
                      );
                    }}
                  >
                    View All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseLayout4>
  );
};

export default Teacher;
