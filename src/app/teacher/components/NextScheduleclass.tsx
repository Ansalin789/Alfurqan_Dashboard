import { FaUserAlt } from 'react-icons/fa';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { useEffect, useState } from 'react';

const NextClass = () => {
  const [timeLeft, setTimeLeft] = useState({
    minutes: 4,
    seconds: 23,
  });

  // Hardcoded class data
  const classData = {
    studentName: 'Sagar',
    classStartTime: '9:00 AM - 10:30 AM',
    classStartDate: '2024-05-06T09:00:00', // ISO format for consistent date parsing
  };

  // Countdown timer logic
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

  const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
  };

  // Calculate progress for the circular indicator (out of 100)
  const totalSeconds = 300; // 5 minutes countdown
  const remainingSeconds = timeLeft.minutes * 60 + timeLeft.seconds;
  const progress = ((remainingSeconds / totalSeconds) * 100).toFixed(2);

  return (
    <div className="bg-gradient-to-r from-[#30507C] to-[#5792E2] rounded-[25px] shadow flex items-center justify-between text-white">
      <h3 className="text-[16px] font-medium pt-3 p-4 underline">Your Next Evaluation Class</h3>

      <div className="items-center p-1 px-8">
        <h3 className="text-[18px] font-medium pt-3 ml-4">
          Monday - {formatDate(classData.classStartDate)}
        </h3>
        <div className="flex items-center space-x-6 py-2">
          <div className="flex items-center space-x-2">
            <FaUserAlt className="w-[10px]" />
            <p className="text-[13px]">{classData.studentName}</p>
          </div>
          <div className="flex items-center space-x-2">
            <AiOutlineClockCircle className="w-[10px]" />
            <p className="text-[13px]">{classData.classStartTime}</p>
          </div>
        </div>
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
