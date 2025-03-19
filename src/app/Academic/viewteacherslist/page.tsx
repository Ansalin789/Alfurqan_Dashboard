'use client'
import Image from 'next/image';

import { useRouter } from 'next/navigation';
import Stats from '@/components/Academic/ViewTeachersList/Stats';
import BaseLayout1 from '@/components/BaseLayout1';
import { IoArrowBackCircleSharp } from 'react-icons/io5';

import React, { useState, useRef, useEffect } from 'react';
import { FiCalendar, FiMoreVertical} from 'react-icons/fi';
import StudentList from '@/components/Academic/ViewTeachersList/StudentList';
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
  startdate: string; // or Date if it's a Date object
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
  startdate: string; // or a Date object, based on your data type
  // assuming this field links student to teacher
}

interface StudentListData {
  users: User[]; // Array of User objects
  status: string;
}

const ViewTeachersList= () => {

  const router = useRouter();
  const [activeTab, setActiveTab] = useState('scheduled');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [studentListData, setStudentListData] = useState<Schedule[] | null>(null); // Set to null initially
  const dropdownRef = useRef<HTMLTableCellElement | null>(null); // Use HTMLTableCellElement instead


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
    _id:string;
    userId: string;
    userName: string;
    email: string;
    profileImage?: string | null;
    level: string;
    subject: string;
    rating: number;
  }
 const [teacherIdLocal, setTeacherIdLocal] = useState<string | null>(null);
 console.log(teacherIdLocal);
   const [auth, setAuth] = useState<string | null>(null);
   useEffect(() => {
     // Access localStorage only on the client side
     if (typeof window !== "undefined") {
      const teacherId=localStorage.getItem('manageTeacherId');
       setTeacherIdLocal(teacherId); 
        const seauth=localStorage.getItem('authToken');
        setAuth(seauth);
     }
   }, []);
   // Declare and initialize filteredStudents first
  
  const [teachers, setTeachers] = useState<Teacher>();
  useEffect(() => {
        const fetchTeachers = async () => {
          
          const teacherId=localStorage.getItem('manageTeacherId');
          console.log(">>>>"+auth);
          try {
            const response = await fetch(`https://alfurqanacademy.tech/users/${teacherId}`);
            const data = await response.json();
    
            console.log('Fetched data:', data);
               setTeachers(data);
          } catch (error) {
            console.error('Error fetching teachers:', error);
  
        }
      };
     studentlist();
      fetchTeachers();
    }, []);
  
  const studentlist=async()=>{
      try{
        const teacherId=localStorage.getItem('manageTeacherId');
        const response = await axios.get<ApiResponse>("https://alfurqanacademy.tech/classShedule");

        const filteredData = response.data.students.filter(
          (item:any) => item.teacher.teacherId === teacherId
        );
           console.log(filteredData);
            setStudentListData(filteredData);
      }catch(error){
            console.log(error);
      }
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
                    width={96} // Updated size to match the image
                    height={96} // Updated size to match the image
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
      <div className="mt-28">
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
                    
                    <th className="py-2 text-[13px] text-center">Date</th>
                    <th className="py-2 text-[13px]">Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                {studentListData?.map((item: Schedule, index: number) => (
              <tr key={item._id} className="border-t">
                <td className="py-1 text-[12px] text-center">{item.student.studentFirstName}</td>
                
                <td className="py-1 text-[12px] text-center">{new Date(item.startDate).toISOString().slice(0, 10)}</td>
                
                <td className="py-1 text-center">
                  <button 
                    className={`px-4 py-1 rounded-lg text-[12px] text-center ${
                      item.status === 'Completed' ? 'bg-green-600' : 'bg-gray-900'
                    } text-white`}
                  >
                    Active
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
      </div>
    </div>
    
    </BaseLayout1>
  );
};

export default ViewTeachersList;
