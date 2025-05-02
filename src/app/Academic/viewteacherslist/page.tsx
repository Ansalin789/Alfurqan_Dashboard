'use client'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Stats from '@/components/Academic/ViewTeachersList/Stats';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BaseLayout1 from '@/components/BaseLayout1';
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import React, { useState, useRef, useEffect } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import StudentList from '@/components/Academic/ViewTeachersList/StudentList';
import { IoMdArrowDropdownCircle } from "react-icons/io";
import axios from 'axios';

interface Class {
  name: string;
  course: string;
  date: string;
  status: string;
  grade?: string;
  performance?: string;
}

interface Student {
  _id: string;
  name: string;
  course: string;
  startdate: string;
  status: string;
}

interface User {
  _id: string;
  userName: string;
  email: string;
  status: string;
  teacherId: string;
  name: string;
  course: string;
  startdate: string;
}

interface StudentListData {
  users: User[];
  status: string;
}

const ViewTeachersList = () => {

  const router = useRouter();
  const [activeTab, setActiveTab] = useState('scheduled');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [studentListData, setStudentListData] = useState<Schedule[] | null>(null);
  const dropdownRef = useRef<HTMLTableCellElement | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const itemsPerPage = 5;  // Only show 5 items per page

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

  const totalPages = Math.ceil(
    (studentListData ? studentListData.length : 0) / itemsPerPage  // Use studentListData for totalPages
  );

  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleReschedule = (event: React.MouseEvent) => {
    event.stopPropagation();
    router.push('/Academic/viewTeacherSchedule');
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

  interface Student {
    studentId: string;
    studentFirstName: string;
    studentLastName: string;
    studentEmail: string;
  }

  interface Teacher {
    teacherId: string;
    teacherName: string;
    teacherEmail: string;
  }

  interface Schedule {
    student: Student;
    teacher: Teacher;
    _id: string;
    classDay: string[];
    package: string;
    preferedTeacher: string;
    totalHourse: number;
    startDate: string;
    endDate: string;
    startTime: string[];
    endTime: string[];
    scheduleStatus: string;
    status: string;
    createdBy: string;
    createdDate: string;
    lastUpdatedDate: string;
    __v: number;
  }

  interface ApiResponse {
    totalCount: number;
    students: Schedule[];
  }

  interface Teacher {
    _id: string;
    userId: string;
    userName: string;
    email: string;
    profileImage?: string | null;
    level: string;
    subject: string;
    rating: number;
  }

  const [teacherIdLocal, setTeacherIdLocal] = useState<string | null>(null);
  const [auth, setAuth] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const teacherId = localStorage.getItem('manageTeacherId');
      setTeacherIdLocal(teacherId);
      const seauth = localStorage.getItem('authToken');
      setAuth(seauth);
    }
  }, []);

  const [teachers, setTeachers] = useState<Teacher>();

  useEffect(() => {
    const fetchTeachers = async () => {
      const teacherId = localStorage.getItem('manageTeacherId');
      try {
        const response = await fetch(`https://api.blackstoneinfomaticstech.com/users/${teacherId}`);
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };
    studentlist();
    fetchTeachers();
  }, []);

  const studentlist = async () => {
    try {
      const teacherId = localStorage.getItem('manageTeacherId');
      const response = await axios.get<ApiResponse>("https://api.blackstoneinfomaticstech.com/classShedule");
      const filteredData = response.data.students.filter(
        (item: any) => item.teacher.teacherId === teacherId
      );
      setStudentListData(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setIsDatePickerOpen(false);
      router.push("/Academic/viewTeacherSchedule");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage; // Corrected calculation

  const dataToShow = studentListData ? studentListData.slice(indexOfFirstItem, indexOfLastItem) : [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const Pagination = () => {
    return (
      <div>
        <div className="flex justify-between items-center p-2">
          <p className="text-[10px] text-gray-600">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, studentListData ? studentListData.length : 0)} from {studentListData ? studentListData.length : 0} data
          </p>
          <div className="flex space-x-2 text-[7px]">
            {/* Previous Button */}
            <button
              className={`px-[8px] py-[4px] rounded ${currentPage === 1
                ? "bg-gray-100 text-gray-400"
                : "bg-gray-200 hover:bg-gray-300"
                }`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>

            {/* Pagination Numbers */}
            {totalPages > 3 ? (
              <>
                {/* First Page */}
                <button
                  className={`px-[8px] py-[4px] rounded ${currentPage === 1
                    ? "bg-[#1B2B65] text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  onClick={() => handlePageChange(1)}
                >
                  1
                </button>

                {/* Left Ellipsis */}
                {currentPage > 3 && <span className="px-2 py-1">...</span>}

                {/* Pages Around Current */}
                {Array.from({ length: 3 }, (_, i) => currentPage - 2 + i)  // Adjusted calculation
                  .filter((page) => page > 1 && page < totalPages)
                  .map((page) => (
                    <button
                      key={page}
                      className={`px-2 py-1 rounded ${currentPage === page
                        ? "bg-[#1B2B65] text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}

                {/* Right Ellipsis */}
                {currentPage < totalPages - 2 && (
                  <span className="px-2 py-1">...</span>
                )}

                {/* Last Page */}
                <button
                  className={`px-2 py-1 rounded ${currentPage === totalPages
                    ? "bg-[#1B2B65] text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            ) : (
              // Display all pages when totalPages <= 3
              [...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`px-2 py-1 rounded ${currentPage === index + 1
                    ? "bg-[#1B2B65] text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))
            )}

            {/* Next Button */}
            <button
              className={`px-2 py-1 rounded ${currentPage === totalPages
                ? "bg-gray-100 text-gray-400"
                : "bg-gray-200 hover:bg-gray-300"
                }`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    );
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
          <div className="bg-white rounded-lg shadow-lg overflow-hidden w-[300px] mt-14">
            <div className="bg-[#012A4A] relative">
              <div className="flex flex-col items-center pt-6 pb-4">
                <Image
                  className="rounded-full border-4 border-white"
                  src="/assets/images/proff.jpg"
                  width={96}
                  height={96}
                  alt="Profile"
                />
                <h2 className="mt-4 text-xl font-semibold text-white">{teachers?.userName}</h2>
                <p className="text-gray-300">Teacher</p>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Personal Info</h3>
              <ul className="space-y-2 text-sm">
                <li><strong>Full Name:</strong> {teachers?.userName}</li>
                <li><strong>Email:</strong> {teachers?.email}</li>
                <li><strong>Bio:</strong> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-1 space-y-4 w-full -mt-10">
            <Stats />
            <StudentList />
          </div>
        </div>
        <div className="p-2">
          <div className="bg-white justify-between shadow-lg rounded-lg p-4 ml-[430px] -mt-40 w-[720px] h-[350px] border-2 border-[#1C3557] scrollbar-none flex flex-col">
            <div>
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-[14px] font-semibold">Scheduled Classes</h3>
                <div className="flex space-x-4 items-center">
                  <div className="flex justify-end px-[50px] mt-[2px] h-6 relative">
                    <div className="flex items-center border border-[#1C3557] rounded-md overflow-hidden">
                      <button
                        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                        className="flex items-center space-x-1 shadow-lg px-[2px] py-[1px] rounded-lg text-gray-600 hover:text-gray-800"
                      >
                        <span className="text-[10px]">
                          {selectedDate ? selectedDate.toLocaleDateString() : "Date"}
                        </span>
                        <IoMdArrowDropdownCircle size={12} />
                      </button>
                      {isDatePickerOpen && (
                        <div className="absolute right-0 z-10 mt-80">
                          <DatePicker
                            selected={selectedDate}
                            onChange={handleDateSelect}
                            inline
                            calendarContainer={(props) => (
                              <div {...props} style={{ fontSize: "10px" }} />
                            )}
                            className="border rounded-lg shadow-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-start items-center border-b mb-2">
                <button
                  className={`py-2 px-4 text-[11px] ${activeTab === 'scheduled' ? 'border-b-2 border-blue-600' : ''}`}
                  onClick={() => {
                    setActiveTab('scheduled');
                    setCurrentPage(1);
                  }}
                >
                  Scheduled
                </button>
                <button
                  className={`py-2 px-4 text-[11px] ${activeTab === 'completed' ? 'border-b-2 border-blue-600' : ''}`}
                  onClick={() => {
                    setActiveTab('completed');
                    setCurrentPage(1);
                  }}
                >
                  Completed
                </button>
              </div>

              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="py-2 text-[11px] text-center">Name</th>
                    <th className="py-2 text-[11px] text-center">Date</th>
                    <th className="py-2 text-[11px]">Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {dataToShow.map((item: Schedule, index: number) => (
                    <tr key={item._id} className="border-t">
                      <td className="py-1 text-[10px] text-center">{item.student.studentFirstName}</td>
                      <td className="py-1 text-[10px] text-center">{new Date(item.startDate).toISOString().slice(0, 10)}</td>
                      <td className="py-1 text-center">
                        <button
                          className={`px-4 py-1 rounded-lg text-[9px] text-center ${item.status === 'Completed' ? 'bg-green-600' : 'bg-gray-900'
                            } text-white`}
                        >
                          Active
                        </button>
                      </td>
                      <td className="py-1 text-right relative" ref={dropdownRef}>
                        {activeTab === 'scheduled' && (
                          <button onClick={() => toggleDropdown(index)}>
                            <FiMoreVertical className="inline-block text-[13px] cursor-pointer" />
                          </button>
                        )}

                        {activeDropdown === index && activeTab === 'scheduled' && (
                          <div className="absolute right-0 mt-2 w-24 bg-white border rounded-md shadow-lg z-10">
                            <button
                              onClick={handleReschedule}
                              className="block px-4 py-2 text-[10px] text-gray-800 hover:bg-gray-100 w-full text-left"
                            >
                              Reschedule
                            </button>
                            <button
                                className="w-full text-left px-4 py-2 text-[10px] text-gray-800 hover:bg-gray-100"
                                onClick={() => setActiveDropdown(null)}
                              >
                                Cancel
                              </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
            </div>
            <div>
              {/* Pagination Component */}
              {studentListData && studentListData.length > itemsPerPage && (
                <Pagination />
              )}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout1>
  );
};

export default ViewTeachersList;
