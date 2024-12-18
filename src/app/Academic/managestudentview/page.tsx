'use client';

import { useRouter } from 'next/navigation';
import BaseLayout1 from '@/components/BaseLayout1';
import Image from 'next/image';
import React, { useState } from 'react';
import Modal from 'react-modal';
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import { FiSun, FiMoon, FiBell, FiCalendar, FiMoreVertical } from 'react-icons/fi';
import { FaMedal, FaPercent, FaUserCheck } from 'react-icons/fa';

const ManageStudentView = () => {
  const router = useRouter();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [activeTab, setActiveTab] = useState('scheduled');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

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

  const scheduledClasses = Array.from({ length: 5 }).map((_, i) => ({
    name: 'Samantha William',
    course: 'Tajweed Masterclass',
    date: 'January 2, 2020',
    status: 'Scheduled'
  }));

  const completedClasses = Array.from({ length: 50 }).map((_, i) => ({
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

  return (
    <BaseLayout1>
      <div className="flex flex-col md:flex-row pt-14 pl-4 min-h-screen">
        <div className="p-2">
          <IoArrowBackCircleSharp 
            className="text-[25px] bg-[#fff] rounded-full text-[#012a4a] cursor-pointer" 
            onClick={() => router.push('manageStudents')}
          />
        </div>
        <div className="flex flex-col items-center bg-[#fff] shadow-lg rounded-2xl md:w-[300px] h-[600px]">
          <div className="bg-[#012a4a] align-middle p-6 w-full h-1/4 rounded-t-2xl">
            <div className="w-full flex justify-end">
              <button className="text-gray-500 hover:text-gray-700">
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
                    d="M17.293 6.293a1 1 0 011.414 0l1 1a1 1 0 010 1.414l-12 12a1 1 0 01-.39.22l-4 1a1 1 0 01-1.22-1.22l1-4a1 1 0 01.22-.39l12-12z"
                  />
                </svg>
              </button>
            </div>
            <div className="justify-center">
              <Image
                src="/assets/images/proff.jpg"
                alt="Profile"
                className="rounded-full justify-center align-middle text-center ml-28 w-24 h-24 mb-4 mt-[45px]"
                width={150}
                height={150}
              />
            </div>
            <div className="justify-center text-center border border-b-black">
              <h2 className="text-2xl font-semibold mb-2">Will Jonto</h2>
              <p className="text-gray-500 mb-4">Student</p>
            </div>

            <div className="text-left w-full p-2 pt-6">
              <h3 className="font-semibold mb-2">Personal Info</h3>
              <p className="text-gray-800 text-[14px] mb-1">
                <span className="font-semibold text-[14px]">Full Name: </span>Will Jonto
              </p>
              <p className="text-gray-800 text-[14px] mb-1">
                <span className="font-semibold text-[14px]">Email: </span>willjontoax@gmail.com
              </p>
              <p className="text-gray-800 text-[13px] mb-1">
                <span className="font-semibold text-[14px]">Phone Number: </span>+91 9800887765
              </p>
              <p className="text-gray-800 text-[14px] mb-1">
                <span className="font-semibold text-[14px]">Level: </span>1
              </p>
              <p className="text-gray-800 text-[14px] mb-1">
                <span className="font-semibold text-[14px]">Package: </span>Simple
              </p>
              <p className="text-gray-800 text-[14px] mb-1">
                <span className="font-semibold text-[14px]">Mother tongue: </span>English
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:ml-28 w-full md:w-2/3 md:-mt-14 p-10 -mt-14">
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div className="flex flex-wrap items-center p-2 ml-[10px]">
              <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 m-2 w-60">
                <span className="text-blue-500 text-3xl font-semibold">97%</span>
                <span className="text-gray-500">Attendance</span>
              </div>
              <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 m-2 w-60">
                <span className="text-yellow-500 text-3xl font-semibold">64%</span>
                <span className="text-gray-500">Performance</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center p-2 ml-[10px]">
              <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 m-2 w-60">
                <span className="text-purple-500 text-3xl font-semibold">Gold</span>
                <span className="text-gray-500">Package</span>
              </div>
              <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 m-2 w-60">
                <span className="text-pink-500 text-3xl font-semibold">245</span>
                <span className="text-gray-500">Reward Points</span>
              </div>
            </div>
          </div>

          {!isScheduled ? (
            <div className="bg-white ml-7 shadow-lg rounded-lg p-6 flex items-center justify-center text-center align-middle w-[500px] h-32">
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
              <div className="bg-white shadow-lg rounded-lg p-6 -ml-20 mb-14 overflow-y-scroll h-96 scrollbar-hide">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[14px] font-semibold">Scheduled Classes</h3>
                  <div className="flex space-x-4 items-center">
                    <FiCalendar className="text-[14px]" />
                    <button className="bg-gray-100 p-2 text-[13px] rounded-lg">Date</button>
                  </div>
                </div>

                <div className="flex justify-start items-center border-b mb-4">
                  <button 
                    className={`py-2 px-4 text-[14px] ${activeTab === 'scheduled' ? 'border-b-2 border-blue-600' : ''}`}
                    onClick={() => {
                      setActiveTab('scheduled');
                      setCurrentPage(1);
                    }}
                  >
                    Scheduled (10)
                  </button>
                  <button 
                    className={`py-2 px-4 text-[14px] ${activeTab === 'completed' ? 'border-b-2 border-blue-600' : ''}`}
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
                      <th className="py-2 text-[14px] text-center">Name</th>
                      <th className="py-2 text-[14px]">Courses</th>
                      <th className="py-2 text-[14px]">Date</th>
                      {activeTab === 'completed' && (
                        <>
                          <th className="py-2 text-[14px]">Grade</th>
                          <th className="py-2 text-[14px]">Performance</th>
                        </>
                      )}
                      <th className="py-2 text-[14px]">Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCurrentData().map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-2 text-[14px]">{item.name}</td>
                        <td className="py-2 text-[14px]">{item.course}</td>
                        <td className="py-2 text-[14px]">{item.date}</td>
                        {activeTab === 'completed' && (
                          <>
                            <td className="py-2 text-[14px]">{item.grade}</td>
                            <td className="py-2 text-[14px]">{item.performance}</td>
                          </>
                        )}
                        <td className="py-2">
                          <button 
                            className={`px-4 py-1 rounded-lg text-[14px] ${
                              item.status === 'Completed' ? 'bg-green-600' : 'bg-gray-900'
                            } text-white`}
                          >
                            {item.status}
                          </button>
                        </td>
                        <td className="py-2 text-right relative">
                          <button onClick={() => toggleDropdown(index)}>
                            <FiMoreVertical className="inline-block text-xl cursor-pointer" />
                          </button>
                          {activeDropdown === index && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                              <div className="py-1">
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => {
                                    // Add reschedule logic here
                                    setActiveDropdown(null);
                                  }}
                                >
                                  Reschedule
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => {
                                    // Add pause logic here
                                    setActiveDropdown(null);
                                  }}
                                >
                                  Pause Class
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => {
                                    // Add resume logic here
                                    setActiveDropdown(null);
                                  }}
                                >
                                  Resume Class
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => {
                                    // Add cancel logic here
                                    setActiveDropdown(null);
                                  }}
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

                <div className="flex justify-between items-center mt-4">
                  <span>
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, activeTab === 'scheduled' ? scheduledClasses.length : completedClasses.length)} of {activeTab === 'scheduled' ? scheduledClasses.length : completedClasses.length} entries
                  </span>
                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-2 py-1 rounded-lg ${
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
        <div className="bg-white rounded-lg p-6 w-[900px] h-[500px] overflow-auto">
          <h2 className="text-xl font-semibold mb-4">Schedule Classes</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <div key={day} className="flex items-center mb-2">
                  <div className='border-1 p-2 rounded-xl border-gray-950 bg-[#D4D6D9] flex'>
                    <input type="checkbox" className="form-checkbox mr-2 rounded-xl text-[11px]" />
                    <label className="block font-medium text-gray-700 rounded-xl text-[11px]">{day}</label>
                  </div>
                  
                  <input type="time" className="form-input p-2 bg-[#D4D6D9] rounded-xl text-[11px] ml-4" />
                  <input type="number" className="form-input w-[75px] text-center ml-4 text-[11px] p-2 bg-[#D4D6D9] rounded-xl" placeholder="Duration" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="block font-medium text-[13px] text-gray-700">Package</label>
                <input type="text" className="form-input w-full bg-[#d4d6d9] p-2 rounded-xl text-[12px]" placeholder="Simple" />
              </div>
              <div className="col-span-2">
                <label className="block font-medium text-[13px] text-gray-700">Total Hours</label>
                <input type="number" className="form-input w-full bg-[#d4d6d9] p-2 rounded-xl text-[12px]" placeholder="1" />
              </div>
              <div className="col-span-2">
                <label className="block font-medium text-[13px] text-gray-700">Preferred Teacher</label>
                <select className="form-select w-full text-[13px] bg-[#d4d6d9] p-2 rounded-xl">
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block font-medium text[13px] text-gray-700">Course</label>
                <select className="form-select w-full text-[12px] bg-[#d4d6d9] p-2 rounded-xl">
                  <option>Arabic</option>
                  <option>Quran</option>
                  <option>Islamic Studies</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block font-medium text-gray-700 text-[12px]">Start Date</label>
                <input type="date" className="form-input w-full text-[11px] bg-[#d4d6d9] p-2 rounded-xl" />
              </div>
              <div className="col-span-2">
                <label className="block font-medium text-gray-700 text-[12px]">End Date</label>
                <input type="date" className="form-input w-full text-[11px] bg-[#d4d6d9] p-2 rounded-xl" />
              </div>
              <div className="col-span-2">
                <label className="block font-medium text-gray-700 text-[12px]">Start Time</label>
                <input type="time" className="form-input w-full text-[11px] bg-[#d4d6d9] p-2 rounded-xl" />
              </div>
              <div className="col-span-2">
                <label className="block font-medium text-gray-700 text-[12px]">End Time</label>
                <input type="time" className="form-input w-full text-[11px] bg-[#d4d6d9] p-2 rounded-xl" />
              </div>
              <div className="col-span-2">
                <label className="block font-medium text-gray-700 text-[12px]">SelectTeacher</label>
                <select className="form-select w-full text-[12px] bg-[#d4d6d9] p-2 rounded-xl">
                  <option>Teacher 1</option>
                  <option>Teacher 2</option>
                  <option>Teacher 3</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="bg-[#012a4a] text-white py-2 px-4 rounded-lg mr-2"
              onClick={closeModal}
            >
              Close
            </button>
            <button
              className="bg-[#012a4a] text-white py-2 px-4 rounded-lg"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </BaseLayout1>
  );
};

export default ManageStudentView;