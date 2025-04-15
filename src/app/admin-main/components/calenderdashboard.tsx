"use client";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface Event {
  title: string;
  start: Date;
  end: Date;
}

interface AcademicCoachItem {
  subject: string;
  scheduledStartDate: string;
  scheduledEndDate: string;
}

const Academic: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [value, setValue] = useState<Date>(new Date());

  useEffect(() => {
    // Hardcoded data instead of API call
    const hardcodedData = {
      academicCoach: [
        {
          subject: "Mathematics",
          scheduledStartDate: "2023-06-15T10:00:00",
          scheduledEndDate: "2023-06-15T11:00:00"
        },
        {
          subject: "Physics",
          scheduledStartDate: "2023-06-20T14:00:00",
          scheduledEndDate: "2023-06-20T15:30:00"
        },
        {
          subject: "Chemistry",
          scheduledStartDate: "2023-06-25T09:00:00",
          scheduledEndDate: "2023-06-25T10:30:00"
        }
      ]
    };

    const mappedEvents: Event[] = hardcodedData.academicCoach.map((item: AcademicCoachItem) => ({
      title: item.subject,
      start: new Date(item.scheduledStartDate),
      end: new Date(item.scheduledEndDate),
    }));
    
    setEvents(mappedEvents);
    console.log("Hardcoded Events: ", mappedEvents);
  }, []);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
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
    <div className="flex items-center justify-center">
      <div>
        <div className="calendar-container rounded-[50px] mr-10">
          <Calendar
            onChange={(newValue) => setValue(newValue as Date)}
            value={value}
            className="custom-calendar"
            navigationLabel={({ date }) =>
              `${date.toLocaleString("default", { month: "long" }).toUpperCase()}, ${date.getFullYear()}`
            }
            nextLabel="›"
            prevLabel="‹"
            next2Label={null}
            prev2Label={null}
            showNeighboringMonth={false}
            tileClassName={({ date, view }) =>
              view === "month" && isMeetingDate(date) ? "event-day" : undefined
            }
          />
        </div>
        </div>
    </div>
  );
};

export default Academic;

// CSS styles
const styles = `
.custom-calendar {
  width: 250px !important;
  border: none !important;
  background: #ced4dc !important;
}
.custom-calendar .react-calendar__navigation {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  height: auto;
  background: #ced4dc;
}
.custom-calendar .react-calendar__navigation button {
  min-width: 28px;
  background: none;
  font-size: 20px;
  color: #333;
}
.custom-calendar .react-calendar__navigation__label {
  font-weight: 500 !important;
  font-size: 13px !important;
  color: #333;
}
.custom-calendar .react-calendar__month-view__weekdays {
  font-size: 10px;
  color: #666;
  text-transform: uppercase;
}
.custom-calendar .react-calendar__month-view__weekdays__weekday {
  padding: 10px 0;
}
.custom-calendar .react-calendar__month-view__weekdays__weekday abbr {
  text-decoration: none;
  font-weight: normal;
}
.custom-calendar .react-calendar__month-view__days__day {
  font-size: 11px;
  padding: 0px;
  color: #333;
}
.custom-calendar .react-calendar__tile {
  padding: 10px 0;
  font-weight: normal;
  background: none;
}
.custom-calendar .react-calendar__month-view__days__day--weekend:last-child {
  color: #2563eb;
}
.custom-calendar .react-calendar__tile--now {
  background: #2563eb !important;
  color: white !important;
  border-radius: 4px;
}
.custom-calendar .react-calendar__tile--active {
  background: #223857 !important;
  color: white !important;
  border-radius: 4px;
}
.custom-calendar .react-calendar__tile:enabled:hover {
  background-color: #f0f0f0;
  border-radius: 4px;
}
.custom-calendar .react-calendar__month-view__days__day--neighboringMonth {
  color: #ccc;
}
.custom-calendar .react-calendar__navigation__arrow {
  font-size: 20px;
  color: #666;
}
.event-day {
  position: relative;
  color: #31517e !important;
  border-radius: 6px !important;
}
.event-day::before {
  content: "";
  position: absolute;
  top: 3px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background-color: #223857;
  border-radius: 50%;
}
`;