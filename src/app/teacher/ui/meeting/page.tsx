"use client";

import React, { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdClose } from "react-icons/io";
import { useRouter } from "next/navigation";
import { FaEye, FaUserCircle } from "react-icons/fa";
import { CheckCircle, MoreVertical, Search, User, XCircle } from "lucide-react";
import BaseLayout from "@/components/BaseLayout";
import axios from "axios";
import Pagination from "@/components/Pagination";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { IoPersonOutline } from "react-icons/io5";
import { MdTune } from "react-icons/md";
import SuccessPopup from "../../../supervisor/components/successPopup";
import FailedPopup from "../../../supervisor/components/failedPopup";
import { setTime } from "react-datepicker/dist/date_utils";
import { getSocket } from "@/app/utils/socket";
import TeacherHeader from "../../components/TeacherHeader";
import NextMeetingSchedule from "../../components/NextMeetingSchedule";
import TeacherFilter from "../../components/TeacherFilter";

// Interface for Teacher (as object)
interface Teacher {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
}

// Interface for Student (Participant)
interface Participant {
  studentId: string; 
  studentName: string;
  studentEmail: string;
}

// Interface for each Meeting
interface Meeting {
  meetingminutes: string | number | readonly string[] | undefined;
  duration: string | number | readonly string[] | undefined;
  endTime: string;
  startTime: string;
  // selectedDate: any;
  _id: string;
  meetingId: string;
  meetingName: string;
  selectedDate: string; // ISO string
  // fromTime: string;
  // toTime: string;
  description: string;
  meetingStatus: "Scheduled" | "Rescheduled" | "Completed";
  status: string;
  createdDate: string; // ISO string
  createdBy: string;
  updatedDate: string; // ISO string
  updatedBy: string;
  teacher: Teacher; // Now an object
  participants: Participant[]; // Now an array
  __v?: number;
}

// Interface for the full response
interface MeetingResponse {
  totalCount: number;
  students: Meeting[];
}

const Meeting = () => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string>("upcoming");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [failedMessage, setFailedMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDatePickerOpens, setIsDatePickerOpens] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [completedData, setCompletedData] = useState<Meeting[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<Meeting[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [openTeacherDropdownId, setOpenTeacherDropdownId] = useState<
    string | null
  >(null);
  const [selectedMeetingDetails, setSelectedMeetingDetails] =
    useState<Meeting | null>(null);
  const [isMeetingDetailsModalOpen, setIsMeetingDetailsModalOpen] =
    useState(false);
  const [rescheduleDate, setRescheduleDate] = useState(""); // in 'YYYY-MM-DD' format
  const [rescheduleTime, setRescheduleTime] = useState(""); // in 'HH:mm' 24h format
  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [timing, setTiming] = useState("");
  const [status, setStatus] = useState("");

  const toggleTeacherDropdown = (id: string) => {
    setOpenTeacherDropdownId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenTeacherDropdownId(null); // Close dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [teachers, setTeachers] = useState<
    {
      id: string;
      name: string;
      subject: string;
      email: string;
    }[]
  >([]);
  console.log(isDatePickerOpens);

  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);

  // useEffect(() => {
  //   const token =
  //     typeof window !== "undefined"
  //       ? localStorage.getItem("SupervisorAuthToken")
  //       : null;

  //   if (!token) {
  //     console.error("❌ AdminAuthToken not found");
  //     return;
  //   }
  //   axios
  //     .get<{ totalCount: number; applicants: ApiResponse[] }>(
  //       "https://api.blackstoneinfomaticstech.com/applicants",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       console.log("API Response:", response.data); // ✅ Debugging step

  //       if (Array.isArray(response.data.applicants)) {
  //         const mappedTeachers = response.data.applicants.map((applicant) => ({
  //           id: applicant._id, // Use actual teacher ID
  //           name: `${applicant.candidateFirstName} ${applicant.candidateLastName}`,
  //           subject: applicant.positionApplied?.toLowerCase() || "unknown", // Prevents crashes if null
  //           email: applicant.candidateEmail || "no-email@example.com", // Use actual email
  //         }));
  //         setTeachers(mappedTeachers);
  //         console.log("Mapped Teachers:", mappedTeachers);
  //       } else {
  //         console.error("Unexpected API response format:", response.data);
  //       }
  //     })
  //     .catch((error) => console.error("Error fetching teachers:", error));
  // }, []);
 
useEffect(() => {
    const id = typeof window !== "undefined" ? localStorage.getItem("TeacherPortalID") : null;
    const socket = getSocket(id ?? '');
    const handleList = (data: { data: Meeting }) => {
        console.log("📩 Received WebSocket Data:", data);
        setUpcomingClasses(pre => [...pre, data.data]);
    };
    socket.on('addmeeting', handleList);
    return () => {
        socket.off('addmeeting', handleList);
    };
}, []);

// useEffect(() => {
//   const fetchMeetings = async () => {
//     try {
//       const token =
//         typeof window !== "undefined"
//           ? localStorage.getItem("TeacherAuthToken")
//           : null;

//       if (!token) {
//         console.error("❌ TeacherAuthToken not found");
//         return;
//       }

//       const response = await axios.get(
//         "http://localhost:5001/teacherMeetinglist",
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       console.log("🌐 Full API Response:", response.data);

//       if (
//         !response.data?.students ||
//         !Array.isArray(response.data.students)
//       ) {
//         console.error("🚨 Students array missing or not an array:", response.data);
//         return;
//       }

//       const allMeetings: Meeting[] = response.data.students;

//       console.log("✅ Extracted Meetings:", allMeetings);

//       const today = new Date();
//       today.setHours(0, 0, 0, 0); // Normalize for comparison

//       const upcomingMeetings = allMeetings
//         .filter((meeting) => {
//           if (!meeting.selectedDate || !meeting.meetingStatus) return false;

//           const meetingDate = new Date(meeting.selectedDate);
//           return (
//             (meeting.meetingStatus === "Scheduled" ||
//               meeting.meetingStatus === "Rescheduled") &&
//             meetingDate >= today
//           );
//         })
//         .sort(
//           (a, b) =>
//             new Date(a.selectedDate).getTime() -
//             new Date(b.selectedDate).getTime()
//         );

//       const completedMeetings = allMeetings.filter(
//         (meeting) => meeting.meetingStatus === "Completed"
//       );

//   const teachersMap: Record<string, any[]> = {};
//       allMeetings.forEach((meeting) => {
//         if (meeting.teacher && Array.isArray(meeting.teacher)) {
//           teachersMap[meeting.meetingId] = meeting.teacher;
//         }
//       });

//       // Set state after fetching
//       setUpcomingClasses(upcomingMeetings);
//       setCompletedData(completedMeetings);
//       setTeachersByMeetingId(teachersMap);


//       console.log("✅ Upcoming Meetings Set to State:", upcomingMeetings);
//       console.log("✅ Completed Meetings Set to State:", completedMeetings);
//     } catch (error) {
//       console.error("🚨 Error fetching meetings:", error);
//     }
//   };

//   fetchMeetings();
// }, []);

  interface Teacher {
    teacherId: string;
    teacherName: string;
    teacherEmail: string;
  }
  // Remove duplicate Teacher interface and teachersByMeetingId state, not needed since teacher is a single object

 type TeachersByMeetingId = Record<string, Teacher[]>;
  const [teachersByMeetingId, setTeachersByMeetingId] =
    useState<TeachersByMeetingId>({});

  // const filterMeetingsBySearch = (
  //   meetings: Meeting[],
  //   searchLower: string = searchText.toLowerCase()
  // ): Meeting[] => {
  //   return meetings.filter((meeting: Meeting) => {
  //     // Search in meeting name
  //     const nameMatch: boolean = meeting.meetingName.toLowerCase().includes(searchLower);

  //     // Search in attendee (teacher name)
  //     const attendeeMatch: boolean = meeting.teacher?.teacherName
  //       ? meeting.teacher.teacherName.toLowerCase().includes(searchLower)
  //       : false;

  //     // Search in date
  //     const dateMatch: boolean = new Date(meeting.selectedDate)
  //       .toLocaleDateString("en-US", {
  //         month: "short",
  //         day: "2-digit",
  //         year: "numeric",
  //       })
  //       .toLowerCase()
  //       .includes(searchLower);

  //     const timingMatch: boolean = !!meeting.startTime && meeting.startTime.toLowerCase().includes(searchLower);
    
  //     const statusMatch: boolean = meeting.meetingStatus.toLowerCase().includes(searchLower);

  //     return nameMatch || attendeeMatch || dateMatch || timingMatch || statusMatch;
  //   });
  // };

  // const dataToShow = filterMeetingsBySearch(
  //   activeTab === "upcoming" ? upcomingClasses || [] : completedData || []
  // );

  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = dataToShow.slice(indexOfFirstItem, indexOfLastItem);
  // const totalPages = Math.ceil(dataToShow.length / itemsPerPage);

  // const filteredApplicants =
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  // const currentApplicants = currentItems.slice(startIndex, endIndex);

  const handleRescheduleSubmit = async () => {
    if (
      !rescheduleReason.trim() ||
      !rescheduleDate ||
      !rescheduleTime ||
      !selectedItemId
    ) {
      alert("Please fill all fields");
      return;
    }
    
 try {
      const token = localStorage.getItem("TeacherAuthToken"); // or use context/auth provider
      const response = await fetch(
        `http://localhost:5001/updateTeacherMeeting/${selectedItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            selectedDate: rescheduleDate,
            startTime: rescheduleTime,
            description: rescheduleReason,
            meetingStatus: "Rescheduled",
          }),
        }
      );
console.log("Reschedule Date:", rescheduleDate);
console.log("Reschedule Time:", rescheduleTime);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update meeting");
      }

      // Update frontend UI
      setUpcomingClasses((prevClasses) =>
        prevClasses.map((item) =>
          item._id === selectedItemId
            ? {
                ...item,
                meetingStatus: "Re-Scheduled" as Meeting["meetingStatus"],
              }
            : item
        )
      );

      setSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setIsRescheduleModalOpen(false);
        setRescheduleReason("");
      }, 2000);
    } catch (error) {
      console.error("Error during rescheduling:", error);
      alert("Could not update meeting. Please try again.");
    }

//     try {
//       const token = localStorage.getItem("TeacherAuthToken");
//       const response = await axios.put(
//         `https://api.blackstoneinfomaticstech.com/updateTeacherMeeting/${selectedItemId}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             selectedDate: rescheduleDate,
//             startTime: rescheduleTime,
//             description: rescheduleReason,
//             meetingStatus: "Re-Scheduled",
//           }),
//         }
//       );
// console.log("Reschedule Date:", rescheduleDate);
// console.log("Reschedule Time:", rescheduleTime);

//       const result = response.data;

//       if (response.status !== 200) {
//         throw new Error(result.message || "Failed to update meeting");
//       }

//       // Update frontend UI
//       setUpcomingClasses((prevClasses) =>
//         prevClasses.map((item) =>
//           item._id === selectedItemId
//             ? {
//                 ...item,
//                 meetingStatus: "Rescheduled" as Meeting["meetingStatus"],
//               }
//             : item
//         )
//       );

//       setSuccess(true);

//       setTimeout(() => {
//         setShowSuccess(false);
//         setIsRescheduleModalOpen(false);
//         setRescheduleReason("");
//       }, 2000);
//     } catch (error) {
//       console.error("Error during rescheduling:", error);
//       alert("Could not update meeting. Please try again.");
//     }
  };

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // const getMeetingStatusClass = (status: string) => {
  //   switch (status) {
  //     case "Scheduled":
  //       return "text-[#377E36] bg-[#ECFDF3] dark:bg-[#323E31] dark:text-[#377E36] px-[18px]";
  //     case "Rescheduled":
  //       return "text-[#343E59] bg-[#E4E4E4] dark:bg-[#4F4F4F] dark:text-white";
  //     default:
  //       return "text-[#377E36] bg-[#ECFDF3]";
  //   }
  // };

  // const handleViewDetails = (meetingId: string) => {
  //   const meeting = completedData.find((m) => m._id === meetingId);
  //   if (meeting) {
  //     setSelectedMeetingDetails(meeting);
  //     setIsMeetingDetailsModalOpen(true);
  //   } else {
  //     console.error("Meeting not found for ID:", meetingId);
  //   }
  // };

  const isStartMeetingNow = (
    selectedDate: string,
    startTime: string | undefined,
    endTime: string | undefined
  ): boolean => {
    if (!startTime || !endTime) {
      console.warn("Missing startTime or endTime for meeting:", { selectedDate, startTime, endTime });
      return false;
    }

    const now = new Date();
    const date = new Date(selectedDate);

    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const start = new Date(date);
    start.setHours(startHour, startMin, 0, 0);

    const end = new Date(date);
    end.setHours(endHour, endMin, 0, 0);

    return now >= start && now <= end;
  };

  // const handleFilter = async () => {
  //   setShowModal(false);

  //   const token = localStorage.getItem("TeacherAuthToken");

  //   const params: any = {};
  //   if (fromDate) params["dateRange.from"] = fromDate;
  //   if (toDate) params["dateRange.to"] = toDate;
  //   if (timing) params["startTime"] = timing;
  //   if (status) params["meetingStatus"] = status;

  //   console.log("📤 Sending filter params:", params);

  //   // try {
  //   //   const response = await axios.get(
  //   //     "http://localhost:5001/teacherMeetinglist", // Use your backend URL here
  //   //     {
  //   //       headers: {
  //   //         Authorization: `Bearer ${token}`,
  //   //         "Content-Type": "application/json",
  //   //       },
  //   //       params,
  //   //     }
  //   //   );

  //   //   console.log("✅ Response:", response.data);

  //   //   // You can split meetings into upcoming/completed based on your logic
  //   //   const meetings: Meeting[] = response.data.meetings || [];

  //   //   setUpcomingClasses(
  //   //     meetings.filter((m: Meeting) => m.meetingStatus !== "Completed")
  //   //   );
  //   //   setCompletedData(
  //   //     meetings.filter((m: Meeting) => m.meetingStatus === "Completed")
  //   //   );
  //   // } catch (error) {
  //   //   console.error("❌ Error fetching filtered meetings:", error);
  //   // }
  // };

return (
  <BaseLayout>
    <TeacherHeader currentSection="Scheduled Meeting"/>
    <NextMeetingSchedule />
    {/* Tabs */}
 <TeacherFilter />
    </BaseLayout>
  );
};

export default Meeting;
function setTeachersByMeetingId(teachersMap: any) {
  throw new Error("Function not implemented.");
}

