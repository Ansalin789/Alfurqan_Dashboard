'use client'

import { useRouter } from 'next/navigation';
import ProfileCard from '@/components/Academic/ViewTeachersList/ProfileCard ';
import Stats from '@/components/Academic/ViewTeachersList/Stats';
import StudentList from '@/components/Academic/ViewTeachersList/StudentList';
import BaseLayout1 from '@/components/BaseLayout1';
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import Modal from 'react-modal';
import React, { useState, useRef, useEffect } from 'react';
import { FiCalendar, FiMoreVertical, FiClock } from 'react-icons/fi';



interface Class {
  name: string;
  course: string;
  date: string;
  status: string;
  grade?: string;
  performance?: string;
}
interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; 
}


const ViewTeachersList: React.FC<AddTeacherModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const router = useRouter();
  const [isScheduled, setIsScheduled] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('scheduled');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
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

  const handleReschedule = (event: React.MouseEvent) => {
    event.stopPropagation();
    router.push('/Academic/teachereschedule');
    setTimeout(() => {
      setActiveDropdown(null);
    }, 100);
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



  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSave = () => {
    setIsScheduled(true);
    closeModal();
  };

  const handleModalClick = (e: React.MouseEvent) => e.stopPropagation();

  const handleReschedules = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    onSuccess();
    
    onClose();

    // Redirect after 3 seconds
    setTimeout(() => {
      router.push('/Academic/viewTeacherSchedule');
    }, 3000);
  };


  return (
    <BaseLayout1>
    
    <div className="p-6 min-h-screen w-[100%] flex flex-col">
    <div className="p-2">
      <IoArrowBackCircleSharp 
        className="text-[25px] bg-[#fff] rounded-full text-[#012a4a] cursor-pointer" 
        onClick={() => router.push('manageTeachers')}
      />
    </div>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <ProfileCard />
        <div className="flex flex-1 space-y-4 w-full -mt-10">
          <Stats />
          <StudentList />
        </div>
      </div>
      <div className="mt-28">
      {!isScheduled ? (
            <div className="bg-white ml-[500px] -mt-56 shadow-lg rounded-lg p-6 flex items-center justify-center text-center align-middle w-[500px] h-32">
              <button
                className="bg-[#012a4a] text-white p-4 rounded-full w-12 h-12 flex items-center justify-center"
                onClick={openModal}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          ) : (
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
                                onClick={(event) => {
                                  handleReschedule(event);
                                  setActiveDropdown(null);
                                }}
                              >
                                Reschedule
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setActiveDropdown(null)}
                              >
                                Pause Class
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setActiveDropdown(null)}
                              >
                                Resume Class
                              </button>
                              <button
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setActiveDropdown(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
      
              <div className="flex justify-between items-center mt-1">
                <span className="text-[11px]">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, activeTab === 'scheduled' ? 5 : completedClasses.length)} of {activeTab === 'scheduled' ? 5 : completedClasses.length} entries
                </span>
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-2 py-1 text-[11px] rounded-[3px] ${
                        currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
      )}
      </div>
    </div>
    <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Schedule Classes Modal"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}>
        <div
          className="bg-white rounded-lg p-4 w-[300px]"
          onClick={handleModalClick}
        >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[14px] font-semibold">Add new Schedule</h3>
          <button
            onClick={closeModal}
            className="text-gray-600 text-[18px] hover:text-gray-800 transition-colors"
          >
            ×
          </button>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-2">
            <label htmlFor="title" className="block text-[12px] mb-1">Title</label>
            <input
              id="title"
              type="text"
              className="w-full border rounded-lg p-1 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-2 flex space-x-2">
            <div className="w-1/2">
              <label htmlFor="date" className="block text-[12px] mb-1">Date</label>
              <div className="flex items-center border rounded-lg p-1 focus-within:ring-2 focus-within:ring-blue-500">
                <FiCalendar className="text-gray-500 text-[14px]" />
                <input
                  id="date"
                  type="date"
                  className="w-full border-none text-[12px] focus:outline-none"
                />
              </div>
            </div>
            <div className="w-1/2">
              <label htmlFor="time" className="block text-[12px] mb-1">Time</label>
              <div className="flex items-center border rounded-lg p-1 focus-within:ring-2 focus-within:ring-blue-500">
                <FiClock className="text-gray-500 text-[14px]" />
                <input
                  id="time"
                  type="time"
                  className="w-full border-none text-[12px] focus:outline-none"
                />
              </div>
            </div>
          </div>
          <div className="mb-2">
            <label htmlFor="comment" className="block text-[12px] mb-1">Comment</label>
            <textarea
              id="comment"
              className="w-full border rounded-lg p-1 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white text-[12px] p-1 rounded-lg hover:bg-gray-700 transition-colors"
            onClick={handleSave}
          >
            Submit Schedule
          </button>
        </form>
      </div>
    </div>
      </Modal>
    </BaseLayout1>
  );
};

export default ViewTeachersList;
