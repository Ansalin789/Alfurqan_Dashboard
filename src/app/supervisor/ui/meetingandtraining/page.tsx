'use client';


import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdArrowDropdownCircle, IoMdClose } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { FaCalendarAlt,  FaPlus, FaUserCircle } from "react-icons/fa";
import { User } from "lucide-react";


const ScheduledClasses = () => {
  const router = useRouter();
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date | null>(null);

 
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);

  const [meetingTitle, setMeetingTitle] = useState("");

  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isDatePickerOpens, setIsDatePickerOpens] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedColor, setSelectedColor] = useState<string>("purple");

const colorOptions = [
  { color: "purple", hex: "#A259FF" },
  { color: "green", hex: "#4CAF50" },
  { color: "orange", hex: "#FFA500" },
  { color: "blue", hex: "#4285F4" }
];
  const [upcomingClasses, setUpcomingClasses] = useState([
    { id: 798, name: "Samantha William", course: "Tajweed Masterclass", date: "January 2, 2020", status: "Available at 7:30 AM" },
    { id: 799, name: "Jordan Nico", course: "Tajweed Masterclass", date: "January 2, 2020", status: "Available at 8:30 AM" },
    { id: 800, name: "Jordan Nico", course: "Tajweed Masterclass", date: "January 2, 2020", status: "Re-Schedule Requested" },
    { id: 801, name: "Jordan Nico", course: "Tajweed Masterclass", date: "January 2, 2020", status: "Available at 8:30 AM" },
    { id: 802, name: "Jordan Nico", course: "Tajweed Masterclass", date: "January 2, 2020", status: "Available at 8:30 AM" },
    { id: 803, name: "Jordan Nico", course: "Tajweed Masterclass", date: "January 2, 2020", status: "Available at 8:30 AM" },
    { id: 804, name: "Jordan Nico", course: "Tajweed Masterclass", date: "January 2, 2020", status: "Available at 8:30 AM" },
    { id: 805, name: "Jordan Nico", course: "Tajweed Masterclass", date: "January 2, 2020", status: "Available at 8:30 AM" },
  ]);

  const completedData = [
    { id: 803, name: "Samantha William", course: "Tajweed Masterclass", date: "January 2, 2020", status: "Completed" },
    { id: 804, name: "Jordan Nico", course: "Tajweed Masterclass", date: "January 2, 2020", status: "Completed" },
    { id: 805, name: "Nadila Adja", course: "Tajweed Masterclass", date: "January 2, 2020", status: "Completed" },
    { id: 806, name: "Nadila Adja", course: "Tajweed Masterclass", date: "January 2, 2020", status: "Completed" },
  ];

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

  const handleScheduleMeeting = () => {
    setIsSuccessMessageVisible(true);
    setTimeout(() => {
      setIsSuccessMessageVisible(false);
      setIsMeetingModalOpen(false);
    }, 2000);
  };

  const dataToShow = activeTab === "upcoming" ? upcomingClasses : completedData;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataToShow.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dataToShow.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleOptionsClick = (id: number) => {
    setSelectedItemId(selectedItemId === id ? null : id);
  };

  const handleRescheduleSubmit = () => {
    if (rescheduleReason.trim()) {
      setShowSuccess(true);
      setUpcomingClasses(prevClasses => 
        prevClasses.map(item => 
          item.id === selectedItemId 
            ? { ...item, status: "Re-Schedule Requested" }
            : item
        )
      );
      
      setTimeout(() => {
        setShowSuccess(false);
        setIsRescheduleModalOpen(false);
        setRescheduleReason("");
      }, 2000);
    }
  };

  const handleStatusClick = (status: string) => {
    if (status.includes('Available')) {
      router.push('/teacher/ui/liveclass'); // Replace with your desired route
    }
  };

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setSelectedDates(date);
      setIsDatePickerOpen(false);
      setIsDatePickerOpens(false);
      router.push('/teacher/ui/schedule/schedules');
    }
  };

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
 
  interface Attendee {
    name: string;
    present: boolean;
  }
  
  interface Meeting {
    id: number;
    name: string;
    course: string;
    date: string;
    status: string;
    attendance: Attendee[];  // Specify an array of Attendee objects
  }
  
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  

const [schedule] = useState(
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => ({
      day,
      startTime: "",
      duration: "", // Initial duration in hours from API
      endTime: "",
      isSelected: false, // Track if the day is selected
    }))
  );


  const colorTitles: Record<string, string> = {
    blue: "Interview",
    green: "Group Meeting",
    orange: "Teacher Meeting",
    purple: "Weekly Meeting",
  };
  const meetings: Meeting[] = [
    {
      id: 123456789,
      name: "Weekly Meeting",
      course: "Arabic",
      date: "January 2, 2025",
      status: "Completed",
      attendance: [
        { name: "Lucas Johnson", present: true },
        { name: "Emily Peterson", present: true },
        { name: "Hannah White", present: true },
        { name: "Oliver Martinez", present: true },
        { name: "Isabella Garcia", present: true },
        { name: "Ethan Lee", present: true },
        { name: "Sophia Wilson", present: false }, // Absent
      ],
    },
  ];
  

  const nextPage = () => {
    router.push('/supervisor/ui/meetingandtraining/schedule');
  };
  
  return (
    <div className="p-4">
      <div className={`${isRescheduleModalOpen ? 'blur-sm' : ''} transition-all duration-200`}>
        <h1 className="text-2xl font-semibold text-gray-800 p-2">Scheduled Classes</h1>
        <div className="bg-white rounded-lg border-2 border-[#1C3557] h-[450px] overflow-y-scroll scrollbar-none flex flex-col justify-between">
          {/* Tabs */}
          <div>
            <div className="flex">
              <button
                  className={`py-3 px-2 ml-5 ${
                  activeTab === "upcoming" ? "text-[#1C3557] border-b-2 border-[#1C3557] font-semibold" : "text-gray-600"
                  } focus:outline-none text-[13px]`}
                  onClick={() => setActiveTab("upcoming")}
              >
                  Upcoming ({upcomingClasses.length})
              </button>
              <button
                  className={`py-3 px-6 ${
                  activeTab === "completed" ? "text-[#1C3557] border-b-2 border-[#1C3557] font-semibold" : "text-gray-600"
                  } focus:outline-none text-[13px]`}
                  onClick={() => setActiveTab("completed")}
              >
                  Completed ({completedData.length})
              </button>
            </div>
            <div className="flex justify-end px-[50px] mt-[2px] h-6 relative">
              <button onClick={nextPage}>
            <FaCalendarAlt className="mr-2" />
            </button>
            <button className="bg-[#1C3557] text-white flex items-center text-[12px] px-3 py-3 rounded-md shadow-lg hover:bg-[#15294a]"
              onClick={() => setIsMeetingModalOpen(true)}
                >
                     <FaPlus className="mr-2" />   Add Meeting                 
            </button> &nbsp;
                    
              <div className="flex items-center border border-[#1C3557] rounded-md overflow-hidden">
                <button 
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="flex items-center space-x-2 shadow-lg p-1 rounded-lg text-gray-600 hover:text-gray-800"
                >
                  <span className="text-[14px]">{selectedDate ? selectedDate.toLocaleDateString() : "Date"}</span>
                  <IoMdArrowDropdownCircle />
                </button>
                {isDatePickerOpen && (
                  <div className="absolute right-0 z-10 mt-72">
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateSelect}
                      inline
                      className="border rounded-lg shadow-lg"
                      
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="border-b-[1px] border-[#1C3557] text-[12px] font-semibold">
                  <tr>
                    {["Id", "Name", "Courses", "Date", "Status"].map((header) => (
                      <th key={header} className="px-6 py-3 text-center">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr key={item.id} className="text-[12px] font-medium mt-2"
                    style={{ backgroundColor: "rgba(230, 233, 237, 0.22)" }}>
                      <td className="px-6 py-2 text-center">{item.id}</td>
                      <td className="px-6 py-2 text-center">{item.name}</td>
                      <td className="px-6 py-2 text-center">{item.course}</td>
                      <td className="px-6 py-2 text-center">{item.date}</td>
                      <td className="px-6 py-2 text-center relative">
                        {activeTab === "completed" ? (
                           <>
                          <span className="text-green-600 border text-[12px] border-green-600 bg-green-100 px-3 py-1 rounded-lg">
                     {item.status}
              </span>
              <button 
                 className="text-xl ml-2"
                  onClick={() => handleOptionsClick(item.id)}>...</button>
      {selectedItemId === item.id && (
        <div className="absolute right-0 mt-1 w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
          <button
  className="block w-full text-left px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-100"
  onClick={() => {
    setSelectedMeeting(meetings[0]); // Store meeting details
    setIsDetailsModalOpen(true); // Open modal
  }}
>
  View Details
</button>
            <button
              className="block w-full text-left px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-100"
              onClick={() => {
                // Example action: Download Report
                console.log("Cancel");
                setSelectedItemId(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  ) : (
    <button 
      onClick={() => handleStatusClick(item.status)}
      className={`${
        item.status === "Re-Schedule Requested" 
          ? "bg-[#79d67a36] text-[#2a642b] border border-[#2a642b] px-3" 
          : "bg-[#1c355739] text-[#1C3557] border border-[#1C3557] px-6"
      } py-1 rounded-lg`}
    >
      {item.status}
    </button>
  )}
</td>
{isDetailsModalOpen && selectedMeeting && (
  <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 text-sm">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-h-[90vh] overflow-auto relative">
      
      {/* Close Button */}
      <button 
        className="absolute top-2 right-2 text-gray-500 hover:text-black text-sm"
        onClick={() => setIsDetailsModalOpen(false)}
      >
        ❌
      </button>

      {/* Title */}
      <h2 className="text-lg font-semibold text-center mb-4">Meeting Details</h2>

      {/* Attendance Info */}
      <div className="border rounded-lg p-4 bg-gray-100">
  <h3 className="text-base font-semibold mb-2">Attendance</h3>

  {/* Table for Proper Alignment */}
  <table className="w-full border-collapse text-sm">
    <tbody>
      {/* Meeting ID & Date */}
      <tr>
        <th className="text-left text-[13px] pr-2">Meeting ID:</th>
        <td className="bg-blue-900 text-white px-2 py-[2px] rounded-lg font-medium text-[10px]">
          {selectedMeeting.id}
        </td>
        
        <th className="text-left text-[13px] pr-2">Date:</th>
        <td className="bg-blue-900 text-white px-2 py-[2px] rounded-lg font-medium text-[10px]">
          {selectedMeeting.date}
        </td>
      </tr>
<br />
      {/* Meeting Name & Duration */}
      <tr>
        <th className="text-left text-[13px] pr-2">Meeting Name:</th>
        <td className="bg-blue-900 text-white px-2 py-[2px] rounded-lg font-medium text-[10px]">
          Weekly Meeting
        </td>
        <th className="text-left text-[13px] pr-2">Duration:</th>
        <td className="bg-blue-900 text-white px-2 py-[2px] rounded-lg font-medium text-[10px]">
          60 Minutes
        </td>
      </tr>
      <br />
      {/* Course */}
      <tr>
        <th className="text-left text-[13px] pr-2">Course:</th>
        <td className="bg-blue-900 text-white px-2 py-[2px] rounded-lg font-medium text-[10px]" >
          Arabic
        </td>
      </tr>
      <br />
      {/* Start Time & End Time */}
      <tr>
        <th className="text-left text-[13px] pr-2">Start Time:</th>
        <td className="bg-blue-900 text-white px-2 py-[2px] rounded-lg font-medium text-[10px]">
          9:00 AM
        </td>
        <th className="text-left text-[13px] pr-2">End Time:</th>
        <td className="bg-blue-900 text-white px-2 py-[2px] rounded-lg font-medium text-[10px]">
          10:00 AM
        </td>
      </tr>
    </tbody>
  </table>
</div>


      {/* Attendance Table */}
      <div className="mt-4">
        <h3 className="text-base font-medium">Attendance</h3>
        <div className="border rounded-lg p-2 bg-white max-h-40 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-200">
                <th className="text-left p-2">Name</th>
                <th className="text-center p-2">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {selectedMeeting?.attendance?.map((attendee) => (
                <tr key={attendee.name} className="border-b text-sm">
                  <td className="p-2">{attendee.name}</td>
                  <td className="p-2 text-center">
                    {attendee.present ? (
                      <span className="w-5 h-5 bg-blue-500 text-white font-bold rounded-full flex items-center justify-center text-xs">
                        ✔
                      </span>
                    ) : (
                      <span className="w-5 h-5 bg-red-500 text-white font-bold rounded-full flex items-center justify-center text-xs">
                        ✖
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Meeting Minutes */}
      <div className="mt-4">
        <h3 className="text-base font-medium">Meeting Minutes</h3>
        <textarea 
          className="w-full h-20 border rounded-lg p-2 text-sm bg-slate-300"
          placeholder="Enter meeting minutes..."
        ></textarea>
      </div>

    </div>
  </div>
)}






                      <td className="px-6 py-2 text-center">
                        {activeTab === "upcoming" && (
                          <>
                            <button 
                              className="text-xl"
                              onClick={() => handleOptionsClick(item.id)}
                            >
                              ...
                            </button>
                            {selectedItemId === item.id && (
                              <div className="absolute right-0 mt-1 w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1">
                                  <button
                                    className="block w-full text-left px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-100"
                                    onClick={() => {
                                      setIsRescheduleModalOpen(true);
                                      setSelectedItemId(item.id);
                                    }}
                                  >
                                    Request
                                  </button>
                                  <button
                                    className="block w-full text-left px-4 py-2 text-[12px] text-[#a72222] hover:bg-gray-100"
                                    onClick={() => {
                                      setSelectedItemId(null);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center p-4">
              <p className="text-[10px] text-gray-600">
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, dataToShow.length)} from {dataToShow.length} data
              </p>
              <div className="flex space-x-2 text-[10px]">
                <button 
                  className={`px-2 py-1 rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300'}`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    className={`px-2 py-1 rounded ${
                      currentPage === index + 1 ? 'bg-[#1B2B65] text-white' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button 
                  className={`px-2 py-1 rounded ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 hover:bg-gray-300'}`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      {isRescheduleModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="bg-gray-100 rounded-3xl p-6 w-96 relative z-50">
            <h2 className="text-xl mb-4 text-gray-700">Reason for Re-Schedule</h2>
            {showSuccess ? (
              <div className="bg-[#108422] text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2 mb-4 mx-auto max-w-[280px]">
                <img src="/assets/images/success.png" alt="" /><span>Request Has Been Sent to Admin</span>
              </div>
            ) : (
              <>
                <textarea
                  className="w-full p-4 border rounded-2xl mb-4 h-32 resize-none bg-white"
                  placeholder="Type here..."
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                />
                <button
                  onClick={handleRescheduleSubmit}
                  className="w-32 bg-[#1B2B65] text-white py-2 rounded-full hover:bg-[#0f1839] mx-auto block"
                >
                  Submit
                </button>
              </>
            )}
          </div>
        </div>
      )}

 {isMeetingModalOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 ">
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
  
               <button onClick={() => setIsMeetingModalOpen(false)} className="text-gray-500 hover:text-gray-700">
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
             <FaCalendarAlt className="text-gray-500 mr-2" onClick={() => setIsDatePickerOpens(!isDatePickerOpens)} />
              <span className="text-gray-600 w-full">{selectedDates ? selectedDates.toLocaleDateString() : "Select Date"}</span>
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
 
             {/* Time Pickers */}
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
 
             {/* Add Teachers Button */}

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
             {/* Selected Teachers */}
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
               <button className="w-[45%] bg-[#1C3557] text-white py-2 rounded-md hover:bg-[#15294a]"
               onClick={handleScheduleMeeting} >
                 Schedule
               </button>
             </div>
           </div>
         </div>
       )}




    </div>
  );
};

export default ScheduledClasses;
