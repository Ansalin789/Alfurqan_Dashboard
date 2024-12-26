'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Image from 'next/image';
import { FaCheck } from "react-icons/fa";
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import BaseLayout1 from '@/components/BaseLayout1';



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
          <div className=" mb-4">
            <h1 className="text-[30px] mb-2 text-[#012A4A] font-bold">Reschedule Class</h1>
            <p className='text-[12px] text-[#012A4A] font-bold'>Pick a Date to Reschedule your class*</p>
            
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Updated Calendar styling */}
            <div className="col-span-12">
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
          </div>
        </div>
      </div>
    </ BaseLayout1>
  );
};

export default Studentreschedule;






















