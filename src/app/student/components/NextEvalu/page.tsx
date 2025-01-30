'use client'
import { FaUserAlt } from 'react-icons/fa';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { useEffect, useState } from 'react';

const NextEvalu = () => {
  const [remainingTime, setRemainingTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Hardcoded class data
  const classData = {
    studentName: 'rahul rm',
    classStartTime: '10:00 AM',
    classStartDate: '2025-02-01T10:00:00',
  };

  useEffect(() => {
    if (classData?.classStartDate) {
      const interval = setInterval(() => {
        const now = new Date();
        const classStartDate = new Date(classData.classStartDate);
        const remainingTimeMs = classStartDate.getTime() - now.getTime();

        if (remainingTimeMs <= 0) {
          clearInterval(interval);
          setRemainingTime({ hours: 0, minutes: 0, seconds: 0 }); // Class has started
        } else {
          const hours = Math.floor(remainingTimeMs / 1000 / 60 / 60);
          const minutes = Math.floor((remainingTimeMs / 1000 / 60) % 60);
          const seconds = Math.floor((remainingTimeMs / 1000) % 60);
          setRemainingTime({ hours, minutes, seconds });
        }
      }, 1000);

      return () => clearInterval(interval); // Cleanup on component unmount
    }
  }, [classData]);

  const formatTime = (time: number) => (time < 10 ? '0' + time : time.toString());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
  };

  return (
    <div>
      <h2 className="text-[16px] font-bold text-gray-800 p-[0px] px-4 -mt-[9px]">Your Next Classes</h2>
      <div className="bg-[#375074] rounded-[16px] shadow flex items-center justify-between text-white">
        <div className="items-center p-1 px-8">
          <h3 className="text-[15px] font-medium pt-3">Tajweed Masterclass Session - 12</h3>
          <div className="flex items-center space-x-8 py-2">
            <div className="flex items-center space-x-2">
              <FaUserAlt className="w-[10px]" />
              <p className="text-[13px]">{classData.studentName}</p>
            </div>
            <div className="flex items-center space-x-2">
              <AiOutlineClockCircle className="w-[10px]" />
              <p className="text-[13px]">{classData.classStartTime}</p>
            </div>
          </div>
          <p className="text-[13px] mt-2 text-gray-300 hidden">Class Date: {formatDate(classData.classStartDate)}</p>
        </div>
        <div className="flex items-center space-x-2 px-14">
          <p className="text-[15px] font-bold">Starts in</p>
          <div className="relative flex items-center justify-center p-10">
            <div className="relative flex items-center justify-center w-2 rounded-full bg-[#234878] text-center">
              <div className="absolute flex items-center justify-center w-10 h-10 rounded-full bg-white">
                <div className="text-[#234878]">
                  <p className="text-[4px] font-bold">SESSION 13</p>
                  <p className="text-[8px] font-extrabold text-[#223857]">
                    {formatTime(remainingTime.hours)}:{formatTime(remainingTime.minutes)}:{formatTime(remainingTime.seconds)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextEvalu;
