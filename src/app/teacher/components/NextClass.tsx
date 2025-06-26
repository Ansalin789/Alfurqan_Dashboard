"use client";

import { FaUserAlt } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import { useEffect, useState } from "react";
import { PiChalkboardLight } from "react-icons/pi";
import axios from "axios";

interface AcademicCoach {
  academicCoachId: string;
  name: string;
  email: string;
}

interface Student {
  studentId: string;
  name: string;
  email: string;
  meetingLink: string;
}

interface UpcomingClass {
  academicCoach: AcademicCoach;
  student: Student;
  _id: string;
  classType: string;
  scheduledStartDate: string;
  scheduledEndDate: string;
  scheduledFrom: string;
  scheduledTo: string;
  timeZone: string;
}

const NextClass = () => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [classData, setClassData] = useState<UpcomingClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // useEffect(() => {
  //   const fetchNextEvaluationClass = async () => {
  //     try {
  //       const academicId = localStorage.getItem("AcademicCoachPortalId");
  //       console.log("academicId>>", academicId);
  //       const token =
  //         typeof window !== "undefined"
  //           ? localStorage.getItem("AcademicCoachAuthToken")
  //           : null;

  //       if (!token) {
  //         console.error("❌ AdminAuthToken not found");
  //         return;
  //       }

  //       const response = await axios.get(
  //         `https://api.blackstoneinfomaticstech.com/dashboard/ac/upcomingclass`,
  //         {
  //           method: "GET",
  //           params: { academicCoachId: academicId },
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       if (!response.data || !Array.isArray(response.data)) {
  //         throw new Error("Invalid data format from API");
  //       }

  //       const upcomingClass = response.data
  //         .filter((item: UpcomingClass) => {
  //           const classStartDate = new Date(item.scheduledStartDate);
  //           const now = new Date();
  //           return classStartDate > now;
  //         })
  //         .sort((a: UpcomingClass, b: UpcomingClass) => {
  //           return (
  //             new Date(a.scheduledStartDate).getTime() -
  //             new Date(b.scheduledStartDate).getTime()
  //           );
  //         })
  //         .slice(0, 1)[0];

  //       setClassData(upcomingClass ?? null);
  //     } catch (err) {
  //       if (err instanceof Error) {
  //         setError(err.message);
  //       } else {
  //         setError("An unexpected error occurred");
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchNextEvaluationClass();
  // }, []);

  // useEffect(() => {
  //   if (classData?.scheduledStartDate) {
  //     const interval = setInterval(() => {
  //       const now = new Date();
  //       const classStartDate = new Date(classData.scheduledStartDate);
  //       const remainingTime = classStartDate.getTime() - now.getTime();

  //       if (remainingTime <= 0) {
  //         clearInterval(interval);
  //         setTime({ hours: 0, minutes: 0, seconds: 0 });
  //         setIsTimeUp(true);
  //       } else {
  //         const hours = Math.floor(remainingTime / 1000 / 60 / 60);
  //         const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
  //         const seconds = Math.floor((remainingTime / 1000) % 60);
  //         setTime({ hours, minutes, seconds });
  //         setIsTimeUp(false);
  //       }
  //     }, 1000);

  //     return () => clearInterval(interval);
  //   }
  // }, [classData]);

  const handleStartClass = (meetingLink: string | undefined) => {
    if (meetingLink) {
      window.open(meetingLink, "_blank");
    } else {
      console.error("No meeting link available");
    }
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

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-[#71a1db] rounded-xl shadow flex items-center justify-between text-white">
      <div className="items-center p-2 px-8">
        <h3 className="text-[16px] font-medium pt-3">
          Your Next Class Starts In
        </h3>
        <div className="flex items-center space-x-4 py-2">
          <div className="flex items-center space-x-2">
            <FaUserAlt className="w-[16px]" />
            <p className="text-[16px]">Prasanna{classData?.student.name}</p>
          </div>
          <div className="flex items-center space-x-2">
            <PiChalkboardLight  className="w-[16px]" />
            <p className="text-[16px]">Session 22{classData?.student.name}</p>
          </div>
          <div className="flex items-center space-x-2">
            <AiOutlineClockCircle className="w-[16px]" />
            <p className="text-[16px]">9.00 AM{classData?.scheduledFrom}</p>
          </div>
        </div>
        {classData?.scheduledStartDate && (
          <p className="text-[13px] mt-2 text-gray-300 hidden">
            Class Date: {formatDate(classData.scheduledStartDate)}
          </p>
        )}
      </div>
      <div className="flex items-center space-x-2 px-14">
        {isTimeUp ? (
          <>
            <button
              onClick={() => handleStartClass(classData?.student.meetingLink)}
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
                    <p className="text-[4px] font-bold">SESSION 13</p>
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

export default NextClass;
