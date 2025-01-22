import { FaUserAlt } from 'react-icons/fa';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/app/acendpoints/page';

interface Student {
  studentFirstName: string;
  studentLastName: string;
}

interface Evaluation {
  student: Student;
  classStartDate: string;
  classStartTime: string;
}

interface ClassData {
  studentName: string;
  classStartTime: string;
  classStartDate: string;
}

const NextEvaluationClass = () => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNextEvaluationClass = async () => {
      try {
        const auth=localStorage.getItem('authToken');
        const academicId=localStorage.getItem('academicId');
        console.log("academicId>>",academicId);
        const response = await axios.get(`${API_URL}/evaluationlist`, {

          method: 'GET',
          params:{academicCoachId:academicId },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth}`,
          },
        });

        if (!response.data) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.data;

        if (!data.evaluation || !Array.isArray(data.evaluation)) {
          throw new Error('Invalid data format from API');
        }

        const upcomingClass = data.evaluation
          .filter((item: Evaluation) => {
            const classStartDate = new Date(item.classStartDate);
            const now = new Date();
            return classStartDate > now; // Filter for future classes
          })
          .sort((a: Evaluation, b: Evaluation) => {
            return (
              new Date(a.classStartDate).getTime() - new Date(b.classStartDate).getTime()
            );
          })
          .slice(0, 1) // Take only the first upcoming class
          .map((item: Evaluation) => ({
            studentName: `${item.student.studentFirstName} ${item.student.studentLastName}`,
            classStartTime: item.classStartTime,
            classStartDate: item.classStartDate, // Store class start date for countdown
          }))[0]; // Get the first element from the sliced array

        setClassData(upcomingClass || null);
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
    if (classData?.classStartDate) {
      const interval = setInterval(() => {
        const now = new Date();
        const classStartDate = new Date(classData.classStartDate);
        const remainingTime = classStartDate.getTime() - now.getTime();

        if (remainingTime <= 0) {
          clearInterval(interval);
          setTime({ hours: 0, minutes: 0, seconds: 0 }); // Class has started
        } else {
          const hours = Math.floor(remainingTime / 1000 / 60 / 60);
          const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
          const seconds = Math.floor((remainingTime / 1000) % 60);
          setTime({ hours, minutes, seconds });
        }
      }, 1000);

      return () => clearInterval(interval); // Cleanup on component unmount
    }
  }, [classData]);

  const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
  };

  const progress = ((time.hours * 3600 + time.minutes * 60 + time.seconds) / (5 * 60 * 60)) * 100;

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-gradient-to-r from-[#30507C] to-[#5792E2] rounded-[25px] shadow flex items-center justify-between text-white">
      <div className="items-center p-1 px-8">
        <h3 className="text-[15px] font-medium pt-3">Your Next Evaluation Class</h3>
        <div className="flex items-center space-x-8 py-2">
          <div className="flex items-center space-x-2">
            <FaUserAlt className="w-[10px]" />
            <p className="text-[13px]">{classData?.studentName}</p>
          </div>
          <div className="flex items-center space-x-2">
            <AiOutlineClockCircle className="w-[10px]" />
            <p className="text-[13px]">{classData?.classStartTime}</p>
          </div>
        </div>
        {classData?.classStartDate && (
          <p className="text-[13px] mt-2 text-gray-300 hidden">
            Class Date: {formatDate(classData.classStartDate)}
          </p>
        )}
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
                <p className="text-[4px] font-bold">SESSION 13</p>
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

export default NextEvaluationClass;
