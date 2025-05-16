"use client";

import React, { useEffect, useState } from "react";
import BaseLayout1 from "@/components/BaseLayout1";
import {
  Calendar,
  momentLocalizer,
  View,
  ToolbarProps,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
  date: string; // Used for filtering
}

const ViewTeacherSchedule = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    moment().format("YYYY-MM-DD")
  );
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState<Event[]>(
    []
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<View>("month");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newStartTime, setNewStartTime] = useState<string>("");

  useEffect(() => {
   const token =
    typeof window !== "undefined" ? localStorage.getItem("AcademicCoachAuthToken") : null;

  if (!token) {
    console.error("❌ AdminAuthToken not found");
    return;
  }
    fetch(`https://api.blackstoneinfomaticstech.com/meetingSchedulelist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const mappedEvents = data.academicCoach.map((item: any) => ({
          id: item._id,
          title: item.subject,
          start: new Date(item.scheduledStartDate),
          end: new Date(item.scheduledEndDate),
          description: item.description,
          date: moment(item.scheduledStartDate).format("YYYY-MM-DD"),
        }));
        setEvents(mappedEvents);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  const handleDateClick = (date: Date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    setSelectedDate(formattedDate);

    const filteredEvents = events.filter(
      (event) => event.date === formattedDate
    );
    setEventsForSelectedDate(filteredEvents);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setNewStartTime(moment(event.start).format("HH:mm"));
    setShowModal(true);
  };

  const handleSaveNewTime = () => {
    if (selectedEvent) {
      const updatedEvents = events.map((event) =>
        event.id === selectedEvent.id
          ? {
              ...event,
              start: moment(selectedEvent.date + " " + newStartTime).toDate(),
            }
          : event
      );

      setEvents(updatedEvents);
      setEventsForSelectedDate(
        updatedEvents.filter((event) => event.date === selectedDate)
      );
      setShowModal(false);
    }
  };

  return (
    <BaseLayout1>
      <div className="flex flex-col mx-auto">
        <div className="flex-1 p-6 -ml-10 mt-2">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[20px] font-semibold">Reschedule Class</h1>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-3">
              <div className="bg-white p-4 rounded-lg shadow overflow-hidden">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 600, width: "100%" }}
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
                      backgroundColor: event.title.includes("Meeting")
                        ? "#fcd4d4"
                        : "#e8fcd8",
                      color: "#000",
                      fontSize: "8px",
                      padding: "2px 4px",
                    },
                  })}
                />
              </div>
            </div>

            {/* List Schedule */}
            <div className="col-span-1">
              <div className="bg-white p-6 w-60 rounded-lg shadow overflow-y-scroll h-[630px] scrollbar-none">
                <h2 className="text-[13px] font-semibold mb-6 text-center p-4">
                  Scheduled list for {moment(selectedDate).format("DD MMM YYYY")}
                </h2>
                <div className="space-y-6">
                  {eventsForSelectedDate.length > 0 ? (
                    eventsForSelectedDate.map((item) => (
                      <button
                        key={item.id}
                        className="border-b pb-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                        onClick={() => handleEventClick(item)}
                      >
                        <div className="flex justify-between">
                          <h3 className="font-medium text-[12px]">
                            {item.title}
                          </h3>
                          <span className="text-[9px] text-gray-500 text-end">
                            {moment(item.start).format("DD MMM YYYY")}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {moment(item.start).format("h:mm A")} -{" "}
                          {moment(item.end).format("h:mm A")}
                        </div>
                        <p className="text-[10px] text-gray-600 mt-2">
                          {item.description || ""}
                        </p>
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 text-[12px] text-center">
                      No events scheduled
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-[16px] font-semibold mb-4">Select Time</h2>
            <div className="space-y-4">
              <p className="text-[14px]">{selectedEvent.title}</p>
              <input
                type="time"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-[12px]"
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg text-[12px]"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg text-[12px] hover:bg-blue-500"
                  onClick={handleSaveNewTime}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </BaseLayout1>
  );
};

export default ViewTeacherSchedule;

const CustomToolbar: React.FC<ToolbarProps<Event, object>> = ({
  label,
  onView,
  view,
}) => {
  return (
    <div className="flex justify-between items-center p-2">
      <h2 className="text-sm font-semibold">{label}</h2>
      <div className="flex gap-1">
        <button
          onClick={() => onView("month")}
          className={`px-2 py-1 rounded ${view === "month"
            ? "bg-gray-900 text-white text-[13px]"
            : "bg-gray-200 text-[13px]"
            }`}
        >
          Month
        </button>
        <button
          onClick={() => onView("week")}
          className={`px-2 py-1 rounded ${view === "week"
            ? "bg-gray-900 text-white text-[13px]"
            : "bg-gray-200 text-[13px]"
            }`}
        >
          Week
        </button>
        <button
          onClick={() => onView("day")}
          className={`px-2 py-1 rounded ${view === "day"
            ? "bg-gray-900 text-white text-[13px]"
            : "bg-gray-200 text-[13px]"
            }`}
        >
          Day
        </button>
      </div>
    </div>
  );
};
