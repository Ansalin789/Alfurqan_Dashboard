"use client";

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdArrowDropdownCircle, IoMdClose} from "react-icons/io";

import { FaCalendarAlt, FaPlus } from "react-icons/fa";
import BaseLayout4 from "@/components/BaseLayout4";
import { useRouter } from "next/navigation";

const Meeting = () => {
  const dummyData = [
    {
      _id: "1",
      meetingName: "Math Class",
      teacher: [{ teacherName: "Mr. Smith" }],
      selectedDate: new Date(),
      startTime: "10:00 AM",
      endTime: "11:00 AM",
      meetingStatus: "Scheduled",
    },
    {
      _id: "2",
      meetingName: "Science Class",
      teacher: [{ teacherName: "Ms. Johnson" }],
      selectedDate: new Date(),
      startTime: "Re-Schedule Requested",
      endTime: "12:00 PM",
      meetingStatus: "Pending",
    },
    {
      _id: "3",
      meetingName: "History Class",
      teacher: [{ teacherName: "Mr. Brown" }],
      selectedDate: new Date(),
      startTime: "Completed",
      endTime: "1:00 PM",
      meetingStatus: "Completed",
    },
  ];

  const [activeTab, setActiveTab] = useState("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
 const [selectedDate, setSelectedDate] = useState<Date | null>(null);
 const router=useRouter();
 

  const upcomingClasses = dummyData.filter(
    (item) =>
      item.meetingStatus === "Scheduled" || item.meetingStatus === "Pending"
  );
  const completedData = dummyData.filter(
    (item) => item.meetingStatus === "Completed"
  );

  const dataToShow = activeTab === "upcoming" ? upcomingClasses : completedData;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataToShow.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dataToShow.length / itemsPerPage);



  const handleOptionsClick = (id: string) => {
    setSelectedItemId((prev) => (prev === id ? null : id));
    setIsDetailsModalOpen(true);
  };
  
  // Set the expected type for page number
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    router.push('/admin-main/ui/meeting/schedule');
  };

  const handleRescheduleSubmit = () => {
    setShowSuccess(true);
  
    setTimeout(() => {
      setShowSuccess(false);
      setIsRescheduleModalOpen(false);
    }, 3000); // hides message & closes modal after 3 seconds
  };
  


// Expect 'status' as a string
const getMeetingStatusClass = (status: string): string => {
    switch (status) {
      case "Scheduled":
        return "bg-[#1c355739] text-[#1C3557] border border-[#1C3557]";
      case "Pending":
        return "bg-[#fce1b6] text-[#8c5c04] border border-[#8c5c04]";
      case "Completed":
        return "bg-[#79d67a36] text-[#2a642b] border border-[#2a642b]";
      default:
        return "";
    }
  };

  const getMeetingStatusLabel = (status: string, time: string): string => {
    if (status === "Completed") return "Completed";
    if (status === "Pending") return "Re-Schedule Requested";
    return time;
  }
  

  // Dummy static detail data
  const meetingData = {
    meetingId: "1",
    selectedDate: new Date(),
    meetingName: "Math Class",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
  };

  const candidateData = {
    positionApplied: "Teacher",
  };

  const teachersByMeetingId = true;

  return (
    <BaseLayout4>
      <div className="p-4 mx-auto w-[1250px]">
        <div
          className={`${
            isRescheduleModalOpen ? "blur-sm" : ""
          } transition-all duration-200`}
        >
          <h1 className="text-xl font-semibold text-gray-800 p-2">
            Scheduled Meetings
          </h1>
          <div className="bg-white rounded-lg border-2 border-[#1C3557] h-[450px]  overflow-y-scroll scrollbar-none flex flex-col justify-between">
            {/* Tabs */}
            <div>
            <div className="flex p-4">
              <button
                className={`py-1 px-4 rounded-lg text-sm font-medium  ${
                  activeTab === "upcoming"
                    ? "bg-[#1C3557] text-white"
                    : "bg-transparent text-black"
                }`}
                onClick={() => setActiveTab("upcoming")}
              >
                Scheduled
              </button>
              <button
                className={`py-1 px-4 rounded-lg  text-sm font-medium ml-4 ${
                  activeTab === "completed"
                    ? "bg-[#1C3557] text-white"
                    : "bg-transparent text-black"
                }`}
                onClick={() => setActiveTab("completed")}
              >
                Completed
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
                    <span className="text-[14px]">
                      {selectedDate
                        ? selectedDate.toLocaleDateString()
                        : "Date"}
                    </span>
                    <IoMdArrowDropdownCircle />
                  </button>
                  {isDatePickerOpen && (
                    <div className="absolute right-0 z-10 mt-72">
                      <DatePicker
                         onChange={(date) => {
                            setSelectedDate(date);
                            setIsDatePickerOpen(false);
                          }}
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
                      {[
                        "MeetingId",
                        "MeetingName",
                        "Attendees",
                        "Date",
                        "ScheduleTime",
                        "Action",
                      ].map((header) => (
                        <th key={header} className="px-6 py-3 text-center">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, index) => (
                      <tr
                        key={index}
                        className={`text-[12px] font-medium mt-2 ${index % 2 === 0 ? 'bg-[#faf9f9]' : 'bg-[#ebebeb]'}`}
                      >
                        <td className="px-6 py-2 text-center">{item._id}</td>
                        <td className="px-6 py-2 text-center">
                          {item.meetingName}
                        </td>
                        <td className="px-6 py-2 text-center">
                          {" "}
                          {item.teacher
                            .map((teacher) => teacher.teacherName)
                            .join(", ")}
                        </td>
                        <td className="px-6 py-2 text-center">
                          {new Date(item.selectedDate).toISOString()}
                        </td>

                        <td className="px-6 py-2 text-center">
                          {activeTab === "upcoming" ? (
                            <>
                              {/* Completed Meeting - Show Start Time */}
                              <span
                                className={`text-[12px] px-4 py-1 rounded-lg border ${getMeetingStatusClass(
                                  item.meetingStatus
                                )}`}
                              >
                                {getMeetingStatusLabel(
                                  item.meetingStatus,
                                  item.startTime
                                )}
                              </span>

                              {/* View Details Dropdown */}
                            </>
                          ) : (
                            <>
                              {/* Upcoming Meetings */}
                              <button
                                className={`py-1 rounded-lg ${
                                  item.startTime === "Re-Schedule Requested"
                                    ? "bg-[#79d67a36] text-[#2a642b] border border-[#2a642b] px-3"
                                    : "bg-[#1c355739] text-[#1C3557] border border-[#1C3557] px-6"
                                }`}
                                onClick={() => {
                                  if (
                                    item.startTime === "Re-Schedule Requested"
                                  ) {
                                    setIsRescheduleModalOpen(true);
                                    setSelectedItemId(item._id);
                                  }
                                }}
                              >
                                {item.startTime}
                              </button>
                            </>
                          )}
                        </td>

                        <td className="px-6 py-2 text-center">
                          <button
                            className="text-xl ml-15"
                            onClick={() => handleOptionsClick(item._id)}
                          >
                            ...
                          </button>
                       </td>

                        <td className="px-6 py-2 text-center">
                          {activeTab === "upcoming" && (
                            <>
                              {/* <button 
                              className="text-xl"
                              onClick={() => handleOptionsClick(item.id)}
                            >
                              .
                            </button> */}
                              {selectedItemId === item._id && (
                                <div className="-ml-[180px] mt-2 w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                  <div className="py-1">
                                    <button
                                      className="block w-full text-left px-4 py-2 text-[12px] text-gray-700 hover:bg-gray-100"
                                      onClick={() => {
                                        setIsRescheduleModalOpen(true);
                                        setSelectedItemId(item._id);
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
                  Showing {indexOfFirstItem + 1}-
                  {Math.min(indexOfLastItem, dataToShow.length)} from{" "}
                  {dataToShow.length} data
                </p>
                <div className="flex space-x-2 text-[10px]">
                  <button
                    className={`px-2 py-1 rounded ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      className={`px-2 py-1 rounded ${
                        currentPage === index + 1
                          ? "bg-[#1B2B65] text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    className={`px-2 py-1 rounded ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
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

        {/* Add Meeting Modal */}

            {isMeetingModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-[390px] relative">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold text-[#1C3557]">Add Meeting</h2>

                    <button className="text-gray-500 hover:text-gray-700">
                       <button onClick={() => setIsMeetingModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                             <IoMdClose size={20} />
                       </button>
                    </button>
                </div>

                {/* Meeting Title */}
                <input
                    type="text"
                    className="w-full border rounded-xl p-2 mt-3 focus:outline-none focus:ring-2 focus:ring-[#1C3557]"
                    placeholder="Meeting Title"
                />

                {/* Date Picker */}
                <div className="flex items-center border rounded-xl p-2 mt-6">
                    <input
                    type="date"
                    className="w-full text-gray-600 focus:outline-none"
                    />
                </div>

                {/* Time Pickers */}
                <div className="flex items-center gap-2 mt-4">
                    <div>
                    <label className="block text-gray-700 text-sm">Start Time</label>
                    <input type="time" className="border rounded-lg p-2 w-full" />
                    </div>
                    <div>
                    <label className="block text-gray-700 text-sm">End Time</label>
                    <input type="time" className="border rounded-lg p-2 w-full" />
                    </div>
                </div>

                {/* Add Teachers Button */}
                <button className="flex items-center border text-[12px] rounded-xl p-2 cursor-pointer mt-4 pl-2">
                    <span className="w-4 h-4 bg-gray-400 rounded-full mr-1"></span> Add Teacher
                </button>

                {/* Teacher Modal */}
                {false && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-4 w-[300px] relative">
                        <button className="absolute top-2 right-3 text-gray-500 hover:text-gray-700">
                        ×
                        </button>

                        {/* Filter Buttons */}
                        <div className="flex space-x-4 mb-4">
                        {["Quran", "Arabic", "All"].map((label) => (
                            <button key={label} className="px-4 py-1 rounded-lg border">
                            {label}
                            </button>
                        ))}
                        </div>

                        {/* Teacher List */}
                        <div className="border p-2 rounded-md max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border-b">
                            <div className="flex items-center space-x-2">
                                <span className="w-5 h-5 bg-gray-300 rounded-full"></span>
                                <span className="text-gray-700 text-sm">Teacher {index + 1}</span>
                            </div>
                            <input type="checkbox" className="h-5 w-5" />
                            </div>
                        ))}
                        </div>

                        <button className="w-full mt-4 bg-[#1C3557] text-white py-2 rounded-lg hover:bg-[#15294a]">
                        Done
                        </button>
                    </div>
                    </div>
                )}

                {/* Description */}
                <textarea
                    className="w-full border rounded-xl p-2 mt-3 focus:outline-none focus:ring-2 focus:ring-[#1C3557]"
                    placeholder="Add Description"
                ></textarea>

                {/* Success Message */}
                {false && (
                    <div className="fixed flex items-center bg-[#dde0dd] border border-[#cdcfcd] text-[#191919] px-6 py-3 rounded-lg shadow-lg mt-4">
                    <div className="w-8 h-8 flex items-center justify-center bg-[#4CAF50] rounded-full">
                        <span className="text-white text-xl">✔</span>
                    </div>
                    <span className="ml-3 font-medium">Scheduled successfully</span>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex justify-between mt-4">
                    <button className="w-[45%] border border-gray-400 text-gray-700 py-2 rounded-md hover:bg-gray-100">
                    Cancel
                    </button>
                    <button className="w-[45%] bg-[#1C3557] text-white py-2 rounded-md hover:bg-[#15294a]">
                    Schedule
                    </button>
                </div>
                </div>
            </div>
            )}

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


      
      </div>
    </BaseLayout4>
  );
};

export default Meeting;
