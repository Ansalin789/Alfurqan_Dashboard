'use client';

import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import './Calender.css'; // ✅ uses same styling
import { useRouter } from 'next/navigation';

interface TeacherMeeting {
  subject: string;
  scheduledStartDate: string;
  scheduledEndDate: string;
}

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
}

const Calender: React.FC = () => {
  const router = useRouter();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [value, setValue] = useState<Date>(new Date());

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('TeacherAuthToken') : null;

    if (!token) {
      console.error('❌ TeacherAuthToken not found');
      return;
    }

    axios
      .get('https://api.blackstoneinfomaticstech.com/meetingSchedulelist', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const mappedEvents = response.data.teacherMeeting.map((item: TeacherMeeting) => ({
          title: item.subject,
          start: new Date(item.scheduledStartDate),
          end: new Date(item.scheduledEndDate),
        }));
        setEvents(mappedEvents);
        console.log('📅 Teacher Events:', mappedEvents);
      })
      .catch((error) => {
        console.error('❌ Error fetching teacher meetings:', error);
      });
  }, []);

  const isMeetingDate = (date: Date): boolean => {
    return events.some((event) => {
      const eventStart = new Date(event.start);
      return (
        eventStart.getFullYear() === date.getFullYear() &&
        eventStart.getMonth() === date.getMonth() &&
        eventStart.getDate() === date.getDate()
      );
    });
  };

return (
  <div className="dark:bg-[#343434] w-full rounded-xl h-[280px]">
    <Calendar
      onChange={(newValue) => setValue(newValue as Date)}
      value={value}
      navigationLabel={({ date }) =>
        `${date.toLocaleString('default', { month: 'long' }).toUpperCase()}, ${date.getFullYear()}`
      }
      onClickDay={() => {
        router.push(`/teacher/meetingSchedule`);
      }}
      locale="en-GB"
      calendarType="iso8601"
      className="custom-calendar dark:bg-[#343434]"
      nextLabel="›"
      prevLabel="‹"
      next2Label={null}
      prev2Label={null}
      showNeighboringMonth={true}
      tileClassName={({ date, view }) =>
        view === 'month' && isMeetingDate(date) ? 'event-day' : undefined
      }
    />
  </div>
);


};

export default Calender;
