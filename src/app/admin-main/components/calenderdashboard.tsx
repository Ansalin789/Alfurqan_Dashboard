"use client";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import './Calendaradmin.css';

interface Event {
  title: string;
  start: Date;
  end: Date;
}

interface Teacher {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  _id: string;
}

interface Meeting {
  _id: string;
  meetingName: string;
  selectedDate: string;
  meetingStatus: string;
  description: string;
  startTime: string;
  endTime: string;
  status: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string;
  teachers: Teacher[][];
}

interface MeetingsResponse {
  message: string;
  data: {
    totalCount: number;
    meetings: Meeting[];
  };
}

const Academic: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [value, setValue] = useState<Date>(new Date());

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await fetch("http://localhost:5001/allAdminMeeting");
        const data: MeetingsResponse = await response.json();

        const mappedEvents: Event[] = data.data.meetings.map((item) => {
          const start = new Date(item.selectedDate);
          start.setHours(Number(item.startTime.split(":")[0]), Number(item.startTime.split(":")[1]));

          const end = new Date(item.selectedDate);
          end.setHours(Number(item.endTime.split(":")[0]), Number(item.endTime.split(":")[1]));

          return {
            title: item.meetingName,
            start,
            end,
          };
        });

        setEvents(mappedEvents);
        console.log("Fetched Events: ", mappedEvents);
      } catch (error) {
        console.error("Failed to fetch meetings", error);
      }
    };

    fetchMeetings();
  }, []);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    // styleSheet.textContent = styles;
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
        <div className="calendar-container rounded-[50px]">
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

// Same CSS styles below...
