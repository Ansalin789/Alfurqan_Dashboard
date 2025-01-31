'use client';


import { FaUserAlt } from 'react-icons/fa';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BsThreeDotsVertical } from 'react-icons/bs';

const NextEvalu = () => {
  const [time, setTime] = useState({ hours: 0, minutes: 1, seconds: 0 }); // Example: 1-minute countdown
  const [isCountdownFinished, setIsCountdownFinished] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const router = useRouter(); 

  useEffect(() => {
    if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
      setIsCountdownFinished(true); // Countdown finished
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

  
  const [classData] = useState<{
    studentName: string;
    classStartTime: string;
    classStartDate: string;
  } | null>(null);

  // useEffect(() => {
  //   // Hardcoded sample class data
  //   const upcomingClass = {
  //     studentName: 'John Doe',
  //     classStartTime: '10:30 AM',
  //     classStartDate: '2025-01-23T10:30:00Z', // Sample future date
  //   };

  //   setClassData(upcomingClass);
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


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
  };



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
      <h2 className="text-[16px] font-bold text-gray-800 pb-[6px] px-4 -mt-[12px]">Your Next Classes</h2>
      <div className="bg-[#375074] rounded-[16px] shadow flex items-center justify-between text-white">
        <div className="items-center p-1 px-8">
          <h3 className="text-[15px] font-medium pt-3">Tajweed Masterclass Session - 12</h3>
          <div className="flex items-center space-x-8 py-2">
            <div className="flex items-center space-x-2">
              <FaUserAlt className="w-[10px]" />
              <p className="text-[13px]">Student Name</p>
            </div>
            <div className="flex items-center space-x-2">
              <AiOutlineClockCircle className="w-[10px]" />
              <p className="text-[13px]">Class Start Time</p>
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
                strokeDasharray={`${100 - ((time.minutes * 60 + time.seconds) / (4 * 60)) * 100}, 100`}
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
          
          {!isCountdownFinished ? (
          <BsThreeDotsVertical
            className="cursor-pointer"
            onClick={() => setIsPopupVisible(true)}
          />
        ) : (
          <button
            className="animated-gradient text-[15px] font-medium text-white px-4 py-2 rounded-full shadow-lg transition-transform transform active:scale-95 hover:scale-105"
            onClick={() => router.push("/student/ui/liveclass")} // Navigate to liveclass
          >
            Join Now
          </button>
        )}

        {isPopupVisible && !isCountdownFinished && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-10">
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

export default NextEvalu;
