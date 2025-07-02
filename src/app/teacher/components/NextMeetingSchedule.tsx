"use client";

import { FaUserAlt } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import { useEffect, useState } from "react";
import axios from "axios";

interface Teacher {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
}

interface Participant {
  studentId: string;
  studentName: string;
  studentEmail: string;
}

interface UpcomingMeeting {
  meetingId: string;
  meetingName: string;
  teacher: Teacher;
  participants: Participant[];
  meetingdate: string;
  startTime: string;
  endTime: string;
  description: string;
  meetingStatus: string;
  status: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string;
}

const NextMeetingSchedule = () => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [classData, setClassData] = useState<UpcomingMeeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    const fetchMeeting = async () => {
      setLoading(true);
      setError(null);
      try {

        const teacherId = localStorage.getItem("TeacherPortalId");
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("TeacherAuthToken")
            : null;

        if (!token) {
          console.error("❌ AdminAuthToken not found");
          return;
        }
        const res = await axios.get(`http://localhost:5001/teacherMeeting`,
          {
            method: "GET",
            params: { teacherId: teacherId },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        let meeting = res.data;
        if (Array.isArray(meeting)) {
          const now = new Date();
          meeting = meeting
            .filter((m: UpcomingMeeting) => {
              if (!m.startTime || !m.meetingdate) return false;
              const meetingStart = new Date(m.meetingdate);
              const [startHour, startMinute] = m.startTime.split(":").map(Number);
              meetingStart.setHours(startHour, startMinute, 0, 0);
              return meetingStart > now;
            })
            .sort((a: UpcomingMeeting, b: UpcomingMeeting) => {
              if (!a.startTime || !a.meetingdate || !b.startTime || !b.meetingdate) return 0;
              const aStart = new Date(a.meetingdate);
              const bStart = new Date(b.meetingdate);
              const [aHour, aMinute] = a.startTime.split(":").map(Number);
              const [bHour, bMinute] = b.startTime.split(":").map(Number);
              aStart.setHours(aHour, aMinute, 0, 0);
              bStart.setHours(bHour, bMinute, 0, 0);
              return aStart.getTime() - bStart.getTime();
            })[0] || null;
        }
        setClassData(meeting);
        setLoading(false);
      } catch (err: any) {
        setError('Failed to fetch meeting data');
        setLoading(false);
      }
    };
    fetchMeeting();
  }, []);

  useEffect(() => {
    if (!classData || !classData.startTime || !classData.meetingdate) return;
    const meetingStart = new Date(classData.meetingdate);
    const [startHour, startMinute] = classData.startTime.split(":").map(Number);
    meetingStart.setHours(startHour, startMinute, 0, 0);

    const updateTimer = () => {
      const now = new Date();
      const diff = meetingStart.getTime() - now.getTime();
      if (diff <= 0) {
        setTime({ hours: 0, minutes: 0, seconds: 0 });
        setIsTimeUp(true);
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTime({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [classData]);

  const handleStartClass = () => {
    alert('No meeting link provided in API response.');
  };

  const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? "0" + day : day}.${
      month < 10 ? "0" + month : month
    }.${year}`;
  };

  const progress =
    ((time.hours * 3600 + time.minutes * 60 + time.seconds) / (5 * 60 * 60)) *
    100;

  if (loading) {
    return (
      <div className="bg-[#71a1db] rounded-xl shadow flex items-center justify-between text-white p-6 min-h-[100px]">
        <div className="flex-1 space-y-4">
          <div className="h-3 bg-blue-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-3 bg-blue-200 rounded w-1/4 animate-pulse"></div>
          <div className="h-3 bg-blue-200 rounded w-1/2 animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-2 px-14">
          <div className="w-16 h-16 bg-blue-300 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  // Helper to check if meeting is today
  const isMeetingToday = (meeting: UpcomingMeeting | null) => {
    if (!meeting || !meeting.meetingdate) return false;
    const today = new Date();
    const meetingDate = new Date(meeting.meetingdate);
    return (
      today.getFullYear() === meetingDate.getFullYear() &&
      today.getMonth() === meetingDate.getMonth() &&
      today.getDate() === meetingDate.getDate()
    );
  };

  if (!classData || !isMeetingToday(classData)) {
    return (
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#71a1db] to-[#71a1db] rounded-xl shadow p-5 min-h-[90px]">
        <div className="text-3xl mb-1 animate-bounce">✨</div>
        <div className="text-md font-semibold text-blue-50 mb-1">No meeting scheduled for today!</div>
        {/* <div className="text-xs text-blue-800">Enjoy your day and keep up the great work! 🌟</div> */}
      </div>
    );
  }

  return (
    <div className="bg-[#71a1db] rounded-xl shadow flex items-center justify-between text-white">
      <div className="items-center p-2 px-8">
        <h3 className="text-[13px] font-medium pt-3">
          Your Next Meeting is Scheduled In
        </h3>
        <div className="flex items-center space-x-8 py-2">
          <div className="flex items-center space-x-2">
            <p className="text-[13px]">{classData?.meetingName || 'Meeting'}</p>
          </div>
          <div className="flex items-center space-x-2">
            <AiOutlineClockCircle className="w-[10px]" />
            <p className="text-[13px]">{classData?.startTime}</p>
          </div>
        </div>
        {classData?.meetingdate && (
          <p className="text-[13px] mt-2 text-gray-300">
            Class Date: {formatDate(classData.meetingdate)}
          </p>
        )}
      </div>
      <div className="flex items-center space-x-2 px-14">
        {isTimeUp ? (
          <>
            <button
              onClick={handleStartClass}
              className="relative text-white px-4 py-2 rounded-full text-sm font-medium"
              style={{
                backgroundImage:
                  "linear-gradient(270deg, #0048AB, #0F79BB, #1aa3c7)",
                backgroundSize: "400% 400%",
                animation: "moveGradient 5s ease infinite",
              }}
            >
              Start Now
            </button>
            <style>
              {`
          @keyframes moveGradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}
            </style>
          </>
        ) : (
          <>
            <p className="text-[13px] font-medium">Starts in</p>
            <div className="relative flex items-center justify-center p-10">
              <svg className="absolute w-14 h-20" viewBox="0 0 36 36">
                <path
                  className="circle-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                />
                <path
                  className="circle"
                  strokeDasharray={`${progress}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#295CA0"
                  strokeWidth="3"
                />
              </svg>
              <div className="relative flex items-center justify-center w-2 rounded-full bg-[#234878] text-center">
                <div className="absolute flex items-center justify-center w-10 h-10 rounded-full bg-white">
                  <div className="text-[#234878]">
                    <p className="text-[4px] font-bold">{classData?.meetingId || 'SESSION'}</p>
                    <p className="text-[8px] font-extrabold text-[#223857]">
                      {formatTime(time.hours)}:{formatTime(time.minutes)}:
                      {formatTime(time.seconds)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NextMeetingSchedule;
