'use client';


import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdArrowDropdownCircle, IoMdClose } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { FaCalendarAlt,  FaPlus, FaUserCircle } from "react-icons/fa";
import { User } from "lucide-react";
import BaseLayout3 from "@/components/BaseLayout3";
import { button } from "@nextui-org/react";
import axios from "axios";
interface ApiResponse {
  candidateFirstName: string;
  candidateLastName: string;
  positionApplied: string; // Use this field to determine the subject
  _id: string;
  candidateEmail:string;
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




const ScheduledClasses = () => {
  const router = useRouter();
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date | null>(null);

 
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);

  const [meetingTitle, setMeetingTitle] = useState("");

  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isDatePickerOpens, setIsDatePickerOpens] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:30");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const [completedData, setCompletedData] = useState<Meeting[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<Meeting[]>([]);

  const [selectedColor, setSelectedColor] = useState<string>("purple");

const colorOptions = [
  { color: "purple", hex: "#A259FF" },
  { color: "green", hex: "#4CAF50" },
  { color: "orange", hex: "#FFA500" },
  { color: "blue", hex: "#4285F4" }
];
  

  

  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "Arabic Teacher" | "Quran Teacher">("all");
  const [teachers, setTeachers] = useState<{ 
    id: string; 
    name: string; 
    subject: string;
    email: string;
  }[]>([]);
  console.log(isDatePickerOpens);
  
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  useEffect(() => {
    axios
      .get<{ totalCount: number; applicants: ApiResponse[] }>("https://alfurqanacademy.tech/applicants", {
        headers: { Authorization: `Bearer ${localStorage.getItem("SupervisorAuthToken")}` },
      })
      .then((response) => {
        console.log("API Response:", response.data); // ✅ Debugging step
  
        if (Array.isArray(response.data.applicants)) {
          const mappedTeachers = response.data.applicants.map((applicant) => ({
            id: applicant._id,  // Use actual teacher ID
            name: `${applicant.candidateFirstName} ${applicant.candidateLastName}`,
            subject: applicant.positionApplied?.toLowerCase() || "unknown", // Prevents crashes if null
            email: applicant.candidateEmail || "no-email@example.com", // Use actual email
          }));
          setTeachers(mappedTeachers);
          console.log("Mapped Teachers:", mappedTeachers);
        } else {
          console.error("Unexpected API response format:", response.data);
        }
      })
      .catch((error) => console.error("Error fetching teachers:", error));
  }, []);
  
  useEffect(() => {
    const fetchMeetings = async () => {
        try {
            const response = await axios.get("https://alfurqanacademy.tech/allMeetings", {
                headers: { "Content-Type": "application/json" },
            });

            console.log("Full API Response:", response.data);

            if (!response.data?.data?.meetings || !Array.isArray(response.data.data.meetings)) {
                console.error("🚨 Meetings array missing or not an array:", response.data);
                return;
            }

            const allMeetings: Meeting[] = response.data.data.meetings;

            console.log("✅ Extracted Meetings:", allMeetings);

            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize for comparison

            // ✅ Use `meetingStatus` instead of `status`
            const upcomingMeetings = allMeetings
                .filter((meeting) => {
                    if (!meeting.selectedDate || !meeting.meetingStatus) return false;

                    const meetingDate = new Date(meeting.selectedDate);
                    return (meeting.meetingStatus === "Scheduled" || meeting.meetingStatus === "Reschedule") &&
                        meetingDate >= today;
                })
                .sort((a, b) => new Date(a.selectedDate).getTime() - new Date(b.selectedDate).getTime());

            const completedMeetings = allMeetings.filter(
                (meeting) => meeting.meetingStatus === "Completed"
            );

            // ✅ Extract & Group Teachers by Meeting ID
            const teachersMap: Record<string, any[]> = {};
            allMeetings.forEach(meeting => {
                if (meeting.teacher && Array.isArray(meeting.teacher)) {
                    teachersMap[meeting.meetingId] = meeting.teacher;
                }
            });

            setUpcomingClasses(upcomingMeetings);
            setCompletedData(completedMeetings);
            setTeachersByMeetingId(teachersMap);

            console.log("✅ Teachers Mapped by Meeting ID:", teachersMap);
            console.log("✅ Upcoming Meetings Set to State:", upcomingMeetings);
            console.log("✅ Completed Meetings Set to State:", completedMeetings);
        } catch (error) {
            console.error("🚨 Error fetching meetings:", error);
        }
    };

    fetchMeetings();
}, []);
interface Teacher {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
}
type TeachersByMeetingId = Record<string, Teacher[]>;
const [teachersByMeetingId, setTeachersByMeetingId] = useState<TeachersByMeetingId>({});


  // Filter teachers based on the selected filter
  const filteredTeachers =
  selectedFilter === "all"
    ? teachers
    : teachers.filter((t) => {
        const normalizedSubject = t.subject.trim(); // Normalize subject
        return selectedFilter.includes(normalizedSubject); // Check if filter includes it
      });

  // Toggle teacher selection
  const toggleSelections = (teacherName: string) => {
    setSelectedTeachers((prev) =>
      prev.includes(teacherName) ? prev.filter((t) => t !== teacherName) : [...prev, teacherName]
    );
  };
  useEffect(()=>{
    console.log(selectedTeachers);
    console.log(teachers);
  },[teachers]);
  

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

  const handleOptionsClick = (id: string) => {
    setSelectedItemId(selectedItemId === id ? null : id);
  };

  const handleRescheduleSubmit = () => {
    if (rescheduleReason.trim()) {
      setShowSuccess(true);
      setUpcomingClasses(prevClasses => 
        prevClasses.map(item => 
          item._id === selectedItemId 
            ? { ...item, status: "Rescheduled" as Meeting["meetingStatus"] }
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
 
  

  const colorTitles: Record<string, string> = {
    blue: "Interview",
    green: "Group Meeting",
    orange: "Teacher Meeting",
    purple: "Weekly Meeting",
  };
  
  const nextPage = () => {
    router.push('/supervisor/ui/meetingandtraining/schedule');
  };
  
  const handleScheduleMeeting1 = async () => {
    if (!meetingTitle || !selectedDates || !startTime || !endTime || selectedTeachers.length === 0) {
        alert("Please fill all required fields!");
        return;
    }

    const formattedDate = selectedDates.toISOString();
    const createdDate = new Date().toISOString();

    const requestData = {
        meetingId: `weeklymeeting-${localStorage.getItem("SupervisorPortalId")}`,
        meetingName: meetingTitle,
        selectedDate: formattedDate,
        startTime,
        endTime,
        meetingStatus: "Scheduled",
        supervisor: {
            supervisorId: localStorage.getItem('SupervisorPortalId'),
            supervisorName: localStorage.getItem('SupervisorPortalName'),
            supervisorEmail: "arthi.blackstoneinfomatics@gmail.com",
            supervisorRole: "SUPERVISOR",
        },
        teacher: selectedTeachers.map((teacherName) => {
            const teacherDetails = teachers.find((t) => t.name === teacherName);
            return {
                teacherId: teacherDetails?.id ?? "UNKNOWN_ID",
                teacherName: teacherName,
                teacherEmail: teacherDetails?.email ?? "no-email@example.com",
                _id: teacherDetails?.id
            };
        }),
        description,
        status: "Active",
        createdDate,
        createdBy: localStorage.getItem('SupervisorPortalName')
    };

    console.log(requestData);

    try {
        const response = await axios.post("https://alfurqanacademy.tech/addMeeting", requestData);
        if (response.status === 200 || response.status === 201 || response.status === 400) {
          setIsMeetingModalOpen(false);
            
            setTimeout(() => {
              setIsSuccessMessageVisible(true);
                // Reset form fields after successful submission
                setMeetingTitle("");
                setSelectedDates(null);
                setStartTime("");
                setEndTime("");
                setSelectedTeachers([]);
                setDescription("");
            }, 2000);
        }
    } catch (error) {
        console.error("Error scheduling meeting:", error);
        setIsMeetingModalOpen(false);
        
        setTimeout(() => {
          setIsSuccessMessageVisible(true);
            setMeetingTitle("");
                setSelectedDates(null);
                setStartTime("");
                setEndTime("");
                setSelectedTeachers([]);
                setDescription("");
        }, 2000);
    }
    setIsSuccessMessageVisible(false);
};
const getMeetingStatusClass = (status: string) => {
  switch (status) {
    case "Scheduled":
      return "text-green-600 border-green-600 bg-green-100";
    case "Reschedule":
      return "text-blue-600 border-blue-600 bg-blue-100";
    default:
      return "text-orange-600 border-orange-600 bg-orange-100";
  }
};

const getMeetingStatusLabel = (status: string, startTime: string) => {
  if (status === "Scheduled") return startTime;
  if (status === "Reschedule") return "Rescheduled";
  return "Started";
};

  
  return (
    <BaseLayout3>
    <div className="p-4 mx-auto w-[1250px]">
      <div className={`${isRescheduleModalOpen ? 'blur-sm' : ''} transition-all duration-200`}>
        <h1 className="text-2xl font-semibold text-gray-800 p-2">Scheduled Classes</h1>
        <div className="bg-white rounded-lg border-2 border-[#1C3557] h-[450px]  overflow-y-scroll scrollbar-none flex flex-col justify-between">
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
                    {["MeetingId", "MeetingName","Attendees", "Date", "ScheduleTime","Action"].map((header) => (
                      <th key={header} className="px-6 py-3 text-center">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr key={item._id} className="text-[12px] font-medium mt-2"
                    style={{ backgroundColor: "rgba(230, 233, 237, 0.22)" }}>
                      <td className="px-6 py-2 text-center">{item._id}</td>
                      <td className="px-6 py-2 text-center">{item.meetingName}</td>
                      <td className="px-6 py-2 text-center">  {item.teacher.map((teacher) => teacher.teacherName).join(", ")}
                      </td>
                      <td className="px-6 py-2 text-center">{new Date(item.selectedDate).toISOString()}</td>
                      
                      <td className="px-6 py-2 text-center">
                      {activeTab === "upcoming" ? (
                        <>
                          {/* Completed Meeting - Show Start Time */}
                          <span
                    className={`text-[12px] px-3 py-1 rounded-lg border ${getMeetingStatusClass(item.meetingStatus)}`}
                              >
                            {getMeetingStatusLabel(item.meetingStatus, item.startTime)}
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
                              if (item.startTime === "Re-Schedule Requested") {
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
                  onClick={() => handleOptionsClick(item._id)}>...</button>
                      {isDetailsModalOpen && teachersByMeetingId && (
                        <div className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center z-50 text-sm">
                            <div className="bg-white p-4 rounded-lg shadow-lg w-[650px] max-h-[90vh]  relative">
                              
                              {/* Close Button */}
                              <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-black text-sm"
                                onClick={() => setIsDetailsModalOpen(false)}
                              >
                                ❌
                              </button>

                              {/* Title */}
                              <h2 className="text-[15px] font-semibold text-center mb-4">
                                Meeting Details
                              </h2>

                              {/* Attendance Info */}
                              <div className="rounded-lg p-4 w-full">
                                <h3 className="text-[15px] font-semibold mb-2">Attendance</h3>

                                {/* Grid for Proper Alignment */}
                                <div className="grid grid-cols-6 gap-2 p-2 rounded-lg">
                                  <div className="font-medium text-[10px]">Meeting ID:</div>
                                  <div className="bg-[#012A4A] text-white px-2 py-1 rounded-lg text-center text-[10px] col-span-2">
                                    123
                                  </div>

                                  <div className="font-medium text-[10px]">Date:</div>
                                  <div className="bg-[#012A4A] text-white px-2 py-1 rounded-lg text-center text-[10px] col-span-2">
                                    16/04/2003
                                  </div>

                                  <div className="font-medium text-[10px]">Meeting Name:</div>
                                  <div className="bg-[#012A4A] text-white px-2 py-1 rounded-lg text-center text-[10px] col-span-2">
                                    Weekly Meeting
                                  </div>

                                  <div className="font-medium text-[10px]">Duration:</div>
                                  <div className="bg-[#012A4A] text-white px-2 py-1 rounded-lg text-center text-[10px] col-span-2">
                                    60 Minutes
                                  </div>

                                  <div className="font-medium text-[10px]">Course:</div>
                                  <div className="bg-[#012A4A] text-white px-2 py-1 rounded-lg text-center text-[10px]">
                                    Arabic
                                  </div>

                                  <div className="font-medium text-[10px]">Start Time:</div>
                                  <div className="bg-[#012A4A] text-white px-2 py-1 rounded-lg text-center text-[10px]">
                                    9:00 AM
                                  </div>

                                  <div className="font-medium text-[10px]">End Time:</div>
                                  <div className="bg-[#012A4A] text-white px-2 py-1 rounded-lg text-center text-[10px]">
                                    10:00 AM
                                  </div>
                                </div>
                              </div>

                              {/* Attendance Table */}
                              <div className="mt-4">
                                {/* <h3 className="text-base font-medium">Attendance</h3> */}

                                <div className="border rounded-lg p-0  bg-white max-h-60 overflow-auto scrollbar-thin">
                                <table className="w-full text-sm">
                        {/* Table Header */}
                        <thead>
                          <tr className="border-b bg-[#c3ebfa85] text-gray-700">
                            <th className="text-left p-3 w-3/4">Name</th>
                            <span className="-ml-10"><th className="text-center p-3 w-1/3">Attendance</th></span>
                          </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
  {Array.isArray(teachersByMeetingId) &&
    teachersByMeetingId.map((teacher: Teacher) => (
      <tr key={teacher.teacherId || teacher.teacherName} className="border-b text-[13px]">
        {/* Name with Profile Icon - Justify Between Applied Here */}
        <td className="p-3 flex items-center space-x-2 w-3/4">
          <span className="w-4 h-4 bg-blue-900 text-white rounded-full flex items-center justify-center">
            🧑‍💼 {/* Replace with an actual profile icon */}
          </span>
          <span className="flex-grow text-[12px]">{teacher.teacherName || "N/A"}</span>
        </td>

        {/* Attendance Status - Centered */}
        <td className="p-3 text-center w-1/3">
          {teacher.teacherName ? (
            <span className="w-4 h-4 bg-[#4ABDE8] text-white font-bold rounded-full flex items-center justify-center text-[8px]">
              ✔
            </span>
          ) : (
            <span className="w-4 h-4 bg-red-500 text-white font-bold rounded-full flex items-center justify-center text-[8px]">
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
                                <h3 className="text-[15px] font-medium mb-2">Meeting Minutes</h3>
                                <textarea
                                  className="w-full h-20 border rounded-lg p-2 text-xs bg-[#D9D9D9]"
                                  placeholder="Enter meeting minutes..."
                                ></textarea>
                              </div>
                            </div>
                          </div>
                      )}
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
                              <div className="absolute right-35  w-24 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
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
              <input
                type="date"
                className="w-full text-gray-600 focus:outline-none"
                value={selectedDates ? selectedDates.toISOString().split("T")[0] : ""}
                onChange={(e) => setSelectedDates(new Date(e.target.value))}
              />
            </div>

            {/* Time Pickers */}
            <div className="flex items-center gap-2 mt-4">
              <div>
                <label htmlFor='sajibaiu' className="block text-gray-700 text-sm">Start Time</label>
                <input
                  type="time"
                  className="border rounded-lg p-2 w-full"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor='sajibaiu' className="block text-gray-700 text-sm">End Time</label>
                <input
                  type="time"
                  className="border rounded-lg p-2 w-full"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
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
                className={`px-4 py-1 rounded-lg ${selectedFilter === "Quran Teacher" ? "bg-gray-500 text-white" : "border"}`}
                onClick={() => setSelectedFilter("Quran Teacher")}
              >
                Quran
              </button>
              <button
                className={`px-4 py-1 rounded-lg ${selectedFilter === "Arabic Teacher" ? "bg-gray-500 text-white" : "border"}`}
                onClick={() => setSelectedFilter("Arabic Teacher")}
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
              {filteredTeachers.map((teacher,index) => (
                <div key={`${teacher.name}-${index}`} className="flex items-center justify-between p-2 border-b last:border-none">
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
               onClick={handleScheduleMeeting1} >
                 Schedule
               </button>
             </div>
           </div>
         </div>
       )}




    </div>
    </BaseLayout3>
  );
};

export default ScheduledClasses;
