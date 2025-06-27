"use client";

import { FaUserAlt } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import { useEffect, useState } from "react";
import axios from "axios";
import { progress } from "framer-motion";
interface UpcomingClass {
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

const NextTrailSession = () => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [classData, setClassData] = useState<UpcomingClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    const fetchNextTrialClass = async (teacherId: string) => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("TeacherAuthToken")
            : null;

        const response = await axios.get<UpcomingClass[]>(
          "https://api.blackstoneinfomaticstech.com/dashboard/ac/upcomingclass",
          {
            params: { teacherId: teacherId },
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const upcomingClass = response.data
          .filter((item) => new Date(item.scheduledStartDate) > new Date())
          .sort(
            (a, b) =>
              new Date(a.scheduledStartDate).getTime() -
              new Date(b.scheduledStartDate).getTime()
          )[0];

        setClassData(upcomingClass ?? null);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    // Example: get teacherId from localStorage (adjust as needed)
    const teacherId =
      typeof window !== "undefined"
        ? localStorage.getItem("TeacherId") || ""
        : "";

    if (teacherId) {
      fetchNextTrialClass(teacherId);
    } else {
      setError("Teacher ID not found");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!classData?.scheduledStartDate) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(classData.scheduledStartDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTime({ hours: 0, minutes: 0, seconds: 0 });
        setIsTimeUp(true);
      } else {
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTime({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [classData]);

  const handleStartClass = (meetingLink: string | undefined) => {
    if (meetingLink) window.open(meetingLink, "_blank");
    else console.error("No meeting link available");
  };

  const formatTime = (value: number) => (value < 10 ? `0${value}` : value);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  if (loading) return <p className="text-center">Loading upcoming class...</p>;
  if (error) return <p className="text-red-500 text-center">Error: {error}</p>;

  return (
    <div className="bg-[#71a1db] rounded-xl shadow flex justify-between items-center text-white px-6 py-4">
      <div className="items-center">
        <h3 className="text-[16px] font-medium leading-tight">Trial Session Due in</h3>
        {classData?.scheduledStartDate && (
          <p className="text-[13px] mt-1 text-gray-300 hidden">
            Class Date: {formatDate(classData.scheduledStartDate)}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {isTimeUp ? (
          <button
            onClick={() => handleStartClass(classData?.meetingLink)}
            className="relative text-white px-4 py-2 rounded-full text-sm font-medium"
            style={{
              backgroundImage: "linear-gradient(270deg, #0048AB, #0F79BB, #1aa3c7)",
              backgroundSize: "400% 400%",
              animation: "moveGradient 5s ease infinite",
            }}
          >
            Start Now
          </button>
        ) : (
          <>
            <p className="text-[16px] font-semibold whitespace-nowrap">Starts in</p>
            <div className="relative flex items-center justify-center">
              <svg className="absolute w-14 h-14" viewBox="0 0 36 36">
                <path
                  className="circle-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                />
                <path
                  className="circle"
                  strokeDasharray={`${100 - Number(progress)}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#295CA0"
                  strokeWidth="3"
                />
              
              </svg>
              <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-white">
                <div className="text-center">
                  <p className="text-[6px] font-bold text-[#234878]">SESSION</p>
                  <p className="text-[10px] font-extrabold text-[#223857]">
                    {formatTime(time.hours)}:{formatTime(time.minutes)}:{formatTime(time.seconds)}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NextTrailSession;