"use client";

import React, { useState, useEffect, useRef } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import axios from "axios";
import BaseLayout3 from "@/components/BaseLayout3";
import SupervisorHeader from "../../components/supervisorHeader";
import { useSearchParams } from "next/navigation";
import { duration } from "moment";
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
  attendee: string;
  _id: string;
}

interface Meeting {
  _id: string;
  meetingName: string;
  meetingId: string;
  supervisor: Supervisor;
  selectedDate: string;
  startTime: string;
  endTime: string;
  teacher: Teacher[];
  description: string;
  duration: string;
  meetingStatus: string;
  meetingMinutes: string;
  status: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  __v: number;
}

export default function Page() {
  const [startTime, setStartTime] = useState<string | null>(null);
  const [classData, setClassData] = useState<Meeting | null>(null);
  const [roomName, setRoomName] = useState("");
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const attendanceRef = useRef(attendance);
  const seacrh = useSearchParams();
  const meetingId = seacrh.get("id");
  const [meetingUpdate, setMeetingUpdate] = useState(false);
  const [meetingMinutes, setMeetingMinutes] = useState<string>("");

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
          `https://api.blackstoneinfomaticstech.com/allMeetings/${meetingId}`,
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
          const teacherAttendance = response.data.teacher.map(
            (teacher: Teacher) => ({
              id: null,
              studentId: teacher.teacherId,
              name: teacher.teacherName,
              startTime: null,
              endTime: null,
              joined: false,
              joinTime: "",
              leaveTime: "",
            })
          );

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

  // Function to handle API update
  const handleMeetingMinutesUpdate = async () => {
    console.log("📌 Submit clicked");

    const payload = {
      meetingminutes: meetingMinutes,
      duration:"0",

      teacher: classData?.teacher.map((teacher) => {
        const matchingAttendance = attendance.find(
          (a) => a.studentId === teacher.teacherId
        );

        return {
          teacherId: teacher.teacherId,
          teacherName: teacher.teacherName,
          teacherEmail: teacher.teacherEmail,
          attendee: matchingAttendance
            ? matchingAttendance.joined
              ? "present"
              : "absent"
            : "absent",
          _id: teacher._id,
        };
      }),
    };

       try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("SupervisorAuthToken")
            : null;
        if (!token) {
          console.error("❌ TeacherAuthToken not found");
          return;
        }
        
      const response = await fetch(
        `http://localhost:5001/meetingminutes/${meetingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      console.log("pay", payload);

      if (!response.ok) {
        throw new Error("Failed to update meeting minutes");
      }

      const result = await response.json();
      console.log("✅ Meeting Minutes Updated:", result);

      setMeetingUpdate(false); // close modal
    } catch (error) {
      console.error("❌ Error updating meeting minutes:", error);
    }
  };

  return (
    <BaseLayout3>
      <SupervisorHeader currentSection="Weekly Meeting" />
      <div className="flex flex-col min-h-screen px-4 sm:px-6 md:px-8">
        {/* Page Content */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1 w-full max-w-screen-xl">
          <div className="flex-1 overflow-auto">
            <div className="p-1 sm:p-2 relative">
              <div className="bg-white dark:bg-[#343434] rounded-xl p-4">
                <div className="p-4">
                  {/* Meeting Name */}
                  <h2 className="font-semibold text-black text-[18px] px-3 dark:text-white">
                    {classData?.meetingName}
                  </h2>

                  {/* Info Row */}
                  <div className="mt-2 flex flex-wrap items-center gap-4 px-3">
                    {/* Meeting Name (again) */}
                    <span className="text-sm text-[#676666] dark:text-white opacity-60 border-r-2 border-r-[#676666] pr-4">
                      {classData?.meetingName}
                    </span>

                    {/* Time */}
                    <span className="text-sm text-[#676666] dark:text-white opacity-60 border-r-2 border-r-[#676666] pr-4">
                      {classData?.startTime} - {classData?.endTime}
                    </span>

                    {/* Date */}
                    <span className="text-sm text-[#676666] dark:text-white opacity-60">
                      {classData?.selectedDate &&
                        new Date(classData.selectedDate).toLocaleDateString()}
                    </span>

                    {/* Attendance Dropdown */}
                    <div className="ml-auto w-64">
                      <label
                        htmlFor="attendance-select"
                        className="block text-sm font-semibold mb-1 dark:text-white"
                      >
                        Attendance
                      </label>
                      <select
                        id="attendance-select"
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none text-[10px] "
                      >
                        {attendance.map((s) => {
                          let statusLabel = "❌ Not Joined";
                          if (s.joined) {
                            statusLabel = s.leaveTime
                              ? `🚪 Left at ${s.leaveTime}`
                              : `✅ Joined at ${s.joinTime}`;
                          }

                          return (
                            <option
                              className="text-[12px]"
                              key={s.studentId}
                              value={s.studentId}
                            >
                              {s.name} – {statusLabel}
                            </option>
                          );
                        })}
                      </select>
                    </div>
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
                        externalApi.addListener("videoConferenceLeft", () => {
                          setMeetingUpdate(true);
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
            </div>
          </div>
        </div>
      </div>

      {/* Meeting minutes popup  */}
      {meetingUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-lg space-y-5">
            {/* Header */}
            <h2 className="text-lg font-semibold text-gray-800">
              Update Meeting Minutes
            </h2>

            {/* Content */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Attendees List */}
              <div className="md:w-1/2 border border-gray-200 rounded-lg p-4 h-72 overflow-y-auto">
                <h3 className="text-base font-medium text-gray-700 mb-2">
                  Attendees:
                </h3>
                <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                  {attendance.map((a) => (
                    <li key={a.studentId}>
                      <span className="font-medium">{a.name}</span> –{" "}
                      {a.joined ? (
                        a.leaveTime ? (
                          <span className="text-gray-600">
                            🚪 Left at {a.leaveTime}
                          </span>
                        ) : (
                          <span className="text-green-600">
                            ✅ Joined at {a.joinTime}
                          </span>
                        )
                      ) : (
                        <span className="text-red-500 font-semibold text-sm">
                          ❌ Not Joined
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Meeting Minutes Textarea */}
              <div className="md:w-1/2 border border-gray-200 rounded-lg p-4 h-72 flex flex-col">
                <label className="text-base font-medium text-gray-700 mb-2">
                  Meeting Minutes
                </label>
                <textarea
                  value={meetingMinutes}
                  onChange={(e) => setMeetingMinutes(e.target.value)}
                  className="flex-grow rounded p-2 text-sm resize-none focus:outline-none "
                  placeholder="Enter your notes here..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setMeetingUpdate(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleMeetingMinutesUpdate}
                className="px-4 py-2 bg-[#576CBC] text-white rounded hover:bg-[#43569e] text-sm font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </BaseLayout3>
  );
}
