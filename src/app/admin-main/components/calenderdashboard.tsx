'use client';

import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import './Calendaradmin.css';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('AdminAuthToken');
      if (token) {
        fetchMeetings(token);
      } else {
        console.log("No auth token found.");
      }
    }
  }, []);

  const fetchMeetings = async (token: string) => {
    try {
      const response = await fetch("https://api.blackstoneinfomaticstech.com/allAdminMeeting", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

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
      console.log("📅 Fetched Events: ", mappedEvents);
    } catch (error) {
      console.error("❌ Failed to fetch meetings", error);
    }
  };

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
          `${date.toLocaleString("default", { month: "long" }).toUpperCase()}, ${date.getFullYear()}`
        }
        nextLabel="›"
        prevLabel="‹"
        next2Label={null}
        prev2Label={null}
        showNeighboringMonth={true}
        locale="en-GB"
        calendarType="iso8601"
        className="custom-calendar dark:bg-[#343434]"
        onClickDay={() => {
          router.push(`/admin-main/admincalendar`);
        }}
        tileClassName={({ date, view }) =>
          view === "month" && isMeetingDate(date) ? "event-day" : undefined
        }
      />
    </div>
  );
};

export default Academic;
