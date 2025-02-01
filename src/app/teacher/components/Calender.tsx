'use client';
import React, {useState } from 'react';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import "@/components/Academic/Calender";

interface Event {
  title: string;
  start: Date;
  end: Date;
}

// interface AcademicCoachItem {
//   subject: string;
//   scheduledStartDate: string;
//   scheduledEndDate: string;  
// }

const Calender: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [value, setValue] = useState<Date>(new Date());

  // useEffect(() => {
  //   const auth = localStorage.getItem('authToken');
  //   fetch('http://alfurqanacademy.tech:5001/meetingSchedulelist', {
  //     headers: {
  //       'Authorization': `Bearer ${auth}`,
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const mappedEvents = data.academicCoach.map((item: AcademicCoachItem) => ({
  //         title: item.subject,
  //         start: new Date(item.scheduledStartDate),
  //         end: new Date(item.scheduledEndDate),
  //       }));
  //       setEvents(mappedEvents);
  //       console.log("Fetched Events: ", mappedEvents);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching data: ', error);
  //     });
  // }, []);

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
      <a href="/teacher/ui/schedule/schedules">
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

export default Calender;
