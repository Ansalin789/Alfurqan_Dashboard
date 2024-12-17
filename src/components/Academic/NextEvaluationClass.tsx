import { FaUserAlt } from 'react-icons/fa';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { useEffect, useState } from 'react';

const NextEvaluationClass = () => {
  const [time, setTime] = useState({ minutes: 4, seconds: 23 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => {
        const { minutes, seconds } = prevTime;
        if (seconds > 0) {
          return { minutes, seconds: seconds - 1 };
        } else if (minutes > 0) {
          return { minutes: minutes - 1, seconds: 59 };
        } else {
          clearInterval(interval);
          return { minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

  const progress = ((time.minutes * 60 + time.seconds) / (5 * 60)) * 100;

  return (
    <div className="bg-gradient-to-r from-[#30507C] to-[#5792E2] rounded-[25px] shadow flex items-center justify-between text-white">
      <div className="items-center p-2 px-8">
        <h3 className="text-[15px] font-medium pt-2">Your Next Evaluation Class</h3>
        <div className="flex items-center space-x-8 py-3">
          <div className="flex items-center space-x-2">
            <FaUserAlt className="w-[10px]"/>
            <p className="text-[13px]">Jijo</p>
          </div>
          <div className="flex items-center space-x-2">
            <AiOutlineClockCircle className="w-[10px]" />
            <p className="text-[13px]">9:00 AM</p>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 px-14">
        <p className="text-[15px] font-bold">Starts in</p>
        <div className="relative flex items-center justify-center p-10">
          <svg className="absolute w-14 h-20" viewBox="0 0 36 36">
            <path
              className="circle-bg"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
            />
            <path
              className="circle"
              strokeDasharray={`${progress}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#295CA0"
              strokeWidth="3"
            />
          </svg>
          <div className="relative flex items-center justify-center w-2 rounded-full bg-[#234878] text-center">
            <div className="absolute flex items-center justify-center w-10 h-10 rounded-full bg-white">
              <div className="text-[#234878]">
                <p className="text-[4px] font-bold">SESSION 13</p>
                <p className="text-[11px] font-extrabold text-[#223857]">
                  {formatTime(time.minutes)}:{formatTime(time.seconds)}
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
