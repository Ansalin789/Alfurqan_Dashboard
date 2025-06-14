"use client";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import { useRouter } from "next/navigation";


interface Event {
  title: string;
  start: Date;
  end: Date;
}

interface AcademicCoachItem {
  subject: string;
  scheduledStartDate: string; // Assuming this is a string in the API
  scheduledEndDate: string; // Assuming this is a string in the API
}

const Academic: React.FC = () => {
    const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [value, setValue] = useState<Date>(new Date());

  useEffect(() => {
     const token =
    typeof window !== "undefined" ? localStorage.getItem("AcademicCoachAuthToken") : null;

  if (!token) {
    console.error("❌ AdminAuthToken not found");
    return;
  }

    fetch(`https://api.blackstoneinfomaticstech.com/meetingSchedulelist`,{
      headers:{
        "Authorization": `Bearer ${token}`,
      }
    })
      .then((response) => response.json())
      .then((data) => {
        const mappedEvents = data.academicCoach.map(
          (item: AcademicCoachItem) => ({
            title: item.subject,
            start: new Date(item.scheduledStartDate),
            end: new Date(item.scheduledEndDate),
          })
        );
        setEvents(mappedEvents);
        console.log("Fetched Events: ", mappedEvents);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const isMeetingDate = (date: Date) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Only show events for current month and future months
    if (date.getFullYear() < currentYear || 
        (date.getFullYear() === currentYear && date.getMonth() < currentMonth)) {
      return false;
    }

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
        <div className="dark:bg-[#343434] w-full rounded-xl">
          <Calendar
            onChange={(newValue) => setValue(newValue as Date)}
            value={value}
            navigationLabel={({ date }) =>
              `${date
                .toLocaleString("default", { month: "long" })
                .toUpperCase()}, ${date.getFullYear()}`
            }
            onClickDay={() => {
              router.push(`/Academic-coach/meetingSchedule`);
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
              view === "month" && isMeetingDate(date) ? "event-day" : undefined
            }
          />
        </div>
  );
};

export default Academic;
