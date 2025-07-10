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

const NextScheduledClass = () => {
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
       const studentId =
          typeof window !== "undefined"
            ? localStorage.getItem("StudentPortalId")
            : null;
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("StudentAuthToken")
            : null;
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
  <div className="w-full ">
    <div className="max-w-screen-xl mx-auto bg-[#78A1DB] rounded-xl shadow-md px-1 py-3 sm:px-2 md:px-6 lg:px-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div className="flex flex-col gap-2 w-full sm:w-auto">
      <h3 className="text-[13px] font-medium pt-3">
  Your Next Scheduled Class (
  <span className="inline-flex items-center gap-1">
    <FaUser className="w-[10px] h-[10px]" />
    {classData?.teacher?.teacherName}
  </span>
  )
</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm sm:text-sm md:text-sm">
          <span className="flex items-center gap-1">
            <FaUser className="text-white/90 text-base sm:text-sm" />
            {classData?.student?.studentFirstName ?? "Unknown"}
          </span>

          <span className="flex items-center gap-1">
            <MdDateRange className="text-white/90 text-base sm:text-sm" />
            Session–06
          </span>

          <span className="flex items-center gap-1">
            <AiOutlineClockCircle className="text-white/90 text-base sm:text-sm" />
            {classData?.startTime?.[0] ?? "09:00"}
          </span>
        </div>
      </div>

      {/* RIGHT: Countdown or Button */}
      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end relative flex-wrap">
        
        {/* POPUP */}
        {isPopupVisible && !isCountdownFinished && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
            <div className="bg-white dark:bg-[#1D1D1D] rounded-xl shadow-lg p-6 w-[90%] max-w-sm text-center">
              <div className="flex justify-center mb-4">
                <TimerReset className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-[#010E30]/70 mb-4 text-sm sm:text-base dark:text-white">
                Please wait until your session starts...
              </p>
              <div className="w-32 h-1 bg-orange-500 my-4 rounded-full mx-auto"></div>
              <button
                onClick={() => setIsPopupVisible(false)}
                className="px-5 py-2 text-sm sm:text-base bg-[#576CBC] text-white rounded-lg w-full hover:bg-[#4659a3] transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Label */}
        {!isCountdownFinished && (
          <p className="text-xs sm:text-sm md:text-base font-medium whitespace-nowrap">
            Starts in
          </p>
        )}

        {/* JOIN OR TIMER */}
        {isCountdownFinished ? (
          <button
            onClick={() => router.push(`/student/ui/liveclass?id=${classData?._id}`)}
            className="relative px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold 
              text-white bg-gradient-to-r from-[#576CBC] to-[#576CBC] 
              shadow-lg hover:from-[#4961BC] hover:to-[#4961BC]
              transition-all duration-700 ease-in-out 
              animate-pulse hover:animate-none"
          >
            <button 
            className="flex items-center gap-2">
              <FiVideo className="text-white text-sm sm:text-lg" />
              Join Now
            </button>
            <span
              className="absolute inset-0 rounded-full bg-white opacity-10 blur-sm"
              aria-hidden="true"
            />
          </button>
        ) : (
          <div className="relative w-14 h-14 sm:w-[50px] sm:h-[50px]">
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
                    r="5"
                    fill="#235498"
                    stroke="#4178C4"
                    strokeWidth="2"
                  />
                );
              })()}
            </svg>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40px] h-[40px] sm:w-[35px] sm:h-[35px] rounded-full bg-white flex items-center justify-center text-[#1B1B1B] text-[10px] sm:text-[10px] font-semibold shadow-sm">
              {`${Math.floor(timeRemaining / 60)}:${String(
                timeRemaining % 60
              ).padStart(2, "0")}`}
            </div>
          </div>
        )}

        {/* 3-DOT MENU */}
        <BsThreeDotsVertical
          className="text-white text-lg sm:text-xl cursor-pointer"
          onClick={() => setIsPopupVisible(!isPopupVisible)}
        />
      </div>
    </div>
  </div>
);

};

export default NextScheduledClass;
