// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import dayjs from "dayjs";
// import { useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { LogOut } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { JitsiMeeting } from "@jitsi/react-sdk";
// import BaseLayout2 from "@/components/BaseLayout2";

// interface Teacher {
//   teacherId: string;
//   teacherName: string;
//   teacherEmail: string;
// }

// interface Participant {
//   studentId: string;
//   studentName: string;
//   studentEmail: string;
//   _id: string;
// }

// interface Attendance {
//   id: string | null;
//   studentId: string;
//   name: string;
//   startTime: string | null;
//   endTime: string | null;
//   joined: boolean;
//   joinTime: string;
//   leaveTime: string;
// }

// interface Meeting {
//   _id: string;
//   meetingId: string;
//   meetingName: string;
//   teacher: Teacher;
//   participants: Participant[];
//   selectedDate: string;
//   startTime: string;
//   endTime: string;
//   description: string;
//   meetingStatus: "Scheduled" | "Ongoing" | "Completed" | string;
//   status: "Active" | "Inactive" | string;
//   createdDate: string;
//   createdBy: string;
//   updatedDate: string;
//   updatedBy: string;
//   __v: number;
// }

// const LiveMeeting = () => {
//   const [startTime, setStartTime] = useState<string>("");
//   const [meetingData, setMeetingData] = useState<Meeting | null>(null);
//   const [roomName, setRoomName] = useState("");
//   const [attendance, setAttendance] = useState<Attendance[]>([]);
//   const params = useSearchParams();
//   const meetingId = params.get("id");
//   const router = useRouter();
//   const [redirectTo, setRedirectTo] = useState<string | null>(null);
//   const startTimeRef = useRef<string>("");
//   const attendanceRef = useRef(attendance);

//   useEffect(() => {
//     attendanceRef.current = attendance;
//   }, [attendance]);

//   useEffect(() => {
//     const fetchMeetingData = async () => {
//       try {
//         const teacherId = localStorage.getItem("StudentPortalId");
//         const token = localStorage.getItem("StudentAuthToken");
//         if (!teacherId || !token) {
//           console.error("Missing Student ID or auth token");
//           return;
//         }

//         const response = await axios.get(
//           `https://api.blackstoneinfomaticstech.com/teacherMeeting`,
//           {
//             params: { meetingId },
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const meeting: Meeting = response.data;
//         if (meeting && meeting.meetingStatus !== "Completed") {
//           setMeetingData(meeting);
//           setRoomName(meeting.meetingId);

//           // Build initial attendance
//           const initialAttendance = meeting.participants.map((p) => ({
//             id: null,
//             studentId: p.studentId,
//             name: p.studentName,
//             startTime: null,
//             endTime: null,
//             joined: false,
//             joinTime: "",
//             leaveTime: "",
//           }));
//           setAttendance(initialAttendance);
//         }
//       } catch (error) {
//         console.error("Error fetching meeting data:", error);
//       }
//     };

//     fetchMeetingData();
//   }, [params]);

//   useEffect(() => {
//     if (redirectTo) {
//       router.push(redirectTo);
//     }
//   }, [redirectTo, router]);

//   const handleEndCall = async () => {
//     const endCallTime = new Date().toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: false,
//     });
//     const startTimeUsed = startTimeRef.current;

//     if (!meetingData || !startTimeUsed) {
//       console.error("Missing meeting data or start time");
//       return;
//     }

//     const scheduledDate = meetingData.selectedDate;
//     const scheduledTime = meetingData.startTime;
//     const scheduledStart = dayjs(`${scheduledDate}T${scheduledTime}`);
//     let joinHour = 0;
//     let joinMinute = 0;

//     if (startTimeUsed.includes(":")) {
//       const [h, m] = startTimeUsed.split(":").map(Number);
//       joinHour = h;
//       joinMinute = m;
//     }

//     const actualJoin = dayjs(
//       `${scheduledDate}T${String(joinHour).padStart(2, "0")}:${String(
//         joinMinute
//       ).padStart(2, "0")}`
//     );
//     const diffMinutes = actualJoin.diff(scheduledStart, "minute");
//     const teacherAbsent = diffMinutes >= 15;

//     const student = attendanceRef.current[0];
//     const studentJoined = student?.joinTime && student.joinTime !== "";
//     const parsedStudentJoin = studentJoined
//       ? dayjs(`${scheduledDate}T${student.joinTime}`)
//       : null;
//     const studentLateBy = parsedStudentJoin
//       ? parsedStudentJoin.diff(scheduledStart, "minute")
//       : Infinity;
//     const studentAbsent = !studentJoined || studentLateBy > 15;
//     const studentAttendee = studentAbsent ? "absent" : "present";

//     let sessionStarttime = "00:00";
//     let sessionsEndtime = "00:00";

//     if (!teacherAbsent) {
//       if (!studentAbsent) {
//         sessionStarttime = startTimeUsed;
//         sessionsEndtime = endCallTime;
//       } else {
//         sessionStarttime = meetingData.startTime;
//         sessionsEndtime = meetingData.endTime;
//       }
//     }

//     const payload = {
//       ...meetingData,
//       sessionStarttime,
//       sessionsEndtime,
//       meetingStatus: "Completed",
//       teacherAttendee: teacherAbsent ? "absent" : "present",
//       studentAttendee,
//     };

//     try {
//       const token = localStorage.getItem("StudentAuthToken");
//       await axios.put(
//         `https://api.blackstoneinfomaticstech.com/updateTeacherMeeting/${meetingId}`,
//         payload,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log("Meeting schedule updated");

//       // ✅ Instead of router.push directly
//       setRedirectTo("/Student/ui/meeting");
//     } catch (error) {
//       console.error("Failed to update meeting schedule:", error);
//     }
//   };

//   return (
//     <BaseLayout2>
//       {/* <TeacherHeader currentSection="Live Meeting" /> */}
//       <div className="flex h-screen">
//         <div className="flex flex-col w-full min-h-screen px-4 sm:px-6 md:px-8">
//           <div className="flex flex-col lg:flex-row gap-6 flex-1 w-full max-w-screen-xl mx-auto py-0">
//             <div className="flex-1 overflow-auto">
//               <div className="relative mb-0">
//                 <Link
//                   href="/supervisor/ui/viewschedule"
//                   className="absolute top-0 right-0"
//                 >
//                   <LogOut className="w-6 h-6 text-red-500 hover:text-red-600 transition" />
//                 </Link>
//               </div>

//               <div className="p-1 sm:p-2 relative w-full flex flex-col flex-1 h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] xl:h-[85vh]">
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h2 className="text-lg font-medium">
//                       {meetingData?.participants?.[0]?.studentName}
//                     </h2>
//                     <span className="text-sm text-gray-500">
//                       {meetingData?.description}
//                     </span>
//                   </div>
//                   <div className="ml-auto w-64">
//                     <label
//                       htmlFor="attendance-select"
//                       className="block text-sm font-semibold mb-1"
//                     >
//                       Attendance
//                     </label>
//                     <select
//                       id="attendance-select"
//                       className="w-full border p-2 rounded focus:outline-none text-[10px] dark:bg-[#252525] "
//                     >
//                       {attendance
//                         .filter((s) => s.joined) // only real participants
//                         .map((s) => {
//                           let statusLabel = "";

//                           if (s.leaveTime) {
//                             statusLabel = `🚪 Left at ${s.leaveTime}`;
//                           } else {
//                             statusLabel = `✅ Joined at ${s.joinTime}`;
//                           }

//                           return (
//                             <option
//                               className="text-[12px]"
//                               key={s.id}
//                               value={s.id || ""}
//                             >
//                               {s.name} – {statusLabel}
//                             </option>
//                           );
//                         })}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="flex-1 min-w-0 w-full h-[50vh] md:h-[60vh] rounded-md overflow-hidden shadow-inner border border-gray-300">
//                   {roomName && (
//                     <JitsiMeeting
//                       roomName={roomName}
//                       domain="meet.alfurqanapp.com"
//                       configOverwrite={{
//                         startWithAudioMuted: false,
//                         startWithVideoMuted: false,
//                         toolbarButtons: [
//                           "microphone",
//                           "camera",
//                           "closedcaptions",
//                           "desktop",
//                           "fullscreen",
//                           "fodeviceselection",
//                           "hangup",
//                           "profile",
//                           "chat",
//                           "settings",
//                           "raisehand",
//                           "videoquality",
//                           "filmstrip",
//                           "shortcuts",
//                           "tileview",
//                           "recording",
//                         ],
//                       }}
//                       onApiReady={(externalApi) => {
//                         // ================= JOIN =================
//                         externalApi.addListener(
//                           "participantJoined",
//                           (event) => {
//                             const joinTime = new Date().toLocaleTimeString([], {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                               hour12: true,
//                             });

//                             let realId = "";
//                             let realName = "Guest";

//                             // ✅ Extract ID from displayName
//                             if (event.displayName?.includes("| ID :")) {
//                               const parts = event.displayName.split("| ID :");
//                               realName = parts[0].trim();
//                               realId = parts[1].trim();
//                             } else {
//                               realName = event.displayName || "Guest";
//                             }

//                             // ❌ If no ID → ignore
//                             if (!realId) {
//                               console.warn(
//                                 "⚠️ No ID found:",
//                                 event.displayName,
//                               );
//                               return;
//                             }

//                             setAttendance((prev) => {
//                               // ✅ Avoid duplicate entry
//                               const exists = prev.some(
//                                 (a) => a.studentId === realId,
//                               );

//                               if (exists) {
//                                 return prev.map((a) =>
//                                   a.studentId === realId
//                                     ? {
//                                       ...a,
//                                       id: event.id,
//                                       joined: true,
//                                       joinTime,
//                                     }
//                                     : a,
//                                 );
//                               }

//                               // ✅ New join
//                               return [
//                                 ...prev,
//                                 {
//                                   id: event.id, // jitsi id
//                                   studentId: realId, // ✅ REAL DB ID
//                                   name: realName,
//                                   startTime: null,
//                                   endTime: null,
//                                   joined: true,
//                                   joinTime,
//                                   leaveTime: "",
//                                 },
//                               ];
//                             });
//                           },
//                         );

//                         // ================= LEAVE =================
//                         externalApi.addListener("participantLeft", (event) => {
//                           const leaveTime = new Date().toLocaleTimeString([], {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                             hour12: true,
//                           });

//                           setAttendance((prev) =>
//                             prev.map((a) =>
//                               a.id === event.id ? { ...a, leaveTime } : a,
//                             ),
//                           );
//                         });
//                         externalApi.addListener("videoConferenceJoined", () => {
//                           const startCallTime = new Date().toLocaleTimeString(
//                             [],
//                             {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                               hour12: false,
//                             }
//                           );
//                           startTimeRef.current = startCallTime;
//                           setStartTime(startCallTime);
//                         });
//                         externalApi.addListener("videoConferenceLeft", () => {
//                           handleEndCall();
//                         });
//                       }}
//                       getIFrameRef={(iframeRef) => {
//                         iframeRef.style.border = "0px";
//                         iframeRef.style.height = "100%";
//                         iframeRef.style.width = "100%";
//                       }}
//                     />
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </BaseLayout2>
//   );
// };

// export default LiveMeeting;









"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import BaseLayout2 from "@/components/BaseLayout2";
import StudentHeader from "../../components/StudentHeader";
import { JitsiMeeting } from "@jitsi/react-sdk";

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
  status: "Active" | "Inactive" | string;
  teacher: Array<{
    teacherId: string;
    teacherName: string;
    teacherEmail: string;
    attendee: string;
  }>;
}

const LiveMeeting = () => {
  const [startTime, setStartTime] = useState<string>("");
  const [meetingData, setMeetingData] = useState<Meeting | null>(null);
  const [roomName, setRoomName] = useState("");
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const params = useSearchParams();
  const meetingId = params.get("id");
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const startTimeRef = useRef<string>("");

  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        const token = localStorage.getItem("StudentAuthToken");
        if (!token) {
          console.error("Missing auth token");
          return;
        }

        const response = await axios.get(
          `https://api.blackstoneinfomaticstech.com/teacherMeeting`,
          {
            params: { meetingId },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const meeting = response.data.meetings[0]?.data; // Access the first meeting's data
        if (meeting && meeting.meetingStatus !== "Completed") {
          setMeetingData(meeting);
          setRoomName(meeting.meetingId);

          // Build initial attendance
          const initialAttendance = meeting.participants.map((p: any) => ({
            id: null,
            studentId: p.participantId,
            name: p.participantName,
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
    const endCallTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
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

    const actualJoin = dayjs(
      `${scheduledDate}T${String(joinHour).padStart(2, "0")}:${String(joinMinute).padStart(2, "0")}`,
    );
    const diffMinutes = actualJoin.diff(scheduledStart, "minute");
    const teacherAbsent = diffMinutes >= 15;

    const student = attendance[0]; // Assuming attendance is an array
    const studentJoined = student?.joinTime && student.joinTime !== "";
    const parsedStudentJoin = studentJoined
      ? dayjs(`${scheduledDate}T${student.joinTime}`)
      : null;
    const studentLateBy = parsedStudentJoin
      ? parsedStudentJoin.diff(scheduledStart, "minute")
      : Infinity;
    const studentAbsent = !studentJoined || studentLateBy > 15;
    const studentAttendee = studentAbsent ? "absent" : "present";

    const payload = {
      ...meetingData,
      sessionStarttime: startTimeUsed,
      sessionsEndtime: endCallTime,
      meetingStatus: "Completed",
      teacherAttendee: teacherAbsent ? "absent" : "present",
      studentAttendee,
    };

    try {
      const token = localStorage.getItem("StudentAuthToken");
      await axios.put(
        `https://api.blackstoneinfomaticstech.com/updateTeacherMeeting/${meetingId}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Meeting schedule updated");
      setRedirectTo("/student/ui/meeting");
    } catch (error) {
      console.error("Failed to update meeting schedule:", error);
    }
  };

  return (
    <BaseLayout2>
      <StudentHeader currentSection="Live Meeting" />
      <div className="flex h-screen">
        <div className="flex flex-col w-full min-h-screen px-4 sm:px-6 md:px-8">
          <div className="flex flex-col lg:flex-row gap-6 flex-1 w-full max-w-screen-xl mx-auto py-0">
            <div className="flex-1 overflow-auto">
              <div className="p-1 sm:p-2 relative w-full flex flex-col flex-1 h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] xl:h-[85vh]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-medium">
                      {meetingData?.meetingName}
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
                      className="w-full border p-2 rounded focus:outline-none text-[10px] dark:bg-[#252525] "
                    >
   {attendance.map((s) => {

  let status = "❌ Not Joined";

  if (s.joined) {
    status = s.leaveTime
      ? `🚪 Left at ${s.leaveTime}`
      : `✅ Joined at ${s.joinTime}`;
  }

  return (
    <option key={s.studentId || s.id}>
      {s.name} – {status}
    </option>
  );
})}


                    </select>
                  </div>
                </div>
                {/* Jitsi Meeting Component */}
                {roomName && (
                  <JitsiMeeting
                    roomName={roomName}
    userInfo={{
    displayName: `${localStorage.getItem("StudentName")} | ID : ${localStorage.getItem("StudentId")}`,
    email: localStorage.getItem("StudentEmail") || "student@alfurqan.com",
  }}

                    domain="meet.alfurqanapp.com"
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

  // ================= JOIN =================
 externalApi.addListener("participantJoined", (event) => {

  const joinTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  console.log("🟢 Joined:", event.displayName, event.id);

  let name = event.displayName || "Guest";

  // Remove "| ID : xxx" if exists
  if (name.includes("|")) {
    name = name.split("|")[0].trim();
  }

  setAttendance((prev) => {

    // 🔥 Match by JITSI ID
    const exists = prev.find((a) => a.id === event.id);

    if (exists) {
      return prev.map((a) =>
        a.id === event.id
          ? {
              ...a,
              joined: true,
              joinTime,
              leaveTime: "",
            }
          : a
      );
    }

    // 🔥 Update first "not joined" slot if exists
    const firstNotJoined = prev.find((a) => !a.joined);

    if (firstNotJoined) {
      return prev.map((a) =>
        a === firstNotJoined
          ? {
              ...a,
              id: event.id,
              name,
              joined: true,
              joinTime,
              leaveTime: "",
            }
          : a
      );
    }

    // 🔥 Otherwise add new
    return [
      ...prev,
      {
        id: event.id,
        studentId: event.id,
        name,
        startTime: null,
        endTime: null,
        joined: true,
        joinTime,
        leaveTime: "",
      },
    ];
  });
});


  // ================= LEAVE =================
externalApi.addListener("participantLeft", (event) => {

  const leaveTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  console.log("🔴 Left:", event.id);

  setAttendance((prev) =>
    prev.map((a) =>
      a.id === event.id
        ? {
            ...a,
            joined: false,
            leaveTime,
          }
        : a
    )
  );
});


  // ================= HOST JOIN =================
  externalApi.addListener("videoConferenceJoined", () => {

    const startCallTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    startTimeRef.current = startCallTime;
    setStartTime(startCallTime);
  });

  // ================= HOST LEAVE =================
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
    </BaseLayout2>
  );
};

export default LiveMeeting;

