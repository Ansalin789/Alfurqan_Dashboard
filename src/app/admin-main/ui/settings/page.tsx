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
            <div className="p-6 min-h-screen mx-auto ">
                <h2 className="text-xl font-bold mb-6">Role Access</h2>
                <div className="flex justify-between items-center p-2">
                    <div className="flex flex-1 mb-4 -ml-3 space-x-4 items-center justify-between overflow-y-scroll scrollbar-none">
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="Search here..."
                                className="border rounded-lg px-2 text-[12px] mr-4 shadow"
                            />
                            <button
                                className="flex items-center bg-[#fff] p-2 rounded-lg shadow text-[12px]"
                                onClick={() => setFilterPopupOpen(true)}
                            >
                                <FaFilter className="mr-2" /> Filter
                            </button>
                        </div>
                        <div className="flex">
                            <button
                                className="text-[12px] p-2 rounded-lg shadow flex bg-[#223857] text-[#fff] items-center mx-4"
                            >
                                <FaPlus className="mr-2" /> Add new
                            </button>
                            <select className="border rounded-lg p-2 shadow text-[12px]">
                                <option>Duration: Last month</option>
                                <option>Duration: Last week</option>
                                <option>Duration: Last year</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="bg-white shadow-md border border-gray-800 rounded-lg overflow-hidden h-[490px] overflow-y-scroll scrollbar-thin">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-gray-600 text-left text-[12px]">
                                <th className="px-5 text-center py-8">Employee ID</th>
                                <th className="px-5 text-center py-8">Employee Name</th>
                                <th className="px-5 text-center py-8">Contact</th>
                                <th className="px-5 text-center py-8">Designation</th>
                                <th className="px-5 text-center py-8">Date of Joining</th>
                                <th className="px-5 text-center py-8">Role Access</th>
                                <th className="px-5 text-center py-8">Module Access</th>
                                <th className="px-5 text-center py-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp, index) => (
                                <tr key={index} className="border-t border-gray-200 text-gray-700 text-[10px]">
                                    <td className="py-4 px-5 text-center">{emp.id}</td>
                                    <td className="py-4 px-5 text-center">{emp.name}</td>
                                    <td className="py-4 px-5 text-center">{emp.contact}</td>
                                    <td className="py-4 px-5 text-center">{emp.designation}</td>
                                    <td className="py-4 px-5 text-center">{emp.date}</td>
                                    <td className="py-4 px-5 text-center">
                                        <select
                                            className="border border-gray-300 p-1 rounded-md text-center"
                                            value={emp.role}
                                            onChange={(e) => handleRoleChange(index, e.target.value)}
                                        >
                                            <option value="Supervisor">Supervisor</option>
                                            <option value="Academic Coach">Academic Coach</option>
                                            <option value="Student">Student</option>
                                            <option value="Teacher">Teacher</option>
                                        </select>
                                    </td>
                                    <td className="py-4 px-5 text-center">
                                        <button className='flex text-center' onClick={() => toggleModuleDropdown(index)}>
                                            {emp.module} <FaChevronDown size={6} className='mt-[5px] ml-1' />
                                        </button>
                                        {openModuleDropdownIndex === index && (
                                            <ul className="absolute bg-white border border-gray-300 mt-2">
                                                <li
                                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                                    onClick={() => {
                                                        handleModuleClick('Supervisor');
                                                        setOpenModuleDropdownIndex(null);
                                                    }}
                                                >
                                                    Supervisor
                                                </li>
                                                <li
                                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                                    onClick={() => {
                                                        handleModuleClick('AcademicCoach');
                                                        setOpenModuleDropdownIndex(null);
                                                    }}
                                                >
                                                    Academic Coach
                                                </li>
                                                <li
                                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                                    onClick={() => {
                                                        handleModuleClick('Student');
                                                        setOpenModuleDropdownIndex(null);
                                                    }}
                                                >
                                                    Student
                                                </li>
                                                <li
                                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                                    onClick={() => {
                                                        handleModuleClick('Teacher');
                                                        setOpenModuleDropdownIndex(null);
                                                    }}
                                                >
                                                    Teacher
                                                </li>
                                            </ul>
                                        )}
                                    </td>
                                    <td className="py-4 px-5 w-5 text-center text-gray-500 hover:text-gray-700 cursor-pointer">
                                        <PiDotsThreeCircle size={20} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Filter Popup */}
                {isFilterPopupOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-md font-bold mb-4">Filter Employees</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label className="block mb-1 text-sm">Employee ID</label>
                                    <input
                                        type="text"
                                        name="id"
                                        value={filterCriteria.id}
                                        onChange={handleFilterChange}
                                        className="border rounded-lg w-full p-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 text-sm">Employee Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={filterCriteria.name}
                                        onChange={handleFilterChange}
                                        className="border rounded-lg w-full p-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 text-sm">Contact</label>
                                    <input
                                        type="text"
                                        name="contact"
                                        value={filterCriteria.contact}
                                        onChange={handleFilterChange}
                                        className="border rounded-lg w-full p-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 text-sm">Designation</label>
                                    <input
                                        type="text"
                                        name="designation"
                                        value={filterCriteria.designation}
                                        onChange={handleFilterChange}
                                        className="border rounded-lg w-full p-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 text-sm">Date of Joining</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={filterCriteria.date}
                                        onChange={handleFilterChange}
                                        className="border rounded-lg w-full p-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 text-sm">Role Access</label>
                                    <select
                                        name="role"
                                        value={filterCriteria.role}
                                        onChange={handleFilterChange}
                                        className="border rounded-lg w-full p-2 text-sm"
                                    >
                                        <option value="">Select Role</option>
                                        <option value="Supervisor">Supervisor</option>
                                        <option value="Academic Coach">Academic Coach</option>
                                        <option value="Student">Student</option>
                                        <option value="Teacher">Teacher</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 text-sm">Module Access</label>
                                    <select
                                        name="module"
                                        value={filterCriteria.module}
                                        onChange={handleFilterChange}
                                        className="border rounded-lg w-full p-2 text-sm"
                                    >
                                        <option value="">Select Module</option>
                                        <option value="Supervisor">Supervisor</option>
                                        <option value="Academic Coach">Academic Coach</option>
                                        <option value="Student">Student</option>
                                        <option value="Teacher">Teacher</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 text-sm"
                                    onClick={applyFilters}
                                >
                                    Apply
                                </button>
                                <button
                                    className="bg-gray-300 px-4 py-2 rounded-lg text-sm"
                                    onClick={() => setFilterPopupOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </BaseLayout4>
    );
};

export default Page;
