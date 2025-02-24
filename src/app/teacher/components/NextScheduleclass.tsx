'use client';

import { FaUserAlt } from 'react-icons/fa';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BsThreeDotsVertical } from 'react-icons/bs';
import axios from 'axios'; 

interface Student {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  city: string;
  country: string;
  trailId: string;
  course: string;
  classStatus: string;
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
  createdBy: string;
  createdDate: string;
  lastUpdatedDate: string;
  __v: number;
}

interface ApiResponse {
  totalCount: number;
  classSchedule: ClassData[];
}

const NextScheduledClass = () => {
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isCountdownFinished, setIsCountdownFinished] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchNextClass = async () => {
      try {
        const teacherId = localStorage.getItem('TeacherPortalId');
        const authToken = localStorage.getItem('TeacherAuthToken');
        if (!teacherId || !authToken) return;

        const response = await axios.get<ApiResponse>('https://alfurqanacademy.tech/classShedule/teacher', {
          params: { teacherId },
          headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const upcomingClass = response.data.classSchedule.find(cls => new Date(cls.startDate) > new Date()) || null;
        setClassData(upcomingClass);
      } catch (err) {
        console.error('Error fetching class details:', err);
      }
    };
    fetchNextClass();
  }, []);

  useEffect(() => {
    if (!classData) return;
    const updateRemainingTime = () => {
      const now = new Date();
      const classDate = new Date(classData.startDate);
      const [hours, minutes] = classData.startTime[0].split(':').map(Number);
      classDate.setHours(hours, minutes, 0, 0);
      
      const diff = classDate.getTime() - now.getTime();
      if (diff > 0) {
        const remainingHours = Math.floor(diff / (1000 * 60 * 60));
        const remainingMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${remainingHours}h ${remainingMinutes}m`);
      } else {
        setTimeRemaining('Started');
        setIsCountdownFinished(true);
      }
    };

    updateRemainingTime();
    const timer = setInterval(updateRemainingTime, 60000);
    return () => clearInterval(timer);
  }, [classData]);

  if (!classData) return <p className="text-center text-gray-400">No scheduled classes.</p>;

  return (
    <div className="bg-gradient-to-r from-[#30507C] to-[#5792E2] rounded-[25px] shadow flex items-center justify-between text-white">
      <h3 className="text-[15px] font-medium pt-2 p-3 underline">Your Next Evaluation Class</h3>
      <div className="items-center p-1 px-8">
        <h3 className="text-[16px] font-medium pt-2 ml-4">
          {new Date(classData.startDate).toLocaleDateString()}
        </h3>
        <div className="flex items-center space-x-6 py-2">
          <div className="flex items-center space-x-2">
            <FaUserAlt className="w-[10px]" />
            <p className="text-[13px]">{classData.student.studentFirstName} {classData.student.studentLastName}</p>
          </div>
          <div className="flex items-center space-x-2">
            <AiOutlineClockCircle className="w-[10px]" />
            <p className="text-[13px]">{classData.startTime[0]} - {classData.endTime[0]}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 p-3 rounded-lg">
        <div>
          <p className="text-white text-[13px] font-semibold">Starts in</p>
          <p className="text-white text-[10px]">Session - 12</p>
        </div>
        <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#234878] text-center">
          <div className="absolute flex items-center justify-center w-12 h-12 rounded-full bg-white">
            <div className="text-[#234878]">
              <p className="text-[8px] font-extrabold text-[#223857]">{timeRemaining}</p>
              <p className="text-[6px] font-semibold">Mins</p>
            </div>
          </div>
        </div>
        {!isCountdownFinished ? (
          <BsThreeDotsVertical className="cursor-pointer" onClick={() => setIsPopupVisible(true)} />
        ) : (
          <button className="animated-gradient text-[15px] font-medium text-white px-4 py-2 rounded-full shadow-lg" onClick={() => router.push('/teacher/ui/liveclass')}>
            Join Now
          </button>
        )}
      </div>
      {isPopupVisible && !isCountdownFinished && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-10">
          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-800 mb-4">Please wait until your session starts...</p>
            <button className="bg-[#1C3557] text-white px-4 py-2 rounded" onClick={() => setIsPopupVisible(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NextScheduledClass;
