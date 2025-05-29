"use client";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import axios from "axios";

interface Event {
  title: string;
  start: Date;
  end: Date;
}

interface Meeting {
  _id: string;
  meetingId: string;
  meetingName: string;
  meetingStatus: "Scheduled" | "Reschedule" | "Completed";
  selectedDate: string;
  startTime: string;
  endTime: string;
  description: string;
  createdDate: string;
  createdBy: string;
  supervisor: {
    supervisorId: string;
    supervisorName: string;
    supervisorEmail: string;
    supervisorRole: string;
  };
  teacher: {
    teacherId: string;
    teacherName: string;
    teacherEmail: string;
  }[];
}

const Academic: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [value, setValue] = useState<Date>(new Date());
  const [meetingDays, setMeetingDays] = useState<Date[]>([]);
  const [todayMeetings, setTodayMeetings] = useState<
    { time: string; title: string; type: string; color: string }[]
  >([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("SupervisorAuthToken") : null;

        if (!token) {
          console.error("❌ SupervisorAuthToken not found");
          return;
        }

        const response = await axios.get(
          "https://api.blackstoneinfomaticstech.com/allMeetings",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const allMeetings: Meeting[] = response.data.data.meetings;

        console.log("✅ Full Meetings Data:", allMeetings);

        // Convert meeting dates to Date objects normalized to 00:00:00 for comparison
        const allMeetingDates = allMeetings.map((m) => {
          const d = new Date(m.selectedDate);
          d.setHours(0, 0, 0, 0);
          return d;
        });

        setMeetingDays(allMeetingDates);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter today's meetings
        const todayMeetings = allMeetings
          .filter((meeting) => {
            const meetingDate = new Date(meeting.selectedDate);
            meetingDate.setHours(0, 0, 0, 0);
            return meetingDate.getTime() === today.getTime();
          })
          .map((meeting) => {
            let color = "bg-blue-100 text-blue-800"; // Default color

            if (meeting.meetingStatus === "Scheduled") {
              color = "bg-amber-100 text-amber-800";
            } else if (meeting.meetingStatus === "Reschedule") {
              color = "bg-green-100 text-green-800";
            }

            return {
              time: meeting.startTime,
              title: meeting.meetingName,
              type: meeting.meetingStatus.toLowerCase(),
              color,
            };
          });

        setTodayMeetings(todayMeetings);
      } catch (error) {
        console.error("🚨 Error fetching meetings:", error);
      }
    };

    fetchMeetings();
  }, []);

  // Check if date is in meetingDays
  const isMeetingDate = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const hasMeeting = meetingDays.some(
      (meetingDate) => meetingDate.getTime() === d.getTime()
    );

    console.log(`Checking date: ${date.toDateString()}, hasMeeting: ${hasMeeting}`);

    return hasMeeting;
  };

  return (
    <div className="flex items-center justify-center">
      <div className="rounded-lg">
        <Calendar
          onChange={(newValue) => setValue(newValue as Date)}
          value={value}
          locale="en-GB"
          calendarType="iso8601" // 👈 Ensures week starts on Monday
          className="custom-calendar"
          navigationLabel={({ date }) =>
            `${date.toLocaleString("default", { month: "long" }).toUpperCase()}, ${date.getFullYear()}`
          }
          nextLabel="›"
          prevLabel="‹"
          next2Label={null}
          prev2Label={null}
          showNeighboringMonth={false}
          tileClassName={({ date, view }) => {
            if (view === "month" && isMeetingDate(date)) {
              return "react-calendar__tile--active";
            }
            return undefined;
          }}
        />



      </div>
    </div>
  );
};

export default Academic;
