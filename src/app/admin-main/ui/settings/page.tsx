"use client";

import BaseLayout4 from "@/components/BaseLayout4";
import React, { useEffect, useState } from "react";
import { FaChevronDown, FaFilter } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";

// types/RoleAccess.ts
export interface RoleAccess {
  adminmodules: ModuleAccess;
  academicmodules: ModuleAccess;
  supervisormodules: ModuleAccess;
  teachermodules: ModuleAccess;
  studentmodules: ModuleAccess;
  admin: boolean;
  academicCoach: boolean;
  supervisor: boolean;
  teacher: boolean;
  student: boolean;
}

export interface ModuleAccess {
  [key: string]: boolean;
}

export interface EmployeeAccess {
  _id: string;
  employeeId: string;
  employeeName: string;
  contact: string;
  designation: string[];
  dateOfJoining: string;
  status: string;
  roleAccess: RoleAccess;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string;
  __v: number;
}

interface AccessListResponse {
  data: EmployeeAccess[];
}

const Page: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeAccess[]>([]);

  const router = useRouter();
  const [openRoleDropdownIndex, setOpenRoleDropdownIndex] = useState<
    number | null
  >(null);
  const [openModuleDropdownIndex, setOpenModuleDropdownIndex] = useState<
    number | null
  >(null);
  const [isFilterPopupOpen, setFilterPopupOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null
  );
  const [filterCriteria, setFilterCriteria] = useState({
    name: "",
    designation: "",
    fromDate: "",
    toDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccessList = async () => {
      try {
        const res = await axios.get<AccessListResponse>(
          "http://localhost:5001/update-access/list"
        );
        setEmployees(res.data.data);

        console.log(res.data);

        setError(null);
      } catch (error: any) {
        console.error("Error fetching access list:", error);
        setError("Failed to load employee access data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccessList();
  }, []);

  const toggleRoleDropdown = (index: number) => {
    setOpenRoleDropdownIndex(openRoleDropdownIndex === index ? null : index);
  };

  const toggleModuleDropdown = (index: number) => {
    setOpenModuleDropdownIndex(
      openModuleDropdownIndex === index ? null : index
    );
  };

  const handleModuleClick = (module: string, employeeId: string) => {
    if (module === "Supervisor") {
      router.push(`/admin-main/ui/settings/supervisor?employeeId=${employeeId}`);
    }
    if (module === "Admin") {
      router.push(`/admin-main/ui/settings/admin?employeeId=${employeeId}`);
    }
    if (module === "Teacher") {
      router.push(`/admin-main/ui/settings/teacher?employeeId=${employeeId}`);
    }
    if (module === "Student") {
      router.push(`/admin-main/ui/settings/student?employeeId=${employeeId}`);
    }
    if (module === "AcademicCoach") {
      router.push(`/admin-main/ui/settings/academic-coach?employeeId=${employeeId}`);
    }
  };
  
  

  const handleRoleChange = (index: number, newRole: string) => {
    const updatedEmployees = employees.map((emp, i) =>
      i === index ? { ...emp, role: newRole } : emp
    );
    setEmployees(updatedEmployees);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilterCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const filteredEmployees = employees.filter((emp) => {
      const empDate = new Date(emp.dateOfJoining); // Assuming this field exists

      const fromDateMatch = filterCriteria.fromDate
        ? empDate >= new Date(filterCriteria.fromDate)
        : true;
      const toDateMatch = filterCriteria.toDate
        ? empDate <= new Date(filterCriteria.toDate)
        : true;

      return (
        (filterCriteria.name
          ? emp.employeeName
              .toLowerCase()
              .includes(filterCriteria.name.toLowerCase())
          : true) &&
        (filterCriteria.designation
          ? emp.designation.includes(filterCriteria.designation)
          : true) &&
        fromDateMatch &&
        toDateMatch
      );
    });

    setEmployees(filteredEmployees);
    setFilterPopupOpen(false);
  };

  const resetFilters = () => {
    setFilterCriteria({
      name: "",
      designation: "",
      fromDate: "",
      toDate: "",
    });
  };

  const getPrimaryRole = (roleAccess: RoleAccess): string => {
    if (roleAccess.supervisor) return "Supervisor";
    if (roleAccess.academicCoach) return "Academic Coach";
    if (roleAccess.teacher) return "Teacher";
    if (roleAccess.student) return "Student";
    if (roleAccess.admin) return "Admin";
    return "N/A";
  };

  return (
    <BaseLayout4>
      <div className="p-5 sm:p-6 md:p-8 min-h-screen w-full max-w-8xl mx-auto ">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6">Role Access</h2>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Search here..."
              className="border rounded-lg px-4 py-2 text-xs shadow"
            />
            <button
              className="flex items-center bg-white p-2 rounded-lg shadow text-xs border"
              onClick={() => setFilterPopupOpen(true)}
            >
              <FaFilter className="mr-2" /> Filter
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="w-[170px] h-[35px] border bg-[#fff] border-gray-300 rounded-md text-xs flex items-center justify-between px-2 py-2 shadow mx-auto">
              <select
                className="w-full h-full bg-transparent text-xs text-center focus:outline-none appearance-none"
                defaultValue="Duration: Last month"
              >
                <option>Duration: Last month</option>
                <option>Duration: Last week</option>
                <option>Duration: Last year</option>
              </select>
              <FaChevronDown size={10} className="ml-1 mt-[2px]" />
            </div>
          </div>
        </div>
        <div className="bg-white shadow-md border border-gray-900 rounded-lg overflow-hidden scrollbar-none">
          <div className="overflow-x-auto">
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-none">
              <table className="w-full border-collapse min-w-[800px]">
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr className="text-gray-600 text-xs sm:text-xs border-b border-black">
                    <th className="px-4 py-4 text-center">Employee ID</th>
                    <th className="px-4 py-4 text-center">Employee Name</th>
                    <th className="px-4 py-4 text-center">Contact</th>
                    <th className="px-4 py-4 text-center">Designation</th>
                    <th className="px-4 py-4 text-center">Date of Joining</th>
                    <th className="px-4 py-4 text-center">Role Access</th>
                    <th className="px-4 py-4 text-center">Module Access</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, index) => (
                    <tr
                      key={emp._id}
                      className="border-t border-gray-200 text-gray-700 text-xs sm:text-xs"
                    >
                      <td className="py-3 px-4 text-center">
                        {emp.employeeId}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {emp.employeeName}
                      </td>
                      <td className="py-3 px-4 text-center">{emp.contact}</td>
                      <td className="py-3 px-4 text-center">
                        {emp.designation.join(", ")}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {new Date(emp.dateOfJoining).toLocaleDateString()}
                      </td>

                      {/* Uncomment below for Role Dropdown */}

                      <td className="py-1 px-1 text-center align-middle relative">
                        <button
                          className="w-[140px] h-[30px] border border-gray-300 rounded-md text-xs flex items-center justify-between px-2 mx-auto cursor-pointer"
                          onClick={() => toggleRoleDropdown(index)}
                        >
                          <span className="w-full text-center truncate">
                            {getPrimaryRole(emp.roleAccess)}
                          </span>
                          <FaChevronDown size={10} className="ml-1 mt-[2px]" />
                        </button>
                        {openRoleDropdownIndex === index && (
                          <ul className="absolute z-50 bg-white border border-gray-300 mt-1 w-[140px] left-1/2 transform -translate-x-1/2 rounded shadow-md">
                            {[
                              "Supervisor",
                              "Academic Coach",
                              "Student",
                              "Teacher",
                              "Admin",
                            ].map((role) => (
                              <li key={role}>
                                <button
                                  className="w-full p-1 hover:bg-gray-100 text-xs text-center"
                                  onClick={() => {
                                    handleRoleChange(index, role);
                                    setOpenRoleDropdownIndex(null);
                                  }}
                                >
                                  {role}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>

                      {/* Uncomment below for Module Dropdown */}

                      <td className="py-1 px-1 text-center align-middle relative">
                        <button
                          className="w-[140px] h-[30px] border border-gray-300 rounded-md text-xs flex items-center justify-between px-2 mx-auto cursor-pointer"
                          onClick={() => {
                            toggleModuleDropdown(index);
                            setSelectedEmployeeId(emp.employeeId); // 👈 capture the ID of the selected row
                          }}
                        >
                          <span className="w-full text-center truncate">
                            {getPrimaryRole(emp.roleAccess)}
                          </span>
                          <FaChevronDown size={10} className="ml-1 mt-[2px]" />
                        </button>

                        {openModuleDropdownIndex === index && (
                          <ul className="absolute z-50 bg-white border border-gray-300 mt-1 w-[140px] left-1/2 transform -translate-x-1/2 rounded shadow-md">
                            {[
                              "Supervisor",
                              "AcademicCoach",
                              "Student",
                              "Teacher",
                              "Admin",
                            ].map((mod) => (
                              <li key={mod}>
                                <button
                                  className="w-full p-1 hover:bg-gray-100 text-xs text-center"
                                  onClick={() => {
                                    handleModuleClick(mod, emp.employeeId); // 👈 now passing both arguments
                                    setSelectedRole(mod);
                                    setOpenModuleDropdownIndex(null);
                                  }}
                                  
                                >
                                  {mod}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>



                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isFilterPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-lg relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Filter</h2>
              <button
                onClick={() => setFilterPopupOpen(false)}
                className="text-gray-500 text-xl focus:outline-none"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="employeename" className="text-sm text-gray-700">
                  Employee Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={filterCriteria.name}
                  onChange={handleFilterChange}
                  placeholder="Enter name"
                  className="w-full mt-1 rounded-lg border px-4 py-2 text-sm text-gray-700 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="designation" className="text-sm text-gray-700">
                  Designation
                </label>
                <select
                  name="designation"
                  value={filterCriteria.designation}
                  onChange={handleFilterChange}
                  className="w-full mt-1 rounded-lg border px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none"
                >
                  <option value="">Select designation</option>
                  <option value="ACADEMICCOACH">ACADEMICCOACH</option>
                  <option value="TEACHER">TEACHER</option>
                  <option value="SUPERVISOR">SUPERVISOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div>
                <label htmlFor="fromdate" className="text-sm text-gray-700">
                  From Date
                </label>
                <input
                  type="date"
                  name="fromDate"
                  value={filterCriteria.fromDate}
                  onChange={handleFilterChange}
                  className="w-full mt-1 rounded-lg border px-4 py-2 text-sm text-gray-700 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="todate" className="text-sm text-gray-700">
                  To Date
                </label>
                <input
                  type="date"
                  name="toDate"
                  value={filterCriteria.toDate}
                  onChange={handleFilterChange}
                  className="w-full mt-1 rounded-lg border px-4 py-2 text-sm text-gray-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={applyFilters}
                className="bg-[#012A4A] text-white px-4 py-2 text-sm font-medium rounded-xl"
              >
                Show Results
              </button>
              <button
                onClick={resetFilters}
                className="border border-gray-300 px-4 py-2 text-sm font-medium rounded-xl text-gray-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Your Filter Popup here remains unchanged */}
    </BaseLayout4>
  );
};

export default Page;
