'use client';

import React, { useEffect, useState } from 'react';
import BaseLayout1 from '@/components/BaseLayout1';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { API_URL } from '@/app/acendpoints/page';

const localizer = momentLocalizer(moment);


interface Event {
  id: string; // Example field
  name: string; // Example field
  date: string; // Example field
  [key: string]: any; // Allow additional fields if needed
}

interface AcademicCoachItem {
  subject: string;
  scheduledStartDate: string;
  scheduledEndDate: string;
  description: string;
  meetingLink: string;
  student: {
    name: string;
  };
  academicCoach: {
    name: string;
  };
  course: {
    courseName: string;
  };
  meetingLocation: string;
  scheduledFrom: string;
  scheduledTo: string;
}

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState<string>(""); // State to hold the selected date
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState<Event[]>([]); // State to hold filtered events
  const [events, setEvents] = useState<Event[]>([]); // State to store all events
 console.log(selectedDate);
  // Fetch events data
  useEffect(() => {
    const auth=localStorage.getItem('authToken');
    fetch(`${API_URL}/meetingSchedulelist`,{
      headers: {
         'Authorization': `Bearer ${auth}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const mappedEvents = data.academicCoach.map((item: AcademicCoachItem) => {
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

  

  // Handle navigation (clicking on a date in the calendar)
  const handleNavigate = (date: Date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    handleDateClick(formattedDate); // Call the date click handler
  };

  return (
    <BaseLayout1>
      <div className="flex flex-col h-screen">
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">January 2024</h1>
            
          </div>

          <div className="grid grid-cols-4 gap-6">
            {/* Updated Calendar styling */}
            <div className="col-span-3">
              <div className="bg-white p-6 rounded-lg shadow">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 550 }}
                  views={['month']}
                  defaultView="month"
                  toolbar={false}
                  onNavigate={handleNavigate}
                />
              </div>
            </div>

            {/* Updated List Schedule styling */}
            <div className="col-span-1">
              <div className="bg-white p-6 w-72 rounded-lg shadow overflow-y-scroll h-[600px] scrollbar-thin">
                <h2 className="text-[18px] font-semibold mb-6">List Schedule</h2>
                <div className="space-y-6">
                  {eventsForSelectedDate.length > 0 ? (
                    eventsForSelectedDate.map((item) => (
                      <div key={item.scheduledFrom} className="border-b pb-2">
                        <div className="flex justify-between">
                            <h3 className="font-medium text-[14px]">{item.title}</h3>
                          <span className="text-[11px] text-gray-500 text-end">{moment(item.start).format('DD MMM YYYY')}</span>
                        </div>
                        <div className="text-[12px] text-gray-500">
                          {moment(item.start).format('h:mm A')}
                        </div>
                        <p className="text-[13px] text-gray-600 mt-2">{item.description || ''}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No events scheduled</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout1>
  );
};

export default SchedulePage;
