import { FaUserAlt } from 'react-icons/fa';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { useEffect, useState } from 'react';

const NextClass = () => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [classData, setClassData] = useState<{
    studentName: string;
    classStartTime: string;
    classStartDate: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchNextEvaluationClass = async () => {
  //     try {
  //       const auth=localStorage.getItem('TeacherAuthToken');
  //       const response = await fetch('http://localhost:5001/evaluationlist', {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${auth}`, 
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error(`Failed to fetch data: ${response.statusText}`);
  //       }

  //       const data = await response.json();

  //       if (!data.evaluation || !Array.isArray(data.evaluation)) {
  //         throw new Error('Invalid data format from API');
  //       }

  //       const upcomingClass = data.evaluation
  //         .filter((item: any) => {
  //           const classStartDate = new Date(item.classStartDate);
  //           const now = new Date();
  //           return classStartDate > now; // Filter for future classes
  //         })
  //         .sort((a: any, b: any) => {
  //           return (
  //             new Date(a.classStartDate).getTime() -
  //             new Date(b.classStartDate).getTime()
  //           );
  //         })
  //         .slice(0, 1) // Take only the first upcoming class
  //         .map((item: any) => ({
  //           studentName: `${item.student.studentFirstName} ${item.student.studentLastName}`,
  //           classStartTime: item.classStartTime,
  //           classStartDate: item.classStartDate, // Store class start date for countdown
  //         }))[0]; // Get the first element from the sliced array

  //       setClassData(upcomingClass || null);
  //     } catch (err) {
  //       if (err instanceof Error) {
  //         setError(err.message);
  //       } else {
  //         setError('An unexpected error occurred');
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchNextEvaluationClass();
  // }, []);

  // useEffect(() => {
  //   if (classData?.classStartDate) {
  //     const interval = setInterval(() => {
  //       const now = new Date();
  //       const classStartDate = new Date(classData.classStartDate);
  //       const remainingTime = classStartDate.getTime() - now.getTime();

  //       if (remainingTime <= 0) {
  //         clearInterval(interval);
  //         setTime({ hours: 0, minutes: 0, seconds: 0 }); // Class has started
  //       } else {
  //         const hours = Math.floor(remainingTime / 1000 / 60 / 60);
  //         const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
  //         const seconds = Math.floor((remainingTime / 1000) % 60);
  //         setTime({ hours, minutes, seconds });
  //       }
  //     }, 1000);

  //     return () => clearInterval(interval); // Cleanup on component unmount
  //   }
  // }, [classData]);

  const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
  };

  // const progress = ((time.hours * 3600 + time.minutes * 60 + time.seconds) / (5 * 60 * 60)) * 100;

  // if (loading) {
  //   return <div className="text-center text-gray-600">Loading...</div>;
  // }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  const [timeLeft, setTimeLeft] = useState({
    minutes: 4,
    seconds: 23,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime.minutes === 0 && prevTime.seconds === 0) {
          clearInterval(timer);
          return prevTime;
        }
        if (prevTime.seconds === 0) {
          return { minutes: prevTime.minutes - 1, seconds: 59 };
        }
        return { ...prevTime, seconds: prevTime.seconds - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  // Calculate progress for the circular indicator (out of 100)
  const totalSeconds = 300; // 5 minutes countdown
  const remainingSeconds = timeLeft.minutes * 60 + timeLeft.seconds;
  const progress = ((remainingSeconds / totalSeconds) * 100).toFixed(2);

  return (
    <div className="bg-gradient-to-r from-[#30507C] to-[#5792E2] rounded-[25px] shadow flex items-center justify-between text-white">
        <h3 className="text-[16px] font-medium pt-3 p-4 underline">Your Next Evaluation Class</h3>

      <div className="items-center p-1 px-8">
        <h3 className="text-[18px] font-medium pt-3 ml-4">Monday - 06.05.2024</h3>
        <div className="flex items-center space-x-6 py-2">
          <div className="flex items-center space-x-2">
            <FaUserAlt className="w-[10px]" />
            <p className="text-[13px]">{classData?.studentName} Sagar</p>
          </div>
          <div className="flex items-center space-x-2">
            <AiOutlineClockCircle className="w-[10px]" />
            <p className="text-[13px]">{classData?.classStartTime}9:00 AM - 10:30 AM</p>
          </div>
        </div>
        {classData?.classStartDate && (
          <p className="text-[13px] mt-2 text-gray-300 hidden" >
            Class Date: {formatDate(classData.classStartDate)}
          </p>
        )}
      </div>
      <div className="flex items-center space-x-2 p-6 rounded-lg">
      <div>
        <p className="text-white text-lg font-bold">Starts in</p>
        <p className="text-white text-sm">Session - 12</p>
      </div>
      <div className="relative flex items-center justify-center p-2">
        <svg className="absolute w-20 h-20" viewBox="0 0 36 36">
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
            stroke="#FF0000"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
        <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#234878] text-center">
          <div className="absolute flex items-center justify-center w-12 h-12 rounded-full bg-white">
            <div className="text-[#234878]">
              <p className="text-[12px] font-extrabold text-[#223857]">
                {formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
              </p>
              <p className="text-[6px] font-semibold">Mins</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default NextClass;
