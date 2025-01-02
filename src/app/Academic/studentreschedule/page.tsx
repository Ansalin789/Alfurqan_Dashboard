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
  const [selectedDate, setSelectedDate] = useState<string>(''); // State to hold the selected date
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState<any[]>([]); // State to hold filtered events
  const [events, setEvents] = useState<any[]>([]); // State to store all events
  const [teachers, setTeachers] = useState<any[]>([]); // State to store teachers and their availability
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null); // State to hold selected teacher
  const [rescheduleSuccess, setRescheduleSuccess] = useState<boolean>(false); // State for success message

  // Fetch teacher schedules from the backend
  useEffect(() => {
    const auth=localStorage.getItem('authToken');
    fetch('http://localhost:5001/shiftschedule?role=TEACHER',{
      headers: {
        'Content-Type': 'application/json',
         'Authorization': `Bearer ${auth}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched teacher data:", data); // Log to check the data format
        if (Array.isArray(data.users)) {
          setTeachers(data.users); // Store teacher data in the state
        } else {
          console.error('API response is not an array:', data);
        }
      })
      .catch((error) => console.error('Error fetching data: ', error));

    // Fetch events (if required, you can add another fetch for events here)
    // fetch('http://localhost:5001/events') // Example for fetching events
    //   .then(response => response.json())
    //   .then(data => setEvents(data))
    //   .catch(error => console.error('Error fetching events: ', error));
  }, []);

  // Handle date selection from the calendar
  const handleDateClick = (date: string) => {
    setSelectedDate(date);

    // Filter events for the selected date (if required)
    const filteredEvents = events.filter((event) => event.date === date);
    setEventsForSelectedDate(filteredEvents);
  };

  const handleNavigate = (date: Date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    handleDateClick(formattedDate); // Call the date click handler
  };

  const handleTeacherSelect = (teacher: string) => {
    setSelectedTeacher(teacher);
    setRescheduleSuccess(true); // Show success message
    setTimeout(() => setRescheduleSuccess(false), 3000); // Hide after 3 seconds
  };

  // Filter available teachers for the selected date
  const getAvailableTeachers = () => {
    if (!Array.isArray(teachers)) {
      console.error('Teachers data is not an array:', teachers);
      return []; // Return an empty array if the data is not an array
    }

    return teachers.filter((teacher) => {
      const startDate = moment(teacher.startdate);
      const endDate = moment(teacher.enddate);
      const selectedMomentDate = moment(selectedDate);

      // Check if the selected date falls within the teacher's available dates
      const isDateAvailable = selectedMomentDate.isBetween(startDate, endDate, 'day', '[]');
      return isDateAvailable;
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
            {/* Updated Calendar styling */}
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
                      fontSize:'7px',
                      width:'60px'
                    },
                  })}
                  onNavigate={handleNavigate}
                />
              </div>
            </div>

            {/* Updated List Schedule styling */}
            <div className="w-full p-6 rounded-lg mt-6 lg:mt-0">
              <h2 className="text-[15px] font-semibold mb-4 text-[#012A4A]">Select your Teacher and time Slot to Reschedule your class*</h2>
              <div>
                <h3 className='pt-3 pb-4 text-[#012A4A] font-semibold'>Available Teachers</h3>
                {getAvailableTeachers().map((teacher, index) => (
                  <div key={index} className="flex items-center justify-between p-2 mb-2 bg-white shadow-lg rounded-lg cursor-pointer" onClick={() => handleTeacherSelect(teacher.name)}>
                    <div className="flex items-center">
                      <Image src={`/assets/images/alf1.png`} width={50} height={50} alt={teacher.name} className="w-8 h-8 rounded-full mr-2" />
                      <div>
                        <p className="text-[12px] font-medium">{teacher.name}</p>
                        <p className="text-[11px] text-gray-600">Level: 3</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] p-4 text-gray-600">{teacher.fromtime} to {teacher.totime}</p>
                    </div>
                  </div>
                ))}
              </div>
              {rescheduleSuccess && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                  <div className="bg-green-500 p-4 rounded-lg shadow-lg text-center flex items-center">
                    <div className="flex items-center justify-center mr-2">
                      <span className="text-white p-2 bg-green-600 rounded-full text-2xl"><FaCheck /></span>
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
