'use client'
import { AiOutlineClockCircle } from 'react-icons/ai';
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

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
  
    const upcomingClasses = response.classSchedule.filter(cls => {
      const classDate = new Date(cls.startDate);
      const [startHours, startMinutes] = cls.startTime[0].split(":").map(Number);
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
        const studentId = localStorage.getItem('StudentPortalId');
        const authToken = localStorage.getItem('StudentAuthToken');
        if (!studentId || !authToken) {
          console.log('Missing studentId or authToken');
          return;
        }

        const response = await axios.get<ApiResponse>(
          `http://localhost:5001/classShedule/students`,
          {
            params: { studentId },
            headers: { 'Authorization': `Bearer ${authToken}` }
          }
        );
        setClassData(filterUpcomingClass(response.data));
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
      const classDate = new Date(classData.startDate);
      const [startHours, startMinutes] = classData.startTime[0].split(":").map(Number);
      const [endHours, endMinutes] = classData.endTime[0].split(":").map(Number);
  
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
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-800 p-2">My Class</h2>
      <div className="bg-[#1C3557] rounded-[25px] shadow flex items-center justify-between text-white p-4">
        <div>
          <h3 className="text-[15px] font-medium">{classData?.student.studentFirstName} | <FaUser className='inline'/> {classData?.teacher.teacherName}</h3>
          <div className="flex items-center space-x-4 py-2">
            <MdDateRange className="w-[15px]" />
            <p className="text-[13px]">{classData?.classDay[0]} - {new Date(classData?.startDate ?? '').toLocaleDateString()}</p>
            <AiOutlineClockCircle className="w-[15px]" />
            <p className="text-[13px]">{classData?.startTime[0]} - {classData?.endTime[0]}</p>
          </div>
        </div>
        <div className="relative flex items-center space-x-4">
          {isPopupVisible && !isCountdownFinished && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-10 bg-black bg-opacity-50">
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
          <p className="text-[15px] font-bold">Starts in</p>
          <div className="w-12 h-12">
            <CircularProgressbar value={timeRemaining} maxValue={60} text={`${timeRemaining}m`} styles={buildStyles({ textSize: '20px', textColor: '#fff', pathColor: '#fff' })} />
          </div>
          {isCountdownFinished && (
            <button
              className="bg-white-500 px-4 py-2 rounded-full"
              onClick={() => router.push(`/student/ui/liveclass`)}
            >
              Join Now
            </button>
          )}
          <BsThreeDotsVertical className="cursor-pointer" onClick={() => setIsPopupVisible(!isPopupVisible)} />
        </div>
      </div>
    </div>
  );
};

export default NextClass;