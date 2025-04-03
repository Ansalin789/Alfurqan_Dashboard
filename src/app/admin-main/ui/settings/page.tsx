'use client';

import BaseLayout4 from '@/components/BaseLayout4';
import React, { useState } from 'react';
import { FaChevronDown, FaEllipsisV, FaFilter, FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';



const employees = [
  { id: '#0983867', name: 'Robert James', contact: '9876545234', designation: 'Supervisor', date: '11/02/2024', role: 'Supervisor', module: 'Supervisor' },
  { id: '#0983867', name: 'Stefan Salvatore', contact: '9876545234', designation: 'Human Resource', date: '11/02/2024', role: 'Human Resource', module: 'Human Resource' },
  { id: '#0983867', name: 'Gio Rose', contact: '9876545234', designation: 'Admin', date: '11/02/2024', role: 'Admin', module: 'Admin' },
  { id: '#0983867', name: 'Prasanna Popz', contact: '9876545234', designation: 'Teacher', date: '11/02/2024', role: 'Teacher', module: 'Teacher' },
  { id: '#0983867', name: 'Stefan Salvatore', contact: '9876545234', designation: 'Admin', date: '11/02/2024', role: 'Admin', module: 'Admin' },
];

const Page: React.FC = () => {

  const router = useRouter();
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

  const toggleDropdown = (index: number) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const handleModuleClick = (module: string) => {
    if (module === 'Supervisor') {
      router.push('/admin-main/ui/settings/supervisor');
    };
    if (module === 'Teacher') {
      router.push('/admin-main/ui/settings/teacher');
    };
    if (module === 'Student') {
      router.push('/admin-main/ui/settings/student');
    };
    if (module === 'AcademicCoach') {
      router.push('/admin-main/ui/settings/academic-coach');
    }
  };
  

  return (
    <BaseLayout4>
      <div className="p-6 min-h-screen mx-auto">
        <div className="flex justify-between items-center p-2">
          <div className="flex flex-1 mb-4 space-x-4 items-center justify-between overflow-y-scroll scrollbar-none">
            <div className="flex">
              <input
                type="text"
                placeholder="Search here..."
                className="border rounded-lg px-2 text-[12px] mr-4 shadow"
              />
              <button
                className="flex items-center bg-gray-200 p-2 rounded-lg shadow text-[12px]"
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
        <div className="bg-white shadow-md border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="p-4 text-gray-600 text-left text-[12px]">
                <th className="p-3">Employee ID</th>
                <th className="p-3">Employee Name</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Designation</th>
                <th className="p-3">Date of Joining</th>
                <th className="p-3">Role Access</th>
                <th className="p-3">Module Access</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr key={index} className="border-t border-gray-200 text-gray-700 text-[10px]">
                  <td className="p-3">{emp.id}</td>
                  <td className="p-3">{emp.name}</td>
                  <td className="p-3">{emp.contact}</td>
                  <td className="p-3">{emp.designation}</td>
                  <td className="p-3">{emp.date}</td>
                  <td className="p-3"><span className='flex'>{emp.role} <FaChevronDown size={6} className='mt-[5px] ml-1'/></span></td>
                  <td className="p-3">
                    <span className='flex' onClick={() => toggleDropdown(index)}>
                      {emp.module} <FaChevronDown size={6} className='mt-[5px] ml-1'/>
                    </span>
                    {openDropdownIndex === index && (
                      <ul className="absolute bg-white border border-gray-300 mt-2">
                      <li
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => handleModuleClick('Supervisor')}
                      >
                        Supervisor
                      </li>
                      <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleModuleClick('Teacher')}>Teacher</li>
                      <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleModuleClick('Student')}>Student</li>
                      <li className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleModuleClick('AcademicCoach')}>Academic Coach</li>
                    </ul>
                    )}
                  </td>
                  <td className="p-3 text-gray-500 hover:text-gray-700 cursor-pointer"><FaEllipsisV /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BaseLayout4>
  );
};

export default Page;
