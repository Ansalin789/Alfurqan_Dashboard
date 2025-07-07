"use client";

import { useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
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
  sessionStatus: string;
  classStart?: Date;
  classEnd?: Date;
}

const NextScheduledClass = () => {
  const router = useRouter();
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isClassOngoing, setIsClassOngoing] = useState(false);
  const [hasClassEnded, setHasClassEnded] = useState(false);

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
          const startDate = new Date(item.startDate);
          const [startHour, startMin] = item.startTime[0]
            .split(":")
            .map(Number);
          startDate.setHours(startHour, startMin, 0, 0);

          const endDate = new Date(item.startDate);
          const [endHour, endMin] = item.endTime[0].split(":").map(Number);
          endDate.setHours(endHour, endMin, 0, 0);

          return { ...item, classStart: startDate, classEnd: endDate };
        })
        .filter((item: ClassData) => item.classEnd! > now)
        .sort(
          (a: ClassData, b: ClassData) =>
            a.classStart!.getTime() - b.classStart!.getTime()
        )[0];

      setClassData(upcoming ?? null);
    } catch (error) {
      console.error("Failed to fetch scheduled class:", error);
    }
  };

  const triggerHandleEndCall = async () => {
    try {
      const token = localStorage.getItem("TeacherAuthToken");
      if (!token || !classData?._id) return;

      const payload = { sessionId: classData._id };

      const response = await axios.post(
        "https://api.blackstoneinfomaticstech.com/classSession/triggerEnd",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Session marked completed:", response.data);
      setClassData((prev) =>
        prev ? { ...prev, sessionStatus: "Completed" } : prev
      );
      setHasClassEnded(true);

      setTimeout(() => {
        fetchClassData();
      }, 1500); // delay ensures backend update
    } catch (err: any) {
      console.error(
        "❌ Error calling handleEndCall:",
        err?.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    fetchClassData();
  }, []);
  useEffect(() => {
    if (!classData || !classData.classStart) return;

    const interval = setInterval(() => {
      const now = new Date();
      const distance = classData.classStart!.getTime() - now.getTime();

      if (distance <= 0) {
        setTime({ hours: 0, minutes: 0, seconds: 0 });
        setIsClassOngoing(true); // Optional: immediately set class ongoing
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTime({ hours, minutes, seconds });
    }, 1000); // update every second

    return () => clearInterval(interval);
  }, [classData]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!classData) return;

      const now = new Date();
      const start = classData.classStart!;
      const end = classData.classEnd!;

      if (now >= start && now <= end) {
        setIsClassOngoing(true);
      } else {
        setIsClassOngoing(false);
      }

      if (now > end && classData.sessionStatus !== "Completed") {
        console.log(`⏹ Class ${classData._id} ended — marking via evaluation`);

        const token = localStorage.getItem("TeacherAuthToken");
        if (!token) return;

        try {
          await axios.post(
            "https://api.blackstoneinfomaticstech.com/classSession/triggerEnd",
            { sessionId: classData._id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("✅ Evaluation marked as completed");

          setClassData(null);
          setTimeout(() => {
            fetchClassData();
          }, 1500);
        } catch (err) {
          console.error("❌ Failed to mark in evaluation:", err);
        }
      }
    }, 10000); // every 10 sec

    return () => clearInterval(interval);
  }, [classData]);

  const formatTime = (num: number) => (num < 10 ? `0${num}` : num);

  const handleJoinClass = () => {
    if (classData?.classLink) {
      // window.open(classData.classLink, "_blank");
      router.push(`/teacher/ui/liveclass?id=${classData._id}`);
    }
  };

  const progress =
    ((time.hours * 3600 + time.minutes * 60 + time.seconds) / (5 * 60 * 60)) *
    100;

  if (!classData) return null;

  return (
    <div className="bg-[#71a1db] rounded-xl shadow flex items-center justify-between text-white">
      <div className="items-center p-2 px-8">
        <h3 className="text-[13px] font-medium pt-3">
          Your Next Scheduled Class
        </h3>
        <div className="flex items-center space-x-8 py-2">
          <div className="flex items-center space-x-2">
            <FaUser className="w-[10px]" />
            <p className="text-[13px]">{classData.student?.studentFirstName}</p>
          </div>
          <div className="flex items-center space-x-2">
            <AiOutlineClockCircle className="w-[10px]" />
            <p className="text-[13px]">{classData.startTime[0]}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 px-14">
        {isClassOngoing ? (
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
            <style>
              {`
                @keyframes moveGradient {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
              `}
            </style>
          </button>
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
