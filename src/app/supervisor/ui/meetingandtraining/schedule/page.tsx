'use client';

import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, View, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import BaseLayout3 from "@/components/BaseLayout3"
import { IoMdClose } from "react-icons/io";
import { FaCalendarAlt, FaUserCircle } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { User } from "lucide-react";
import axios from "axios";
import moment from "moment";

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


interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  meetingStatus: string;
  supervisorName: string;
  meetingId: string;
  teacherName: string;
}

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
  const [ view,setView] = useState<string>(Views.MONTH);
  const [showSuccess] = useState(false);
  const [successMessage] = useState("");
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState(""); 
  const [selectedDates, setSelectedDates] = useState<Date | null>(null);
  const [isDatePickerOpens, setIsDatePickerOpens] = useState(false);
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);
  const handleScheduleMeeting = () => {
    setIsSuccessMessageVisible(true);
    setTimeout(() => {
      setIsSuccessMessageVisible(false);
      setIsMeetingModalOpen(false);
    }, 2000);
  };

console.log(view)
  const handleViewChange = (newView: string) => {
    setView(newView);
  };
  
   const [selectedColor, setSelectedColor] = useState<string>("purple");
  
  const colorOptions = [
    { color: "purple", hex: "#A259FF" },
    { color: "green", hex: "#4CAF50" },
    { color: "orange", hex: "#FFA500" },
    { color: "blue", hex: "#4285F4" }
  ];
  const colorTitles: Record<string, string> = {
    blue: "Interview",
    green: "Group Meeting",
    orange: "Teacher Meeting",
    purple: "Weekly Meeting",
  };
  const [schedule] = useState(
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => ({
        day,
        startTime: "",
        duration: "", // Initial duration in hours from API
        endTime: "",
        isSelected: false, // Track if the day is selected
      }))
    );

 const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
   const [selectedFilter, setSelectedFilter] = useState<"all" | "quran" | "arabic">("all");
 
   const quranTeachers = ["Teacher A", "Teacher B", "Teacher C"];
   const arabicTeachers = ["Teacher X", "Teacher Y", "Teacher Z"];
 
   const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
 
   // Merge both Quran and Arabic teachers into one list
   const allTeachers = [
     ...quranTeachers.map((t) => ({ name: t, subject: "quran" })),
     ...arabicTeachers.map((t) => ({ name: t, subject: "arabic" })),
   ];
 
   // Filtered teachers based on selected filter
   const filteredTeachers =
     selectedFilter === "all"
       ? allTeachers
       : allTeachers.filter((t) => t.subject === selectedFilter);
 
   // Toggle teacher selection
   const toggleSelections = (teacher: string) => {
     setSelectedTeachers((prev) =>
       prev.includes(teacher) ? prev.filter((t) => t !== teacher) : [...prev, teacher]
     );
   };
const [description, setDescription] = useState("");
const [events, setEvents] = useState<Event[]>([]);
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get('https://alfurqanacademy.tech/allMeetings');

      // Extract meetings array safely
      const meetings = response.data?.data?.meetings;

      if (!Array.isArray(meetings)) {
        console.error("Error: Response data does not contain a meetings array", response.data);
        return;
      }

      const formattedEvents: Event[] = meetings
        .map((item): Event | null => {
          if (!item.selectedDate || !item.startTime || !item.endTime) {
            console.warn("Skipping event due to missing date/time:", item);
            return null; // Skip invalid events
          }

          const selectedDate = moment(item.selectedDate);
          const startTimeParts = item.startTime.split(":");
          const endTimeParts = item.endTime.split(":");

          const startDate = selectedDate.clone().set({
            hour: parseInt(startTimeParts[0], 10),
            minute: parseInt(startTimeParts[1], 10),
            second: 0,
          }).toDate();

          const endDate = selectedDate.clone().set({
            hour: parseInt(endTimeParts[0], 10),
            minute: parseInt(endTimeParts[1], 10),
            second: 0,
          }).toDate();

          return {
            id: item.id,
            title: item.meetingName || "Untitled Meeting",
            start: startDate,
            end: endDate,
            description: item.description ?? "No description", // ✅ Handle missing values
            meetingStatus: item.status || "Unknown",
            supervisorName: item.supervisor?.supervisorName || "Unknown",
            meetingId: item.id,
            teacherName: item.teacher?.[0]?.teacherName || "Unknown",
          };
        })
        .filter((event): event is Event => event !== null); // ✅ Type-safe filtering

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching schedule data:", error);
    }
  };

  fetchData();
}, []);

const [selectedDate, setSelectedDate] = useState<Date | null>(null);
const [filteredMeetings, setFilteredMeetings] = useState<Event[]>([]);

const handleDateClick = (slotInfo: { start: Date }) => {
  const clickedDate = moment(slotInfo.start).startOf("day"); // Normalize the date
  setSelectedDate(clickedDate.toDate());

  // Filter meetings by exact date
  const filtered = events.filter((event) =>
    moment(event.start).isSame(clickedDate, "day")
  );

  setFilteredMeetings(filtered);
};



 
  return (
    <BaseLayout3>
      <div className="flex flex-col md:flex-row items-start gap-6 p-6 min-h-screen">
        {/* Success Message Toast */}
        {showSuccess && (
          <div className="fixed top-4 align-middle right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
            {successMessage}
          </div>
        )}

        {/* Calendar Section */}
        <div className="w-full md:w-3/4">
          <h2 className="text-2xl font-semibold text-gray-800 p-2">Calender</h2>
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-end items-center mb-2">
              <div className="flex gap-2">
               {/* Add Schedule Button */}
<button 
  onClick={() => setIsMeetingModalOpen(true)} // Opens the modal
  className="px-3 py-2 text-[12px] bg-[#223857] text-white rounded-lg shadow hover:bg-[#1C3557]"
>
  + Add Schedule
</button>

{/* Meeting Modal */}
{isMeetingModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-[390px] relative">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-xl font-semibold text-[#1C3557]">Add Meeting</h2>
        <div className="flex space-x-2">
            {colorOptions.map((option) => (
                 <label 
                   key={option.color} 
                   className="flex items-center cursor-pointer" 
                   title={colorTitles[option.color] || option.color} // Shows title based on color
                 >
                   <input
                     type="radio"
                     name="meetingColor"
                     value={option.color}
                     checked={selectedColor === option.color}
                     onChange={() => setSelectedColor(option.color)}
                     className="hidden"
                   />
                   <span 
                     className={`w-4 h-4 rounded-full border-2 flex items-center justify-center`}
                     style={{ borderColor: option.hex }}
                   >
                     {selectedColor === option.color && (
                       <span className="w-2 h-2 rounded-full" style={{ backgroundColor: option.hex }}></span>
                     )}
                   </span>
                 </label>
               ))}
               
        </div>
               
        <button 
          onClick={() => setIsMeetingModalOpen(false)} // Close button
          className="text-gray-500 hover:text-gray-700"
        >
          <IoMdClose size={20} />
        </button>
      </div>

      {/* Meeting Title */}
      <input
        type="text"
        className="w-full border rounded-xl p-2 mt-3 focus:outline-none focus:ring-2 focus:ring-[#1C3557]"
        placeholder="Meeting Title"
        value={meetingTitle}
        onChange={(e) => setMeetingTitle(e.target.value)}
      />

      {/* Date Picker */}
      <div className="flex items-center border rounded-xl p-2 mt-6">
        <FaCalendarAlt 
          className="text-gray-500 mr-2" 
          onClick={() => setIsDatePickerOpens(!isDatePickerOpens)} 
        />
        <span className="text-gray-600 w-full">
          {selectedDates ? selectedDates.toLocaleDateString() : "Select Date"}
        </span>
        {isDatePickerOpens && (
                       <div className="absolute right-0 z-10 mt-72">
                         <DatePicker
                           selected={selectedDates}
                           onChange={(date) => {
                             setSelectedDates(date);
                             setIsDatePickerOpens(false);
                           }}
                           inline
                         />
                       </div>
                     )}
      </div>
      <div className="flex items-center rounded-sm p-2 w-[50%] relative gap-2 mt-4">
             {/* <FaClock className="text-gray-500 mr-2" onClick={() => setIsStartTimePickerOpen(!isStartTimePickerOpen)} /> */}
                {/* <span className="text-gray-600">{startTime ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Start Time"}</span> */}
               
                <div className="col-span-2">
                    <label htmlFor='start time' className="block font-medium text-gray-700 text-[12px]">Start Time</label>
                    <input type="time"
                    className="form-input w-[165px] text-[11px] border border-[#D4D6D9] bg-[#f7f7f8] p-2 rounded-lg"
                    defaultValue="09:00" // Set default start time to 09:00
                    disabled={schedule.some(item => item.isSelected)}
                    />
                </div>
                <div className="col-span-2">
                    <label htmlFor='end time' className="block font-medium text-gray-700 text-[12px]">End Time</label>
                        <input
                    type="time"
                        className="form-input w-[162px] text-[11px] border border-[#D4D6D9] bg-[#f7f7f8] p-2 rounded-lg"
                    defaultValue="09:30" // Set default end time to 09:30
                    disabled={schedule.some(item => item.isSelected)}
                        />
                </div>
            </div>

            <button
              className="flex items-center border text-[12px] rounded-xl p-2 cursor-pointer mt-4 pl-2"
              onClick={() => setIsTeacherModalOpen(true)}>
        <User className="w-6 h-4 text-gray-600" /> Add Teacher
      </button>

      {/* Teacher Modal */}
      {isTeacherModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-[300px] relative">
            {/* Close Button */}
            <button
              onClick={() => setIsTeacherModalOpen(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
            >
              <IoMdClose size={20} />
            </button>

            {/* Filter Buttons */}
            <div className="flex space-x-4 mb-4">
              <button
                className={`px-4 py-1 rounded-lg ${selectedFilter === "quran" ? "bg-gray-500 text-white" : "border"}`}
                onClick={() => setSelectedFilter("quran")}
              >
                Quran
              </button>
              <button
                className={`px-4 py-1 rounded-lg ${selectedFilter === "arabic" ? "bg-gray-500 text-white" : "border"}`}
                onClick={() => setSelectedFilter("arabic")}
              >
                Arabic
              </button>
              <button
                className={`px-4 py-1 rounded-lg ${selectedFilter === "all" ? "bg-gray-500 text-white" : "border"}`}
                onClick={() => setSelectedFilter("all")}
              >
                All
              </button>
            </div>

            {/* Teacher List */}
            <div className="border p-2 rounded-md max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
              {filteredTeachers.map((teacher) => (
                <div key={teacher.name} className="flex items-center justify-between p-2 border-b last:border-none">
                  <div className="flex items-center space-x-2">
                    <FaUserCircle className="text-[#1C3557]" size={20} />
                    <span className="text-gray-700 text-sm">{teacher.name}</span>
                  </div>
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-[#1C3557] border-gray-300 rounded focus:ring-[#1C3557]"
                    checked={selectedTeachers.includes(teacher.name)}
                    onChange={() => toggleSelections(teacher.name)}
                  />
                </div>
              ))}
            </div>

            {/* Done Button */}
            <button
              onClick={() => setIsTeacherModalOpen(false)}
              className="w-full mt-4 bg-[#1C3557] text-white py-2 rounded-lg hover:bg-[#15294a]"
            >
              Done
            </button>
          </div>
        </div>
      )}
         <div className="flex mt-2 space-x-2">
               {selectedTeachers.map((teacher) => (
                 <span key={teacher} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm">
                   {teacher}
                 </span>
               ))}
               {/* <button className="text-[#1C3557] border border-[#1C3557] rounded-full p-1">
                 <FaPlus size={12} />
               </button> */}
             </div>
 
             {/* Description */}
             <textarea
               className="w-full border rounded-xl p-2 mt-3 focus:outline-none focus:ring-2 focus:ring-[#1C3557]"
               placeholder="Add Description"
               value={description}
               onChange={(e) => setDescription(e.target.value)}
             ></textarea>
             {isSuccessMessageVisible && (
               <div className="fixed  flex items-center bg-[#dde0dd] border border-[#cdcfcd] text-[#191919] px-6 py-3 rounded-lg shadow-lg">
              {/* Green Check Icon */}
             <div className="w-8 h-8 flex items-center justify-center bg-[#4CAF50] rounded-full">
               <span className="text-white text-xl">✔</span>
               </div>

            {/* Success Message */}
             <span className="ml-3 font-medium">Scheduled successfully</span>
             </div>
              )}

      {/* Buttons */}
      <div className="flex justify-between mt-4">
        <button
          className="w-[45%] border border-gray-400 text-gray-700 py-2 rounded-md hover:bg-gray-100"
          onClick={() => setIsMeetingModalOpen(false)}>
          Cancel
        </button>
        <button 
          className="w-[45%] bg-[#1C3557] text-white py-2 rounded-md hover:bg-[#15294a]"
          onClick={handleScheduleMeeting}>
          Schedule
        </button>
      </div>
    </div>
  </div>
)}
            </div>
            </div>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 640, width: 950 }}
              views={["month", "week", "day"]}
              view={"month" as View}
              selectable
              onView={handleViewChange}
              onSelectSlot={handleDateClick} // Handle date clicks
              onSelectEvent={(event) => console.log("Event clicked:", event)}
              components={{
                toolbar: (props) => (
                  <CustomToolbar {...props} onViewChange={handleViewChange} />
                ),
              }}
              popup
              eventPropGetter={(event: Event) => {
                console.log("Event:", event); // Debugging output
              
                if (event.title.includes("Meeting")) {
                  return { style: { backgroundColor: "#fcd4d4", color: "#000",fontSize:"12px" } };
                } else {
                  return { style: { backgroundColor: "#e8fcd8", color: "#000" } };
                }
              }}
              
            />
          </div>
        </div>
        <div className="w-100% md:w-[250px] flex flex-col gap-6 shadow-2xl rounded-lg bg-white overflow-y-auto h-[85vh] mt-12 scrollbar-none ml-12">
          {/* List Schedules */}
          <div className="p-4">
             <h3 className="text-[15px] font-semibold mb-4 text-center">
    {selectedDate
      ? `Meetings Schedules for ${moment(selectedDate).format("MMMM Do, YYYY")}`
      : "Select a Date to View Meetings"}
  </h3>

  <div
    className="space-y-4"
    style={{ scrollbarWidth: "thin", scrollbarColor: "#d1d5db #f3f4f6" }}
  >
    {filteredMeetings.length > 0 ? (
      filteredMeetings.map((meeting) => (
        <div
          key={meeting.id}
          className="flex flex-col border rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow"
        >
          <span className="text-[11px] text-red-500 font-medium">
            {moment(meeting.start).format("MMM Do, YYYY")}
          </span>
          <div className="justify-between">
            <span className="text-sm font-semibold">{meeting.teacherName}</span>
            <div className="flex items-center text-[9px] text-gray-600">
              <span className="material-icons text-gray-400 mr-1">schedule</span>
              {moment(meeting.start).format("hh:mm A")} - {moment(meeting.end).format("hh:mm A")}
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-center text-gray-500">No meetings scheduled for this day.</p>
    )}
  </div>
</div>

        </div>
      </div>
    </BaseLayout3>
  );
};

export default Schedules;
