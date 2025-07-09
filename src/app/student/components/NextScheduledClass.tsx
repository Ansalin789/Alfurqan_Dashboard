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
  classDay: string[];
  package: string;
  preferedTeacher: string;
  totalHours: number;
  startDate: string;
  endDate: string;
  startTime: string[];
  endTime: string[];
  scheduleStatus: string;
  classLink: string;
  status: string;
  classStatus: string;
  createdBy: string;
  createdDate: string;
  lastUpdatedDate: string;
}

interface ApiResponse {
  totalCount: number;
  classSchedule: ClassData[];
}

const NextScheduledClass = () => {
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const filterUpcomingClass = (response: ApiResponse): ClassData | null => {
    const now = new Date();

    const upcomingClasses = response.classSchedule.filter((cls) => {
      const classDate = new Date(cls.startDate);
      const [startHours, startMinutes] = cls.startTime[0].split(":").map(Number);
      const [endHours, endMinutes] = cls.endTime[0].split(":").map(Number);

      classDate.setHours(startHours, startMinutes, 0, 0);
      const classEndTime = new Date(classDate);
      classEndTime.setHours(endHours, endMinutes, 0, 0);

      return now < classEndTime;
    });

    upcomingClasses.sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      const [hoursA, minutesA] = a.startTime[0].split(":").map(Number);
      const [hoursB, minutesB] = b.startTime[0].split(":").map(Number);
      dateA.setHours(hoursA, minutesA, 0, 0);
      dateB.setHours(hoursB, minutesB, 0, 0);
      return dateA.getTime() - dateB.getTime();
    });

    return upcomingClasses.length > 0 ? upcomingClasses[0] : null;
  };

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const studentId = localStorage.getItem("StudentPortalId");
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("StudentAuthToken")
            : null;

        if (!studentId || !token) {
          console.log("Missing studentId or authToken");
          return;
        }

        const response = await axios.get<ApiResponse>(
          "https://api.blackstoneinfomaticstech.com/classShedule/students",
          {
            params: { studentId },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const filtered = filterUpcomingClass(response.data);
        setClassData(filtered);
      } catch (error) {
        console.error("Failed to fetch scheduled class:", error);
      }
    };

    fetchClassData();
  }, []);

  useEffect(() => {
    if (!classData) return;

    const updateRemainingTime = () => {
      const now = new Date();
      const classDate = new Date(classData.startDate);
      const [startHours, startMinutes] = classData.startTime[0]
        .split(":")
        .map(Number);
      classDate.setHours(startHours, startMinutes, 0, 0);

      const timeToStart = classDate.getTime() - now.getTime();

      const hours = Math.floor(Math.max(0, timeToStart) / 1000 / 60 / 60);
      const minutes = Math.floor((Math.max(0, timeToStart) / 1000 / 60) % 60);
      const seconds = Math.floor((Math.max(0, timeToStart) / 1000) % 60);

      setTime({ hours, minutes, seconds });
    };

    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);
    return () => clearInterval(interval);
  }, [classData]);

  const formatTime = (num: number) => (num < 10 ? `0${num}` : num);

  const progress =
    ((time.hours * 3600 + time.minutes * 60 + time.seconds) / (5 * 60 * 60)) *
    100;

  return (
    <div className="bg-[#71a1db] rounded-xl shadow flex items-center justify-between text-white">
      <div className="items-center p-2 px-8">
      <h3 className="text-[13px] font-medium pt-3">
  Your Next Scheduled Class (
  <span className="inline-flex items-center gap-1">
    <FaUser className="w-[10px] h-[10px]" />
    {classData?.teacher?.teacherName}
  </span>
  )
</h3>
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
                  {formatTime(time.hours)}:{formatTime(time.minutes)}:{formatTime(time.seconds)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextScheduledClass;
