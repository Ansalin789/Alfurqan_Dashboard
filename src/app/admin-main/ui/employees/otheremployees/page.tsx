"use client";

import { useEffect, useState } from "react";
import BaseLayout4 from "@/components/BaseLayout4";

import {
  MdOutlineCancel,
} from "react-icons/md";
import { useSearchParams } from 'next/navigation'; 
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import axios from "axios";
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

interface EmployeeWage {
  _id: string;
  employeeId: string;
  employeeName: string;
  classType: ClassType;
  status: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string;
}

const EmployeePage = () => {
  const [activeTab, setActiveTab] = useState("Wages");
  const tabs = ["Wages", "Leave Records", "Working Hours"];
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isFetched, setIsFetched] = useState(false);  // Flag to check if data is fetched
  const searchParams = useSearchParams();  // Get the search params from the URL
  const [wages, setWages] = useState<EmployeeWage[]>([]);
  const fetchEmployee = async (employeeId: string) => {
    const token = localStorage.getItem("AdminAuthToken");
  
    if (!token) {
      alert("No auth token found.");
      return;
    }
  
    try {
      const response = await axios.get<Employee>(
        `http://localhost:5001/otheremp/${employeeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
  
      setEmployee(response.data);
      setIsFetched(true); // Mark the data as fetched
    } catch (error: any) {
      console.error("Error fetching employee:", error.response?.data ?? error.message);
    }
  };
  
  const fetchWages = async (userId: string) => {
    if (!userId) {
      console.error("No employee ID provided.");
      return;
    }
  
    const token = localStorage.getItem("AdminAuthToken");
  
    if (!token) {
      alert("No auth token found.");
      return;
    }
  
    try {
      const response = await axios.get<EmployeeWage[]>(
        `http://localhost:5001/empwages/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
  
      setWages(response.data);
    } catch (error: any) {
      console.error("Error fetching wages:", error.response?.data ?? error.message);
    }
  };
  
  useEffect(() => {
    // Retrieve employeeId from search params
    const employeeId = searchParams.get('employeeId');
    const userId = searchParams.get('userId');
    if (!employeeId) {
      console.error('No employee ID found in search params');
      return;
    }

    // Fetch employee data if not already fetched
    if (!isFetched && employee === null) {
      fetchEmployee(employeeId); 
      fetchWages(userId ?? ''); // Call the API function with employeeId
    }
  }, [isFetched, employee, searchParams]); 
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
    <h2 className="text-sm font-semibold">{employee?.firstName} {employee?.lastName}</h2>
    <p className="text-xs text-gray-500">{employee?.designation}</p>
  </div>

  {/* Contact & Details */}
  <div className="flex flex-col md:w-1/2 gap-4">
    <h4 className="text-sm font-semibold mb-2">Contact & Details</h4>
    <div className="text-xs space-y-2">
      <div><span className="text-gray-800">Email:</span> <span className="text-gray-500">{employee?.email}</span></div>
      <div><span className="text-gray-800">Phone:</span> <span className="text-gray-500">{employee?.phoneNumber}</span></div>
      <div><span className="text-gray-800">Date of Birth:</span> <span className="text-gray-500">{employee?.dateOfBirth}</span></div>
      <div><span className="text-gray-800">Country:</span> <span className="text-gray-500">{employee?.country}</span></div>
      <div><span className="text-gray-800">Gender:</span> <span className="text-gray-500">{employee?.gender}</span></div>
    </div>
  </div>

  {/* Other Details */}
  <div className="flex flex-col md:w-1/2 gap-4  mt-11">
    <div className="text-xs space-y-2">
      <div><span className="text-gray-800">Languages Known:</span> <span className="text-gray-500">{employee?.languagesKnown}</span></div>
      <div><span className="text-gray-800">City:</span> <span className="text-gray-500">{employee?.city}</span></div>
      <div><span className="text-gray-800">Residential Address:</span> <span className="text-gray-500">{employee?.address}</span></div>
      <div><span className="text-gray-800">Nationality:</span> <span className="text-gray-500">{employee?.nationality}</span></div>
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
              <span className="text-[10px] text-gray-400">{employee?.higherQualification}</span>
              <p className="text-[12px] text-gray-800">
                University/Institute:
              </p>{" "}
              <span className="text-[10px] text-gray-400">
                {" "}
              {employee?.universityName}
              </span>
              <p className="text-[12px] text-gray-800">
                Previous Job Title:{" "}
              </p>{" "}
              <span className="text-[10px] text-gray-400">
                {employee?.previousJob}
              </span>
              <p className="text-[12px] text-gray-800">Experience: </p>
              <span className="text-[10px] text-gray-400">{employee?.experience}</span>
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
              <span className="text-[10px] text-gray-400"> {employee?.accountNumber}</span>
              <p className="text-[12px] text-gray-800">Bank Code:</p>{" "}
              <span className="text-[10px] text-gray-400">{employee?.bankCode}</span>
              <p className="text-[12px] text-gray-800">Passport Number:</p>
              <span className="text-[10px] text-gray-400"> {employee?.passportNumber}</span>
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
      <tbody className="text-[12px] text-gray-900 text-center">
        {wages.length === 0 ? (
          <tr>
            <td colSpan={4} className="p-4">No wage records found.</td>
          </tr>
        ) : (
          wages.map((wage, index) => (
            <tr
              key={wage._id}
              className={`text-[12px] ${
                index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
              }`}
            >
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
          ))
        )}
      </tbody>
    </table>
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
                      <h2 className="text-lg font-bold mt-1">03</h2>
                    </div>
                  </div>
                  <div className="bg-[#4F4CD1] text-white rounded-xl p-4 w-56 shadow-md">
                    <div>
                      <p className="text-xs">Total Approved</p>
                      <h2 className="text-lg font-bold mt-1">02</h2>
                    </div>
                  </div>
                  <div className="bg-[#707791] text-white rounded-xl p-4 w-56 shadow-md">
                    <div>
                      <p className="text-xs">Total Declined</p>
                      <h2 className="text-lg font-bold mt-1">01</h2>
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
                        {[
                          {
                            id: "#0983867",
                            name: "Robert james",
                            designation: "Supervisor",
                            type: "Sick Leave",
                            range: "11/02/2024 - 16/02/2024",
                            reason: "Sickness",
                            status: "Approved",
                          },
                          {
                            id: "#0983867",
                            name: "Stefan Salvatore",
                            designation: "Human Resource",
                            type: "Casual Leave",
                            range: "11/02/2024 - 16/02/2024",
                            reason: "Family Function",
                            status: "Approved",
                          },
                          {
                            id: "#0983867",
                            name: "Prasanna Popz",
                            designation: "Teacher",
                            type: "Privilege Leave",
                            range: "11/02/2024 - 16/02/2024",
                            reason: "Vacation",
                            status: "Declined",
                          },
                          {
                            id: "#0983867",
                            name: "Prasanna Popz",
                            designation: "Teacher",
                            type: "Privilege Leave",
                            range: "11/02/2024 - 16/02/2024",
                            reason: "Vacation",
                            status: "Declined",
                          },
                          {
                            id: "#0983867",
                            name: "Prasanna Popz",
                            designation: "Teacher",
                            type: "Privilege Leave",
                            range: "11/02/2024 - 16/02/2024",
                            reason: "Vacation",
                            status: "Declined",
                          },
                          {
                            id: "#0983867",
                            name: "Prasanna Popz",
                            designation: "Teacher",
                            type: "Privilege Leave",
                            range: "11/02/2024 - 16/02/2024",
                            reason: "Vacation",
                            status: "Declined",
                          },
                        ].map((item, index) => (
                          <tr
                            key={item.id}
                            className={`border-t border-gray-100 text-center ${
                              index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                            }`}
                          >
                            <td className="p-1 text-center">{item.id}</td>
                            <td className="p-2 text-center">{item.name}</td>
                            <td className="p-2 text-center">
                              {item.designation}
                            </td>
                            <td className="p-2 text-center">{item.type}</td>
                            <td className="p-2 text-center">{item.range}</td>
                            <td className="p-2 text-center">{item.reason}</td>
                            <td className="p-2 text-center">
                              <div className="flex items-center gap-2">
                                {item.status === "Approved" ? (
                                  <div>
                                    <span className="inline-flex items-center justify-center  gap-1">
                                      <span className="text-lg">
                                        <IoIosCheckmarkCircleOutline className="text-green-600 text-xs" />
                                      </span>{" "}
                                      Approved
                                    </span>
                                  </div>
                                ) : (
                                  <div>
                                    <span className="inline-flex items-center justify-center  gap-1">
                                      <span className="text-lg">
                                        <MdOutlineCancel className="text-red-600 text-xs" />
                                      </span>{" "}
                                      Declined
                                    </span>
                                  </div>
                                )}
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

            {activeTab === "Working Hours" && employee && (
  <div className="rounded-xl border border-[#000] shadow overflow-hidden">
    <div className="overflow-x-auto max-h-[270px] overflow-y-auto custom-scrollbar scrollbar-none">
      <table className="w-full min-w-[600px] text-sm text-left">
        <thead className="text-black border-b border-[#D5D5D5] sticky top-0 bg-white z-10 text-xs font-medium">
          <tr className="text-black border-b border-gray-900">
            <th className="px-4 py-4 font-semibold text-[12px] text-center w-1/3">
              <div className="flex items-center justify-center gap-2">
                <span>Day</span>
              </div>
            </th>
            <th className="px-4 py-4 font-semibold text-[12px] text-center w-1/3">
              <div className="flex items-center justify-center gap-2">
                <span>Working Hours</span>
              </div>
            </th>
            <th className="px-4 py-4 font-semibold text-[12px] text-center w-1/3">
              <div className="flex items-center justify-center gap-2">
                <span>GMT</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-800">
  {employee.preferedWorkingDays &&
    JSON.parse(
      employee.preferedWorkingDays.replace(/\b([A-Z]+)\b/g, '"$1"')
    ).map((day: string, index: number) => (
      <tr
        key={day}
        className={`border-t border-gray-100 text-center ${
          index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
        }`}
      >
        <td className="px-4 py-2 text-[12px] border-r border-gray-200 w-1/3">
          {day}
        </td>
        <td className="px-4 py-2 text-[12px] border-r border-gray-200 w-1/3">
          {employee.preferedShiftFrom} - {employee.preferedShiftTo}
        </td>
        <td className="px-4 py-2 text-[12px] w-1/3">
          GMT +4
        </td>
      </tr>
    ))}
</tbody>

      </table>
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
