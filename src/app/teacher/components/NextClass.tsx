'use client'
import { AiOutlineClockCircle } from 'react-icons/ai';
import { useState } from 'react';
import { FaUser } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";


const NextClass = () => {
  const [time] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [classData] = useState<{
    studentName: string;
    classStartTime: string;
    classStartDate: string;
  } | null>(null);
  
  const [error] = useState<string | null>(null);
  const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
  };

  const progress = ((time.hours * 3600 + time.minutes * 60 + time.seconds) / (5 * 60 * 60)) * 100;
  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div>
  <h2 className="text-[30px] font-bold text-gray-800 p-[20px] px-4">My Class</h2>
  <div className="bg-[#375074] rounded-[16px] shadow p-4 flex items-center justify-between ml-24 text-white w-[1000px]">
      <div className="items-center p-2 px-8">
        <div className='flex'>
            <h3 className="text-[15px]">Tajweed Masterclass &nbsp; </h3> |&nbsp;
            <FaUser className='mt-1 w-[10px] h-4'/>&nbsp; <p className='text-[13px] mt-1'>Prof.Smith</p>
        </div>
        <div className="flex items-center space-x-8 py-2">
          <div className="flex items-center space-x-2">
            <MdDateRange className="w-[15px]" />
            <p className="text-[13px]">{classData?.studentName}Monday - 06.05.2024</p>
          </div>
          <div className="flex items-center space-x-2">
            <AiOutlineClockCircle className="w-[15px]" />
            <p className="text-[13px]">{classData?.classStartTime}9:00 AM - 10:30 AM</p>
          </div>
        </div>
        {classData?.classStartDate && (
          <p className="text-[13px] mt-2 text-gray-300 hidden" >
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
    </div>
  );
};

export default NextClass;
