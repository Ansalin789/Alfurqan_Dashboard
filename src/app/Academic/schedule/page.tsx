'use client';

import React, { useEffect, useState } from 'react';
import BaseLayout1 from '@/components/BaseLayout1';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState<string>(''); // State to hold the selected date
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState<any[]>([]); // State to hold filtered events
  const [events, setEvents] = useState<any[]>([]); // State to store all events

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

  // Style customization for calendar events
  const eventStyleGetter = (event: any) => {
    return {
      style: {
        backgroundColor: '#B0E0E6',
        color: '#0000CD',
        borderRadius: '4px',
        padding: '3px',
        fontSize: '12px',
      },
    };
  };

  // Handle navigation (clicking on a date in the calendar)
  const handleNavigate = (date: Date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    handleDateClick(formattedDate); // Call the date click handler
  };

  return (
    <BaseLayout1>
      <div className="flex flex-col h-screen bg-gray-100">
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">December 2024</h1>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {/* Calendar */}
            <div className="col-span-3">
              <div className="bg-white p-6 rounded shadow-lg">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 600, fontSize: '12px' }}
                  views={['month', 'week', 'day']}
                  defaultView="month"
                  toolbar
                  eventPropGetter={eventStyleGetter}
                  onNavigate={handleNavigate} // Use onNavigate to handle date clicks
                />
              </div>
            </div>

            {/* List Schedule */}
            <div className="col-span-1 bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold mb-4">List Schedule</h2>
              {selectedDate && (
                <p className="mb-4">Events for {selectedDate}:</p>
              )}
              <ul className="space-y-4 max-h-96 overflow-y-auto">
                {eventsForSelectedDate.length > 0 ? (
                  eventsForSelectedDate.map((item) => (
                    <li key={item.scheduledFrom} className="border-b pb-4">
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="text-gray-600">{item.scheduledFrom} - {item.scheduledTo}</p>
                      <p className="text-gray-600">{item.course}</p>
                      <p className="text-gray-500 text-sm mt-2">{item.description}</p>
                      <p className="text-gray-500 text-sm mt-2">Teacher: {item.teacherName}</p>
                      <p className="text-gray-500 text-sm mt-2">Location: {item.meetingLocation}</p>
                      <a href={item.meetingLink} target="_blank" className="text-blue-500 underline">Join Meeting</a>
                    </li>
                  ))
                ) : (
                  <p>No events for this date.</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout1>
  );
};

export default SchedulePage;
