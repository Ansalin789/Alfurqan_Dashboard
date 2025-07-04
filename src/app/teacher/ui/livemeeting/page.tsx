"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import BaseLayout from "@/components/BaseLayout";
import TeacherHeader from "../../components/TeacherHeader";
import NextMeetingSchedule from "../../components/NextMeetingSchedule";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { JitsiMeeting } from "@jitsi/react-sdk";

interface Teacher {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
}

interface Participant {
  studentId: string;
  studentName: string;
  studentEmail: string;
  _id: string;
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

interface Meeting {
  _id: string;
  meetingId: string;
  meetingName: string;
  teacher: Teacher;
  participants: Participant[];
  attendance?: Attendance[];
  selectedDate: string;
  startTime: string;
  endTime: string;
  description: string;
  meetingStatus: "Scheduled" | "Ongoing" | "Completed" | string;
  status: "Active" | "Inactive" | string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string;
  __v: number;
}

const categories = ["Understanding", "Engagement", "Homework"];

const LiveMeeting = () => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [ratings, setRatings] = useState([0, 0, 0]);
  const [feedback, setFeedback] = useState("");
  const [startTime, setStartTime] = useState<string>("");
  const [meetingData, setMeetingData] = useState<Meeting | null>(null);
  const [roomName, setRoomName] = useState("");
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const params = useSearchParams();

  const startTimeRef = useRef<string>("");
  const attendanceRef = useRef(attendance);

  useEffect(() => {
    attendanceRef.current = attendance;
  }, [attendance]);

  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        const teacherId = localStorage.getItem("TeacherPortalId");
        const token = localStorage.getItem("TeacherAuthToken");
        if (!teacherId || !token) {
          console.error("Missing teacher ID or auth token");
          return;
        }

        const id = params.get("id");
        const response = await axios.get(`http://localhost:5001/teacherMeetinglist/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const meeting: Meeting = response.data;
        if (meeting && meeting.meetingStatus !== "Completed") {
          setMeetingData(meeting);
          setRoomName(meeting.meetingName);

          // Build initial attendance
          const initialAttendance = meeting.participants.map((p) => ({
            id: null,
            studentId: p.studentId,
            name: p.studentName,
            startTime: null,
            endTime: null,
            joined: false,
            joinTime: "",
            leaveTime: "",
          }));
          setAttendance(initialAttendance);
        }
      } catch (error) {
        console.error("Error fetching meeting data:", error);
      }
    };

    fetchMeetingData();
  }, [params]);

  const handleEndCall = async () => {
    const endCallTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    setShowFeedback(true);
    const startTimeUsed = startTimeRef.current;

    if (!meetingData || !startTimeUsed) {
      console.error("Missing meeting data or start time");
      return;
    }

    const scheduledDate = meetingData.selectedDate;
    const scheduledTime = meetingData.startTime;
    const scheduledStart = dayjs(`${scheduledDate}T${scheduledTime}`);
    let joinHour = 0;
    let joinMinute = 0;

    if (startTimeUsed.includes(":")) {
      const [h, m] = startTimeUsed.split(":").map(Number);
      joinHour = h;
      joinMinute = m;
    }

    const actualJoin = dayjs(`${scheduledDate}T${String(joinHour).padStart(2, "0")}:${String(joinMinute).padStart(2, "0")}`);
    const diffMinutes = actualJoin.diff(scheduledStart, "minute");
    const teacherAbsent = diffMinutes >= 15;

    const student = attendanceRef.current[0];
    const studentJoined = student?.joinTime && student.joinTime !== "";
    const parsedStudentJoin = studentJoined ? dayjs(`${scheduledDate}T${student.joinTime}`) : null;
    const studentLateBy = parsedStudentJoin ? parsedStudentJoin.diff(scheduledStart, "minute") : Infinity;
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
        sessionStarttime = meetingData.startTime;
        sessionsEndtime = meetingData.endTime;
      }
    }

    const payload = {
      ...meetingData,
      sessionStarttime,
      sessionsEndtime,
      meetingStatus: "Completed",
      teacherAttendee: teacherAbsent ? "absent" : "present",
      studentAttendee,
    };

    try {
      const token = localStorage.getItem("TeacherAuthToken");
      await axios.put(`http://localhost:5001/teacherMeetinglist/${meetingData._id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Meeting schedule updated");
    } catch (error) {
      console.error("Failed to update meeting schedule:", error);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!meetingData) return;

    const feedbackData = {
      student: meetingData.participants[0],
      teacher: meetingData.teacher,
      meetingId: meetingData.meetingId,
      ratings: {
        understanding: ratings[0],
        engagement: ratings[1],
        homework: ratings[2],
      },
      feedbackMessage: feedback,
      createdDate: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem("TeacherAuthToken");
      await axios.post("http://localhost:5001/teacherMeetinglist/feedback", feedbackData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setShowPopup(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

    function handleSubmit(event: React.MouseEvent<HTMLButtonElement>): void {
        throw new Error("Function not implemented.");
    }

  return (
    <BaseLayout>
      <TeacherHeader currentSection="Live Meeting" />
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
                          {meetingData?.participants?.[0]?.studentName}
                        </h3>
                        <p className="text-sm text-center text-[#959595] mb-5">
                          {meetingData?.description}
                        </p>
                        <h4 className="text-sm font-semibold text-[#010E30] dark:text-[#FFF] mb-4">
                          Class details
                        </h4>
                        <div className="text-sm text-[#010E30]/90 dark:text-[#FFF] space-y-2">
                          <div className="flex justify-between">
                            <span>Student Name</span>
                            <span className="text-[#959595] dark:text-[#A1A1A1] mb-4">
                              {meetingData?.participants?.[0]?.studentName}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Student ID</span>
                            <span className="text-[#959595] dark:text-[#A1A1A1] mb-4">
                              {meetingData?.participants?.[0]?.studentId}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Course</span>
                            <span className="text-[#959595] dark:text-[#A1A1A1] mb-4">
                              {/* No courseName in Meeting, so leave blank or use description */}
                              {meetingData?.description}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Time</span>
                              {meetingData?.startTime} to {meetingData?.endTime}
                            </div>
                          <div className="flex justify-between">
                            <span>Day</span>
                            {/* No classDay in Meeting, so use selectedDate */}
                            {meetingData?.selectedDate}
                          </div>
                          <div className="flex justify-between">
                            <span>
                              {meetingData?.selectedDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Student Performance Card */}
                    <div className="rounded-2xl flex-col w-full xl:w-1/2 p-6 text-[#010E30] dark:text-[#FFFFFF]">
                      <h3 className="text-lg font-semibold mb-6">Student Performance</h3>
                      {categories.map((category, index) => (
                        <div key={category} className="mb-4">
                          <p className="text-base font-medium text-gray-700 mb-1 dark:text-white">
                            {category}
                          </p>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                className={`text-2xl ${ratings[index] >= star ? "text-yellow-400" : "text-gray-300"}`}
                                onClick={() => {
                                  const newRatings = [...ratings];
                                  newRatings[index] = star;
                                  setRatings(newRatings);
                                }}
                                aria-label={`Rate ${star} star${star > 1 ? "s" : ""} for ${category}`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
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
        {meetingData?.participants?.[0]?.studentName}
      </h2>
      <span className="text-sm text-gray-500">
        {meetingData?.description}
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
                          externalApi.addListener(
                            "participantJoined",
                            (event) => {
                              const joinTime = new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              });
                              const parts = event.displayName?.split("| ID :");
                              const name = parts?.[0]?.trim() ?? "Unknown";
                              const studentId = parts?.[1]?.trim() ?? "N/A";
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
                            }
                          );
                          externalApi.addListener(
                            "participantLeft",
                            (event) => {
                              const leaveTime = new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              });
                              const participant = attendanceRef.current.find(
                                (p) => p.id === event.id
                              );
                              if (participant) {
                                setAttendance((prev) =>
                                  prev.map((a) =>
                                    a.id === event.id ? { ...a, leaveTime } : a
                                  )
                                );
                              }
                            }
                          );
                          externalApi.addListener(
                            "videoConferenceJoined",
                            async () => {
                              const startCallTime = new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              });
                              startTimeRef.current = startCallTime;
                              setStartTime(startCallTime);
                              const existingParticipants = externalApi.getParticipantsInfo();
                              existingParticipants.forEach((participant) => {
                                const displayName = (participant as any).displayName;
                                const parts = displayName?.split("| ID :");
                                const name = parts?.[0]?.trim() ?? "Unknown";
                                const studentId = parts?.[1]?.trim() ?? "N/A";
                                const joinTime = new Date().toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                });
                                setAttendance((prev) =>
                                  prev.map((a) =>
                                    a.studentId === studentId
                                      ? {
                                          ...a,
                                          id: (participant as any).participantId,
                                          joined: true,
                                          joinTime,
                                        }
                                      : a
                                  )
                                );
                              });
                            }
                          );
                          externalApi.addListener("videoConferenceLeft", () => {
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
};

export default LiveMeeting;
