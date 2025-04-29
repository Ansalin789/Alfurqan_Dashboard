"use client";

import BaseLayout4 from "@/components/BaseLayout4";
import React, { useEffect, useState } from "react";
import { FaChevronDown, FaFilter } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";

export interface OtherEmployee {
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
  __v: number;
  gender: string;
  country?: string; // optional since some users have country field
}

interface OtherEmployeesResponse {
  users: OtherEmployee[];
  totalCount: number;
}

const Page: React.FC = () => {
  const [employees, setEmployees] = useState<OtherEmployee[]>([]);
  const [selectedRole, setSelectedRole] = useState("Academic Coach");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
  };

  const router = useRouter();

  const [isFilterPopupOpen, setFilterPopupOpen] = useState(false);
  // const [selectedRole, setSelectedRole] = useState<string | null>(null);
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
    const fetchOtherEmployees = async () => {
      try {
        const res = await axios.get<OtherEmployeesResponse>(
          "http://localhost:5001/otheremployees"
        );
        setEmployees(res.data.users);

        console.log(res.data);

        setError(null);
      } catch (error: any) {
        console.error("Error fetching other employees:", error);
        setError("Failed to load employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchOtherEmployees();
  }, []);


  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilterCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const filteredEmployees = employees.filter((emp) => {
      const empDate = new Date(emp.createdDate); // Assuming this field exists

      const fromDateMatch = filterCriteria.fromDate
        ? empDate >= new Date(filterCriteria.fromDate)
        : true;
      const toDateMatch = filterCriteria.toDate
        ? empDate <= new Date(filterCriteria.toDate)
        : true;

      return (
        (filterCriteria.name
          ? emp.userName
              .toLowerCase()
              .includes(filterCriteria.name.toLowerCase())
          : true) &&
        (filterCriteria.designation
          ? emp.role.includes(filterCriteria.designation)
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



  const handleChanges = (
    e: React.ChangeEvent<HTMLSelectElement>,
    emp: string
  ) => {
    const role = e.target.value;
    setSelectedRole(role);

    let path = "";

    switch (role) {
      case "AcademicCoach":
        path = `/admin-main/ui/settings/academic-coach?employeeId=${emp}`;
        break;
      case "Student":
        path = `/admin-main/ui/settings/student?employeeId=${emp}`;
        break;
      case "Teacher":
        path = `/admin-main/ui/settings/teacher?employeeId=${emp}`;
        break;
      case "Supervisor":
        path = `/admin-main/ui/settings/supervisor?employeeId=${emp}`;
        break;
      case "Admin":
        path = `/admin-main/ui/settings/admin?employeeId=${emp}`;
        break;
      default:
        path = "/";
        break;
    }
    console.log(emp);

    router.push(path); // Navigate to correct page
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
                      <td className="py-3 px-4 text-center">{emp.userId}</td>
                      <td className="py-3 px-4 text-center">{emp.userName}</td>
                      <td className="py-3 px-4 text-center">{emp.email}</td>
                      <td className="py-3 px-4 text-center">{emp.role}</td>
                      <td className="py-3 px-4 text-center">
                        {new Date(emp.createdDate).toLocaleDateString()}
                      </td>

                      {/* Uncomment below for Role Dropdown */}

                      <td className="py-1 px-1 text-center align-middle relative">
                        <select
                          name=""
                          id=""
                          className="px-2 py-[5px] rounded-lg border-2"
                          value={selectedRole}
                          onChange={handleChange}
                        >
                          <option value="Academic Coach">Academic Coach</option>
                          <option value="Student">Student</option>
                          <option value="Teacher">Teacher</option>
                          <option value="Supervisor">Supervisor</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>

                      <td className="py-1 px-1 text-center align-middle relative">
                        <select
                          name=""
                          id=""
                          className="px-2 py-[5px] rounded-lg border-2"
                          value={selectedRole}
                          onChange={(e) => handleChanges(e, emp._id)} // passing employeeId
                        >
                          <option value="">Select a Role</option>
                          <option value="AcademicCoach">Academic Coach</option>
                          <option value="Student">Student</option>
                          <option value="Teacher">Teacher</option>
                          <option value="Supervisor">Supervisor</option>
                          <option value="Admin">Admin</option>
                        </select>
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
