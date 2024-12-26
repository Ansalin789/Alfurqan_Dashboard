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
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null); // State to hold selected teacher
  const [rescheduleSuccess, setRescheduleSuccess] = useState<boolean>(false); // State for success message

  // Fetch events data
  useEffect(() => {
    fetch('http://localhost:5001/meetingSchedulelist')
      .then((response) => response.json())
      .then((data) => {
        const mappedEvents = data.academicCoach.map((item: any) => {
          return {
            title: item.subject,
            start: new Date(item.scheduledStartDate), // Start Date
            end: new Date(item.scheduledEndDate), // End Date
            allDay: false,
            description: item.description,
            meetingLink: item.meetingLink,
            studentName: item.student.name,
            teacherName: item.academicCoach.name,
            course: item.course.courseName,
            meetingLocation: item.meetingLocation,
            scheduledFrom: item.scheduledFrom,
            scheduledTo: item.scheduledTo,
            date: moment(item.scheduledStartDate).format('YYYY-MM-DD'), // Format the date for comparison
          };
        });
        setEvents(mappedEvents);
      })
      .catch((error) => console.error('Error fetching data: ', error));
  }, []);

  // Handle date selection from the calendar
  const handleDateClick = (date: string) => {
    setSelectedDate(date);

    // Clear the previous events and filter new events based on the selected date
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
          <div className=" mb-4">
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
              {['Zayn Wills', 'Flynn Parker', 'Fesco James', 'Raphinya', 'Neymar Jr'].map((teacher, index) => (
                <div key={index} className="flex items-center justify-between p-2 mb-2 bg-white shadow-lg rounded-lg cursor-pointer" onClick={() => handleTeacherSelect(teacher)}>
                  <div className="flex items-center">
                    <Image src={`/assets/images/alf1.png`} width={50} height={50} alt={teacher} className="w-8 h-8 rounded-full mr-2" />
                    <div>
                      <p className="text-[12px] font-medium">{teacher}</p>
                      <p className="text-[11px] text-gray-600">Level: 3</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] p-4 text-gray-600">9.00 Am to 11.00 Am </p>
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






















