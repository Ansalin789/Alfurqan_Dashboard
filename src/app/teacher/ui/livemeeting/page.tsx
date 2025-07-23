"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import BaseLayout from "@/components/BaseLayout";
import TeacherHeader from "../../components/TeacherHeader";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
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
  meetingName: string;
  meetingId: string;

  selectedDate: string; // ISO date string
  startTime: string;
  endTime: string;
  description?: string;

  meetingStatus: "Completed" | "Scheduled" | "Pending" | string;
  duration?: string;
  status: "Active" | "Inactive" | string;

  createdDate: string;
  createdBy: string;
  updatedDate?: string;
  updatedBy?: string;
  __v?: number;

  // Optional supervisor (some meetings)
  supervisor?: {
    supervisorId: string;
    supervisorName: string;
    supervisorEmail: string;
  };

  // Optional admin (some meetings)
  admin?: {
    adminId: string;
    adminName: string;
    adminEmail: string;
    adminRole: string;
  };

  // Optional single or multiple teachers
  teacher:
    | Array<{
        teacherId: string;
        teacherName: string;
        teacherEmail: string;
        attendee?: string;
      }>
    | {
        teacherId: string;
        teacherName: string;
        teacherEmail: string;
      };

  // Optional participants (student meetings)
  participants?: Array<{
    studentId: string;
    studentName: string;
    studentEmail: string;
  }>;
}

const LiveMeeting = () => {
  const [startTime, setStartTime] = useState<string>("");
  const [meetingData, setMeetingData] = useState<Meeting | null>(null);
  const [roomName, setRoomName] = useState("");
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const params = useSearchParams();
  const meetingId = params.get("id");
const router = useRouter();
const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const startTimeRef = useRef<string>("");
  const attendanceRef = useRef(attendance);
  const [meetingUpdate, setMeetingUpdate] = useState(false); // Define state for meeting update

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

        const response = await axios.get(`https://api.blackstoneinfomaticstech.com/teacherMeeting/${meetingId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const meeting: Meeting = response.data.meetings;
        if (meeting && meeting.meetingStatus !== "Completed") {
          setMeetingData(meeting);
          setRoomName(meeting.meetingId);

          // Build initial attendance
          const initialAttendance = meeting.participants?.map((p) => ({
            id: null,
            studentId: p.studentId,
            name: p.studentName,
            startTime: null,
            endTime: null,
            joined: false,
            joinTime: "",
            leaveTime: "",
          }));
          setAttendance(initialAttendance ?? []);
        }
      } catch (error) {
        console.error("Error fetching meeting data:", error);
      }
    };

    fetchMeetingData();
  }, [params]);

  useEffect(() => {
  if (redirectTo) {
    router.push(redirectTo);
  }
}, [redirectTo, router]);

const handleEndCall = async () => {
  const endCallTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
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

  let sessionStarttime = "00:00";
  let sessionsEndtime = "00:00";

  if (!teacherAbsent) {
    if (!studentAbsent) {
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
    await axios.put(`https://api.blackstoneinfomaticstech.com/updateTeacherMeeting/${meetingId}`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Meeting schedule updated");

    // ✅ Instead of router.push directly
    setRedirectTo("/teacher/ui/meeting");
  } catch (error) {
    console.error("Failed to update meeting schedule:", error);
  }
};

const handleMeetingMinutesUpdate = async () => {
  console.log("📌 Submit clicked");
  // Ensure classData is defined and has the expected structure
  const teachers = meetingData?.participants?.map((participant) => ({
    teacherId: participant.studentId, // Assuming studentId is used for teacherId
    teacherName: participant.studentName,
    teacherEmail: participant.studentEmail,
  })) || [];

  const payload = {
    meetingStatus: "Completed",
    teacher: teachers.map((teacher) => {
      const matchingAttendance = attendance.find(
        (a) => a.studentId === teacher.teacherId
      );
      let attendee = "absent";
      if (matchingAttendance) {
        attendee = matchingAttendance.joined ? "present" : "absent";
      }

      return {
        teacherId: teacher.teacherId,
        teacherName: teacher.teacherName,
        teacherEmail: teacher.teacherEmail,
        attendee,
        _id: teacher.teacherId, // Assuming teacherId is used for _id
      };
    }),

    studentAttendance: attendance.map((student) => ({
      studentId: student.studentId,
      name: student.name,
      attendee: student.joined ? "present" : "absent",
      joinTime: student.joinTime,
      leaveTime: student.leaveTime,
    })),
  };

  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("teacherAuthToken")
        : null;
    if (!token) {
      console.error("❌ TeacherAuthToken not found");
      return;
    }

    const response = await fetch(
      `https://localhost:5001/meetingattendence/${meetingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update meeting attendance");
    }

    const result = await response.json();
    console.log("✅ Attendance Updated:", result);

    setMeetingUpdate(false); // close modal
  } catch (error) {
    console.error("❌ Error updating meeting attendance:", error);
  }
};


  return (
    <BaseLayout>
      <TeacherHeader currentSection="Live Meeting" />
      <div className="flex h-screen">
        <div className="flex flex-col w-full min-h-screen px-4 sm:px-6 md:px-8">
          <div className="flex flex-col lg:flex-row gap-6 flex-1 w-full max-w-screen-xl mx-auto py-0">
            <div className="flex-1 overflow-auto">
              <div className="relative mb-0">
                <Link href="/supervisor/ui/viewschedule" className="absolute top-0 right-0">
                  <LogOut className="w-6 h-6 text-red-500 hover:text-red-600 transition" />
                </Link>
              </div>

              <div className="p-1 sm:p-2 relative w-full flex flex-col flex-1 h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] xl:h-[85vh]">
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
                    <label htmlFor="attendance-select" className="block text-sm font-semibold mb-1">
                      Attendance
                    </label>
                    <select id="attendance-select" className="w-full border p-2 rounded">
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
                        externalApi.addListener("participantJoined", (event) => {
                          const joinTime = new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          });
                          const parts = event.displayName?.split("| ID :");
                          const studentId = parts?.[1]?.trim() ?? "N/A";
                          const updated = attendanceRef.current.map((a) =>
                            a.studentId === studentId
                              ? { ...a, id: event.id, joined: true, joinTime, startTime: joinTime }
                              : a
                          );
                          setAttendance(updated);
                        });
                        externalApi.addListener("participantLeft", (event) => {
                          const leaveTime = new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          });
                          setAttendance((prev) =>
                            prev.map((a) =>
                              a.id === event.id ? { ...a, leaveTime } : a
                            )
                          );
                        });
                        externalApi.addListener("videoConferenceJoined", () => {
                          const startCallTime = new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          });
                          startTimeRef.current = startCallTime;
                          setStartTime(startCallTime);
                        });
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
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default LiveMeeting;
