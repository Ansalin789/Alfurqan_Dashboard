'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import BaseLayout1 from '@/components/BaseLayout1';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Image from 'next/image';
import { FaCheck } from "react-icons/fa";
import { IoArrowBackCircleSharp } from 'react-icons/io5';

const localizer = momentLocalizer(moment);

const Studentreschedule = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>(''); // Selected date (YYYY-MM-DD)
  const [events, setEvents] = useState<Event[]>([]); // Calendar events from student schedules
  const [teachers, setTeachers] = useState<Teacher[]>([]); // Teacher data from API
  const [rescheduleSuccess, setRescheduleSuccess] = useState<boolean>(false); // Show success message

  // Event interface for calendar events
  interface Event {
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
  }
  
  // Teacher interface (ensure API response matches these keys)
  interface Teacher {
    teacherId: string;
    name: string;
    subject: string;
    email: string;
    startdate: string;
    enddate: string;
    fromtime: string;
    totime: string;
    [key: string]: any;
  }

  // Student interface
  interface Student {
    student: {
      studentId: string | null;
      studentFirstName: string;
      studentLastName: string;
      studentEmail: string;
    };
    startDate: string;
    endDate: string;
    package: string;
    preferedTeacher: string;
    status: string;
    totalHourse: number;
    _id: string;
  }
  
  interface StudentListResponse {
    students: Student[];
  }
  
  const [studentllistdata, setStudentllistdata] = useState<StudentListResponse | null>(null);
  const [teacherIdLocal, setTeacherIdLocal] = useState<string | null>(null);

  // Retrieve student ID from localStorage (client side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const studentId = localStorage.getItem('studentManageID');
      console.log("Student ID from localStorage:", studentId);
      setTeacherIdLocal(studentId);
    }
  }, []);

  // Fetch student schedule and teacher data from the backend
  useEffect(() => {
    // Fetch student schedule data
    const studentlist = async () => {
      try {
        const response = await fetch(`https://alfurqanacademy.tech/classShedule`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
          }
        });
        const data = await response.json();
        setStudentllistdata(data);
      } catch (error) {
        console.error("Error fetching student schedule data:", error);
      }
    };
    studentlist();

    // Fetch teacher schedule data
    fetch(`https://alfurqanacademy.tech/shiftschedule?role=TEACHER`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched teacher data:", data); // Debug teacher API response
        if (Array.isArray(data.users)) {
          setTeachers(data.users);
        } else {
          console.error('Teacher API response is not an array:', data);
        }
      })
      .catch((error) => console.error('Error fetching teacher data:', error));
  }, []);

  // Filter student schedule data based on student ID from localStorage
  const filteredStudents = studentllistdata?.students?.filter((item: { student: { studentId: string | null; }; }) => {
    return item.student?.studentId === teacherIdLocal;
  });
  

  // Map filtered student data to calendar events
  useEffect(() => {
    const studentEvents: Event[] = (filteredStudents ?? []).map((student: any) => ({
      title: `${student.student.studentFirstName} ${student.student.studentLastName}`,
      start: new Date(student.startDate),
      end: new Date(student.endDate),
      allDay: true,
    }));
  
    // ✅ Only update state if the new events are different from the current state
    setEvents((prevEvents) => {
      const isSame = JSON.stringify(prevEvents) === JSON.stringify(studentEvents);
      return isSame ? prevEvents : studentEvents;
    });
  
  }, [studentllistdata, filteredStudents]);
  // Handle date selection (from calendar navigation)
  const handleDateClick = (date: string) => {
    console.log("Selected date:", date);
    setSelectedDate(date);
  };

  // Handle calendar navigation (changes selected date)
  const handleNavigate = (date: Date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    console.log("Navigated to:", formattedDate);
    handleDateClick(formattedDate);
  };

  // When a teacher is selected, update the schedule for the selected date
  const handleTeacherSelect = async (teacherId: string, teachername: string, teacheremail: string, fromtime: string, totime: string) => {
    try {
      // Find a matching schedule for the selected date from the filtered student schedules
      const filteredItem = filteredStudents?.find((item: { startDate: string | number | Date; }) => {
        const itemStartDate = new Date(item.startDate).toISOString().split("T")[0];
        const normalizedSelectedDate = new Date(selectedDate).toISOString().split("T")[0];
        return itemStartDate === normalizedSelectedDate;
      });
      
      if (!filteredItem) {
        console.error("No matching schedule found for selected date:", selectedDate);
        return;
      }
      console.log("Filtered Item for update:", filteredItem);

      // Retrieve auth token from localStorage
      const auth = localStorage.getItem("authToken");
      if (!auth) {
        console.error("Auth token not found. Please log in.");
        return;
      }
      if (!filteredItem.student.studentFirstName || !filteredItem.student.studentLastName || !filteredItem.student.studentId) {
        console.error("Missing required student information.");
        return;
      }
    
      // Get the day name for the selected date
      const date = new Date(selectedDate);
      const dayIndex = date.getDay();
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayName = daysOfWeek[dayIndex];
      
      // Build the request data for the update
      const requestData = {
        student: {
          studentId: filteredItem.student.studentId, 
          studentFirstName: filteredItem.student.studentFirstName, 
          studentLastName: filteredItem.student.studentLastName, 
          studentEmail: filteredItem.student.studentEmail,
        },
        teacher: {
          teacherName: teachername, 
          teacherEmail: teacheremail,
        },
        classDay: [
          { value: dayName, label: dayName }
        ],
        package: filteredItem.package,
        preferedTeacher: filteredItem.preferedTeacher,
        totalHourse: filteredItem.totalHourse,
        startDate: selectedDate,
        endDate: selectedDate,
        startTime: [
          { value: fromtime, label: "Start Time" }
        ],
        endTime: [
          { value: totime, label: "End Time" }
        ],
        scheduleStatus: 'Active',
        createdBy: "Admin",
        createdDate: new Date().toISOString(),
        lastUpdatedDate: new Date().toISOString(),
        status: filteredItem.status,
      };

      console.log("Request Data for rescheduling:", requestData);
      console.log("Updating schedule with ID:", filteredItem._id);

      // Make the API call to update the schedule
      const response = await fetch(`https://alfurqanacademy.tech/classSchedule/${filteredItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update schedule: ${response.statusText}`);
      }
       
      console.log("Schedule updated successfully.");
      const data = await response.json();
      console.log("Response Data:", data);
      setRescheduleSuccess(true);
      setTimeout(() => setRescheduleSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  // Filter available teachers based on the selected date and their availability
  const getAvailableTeachers = () => {
    return teachers.filter((teacher) => {
      const startDate = moment(teacher.startdate, "YYYY-MM-DD");
      const endDate = moment(teacher.enddate, "YYYY-MM-DD");
      const selectedMomentDate = moment(selectedDate, "YYYY-MM-DD");
      const isAvailable = selectedMomentDate.isBetween(startDate, endDate, "day", "[]");
      return isAvailable;
    });
  };
  
  

  return (
    <BaseLayout1>
      <div className="flex flex-col h-screen relative">
        <div className="flex-1">
          <div className="p-2">
            <IoArrowBackCircleSharp
              className="text-[25px] bg-[#fff] rounded-full text-[#012a4a] cursor-pointer"
              onClick={() => router.push('managestudentview')}
            />
          </div>
          <div className="mb-4">
            <h1 className="text-[30px] mb-2 text-[#012A4A] font-bold">Reschedule Class</h1>
            <p className='text-[12px] text-[#012A4A] font-bold'>Pick a Date to Reschedule your class*</p>
          </div>
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-3">
              <div className="bg-white p-4 rounded-lg shadow">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 550 }}
                  views={['month']}
                  defaultView="month"
                  toolbar={false}
                  eventPropGetter={(event) => ({
                    style: {
                      backgroundColor: '#E9EBFF',
                      color: '#012A4A',
                      borderRadius: '4px',
                      padding: '2px 4px',
                      fontSize: '7px',
                      width: '60px'
                    },
                  })}
                  onNavigate={handleNavigate}
                />
              </div>
            </div>
            <div className="w-full p-6 rounded-lg mt-6 lg:mt-0">
              <h2 className="text-[15px] font-semibold mb-4 text-[#012A4A]">
                Select your Teacher and time Slot to Reschedule your class*
              </h2>
              <div>
                <h3 className="pt-3 pb-4 text-[#012A4A] font-semibold">Available Teachers</h3>
                <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                  {getAvailableTeachers().map((teacher) => (
                    <button
                      key={teacher.teacherId}
                      className="flex items-center justify-between p-2 mb-2 bg-white shadow-lg rounded-lg cursor-pointer"
                      onClick={() => handleTeacherSelect(teacher.teacherId, teacher.name, teacher.email, teacher.fromtime, teacher.totime)}
                    >
                      <div className="flex items-center">
                        <Image
                          src={`/assets/images/alf1.png`}
                          width={50}
                          height={50}
                          alt={teacher.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <div>
                          <p className="text-[12px] font-medium">{teacher.name}</p>
                          <p className="text-[11px] text-gray-600">Level: 3</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] p-4 text-gray-600">
                          {teacher.fromtime} to {teacher.totime}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              {rescheduleSuccess && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                  <div className="bg-green-500 p-4 rounded-lg shadow-lg text-center flex items-center">
                    <div className="flex items-center justify-center mr-2">
                      <span className="text-white p-2 bg-green-600 rounded-full text-2xl">
                        <FaCheck />
                      </span>
                    </div>
                    <p className="text-white font-semibold">Class Rescheduled successfully</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout1>
  );
};

export default Studentreschedule;
