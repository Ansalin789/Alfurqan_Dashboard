'use client'
import Image from 'next/image';

import { useRouter } from 'next/navigation';
import Stats from '@/components/Academic/ViewTeachersList/Stats';
import BaseLayout1 from '@/components/BaseLayout1';
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import Modal from 'react-modal';
import React, { useState, useRef, useEffect } from 'react';
import { FiCalendar, FiMoreVertical} from 'react-icons/fi';
import StudentList from '@/components/Academic/ViewTeachersList/StudentList';




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
  const [isScheduled, setIsScheduled] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('scheduled');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [studentListData, setStudentListData] = useState<StudentListData | null>(null); // Set to null initially
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



  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

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
          
          
          console.log(">>>>"+auth);
          try {
            const response = await fetch(`https://alfurqanacademy.tech/users/${teacherIdLocal}`, {

              headers: {
                'Authorization': `Bearer ${auth}`,
              },
            });
            const data = await response.json();
    
            console.log('Fetched data:', data);
               setTeachers(data);
          } catch (error) {
            console.error('Error fetching teachers:', error);
  
        }
      };
  
      fetchTeachers();
    }, []);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
   

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value; // Input time in 24-hour format
    setStartTime(time); // Store in state in 24-hour format
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value; // Input time in 24-hour format
    setEndTime(time); // Store in state in 24-hour format
  };

  // Function to format time to 12-hour format for display purposes
  const formatTimeToAmPm = (time: string) => {
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);
    const amPm = hour >= 12 ? 'PM' : 'AM';
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12; // Convert 0 to 12 for 12 AM
    return `${hour}:${minutes} ${amPm}`;
  };
  
  const calculateHoursAcrossDays = (
    startDate: string,
    startTime: string,
    endDate: string,
    endTime: string
  ): string => {
    // Parse dates
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
  
    // Calculate the number of full days (excluding the partial start and end days)
    const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
    // Calculate the duration for a single day (start to end time)
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
  
    let singleDayDuration = (endHour * 60 + endMinute - (startHour * 60 + startMinute)) / 60;
  
    // Handle cases where the end time is past midnight
    if (singleDayDuration < 0) {
      singleDayDuration += 24; // Adjust for the day rollover
    }
  
    // Total duration across multiple days
    const totalDuration = totalDays * singleDayDuration;
  
    return totalDuration.toFixed(2);
  };
  
  
const handleSave1 = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
    
    const totalDuration = calculateHoursAcrossDays(startDate, startTime, endDate, endTime);
    const formattedStartTime = formatTimeToAmPm(startTime);
    const formattedEndTime = formatTimeToAmPm(endTime);
    const payload = {
      academicCoachId: "674027a9f070ff2404c5c184",
      teacherId: teachers?._id,
      name: teachers?.userName,
      email: teachers?.email,
      role: "TEACHER",
      workhrs: totalDuration,
      startdate: startDate,
      enddate: endDate,
      fromtime:formattedStartTime,
      totime: formattedEndTime,
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: "Admin",
      lastUpdatedBy: "Admin",
    };

    try {
      const auth=localStorage.getItem('authToken');
      const response = await fetch(`https://alfurqanacademy.tech/shiftschedule`,
         {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth}`,
          },
          body: JSON.stringify(payload),
        });
      console.log('Schedule saved:', response);
      const data =await response.json();
      console.log(data);
      closeModal();
      setIsScheduled(true);
      studentlist();
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const studentlist=async()=>{
      try{
        const auth=localStorage.getItem('authToken');
           const response=await fetch(`https://alfurqanacademy.tech/shiftschedule?role=TEACHER`,{
            method:'GET',
            headers:{
              "Content-Type":"application/json",
              'Authorization': `Bearer ${auth}`,
            }}
          );
          const data=await response.json();
           console.log(data);
            setStudentListData(data);
      }catch(error){
            console.log(error);
      }
  };

  const filteredStudents: Student[] | undefined = studentListData?.users?.filter((item: User) => {
    return item.teacherId === teacherIdLocal;
  });
  
  console.log(filteredStudents);

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
                    
                    <th className="py-2 text-[13px] text-center">Date</th>
                    <th className="py-2 text-[13px]">Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                {filteredStudents?.map((item: Student, index: number) => (
              <tr key={item._id} className="border-t">
                <td className="py-1 text-[12px] text-center">{item.name}</td>
                
                <td className="py-1 text-[12px] text-center">{new Date(item.startdate).toISOString().slice(0, 10)}</td>
                
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
      <button
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={closeModal}>
        <button
          className="bg-white rounded-lg p-4 w-[300px]"
          onClick={(e) => e.stopPropagation()}
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
            <form onSubmit={handleSave1}>
              <div className="mb-2">
                <label htmlFor="title" className="block text-[12px] mb-1">Title</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border rounded-lg p-1 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="startDate" className="block text-[12px] mb-1">Start Date</label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border rounded-lg p-1 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="endDate" className="block text-[12px] mb-1">End Date</label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border rounded-lg p-1 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-2 flex space-x-2">
                <div className="w-1/2">
                  <label htmlFor="startTime" className="block text-[12px] mb-1">Start Time</label>
                  <input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={handleStartTimeChange}
                    className="w-full border rounded-lg p-1 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-1/2">
                  <label htmlFor="endTime" className="block text-[12px] mb-1">End Time</label>
                  <input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={handleEndTimeChange}
                    className="w-full border rounded-lg p-1 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
              >
                Submit Schedule
              </button>
            </form>
        </button>
      </button>
    </Modal>
    </BaseLayout1>
  );
};

export default ViewTeachersList;
