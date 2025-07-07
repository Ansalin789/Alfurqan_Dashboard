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
import TeacherHeader from "@/app/teacher/components/TeacherHeader";
import NextMeetingSchedule from "../../components/meetings/NextMeetingScheduke";
import ScheduledMeetings from "../../components/meetings/ScheduledMeetings";

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

  useEffect(() => {
    const id =
      typeof window !== "undefined"
        ? localStorage.getItem("TeacherPortalID")
        : null;
    const socket = getSocket(id ?? "");
    const handleList = (data: { data: Meeting }) => {
      console.log("📩 Received WebSocket Data:", data);
      setUpcomingClasses((pre) => [...pre, data.data]);
    };
    socket.on("addmeeting", handleList);
    return () => {
      socket.off("addmeeting", handleList);
    };
  }, []);

  interface Teacher {
    teacherId: string;
    teacherName: string;
    teacherEmail: string;
  }

  type TeachersByMeetingId = Record<string, Teacher[]>;
  const [teachersByMeetingId, setTeachersByMeetingId] =
    useState<TeachersByMeetingId>({});

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
  };

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const isStartMeetingNow = (
    selectedDate: string,
    startTime: string | undefined,
    endTime: string | undefined
  ): boolean => {
    if (!startTime || !endTime) {
      console.warn("Missing startTime or endTime for meeting:", {
        selectedDate,
        startTime,
        endTime,
      });
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

  return (
    <BaseLayout>
      <TeacherHeader currentSection="Scheduled Meeting" />
      <NextMeetingSchedule />
      {/* Tabs */}
      <ScheduledMeetings/>
    </BaseLayout>
  );
};

export default Meeting;
function setTeachersByMeetingId(teachersMap: any) {
  throw new Error("Function not implemented.");
}
