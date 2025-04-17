'use client';

import BaseLayout4 from '@/components/BaseLayout4';
import React, { useState } from 'react';
import { FaChevronDown, FaFilter, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { PiDotsThreeCircle } from "react-icons/pi";

const Page: React.FC = () => {
  const [employees, setEmployees] = useState([
    { id: '#0983867', name: 'Robert James', contact: '9876545234', designation: 'Supervisor', date: '11/02/2024', role: 'Supervisor', module: 'Supervisor' },
    { id: '#0983867', name: 'Stefan Salvatore', contact: '9876545234', designation: 'Human Resource', date: '11/02/2024', role: 'Human Resource', module: 'Human Resource' },
    { id: '#0983867', name: 'Gio Rose', contact: '9876545234', designation: 'Admin', date: '11/02/2024', role: 'Admin', module: 'Admin' },
    { id: '#0983867', name: 'Prasanna Popz', contact: '9876545234', designation: 'Teacher', date: '11/02/2024', role: 'Teacher', module: 'Teacher' },
    { id: '#0983867', name: 'Stefan Salvatore', contact: '9876545234', designation: 'Admin', date: '11/02/2024', role: 'Admin', module: 'Admin' },
    { id: '#0983867', name: 'Stefan Salvatore', contact: '9876545234', designation: 'Admin', date: '11/02/2024', role: 'Admin', module: 'Admin' },
    { id: '#0983867', name: 'Stefan Salvatore', contact: '9876545234', designation: 'Admin', date: '11/02/2024', role: 'Admin', module: 'Admin' },
    { id: '#0983867', name: 'Stefan Salvatore', contact: '9876545234', designation: 'Admin', date: '11/02/2024', role: 'Admin', module: 'Admin' },
    { id: '#0983867', name: 'Stefan Salvatore', contact: '9876545234', designation: 'Admin', date: '11/02/2024', role: 'Admin', module: 'Admin' },
    { id: '#0983867', name: 'Stefan Salvatore', contact: '9876545234', designation: 'Admin', date: '11/02/2024', role: 'Admin', module: 'Admin' },
    { id: '#0983867', name: 'Stefan Salvatore', contact: '9876545234', designation: 'Admin', date: '11/02/2024', role: 'Admin', module: 'Admin' },
    { id: '#0983867', name: 'Stefan Salvatore', contact: '9876545234', designation: 'Admin', date: '11/02/2024', role: 'Admin', module: 'Admin' },
    { id: '#0983867', name: 'Stefan Salvatore', contact: '9876545234', designation: 'Admin', date: '11/02/2024', role: 'Admin', module: 'Admin' },
    { id: '#0983867', name: 'Stefan Salvatore', contact: '9876545234', designation: 'Admin', date: '11/02/2024', role: 'Admin', module: 'Admin' },
    { id: '#0983867', name: 'Stefan Salvatore', contact: '9876545234', designation: 'Admin', date: '11/02/2024', role: 'Admin', module: 'Admin' },
    { id: '#0983867', name: 'Stefan Salvatore', contact: '9876545234', designation: 'Admin', date: '11/02/2024', role: 'Admin', module: 'Admin' },
    { id: '#0983867', name: 'Stefan Salvatore', contact: '9876545234', designation: 'Admin', date: '11/02/2024', role: 'Admin', module: 'Admin' },
  ]);

  const router = useRouter();
  const [openRoleDropdownIndex, setOpenRoleDropdownIndex] = useState<number | null>(null);
  const [openModuleDropdownIndex, setOpenModuleDropdownIndex] = useState<number | null>(null);
  const [isFilterPopupOpen, setFilterPopupOpen] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({
    id: '',
    name: '',
    contact: '',
    designation: '',
    date: '',
    role: '',
    module: ''
  });

  const toggleRoleDropdown = (index: number) => {
    setOpenRoleDropdownIndex(openRoleDropdownIndex === index ? null : index);
  };

  const toggleModuleDropdown = (index: number) => {
    setOpenModuleDropdownIndex(openModuleDropdownIndex === index ? null : index);
  };

  const handleModuleClick = (module: string) => {
    if (module === 'Supervisor') {
      router.push('/admin-main/ui/settings/supervisor');
    }
    if (module === 'Teacher') {
      router.push('/admin-main/ui/settings/teacher');
    }
    if (module === 'Student') {
      router.push('/admin-main/ui/settings/student');
    }
    if (module === 'AcademicCoach') {
      router.push('/admin-main/ui/settings/academic-coach');
    }
  };

  const handleRoleChange = (index: number, newRole: string) => {
    const updatedEmployees = employees.map((emp, i) =>
      i === index ? { ...emp, role: newRole } : emp
    );
    setEmployees(updatedEmployees);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilterCriteria(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const filteredEmployees = employees.filter(emp => {
      return (
        (filterCriteria.id ? emp.id.includes(filterCriteria.id) : true) &&
        (filterCriteria.name ? emp.name.toLowerCase().includes(filterCriteria.name.toLowerCase()) : true) &&
        (filterCriteria.contact ? emp.contact.includes(filterCriteria.contact) : true) &&
        (filterCriteria.designation ? emp.designation.toLowerCase().includes(filterCriteria.designation.toLowerCase()) : true) &&
        (filterCriteria.date ? emp.date === filterCriteria.date : true) &&
        (filterCriteria.role ? emp.role === filterCriteria.role : true) &&
        (filterCriteria.module ? emp.module === filterCriteria.module : true)
      );
    });

    setEmployees(filteredEmployees); // Update the employees state with filtered results
    setFilterPopupOpen(false); // Close the popup after applying filters
  };

  return (
    <BaseLayout4>
      <div className="p-5 sm:p-6 md:p-8 min-h-screen w-full max-w-8xl mx-auto mr-5">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">Role Access</h2>

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
            <button className="text-xs px-4 py-2 rounded-lg shadow flex bg-[#223857] text-white items-center">
              <FaPlus className="mr-2" /> Add new
            </button>
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
                    <th className="px-4 py-3 text-center">Employee ID</th>
                    <th className="px-4 py-3 text-center">Employee Name</th>
                    <th className="px-4 py-3 text-center">Contact</th>
                    <th className="px-4 py-3 text-center">Designation</th>
                    <th className="px-4 py-3 text-center">Date of Joining</th>
                    <th className="px-4 py-3 text-center">Role Access</th>
                    <th className="px-4 py-3 text-center">Module Access</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, index) => (
                    <tr key={emp.id} className="border-t border-gray-200 text-gray-700 text-xs sm:text-xs">
                      <td className="py-3 px-4 text-center">{emp.id}</td>
                      <td className="py-3 px-4 text-center">{emp.name}</td>
                      <td className="py-3 px-4 text-center">{emp.contact}</td>
                      <td className="py-3 px-4 text-center">{emp.designation}</td>
                      <td className="py-3 px-4 text-center">{emp.date}</td>
                      {/* Role Dropdown (Modified to match the custom Module dropdown) */}
                      <td className="py-1 px-1 text-center align-middle relative">
                        <button
                          className="w-[140px] h-[30px] border border-gray-300 rounded-md text-xs flex items-center justify-between px-2 mx-auto cursor-pointer"
                          onClick={() => toggleRoleDropdown(index)}
                        >
                          <span className="w-full text-center truncate">{emp.role}</span>
                          <FaChevronDown size={10} className="ml-1 mt-[2px]" />
                        </button>

                        {openRoleDropdownIndex === index && (
                          <ul className="absolute z-50 bg-white border border-gray-300 mt-1 w-[140px] left-1/2 transform -translate-x-1/2 rounded shadow-md">
                            {["Supervisor", "Academic Coach", "Student", "Teacher"].map((role) => (
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

                      {/* Module Dropdown (Unchanged, still matching) */}
                      <td className="py-1 px-1 text-center align-middle relative">
                        <button
                          className="w-[140px] h-[30px] border border-gray-300 rounded-md text-xs flex items-center justify-between px-2 mx-auto cursor-pointer"
                          onClick={() => toggleModuleDropdown(index)}
                        >
                          <span className="w-full text-center truncate">{emp.module}</span>
                          <FaChevronDown size={10} className="ml-1 mt-[2px]" />
                        </button>

                        {openModuleDropdownIndex === index && (
                          <ul className="absolute z-50 bg-white border border-gray-300 mt-1 w-[140px] left-1/2 transform -translate-x-1/2 rounded shadow-md">
                            {["Supervisor", "AcademicCoach", "Student", "Teacher"].map((mod) => (
                              <li key={mod}>
                                <button
                                  className="w-full p-1 hover:bg-gray-100 text-xs text-center"
                                  onClick={() => {
                                    handleModuleClick(mod);
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


                      <td className="py-3 px-9 text-center text-gray-500 hover:text-gray-700 cursor-pointer">
                        <PiDotsThreeCircle size={18} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Your Filter Popup here remains unchanged */}
    </BaseLayout4>

  );
};

export default Page;
