"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import BaseLayout from "@/components/BaseLayout";
import {
  Calendar,
  momentLocalizer,
  View,
  ToolbarProps,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

interface Student {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  gender: string;
}

interface Teacher {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
}

interface ClassData {
  _id: string;
  student: Student;
  teacher?: Teacher;
  classDay: string[]; // Example: ["Monday"]
  classLink: string;
  createdBy: string;
  createdDate: string;
  lastUpdatedDate: string;
  startDate: string | { $date: string }; // Handles both formats
  startTime: string[]; // Example: ["13:32"]
  endDate: string | { $date: string }; // Handles both formats
  endTime: string[]; // Example: ["15:03"]
  package: string;
  preferedTeacher: string;
  scheduleStatus: string;
  status: string;
  totalHourse: number;
  __v: number;
}

interface ApiResponse {
  totalCount: number;
  students: ClassData[];
}

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
}

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    moment().format("YYYY-MM-DD")
  );
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState<Event[]>(
    []
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<View>("month");

  // Helper function to parse date properly
  const parseDate = (date: string | { $date: string }): Date =>
    new Date(typeof date === "string" ? date : date.$date);

  useEffect(() => {
    const fetchSchedule = async () => {
      const teacherId = localStorage.getItem("TeacherPortalId");
      const authToken = localStorage.getItem("authToken");

      if (!teacherId || !authToken) {
        console.error("Missing teacherId or authToken");
        return;
      }

      try {
        const response = await axios.get<ApiResponse>(
          `https://alfurqanacademy.tech/classShedule`,
          {
            params: { teacherId },
          
          }
        );

        console.log("Raw API Response:", response.data);

        if (!response.data.students || !Array.isArray(response.data.students)) {
          console.error("Unexpected response format:", response.data.students);
          return;
        }

        console.log("API Response Data:", response.data);

        // Filter and map events for the selected teacher
        const filteredEvents: Event[] = response.data.students
          .filter((item: ClassData) => item.teacher && item.teacher.teacherId === teacherId)
          .map((item: ClassData) => ({
            id: item._id,
            title: `${item.student.studentFirstName} ${item.student.studentLastName} - ${item.teacher?.teacherName ?? "Unknown"}`,
            start: parseDate(item.startDate),
            end: parseDate(item.endDate),
            description: item.scheduleStatus,
          }));

        console.log("Filtered Events:", filteredEvents);
        setEvents(filteredEvents);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchSchedule();
  }, []);

  const handleDateClick = (date: Date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setSelectedDate(formattedDate);

    const filteredEvents = events.filter(
      (event) => moment(event.start).format("YYYY-MM-DD") === formattedDate
    );
    setEventsForSelectedDate(filteredEvents);
  };

  return (
    <BaseLayout>
      <div className="flex flex-col mx-auto">
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[20px] font-semibold">Scheduled Class</h1>
          </div>

          <div className="grid grid-cols-4 gap-8">
            {/* Calendar Component */}
            <div className="col-span-3">
              <div className="bg-white p-4 rounded-lg shadow overflow-hidden">
              <Calendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  style={{ height: 500, width: "100%" }}
  view={view}
  onView={(newView) => setView(newView)}
  onSelectSlot={(slotInfo) => handleDateClick(slotInfo.start)} // ✅ Click on a date
  selectable
  popup
  components={{ toolbar: CustomToolbar }}
  eventPropGetter={(event) => ({
    style: {
      backgroundColor: event.title.includes("Meeting") ? "#fcd4d4" : "#e8fcd8",
      color: "#000",
      fontSize: "10px",
      padding: "2px 4px",
    },
  })}
/>

              </div>
            </div>

            {/* List Schedule */}
            <div className="col-span-1">
              <div className="bg-white p-6 w-60 rounded-lg shadow overflow-y-scroll h-[530px] scrollbar-none">
                <h2 className="text-[13px] font-semibold mb-6 text-center">
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
                        <p className="text-[10px] text-gray-600 mt-2">{item.description || ""}</p>
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
    </BaseLayout>
  );
};

export default SchedulePage;

const CustomToolbar: React.FC<ToolbarProps<Event, object>> = ({ label, onView, view }) => {
  return (
    <div className="flex justify-between items-center p-2">
      <h2 className="text-sm font-semibold">{label}</h2>
      <div className="flex gap-1">
        {["month", "week", "day"].map((type) => (
          <button
            key={type}
            onClick={() => onView(type as View)}
            className={`px-2 py-1 rounded ${view === type ? "bg-gray-900 text-white text-[13px]" : "bg-gray-200 text-[13px]"}`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};
