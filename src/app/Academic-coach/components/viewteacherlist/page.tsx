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

 

  const [teachers, setTeachers] = useState<Teacher>();

  useEffect(() => {
    const fetchTeachers = async () => {
      const teacherId = localStorage.getItem('manageTeacherId');
      const token =
    typeof window !== "undefined" ? localStorage.getItem("AcademicCoachAuthToken") : null;

  if (!token) {
    console.error("❌ AdminAuthToken not found");
    return;
  }
      try {
        const response = await fetch(`https://api.blackstoneinfomaticstech.com/users/${teacherId}`,{
          headers:{
            'Authorization': `Bearer ${token}`,
          }
        });
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
      const token =
    typeof window !== "undefined" ? localStorage.getItem("AcademicCoachAuthToken") : null;

  if (!token) {
    console.error("❌ AdminAuthToken not found");
    return;
  }
      const response = await axios.get<ApiResponse>("https://api.blackstoneinfomaticstech.com/classShedule",{
        headers:{
          'Authorization': `Bearer ${token}`,
        }
      });
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

  
  return (
    <div>
      <div className="p-6 min-h-screen w-[100%] flex flex-col">
        
        <div className="p-2">
          <div className="bg-white justify-between shadow-lg rounded-lg p-4 ml-[430px] -mt-40 w-[720px] h-[350px] border-2 border-[#1C3557] scrollbar-none flex flex-col">
            <div>
            
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
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTeachersList;
