"use client";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import axios from "axios";
import { useRouter } from "next/navigation"; 
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
    const router = useRouter(); 

  const [events, setEvents] = useState<Event[]>([]);
  const [value, setValue] = useState<Date>(new Date());
  const [activeStartDate, setActiveStartDate] = useState<Date>(new Date());
  const [meetingDays, setMeetingDays] = useState<Date[]>([]);
  const [todayMeetings, setTodayMeetings] = useState<
    { time: string; title: string; type: string; color: string }[]
  >([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("SupervisorAuthToken")
            : null;

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

        // Filter out past meetings
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const upcomingMeetings = allMeetings.filter((meeting) => {
          const meetingDate = new Date(meeting.selectedDate);
          meetingDate.setHours(0, 0, 0, 0);
          return meetingDate.getTime() >= now.getTime();
        });

        // Convert meeting dates to Date objects normalized to 00:00:00
        const allMeetingDates = upcomingMeetings.map((m) => {
          const d = new Date(m.selectedDate);
          d.setHours(0, 0, 0, 0);
          return d;
        });

        setMeetingDays(allMeetingDates);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter today's meetings
        const todayMeetings = upcomingMeetings
          .filter((meeting) => {
            const meetingDate = new Date(meeting.selectedDate);
            meetingDate.setHours(0, 0, 0, 0);
            return meetingDate.getTime() === today.getTime();
          })
          .map((meeting) => {
            let color = "bg-blue-100 text-blue-800"; // Default

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

  // Check if a date has meetings
  const isMeetingDate = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    return meetingDays.some(
      (meetingDate) => meetingDate.getTime() === d.getTime()
    );
  };

  return (
    <div className="dark:bg-[#343434] w-full rounded-xl">
      <Calendar
        onChange={(newValue) => setValue(newValue as Date)}
        value={value}
        activeStartDate={activeStartDate}
        onActiveStartDateChange={({ activeStartDate }) => {
          setActiveStartDate(activeStartDate as Date);
          setValue(activeStartDate as Date);
        }}
        onClickDay={() => {
      router.push(`/supervisor/ui/calendar`);
    }}
        locale="en-GB"
        calendarType="iso8601"
        showNeighboringMonth={true} // Keep full calendar structure
        className="custom-calendar dark:bg-[#343434]"
        navigationLabel={({ date }) =>
          `${date
            .toLocaleString("default", {
              month: "long",
            })
            .toUpperCase()}, ${date.getFullYear()}`
        }
        nextLabel="›"
        prevLabel="‹"
        next2Label={null}
        prev2Label={null}
        tileClassName={({ date, view }) => {
          if (view === "month") {
            const isSameMonth = date.getMonth() === activeStartDate.getMonth();
            const isSameYear =
              date.getFullYear() === activeStartDate.getFullYear();

            if (isSameMonth && isSameYear && isMeetingDate(date)) {
              return "react-calendar__tile--active";
            }
          }
          return undefined;
        }}
      />
    </div>
  );
};

export default Academic;
