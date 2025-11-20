"use client";

import BaseLayout4 from "@/components/BaseLayout4";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import AdminHeader from "@/app/admin-main/components/AdminHeader";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MoreVertical } from "lucide-react";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip as ChartTooltip,
  Filler,
} from "chart.js";
import axios from "axios";
import { MdTune } from "react-icons/md";
import Pagination from "@/components/Pagination";
import ReactDOM from "react-dom";

// Register chart.js modules
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ChartTooltip,
  Filler
);

countries.registerLocale(enLocale);

interface CountryStat {
  country: string;
  count: number;
  percentage: number;
}
interface OtherEmpCountResponse {
  totalOtherEmpCount: number;
  otherEmpCount: OtherEmpEntry[];
}

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

interface OtherEmpEntry {
  country: string[]; // e.g., ["ADMIN"]
  count: number;
  percentage: number;
}
const formatRole = (role: string) => {
  switch (role) {
    case "ACADEMICCOACH":
      return "Academic Coach";
    case "SUPERVISOR":
      return "Supervisor";
    case "USER":
      return "User";
    case "ADMIN":
      return "Admin";
    default:
      return role;
  }
};
// Replace COLORS object with array for correct indexing
const COLORS = ["#A3D3FF", "#FFD6F7", "#B4C7ED"];
interface GenderCountResponse {
  employeePercentage: number;
  employeeMalePercentage: string;
  employeeFemalePercentage: string;
}
interface DashboardCounts {
  totalApplication: number;
  shortlisted: number;
  rejected: number;
  waiting: number;
}

// Add interface for leave request list API
interface LeaveRequest {
  _id: string;
  name: string;
  employeeId: string;
  role: string;
  fromDate: string;
  toDate: string;
  leaveStatus: string;
  leaveType: string;
  approvedId: string;
  approvedName: string;
  reason: string;
  status: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  __v: number;
}
interface LeaveRequestListResponse {
  totalCount: number;
  leaveRequest: LeaveRequest[];
}

const page = () => {
  const [view, setView] = useState<"month" | "week" | "day" | "agenda">(
    "agenda"
  );
  const tabs = [
    "Students List",
    "Scheduled Class",
    "Earnings",
    "Payments",
    "Wages",
    "Working Hours",
  ];
  const searchParams = useSearchParams();
  const employeeId = searchParams.get("teacherId");

  const [scheduledclass, setScheduledClass] = useState<ScheduledClass[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);

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
  const [filterStudentName, setFilterStudentName] = useState("");
  const [filterClassType, setFilterClassType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");


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

  const router = useRouter();

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

  // Extract unique filter options
  const studentNames = Array.from(new Set(scheduledclass.map(
    s => s.student?.studentFirstName
  ).filter(Boolean)));
  const classTypes = Array.from(new Set(scheduledclass.map(
    s => s.sessionClassType
  ).filter(Boolean)));
  const statuses = Array.from(new Set(scheduledclass.map(
    s => s.scheduleStatus
  ).filter(Boolean)));

  const filteredScheduledClass = scheduledclass.filter((event) => {
    // Search logic
    const searchFields = [
      event.student.studentFirstName,
      event.student.studentId,
      event.sessionClassType,
      event.startDate,
    ];
    const matchesSearch = searchFields.some((field) =>
      field
        ? field.toString().toLowerCase().includes(searchScheduledClass.toLowerCase())
        : false
    );
    // Filter logic
    const matchesName = filterStudentName ? event.student.studentFirstName === filterStudentName : true;
    const matchesClassType = filterClassType ? event.sessionClassType === filterClassType : true;
    const matchesStatus = filterStatus ? event.scheduleStatus === filterStatus : true;
    const matchesDate =
      (!filterStartDate || new Date(event.startDate) >= new Date(filterStartDate)) &&
      (!filterEndDate || new Date(event.startDate) <= new Date(filterEndDate));
    return matchesSearch && matchesName && matchesClassType && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredScheduledClass.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems: ScheduledClass[] = filteredScheduledClass.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <BaseLayout4>
      <AdminHeader currentSection="Scheduled Classes" showBackButton={true} showBackPath={`/admin-main/ui/employees/teacher?teacherId=${employeeId}`} />
      <div>
          <div className="rounded-xl overflow-hidden">
          <div className="flex flex-row sm:flex-row justify-between items-stretch px-16 gap-4 py-0 bg-[#FAFAFB] dark:bg-[#343434]">
          <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent outline-none text-[12px] w-32 py-3"
                  value={searchScheduledClass}
                  onChange={(e) => setSearchScheduledClass(e.target.value)}
                />
              <div
                      className="flex items-center gap-2 text-[12px] text-gray-400 dark:border-[#606060] py-3 border-r-2 border-l-2 px-48 cursor-pointer"
                      onClick={() => setIsFilterModalOpen(true)}
              >
                <MdTune className="w-4 h-4" />
                <span>Filter</span>
              </div>
              <span className="text-[12px] text-gray-400 dark:text-gray-400 py-3">
              Showing {filteredScheduledClass.length === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredScheduledClass.length)} of {filteredScheduledClass.length}
                </span>
            </div>
            {/* Filter Modal */}
            {isFilterModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#232323] p-6 rounded-lg w-96">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Filter by</h2>
                    <button onClick={() => setIsFilterModalOpen(false)} className="text-gray-300 text-2xl">&times;</button>
                  </div>
                  <label className="block mb-2 text-white text-sm">Student Name</label>
                  <select
                    className="w-full p-2 mb-4 rounded bg-[#343434] text-white text-xs"
                    value={filterStudentName}
                    onChange={e => setFilterStudentName(e.target.value)}
                  >
                    <option value="">Select Student Name</option>
                    {studentNames.map(name => (
                      <option className="text-white text-xs" key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  <label className="block mb-2 text-white text-sm">Class Type</label>
                  <select
                    className="w-full p-2 mb-4 rounded bg-[#343434] text-white text-xs"
                    value={filterClassType}
                    onChange={e => setFilterClassType(e.target.value)}
                  >
                    <option value="">Select Class Type</option>
                    {classTypes.map(type => (
                      <option className="text-white text-xs" key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <label className="block mb-2 text-white text-sm">Status</label>
                  <select
                    className="w-full p-2 mb-4 rounded bg-[#343434] text-white text-xs"
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                  >
                    <option value="">Select Status</option>
                    {statuses.map(status => (
                      <option className="text-white text-xs" key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <label className="block mb-2 text-white text-sm">Date</label>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="date"
                      className="w-1/2 p-2 rounded bg-[#343434] text-white text-xs"
                      value={filterStartDate}
                      onChange={e => setFilterStartDate(e.target.value)}
                    />
                    <input
                      type="date"
                      className="w-1/2 p-2 rounded bg-[#343434] text-white text-xs"
                      value={filterEndDate}
                      onChange={e => setFilterEndDate(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between">
                    <button
                      className="px-2 py-1 border rounded text-white text-sm"
                      onClick={() => {
                        setFilterStudentName("");
                        setFilterClassType("");
                        setFilterStatus("");
                        setFilterStartDate("");
                        setFilterEndDate("");
                      }}
                    >
                      Reset
                    </button>
                    <button
                      className="px-2 py-1 bg-[#576CBC] text-white rounded text-sm"
                      onClick={() => setIsFilterModalOpen(false)}
                    >
                      Show results
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="overflow-x-auto max-h-none">
              <table
                className="w-full min-w-[900px] text-sm text-left table-auto"
                style={{ width: "100%", tableLayout: "fixed" }}
              >
                <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
                  <tr className="font-medium">
                    <th className="p-4 font-semibold text-[12px] text-left">
                      Student name
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-left">
                      Student ID
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-left">
                      Courses
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-left">
                      Class Type
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-left">
                      Course Duration
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-left">
                      Date
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-left">
                      Time
                    </th>
                    <th className="p-4 font-semibold text-[12px] text-left">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[10px] text-[#1D2939]">
                  {currentItems.length > 0 ? (
                    currentItems.map((event: ScheduledClass, index: number) => (
                      <tr
                        key={event._id}
                        className={`text-left dark:text-white ${
                          index % 2 === 0
                            ? "bg-[#fff] dark:bg-[#2C2C2C]"
                            : "bg-[#F8F8F8] dark:bg-[#303030]"
                        }`}
                      >
                        <td className="p-3">{event.student.studentFirstName}</td>
                        <td className="p-3 text-blue-600 font-medium">{event.student.studentId}</td>
                        <td className="p-3">Quran</td>
                        <td className="p-3">{event.sessionClassType}</td>
                        <td className="p-3">30 Min</td>
                        <td className="p-3">{new Date(event.startDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td>
                        <td className="p-3">{formatTime(event.startTime[0])} – {formatTime(event.endTime[0])}</td>
                        <td className="p-3">
                          <span className={`text-[9px] dark:bg-[#2E3C2E] dark:text-[#377E36] font-semibold px-3 py-[2px] rounded-md inline-block ${statusStyle[event.scheduleStatus as keyof typeof statusStyle]}`}>{event.scheduleStatus}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-4 text-center">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        {totalPages > 1 && (
          <div className="flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </BaseLayout4>
  );
};

export default page;
