"use client";

import { useEffect, useState } from "react";
import BaseLayout4 from "@/components/BaseLayout4";

import { MdOutlineCancel } from "react-icons/md";
import { useSearchParams } from "next/navigation";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import axios from "axios";
import { user } from "@nextui-org/react";
import AdminHeader from "@/app/admin-main/components/AdminHeader";
import Pagination from "@/components/Pagination";
interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  nationality: string;
  country: string;
  city: string;
  dateOfBirth: string;
  gender: string;
  residentialAddress: string;
  higherQualification: string;
  universityName: string;
  previousJob: string;
  experience: string;
  bankName: string;
  accountNumber: number;
  bankCode: string;
  passportNumber: string;
  languagesKnown: string; // or JSON.parse to array
  emergencyContactNumber: number;
  relationshipWithEmployee: string;
  address: string;
  designation: string;
  department: string;
  preferedWorkingHours: number;
  preferedShiftFrom: string;
  preferedShiftTo: string;
  comments: string;
  profileImage: string;
  applicationDate: string;
  currency: string;
  expectedSalary: number;
  applicationStatus: string;
  preferedWorkingDays: string; // or JSON.parse to array
  status: string;
  __v: number;
}
interface ClassType {
  className: string;
  hoursMins: string;
  rate: string;
  currency: string;
}

interface MonthlyEarnings {
  year: number;
  month: number;
  totalhours: number;
}

interface EmployeeWage {
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
  totalhours?: number;
  totalearnings?: number;
  monthlyData?: MonthlyEarnings[];
}

// interfaces/LeaveRequest.ts

export interface ILeaveRecord {
  _id: string;
  name: string;
  employeeId: string;
  role: string;
  fromDate: string;
  toDate: string;
  leaveStatus: "WAITINGLIST" | "APPROVED" | "DECLINED";
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

export interface ILeaveSummary {
  totalApplied: number;
  totalApproved: number;
  totalDeclined: number;
}

interface ShiftSchedule {
  date: string;
  day: string;
  fromTime: string;
  toTime: string;
}

const EmployeePage = () => {
  const [activeTab, setActiveTab] = useState("Wages");
  const tabs = ["Wages", "Earnings", "Leave Requests", "WorkingHours"];
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isFetched, setIsFetched] = useState(false); // Flag to check if data is fetched
  const searchParams = useSearchParams(); // Get the search params from the URL
  const [wages, setWages] = useState<EmployeeWage[]>([]); // was wage (single), now array
  const [searchWages, setSearchWages] = useState("");
  const [wagesPage, setWagesPage] = useState(1);
  const wagesPerPage = 5;
  const [leaveData, setLeaveData] = useState<ILeaveRecord[]>([]);
  const [summary, setSummary] = useState<ILeaveSummary>({
    totalApplied: 0,
    totalApproved: 0,
    totalDeclined: 0,
  });
  const [schedule, setSchedule] = useState<ShiftSchedule[]>([]);
  const [earningsPage, setEarningsPage] = useState(1);
  const earningsPerPage = 5;
  const [searchEarnings, setSearchEarnings] = useState("");
  // Paginated months for earnings
  const monthsArray = Array.from({ length: 12 }).map((_, index) => {
    const monthNumber = index + 1;
    const currentYear = new Date().getFullYear();
    const monthName = new Date(0, index).toLocaleString("default", {
      month: "short",
    });
    const monthly = wages[0]?.monthlyData?.find(
      (item) => item.month === monthNumber && item.year === currentYear
    );
    const rate = parseFloat(wages[0]?.classType?.rate ?? "0");
    const totalhours = monthly?.totalhours ?? 0;
    const earnings = totalhours * rate;
    return {
      key: `${monthName}-${currentYear}`,
      monthName,
      currentYear,
      totalhours,
      earnings,
    };
  });
  const filteredEarnings = monthsArray.filter(row =>
    row.monthName.toLowerCase().includes(searchEarnings.toLowerCase()) ||
    row.currentYear.toString().includes(searchEarnings)
  );
  const totalEarningsPages = Math.ceil(filteredEarnings.length / earningsPerPage);
  const paginatedEarnings = filteredEarnings.slice(
    (earningsPage - 1) * earningsPerPage,
    earningsPage * earningsPerPage
  );

  const [leavePage, setLeavePage] = useState(1);
  const leavePerPage = 5;
  const [searchLeave, setSearchLeave] = useState("");
  const filteredLeave = leaveData.filter(item =>
    item.name?.toLowerCase().includes(searchLeave.toLowerCase()) ||
    item.employeeId?.toLowerCase().includes(searchLeave.toLowerCase()) ||
    item.role?.toLowerCase().includes(searchLeave.toLowerCase()) ||
    item.leaveType?.toLowerCase().includes(searchLeave.toLowerCase()) ||
    item.leaveStatus?.toLowerCase().includes(searchLeave.toLowerCase())
  );
  const totalLeavePages = Math.ceil(filteredLeave.length / leavePerPage);
  const paginatedLeave = filteredLeave.slice(
    (leavePage - 1) * leavePerPage,
    leavePage * leavePerPage
  );

  const [workingPage, setWorkingPage] = useState(1);
  const workingPerPage = 5;
  const [searchWorking, setSearchWorking] = useState("");
  const filteredWorking = schedule.filter(item =>
    item.day?.toLowerCase().includes(searchWorking.toLowerCase()) ||
    item.date?.toLowerCase().includes(searchWorking.toLowerCase())
  );
  const totalWorkingPages = Math.ceil(filteredWorking.length / workingPerPage);
  const paginatedWorking = filteredWorking.slice(
    (workingPage - 1) * workingPerPage,
    workingPage * workingPerPage
  );

  useEffect(() => {
    // Retrieve employeeId and userId from search params
    const employeeId = searchParams.get("employeeId");
    const userId = searchParams.get("userId");

    if (!employeeId) {
      console.error("No employee ID found in search params");
      return;
    }

    // Fetch employee data if not already fetched
    if (!isFetched && employee === null) {
      fetchEmployee(employeeId);
      fetchWages(employeeId);
      fetchData(employeeId); // Fetch shift schedule data

      if (userId) {
        fetchLeaveData(userId); // ✅ Only call if userId is not null
      } else {
        console.error("No user ID found in search params");
      }
    }
  }, [isFetched, employee, searchParams]);

  const fetchEmployee = async (_id: string) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("AdminAuthToken")
        : null;

    if (!token) {
      console.error("❌ AdminAuthToken not found");
      return;
    }

    try {
      const response = await axios.get<Employee>(
        `https://api.blackstoneinfomaticstech.com/otheremp/${_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEmployee(response.data);
      setIsFetched(true); // Mark the data as fetched
    } catch (error: any) {
      console.error(
        "Error fetching employee:",
        error.response?.data ?? error.message
      );
    }
  };

  const fetchWages = async (employeeId: string) => {
    if (!employeeId) return;
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("AdminAuthToken")
        : null;
    if (!token) return;
    try {
      const response = await axios.get<EmployeeWage[] | EmployeeWage>(
        `http://localhost:5001/empwages/${employeeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Accept both array and single object
      const data = response.data;
      setWages(Array.isArray(data) ? data : [data]);
    } catch (error: any) {
      console.error(
        "Error fetching wages:",
        error.response?.data ?? error.message
      );
      setWages([]);
    }
  };

  const fetchLeaveData = async (userId: string) => {
    try {
      const res = await axios.get(
        `http://localhost:5001/leaverequest?employeeId=${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("AdminAuthToken")}`,
          },
        }
      );
      setLeaveData(res.data.records);
      setSummary({
        totalApplied: res.data.totalApplied,
        totalApproved: res.data.totalApproved,
        totalDeclined: res.data.totalDeclined,
      });
    } catch (error) {
      console.error("Failed to fetch leave data", error);
    }
  };

  const fetchData = async (employeeId: string) => {
    try {
      const res = await axios.get(
        `http://localhost:5001/shiftschedule/${employeeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("AdminAuthToken")}`,
          },
        }
      );

      // 🔧 If the API returns an array directly:
      setSchedule(res.data);

      // ❌ Avoid this unless API returns { records: [...] }
      // setSchedule(res.data.records);
    } catch (error) {
      console.error("Failed to fetch shift schedule", error);
      setSchedule([]); // fallback to empty array to prevent `.map()` errors
    }
  };

  // Filtered and paginated wages
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
  const totalWagesPages = Math.ceil(filteredWages.length / wagesPerPage);
  const paginatedWages = filteredWages.slice(
    (wagesPage - 1) * wagesPerPage,
    wagesPage * wagesPerPage
  );

  return (
    <BaseLayout4>
      <AdminHeader currentSection="Other Employees" />
      <div className="p-2 min-h-screen w-full">
        <div className="col-span-3 bg-[#5E6578] text-white px-4 py-3 rounded-lg shadow-sm flex flex-row">
          <div className="flex flex-col items-center w-[30%] pr-4 py-6 border-r border-[#BCBCBC] gap-y-2">
            <div className="w-[90px] h-[90px] rounded-full overflow-hidden border border-white">
              <img
                src="/assets/images/Avatar.png"
                alt="Avatar"
                className="object-cover w-full h-full"
              />
            </div>
            <h2 className="text-[12px] font-semibold text-center mt-2">
              {employee?.firstName} {employee?.lastName}
            </h2>
            <p className="text-[11px] text-gray-300 text-center">
              {employee?.designation}
            </p>
            <span className="text-gray-300 text-center text-[10px]">
              {employee?.email}
            </span>
          </div>

          <div className="flex flex-col md:w-1/2 gap-4 px-3 border-r border-[#BCBCBC]">
            <h4 className="text-[13px] font-semibold mb-2">
              Contact & Details
            </h4>
            <div className="text-xs">
              <div className="py-2 flex flex-row justify-between">
                <span className="text-gray-200">Phone:</span>{" "}
                <span className="text-gray-200 px-2 text-[10px]">
                  {employee?.phoneNumber}
                </span>
              </div>
              <div className="py-2 flex flex-row justify-between">
                <span className="text-gray-200">Date of Birth:</span>{" "}
                <span className="text-gray-200 px-2 text-[10px]">
                  {employee?.dateOfBirth}
                </span>
              </div>
              <div className="py-2 flex flex-row justify-between">
                <span className="text-gray-200">Country:</span>{" "}
                <span className="text-gray-200 px-2 text-[10px]">
                  {employee?.country}
                </span>
              </div>
              <div className="py-2 flex flex-row justify-between">
                <span className="text-gray-200">City:</span>{" "}
                <span className="text-gray-200 px-2 text-[10px]">
                  {employee?.city}
                </span>
              </div>
              <div className="py-2 flex flex-row justify-between">
                <span className="text-gray-200">Residential Address:</span>{" "}
                <span className="text-gray-200 px-2 text-[10px]">
                  {employee?.address}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:w-1/2 gap-4 px-3 border-r border-[#BCBCBC]">
            <h4 className="text-[13px] font-semibold mb-2">
              Educational Information
            </h4>
            <div className="text-xs">
              <div className="py-2 flex flex-row justify-between">
                <span className="text-gray-200">Highest Qualification:</span>{" "}
                <span className="text-gray-200 px-2 text-[10px]">
                  {employee?.higherQualification}
                </span>
              </div>
              <div className="py-2 flex flex-row justify-between">
                <span className="text-gray-200">University/Institute:</span>{" "}
                <span className="text-gray-200 px-2 text-[10px]">
                  {employee?.universityName}
                </span>
              </div>
              <div className="py-2 flex flex-row justify-between">
                <span className="text-gray-200">Languages Known:</span>{" "}
                <span className="text-gray-200 px-2 text-[10px]">
                  {employee?.languagesKnown}
                </span>
              </div>
              <div className="py-2 flex flex-row justify-between">
                <span className="text-gray-200">Experience:</span>{" "}
                <span className="text-gray-200 px-2 text-[10px]">
                  {employee?.experience}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:w-1/2 gap-4 px-3">
            <h4 className="text-[13px] font-semibold mb-2">Bank Details </h4>
            <div className="text-xs">
              <div className="py-2 flex flex-row justify-between">
                <span className="text-gray-200">Passport Number:</span>{" "}
                <span className="text-gray-200 px-2 text-[10px]">
                  {employee?.passportNumber}
                </span>
              </div>
              <div className="py-2 flex flex-row justify-between">
                <span className="text-gray-200">Bank Name:</span>{" "}
                <span className="text-gray-200 px-2 text-[10px]">
                  {employee?.bankName}
                </span>
              </div>
              <div className="py-2 flex flex-row justify-between">
                <span className="text-gray-200">Account Number:</span>{" "}
                <span className="text-gray-200 px-2 text-[10px]">
                  {employee?.accountNumber}
                </span>
              </div>
              <div className="py-2 flex flex-row justify-between">
                <span className="text-gray-200">Bank Code:</span>{" "}
                <span className="text-gray-200 px-2 text-[10px]">
                  {employee?.bankCode}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-4 h-min">
          {/* Tabs */}
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

          {/* Tab Content */}
          <div className="py-2">
            {activeTab === "Wages" && (
              <div className="space-y-6">
                <div className="rounded-xl overflow-hidden">
                  <div className="flex justify-between items-center px-4 py-0 bg-[#FAFAFB] dark:bg-[#343434]">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent outline-none text-[12px] w-52 py-3"
                        value={searchWages}
                        onChange={(e) => {
                          setSearchWages(e.target.value);
                          setWagesPage(1);
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-gray-400 dark:text-gray-400">
                      <span className="text-left ml-60 ">
                        Showing {filteredWages.length === 0 ? 0 : (wagesPage - 1) * wagesPerPage + 1} to {Math.min(wagesPage * wagesPerPage, filteredWages.length)} of {filteredWages.length}
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

            {/* Earnings tab */}

            {activeTab === "Earnings" && (
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        title: "Total Earnings",
                        count: wages[0]?.totalearnings || 0,
                        color: "gray",
                        iconBg: "bg-gray-100",
                        iconColor: "text-gray-500",
                        chartColor: "#64748b",
                      },
                      {
                        title: "Total Deductions",
                        count: wages[0]?.totalearnings || 0,
                        color: "indigo",
                        iconBg: "bg-indigo-100",
                        iconColor: "text-indigo-500",
                        chartColor: "#6366f1",
                      },
                    ].map((card) => (
                      <div
                        key={card.title}
                        className="bg-[#7689BD] text-white shadow-md rounded-xl flex flex-col  w-full p-3 h-full"
                      >
                        <div className="flex flex-col justify-between gap-y-4">
                          <div>
                            <p className="text-[15px] font-medium dark:text-white text-white">
                              {card.title}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-[24px] font-semibold dark:text-white text-white">
                              ${card.count}
                            </h3>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                {/* Earnings Table */}
                <div className="rounded-xl overflow-hidden">
                  <div className="flex justify-between items-center px-4 py-0 bg-[#FAFAFB] dark:bg-[#343434]">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent outline-none text-[12px] w-52 py-3"
                        value={searchEarnings}
                        onChange={e => {
                          setSearchEarnings(e.target.value);
                          setEarningsPage(1);
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-gray-400 dark:text-gray-400">
                      <span className="text-left ml-60 ">
                        Showing {filteredEarnings.length === 0 ? 0 : (earningsPage - 1) * earningsPerPage + 1} to {Math.min(earningsPage * earningsPerPage, filteredEarnings.length)} of {filteredEarnings.length}
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
                            Total Hours
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Total Earnings
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Total Deductions
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
                              <td className="p-3">{row.totalhours}</td>
                              <td className="p-3">${row.earnings.toFixed(2)}</td>
                              <td className="p-3">$0</td>{" "}
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
                {totalEarningsPages > 1 && (
                  <div className="flex justify-end mt-4">
                    <Pagination
                      currentPage={earningsPage}
                      totalPages={totalEarningsPages}
                      onPageChange={setEarningsPage}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Leave Record Tab */}

            {activeTab === "Leave Requests" && (
              <div className="space-y-2 ">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        title: "Total Applied Leave",
                        count: summary.totalApplied || 0,
                        color: "gray",
                        iconBg: "bg-gray-100",
                        iconColor: "text-gray-500",
                        chartColor: "#64748b",
                      },
                      {
                        title: "Total Approved",
                        count: summary.totalApproved || 0,
                        color: "indigo",
                        iconBg: "bg-indigo-100",
                        iconColor: "text-indigo-500",
                        chartColor: "#6366f1",
                      },
                      {
                        title: "Total Declined",
                        count: summary.totalDeclined || 0,
                        color: "indigo",
                        iconBg: "bg-indigo-100",
                        iconColor: "text-indigo-500",
                        chartColor: "#6366f1",
                      },
                    ].map((card) => (
                      <div
                        key={card.title}
                        className="bg-[#7689BD] text-white shadow-md rounded-xl flex flex-col  w-full p-3 h-full"
                      >
                        <div className="flex flex-col justify-between gap-y-4">
                          <div>
                            <p className="text-[15px] font-medium dark:text-white text-white">
                              {card.title}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-[24px] font-semibold dark:text-white text-white">
                              ${card.count}
                            </h3>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                {/* Leave Table */}
                <div className="rounded-xl overflow-hidden">
                  <div className="flex justify-between items-center px-4 py-0 bg-[#FAFAFB] dark:bg-[#343434]">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent outline-none text-[12px] w-52 py-3"
                        value={searchLeave}
                        onChange={e => {
                          setSearchLeave(e.target.value);
                          setLeavePage(1);
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-gray-400 dark:text-gray-400">
                      <span className="text-left ml-60 ">
                        Showing {filteredLeave.length === 0 ? 0 : (leavePage - 1) * leavePerPage + 1} to {Math.min(leavePage * leavePerPage, filteredLeave.length)} of {filteredLeave.length}
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
                          <th className="p-4 font-semibold text-[12px] text-center">Leave Type</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Date Range</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Reason For Leave</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-[10px] text-[#1D2939]">
                        {paginatedLeave.length > 0 ? (
                          paginatedLeave.map((item, index) => (
                            <tr
                              key={item._id}
                              className={`text-center dark:text-white ${
                                index % 2 === 0
                                  ? "bg-[#fff] dark:bg-[#2C2C2C]"
                                  : "bg-[#F8F8F8] dark:bg-[#303030]"
                              }`}
                            >
                              <td className="p-3 text-center">{item.leaveType}</td>
                              <td className="p-3 text-center">
                                {new Date(item.fromDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })} - {new Date(item.toDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </td>
                              <td className="p-3 text-center">{item.reason}</td>
                              <td className="p-3 text-center">
                                <div className="flex items-center gap-2 justify-center">
                                  {item.leaveStatus}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="p-4 text-center">
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {totalLeavePages > 1 && (
                  <div className="flex justify-end mt-4">
                    <Pagination
                      currentPage={leavePage}
                      totalPages={totalLeavePages}
                      onPageChange={setLeavePage}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Working Hours Tab */}
            {activeTab === "WorkingHours" && (
              <div className="space-y-6">
                <div className="rounded-xl overflow-hidden">
                  <div className="flex justify-between items-center px-4 py-0 bg-[#FAFAFB] dark:bg-[#343434]">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent outline-none text-[12px] w-52 py-3"
                        value={searchWorking}
                        onChange={e => {
                          setSearchWorking(e.target.value);
                          setWorkingPage(1);
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-gray-400 dark:text-gray-400">
                      <span className="text-left ml-60 ">
                        Showing {filteredWorking.length === 0 ? 0 : (workingPage - 1) * workingPerPage + 1} to {Math.min(workingPage * workingPerPage, filteredWorking.length)} of {filteredWorking.length}
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
                          <th className="p-4 font-semibold text-[12px] text-center">Day</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Preferred Working Hours</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Working Hours</th>
                          <th className="p-4 font-semibold text-[12px] text-center">GMT</th>
                        </tr>
                      </thead>
                      <tbody className="text-[10px] text-[#1D2939]">
                        {paginatedWorking.length > 0 ? (
                          paginatedWorking.map((item, index) => (
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
                {totalWorkingPages > 1 && (
                  <div className="flex justify-end mt-4">
                    <Pagination
                      currentPage={workingPage}
                      totalPages={totalWorkingPages}
                      onPageChange={setWorkingPage}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseLayout4>
  );
};

export default EmployeePage;
