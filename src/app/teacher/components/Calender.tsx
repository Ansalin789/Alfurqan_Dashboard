'use client';
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import axios from 'axios';
import "./Calender.css";
 

// Rename Event interface to avoid conflicts
interface ClassEvent {
  student: {
    studentId: string;
    studentFirstName: string;
    studentLastName: string;
    studentEmail: string;
  };
  teacher: {
    teacherId: string;
    teacherName: string;
    teacherEmail: string;
  };
  _id: string;
  classDay: string[];
  package: string;
  preferedTeacher: string;
  totalHours: number;
  startDate: string;
  endDate: string;
  startTime: string[];
  endTime: string[];
  scheduleStatus: string;
  status: string;
  createdBy: string;
  createdDate: string;
  lastUpdatedDate: string;
  __v: number;
}

// API Response Interface
interface ApiResponse {
  totalCount: number;
  classSchedule: ClassEvent[];
}

const Calender: React.FC = () => {
  const [events, setEvents] = useState<{ title: string; startDate: Date; endDate: Date }[]>([]);
  const [value, setValue] = useState<Date>(new Date());

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const teacherId = localStorage.getItem('TeacherPortalId');
       

        const response = await axios.get<ApiResponse>('https://alfurqanacademy.tech/classShedule/teacher', {
          params: { teacherId: teacherId },
        });

        // ✅ Correct Mapping (Use `classSchedule`, not `teacher.map`)
        const mappedEvents = response.data.classSchedule.map((classItem) => ({
          title: `${classItem.package} - ${classItem.teacher.teacherName}`, // Event title
          startDate: new Date(classItem.startDate),
          endDate: new Date(classItem.endDate),
        }));

        setEvents(mappedEvents);
        console.log("Fetched Events: ", mappedEvents);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchEvents();
  }, []);

  const isMeetingDate = (date: Date) => {
    return events.some((event) => {
      const eventStart = new Date(event.startDate);
      return (
        eventStart.getFullYear() === date.getFullYear() &&
        eventStart.getMonth() === date.getMonth() &&
        eventStart.getDate() === date.getDate()
      );
    });
  };

  return (
    <div className="flex items-center justify-center mt-12">
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
    </div>
  );
};

export default Calender;
