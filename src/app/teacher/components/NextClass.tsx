'use client'
import { AiOutlineClockCircle } from 'react-icons/ai';
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
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
  classDay: string[]; // Keep this as an array of strings
  package: string;
  preferedTeacher: string;
  totalHourse: number;
  startDate: string;
  endDate: string;
  startTime: string[];  // Array of strings for startTime
  endTime: string[];    // Array of strings for endTime
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

const NextClass = () => {
  const [classData, setClassData] = useState<ClassData | null>(null);
  
  const [isCountdownFinished, setIsCountdownFinished] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const router = useRouter(); // Initialize the router

  const filterUpcomingClass = (response: { totalCount: number, classSchedule: any[] }): ClassData | null => {
    const classes = response.classSchedule;
  
    if (!Array.isArray(classes)) {
      console.log('Expected an array, but received:', classes);
      return null;
    }
  
    // Find the next class
    const nextClass = classes.find((cls) => {
      const now = new Date();
      const classStartDate = new Date(cls.startDate);
      return classStartDate > now;
    });
  
    return nextClass || null;  // Return the next class or null if not found
  };

  const [timeRemaining, setTimeRemaining] = useState("");
  
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const teacherId = localStorage.getItem('TeacherPortalId');
        const authToken = localStorage.getItem('TeacherAuthToken');
        if (!teacherId || !authToken) {
          console.log('Missing studentId or authToken');
          return;
        }
  
        const response = await axios.get<ApiResponse>(`https://alfurqanacademy.tech/classShedule/teacher`, {
          params: { teacherId },
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        const nextClass = filterUpcomingClass(response.data);
        setClassData(nextClass);
      } catch (err) {
        console.log('Error loading class details:', err);
      }
    };
  
    fetchClassData();
  }, []);

  useEffect(() => {
    if (!classData) return;

    const updateRemainingTime = () => {
      const now = new Date();
  
      // Extract class date and time
      const classDate = new Date(classData.startDate);
      const [hours, minutes] = classData.startTime[0].split(":").map(Number);
  
      classDate.setHours(hours, minutes, 0, 0);  // Set time for the class
  
      const diff = classDate.getTime() - now.getTime();
  
      if (diff > 0) {
        const remainingDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        const remainingHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const remainingMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
        setTimeRemaining(`${remainingDays}d ${remainingHours}h ${remainingMinutes}m`);
      } else {
        setTimeRemaining("Started");
        setIsCountdownFinished(true);
      }
    };
  
    updateRemainingTime();  // Initial call
  
    const timer = setInterval(updateRemainingTime, 60000);  // Update every minute
  
    return () => clearInterval(timer);  // Cleanup on unmount
  }, [classData]);
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-800 p-2">My Class</h2>
      <div className="bg-[#1C3557] rounded-[25px] shadow flex items-center justify-between text-white">
        <div className="items-center p-1 px-8">
          <div className='flex text-[15px] font-medium pt-3'>
            <h3 className="items-center">Tajweed Masterclass &nbsp; </h3> |&nbsp;
            <FaUser className='mt-1 w-[10px] h-4'/>&nbsp; <p className='text-[13px] mt-1'>{classData?.teacher.teacherName}</p>
          </div>
          <div className="flex items-center space-x-8 py-2">
            <div className="flex items-center space-x-2">
              <MdDateRange className="w-[15px]" />
              <p className="text-[13px]">{classData?.student.studentFirstName} {classData?.classDay[0]} - {new Date(classData?.startDate ?? '2022-01-01').toLocaleDateString()}</p>
            </div>
            <div className="flex items-center space-x-2">
              <AiOutlineClockCircle className="w-[15px]" />
              <p className="text-[13px]">{classData?.startTime[0]}-{classData?.endTime[0]}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 px-14">
          <p className="text-[15px] font-bold">Starts in</p>
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
    strokeDasharray={`${100 - (isCountdownFinished ? 100 : ((parseInt(timeRemaining) || 1) / 100) * 100)}, 100`}
    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
    fill="none"
    stroke={isCountdownFinished ? "#10B981" : "#295CA0"} 
    strokeWidth="3"
  />
</svg>

            <div className="relative flex items-center justify-center w-2 rounded-full bg-[#234878] text-center">
              <div className="absolute flex items-center justify-center w-10 h-10 rounded-full bg-white">
                <div className="text-[#234878]">
                  <p className="text-[4px] font-bold">SESSION 13</p>
                  <p className="text-[8px] font-extrabold text-[#223857]">
                           <span className="font-bold text-[10px]">{timeRemaining}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {!isCountdownFinished ? (
            <BsThreeDotsVertical
              className="cursor-pointer"
              onClick={() => setIsPopupVisible(true)}
            />
          ) : (
            <button
              className="animated-gradient text-[15px] font-medium text-white px-4 py-2 rounded-full shadow-lg transition-transform transform active:scale-95 hover:scale-105"
              onClick={() => router.push("/teacher/ui/liveclass")}
            >
              Join Now
            </button>
          )}

          {isPopupVisible && !isCountdownFinished && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow">
                <p className="text-gray-800 mb-4">Please wait until your session starts...</p>
                <button
                  className="bg-[#1C3557] text-white px-4 py-2 rounded text-center ml-28 justify-center"
                  onClick={() => setIsPopupVisible(false)}
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NextClass;
