'use client';
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";

interface Event {
  title: string;
  start: Date;
  end: Date;
}

const Academic: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [value, setValue] = useState<Date>(new Date());

  useEffect(() => {
    fetch('http://localhost:5001/meetingSchedulelist')
      .then((response) => response.json())
      .then((data) => {
        const mappedEvents = data.academicCoach.map((item: any) => ({
          title: item.subject,
          start: new Date(item.scheduledStartDate),
          end: new Date(item.scheduledEndDate),
        }));
        setEvents(mappedEvents);
        console.log("Fetched Events: ", mappedEvents);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  const isMeetingDate = (date: Date) => {
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
    <div className="flex items-center justify-center mt-12">
      <a href="/Academic/schedule">
        <div className="calendar-container rounded-[50px] -ml-28">
        <Calendar
          onChange={(newValue) => setValue(newValue as Date)}
          value={value}
          className="custom-calendar"
          navigationLabel={({ date }) =>
            `${date.toLocaleString('default', { month: 'long' }).toUpperCase()}, ${date.getFullYear()}`
          }
          nextLabel="›"
          prevLabel="‹"
          next2Label={null}
          prev2Label={null}
          showNeighboringMonth={false}
          tileClassName={({ date, view }) =>
            view === 'month' && isMeetingDate(date) ? 'event-day' : undefined
          }
        />
        </div>
      </a>
    </div>
  );
};

export default Academic;


