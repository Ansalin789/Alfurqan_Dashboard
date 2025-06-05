"use client";

import React, { useState, useEffect, useRef } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import axios from "axios";
import BaseLayout3 from "@/components/BaseLayout3";
import SupervisorHeader from "../../components/supervisorHeader";
import { useSearchParams } from 'next/navigation';
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

interface Supervisor {
  supervisorId: string;
  supervisorName: string;
  supervisorEmail: string;
  supervisorRole: string;
}

interface Teacher {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  _id: string;
}

interface Meeting {
  _id: string;
  meetingName: string;
  meetingId: string;
  supervisor: Supervisor;
  selectedDate: string; // ISO date string
  startTime: string; // e.g. "13:30"
  endTime: string; // e.g. "18:30"
  teacher: Teacher[];
  description: string;
  meetingStatus: string;
  status: string;
  createdDate: string; // ISO date string
  createdBy: string;
  updatedDate: string; // ISO date string
  __v: number;
}

export default function Page() {
  const [startTime, setStartTime] = useState<string | null>(null);
  const [classData, setClassData] = useState<Meeting | null>(null);
  const [roomName, setRoomName] = useState("");
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const attendanceRef = useRef(attendance);
  const seacrh = useSearchParams();
  const meetingId = seacrh.get('id');

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("SupervisorAuthToken")
            : null;
        if (!token) {
          console.error("❌ TeacherAuthToken not found");
          return;
        }

        const response = await axios.get<Meeting>(
          `http://localhost:5001/allMeetings/${meetingId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          console.log("Setting classData to:", response.data);
          setClassData(response.data);
          setRoomName(response.data.meetingId);
          const teacherAttendance = response.data.teacher.map((teacher: Teacher) => ({
    id: null,
    studentId: teacher.teacherId,
    name: teacher.teacherName,
    startTime: null,
    endTime: null,
    joined: false,
    joinTime: "",
    leaveTime: "",
  }));

  setAttendance(teacherAttendance);
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
  useEffect(() => {
    attendanceRef.current = attendance;
  }, [attendance]);

  return (
    <BaseLayout3>
      <SupervisorHeader currentSection="Weekly Meeting" />
      <div className="flex flex-col min-h-screen px-4 sm:px-6 md:px-8">
        {/* Page Content */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1 w-full max-w-screen-xl">
          <div className="flex-1 overflow-auto">
            <div className="p-1 sm:p-2 relative">
              <div className="bg-white dark:bg-[#343434] rounded-xl p-4">
                <h2 className="font-semibold text-black text-[18px] px-3 dark:text-[#fff]">
                  {classData?.meetingName}
                </h2>
                {/* Student Info */}
                <div className="mb-4 flex gap-2">
                  <h2 className="text-[14px] text-[#676666] dark:text-[#fff] opacity-60 border-r-2 border-r-[#676666] px-4">
                    {classData?.meetingName}
                  </h2>
                  <h2 className="text-[14px] text-[#676666] border-r-2 border-r-[#676666] px-4 dark:text-[#fff] opacity-60">
                    {classData?.startTime} - {classData?.endTime}
                  </h2>
                  <span className="text-[14px] text-[#676666] dark:text-[#fff] opacity-60">
                    {classData?.selectedDate && new Date(classData.selectedDate).toLocaleDateString()}
                  </span>
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
                            const joinTime = new Date().toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            });

                            console.log(
                              "Participant displayName:",
                              event.displayName
                            );
                            const parts = event.displayName?.split("| ID :");
                            console.log("Split parts:", parts);

                            const name = parts?.[0]?.trim() ?? "Unknown";
                            const studentId = parts?.[1]?.trim() ?? "N/A";

                            alert(`Name: ${name}, studentId: ${studentId}`);
                            setAttendance((prev) =>
                              prev.map((a) =>
                                a.studentId === studentId
                                  ? {
                                      ...a,
                                      id: event.id,
                                      joined: true,
                                      joinTime: joinTime,
                                    }
                                  : a
                              )
                            );
                          }
                        );

                        // 🔴 Handle Participant Left
                        externalApi.addListener(
                          "participantLeft",
                          (event: { id: string }) => {
                            console.log("participantLeft event fired:", event);
                            const leaveTime = new Date().toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            );

                            const participant = attendanceRef.current.find(
                              (p) => p.id === event.id
                            );
                            console.log("Matching participant:", participant);
                            if (participant) {
                              setAttendance((prev) =>
                                prev.map((a) =>
                                  a.id === event.id
                                    ? { ...a, leaveTime: leaveTime }
                                    : a
                                )
                              );
                              console.log(
                                `🔴 ${participant.name} left at ${leaveTime}`
                              );
                            } else {
                              console.warn(
                                `Participant with id ${event.id} not found in attendance.`
                              );
                            }
                          }
                        );

                        // 🎥 Host/teacher Joined Call
                        externalApi.addEventListener(
                          "videoConferenceJoined",
                          () => {
                            const startCallTime = new Date().toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            );

                            console.log("Call started at", startCallTime);
                            setStartTime(startCallTime);
                          }
                        );
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
            </div>
          </div>
        </div>
      </div>
    </BaseLayout3>
  );
}
