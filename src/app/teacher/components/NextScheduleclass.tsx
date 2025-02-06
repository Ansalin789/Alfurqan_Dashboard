import { FaUserAlt } from 'react-icons/fa';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BsThreeDotsVertical } from 'react-icons/bs';
import axios from 'axios'; 

interface ClassSchedule {
  student: {
    studentId: string;
    studentFirstName: string;
    studentLastName: string;
    studentEmail: string;
  };
  teacher: {
    teacherId: string;
    teacherName: string;
    teacherEmail: string;
  };
  _id: string;
  classDay: string[];
  package: string;
  preferedTeacher: string;
  totalHours: number;
  startDate: string;
  endDate: string;
  startTime: string[];
  endTime: string[];
  scheduleStatus: string;
  status: string;
  createdBy: string;
  createdDate: string;
  lastUpdatedDate: string;
  __v: number;
}

interface ApiResponse {
  totalCount: number;
  classSchedule: ClassSchedule[];
}

const NextScheduledClass = () => {
  const [classData, setClassData] = useState<ClassSchedule[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [time, setTime] = useState({ hours: 0, minutes: 1, seconds: 0 }); 
  const [isCountdownFinished, setIsCountdownFinished] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchNextEvaluationClass = async () => {
      try {
        const teacherId = localStorage.getItem('TeacherPortalId');
        const auth = localStorage.getItem('TeacherAuthToken');
        if (!teacherId || !auth) {
          setError("Missing teacher ID or authentication token.");
          setLoading(false);
          return;
        }

        const response = await axios.get<ApiResponse>('http://localhost:5001/classShedule/teacher', {
          params: { teacherId },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth}`,
          },
        });

        setClassData(response.data.classSchedule);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNextEvaluationClass();
  }, []);

  useEffect(() => {
    if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
      setIsCountdownFinished(true);
    } else {
      const interval = setInterval(() => {
        setTime((prevTime) => {
          let { hours, minutes, seconds } = prevTime;

          if (seconds > 0) seconds--;
          else if (minutes > 0) {
            minutes--;
            seconds = 59;
          } else if (hours > 0) {
            hours--;
            minutes = 59;
            seconds = 59;
          }

          return { hours, minutes, seconds };
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [time]);

  const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (classData.length === 0) return <p className="text-center text-gray-400">No scheduled classes.</p>;

  const nextClass = classData[0]; // Get the first upcoming class

  return (
    <div className="bg-gradient-to-r from-[#30507C] to-[#5792E2] rounded-[25px] shadow flex items-center justify-between text-white">
      <h3 className="text-[15px] font-medium pt-2 p-3 underline">Your Next Evaluation Class</h3>

      <div className="items-center p-1 px-8">
        <h3 className="text-[16px] font-medium pt-2 ml-4">
          {formatDate(nextClass.startDate)}
        </h3>
        <div className="flex items-center space-x-6 py-2">
          <div className="flex items-center space-x-2">
            <FaUserAlt className="w-[10px]" />
            <p className="text-[13px]">{nextClass.student.studentFirstName} {nextClass.student.studentLastName}</p>
          </div>
          <div className="flex items-center space-x-2">
            <AiOutlineClockCircle className="w-[10px]" />
            <p className="text-[13px]">{nextClass.startTime[0]} - {nextClass.endTime[0]}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 p-3 rounded-lg">
        <div>
          <p className="text-white text-[13px] font-semibold">Starts in</p>
          <p className="text-white text-[10px]">Session - 12</p>
        </div>
        <div className="relative flex items-center justify-center p-2">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#234878] text-center">
            <div className="absolute flex items-center justify-center w-12 h-12 rounded-full bg-white">
              <div className="text-[#234878]">
                <p className="text-[8px] font-extrabold text-[#223857]">
                  {formatTime(time.hours)}:{formatTime(time.minutes)}:{formatTime(time.seconds)}
                </p>
                <p className="text-[6px] font-semibold">Mins</p>
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
