"use client";

import { FaUserAlt } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import { useEffect, useState } from "react";
import axios from "axios";

interface Student {
  studentFirstName: string;
  studentLastName: string;
}

interface Evaluation {
  student: Student;
  classStartDate: string;
  classStartTime: string;
  meetingLink?: string;
}

interface ClassData {
  studentName: string;
  classStartTime: string;
  classStartDate: string;
  meetingLink?: string;
}

const NextEvaluationClass = () => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    const fetchNextEvaluationClass = async () => {
      try {
        const academicId = localStorage.getItem("AcademicCoachPortalId");
        console.log("academicId>>", academicId);
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("AcademicCoachAuthToken")
            : null;

        // // Hardcoded test data
        // const mockData = {
        //   studentName: "John Doe",
        //   classStartTime: "14:30:00", // 2:30 PM
        //   classStartDate: new Date().toISOString(), // Today's date
        //   meetingLink: "https://meet.google.com/abc-defg-hij",
        // };

        if (!token) {
          console.error("❌ AdminAuthToken not found");
          return;
        }
        const response = await axios.get(
          `https://api.blackstoneinfomaticstech.com/evaluationlist`,
          {
            method: "GET",
            params: { academicCoachId: academicId },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.data;

        if (!data.evaluation || !Array.isArray(data.evaluation)) {
          throw new Error("Invalid data format from API");
        }

        const upcomingClass = data.evaluation
          .filter((item: Evaluation) => {
            const classStartDate = new Date(item.classStartDate);
            const now = new Date();
            return classStartDate > now;
          })
          .sort((a: Evaluation, b: Evaluation) => {
            return (
              new Date(a.classStartDate).getTime() -
              new Date(b.classStartDate).getTime()
            );
          })
          .slice(0, 1)
          .map((item: Evaluation) => ({
            studentName: `${item.student.studentFirstName} ${item.student.studentLastName}`,
            classStartTime: item.classStartTime,
            classStartDate: item.classStartDate,
            meetingLink: item.meetingLink,
          }))[0];

        setClassData(upcomingClass ?? null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNextEvaluationClass();
    // setClassData(mockData);
    // setLoading(false);
  }, []);

  useEffect(() => {
    if (classData?.classStartDate) {
      const interval = setInterval(() => {
        const now = new Date();
        const classStartDate = new Date(classData.classStartDate);
        const remainingTime = classStartDate.getTime() - now.getTime();

        if (remainingTime <= 0) {
          clearInterval(interval);
          setTime({ hours: 0, minutes: 0, seconds: 0 });
          setIsTimeUp(true);
        } else {
          const hours = Math.floor(remainingTime / 1000 / 60 / 60);
          const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
          const seconds = Math.floor((remainingTime / 1000) % 60);
          setTime({ hours, minutes, seconds });
          setIsTimeUp(false);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [classData]);

  const handleStartClass = () => {
    if (classData?.meetingLink) {
      window.open(classData.meetingLink, "_blank");
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
        <h3 className="text-[13px] font-medium pt-3">
          Your Next Evaluation Class
        </h3>
        <div className="flex items-center space-x-8 py-2">
          <div className="flex items-center space-x-2">
            <FaUserAlt className="w-[10px]" />
            <p className="text-[13px]">{classData?.studentName}</p>
          </div>
          <div className="flex items-center space-x-2">
            <AiOutlineClockCircle className="w-[10px]" />
            <p className="text-[13px]">{classData?.classStartTime}</p>
          </div>
        </div>
        {classData?.classStartDate && (
          <p className="text-[13px] mt-2 text-gray-300 hidden">
            Class Date: {formatDate(classData.classStartDate)}
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

export default NextEvaluationClass;
