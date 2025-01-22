'use client';

import React, { useState } from "react";
import { Calendar, dateFnsLocalizer, View, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import BaseLayout from "@/components/BaseLayout";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const events = [
  {
    title: "Evaluation Class",
    start: new Date(2024, 0, 2, 10, 0),
    end: new Date(2024, 0, 2, 12, 0),
  },
  {
    title: "Meeting",
    start: new Date(2024, 0, 5, 19, 0),
    end: new Date(2024, 0, 5, 22, 0),
  },
  {
    title: "To-Do Task",
    start: new Date(2024, 0, 17, 9, 0),
    end: new Date(2024, 0, 17, 11, 0),
  },
];

// Custom Toolbar Component
const CustomToolbar = ({ label, onViewChange, view }: any) => {
  return (
    <div className="flex justify-between items-center py-2 px-4 bg-gray-100 rounded-lg mb-4">
      <h2 className="text-lg font-bold">{label}</h2>
      <div className="flex gap-2">
        <button
          className={`px-3 py-1 text-sm rounded-lg shadow ${
            view === "month" ? "bg-[#223857] text-white" : "bg-gray-200"
          }`}
          onClick={() => onViewChange("month")}
        >
          Month
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-lg shadow ${
            view === "week" ? "bg-[#223857] text-white" : "bg-gray-200"
          }`}
          onClick={() => onViewChange("week")}
        >
          Week
        </button>
        <button
          className={`px-3 py-1 text-sm rounded-lg shadow ${
            view === "day" ? "bg-[#223857] text-white" : "bg-gray-200"
          }`}
          onClick={() => onViewChange("day")}
        >
          Day
        </button>
      </div>
    </div>
  );
};
const Schedules: React.FC = () => {
  const [view, setView] = useState<string>(Views.MONTH);
  const [showMeetingPopup, setShowMeetingPopup] = useState(false);
  const [showTodoPopup, setShowTodoPopup] = useState(false);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleViewChange = (newView: string) => {
    setView(newView);
  };
  
  const handleFormSubmit = (type: string) => (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(`${type} added successfully!`);
    setShowSuccess(true);
    
    if (type === 'Meeting') setShowMeetingPopup(false);
    if (type === 'Todo') setShowTodoPopup(false);
    if (type === 'Schedule') setShowSchedulePopup(false);

    setTimeout(() => {
      setShowSuccess(false);
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <BaseLayout>
      <div className="flex flex-col md:flex-row items-start gap-6 p-6 min-h-screen">
        {/* Success Message Toast */}
        {showSuccess && (
          <div className="fixed top-4 align-middle right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
            {successMessage}
          </div>
        )}

        {/* Calendar Section */}
        <div className="w-full md:w-3/4">
        <h2 className="text-4xl font-semibold mb-4">Class Schedule</h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-end items-center mb-4">
            <div className="flex gap-2">
              <button 
                onClick={() => setShowMeetingPopup(true)}
                className="px-3 py-1 text-[11px] bg-[#223857] text-white rounded-lg shadow hover:bg-[#223857]"
              >
                + Add Meeting
              </button>
              <button 
                onClick={() => setShowTodoPopup(true)}
                className="px-3 py-1 text-[11px] bg-[#223857] text-white rounded-lg shadow hover:bg-[#223857]"
              >
                + Add To-do List
              </button>
              <button 
                onClick={() => setShowSchedulePopup(true)}
                className="px-3 py-1 text-[11px] bg-[#223857] text-white rounded-lg shadow hover:bg-[#223857]"
              >
                + Add Schedule
              </button>
            </div>
          </div>

          {/* Add Meeting Popup */}
          {showMeetingPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-3xl p-6 w-[400px] relative">
                <button 
                  onClick={() => setShowMeetingPopup(false)}
                  className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <h2 className="text-lg text-center font-semibold mb-4">Add new Meeting</h2>
                <form className="space-y-4" onSubmit={handleFormSubmit('Meeting')}>
                  <div>
                    <input
                      type="text"
                      placeholder="Title"
                      className="w-full p-2 border-b rounded-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="flex-1 p-2 border-b rounded-sm"
                    />
                    <input
                      type="time"
                      className="flex-1 p-2 border-b rounded-sm"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Comment"
                      className="w-full p-2 border-b rounded-sm"
                      rows={3}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-1/2 text-[13px] text-center justify-center ml-20 bg-[#223857] text-white py-2 rounded-lg hover:bg-opacity-90"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}

          {showTodoPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-3xl p-6 w-[400px] relative">
                <button 
                  onClick={() => setShowTodoPopup(false)}
                  className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <h2 className="text-lg font-semibold text-center mb-4">Add new ToDo Task</h2>
                <form className="space-y-4" onSubmit={handleFormSubmit('Todo')}>
                  <div>
                    <input
                      type="text"
                      placeholder="Title"
                      className="w-full p-2 border-b rounded-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="flex-1 p-2 border-b rounded-sm"
                    />
                    <input
                      type="time"
                      className="flex-1 p-2 border-b rounded-sm"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Comment"
                      className="w-full p-2 border-b rounded-sm"
                      rows={3}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-1/2 text-[13px] text-center justify-center ml-20 bg-[#223857] text-white py-2 rounded-lg hover:bg-opacity-90"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}

          {showSchedulePopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-3xl p-6 w-[400px] relative">
                <button 
                  onClick={() => setShowSchedulePopup(false)}
                  className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <h2 className="text-lg text-center font-semibold mb-4">Add new Schedule</h2>
                <form className="space-y-4" onSubmit={handleFormSubmit('Schedule')}>
                  <div>
                    <input
                      type="text"
                      placeholder="Title"
                      className="w-full p-2 border-b rounded-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="flex-1 p-2 border-b rounded-sm"
                    />
                    <input
                      type="time"
                      className="flex-1 p-2 border-b rounded-sm"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Comment"
                      className="w-full p-2 border-b rounded-sm"
                      rows={3}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-1/2 text-[13px] text-center justify-center ml-20 bg-[#223857] text-white py-2 rounded-lg hover:bg-opacity-90"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}

          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, width: 650 }}
            views={["month", "week", "day"]} // Enable Day, Week, and Month views
            view={view as View} // Pass the current view state with correct type
            onView={handleViewChange} // Update view when changed
            components={{
              toolbar: (props) => (
                <CustomToolbar
                  {...props}
                  onViewChange={handleViewChange}
                  view={view}
                />
              ),
            }}
            popup
            eventPropGetter={(event) => {
              if (event.title.includes("Evaluation")) {
                return { style: { backgroundColor: "#cfe8fc", color: "#000" } };
              } else if (event.title.includes("Meeting")) {
                return { style: { backgroundColor: "#fcd4d4", color: "#000" } };
              } else {
                return { style: { backgroundColor: "#e8fcd8", color: "#000" } };
              }
            }}
          />
        </div>
          
        </div>

        <div className="w-[200px] md:w-[320px] flex flex-col gap-6 shadow-2xl rounded-3xl bg-white overflow-y-auto h-[95vh] scrollbar-thin scrollbar-track-black ml-32">
          {/* Today's Schedules */}
          <div className=" p-4">
            <h3 className="text-xl font-semibold mb-4 text-center">Today's Schedules</h3>
            <div
              className="space-y-4"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#d1d5db #f3f4f6", // Custom scrollbar color for Firefox
              }}
            >
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col border rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow"
                >
                  <span className="text-[11px] text-red-500 font-medium">Jan 5th, 2024</span>
                  <span className="text-base font-semibold">Abinesh</span>
                  <div className="flex items-center text-[11px] text-gray-600">
                    <span className="material-icons text-gray-400 mr-1">schedule</span>
                    07:00 - 10:00 PM
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2 mt-10">
            <h3 className="text-xl font-semibold mb-4 text-center">Today's Todo Task</h3>
            <div className="flex flex-col border rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow">
              <span className="text-[11px] text-red-500 font-medium">Jan 5th, 2024</span>
              <span className="text-base font-semibold">Meeting</span>
              <div className="flex items-center text-[11px] text-gray-600">
                <span className="material-icons text-gray-400 mr-1">schedule</span>
                07:00 - 10:00 PM
              </div>
            </div>
          </div>
          </div>

          
        </div>

      </div>
    </BaseLayout>
  );
};

export default Schedules;
