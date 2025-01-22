'use client';

import { useRouter } from 'next/navigation';
import BaseLayout1 from '@/components/BaseLayout1';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import { FiCalendar, FiMoreVertical } from 'react-icons/fi';
import { API_URL } from '@/app/acendpoints/page';

const ManageStudentView = () => {
  const router = useRouter();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [activeTab, setActiveTab] = useState('scheduled');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLTableCellElement | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
 const [studentData, setStudentData] = useState<StudentData>();
 interface StudentData {
  studentDetails: {
    _id: string;
    student: {
      studentId: string;
      studentEmail: string;
      studentPhone: number;
    };
    username: string;
    password: string;
    role: string;
    status: string;
    createdDate: string;
    createdBy: string;
    updatedDate: string;
    __v: number;
  };
  studentEvaluationDetails: {
    student: {
      studentId: string;
      studentFirstName: string;
      studentLastName: string;
      studentEmail: string;
      studentPhone: number;
      studentCountry: string;
      studentCountryCode: string;
      learningInterest: string;
      numberOfStudents: number;
      preferredTeacher: string;
      preferredFromTime: string;
      preferredToTime: string;
      timeZone: string;
      referralSource: string;
      preferredDate: string;
      evaluationStatus: string;
      status: string;
      createdDate: string;
      createdBy: string;
    };
    subscription: {
      subscriptionName: string;
    };
    _id: string;
    isLanguageLevel: boolean;
    languageLevel: string;
    isReadingLevel: boolean;
    readingLevel: string;
    isGrammarLevel: boolean;
    grammarLevel: string;
    hours: number;
    planTotalPrice: number;
    classStartDate: string;
    classEndDate: string;
    classStartTime: string;
    classEndTime: string;
    accomplishmentTime: string;
    studentRate: number;
    gardianName: string;
    gardianEmail: string;
    gardianPhone: string;
    gardianCity: string;
    gardianCountry: string;
    gardianTimeZone: string;
    gardianLanguage: string;
    assignedTeacher: string;
    studentStatus: string;
    classStatus: string;
    comments: string;
    trialClassStatus: string;
    invoiceStatus: string;
    paymentLink: string;
    paymentStatus: string;
    status: string;
    createdDate: string;
    createdBy: string;
    updatedDate: string;
    updatedBy: string;
    expectedFinishingDate: number;
    assignedTeacherId: string;
    assignedTeacherEmail: string;
    __v: number;
  };
}interface Teacher {
    _id: string;
    userName: string;
    email: string;
    password: string;
    role: string[]; // Array of roles, e.g., "TEACHER"
    profileImage: string | null; // Could be a URL or null
    status: string; // Active/Inactive status
    createdBy: string; // Who created the record
    lastUpdatedBy: string; // Who last updated the record
    userId: string; // Unique ID for the user
    lastLoginDate: string; // Last login timestamp
    createdDate: string; // Creation timestamp
    lastUpdatedDate: string; // Last update timestamp
}
  useEffect(()=>{
    const studentId=localStorage.getItem('studentManageID');
    console.log(">>>>>",studentId);
    if (studentId) {
      const fetchData = async () => {
        try {
          const auth=localStorage.getItem('authToken');
          const response = await fetch(`${API_URL}/alstudents/${studentId}`,
            {
              headers: {
                     'Authorization': `Bearer ${auth}`,
              },
            });
          const data = await response.json();
          setStudentData(data);
          console.log(data);
        } catch (error) {
          console.error('Error fetching student data:', error);
        }
      };
      fetchData();
    }
          const fetchTeachers = async () => {
            try {
              const auth=localStorage.getItem('authToken');
              const response = await fetch(`${API_URL}/users?role=TEACHER`, {

                headers: {
                       'Authorization': `Bearer ${auth}`,
                },
              });
              const data = await response.json();
      
              console.log('Fetched data:', data);
      
              // Access `users` array in the response
              if (data && Array.isArray(data.users)) {
                setTeachers(data.users);
              } else {
                console.error('Unexpected API response structure:', data);
              }
            } catch (error) {
              console.error('Error fetching teachers:', error);}
            }
            fetchTeachers();
  },[]);
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  
  
  const scheduledClasses = Array.from({ length: 5 }).map(() => ({
    name: 'Samantha William',
    course: 'Tajweed Masterclass',
    date: 'January 2, 2020',
    status: 'Scheduled',
  }));
  
  const completedClasses = Array.from({ length: 50 }).map(() => ({
    name: 'John Smith',
    course: 'Advanced Quran Reading',
    date: 'December 15, 2023',
    status: 'Completed',
    grade: 'A',
    performance: '95%',
  }));
  

  

  const totalPages = Math.ceil(
    (activeTab === 'scheduled' ? scheduledClasses.length : completedClasses.length) / itemsPerPage
  );

  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleReschedule = (event: React.MouseEvent) => {
    event.stopPropagation();
    console.log("Navigating to reschedule page");
    router.push('/Academic/studentreschedule');
   
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

  const [schedule, setSchedule] = useState(
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => ({
      day,
      startTime: "",
      duration: "", // Initial duration in hours from API
      endTime: "",
      isSelected: false, // Track if the day is selected
    }))
  );

  useEffect(() => {
    if (studentData?.studentEvaluationDetails?.accomplishmentTime) {
      setSchedule((prevSchedule) =>
        prevSchedule.map((item) => ({
          ...item,
          duration: studentData.studentEvaluationDetails.accomplishmentTime,
        }))
      );
    }
  }, [studentData]);

  const handleStartTimeChange = (index:number, newStartTime:string) => {
    const updatedSchedule = [...schedule];

    // Set the start time for the selected day
    updatedSchedule[index].startTime = newStartTime;
    updatedSchedule[index].isSelected = true; // Mark as selected

    // Calculate the end time based on the start time and duration
    const [hours, minutes] = newStartTime.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(hours);
    startDate.setMinutes(minutes);

    // Calculate the end time by adding the duration in hours (converted to minutes)
    const endDate = new Date(startDate.getTime());
    endDate.setMinutes(startDate.getMinutes() + 30); // Adding 30 minutes
    updatedSchedule[index].endTime = endDate.toTimeString().slice(0, 5);

    // Reduce duration by 30 minutes (0.5 hours) for all subsequent selected days (below the selected index)
    for (let i = index + 1; i < updatedSchedule.length; i++) {
      if (!updatedSchedule[i].isSelected) {
        // Ensure 'duration' is treated as a number
        updatedSchedule[i].duration = Math.max(0, (Number(updatedSchedule[i].duration) - 0.25)).toString(); // Convert to number before performing arithmetic
      }
    }
    

    // Update the schedule
    setSchedule(updatedSchedule);
  };

  const handleCheckboxChange = (index: number) => {
    const updatedSchedule = [...schedule];
    
    // Toggle selection of the day
    updatedSchedule[index].isSelected = !updatedSchedule[index].isSelected;
    
    // Reset the duration when unselected
    // if (!updatedSchedule[index].isSelected) {
    //   updatedSchedule[index].duration = defaultDuration; // Reset to default duration
    // }
    setSchedule(updatedSchedule);
  };
    
  // Constructing the final request data with the necessary format
  const requestData = {
    classDay: schedule.filter(item => item.isSelected).map(item => ({
      label: item.day,
      value: item.day,
    })),
    startTime: schedule.filter(item => item.isSelected).map(item => ({
      label: item.startTime,
      value: item.startTime,
    })),
    endTime: schedule.filter(item => item.isSelected).map(item => ({
      label: item.endTime,
      value: item.endTime,
    })),
    student: {
      studentId: studentData?.studentEvaluationDetails?.student?.studentId ?? '',
      studentFirstName: studentData?.studentEvaluationDetails?.student?.studentFirstName ?? '',
      studentLastName: studentData?.studentEvaluationDetails?.student?.studentLastName ?? '',
      studentEmail: studentData?.studentEvaluationDetails?.student?.studentEmail ?? '',
    },
    package: studentData?.studentEvaluationDetails?.subscription?.subscriptionName ?? '', 
    teacher: {
      teacherName: studentData?.studentEvaluationDetails?.assignedTeacher ?? '',
      teacherEmail: studentData?.studentEvaluationDetails?.assignedTeacherEmail ?? '',
    },
    preferedTeacher: studentData?.studentEvaluationDetails?.student?.preferredTeacher ?? '', 
    course: studentData?.studentEvaluationDetails?.student?.learningInterest ?? '', 
    totalHourse: Number(studentData?.studentEvaluationDetails?.accomplishmentTime) || 0,
    startDate: studentData?.studentDetails?.createdDate ? new Date(studentData.studentDetails.createdDate).toISOString().slice(0, 10) : '',
    endDate: studentData?.studentDetails?.createdDate
      ? (() => {
          const date = new Date(studentData.studentDetails.createdDate);
          date.setDate(date.getDate() + 28);
          return date.toISOString().slice(0, 10);
        })()
      : '',
    scheduleStatus: 'Active',
  };
 
  
  interface Teacher {
    teacherName: string;
    teacherEmail: string;
  }
  
 
  const sendDataToAPI = async (): Promise<void> => {
    console.log(requestData);
    const studentId=localStorage.getItem('studentManageID')
    console.log(studentId);
    if (!studentId) {
      console.error("Error: Student ID is missing.");
      return;
    }
    try {
      const auth=localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/createclassschedule/${studentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${auth}`,
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        // If the server responds but status is not OK
        const errorDetails = await response.text(); // Read the response for debugging
        throw new Error(`Failed to send data: ${response.status} - ${errorDetails}`);
      }
  
      // Parse the response JSON
      const responseData = await response.json();
      console.log("Success:", responseData);
        
      setIsScheduled(true);
    closeModal();
    studentlist();
    } catch (error) {
      // Handle errors from fetch or thrown by your code
      console.error("Error:", error);
    }
  };
  interface StudentListData {
    students: {
      student: {
        studentId: string;
        studentFirstName: string;
        studentLastName: string;
        studentEmail: string;
      };
      teacher: {
        teacherId: string;
        teacherName: string;
        teacherEmail: string;
      };
      _id: string;
      schedule: {
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
      };
      __v: number;
    }[];
  }
  interface FilteredStudentItem {
    student: {
      studentId: string;
      studentFirstName: string;
      studentLastName?: string; // Optional if not used
      studentEmail?: string;    // Optional if not used
    };
    teacher?: {
      teacherId: string;
      teacherName: string;
      teacherEmail?: string;    // Optional if not used
    };
    _id?: string;               // Optional if not used
    schedule?: object;          // Add specific properties if required
    __v?: number;               // Optional if not used
    createdDate: string;        // Must be present
    status: string;             // Must be present
  }
  
  
  
  const [studentllistdata, setStudentllistdata]=useState<StudentListData>();
  const studentlist=async()=>{
      try{
        const auth=localStorage.getItem('authToken');
           const response=await fetch(`${API_URL}/classShedule`,{
            method:'GET',
            headers:{
              "Content-Type":"application/json",
              'Authorization': `Bearer ${auth}`,
            }}
          );
          const data=await response.json();
           console.log(">>>>>>>>"+data);
            setStudentllistdata(data);
      }catch(error){
            console.log(error);
      }
  };
  
  const [studentIdLocal, setStudentIdLocal] = useState<string | null>(null);
  const [auth, setAuth] = useState<string | null>(null);
  useEffect(() => {
    // Access localStorage only on the client side
    if (typeof window !== "undefined") {
      const studentId = localStorage.getItem('studentManageID');
      setStudentIdLocal(studentId); 
       const seauth=localStorage.getItem('authToken');
       setAuth(seauth);
    }
  }, []);
  // Declare and initialize filteredStudents first
  const filteredStudents = studentllistdata?.students?.filter(
    (item: { student: { studentId: string | null } }) => {
      return item.student?.studentId === studentIdLocal;
    }
  );
  
  // Then cast it to the appropriate type
  const typedFilteredStudents = filteredStudents as FilteredStudentItem[];
  
  console.log(filteredStudents);
  
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
            
            <div className="justify-center">
              <Image
                src="/assets/images/proff.jpg"
                alt="Profile"
                className="rounded-full justify-center align-middle text-center ml-20 w-24 h-24 mb-4 mt-[45px]"
                width={150}
                height={150}
              />
            </div>
            <div className="justify-center text-center border border-b-black">
              <h2 className="text-2xl font-semibold mb-2">{studentData?.studentEvaluationDetails?.student?.studentFirstName ?? "" }</h2>
              <p className="text-gray-500 mb-4">Student</p>
            </div>

            <div className="text-left w-full p-2 pt-6">
              <h3 className="font-semibold mb-2">Personal Info</h3>
              <p className="text-gray-800 text-[14px] mb-1">
                <span className="font-semibold text-[14px]">Full Name: </span>{studentData?.studentEvaluationDetails?.student?.studentFirstName}
              </p>
              <p className="text-gray-800 text-[14px] mb-1">
                <span className="font-semibold text-[14px]">Email: </span>{studentData?.studentEvaluationDetails?.student?.studentEmail}
              </p>
              <p className="text-gray-800 text-[13px] mb-1">
                <span className="font-semibold text-[14px]">Phone Number: </span>{studentData?.studentEvaluationDetails?.student?.studentPhone}
              </p>
              <p className="text-gray-800 text-[14px] mb-1">
                <span className="font-semibold text-[14px]">Level: </span>1
              </p>
              <p className="text-gray-800 text-[14px] mb-1">
                <span className="font-semibold text-[14px]">Package: </span>{studentData?.studentEvaluationDetails?.subscription?.subscriptionName}
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
              <div className="bg-white shadow-lg rounded-lg p-4 -ml-20 mb-10 overflow-y-scroll h-[350px] scrollbar-hide">
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

      {typedFilteredStudents?.map((item: FilteredStudentItem, index: number) => (
          <tr key={item.student.studentId} className="border-t">
            <td className="py-1 text-[12px] text-center">{item.student.studentFirstName}</td>
            <td className="py-1 text-[12px] text-center">{studentData?.studentEvaluationDetails?.student?.learningInterest}</td>
            <td className="py-1 text-[12px] text-center">{new Date(item.createdDate).toISOString().slice(0, 10)}</td>
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
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
                >
                  <div className="py-1">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleReschedule}
                    >
                      Reschedule
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setActiveDropdown(null);
                      }}
                    >
                      Pause Class
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setActiveDropdown(null);
                      }}
                    >
                      Resume Class
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
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

                <div className="flex justify-between items-center mt-1">
                  <span className='text-[11px]'>
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
        <div className="bg-white rounded-lg p-6 w-[900px] h-[500px] overflow-auto">
          <h2 className="text-xl font-semibold mb-4">Schedule Classes</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
            {schedule.map((item, index) => (
        <div key={item.day} className="flex items-center mb-2 w-96">
          <div className="flex items-center border-1 p-2 rounded-xl border border-[#D4D6D9] bg-[#f7f7f8] w-60 justify-between">
            <label className="block font-medium text-[#333B4C] rounded-xl text-[11px]">
              {item.day}
            </label>
            <input
              type="checkbox"
              className="form-checkbox border border-[#D4D6D9] bg-[#f7f7f8] mr-2 rounded-2xl text-[11px]"
              checked={item.isSelected}
              onChange={() => handleCheckboxChange(index)} // Trigger selection when checkbox is clicked
            />
          </div>
          <input
            type="time"
            className="form-input w-[100px] p-2 border border-[#D4D6D9] bg-[#f7f7f8] rounded-xl text-[11px] ml-4"
            value={item.startTime}
            onChange={(e) => handleStartTimeChange(index, e.target.value)}
            // Disable start time input if day is selected
          />
          
          {/* Display the duration only if the day is selected */}
          
              <input
                type="number"
                className="form-input w-[100px] text-center ml-4 text-[11px] p-2 border border-[#D4D6D9] bg-[#f7f7f8] text-[#333B4C] rounded-xl"
                value={item.duration} // Display duration as a floating-point number (in hours)
                readOnly
              />
            
        </div>
      ))}
            </div>
            <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
                <label htmlFor="select Package" className="block font-medium text-gray-700 text-[12px]">Select Package</label>
                <input type="text" className="form-input w-full text-[11px] border border-[#D4D6D9] bg-[#f7f7f8] p-2 rounded-xl" value={studentData?.studentEvaluationDetails?.subscription?.subscriptionName}  readOnly/>
              </div>
              <div className="col-span-2">
                <label htmlFor="total hous"className="block font-medium text-[13px] text-gray-700">Total Hours</label>
                <input type="number" className="form-input w-full border border-[#D4D6D9] bg-[#f7f7f8] p-2 rounded-xl text-[12px]" value={studentData?.studentEvaluationDetails?.accomplishmentTime}  readOnly/>
              </div>
              <div className="col-span-2">
                <label htmlFor='ucvuy' className="block font-medium text-[13px] text-gray-700">Preferred Teacher</label>
                <input type="text" className="form-input w-full text-[11px] border border-[#D4D6D9] bg-[#f7f7f8] p-2 rounded-xl" value={studentData?.studentEvaluationDetails?.student?.preferredTeacher}  readOnly/>
              </div>
              <div className="col-span-2">
                <label htmlFor='ucvuy1' className="block font-medium text[13px] text-gray-700">Course</label>
                <input type="text" className="form-input w-full text-[11px] border border-[#D4D6D9] bg-[#f7f7f8] p-2 rounded-xl" value={studentData?.studentEvaluationDetails?.student?.learningInterest}  readOnly/>
              </div>
              <div className="col-span-2">
                     <label htmlFor="start date" className="block font-medium text-gray-700 text-[12px]">Start Date</label>
                             <input
                       type="text"
                    className="form-input w-full text-[11px] border border-[#D4D6D9] bg-[#f7f7f8] p-2 rounded-xl"
                             value={
                            studentData?.studentDetails?.createdDate
                         ? new Date(studentData.studentDetails.createdDate).toISOString().slice(0, 10) // Extract YYYY-MM-DD
                                  : "Invalid Date" // Fallback if createdDate is invalid or missing
                                      }
                                   readOnly
                                     />
                                   </div>
                             <div className="col-span-2">
                                 <label htmlFor='end date' className="block font-medium text-gray-700 text-[12px]">End Date</label>
                                 <input
                         type="text"
  className="form-input w-full text-[11px] border border-[#D4D6D9] bg-[#f7f7f8] p-2 rounded-xl"
  value={
    studentData?.studentDetails?.createdDate
      ? (() => {
          const date = new Date(studentData.studentDetails.createdDate);
          date.setDate(date.getDate() + 28); // Add 28 days
          return date.toISOString().slice(0, 10); // Format as YYYY-MM-DD
        })()
      : "N/A" // Fallback if createdDate is invalid or missing
  }
  readOnly
/>
                          </div>

                          <div className="col-span-2">
                     <label htmlFor='start time' className="block font-medium text-gray-700 text-[12px]">Start Time</label>
                       <input
                     type="time"
                         className="form-input w-full text-[11px] border border-[#D4D6D9] bg-[#f7f7f8] p-2 rounded-xl"
                        defaultValue="09:00" // Set default start time to 09:00
                        disabled={schedule.some(item => item.isSelected)}
                         />
                        </div>
                     <div className="col-span-2">
                         <label htmlFor='end time' className="block font-medium text-gray-700 text-[12px]">End Time</label>
                           <input
                        type="time"
                           className="form-input w-full text-[11px] border border-[#D4D6D9] bg-[#f7f7f8] p-2 rounded-xl"
              defaultValue="09:30" // Set default end time to 09:30
              disabled={schedule.some(item => item.isSelected)}
                 />
                  </div>

              <div className="col-span-2">
                <label htmlFor='select tetacher' className="block font-medium text-gray-700 text-[12px]">SelectTeacher</label>
                <select className="form-select w-full text-[12px] border border-[#D4D6D9] bg-[#f7f7f8] p-2 rounded-xl" onChange={(e)=>e.target.selectedOptions}>
                 {teachers.map((teacher) => (
                     <option key={teacher.userId} value={teacher.userId}>
                      {teacher.userName}
                      </option>
                         ))}
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
              onClick={sendDataToAPI}
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