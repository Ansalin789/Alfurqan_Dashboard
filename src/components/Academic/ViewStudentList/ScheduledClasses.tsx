'use client'

import React, { useState, useRef, useEffect } from 'react';
import { FiCalendar, FiMoreVertical } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import AddScheduleModal from './AddScheduleModel'; 

interface Class {
  name: string;
  course: string;
  date: string;
  status: string;
  grade?: string;
  performance?: string;
}

const ScheduledClasses = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('scheduled');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);  // State to control modal visibility
  const dropdownRef = useRef<HTMLTableDataCellElement | null>(null);
  const itemsPerPage = 10;

  const scheduledClasses: Class[] = Array.from({ length: 5 }).map(() => ({
    name: 'Samantha William',
    course: 'Tajweed Masterclass',
    date: 'January 2, 2020',
    status: 'Available'
  }));

  const completedClasses: Class[] = Array.from({ length: 50 }).map(() => ({
    name: 'John Smith',
    course: 'Advanced Quran Reading',
    date: 'December 15, 2023',
    status: 'Completed',
    grade: 'A',
    performance: '95%'
  }));

  const getCurrentData = () => {
    const data = activeTab === 'scheduled' ? scheduledClasses : completedClasses;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(
    (activeTab === 'scheduled' ? scheduledClasses.length : completedClasses.length) / itemsPerPage
  );

  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };



  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="p-2">
      <div className="bg-white shadow-lg rounded-lg p-4 ml-[460px] -mt-64 overflow-y-scroll w-[600px] h-[350px] scrollbar-hide">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-[14px] font-semibold">Scheduled Classes</h3>
          <div className="flex space-x-4 items-center">
            <FiCalendar className="text-[14px]" />
            <button className="bg-gray-100 p-1 text-[11px] rounded-lg">Date</button>
          </div>
        </div>

        <div className="flex justify-start items-center border-b mb-2">
          <button 
            className={`py-2 px-4 text-[13px] ${activeTab === 'scheduled' ? 'border-b-2 border-blue-600' : ''}`}
            onClick={() => {
              setActiveTab('scheduled');
              setCurrentPage(1);
            }}
          >
            Scheduled (10)
          </button>
          <button 
            className={`py-2 px-4 text-[13px] ${activeTab === 'completed' ? 'border-b-2 border-blue-600' : ''}`}
            onClick={() => {
              setActiveTab('completed');
              setCurrentPage(1);
            }}
          >
            Completed (80)
          </button>
        </div>

        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="py-2 text-[13px] text-center">Name</th>
              <th className="py-2 text-[13px] text-center">Courses</th>
              <th className="py-2 text-[13px] text-center">Date</th>
              <th className="py-2 text-[13px]">Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {getCurrentData().map((item, index) => (
              <tr key={index} className="border-t">
                <td className="py-1 text-[12px] text-center">{item.name}</td>
                <td className="py-1 text-[12px] text-center">{item.course}</td>
                <td className="py-1 text-[12px] text-center">{item.date}</td>
                <td className="py-1 text-center">
                  <button 
                    className={`px-4 py-1 rounded-lg text-[12px] text-center ${
                      item.status === 'Completed' ? 'bg-green-600' : 'bg-gray-900'
                    } text-white`}
                  >
                    {item.status}
                  </button>
                </td>
                <td className="py-1 text-right relative" ref={dropdownRef}>
                  {activeTab === 'scheduled' && (
                    <button onClick={() => toggleDropdown(index)}>
                      <FiMoreVertical className="inline-block text-xl cursor-pointer" />
                    </button>
                  )}
                  {activeDropdown === index && activeTab === 'scheduled' && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                      <div className="py-1">
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsModalOpen(true)}  // Open modal on click
                        >
                          Add new Schedule
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4 space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button 
              key={index}
              className={`px-2 py-1 text-[11px] rounded-lg ${
                currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Add the modal component */}
      <AddScheduleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ScheduledClasses;
