'use client'

import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';


const localizer = momentLocalizer(moment);

const ScheduleCalender: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);

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
          };
        });
        setEvents(mappedEvents);
      })
      .catch((error) => console.error('Error fetching data: ', error));
  }, []);
  const eventStyleGetter = (event: any) => {
    return {
      style: {
        backgroundColor:'#B0E0E6',
        color: '#0000CD',
        borderRadius: '4px',
        padding: '3px',
        fontSize: '12px', 
      },
    };
  };

  return (
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
      />
    </div>
  );
};

export default ScheduleCalender;
