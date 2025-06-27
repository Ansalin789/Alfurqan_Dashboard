"use client";
import React, { useState, useEffect, useRef } from "react";
import { Timer, ChevronDown, LogOut } from "lucide-react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import BaseLayout from "@/components/BaseLayout";
import axios from "axios";
import Link from "next/link";
import NextTrailSession from "../../components/NextTrailSession";
import TeacherHeader from "../../components/TeacherHeader";
import { useSearchParams } from "next/navigation";

interface Student {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  city: string;
  country: string;
  trailId: string;
  course: string;
  classStatus: string;
}

interface Teacher {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
}

interface ClassData {
  _id: string;
  student: Student;
  teacher: Teacher;
  classDay: string[]; // Keep this as an array of strings
  package: string;
  preferedTeacher: string;
  totalHourse: number;
  startDate: string;
  endDate: string;
  startTime: string[]; // Array of strings for startTime
  endTime: string[]; // Array of strings for endTime
  scheduleStatus: string;
  classLink: string;
  sessionStatus: string;
  status: string;
  createdBy: string;
  createdDate: string;
  lastUpdatedDate: string;
  __v: number;
}
interface ApiResponse {
  totalCount: number;
  classSchedule: ClassData[];
}
interface Attendance {
  id: string | null;
  studentId: string;
  name: string;
  startTime: string | null;
  endTime: string | null;
  joined: boolean;
  joinTime: string;
  leaveTime: string;
}
interface FormData {
  _id: string;
  student: {
    studentId: string;
    studentFirstName: string;
    studentLastName: string;
    studentEmail: string;
    studentGender: string;
    studentPhone: number;
    studentCity: string;
    studentCountry: string;
    studentCountryCode: string;
    learningInterest: string;
    numberOfStudents: number;
    preferredTeacher: string;
    preferredFromTime: string;
    preferredToTime: string;
    timeZone: string;
    referralSource: string;
    preferredDate: string; // ISO date string
    evaluationStatus: string;
    status: string;
    createdDate: string; // ISO date string
    createdBy: string;
  };
  isLanguageLevel: boolean;
  languageLevel: string;
  isReadingLevel: boolean;
  readingLevel: string;
  isGrammarLevel: boolean;
  grammarLevel: string;
  hours: number;
  subscription: {
    subscriptionName: string;
  };
  planTotalPrice: number;
  classStartDate: string; // ISO date string
  classEndDate: string; // ISO date string
  classStartTime: string;
  classEndTime: string;
  accomplishmentTime: string;
  studentRate: number;
  gardianName: string;
  gardianEmail: string;
  gardianPhone: string;
  gardianCity: string;
  gardianCountry: string;
  gardianTimeZone: string;
  gardianLanguage: string;
  assignedTeacher: string;
  assignedTeacherId: string;
  assignedTeacherEmail: string;
  studentStatus: string;
  classStatus: string;
  comments: string;
  trialClassStatus: string;
  invoiceStatus: string;
  paymentLink: string;
  paymentStatus: string;
  status: string;
  createdDate: string; // ISO date string
  createdBy: string;
  updatedDate: string; // ISO date string
  updatedBy: string;
  expectedFinishingDate: number;
  __v: number;
}

interface TrialClass {
  _id: string;
  trialId: string;
  subject: string;
  meetingLocation: string;
  classType: string;
  meetingType: string;
  meetingLink: string;
  isScheduledMeeting: boolean;
  scheduledStartDate: string;
  scheduledEndDate: string;
  scheduledFrom: string;
  scheduledTo: string;
  timeZone: string;
  description: string;
  meetingStatus: string;
  studentResponse: string;
  status: string;
  createdDate: string;
  createdBy: string;
  lastUpdatedDate: string;
  lastUpdatedBy: string;
  __v: number;

  academicCoach: {
    academicCoachId: string | null;
    name: string | null;
    email: string | null;
  };

  teacher: {
    teacherId: string;
    name: string;
    email: string;
  };

  student: {
    studentId: string;
    name: string;
    city: string;
    country: string;
  };

  course: {
    courseId: string;
    courseName: string;
  };
}

function LiveClass() {
  const [showFeedback, setShowFeedback] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [ratings, setRatings] = useState([0, 0, 0]);
  const [feedback, setFeedback] = useState("");
  const [startTime, setStartTime] = useState<string | null>(null);
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [isFormData, setIsFormData] = useState(true);
  const [roomName, setRoomName] = useState("");
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [formData, setFormData] = useState<FormData>();
  const [trialClassStatus, setTrialClassStatus] = useState("");
  const [studentStatus, setStudentStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentLink, setPaymentLink] = useState("");

  const [options, setOptions] = useState({
    trialClassStatus: ["PENDING", "INPROGRESS", "COMPLETED"],
    studentStatus: ["JOINED", "NOT JOINED", "WAITING"],
    paymentStatus: ["PAID", "FAILED", "PENDING"],
  });

  const [trials, setTrials] = useState<TrialClass[]>([]);
  const [selectedTrial, setSelectedTrial] = useState<TrialClass | null>(null);
  const fullName = selectedTrial?.student.name || "";
  const [firstName, ...lastNameParts] = fullName.trim().split(" ");
  const lastName = lastNameParts.join(" ");

  useEffect(() => {
    const teacherId = localStorage.getItem("TeacherPortalId");
    const token = localStorage.getItem("TeacherAuthToken");

    if (!teacherId) {
      console.error("❌ TeacherId not found in localStorage");
      return;
    }

    if (!token) {
      console.error("❌ TeacherAuthToken not found in localStorage");
      return;
    }

    console.log("Fetching trial classes for teacherId:", teacherId);

    axios
      .get<TrialClass[]>(
        `https://api.blackstoneinfomaticstech.com/teachertrialclass`,
        {
          params: { teacherId },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("API Response:", response.data);
        const data = response.data;
        if (data.length > 0) {
          setSelectedTrial(data[0]);
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }, []);

  useEffect(() => {
    console.log("select");
    console.log("select", selectedTrial?._id);
  }, [selectedTrial]);

  const filterUpcomingClass = (response: {
    totalCount: number;
    classSchedule: any[];
  }): ClassData | null => {
    const classes = response.classSchedule;

    if (!Array.isArray(classes)) {
      console.log("Expected an array, but received:", classes);
      return null;
    }

    const now = new Date();
    let upcomingClass: ClassData | null = null;

    classes.forEach((cls) => {
      console.log(
        `Processing Class ID: ${cls._id}, startDate: ${cls.startDate}, startTime:`,
        cls.startTime
      );

      // Validate startDate
      if (!cls.startDate || typeof cls.startDate !== "string") {
        console.log(
          `Skipping class ${cls._id} due to missing or invalid startDate`
        );
        return;
      }

      const classDate = new Date(cls.startDate);
      if (isNaN(classDate.getTime())) {
        console.log(`Invalid startDate for class ${cls._id}:`, cls.startDate);
        return;
      }

      // Validate startTime and endTime
      if (!Array.isArray(cls.startTime) || !Array.isArray(cls.endTime)) {
        console.log(
          `Skipping class ${cls._id} due to incorrect startTime or endTime format`,
          cls.startTime,
          cls.endTime
        );
        return;
      }

      // Assuming startTime and endTime are arrays of strings in "HH:mm" format
      const startTime = cls.startTime[0];
      const endTime = cls.endTime[0];

      const startTimeParts = startTime.split(":").map(Number);
      const endTimeParts = endTime.split(":").map(Number);

      if (startTimeParts.length !== 2 || endTimeParts.length !== 2) {
        console.log(
          `Skipping class ${cls._id} due to invalid time format: startTime=${startTime}, endTime=${endTime}`
        );
        return;
      }

      const [startHours, startMinutes] = startTimeParts;
      const [endHours, endMinutes] = endTimeParts;

      if (
        isNaN(startHours) ||
        isNaN(startMinutes) ||
        isNaN(endHours) ||
        isNaN(endMinutes) ||
        startHours < 0 ||
        startHours > 23 ||
        endHours < 0 ||
        endHours > 23 ||
        startMinutes < 0 ||
        startMinutes > 59 ||
        endMinutes < 0 ||
        endMinutes > 59
      ) {
        console.log(
          `Skipping class ${cls._id} due to out-of-range time values: startTime=${startTime}, endTime=${endTime}`
        );
        return;
      }

      // Set start and end times correctly in 24-hour format
      classDate.setHours(startHours, startMinutes, 0, 0);
      const classEndDate = new Date(classDate);
      classEndDate.setHours(endHours, endMinutes, 0, 0);

      console.log(
        `Checking class: ${
          cls._id
        }, Start: ${classDate.toISOString()}, End: ${classEndDate.toISOString()}, Now: ${now.toISOString()}`
      );

      // Check if the class is currently ongoing
      if (now >= classDate && now <= classEndDate) {
        console.log(`Class ${cls._id} is currently LIVE`);
        upcomingClass = cls;
      }
      // If no live class, find the next upcoming class
      else if (
        classDate > now &&
        (!upcomingClass || classDate < new Date(upcomingClass.startDate))
      ) {
        console.log(`Class ${cls._id} is in the future`);
        upcomingClass = cls;
      }
    });

    console.log("Selected Class:", upcomingClass);
    return upcomingClass;
  };
  // Fetch class data
  // useEffect(() => {
  //   const fetchClassData = async () => {
  //     try {
  //       const token =
  //         typeof window !== "undefined"
  //           ? localStorage.getItem("TeacherAuthToken")
  //           : null;

  //       if (!token) {
  //         console.error("❌ AdminAuthToken not found");
  //         return;
  //       }

  //       const response = await fetch(
  //         `https://api.blackstoneinfomaticstech.com/evaluationlist/${trailId}`,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       setOptions((prev) => ({
  //         trialClassStatus: prev.trialClassStatus.includes(
  //           data.trialClassStatus
  //         )
  //           ? prev.trialClassStatus
  //           : [...prev.trialClassStatus, data.trialClassStatus],
  //         studentStatus: prev.studentStatus.includes(data.studentStatus)
  //           ? prev.studentStatus
  //           : [...prev.studentStatus, data.studentStatus],
  //         paymentStatus: prev.paymentStatus.includes(data.paymentStatus)
  //           ? prev.paymentStatus
  //           : [...prev.paymentStatus, data.paymentStatus],
  //       }));
  //       setTrialClassStatus(data.trialClassStatus);
  //       setStudentStatus(data.studentStatus);
  //       setPaymentStatus(data.paymentStatus);
  //       setPaymentLink(
  //         `https://blackstoneinfomaticstech.com/invoice?id=${encodeURIComponent(
  //           data._id
  //         )}`
  //       );
  //       setFormData(data);
  //       console.log(data);
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };
  //   fetchClassData();
  // }, []);

  const updateClick = async (id: string | undefined) => {
    const formDataNames = {
      _id: formData?._id ?? "",
      student: {
        studentId: formData?.student.studentId,
        studentFirstName: formData?.student.studentFirstName,
        studentLastName: formData?.student.studentLastName,
        studentEmail: formData?.student.studentEmail,
        studentGender: formData?.student.studentGender,
        studentPhone: formData?.student.studentPhone,
        studentCity: formData?.student.studentCity,
        studentCountry: formData?.student.studentCountry,
        studentCountryCode: formData?.student.studentCountryCode,
        learningInterest: formData?.student.learningInterest,
        numberOfStudents: formData?.student.numberOfStudents,
        preferredTeacher: formData?.student.preferredTeacher,
        preferredFromTime: formData?.student.preferredFromTime,
        preferredToTime: formData?.student.preferredToTime,
        timeZone: formData?.student.timeZone,
        referralSource: formData?.student.referralSource,
        preferredDate: formData?.student.preferredDate,
        evaluationStatus: formData?.student.evaluationStatus,
        status: formData?.student.status,
        createdDate: formData?.student.createdDate,
        createdBy: formData?.student.createdBy,
      },
      isLanguageLevel: formData?.isLanguageLevel,
      languageLevel: formData?.languageLevel,
      isReadingLevel: formData?.isReadingLevel,
      readingLevel: formData?.readingLevel,
      isGrammarLevel: formData?.isGrammarLevel,
      grammarLevel: formData?.grammarLevel,
      hours: formData?.hours,
      subscription: {
        subscriptionName: formData?.subscription.subscriptionName,
      },
      classStartDate: formData?.classStartDate,
      classEndDate: formData?.classEndDate,
      classStartTime: formData?.classStartTime,
      classEndTime: formData?.classEndTime,
      gardianName: formData?.gardianName,
      gardianEmail: formData?.gardianEmail,
      gardianPhone: formData?.gardianPhone,
      gardianCity: formData?.gardianCity,
      gardianCountry: formData?.gardianCountry,
      gardianTimeZone: formData?.gardianTimeZone,
      gardianLanguage: formData?.gardianLanguage,
      assignedTeacher: formData?.assignedTeacher,
      studentStatus: studentStatus,
      classStatus: formData?.classStatus,
      comments: formData?.comments,
      trialClassStatus: trialClassStatus,
      invoiceStatus: formData?.invoiceStatus,
      paymentLink: paymentLink,
      paymentStatus: paymentStatus,
      status: formData?.status,
      createdDate: formData?.createdDate,
      createdBy: formData?.createdBy,
      updatedDate: formData?.updatedDate,
      updatedBy: formData?.updatedBy,
      planTotalPrice: formData?.planTotalPrice,
      accomplishmentTime: formData?.accomplishmentTime,
      studentRate: formData?.studentRate,
      expectedFinishingDate: formData?.expectedFinishingDate,
    };

    alert(JSON.stringify(formDataNames));
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("TeacherAuthToken")
          : null;

      if (!token) {
        console.error("❌ AdminAuthToken not found");
        return;
      }
      const response = await fetch(
        `https://api.blackstoneinfomaticstech.com/evaluation/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formDataNames),
        }
      );

      console.log("response", response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Open the modal after setting the form data
      // setShowModal(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const handleChange =
    (field: string) => (event: React.ChangeEvent<HTMLSelectElement>) => {
      console.log(`Field: ${field}, Value: ${event.target.value}`);
      switch (field) {
        case "TrialClassStatus":
          setTrialClassStatus(event.target.value);
          break;
        case "studentStatus":
          setStudentStatus(event.target.value);
          break;
        case "paymentStatus":
          setPaymentStatus(event.target.value);
          break;
        default:
          break;
      }
    };

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const teacherId =
          typeof window !== "undefined"
            ? localStorage.getItem("TeacherPortalId")
            : null;
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("TeacherAuthToken")
            : null;
        if (!token) {
          console.error("❌ TeacherAuthToken not found");
          return;
        }
        if (!teacherId || !token) {
          console.log("Missing studentId or authToken");
          return;
        }
        console.log("teacherid", teacherId);
        const response = await axios.get<ApiResponse>(
          `https://api.blackstoneinfomaticstech.com/classShedule/teacher`,
          {
            params: { teacherId },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Raw API Response:", response.data.classSchedule); // Check data format

        const nextClass = filterUpcomingClass(response.data);

        console.log("Filtered Next Class:", nextClass); // Debug if nextClass is valid

        if (nextClass && nextClass.sessionStatus === "NotCompleted") {
          console.log("Setting classData to:", nextClass);
          setClassData(nextClass);
          setRoomName(nextClass.classLink);
          setAttendance([
            {
              id: "",
              studentId: nextClass.student.studentId,
              name: nextClass.student.studentFirstName,
              startTime: null,
              endTime: null,
              joined: false,
              joinTime: "",
              leaveTime: "",
            },
          ]);
        } else {
          console.log("No upcoming class found.");
          setClassData(null);
        }
      } catch (err) {
        console.log("Error loading class details:", err);
      }
    };

    fetchClassData();
  }, []);
  const handleEndCall = async () => {
    const endCallTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    setShowFeedback(true);

    console.log("startTime:", startTime);
    console.log("endTime:", endCallTime);

    if (!classData?._id || !startTime) {
      console.error("Missing class data or start time.");
      return;
    }

    const payload = {
      ...classData,
      classDay: classData.classDay.map((day) => ({
        label: day,
        value: day,
      })),
      startTime: classData.startTime.map((time) => ({
        label: time,
        value: time,
      })),
      endTime: classData.endTime.map((time) => ({
        label: time,
        value: time,
      })),
      sessionStarttime: startTime, // new/updated field
      sessionsEndtime: endCallTime, // new/updated field
      sessionClassType: "regular",
      sessionStatus: "Completed",
    };
    console.log(payload);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("TeacherAuthToken")
          : null;
      const response = await axios.put(
        `https://api.blackstoneinfomaticstech.com/classShedule/${classData._id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Class schedule updated:", response.data);
    } catch (error) {
      console.error("Failed to update class schedule:", error);
    }
  };

  const StarRating = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (rating: number) => void;
  }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`cursor-pointer text-xl ${
              star <= value ? "text-yellow-400" : "text-gray-300"
            }`}
            onClick={() => onChange(star)}
          >
            ★
          </button>
        ))}
      </div>
    );
  };
  useEffect(() => {
    let timeoutId: number | undefined;
    if (showPopup) {
      timeoutId = window.setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showPopup]);
  const handleSubmit = async () => {
    // Create request body
    const feedbackData = {
      student: {
        studentId: classData?.student.studentId,
        studentFirstName: classData?.student.studentFirstName,
        studentLastName: classData?.student.studentLastName,
        studentEmail: classData?.student.studentEmail,
      },
      teacher: {
        teacherId: classData?.teacher.teacherId,
        teacherName: classData?.teacher.teacherName,
        teacherEmail: classData?.teacher.teacherEmail,
      },
      classDay: classData?.classDay[0],
      preferedTeacher: classData?.preferedTeacher,
      course: {
        courseId: "course123",
        courseName: "Math 101",
      },
      studentsRating: {
        classUnderstanding: ratings[0],
        engagement: ratings[1],
        homeworkCompletion: ratings[2],
      },
      startDate: classData?.startDate,
      endDate: classData?.endDate,
      startTime: classData?.startTime[0],
      endTime: classData?.endTime[0],
      feedbackmessage: feedback,
      createdDate: new Date().toISOString(),
      createdBy: "User",
      lastUpdatedDate: new Date().toISOString(),
      lastUpdatedBy: "User",
    };

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("TeacherAuthToken")
          : null;

      if (!token) {
        console.error("❌ AdminAuthToken not found");
        return;
      }
      const response = await axios.post(
        "https://api.blackstoneinfomaticstech.com/feedback",
        feedbackData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
      } else {
        console.log("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      console.log("Error submitting feedback. Please try again.");
    }
  };

  const attendanceRef = useRef(attendance);
  useEffect(() => {
    attendanceRef.current = attendance;
  }, [attendance]);

  const handleStartSession = () => {
    setIsFormData(false);
  };
  const categories = [
    "Listening Ability",
    "Reading Ability",
    " Overall Performance",
  ];
  const [timeRemaining, setTimeRemaining] = useState("");
  useEffect(() => {
    if (!classData) return;

    const updateRemainingTime = () => {
      const now = new Date();

      // Extract class date and time
      const classDate = new Date(classData.startDate);
      const [hours, minutes] = classData.startTime[0].split(":").map(Number); // Assuming startTime is an array

      classDate.setHours(hours, minutes, 0, 0); // Set time for the class

      const diff = classDate.getTime() - now.getTime();

      if (diff > 0) {
        const remainingDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        const remainingHours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const remainingMinutes = Math.floor(
          (diff % (1000 * 60 * 60)) / (1000 * 60)
        );

        setTimeRemaining(
          `${remainingDays}d ${remainingHours}h ${remainingMinutes}m`
        );
      } else {
        setTimeRemaining("Started");
      }
    };

    updateRemainingTime(); // Initial call

    const timer = setInterval(updateRemainingTime, 60000); // Update every minute

    return () => clearInterval(timer); // Cleanup on unmount
  }, [classData]);

  return (
    <BaseLayout>
      <TeacherHeader currentSection="Trail class" />
      <div className="flex h-screen">
        {isFormData ? (
          <div className="min-h-screen p-4 w-full">
            <div className="">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full">
                {/* Form Section */}
                <form className="bg-white dark:bg-[#252525] dark:shadow-lg w-full  rounded-2xl shadow-md p-4 mx-auto ">
                  <h2 className="text-lg font-semibold mb-6  dark:text-[#FFF] text-gray-800">
                    Student Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-[14px] font-regular text-[#010E30] dark:text-[#FFF] mb-1">
                        First name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={
                          selectedTrial
                            ? selectedTrial.student.name.split(" ")[0]
                            : ""
                        }
                        className="w-full px-4 py-2 dark:bg-[#343434] dark:border dark:border-[#5C5C5C] border border-gray-300 rounded-md text-[12px] dark:text-[#FFF] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#576CBC]"
                        required
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-[14px] font-regular text-[#010E30] dark:text-[#FFF] mb-1">
                        Last name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={
                          selectedTrial
                            ? selectedTrial.student.name
                                .split(" ")
                                .slice(1)
                                .join(" ")
                            : ""
                        }
                        className="w-full px-4 py-2 dark:bg-[#343434] dark:border dark:border-[#5C5C5C] border border-gray-300 rounded-md text-[12px] dark:text-[#FFF] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#576CBC]"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[14px] font-regular text-[#010E30] dark:text-[#FFF] mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        // value={selectedTrial?.student.name}
                        className="w-full px-4 py-2  dark:bg-[#343434] dark:border dark:border-[#5C5C5C] border border-gray-300  dark:text-[#FFF] rounded-md text-[12px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#576CBC]"
                        required
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-[14px] font-regular text-[#010E30] dark:text-[#FFF]  mb-1">
                        Phone number
                      </label>
                      <input
                        type="text"
                        name="phone"
                        className="w-full px-4 py-2  dark:bg-[#343434] dark:border dark:border-[#5C5C5C] border border-gray-300  dark:text-[#FFF] rounded-md text-[12px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#576CBC]"
                        required
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-[14px] font-regular text-[#010E30] dark:text-[#FFF] mb-1">
                        Country
                      </label>

                      <input
                        type="text"
                        name="phone"
                        value={selectedTrial?.student.country}
                        className="w-full px-4 py-2  dark:bg-[#343434] dark:border dark:border-[#5C5C5C] border border-gray-300  dark:text-[#FFF] rounded-md text-[12px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#576CBC]"
                        required
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-[14px] font-regular text-[#010E30] dark:text-[#FFF] mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={selectedTrial?.student.city}
                        className="w-full px-4 py-2  dark:bg-[#343434] dark:border dark:border-[#5C5C5C] border border-gray-300  dark:text-[#FFF] rounded-md text-[12px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#576CBC]"
                      />
                    </div>

                    {/* Trial ID */}
                    <div>
                      <label className="block text-[14px] font-regular text-[#010E30] dark:text-[#FFF] mb-1">
                        Trial ID
                      </label>
                      <input
                        type="text"
                        name="trialId"
                        value={selectedTrial?.student.studentId}
                        className="w-full px-4 py-2  dark:bg-[#343434]  dark:border dark:border-[#5C5C5C]  border border-gray-300  dark:text-[#FFF] rounded-md text-[12px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#576CBC]"
                        readOnly
                      />
                    </div>

                    {/* Course */}
                    <div>
                      <label className="block text-[14px] font-regular text-[#010E30] dark:text-[#FFF] mb-1">
                        Course
                      </label>
                      <input
                        name="course"
                        value={selectedTrial?.course.courseName}
                        className="w-full px-4 py-2  dark:bg-[#343434]  dark:border dark:border-[#5C5C5C] border border-gray-300  dark:text-[#FFF] rounded-md text-[12px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#576CBC]"
                      />
                    </div>

                    {/* Class Status */}
                    <div>
                      <label className="block text-[14px] font-regular text-[#010E30] dark:text-[#FFF] mb-1">
                        Class Status
                      </label>
                      <select
                        name="trialClassStatus"
                        value={trialClassStatus}
                        onChange={handleChange("TrialClassStatus")}
                        className="w-full px-4 py-2  dark:bg-[#343434] dark:border dark:border-[#5C5C5C] border border-gray-300  dark:text-[#FFF] rounded-md text-[12px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#576CBC]"
                      >
                        {options.trialClassStatus.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Student Status */}
                    <div>
                      <label className="block text-[14px] font-regular text-[#010E30] dark:text-[#FFF] mb-1">
                        Student Status
                      </label>
                      <select
                        name="studentStatus"
                        value={studentStatus}
                        onChange={handleChange("studentStatus")}
                        className="w-full px-4 py-2  dark:bg-[#343434] dark:border dark:border-[#5C5C5C] border border-gray-300  dark:text-[#FFF] rounded-md text-[12px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#576CBC]"
                      >
                        {options.studentStatus.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Additional Comments */}
                  <div className="mt-6">
                    <label className="block text-[14px] font-regular text-[#010E30] dark:text-[#FFF] mb-1">
                      Additional Comments (Optional)
                    </label>
                    <textarea
                      name="comments"
                      placeholder="Write your comment here..."
                      className="w-full px-4 py-2  dark:bg-[#343434] dark:border dark:border-[#5C5C5C] border border-gray-300 rounded-md text-[12px] dark:text-[#FFF] text-[#FFF] focus:outline-none focus:ring-2 focus:ring-[#576CBC] h-24 resize-none"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="mt-6 flex justify-end gap-4">
                    <button
                      type="button"
                      className="px-6 py-2 rounded-md  dark:bg-[#343434] dark:border dark:border-[#5C5C5C] border border-gray-300  dark:text-[#FFF] text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      onClick={() => updateClick(selectedTrial?.trialId)}
                      className="px-6 py-2 rounded-md bg-[#576CBC] text-white text-sm  dark:text-[#FFF] hover:bg-blue-700 transition"
                    >
                      Save
                    </button>
                  </div>
                </form>

                {/* Student Info Card */}
                <div className="w-[460px] -ml-2  rounded-2xl shadow-md mx-auto bg-white dark:bg-[#3B3B3B] overflow-hidden ">
                  {/* Header Section */}
                  <div className="relative bg-[#5E6578] h-60 flex justify-end items-start p-4 rounded-t-2xl">
                    {/* Top-right Icon */}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"
                        stroke="white"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M16.0399 3.01928L8.15988 10.8993C7.85988 11.1993 7.55988 11.7893 7.49988 12.2193L7.06988 15.2293C6.90988 16.3193 7.67988 17.0793 8.76988 16.9293L11.7799 16.4993C12.1999 16.4393 12.7899 16.1393 13.0999 15.8393L20.9799 7.95928C22.3399 6.59928 22.9799 5.01928 20.9799 3.01928C18.9799 1.01928 17.3999 1.65928 16.0399 3.01928Z"
                        stroke="white"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M14.9102 4.15039C15.5802 6.54039 17.4502 8.41039 19.8502 9.09039"
                        stroke="white"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536M9 13l6.536-6.536a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3a2 2 0 01.586-1.414z"
                      />
                    </svg>

                    {/* Profile Image */}
                    <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] bg-white rounded-full flex items-center justify-center shadow-md border-4 border-white">
                      <img
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100"
                        alt="Student avatar"
                        className="w-[150px] h-[150px] rounded-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="flex flex-col justify-between">
                    <div className="pt-24 px-6 pb-6">
                      <div className="border-t border-gray-200 pt-6 space-y-4">
                        <div className="flex justify-between dark:text-[#959595] text-sm text-[#959595]">
                          <span className="font-regular text-[#010E30] dark:text-[#FFF]">
                            Full Name
                          </span>
                          <span>{selectedTrial?.student.name}</span>
                        </div>
                        <div className="flex justify-between dark:text-[#959595] text-sm text-[#959595]">
                          <span className="font-regular text-[#010E30] dark:text-[#FFF]">
                            Day
                          </span>
                          <span>
                            {selectedTrial?.scheduledStartDate
                              ? new Date(
                                  selectedTrial.scheduledStartDate
                                ).toLocaleDateString("en-US", {
                                  weekday: "long",
                                })
                              : ""}
                          </span>
                        </div>

                        <div className="flex justify-between dark:text-[#959595] text-sm text-[#959595]">
                          <span className="font-regular text-[#010E30] dark:text-[#FFF]">
                            Date
                          </span>
                          <span>
                            {selectedTrial?.scheduledStartDate
                              ? (() => {
                                  const d = new Date(
                                    selectedTrial.scheduledStartDate
                                  );
                                  const day = String(d.getDate()).padStart(
                                    2,
                                    "0"
                                  );
                                  const month = String(
                                    d.getMonth() + 1
                                  ).padStart(2, "0");
                                  const year = d.getFullYear();
                                  return `${day}-${month}-${year}`;
                                })()
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Trial Countdown */}
                    <div className=" px-4 mt-[90px]">
                      <NextTrailSession />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </BaseLayout>
  );
}

export default LiveClass;
