"use client";

import React, { useEffect, useState } from "react";
import BaseLayout4 from "@/components/BaseLayout4";
import { Calendar, momentLocalizer, View, ToolbarProps } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { useSearchParams } from "next/navigation";

const localizer = momentLocalizer(moment);

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
  date: string;
}

interface ScheduledClass {
  student: {
    studentId: string;
    studentFirstName: string;
    studentLastName: string;
    studentEmail: string;
    gender: string;
  };
  teacher: {
    teacherId: string;
    teacherName: string;
    teacherEmail: string;
  };
  _id: string;
  classDay: string[];
  package: string;
  startDate: string; // e.g., "2025-04-11"
  endDate: string;
  startTime: string[]; // ["10:00"]
  endTime: string[];   // ["11:00"]
  scheduleStatus: string;
  classLink: string;
  status: string;
  createdBy: string;
  sessionClassType: string;
  sessionStarttime: string;
  sessionsEndtime: string;
  createdDate: string;
  lastUpdatedDate: string;
  amount: string;
}

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState<Event[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<View>("month");
   const searchparam = useSearchParams();
  const employeeId = searchparam.get('teacherId'); // replace this with actual ID

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(
          `https://api.blackstoneinfomaticstech.com/classShedule/teacher?teacherId=${employeeId}`
        );
        const scheduledClasses: ScheduledClass[] = response.data.classSchedule ?? [];

        const mappedEvents: Event[] = scheduledClasses.map((item) => ({
          id: item._id,
          title: `${item.package} Class`, // Or any title you want
          start: new Date(item.startDate), // Convert to JavaScript Date
          end: new Date(item.endDate),     // Convert to JavaScript Date
          description: `Session Status: ${item.scheduleStatus}`, // Customize if you want
          date: moment(item.startDate).format("YYYY-MM-DD"), // For your side list
        }));
        console.log(mappedEvents);
        setEvents(mappedEvents);

        // Pre-filter for today
        const today = moment().format("YYYY-MM-DD");
        setEventsForSelectedDate(
          mappedEvents.filter((event) => event.date === today)
        );
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };

    fetchSchedule();
  }, []);

  const handleDateClick = (date: Date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setSelectedDate(formattedDate);

    const filteredEvents = events.filter(
      (event) => event.date === formattedDate
    );
    setEventsForSelectedDate(filteredEvents);
  };

  return (
    <BaseLayout4>
      <div className="flex flex-col mx-auto">
        <div className="flex-1 py-3 px-6 mt-2">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[20px] font-semibold">Scheduled Section</h1>
          </div>

          <div className="grid grid-cols-5 gap-6">
            {/* Calendar */}
            <div className="col-span-4">
              <div className="bg-white p-4 rounded-lg shadow overflow-hidden">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 500, width: "100%" }}
                  view={view}
                  onView={(newView) => setView(newView)}
                  onNavigate={handleDateClick}
                  onSelectSlot={({ start }) => handleDateClick(start)}
                  selectable
                  popup
                  components={{
                    toolbar: CustomToolbar,
                  }}
                  eventPropGetter={(event) => ({
                    style: {
                      backgroundColor: event.title.includes("Meeting") ? "#fcd4d4" : "#e8fcd8",
                      color: "#000",
                      fontSize: "8px",
                      padding: "2px 4px",
                    },
                  })}
                />
              </div>
            </div>

            {/* List */}
            <div className="col-span-1">
              <div className="bg-white p-6 w-58 rounded-lg shadow overflow-y-scroll h-[530px] scrollbar-none">
                <h2 className="text-[13px] font-semibold mb-6 text-center p-4">
                  List Schedule for {moment(selectedDate).format("DD MMM YYYY")}
                </h2>
                <div className="space-y-6">
                  {eventsForSelectedDate.length > 0 ? (
                    eventsForSelectedDate.map((item) => (
                      <div key={item.id} className="border-b pb-2">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-[12px]">{item.title}</h3>
                          <span className="text-[9px] text-gray-500 text-end">
                            {moment(item.start).format("DD MMM YYYY")}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {moment(item.start).format("h:mm A")} - {moment(item.end).format("h:mm A")}
                        </div>
                        <p className="text-[10px] text-gray-600 mt-2">
                          {item.description || ""}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-[12px] text-center">No events scheduled</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout4>
  );
};

export default SchedulePage;

const CustomToolbar: React.FC<ToolbarProps<Event, object>> = ({
  label,
  onView,
  view,
}) => {
  return (
    <div className="flex justify-between items-center p-2">
      <h2 className="text-sm font-semibold">{label}</h2>
      <div className="flex gap-1">
        {["month", "week", "day"].map((v) => (
          <button
            key={v}
            onClick={() => onView(v as View)}
            className={`px-2 py-1 rounded ${
              view === v ? "bg-gray-900 text-white text-[13px]" : "bg-gray-200 text-[13px]"
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};
