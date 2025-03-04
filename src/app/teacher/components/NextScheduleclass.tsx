"use client";
import { AiOutlineClockCircle } from "react-icons/ai";
import { useEffect, useState } from "react";
import { FaUser, FaRegCalendarAlt } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
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
      const classDate = new Date(cls.startDate);
      const [startHours, startMinutes] = cls.startTime[0]
        .split(":")
        .map(Number);
      const [endHours, endMinutes] = cls.endTime[0].split(":").map(Number);

      classDate.setHours(startHours, startMinutes, 0, 0);
      const classEndTime = new Date(classDate);
      classEndTime.setHours(endHours, endMinutes, 0, 0);

      // Include classes that are upcoming OR currently ongoing
      return now < classEndTime;
    });

    // Sort by closest upcoming class or ongoing one first
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
        const teacherId = localStorage.getItem("TeacherPortalId");
        const authToken = localStorage.getItem("TeacherAuthToken");
        if (!teacherId || !authToken) {
          console.log("Missing studentId or authToken");
          return;
        }

        const response = await axios.get<ApiResponse>(
          `http://localhost:5001/classShedule/teacher`,
          {
            params: { teacherId },
            headers: { Authorization: `Bearer ${authToken}` },
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

    const updateRemainingTime = () => {
      const now = new Date();
      const classDate = new Date(classData.startDate);
      const [startHours, startMinutes] = classData.startTime[0]
        .split(":")
        .map(Number);
      const [endHours, endMinutes] = classData.endTime[0]
        .split(":")
        .map(Number);

      classDate.setHours(startHours, startMinutes, 0, 0);
      const classEndTime = new Date(classDate);
      classEndTime.setHours(endHours, endMinutes, 0, 0);

      const timeToStart = classDate.getTime() - now.getTime();
      const timeToEnd = classEndTime.getTime() - now.getTime();

      if (timeToStart > 0) {
        // Before class starts
        setTimeRemaining(Math.floor(timeToStart / (1000 * 60))); // Convert to minutes
        setIsCountdownFinished(false);
      } else if (timeToEnd > 0) {
        // Class ongoing
        setTimeRemaining(0); // Special value to indicate class is ongoing
        setIsCountdownFinished(true);
      } else {
        // Class ended
        setTimeRemaining(-2); // Special value to hide class
        setIsCountdownFinished(false);
      }
    };

    updateRemainingTime();
    const timer = setInterval(updateRemainingTime, 1000); // Update every second
    return () => clearInterval(timer);
  }, [classData]);

  return (
    <div>
      <style>
        {`
              @keyframes wave {
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

              .animated-gradient {
                background: linear-gradient(270deg, #10B981 10%, #FBBF24 30%, #8B5CF6 90%);
                background-size: 400% 400%;
                animation: wave 5s ease infinite;
                -webkit-background-clip: background;
                -webkit-text-fill-color: text;
              }
            `}
      </style>

      <div className="bg-gradient-to-r from-[#30507C] to-[#5792E2] rounded-[18px] shadow flex items-center justify-between text-white">
        <h3 className="text-[13px] font-medium pt-2 p-3 underline underline-offset-2">
          Your Next Evaluation Class
        </h3>
        <div className="items-center p-1 px-8">
          <p className="text-[15px] font-semibold flex pt-2 space-x-2">
            <FaRegCalendarAlt className="w-[10px] mt-[2px]" /> &nbsp;
            {classData?.classDay[0]} -{" "}
            {new Date(classData?.startDate ?? "").toLocaleDateString()}
          </p>
          <div className="flex space-x-2 py-3 text-[11px] ml-4">
            <FaUser className="inline text-[10px] mt-[1px]" />
            &nbsp; {classData?.teacher.teacherName}
            <p className="flex space-x-2">
              <AiOutlineClockCircle className="w-[10px] mt-[2px] mr-1" />
              {classData?.startTime[0]} - {classData?.endTime[0]}
            </p>
          </div>
        </div>
        <div className="relative flex items-center space-x-4">
          {isPopupVisible && !isCountdownFinished && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-10 bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow">
                <p className="text-gray-800 mb-4">
                  Please wait until your session starts...
                </p>
                <button
                  className="bg-[#1C3557] text-white text-[12px] px-2 py-1 rounded text-center ml-28 justify-center"
                  onClick={() => setIsPopupVisible(false)}
                >
                  OK
                </button>
              </div>
            </div>
          )}
          <p className="text-white text-[13px] font-semibold">Starts in</p>
          <div className="relative flex items-center justify-center p-2">
            <div className="w-16 h-16">
              <CircularProgressbar
                value={timeRemaining}
                maxValue={60}
                text={`${Math.floor(timeRemaining / 60)}:${String(
                  timeRemaining % 60
                ).padStart(2, "0")}`}
                styles={buildStyles({
                  textSize: "15px",
                  textColor: "#234878",
                  pathColor: "#FF0000",
                  trailColor: "#fff",
                  backgroundColor: "#234878",
                })}
              />
            </div>
            <div className="absolute flex items-center justify-center w-10 h-10 rounded-full bg-[#234878] text-center">
              <div className="absolute flex items-center justify-center w-8 h-8 rounded-full bg-white">
                <div className="text-[#234878]">
                  <p className="text-[8px] font-extrabold text-[#223857]">
                    {Math.floor(timeRemaining)}
                  </p>
                  <p className="text-[6px] font-semibold">Mins</p>
                </div>
              </div>
            </div>
          </div>
          {isCountdownFinished && (
            <button
              className="animated-gradient text-[15px] font-medium text-white px-4 py-2 rounded-full shadow-lg transition-transform transform active:scale-95 hover:scale-105"
              onClick={() => router.push(`/teacher/ui/liveclass`)}
            >
              Join Now
            </button>
          )}
          <BsThreeDotsVertical
            className="cursor-pointer"
            onClick={() => setIsPopupVisible(!isPopupVisible)}
          />
        </div>
      </div>
    </div>
  );
};

export default NextScheduledClass;
