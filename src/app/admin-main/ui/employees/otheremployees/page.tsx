"use client";

import { useEffect, useState } from "react";
import BaseLayout4 from "@/components/BaseLayout4";

import { MdOutlineCancel } from "react-icons/md";
import { useSearchParams } from "next/navigation";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import axios from "axios";
import { user } from "@nextui-org/react";
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
  const tabs = ["Wages", "Earnings", "Leave Records", "WorkingHours"];
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isFetched, setIsFetched] = useState(false); // Flag to check if data is fetched
  const searchParams = useSearchParams(); // Get the search params from the URL
  const [wage, setWage] = useState<EmployeeWage | null>(null);
  const [leaveData, setLeaveData] = useState<ILeaveRecord[]>([]);
  const [summary, setSummary] = useState<ILeaveSummary>({
    totalApplied: 0,
    totalApproved: 0,
    totalDeclined: 0,
  });
  const [schedule, setSchedule] = useState<ShiftSchedule[]>([]);

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
      const response = await axios.get<EmployeeWage>(
        `http://localhost:5001/empwages/${employeeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWage(response.data); // ✅ store single object
    } catch (error: any) {
      console.error(
        "Error fetching wages:",
        error.response?.data ?? error.message
      );
      setWage(null);
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

  return (
    <BaseLayout4>
      <div className="p-4 min-h-screen w-full">
        <h2 className="font-semibold pb-2">Other Employees</h2>

        <div className="grid grid-cols-5 gap-4">
          {/* Profile Card (60%) with Contact Details */}
          <div className="col-span-3 bg-white p-6 rounded-xl shadow flex flex-col md:flex-row gap-8">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left md:w-1/4 border-r pr-6">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
                <img
                  src="/assets/images/Avatar.png"
                  alt="Avatar"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
              <h2 className="text-sm font-semibold">
                {employee?.firstName} {employee?.lastName}
              </h2>
              <p className="text-xs text-gray-500">{employee?.designation}</p>
            </div>

            {/* Contact & Details */}
            <div className="flex flex-col md:w-1/2 gap-4">
              <h4 className="text-sm font-semibold mb-2">Contact & Details</h4>
              <div className="text-xs space-y-2">
                <div>
                  <span className="text-gray-800">Email:</span>{" "}
                  <span className="text-gray-500">{employee?.email}</span>
                </div>
                <div>
                  <span className="text-gray-800">Phone:</span>{" "}
                  <span className="text-gray-500">{employee?.phoneNumber}</span>
                </div>
                <div>
                  <span className="text-gray-800">Date of Birth:</span>{" "}
                  <span className="text-gray-500">{employee?.dateOfBirth}</span>
                </div>
                <div>
                  <span className="text-gray-800">Country:</span>{" "}
                  <span className="text-gray-500">{employee?.country}</span>
                </div>
                <div>
                  <span className="text-gray-800">Gender:</span>{" "}
                  <span className="text-gray-500">{employee?.gender}</span>
                </div>
              </div>
            </div>

            {/* Other Details */}
            <div className="flex flex-col md:w-1/2 gap-4  mt-11">
              <div className="text-xs space-y-2">
                <div>
                  <span className="text-gray-800">Languages Known:</span>{" "}
                  <span className="text-gray-500">
                    {employee?.languagesKnown}
                  </span>
                </div>
                <div>
                  <span className="text-gray-800">City:</span>{" "}
                  <span className="text-gray-500">{employee?.city}</span>
                </div>
                <div>
                  <span className="text-gray-800">Residential Address:</span>{" "}
                  <span className="text-gray-500">{employee?.address}</span>
                </div>
                <div>
                  <span className="text-gray-800">Nationality:</span>{" "}
                  <span className="text-gray-500">{employee?.nationality}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Educational Details Card (20%) */}
          <div className="col-span-1 bg-white p-6 rounded-lg shadow">
            <div className="mt-2 text-xs w-full">
              <h4 className="text-xs py-4 font-medium -mt-10">
                Educational Information
              </h4>
              <p className="text-[12px] text-gray-800">
                Highest Qualification:{" "}
              </p>{" "}
              <span className="text-[10px] text-gray-400">
                {employee?.higherQualification}
              </span>
              <p className="text-[12px] text-gray-800">University/Institute:</p>{" "}
              <span className="text-[10px] text-gray-400">
                {" "}
                {employee?.universityName}
              </span>
              <p className="text-[12px] text-gray-800">Previous Job Title: </p>{" "}
              <span className="text-[10px] text-gray-400">
                {employee?.previousJob}
              </span>
              <p className="text-[12px] text-gray-800">Experience: </p>
              <span className="text-[10px] text-gray-400">
                {employee?.experience}
              </span>
            </div>
          </div>
          {/* Bank Details Card (20%) */}
          <div className="col-span-1 bg-white p-6 rounded-lg shadow">
            <div className="mt-2 text-xs w-full">
              <h4 className="text-xs py-4 font-medium -mt-10">Bank Details</h4>
              <p className="text-[12px] text-gray-800">Bank Name:</p>
              <span className="text-[10px] text-gray-400">
                {employee?.bankName}
              </span>{" "}
              <br />
              <p className="text-[12px] text-gray-800">Account Number:</p>{" "}
              <span className="text-[10px] text-gray-400">
                {" "}
                {employee?.accountNumber}
              </span>
              <p className="text-[12px] text-gray-800">Bank Code:</p>{" "}
              <span className="text-[10px] text-gray-400">
                {employee?.bankCode}
              </span>
              <p className="text-[12px] text-gray-800">Passport Number:</p>
              <span className="text-[10px] text-gray-400">
                {" "}
                {employee?.passportNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow h-min">
          {/* Tabs */}
          <div className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-3 py-[7px] text-xs font-medium rounded-lg focus:outline-none transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-[#102645] text-white shadow"
                    : "text-black"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === "Wages" && (
              <div className="overflow-x-auto scrollbar-none bg-white rounded-lg border-2 border-[#1C3557] w-full max-w-[1255px] h-[270px] mx-auto">
                <table className="w-full border-gray-200 rounded-md">
                  <thead className="text-black border-b border-[#D5D5D5] sticky top-0 bg-white z-10 text-xs font-medium">
                    <tr className="border-b-[1px] border-[#1C3557] text-[11px] font-semibold text-center">
                      <th className="p-4 text-[12px]">
                        <div className="flex justify-center items-center space-x-2">
                          <span>Class Type</span>
                        </div>
                      </th>
                      <th className="p-4 text-[12px]">
                        <div className="flex justify-center items-center space-x-2">
                          <span>Rate</span>
                        </div>
                      </th>
                      <th className="p-4 text-[12px]">
                        <div className="flex justify-center items-center space-x-2">
                          <span>Currency</span>
                        </div>
                      </th>
                      <th className="p-4 text-[12px]">
                        <div className="flex justify-center items-center space-x-2">
                          <span>Duration</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {wage ? (
                      <tr className="...">
                        <td className="p-4">{wage.classType.className}</td>
                        <td className="p-4">{wage.classType.rate}</td>
                        <td className="p-4">
                          {wage.classType.className === "Fixed Salary" ? (
                            <select className="p-1 focus:outline-none text-[12px] bg-transparent">
                              <option>Dirhams</option>
                              <option>USD</option>
                              <option>INR</option>
                            </select>
                          ) : (
                            wage.classType.currency
                          )}
                        </td>
                        <td className="p-4">
                          {wage.classType.className === "Fixed Salary" ? (
                            <select className="p-1 focus:outline-none bg-transparent">
                              <option>Monthly</option>
                              <option>Weekly</option>
                              <option>Daily</option>
                            </select>
                          ) : (
                            wage.classType.hoursMins
                          )}
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-center">
                          No wage record found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Earnings tab */}

            {activeTab === "Earnings" && (
              <div className="space-y-2">
                {/* Summary Cards */}
                <div className="flex flex-wrap gap-4">
                  <div className="bg-[#11244D] text-white rounded-xl p-4 flex items-center justify-between w-56 shadow-md">
                    <div>
                      <p className="text-xs">Total Earnings</p>
                      <h2 className="text-lg font-bold mt-1">
                        ${wage?.totalearnings ?? 0}
                      </h2>
                    </div>
                  </div>
                  <div className="bg-[#707791] text-white rounded-xl p-4 w-56 shadow-md">
                    <div>
                      <p className="text-xs">Total Deductions</p>
                      <h2 className="text-lg font-bold mt-1">$0</h2>{" "}
                      {/* Replace if available */}
                    </div>
                  </div>
                </div>

                {/* Earnings Table */}
                <div className="rounded-xl border border-[#000] shadow overflow-hidden">
                  <div className="overflow-x-auto max-h-[180px] overflow-y-auto custom-scrollbar scrollbar-none">
                    <table className="w-full min-w-[900px] text-sm text-left">
                      <thead className="text-black border-b border-[#D5D5D5] sticky top-0 bg-white z-10 text-xs font-medium">
                        <tr className="border-b-[1px] border-[#1C3557]">
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
                      <tbody className="text-xs text-[#1D2939]">
                        {Array.from({ length: 12 }).map((_, index) => {
                          const monthNumber = index + 1;
                          const currentYear = new Date().getFullYear();
                          const monthName = new Date(0, index).toLocaleString(
                            "default",
                            {
                              month: "short",
                            }
                          );

                          const monthly = wage?.monthlyData?.find(
                            (item) =>
                              item.month === monthNumber &&
                              item.year === currentYear
                          );

                          const rate = parseFloat(wage?.classType?.rate ?? "0");
                          const totalhours = monthly?.totalhours ?? 0;
                          const earnings = totalhours * rate;

                          return (
                            <tr
                              key={`${monthName}-${currentYear}`}
                              className={`border-t border-gray-100 text-center ${
                                index % 2 === 0
                                  ? "bg-[#faf9f9]"
                                  : "bg-[#ebebeb]"
                              }`}
                            >
                              <td className="p-3">{`${monthName} ${currentYear}`}</td>
                              <td className="p-3">{totalhours}</td>
                              <td className="p-3">${earnings.toFixed(2)}</td>
                              <td className="p-3">$0</td>{" "}
                              {/* Replace with actual deduction if needed */}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Leave Record Tab */}

            {activeTab === "Leave Records" && (
              <div className="space-y-2 ">
                {/* Summary Cards */}
                <div className="flex flex-wrap gap-4">
                  <div className="bg-[#11244D] text-white rounded-xl p-4 flex items-center justify-between w-56 shadow-md">
                    <div>
                      <p className="text-xs">Total Applied Leave(Days)</p>
                      <h2 className="text-lg font-bold mt-1">
                        {summary.totalApplied}
                      </h2>
                    </div>
                  </div>
                  <div className="bg-[#4F4CD1] text-white rounded-xl p-4 w-56 shadow-md">
                    <div>
                      <p className="text-xs">Total Approved</p>
                      <h2 className="text-lg font-bold mt-1">
                        <h2 className="text-lg font-bold mt-1">
                          {summary.totalApproved}
                        </h2>
                      </h2>
                    </div>
                  </div>
                  <div className="bg-[#707791] text-white rounded-xl p-4 w-56 shadow-md">
                    <div>
                      <p className="text-xs">Total Declined</p>
                      <h2 className="text-lg font-bold mt-1">
                        {
                          <h2 className="text-lg font-bold mt-1">
                            {summary.totalDeclined}
                          </h2>
                        }
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Leave Table */}
                <div className="rounded-xl border border-[#000] shadow overflow-hidden">
                  <div className="overflow-x-auto max-h-[180px] overflow-y-auto custom-scrollbar scrollbar-none">
                    <table className="w-full min-w-[600px] text-sm text-left">
                      <thead className="text-black border-b border-[#D5D5D5] sticky top-0 bg-white z-10 text-xs font-medium">
                        <tr className="text-black border-b border-gray-900">
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Employee Name
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Employee ID
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Designation
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Leave Type
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Date Range
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Reason For Leave
                          </th>
                          <th className="p-4 font-semibold text-[12px] text-center">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-800 text-xs">
                        {leaveData.map((item, index) => (
                          <tr
                            key={item._id}
                            className={`border-t border-gray-100 text-center ${
                              index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                            }`}
                          >
                            <td className="p-1 text-center">{item.name}</td>
                            <td className="p-2 text-center">
                              {item.employeeId}
                            </td>
                            <td className="p-2 text-center">{item.role}</td>
                            <td className="p-2 text-center">
                              {item.leaveType}
                            </td>
                            <td className="p-2 text-center">
                              {new Date(item.fromDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}{" "}
                              -{" "}
                              {new Date(item.toDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </td>

                            <td className="p-2 text-center">{item.reason}</td>
                            <td className="p-2 text-center">
                              <div className="flex items-center gap-2 justify-center">
                                {item.leaveStatus}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Working Hours Tab */}
            {activeTab === "WorkingHours" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-[#000] shadow overflow-hidden">
                  <div className="overflow-x-auto max-h-[285px] overflow-y-auto custom-scrollbar scrollbar-none">
                    <table className="w-full min-w-[900px] text-sm text-left">
                      <thead className="text-black border-b border-[#D5D5D5] sticky top-0 bg-white z-10 text-xs font-medium">
                        <tr className="border-b-[1px] border-[#1C3557]">
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
                      <tbody className="text-xs text-[#1D2939]">
                        {schedule.length > 0 ? (
                          schedule.map((item, index) => (
                            <tr
                              key={index}
                              className={`border-t border-gray-100 text-center ${
                                index % 2 === 0
                                  ? "bg-[#faf9f9]"
                                  : "bg-[#ebebeb]"
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
                            <td
                              className="p-4 text-center text-gray-400"
                              colSpan={4}
                            >
                              No working hours schedule available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseLayout4>
  );
};

export default EmployeePage;
