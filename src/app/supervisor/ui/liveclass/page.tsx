"use client";

import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import axios from "axios";
import BaseLayout3 from "@/components/BaseLayout3";
import Link from "next/link";
import SupervisorHeader from "../../components/supervisorHeader";

interface Student {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
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
  status: string;
  createdBy: string;
  createdDate: string;
  lastUpdatedDate: string;
  __v: number;
}
interface ApiResponse {
  totalCount: number;
  classSchedule: ClassData;
}

function LiveClass() {
  const [showFeedback, setShowFeedback] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [ratings, setRatings] = useState([0, 0, 0, 0]);
  const [feedback, setFeedback] = useState("");
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    // Ideally this should come from your backend or query params
    const room = "MyLiveClassRoom123"; // Replace with dynamic value
    setRoomName(room);
  }, []);

  useEffect(() => {
    const classScheduleid = localStorage.getItem("showfeedbackid");
    const fetchClassData = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("SupervisorAuthToken")
            : null;

        if (!token) {
          console.error("❌ SupervisorAuthToken not found");
          return;
        }
        const response = await axios.get<ClassData>(
          `https://alfurqanacademy.tech/classShedule/${classScheduleid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Full API Response:", response.data); // ✅ Log full response

        if (response.data) {
          console.log("Setting classData:", response.data); // ✅ Log before setting state
          setClassData(response.data);
        } else {
          console.log("Error: classSchedule is missing in API response");
        }
      } catch (err) {
        console.log("Error loading class details:", err);
      }
    };
    fetchClassData();
  }, []);
  useEffect(() => {
    console.log("Updated classData:", classData); // ✅ Log changes to classData
  }, [classData]);
  const handleSubmitfeed = async () => {
    // Create request body
    const feedbackData = {
      supervisor: {
        supervisorId: localStorage.getItem("SupervisorPortalId"),
        supervisorFirstName: localStorage.getItem("SupervisorPortalName"),
        supervisorLastName: localStorage.getItem("SupervisorPortalName"),
        supervisorEmail: "john.doe@example.com",
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
        knowledgeofstudentsandcontent: ratings[0],
        assessmentofstudents: ratings[1],
        communicationandcollaboration: ratings[2],
        professionalism: ratings[3],
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
    console.log(feedbackData);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("SupervisorAuthToken")
          : null;

      if (!token) {
        console.error("❌ AdminAuthToken not found");
        return;
      }
      const response = await axios.post(
        "https://alfurqanacademy.tech/supervisorfeedback",
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

  const handleEndCall = () => {
    setShowFeedback(true);
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

  const categories = [
    "knowledge of students and content",
    "Assessment of Students",
    " Communication and Collaboration",
    "Professionalism",
  ];

  return (
    <BaseLayout3>
      <SupervisorHeader currentSection="Live Classes" />
      <div className="flex flex-col min-h-screen px-4 sm:px-6 md:px-8">
        {/* Centered Popup */}
        <div
          className={`
      fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50
      bg-[#1C3557] text-white px-6 py-3 rounded-xl shadow-lg
      flex items-center gap-3 transition-opacity duration-300
      ${showPopup ? "opacity-100" : "opacity-0 pointer-events-none"}
    `}
        >
          <img
            src="/assets/images/Check.png"
            alt="find"
            className="w-10 mt-1"
          />
          <span className="font-semibold text-sm sm:text-base">
            Submitted Successfully
          </span>
        </div>

        {/* Overlay */}
        <div
          className={`
      fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity z-20 duration-300
      ${showPopup ? "opacity-100" : "opacity-0 pointer-events-none"}
    `}
        />

        {/* Page Content */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1 w-full max-w-screen-xl">
          <div className="flex-1 overflow-auto">
            {/* Remove Header with Logout */}
            {showFeedback ? (
              <div className="flex flex-col xl:flex-row gap-6 items-start justify-center px-2 py-2 min-h-screen">
              {/* Class Details Card */}
              <div className="bg-white dark:bg-[#3b3b3b] dark:text-[#fff] rounded-xl shadow w-full max-w-md h-[640px]">
                <img
                  src="/assets/images/tajweedmasterclass.png"
                  alt="Tajweed"
                  className="w-full h-[150px] object-cover rounded-t-2xl"
                />
                <div className="text-center py-4 border-b border-gray-200">
                  <h2 className="text-[18px] font-bold text-[#1E1E1E] uppercase dark:text-[#fff]">TAJWEED</h2>
                  <p className="text-[14px] text-gray-500 dark:text-[#fff]">Master Class</p>
                </div>
                <div className="px-6 py-4">
                  <h3 className="text-[15px] font-semibold text-[#1E1E1E] mb-4 dark:text-[#fff]">Class details</h3>
                  <div className="space-y-2 text-[14px] text-gray-700 dark:text-[#fff]">
                    <div className="flex justify-between">
                      <span>Class Name</span>
                      <span className="dark:text-[#a1a1a1]">{classData?.classDay ?? "Tajweed"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Professor Name</span>
                      <span className="dark:text-[#a1a1a1]">{classData?.teacher?.teacherName ?? "Smith"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time</span>
                      <span className="dark:text-[#a1a1a1]">{classData?.startTime?.[0] ?? "9.00"} - {classData?.endTime?.[0] ?? "10.30 AM"}</span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span>Country</span>
                      <span>{classData?. ?? "USA"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Session</span>
                      <span>{classData?. ?? "12"}</span>
                    </div> */}
                    <div className="flex justify-between">
                      <span>Date</span>
                      <span className="dark:text-[#a1a1a1]">{new Date(classData?.startDate ?? "2023-10-06").toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            
              {/* Feedback Form */}
              <div className="bg-transparent dark:bg-transparent rounded-xl w-full max-w-xl p-4 h-[640px]">
                <h2 className="text-[18px] font-semibold text-[#1E1E1E] dark:text-[#fff] mb-6">Class feedback</h2>
            
                <div className="space-y-5">
                  {categories.map((category, index) => (
                    <div key={category}>
                      <p className="text-[14px] font-medium text-[#1E1E1E] dark:text-[#fff] mb-1">{category}</p>
                      <StarRating
                        value={ratings[index]}
                        onChange={(rating) => {
                          const newRatings = [...ratings];
                          newRatings[index] = rating;
                          setRatings(newRatings);
                        }}
                      />
                    </div>
                  ))}
            
                  <div>
                    <p className="text-[14px] font-medium text-[#1E1E1E] dark:text-[#fff] mb-1">Additional feedback</p>
                    <textarea
                      className="w-full min-h-[120px] p-3 rounded-lg text-sm border border-gray-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-[#4C6993] resize-none"
                      placeholder="Type your feedback here..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                  </div>
                </div>
            
                <div className="text-right mt-16">
                  <button
                    onClick={handleSubmitfeed}
                    className="bg-[#576cbc] hover:bg-[#3e5b80] text-white text-[14px] font-medium py-2 px-6 rounded-md transition duration-200"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
            
            
            ) : (
              <div className="p-1 sm:p-2 relative">
                <div className="bg-white dark:bg-[#343434] rounded-xl p-4">
                  <h2 className="font-semibold text-black text-[18px] px-3 dark:text-[#fff]">Weekly Meeting</h2>
                  {/* Student Info */}
                  <div className="mb-4 flex gap-2">
                    <h2 className="text-[14px] text-[#676666] dark:text-[#fff] opacity-60 border-r-2 border-r-[#676666] px-4">
                      Student Name
                    </h2>
                    <h2 className="text-[14px] text-[#676666] border-r-2 border-r-[#676666] px-4 dark:text-[#fff] opacity-60">
                      9:00 AM - 10:30 AM
                    </h2>
                    <span className="text-[14px] text-[#676666] dark:text-[#fff] opacity-60">
                      2022-04-16
                    </span>
                  </div>

                  {/* Jitsi Video Box */}
                  <div className="w-full h-[60vh] md:h-[70vh] rounded-xl overflow-hidden shadow-inner border border-gray-300">
                    {roomName && (
                      <JitsiMeeting
                        roomName={roomName}
                        domain="meet.blackstoneinfomaticstech.com"
                        configOverwrite={{
                          startWithAudioMuted: false,
                          startWithVideoMuted: false,
                          toolbarButtons: [
                            "microphone",
                            "camera",
                            "closedcaptions",
                            "desktop",
                            "fullscreen",
                            "fodeviceselection",
                            "hangup",
                            "profile",
                            "chat",
                            "settings",
                            "raisehand",
                            "videoquality",
                            "filmstrip",
                            "shortcuts",
                            "tileview",
                          ],
                        }}
                        getIFrameRef={(iframeRef) => {
                          iframeRef.style.border = "0px";
                          iframeRef.style.height = "100%";
                          iframeRef.style.width = "100%";
                        }}
                        onApiReady={(apiObj) => {
                          apiObj.addListener('videoConferenceLeft', () => {
                            setShowFeedback(true);
                          });
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </BaseLayout3>
  );
}

export default LiveClass;
