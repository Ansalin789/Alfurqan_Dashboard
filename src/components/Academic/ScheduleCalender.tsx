'use client'

import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const events = [
  {
    title: 'Evaluation Class',
    start: new Date(2024, 0, 1),
    end: new Date(2024, 0, 1),
    allDay: true,
  },
  {
    title: 'Meeting',
    start: new Date(2024, 0, 17, 10, 0),
    end: new Date(2024, 0, 17, 12, 0),
  },
  {
    title: 'To-do Task',
    start: new Date(2024, 0, 2, 14, 0),
    end: new Date(2024, 0, 2, 16, 0),
  },
  // Add more events here
];

const ScheduleCalender: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded shadow-lg">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        views={['month', 'week', 'day']}
        defaultView="month"
        toolbar
      />
    </div>
  );
};

export default ScheduleCalender;
