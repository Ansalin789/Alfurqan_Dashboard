"use client";

import React, { useState, useEffect, useRef } from "react";
import { LogOut } from "lucide-react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import BaseLayout from "@/components/BaseLayout";
import axios from "axios";
import Link from "next/link";
import TeacherHeader from "../../components/TeacherHeader";
import dayjs from "dayjs";
import { useParams, useSearchParams } from "next/navigation";

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
interface course {
  courseId: string;
  courseName: string;
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
  course: course;
  sessionStarttime: string;
  sessionsEndtime: string;
  sessionStatus: string;
  sessionClassType: string;
  teacherAttendee: string;
  studentAttendee: string;
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

export default function LiveClass() {
  const [showFeedback, setShowFeedback] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [ratings, setRatings] = useState([0, 0, 0]);
  const [feedback, setFeedback] = useState("");
  const [startTime, setStartTime] = useState<string>("");
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [roomName, setRoomName] = useState("");
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const params = useSearchParams();

  const startTimeRef = useRef<string>("");

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
        const id = params.get("id");
        console.log("teacherid", teacherId);
        const response = await axios.get(
          `https://api.blackstoneinfomaticstech.com/classShedule/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Raw API Response:", response.data); // Check data format

        const nextClass = response.data;

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
      hour12: false,
    });

    setShowFeedback(true);
    const startTimeUsed = startTimeRef.current;
    console.log("startTime:", startTimeUsed);
    console.log("endTime:", endCallTime);

    if (!classData?._id || !startTimeUsed) {
      console.error("Missing class data or start time.");
      return;
    }

    const scheduledDate = classData.startDate; // "YYYY-MM-DD"
    const scheduledTime = classData.startTime?.[0]; // "HH:mm"
    const scheduledStart = dayjs(`${scheduledDate}T${scheduledTime}`);
    let joinHour = 0;
    let joinMinute = 0;

    if (startTimeUsed && startTimeUsed.includes(":")) {
      const [h, m] = startTimeUsed.split(":").map(Number);
      if (!isNaN(h) && !isNaN(m)) {
        joinHour = h;
        joinMinute = m;
      } else {
        console.warn("⛔ Invalid parsed start time (NaN):", h, m);
      }
    } else {
      console.warn("⛔ Invalid startTimeUsed format:", startTimeUsed);
    }
    const actualJoin = dayjs(
      `${scheduledDate}T${String(joinHour).padStart(2, "0")}:${String(
        joinMinute
      ).padStart(2, "0")}`
    );
    const diffMinutes = actualJoin.diff(scheduledStart, "minute");
    const teacherAbsent = diffMinutes >= 15;
    console.log("⏱️ Teacher joined late by:", diffMinutes, "min");
    console.log("🚫 Teacher is", teacherAbsent ? "ABSENT" : "PRESENT");
    const student = attendanceRef.current[0]; // only one student
    console.log("stuiudent", student);
    const studentJoined = student.joinTime && student.joinTime !== "";
    const parsedStudentJoin = studentJoined
      ? dayjs(`${scheduledDate}T${student.joinTime}`)
      : null;
    const studentLateBy = parsedStudentJoin
      ? parsedStudentJoin.diff(scheduledStart, "minute")
      : Infinity;
    console.log("student late by ", studentLateBy);
    const studentAbsent = !studentJoined || studentLateBy > 15;
    const studentAttendee = studentAbsent ? "absent" : "present";
    const isStudentPresent = studentAttendee === "present";
    let sessionStarttime = "00:00";
    let sessionsEndtime = "00:00";

    if (!teacherAbsent) {
      if (isStudentPresent) {
        sessionStarttime = startTimeUsed;
        sessionsEndtime = endCallTime;
      } else {
        sessionStarttime = classData.startTime[0];
        sessionsEndtime = classData.endTime[0];
      }
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

      sessionStarttime: sessionStarttime,
      sessionsEndtime: sessionsEndtime,
      sessionStatus: "COMPLETED",
      teacherAttendee: teacherAbsent ? "absent" : "present",
      studentAttendee: studentAttendee,
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
              star <= value ? "text-[#FAAB3C]" : "text-gray-300"
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
        courseId: classData?.course.courseId,
        courseName: classData?.course.courseName,
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
  const categories = [
    "Listening Ability",
    "Reading Ability",
    "Communication and Concentration",
    "Overall Performance",
  ];

  return (
    <BaseLayout>
      <TeacherHeader currentSection="Live Class" />
      <div className="flex h-screen">
        <div className="flex flex-col w-full min-h-screen px-4 sm:px-6 md:px-8">
          {/* Page Content */}
          <div className="flex flex-col lg:flex-row gap-6 flex-1 w-full max-w-screen-xl mx-auto py-0">
            <div className="flex-1 overflow-auto">
              {/* Header */}
              <div className="relative mb-0">
                {showFeedback && (
                  <Link
                    href="/supervisor/ui/viewschedule"
                    className="absolute top-0 right-0"
                  >
                    <LogOut className="w-6 h-6 text-red-500 hover:text-red-600 transition" />
                  </Link>
                )}
              </div>
             {showPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
    <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md px-6 py-8 text-center relative">
      <div className="flex justify-center items-center w-14 h-14 mx-auto bg-green-100 rounded-full mb-4">
        <svg
          className="w-7 h-7 text-green-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Feedback Added</h2>
      <p className="text-gray-500 mb-6">Your feedback added successfully!</p>
      <button
        onClick={() => setShowPopup(false)}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-200"
      >
        Close
      </button>
    </div>
  </div>
)}


              {showFeedback ? (
                <div className="flex flex-col xl:flex-row gap-4 items-stretch justify-center px-4 py-6 w-full">
                  <div className="flex flex-col xl:flex-row gap-6 items-stretch justify-center px-6 py-8 w-full">
                    {/* Student Info Card */}
                    <div className="bg-white dark:bg-[#3B3B3B] rounded-2xl shadow flex flex-col w-full xl:w-1/2">
                      <img
                        src="/assets/images/tajweedmasterclass2.png"
                        alt="Tajweed"
                        className="w-full h-48 object-cover rounded-t-2xl"
                      />
                      <div className="p-6">
                        <h3 className="text-lg font-semibold dark:text-[#FFF] text-center text-[#111827] mb-1">
                          {classData?.student.course}
                        </h3>
                        <p className="text-sm text-center text-[#959595] mb-5">
                          {classData?.sessionClassType}
                        </p>

                        <h4 className="text-sm font-semibold text-[#010E30]  dark:text-[#FFF] mb-4">
                          Class details
                        </h4>
                        <div className="text-sm text-[#010E30]/90  dark:text-[#FFF] space-y-2">
                          <div className="flex justify-between">
                            <span>Student Name</span>
                            <span className=" text-[#959595]  dark:text-[#A1A1A1] mb-4"> {classData?.student.studentFirstName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Student ID</span>
                            <span className=" text-[#959595]  dark:text-[#A1A1A1] mb-4">{classData?.student.studentId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Course</span>
                            <span className=" text-[#959595]  dark:text-[#A1A1A1] mb-4">{classData?.course.courseName}</span>
                          </div>

                          <div className="flex justify-between">
                            <span>Time</span>
                            <p className=" text-[#959595]  dark:text-[#A1A1A1] mb-4">
                              {classData?.startTime[0]} to{" "}
                              {classData?.endTime[0]}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <span>Day</span>
                            <span className=" text-[#959595]  dark:text-[#A1A1A1] mb-4">{classData?.classDay}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Date</span>
                             <p className=" text-[#959595]  dark:text-[#A1A1A1] mb-4"> {classData?.classDay} -{" "}
                            {new Date(
                              classData?.startDate ?? "2022-01-01"
                            ).toLocaleDateString()}</p>

                           
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Student Performance Card */}
                    <div className=" rounded-2xl flex-col w-full xl:w-1/2 p-6 text-[#010E30] dark:text-[#FFFFFF]">
                      <h3 className="text-lg font-semibold mb-6">
                        Student Performance
                      </h3>

                      {categories.map((category, index) => (
                        <div key={category} className="mb-4">
                          <p className="text-base font-medium text-gray-700 mb-1 dark:text-white">
                            {category}
                          </p>
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

                      <div className="mt-6">
                        <h4 className="text-sm font-medium mb-2 text-[#010E30] dark:text-[#FFFFFF]">
                          Additional feedback
                        </h4>
                        <textarea
                          className="w-full h-28 bg-transparent text-xs p-3 border border-[#D1D5DB] rounded-lg placeholder-gray-400 resize-none"
                          placeholder="Type your feedback here..."
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                        />
                      </div>

                      <button
                        className="mt-4 self-end bg-[#4754DC] hover:bg-[#3B44B0] text-white text-sm font-medium px-6 py-2 rounded-lg transition"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-1 sm:p-2 relative w-full flex flex-col flex-1 h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] xl:h-[85vh]">
                  {/* Student Info */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-lg font-medium">
                        {classData?.student.studentFirstName}{" "}
                        {classData?.student.studentLastName}
                      </h2>
                      <span className="text-sm text-gray-500">
                        {classData?.student.course}
                      </span>
                    </div>

                    <div className="ml-auto w-64">
                      <label
                        htmlFor="attendance-select"
                        className="block text-sm font-semibold mb-1"
                      >
                        Attendance
                      </label>
                      <select
                        id="attendance-select"
                        className="w-full border p-2 rounded"
                      >
                        {attendance.map((s) => {
                          let statusLabel = "❌ Not Joined";

                          if (s.joined) {
                            statusLabel = s.leaveTime
                              ? `🚪 Left at ${s.leaveTime}`
                              : `✅ Joined at ${s.joinTime}`;
                          }

                          return (
                            <option key={s.studentId} value={s.studentId}>
                              {s.name} – {statusLabel}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  {/* Jitsi Video Box */}
                  <div className="flex-1 min-w-0 w-full h-[50vh] md:h-[60vh] rounded-md overflow-hidden shadow-inner border border-gray-300">
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
                            "recording",
                          ],
                        }}
                        onApiReady={(externalApi) => {
                          type ParticipantLog = {
                            id: string;
                            name?: string;
                            studentId?: string;
                            startCallTime: string;
                            endCallTime?: string;
                          };

                          const participantList: ParticipantLog[] = [];

                          // ✅ Handle Participant Joined
                          externalApi.addListener(
                            "participantJoined",
                            (event: { id: string; displayName?: string }) => {
                              const joinTime = new Date().toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                }
                              );

                              const parts = event.displayName?.split("| ID :");
                              const name = parts?.[0]?.trim() ?? "Unknown";
                              const studentId = parts?.[1]?.trim() ?? "N/A";

                              console.log("🟢 New participant joined:", {
                                name,
                                studentId,
                              });

                              const updated = attendanceRef.current.map((a) =>
                                a.studentId === studentId
                                  ? {
                                      ...a,
                                      id: event.id,
                                      joined: true,
                                      joinTime: joinTime,
                                      startTime: joinTime,
                                    }
                                  : a
                              );
                              setAttendance(updated);
                              console.log(updated);
                            }
                          );

                          // 🔴 Handle Participant Left
                          externalApi.addListener(
                            "participantLeft",
                            (event: { id: string }) => {
                              const leaveTime = new Date().toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                }
                              );

                              const participant = attendanceRef.current.find(
                                (p) => p.id === event.id
                              );

                              if (participant) {
                                setAttendance((prev) =>
                                  prev.map((a) =>
                                    a.id === event.id ? { ...a, leaveTime } : a
                                  )
                                );
                                console.log(
                                  `🔴 ${participant.name} left at ${leaveTime}`
                                );
                              } else {
                                console.warn(
                                  `❗ Participant with id ${event.id} not found in attendance.`
                                );
                              }
                            }
                          );

                          // 🎥 Host/Teacher Joined
                          externalApi.addListener(
                            "videoConferenceJoined",
                            async () => {
                              const startCallTime =
                                new Date().toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                });
                              startTimeRef.current = startCallTime; // ✅ store in ref
                              setStartTime(startCallTime);

                              console.log(
                                "✅ Teacher joined, call started at",
                                startCallTime
                              );

                              // ✅ Handle already-present participants (students who joined before teacher)
                              const existingParticipants =
                                externalApi.getParticipantsInfo();

                              existingParticipants.forEach(
                                (participant: any) => {
                                  const parts =
                                    participant.displayName?.split("| ID :");
                                  const name = parts?.[0]?.trim() ?? "Unknown";
                                  const studentId = parts?.[1]?.trim() ?? "N/A";

                                  const joinTime =
                                    new Date().toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    });

                                  console.log(
                                    "🟡 Detected existing student in room:",
                                    {
                                      name,
                                      studentId,
                                    }
                                  );

                                  setAttendance((prev) =>
                                    prev.map((a) =>
                                      a.studentId === studentId
                                        ? {
                                            ...a,
                                            id: participant.participantId,
                                            joined: true,
                                            joinTime,
                                          }
                                        : a
                                    )
                                  );
                                }
                              );
                            }
                          );
                          externalApi.addListener("videoConferenceLeft", () => {
                            console.log(
                              "📞 Hangup clicked or call ended by user"
                            );
                            handleEndCall();
                          });
                        }}
                        getIFrameRef={(iframeRef) => {
                          iframeRef.style.border = "0px";
                          iframeRef.style.height = "100%";
                          iframeRef.style.width = "100%";
                        }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
