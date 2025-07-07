'use client';

import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import './Calender.css';
import { useRouter } from 'next/navigation';

interface ClassEvent {
  _id: string;
  package: string;
  startDate: string;
  endDate: string;
  startTime: string[];
  endTime: string[];
  sessionClassType: string; // Using the correct field from your backend
  teacher: {
    teacherId: string;
    teacherName: string;
    teacherEmail: string;
  };
}

interface ApiResponse {
  totalCount: number;
  classSchedule: ClassEvent[];
}

const Calender: React.FC = () => {
  const [classEvents, setClassEvents] = useState<ClassEvent[]>([]);
  const [value, setValue] = useState<Date>(new Date());
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const teacherId = localStorage.getItem('TeacherPortalId');
      const token = localStorage.getItem('TeacherAuthToken');

      if (!teacherId || !token) {
        console.error('❌ TeacherPortalId or AuthToken not found');
        return;
      }

      try {
        const response = await axios.get<ApiResponse>(
          'https://api.blackstoneinfomaticstech.com/classShedule/teacher',
          {
            params: { teacherId },
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setClassEvents(response.data.classSchedule);
        console.log('📅 Teacher Schedule Events:', response.data.classSchedule);
      } catch (error) {
        console.error('❌ Error fetching teacher schedule:', error);
      }
    };

    fetchEvents();
  }, []);

  const isMeetingDate = (date: Date): boolean => {
    return classEvents.some((event) => {
      const eventStart = new Date(event.startDate);
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
          `${date.toLocaleString('default', {
            month: 'long',
          }).toUpperCase()}, ${date.getFullYear()}`
        }
        onClickDay={() => {
          router.push(`/teacher/ui/teacherreschedule`);
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