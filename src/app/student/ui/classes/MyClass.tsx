"use client";
import { AiOutlineClockCircle } from "react-icons/ai";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FiVideo } from "react-icons/fi";
import { TimerReset } from "lucide-react";

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
  totalHourse: number;
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

const NextClass = () => {
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isCountdownFinished, setIsCountdownFinished] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const router = useRouter();

  const filterUpcomingClass = (response: ApiResponse): ClassData | null => {
    const now = new Date();

    const upcomingClasses = response.classSchedule.filter((cls) => {
       if (cls.scheduleStatus === "Completed") return false;
      const classDate = new Date(cls.startDate);
      const [startHours, startMinutes] = cls.startTime[0]
        .split(":")
        .map(Number);
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
        const studentId =
          typeof window !== "undefined"
            ? localStorage.getItem("StudentPortalId")
            : null;
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("StudentAuthToken")
            : null;
        if (!studentId || !token) {
          console.log("Missing studentId or authToken");
          return;
        }

        const response = await axios.get<ApiResponse>(
          `https://api.blackstoneinfomaticstech.com/classShedule/students`,
          {
            params: { studentId },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClassData(filterUpcomingClass(response.data));
      } catch (err) {
        console.log("Error loading class details:", err);
      }
    };
    fetchClassData();
  }, []);

  useEffect(() => {
    if (!classData) return;

    const fetchNextClass = async () => {
      try {
        const studentId = localStorage.getItem("StudentPortalId");
        const token = localStorage.getItem("StudentAuthToken");
        if (!studentId || !token) return;

        const response = await axios.get<ApiResponse>(
          `https://api.blackstoneinfomaticstech.com/classShedule/students`,
          {
            params: { studentId },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const next = filterUpcomingClass(response.data);
        setClassData(next);
      } catch (error) {
        console.error("Failed to fetch next class:", error);
      }
    };

    const updateRemainingTime = () => {
      const now = new Date();

      const classStart = new Date(classData.startDate);
      const classEnd = new Date(classData.startDate);

      const [startHours, startMinutes] = classData.startTime[0]
        .split(":")
        .map(Number);
      const [endHours, endMinutes] = classData.endTime[0]
        .split(":")
        .map(Number);

      classStart.setHours(startHours, startMinutes, 0, 0);
      classEnd.setHours(endHours, endMinutes, 0, 0);

      if (now < classStart) {
        const timeToStart = classStart.getTime() - now.getTime();
        setTimeRemaining(Math.floor(timeToStart / (1000 * 60)));
        setIsCountdownFinished(false);
      } else if (now >= classStart && now < classEnd) {
        setTimeRemaining(-1);
        setIsCountdownFinished(true);
      } else {
        // After class ends
        setIsCountdownFinished(false);
        setTimeRemaining(-1);
        fetchNextClass();
      }
    };

    updateRemainingTime();
    const timer = setInterval(updateRemainingTime, 1000);
    return () => clearInterval(timer);
  }, [classData]);

  return (
     <div
            className="w-full max-w-screen-xl mx-auto bg-[#78A1DB] rounded-lg shadow 
             flex flex-wrap items-center justify-between px-4  sm:px-6 lg:px-8 py-5 text-white"
     >

        {/* Left Info */}
        <div className="flex flex-col gap-1">
          <p className="text-[16px] font-medium text-white">
            Your Next Class Starts In
          </p>

          <div className="flex flex-wrap items-center gap-5 mt-1 text-[15px] font-">
            <span className="flex items-center gap-1">
              <FaUser className="text-white/90 text-[15px]" />
              {classData?.student?.studentFirstName ?? "Unknown"}
            </span>

            <span className="flex items-center gap-1">
              <MdDateRange className="text-white/90 text-[16px]" />
              Session–06
            </span>

            <span className="flex items-center gap-1">
              <AiOutlineClockCircle className="text-white/90 text-[16px]" />
              {classData?.startTime?.[0] ?? "09:00"}
            </span>
          </div>
        </div>

        {/* Right Countdown */}
        <div className="relative flex items-center gap-4">
          {/* Popup */}
          {isPopupVisible && !isCountdownFinished && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 text-center dark:bg-[#1D1D1D]">
                <div className="flex justify-center mb-4">
                  <TimerReset className="w-10 h-10 text-orange-600" />
                </div>
                <p className="text-[#010E30]/70 mb-4 text-lg dark:text-white">
                  Please wait until your session starts...
                </p>
                <div className="w-32 h-1 bg-orange-500 my-4  rounded-full mx-auto"></div>
                <button
                  onClick={() => setIsPopupVisible(false)}
                  className="px-6 py-3 bg-[#576CBC] text-white rounded-lg hover:bg-[] transition-colors w-full"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Timer Label or Join */}
          <p className="text-[16px] font-medium whitespace-nowrap">
            {isCountdownFinished ? " " : "Starts in"}
          </p>

          {/* Countdown OR Join Now Button */}
          {isCountdownFinished ? (
            <button
              onClick={() => router.push("/student/ui/liveclass")}
              className="relative px-6 py-2 rounded-full text-sm font-semibold 
               text-white bg-gradient-to-r from-[#576CBC] to-[#576CBC] 
               shadow-lg hover:from-[#4961BC] hover:to-[#4961BC]
               transition-all duration-800 ease-in-out 
               animate-pulse hover:animate-none"
            >
              <span className="flex items-center gap-2">
                <FiVideo className="text-white text-lg" />
                Join Now
              </span>

              <span
                className="absolute inset-0 rounded-full bg-white opacity-10 blur-sm"
                aria-hidden="true"
              />
            </button>
          ) : (
            <div className="relative w-16 h-16 sm:w-[70px] sm:h-[70px]">
              <CircularProgressbar
                value={60 - (timeRemaining % 60)}
                maxValue={60}
                strokeWidth={5}
                text={""}
                styles={buildStyles({
                  pathColor: "#4178C4",
                  trailColor: "#E0E0E0",
                  strokeLinecap: "butt",
                  pathTransitionDuration: 0.5,
                })}
              />
              <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
              >
                {(() => {
                  const progress = 60 - (timeRemaining % 60);
                  const angle = (progress / 60) * 360 - 90;
                  const radius = 47.5;
                  const rad = (angle * Math.PI) / 180;
                  const x = 50 + radius * Math.cos(rad);
                  const y = 50 + radius * Math.sin(rad);

                  return (
                    <circle
                      cx={x}
                      cy={y}
                      r="4.5"
                      fill="#235498"
                      stroke="#4178C4"
                      strokeWidth="2"
                    />
                  );
                })()}
              </svg>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[46px] h-[46px] sm:w-[50px] sm:h-[50px] rounded-full bg-white flex items-center justify-center text-[#1B1B1B] text-[13px] sm:text-[14px] font-semibold shadow-sm">
                {`${Math.floor(timeRemaining / 60)}:${String(
                  timeRemaining % 60
                ).padStart(2, "0")}`}
              </div>
            </div>
          )}

          {/* Options Icon */}
          <BsThreeDotsVertical
            className="cursor-pointer"
            onClick={() => setIsPopupVisible(!isPopupVisible)}
          />
        </div>
      </div>
  );
};

export default NextClass;
