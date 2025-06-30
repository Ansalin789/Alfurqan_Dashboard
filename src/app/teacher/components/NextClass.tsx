"use client";

import { useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import axios from "axios";

interface Student {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
}

interface Teacher {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
}

interface ClassData {
  _id: string;
  student: Student;
  teacher: Teacher;
  startDate: string;
  startTime: string[];
  endTime: string[];
  classLink: string;
}

const NextScheduledClass = () => {
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const teacherId = localStorage.getItem("TeacherPortalId");
        const token = localStorage.getItem("TeacherAuthToken");
        if (!teacherId || !token) return;

        const response = await axios.get(
          "https://api.blackstoneinfomaticstech.com/classShedule/teacher",
          {
            params: { teacherId },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const now = new Date();
        const upcoming = response.data.classSchedule
          .map((item: ClassData) => {
            const classDate = new Date(item.startDate);
            const [h, m] = item.startTime[0]?.split(":").map(Number) || [0, 0];
            classDate.setHours(h, m, 0, 0);
            return { ...item, classStart: classDate };
          })
          .filter((item: any) => item.classStart > now)
          .sort((a: any, b: any) => a.classStart - b.classStart)[0];

        setClassData(upcoming ?? null);
      } catch (error) {
        console.error("Failed to fetch scheduled class:", error);
      }
    };

    fetchClassData();
  }, []);

  useEffect(() => {
    if (!classData) return;

    const classStart = new Date(classData.startDate);
    const [h, m] = classData.startTime[0]?.split(":").map(Number) || [0, 0];
    classStart.setHours(h, m, 0, 0);

    const interval = setInterval(() => {
      const now = new Date();
      const remaining = classStart.getTime() - now.getTime();

      if (remaining <= 0) {
        clearInterval(interval);
        setIsTimeUp(true);
        setTime({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor(remaining / 1000 / 60 / 60);
        const minutes = Math.floor((remaining / 1000 / 60) % 60);
        const seconds = Math.floor((remaining / 1000) % 60);
        setTime({ hours, minutes, seconds });
        setIsTimeUp(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [classData]);

  const formatTime = (num: number) => (num < 10 ? `0${num}` : num);

  const handleJoinClass = () => {
    if (classData?.classLink) {
      window.open(classData.classLink, "_blank");
    }
  };

  const progress =
    ((time.hours * 3600 + time.minutes * 60 + time.seconds) / (5 * 60 * 60)) * 100;

  return (
    <div className="bg-[#71a1db] rounded-xl  shadow flex items-center justify-between text-white">
      <div className="items-center p-2 px-8">
        <h3 className="text-[13px] font-medium pt-3">Your Next Scheduled Class</h3>
        <div className="flex items-center space-x-8 py-2">
          <div className="flex items-center space-x-2">
            <FaUser className="w-[10px]" />
            <p className="text-[13px]">{classData?.student?.studentFirstName}</p>
          </div>
          <div className="flex items-center space-x-2">
            <AiOutlineClockCircle className="w-[10px]" />
            <p className="text-[13px]">{classData?.startTime?.[0]}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 px-14">
        {isTimeUp ? (
          <>
            <button
              onClick={handleJoinClass}
              className="relative text-white px-4 py-2 rounded-full text-sm font-medium"
              style={{
                backgroundImage:
                  "linear-gradient(270deg, #0048AB, #0F79BB, #1aa3c7)",
                backgroundSize: "400% 400%",
                animation: "moveGradient 5s ease infinite",
              }}
            >
              Join Now
            </button>
            <style>
              {`
                @keyframes moveGradient {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
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
                    <p className="text-[4px] font-bold">SESSION</p>
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

export default NextScheduledClass;
