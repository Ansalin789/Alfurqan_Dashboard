import { FaUserAlt } from 'react-icons/fa';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BsThreeDotsVertical } from 'react-icons/bs';

const NextScheduledClass = () => {
  const [time, setTime] = useState({ hours: 0, minutes: 1, seconds: 0 }); // Example: 4-minute countdown
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
      <h3 className="text-[15px] font-medium pt-2 p-3 underline">Your Next Evaluation Class</h3>

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

      <div className="items-center p-1 px-8">
        <h3 className="text-[16px] font-medium pt-2 ml-4">
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

      <div className="flex items-center space-x-2 p-3 rounded-lg">
        <div>
          <p className="text-white text-[13px] font-semibold">Starts in</p>
          <p className="text-white text-[10px]">Session - 12</p>
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
              strokeDasharray={`${100 - ((time.minutes * 60 + time.seconds) / (4 * 60)) * 100}, 100`}
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
  );
};

export default NextScheduledClass;
