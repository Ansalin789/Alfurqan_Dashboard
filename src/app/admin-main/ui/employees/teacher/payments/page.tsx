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
    "Studentslist",
    "ScheduledClass",
    "Earnings",
    "Payments",
    "Wages",
    "WorkingHours",
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
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

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

  // Extract unique status options from API response
  const statuses = Array.from(new Set(scheduledclass.map(
    item => item.amount === "0" ? "Pending" : "Paid"
  )));

  // Filtered Payments
  const filteredPayments = scheduledclass.filter((item) => {
    const paymentStatus = item.amount === "0" ? "Pending" : "Paid";
    // Search logic
    const searchFields = [
      new Date(item.startDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      item.amount,
      paymentStatus,
    ];
    const matchesSearch = searchFields.some((field) =>
      field
        ? field.toString().toLowerCase().includes(searchPayments.toLowerCase())
        : false
    );
    // Filter logic
    const matchesStatus = filterStatus ? paymentStatus === filterStatus : true;
    const matchesDate =
      (!filterStartDate || new Date(item.startDate) >= new Date(filterStartDate)) &&
      (!filterEndDate || new Date(item.startDate) <= new Date(filterEndDate));
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems: ScheduledClass[] = filteredPayments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <BaseLayout4>
      <AdminHeader currentSection="Payments" />
      <div>
        <div className="rounded-xl overflow-hidden">
        <div className="flex flex-row sm:flex-row justify-between items-stretch px-16 gap-4 py-0 bg-[#FAFAFB] dark:bg-[#343434]">
        <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none text-[12px] w-32 py-3"
                value={searchPayments}
                onChange={(e) => setSearchPayments(e.target.value)}
              />
            <div
                      className="flex items-center gap-2 text-[12px] text-gray-400 dark:border-[#606060] py-3 border-r-2 border-l-2 px-48 cursor-pointer"
                      onClick={() => setIsFilterModalOpen(true)}
            >
              <MdTune className="w-4 h-4" />
              <span>Filter</span>
            </div>
            <span className="text-[12px] text-gray-400 dark:text-gray-400 py-3">
            Showing {filteredPayments.length === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredPayments.length)} of {filteredPayments.length}
              </span>
          </div>
          {/* Filter Modal */}
          {isFilterModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-[#232323] p-6 rounded-lg w-96">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-black dark:text-white">Filter by</h2>
                  <button onClick={() => setIsFilterModalOpen(false)} className="text-gray-500 dark:text-gray-300 text-2xl">&times;</button>
                </div>
                <label className="block mb-2 text-black dark:text-white text-sm">Payment Date</label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="date"
                    className="w-1/2 p-2 rounded bg-gray-100 dark:bg-[#343434] text-black dark:text-white text-xs"
                    value={filterStartDate}
                    onChange={e => setFilterStartDate(e.target.value)}
                  />
                  <input
                    type="date"
                    className="w-1/2 p-2 rounded bg-gray-100 dark:bg-[#343434] text-black dark:text-white text-xs"
                    value={filterEndDate}
                    onChange={e => setFilterEndDate(e.target.value)}
                  />
                </div>
                <label className="block mb-2 text-black dark:text-white text-sm">Status</label>
                <select
                  className="w-full p-2 mb-4 rounded bg-gray-100 dark:bg-[#343434] text-black dark:text-white text-xs"
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  {statuses.map(status => (
                    <option className="text-black dark:text-white text-xs" key={status} value={status}>{status}</option>
                  ))}
                </select>
                <div className="flex justify-between">
                  <button
                    className="px-4 py-2 border rounded text-black dark:text-white text-sm"
                    onClick={() => {
                      setFilterStartDate("");
                      setFilterEndDate("");
                      setFilterStatus("");
                    }}
                  >
                    Reset
                  </button>
                  <button
                    className="px-4 py-2 bg-[#6C74F6] text-white rounded text-sm"
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
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr
                      key={item._id}
                      className={`text-center dark:text-white ${
                        index % 2 === 0
                          ? "bg-[#fff] dark:bg-[#2C2C2C]"
                          : "bg-[#F8F8F8] dark:bg-[#303030]"
                      }`}
                    >
                      <td className="p-3">
                        {new Date(item.startDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-4 text-center">
                      <div className="flex flex-col items-center justify-center py-8">
                        <Image src="/assets/images/quote.jpg" alt="No data" width={120} height={120} />
                        <div className="mt-4 text-gray-400 text-sm">No data available</div>
                      </div>
                    </td>
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
