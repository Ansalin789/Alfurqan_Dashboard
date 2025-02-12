'use client';

import React, { useState } from "react";
import { Calendar, dateFnsLocalizer, View, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import BaseLayout from "@/components/BaseLayout"
import { IoMdClose } from "react-icons/io";
import { FaCalendarAlt, FaUserCircle } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { User } from "lucide-react";

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
          <h2 className="text-2xl font-semibold text-gray-800 p-2">Class Schedule</h2>
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
          onClick={() => setIsMeetingModalOpen(false)}
        >
          Cancel
        </button>
        <button 
          className="w-[45%] bg-[#1C3557] text-white py-2 rounded-md hover:bg-[#15294a]"
          onClick={handleScheduleMeeting}
        >
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
              style={{ height: 540, width: 850 }}
              views={["month", "week", "day"]}
              view={"month" as View}
              onView={handleViewChange}
              components={{
                toolbar: (props) => (
                  <CustomToolbar {...props} onViewChange={handleViewChange} />
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

        <div className="w-100% md:w-[250px] flex flex-col gap-6 shadow-2xl rounded-lg bg-white overflow-y-auto h-[85vh] mt-12 scrollbar-none ml-12">
          {/* Today's Schedules */}
          <div className="p-4">
            <h3 className="text-[15px] font-semibold mb-4 text-center">Today's Schedules</h3>
            <div
              className="space-y-4"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#d1d5db #f3f4f6", // Custom scrollbar color for Firefox
              }}
            >
              {[...Array(4)].map((items) => (
                <div
                  key={items}
                  className="flex flex-col border rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow"
                >
                  <span className="text-[11px] text-red-500 font-medium">Jan 5th, 2024</span>
                  <div className="justify-between">
                    <span className="text-sm font-semibold">Abinesh</span>
                    <div className="flex items-center text-[9px] text-gray-600">
                      <span className="material-icons text-gray-400 mr-1">schedule</span>
                      {/* */}
                      07:00 - 10:00 PM
                    </div>
                  </div>
                  
                </div>
              ))}
            </div>

           
          </div>

          
        </div>

      </div>
    </BaseLayout>
  );
};

export default Schedules;
