// import { FaUserAlt } from 'react-icons/fa';
// import { AiOutlineClockCircle } from 'react-icons/ai';
// import { useEffect, useState } from 'react';
// import { BsThreeDotsVertical } from "react-icons/bs";


// const MyClass = () => {
//   const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
//   const [classData, setClassData] = useState<{
//     studentName: string;
//     classStartTime: string;
//     classStartDate: string;
//   } | null>(null);
// //   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

// //   useEffect(() => {
// //     const fetchMyClass = async () => {
// //       try {
// //         const auth=localStorage.getItem('authToken');
// //         const response = await fetch('http://localhost:5001/evaluationlist', {
// //           method: 'GET',
// //           headers: {
// //             'Content-Type': 'application/json',
// //             'Authorization': `Bearer ${auth}`, 
// //           },
// //         });

// //         if (!response.ok) {
// //           throw new Error(`Failed to fetch data: ${response.statusText}`);
// //         }

// //         const data = await response.json();

// //         if (!data.evaluation || !Array.isArray(data.evaluation)) {
// //           throw new Error('Invalid data format from API');
// //         }

// //         const upcomingClass = data.evaluation
// //           .filter((item: any) => {
// //             const classStartDate = new Date(item.classStartDate);
// //             const now = new Date();
// //             return classStartDate > now; // Filter for future classes
// //           })
// //           .sort((a: any, b: any) => {
// //             return (
// //               new Date(a.classStartDate).getTime() -
// //               new Date(b.classStartDate).getTime()
// //             );
// //           })
// //           .slice(0, 1) // Take only the first upcoming class
// //           .map((item: any) => ({
// //             studentName: `${item.student.studentFirstName} ${item.student.studentLastName}`,
// //             classStartTime: item.classStartTime,
// //             classStartDate: item.classStartDate, // Store class start date for countdown
// //           }))[0]; // Get the first element from the sliced array

// //         setClassData(upcomingClass || null);
// //       } catch (err) {
// //         if (err instanceof Error) {
// //           setError(err.message);
// //         } else {
// //           setError('An unexpected error occurred');
// //         }
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchMyClass();
// //   }, []);

//   useEffect(() => {
//     if (classData?.classStartDate) {
//       const interval = setInterval(() => {
//         const now = new Date();
//         const classStartDate = new Date(classData.classStartDate);
//         const remainingTime = classStartDate.getTime() - now.getTime();

//         if (remainingTime <= 0) {
//           clearInterval(interval);
//           setTime({ hours: 0, minutes: 0, seconds: 0 }); // Class has started
//         } else {
//           const hours = Math.floor(remainingTime / 1000 / 60 / 60);
//           const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
//           const seconds = Math.floor((remainingTime / 1000) % 60);
//           setTime({ hours, minutes, seconds });
//         }
//       }, 1000);

//       return () => clearInterval(interval); // Cleanup on component unmount
//     }
//   }, [classData]);

//   const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const day = date.getDate();
//     const month = date.getMonth() + 1; // Months are zero-indexed
//     const year = date.getFullYear();
//     return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
//   };

//   const progress = ((time.hours * 3600 + time.minutes * 60 + time.seconds) / (5 * 60 * 60)) * 100;

// //   if (loading) {
// //     return <div className="text-center text-gray-600">Loading...</div>;
// //   }

//   if (error) {
//     return <div className="text-center text-red-500">Error: {error}</div>;
//   }

//   return (
//     <div className="bg-gradient-to-r from-[#30507C] to-[#5792E2] rounded-[25px] shadow flex items-center justify-between text-white">
//       <div className="items-center p-1 px-8">
//         <h3 className="text-[15px] font-medium pt-3">Your Next Evaluation Class</h3>
//         <div className="flex items-center space-x-8 py-2">
//           <div className="flex items-center space-x-2">
//             <FaUserAlt className="w-[10px]" />
//             <p className="text-[13px]">{classData?.studentName}</p>
//           </div>
//           <div className="flex items-center space-x-2">
//             <AiOutlineClockCircle className="w-[10px]" />
//             <p className="text-[13px]">{classData?.classStartTime}</p>
//           </div>
//         </div>
//         {classData?.classStartDate && (
//           <p className="text-[13px] mt-2 text-gray-300 hidden" >
//             Class Date: {formatDate(classData.classStartDate)}
//           </p>
//         )}
//       </div>
//       <div className="flex items-center space-x-2 px-14">
//         <p className="text-[15px] font-bold">Starts in</p>
//         <div className="relative flex items-center justify-center p-10">
//           <svg className="absolute w-14 h-20" viewBox="0 0 36 36">
//             <path
//               className="circle-bg"
//               d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//               fill="none"
//               stroke="#fff"
//               strokeWidth="2"
//             />
//             <path
//               className="circle"
//               strokeDasharray={`${progress}, 100`}
//               d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//               fill="none"
//               stroke="#295CA0"
//               strokeWidth="3"
//             />
//           </svg>
//           <div className="relative flex items-center justify-center w-2 rounded-full bg-[#234878] text-center">
//             <div className="absolute flex items-center justify-center w-10 h-10 rounded-full bg-white">
//               <div className="text-[#234878]">
//                 <p className="text-[4px] font-bold">SESSION 13</p>
//                 <p className="text-[8px] font-extrabold text-[#223857]">
//                   {formatTime(time.hours)}:{formatTime(time.minutes)}:{formatTime(time.seconds)}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <BsThreeDotsVertical />
//       </div>
//     </div>
//   );
// };

// export default MyClass;




"use client"; // Mark this as a client component

import { FaUserAlt } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Ensure this is used correctly for routing

const MyClass = () => {
  const [time, setTime] = useState({ hours: 0, minutes: 1, seconds: 0 }); // Example: 4-minute countdown
  const [isCountdownFinished, setIsCountdownFinished] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const router = useRouter(); // Initialize the router

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

  return (
    <div className="bg-[#1C3557] rounded-[25px] shadow flex items-center justify-between text-white">
      <div className="items-center p-1 px-8">
        <h3 className="text-[15px] font-medium pt-3">Your Next Evaluation Class</h3>
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
            className="bg-[#112644] text-white px-4 py-2 rounded-lg"
            onClick={() => router.push("/student/ui/liveclass")} // Navigate to liveclass
          >
            Start
          </button>
        )}

        {isPopupVisible && !isCountdownFinished && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow">
              <p className="text-gray-800 mb-4">Please wait until your session starts...</p>
              <button
                className="bg-[#1C3557] text-white px-4 py-2 rounded text-center ml-10"
                onClick={() => setIsPopupVisible(false)}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyClass;




