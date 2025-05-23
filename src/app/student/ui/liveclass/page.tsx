'use client';
import React, { useState, useEffect } from 'react';
import {LogOut} from 'lucide-react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import BaseLayout2 from '@/components/BaseLayout2';
import axios from 'axios';
import Link from 'next/link';
interface Student {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
}

interface Teacher {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
}

interface ClassData {
  _id: string;
  student: Student;
  teacher: Teacher;
  classDay: string[]; // Keep this as an array of strings
  package: string;
  preferedTeacher: string;
  totalHourse: number;
  startDate: string;
  endDate: string;
  startTime: string[];  // Array of strings for startTime
  endTime: string[];    // Array of strings for endTime
  scheduleStatus: string;
  classLink: string;
  status: string;
  createdBy: string;
  createdDate: string;
  lastUpdatedDate: string;
  __v: number;
}
interface ApiResponse {
  totalCount: number;
  classSchedule: ClassData[];
}

function LiveClass() {
  
  const [showFeedback, setShowFeedback] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [ratings, setRatings] = useState([0, 0, 0]);
  const [feedback, setFeedback] = useState('');
  
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [roomName, setRoomName] = useState<string>('');  
  
  const filterUpcomingClass = (response: { totalCount: number; classSchedule: any[] }): ClassData | null => {
    const classes = response.classSchedule;
  
    if (!Array.isArray(classes)) {
      console.log("Expected an array, but received:", classes);
      return null;
    }
  
    const now = new Date();
    let upcomingClass: ClassData | null = null;
  
    classes.forEach((cls) => {
      console.log(`Processing Class ID: ${cls._id}, startDate: ${cls.startDate}, startTime:`, cls.startTime);
  
      // Validate startDate
      if (!cls.startDate || typeof cls.startDate !== "string") {
        console.log(`Skipping class ${cls._id} due to missing or invalid startDate`);
        return;
      }
  
      const classDate = new Date(cls.startDate);
      if (isNaN(classDate.getTime())) {
        console.log(`Invalid startDate for class ${cls._id}:`, cls.startDate);
        return;
      }
  
      // Validate startTime and endTime
      if (!Array.isArray(cls.startTime) || !Array.isArray(cls.endTime)) {
        console.log(`Skipping class ${cls._id} due to incorrect startTime or endTime format`, cls.startTime, cls.endTime);
        return;
      }
  
      // Assuming startTime and endTime are arrays of strings in "HH:mm" format
      const startTime = cls.startTime[0];
      const endTime = cls.endTime[0];
  
      const startTimeParts = startTime.split(":").map(Number);
      const endTimeParts = endTime.split(":").map(Number);
  
      if (startTimeParts.length !== 2 || endTimeParts.length !== 2) {
        console.log(`Skipping class ${cls._id} due to invalid time format: startTime=${startTime}, endTime=${endTime}`);
        return;
      }
  
      const [startHours, startMinutes] = startTimeParts;
      const [endHours, endMinutes] = endTimeParts;
  
      if (
        isNaN(startHours) || isNaN(startMinutes) || 
        isNaN(endHours) || isNaN(endMinutes) ||
        startHours < 0 || startHours > 23 || 
        endHours < 0 || endHours > 23 ||
        startMinutes < 0 || startMinutes > 59 || 
        endMinutes < 0 || endMinutes > 59
      ) {
        console.log(`Skipping class ${cls._id} due to out-of-range time values: startTime=${startTime}, endTime=${endTime}`);
        return;
      }
  
      // Set start and end times correctly in 24-hour format
      classDate.setHours(startHours, startMinutes, 0, 0);
      const classEndDate = new Date(classDate);
      classEndDate.setHours(endHours, endMinutes, 0, 0);
  
      console.log(
        `Checking class: ${cls._id}, Start: ${classDate.toISOString()}, End: ${classEndDate.toISOString()}, Now: ${now.toISOString()}`
      );
  
      // Check if the class is currently ongoing
      if (now >= classDate && now <= classEndDate) {
        console.log(`Class ${cls._id} is currently LIVE`);
        upcomingClass = cls;
      } 
      // If no live class, find the next upcoming class
      else if (classDate > now && (!upcomingClass || classDate < new Date(upcomingClass.startDate))) {
        console.log(`Class ${cls._id} is in the future`);
        upcomingClass = cls;
      }
    });
    console.log("Selected Class:", upcomingClass);
    return upcomingClass;
  };


// Fetch class data and set in state
useEffect(() => {
  const fetchClassData = async () => {
      try {
          const studentId = localStorage.getItem('StudentPortalId');
const token =
    typeof window !== "undefined" ? localStorage.getItem("StudentAuthToken") : null;

  if (!token) {
    console.error("❌ StudentAuthToken not found");
    return;
  }          if(!studentId || !token) {
          console.log('Missing studentId or authToken');
          return;
        }
          if (!studentId || !token) {
              console.log('Missing studentId or authToken');
              return;
          }

          const response = await axios.get<ApiResponse>(`https://api.blackstoneinfomaticstech.com/classShedule/students`, {
              params: { studentId },
             headers: { "Content-Type": "application/json",
               'Authorization': `Bearer ${token}`,
           },
          });

          console.log('Raw API Response:', response.data.classSchedule); // Check data format

          const nextClass = filterUpcomingClass(response.data);
          setRoomName(nextClass?.classLink ?? '');
          console.log('Filtered Next Class:', nextClass); // Debug if nextClass is valid

          if (nextClass) {
              console.log("Setting classData to:", nextClass);
              setClassData(nextClass);
          } else {
              console.log("No upcoming class found.");
              setClassData(null);
          }

      } catch (err) {
          console.log('Error loading class details:', err);
      }
  };

  fetchClassData();
}, []);


    const handleSubmitfeed = async () => {
      // Create request body
      const feedbackData = {
        student: {
          studentId: classData?.student.studentId,
          studentFirstName: classData?.student.studentFirstName,
          studentLastName: classData?.student.studentLastName,
          studentEmail: classData?.student.studentEmail,
        },
        teacher: {
          teacherId: classData?.teacher.teacherId,
          teacherName: classData?.teacher.teacherName,
          teacherEmail: classData?.teacher.teacherEmail,
        },
        classDay: classData?.classDay[0],
        preferedTeacher: classData?.preferedTeacher,
        course: {
          courseId: "course123",
          courseName: "Math 101",
        },
        studentsRating: {
          classUnderstanding: ratings[0],
          engagement: ratings[1],
          homeworkCompletion: ratings[2],
        },
        startDate: classData?.startDate,
        endDate: classData?.endDate,
        startTime: classData?.startTime[0],
        endTime: classData?.endTime[0],
        feedbackmessage: feedback,
        createdDate: new Date().toISOString(),
        createdBy: "User",
        lastUpdatedDate: new Date().toISOString(),
        lastUpdatedBy: "User",
      };
  
      try {
       const token =
    typeof window !== "undefined" ? localStorage.getItem("StudentAuthToken") : null;

  if (!token) {
    console.error("❌ StudentAuthToken not found");
    return;
  }  
        const response = await axios.post("https://api.blackstoneinfomaticstech.com/feedback", feedbackData, {
          headers: {
            "Content-Type": "application/json",
                           'Authorization': `Bearer ${token}`,

          },
        });
  
        if (response.status === 201 || response.status === 200) {
          setShowPopup(true);
          setTimeout(() => setShowPopup(false), 3000);
        } else {
          console.log("Failed to submit feedback. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting feedback:", error);
        console.log("Error submitting feedback. Please try again.");
      }
    };
  
    const handleEndCall = () => {
   
      setShowFeedback(true);
    
  };
  const StarRating = ({ value, onChange }: { value: number; onChange: (rating: number) => void }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`cursor-pointer text-xl ${star <= value ? "text-yellow-400" : "text-gray-300"}`}
            onClick={() => onChange(star)}
          >
            ★
          </button>
        ))}
      </div>
    );
  };
  useEffect(() => {
    let timeoutId: number | undefined
    if (showPopup) {
      timeoutId = window.setTimeout(() => {
        setShowPopup(false)
      }, 3000)
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [showPopup]);
  
  const categories = ["Listening Ability", "Reading Ability", " Overall Performance"];

  return (
    <BaseLayout2>
      <div className="flex flex-col min-h-screen px-4 sm:px-6 md:px-8">
      
      {/* Centered Popup */}
      <div className={`
        fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50
        bg-[#1C3557] text-white px-6 py-3 rounded-xl shadow-lg
        flex items-center gap-3 transition-opacity duration-300
        ${showPopup ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}>
        <img src='/assets/images/Check.png' alt='find' className='w-10 mt-1'/>
        <span className="font-semibold text-sm sm:text-base">Submitted Successfully</span>
      </div>
  
      {/* Overlay */}
      <div className={`
        fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity z-20 duration-300
        ${showPopup ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `} />
  
      {/* Page Content */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 w-full max-w-screen-xl mx-auto py-6">
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="relative mb-6">
            {showFeedback && ( <Link href="/supervisor/ui/viewschedule" className="absolute top-0 right-0">
              <LogOut className="w-6 h-6 text-red-500 hover:text-red-600 transition" />
            </Link>)}
            <h1 className="text-xl sm:text-xl font-bold text-[#1C3557]">Live Class</h1>
          </div>
              {showFeedback ? (
   <div className="flex flex-col xl:flex-row gap-4 items-stretch justify-center px-4 py-6">
    
   {/* Feedback Card */}
   <div className="bg-white rounded-2xl shadow-md w-full flex-1 max-w-md xl:mx-2 flex flex-col">
     <img 
       src="/assets/images/tajweedmasterclass.png"
       alt="Tajweed" 
       className="w-full h-40 object-cover rounded-t-2xl"
     />
     <div className="p-5 text-center flex-1 flex flex-col justify-center">
       <h3 className="text-lg text-primary font-semibold mb-1">Masterclass</h3>
       <h4 className="text-sm text-gray-500 mb-1">
         {classData?.classDay} - {new Date(classData?.startDate ?? '2022-01-01').toLocaleDateString()}
       </h4>
       <p className="text-sm text-gray-600 mb-2">
         {classData?.startTime[0]} to {classData?.endTime[0]}
       </p>
       <p className="text-sm text-gray-800 font-medium mb-1">
         {classData?.teacher?.teacherName}
       </p>
       <span className="text-xs text-gray-400">Session - 12</span>
     </div>
   </div>
  
   {/* Rating Card */}
   <div className="bg-white rounded-2xl shadow-md w-full flex-1 max-w-md xl:mx-2 flex flex-col p-5">
     <div className="flex-1 flex flex-col justify-between">
       <div>
         <div className="flex items-center gap-2 mb-4">
           <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#19216C">
             <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
           </svg>
           <h2 className="text-sm text-gray-700 font-medium">Rate this Class</h2>
         </div>
  
         {categories.map((category, index) => (
           <div key={category} className="mb-3">
             <p className="text-xs text-gray-600 mb-1">Rate {category}</p>
             <StarRating
               value={ratings[index]}
               onChange={(rating) => {
                 const newRatings = [...ratings];
                 newRatings[index] = rating;
                 setRatings(newRatings);
               }}
             />
           </div>
         ))}
  
         <div className="mt-4">
           <h3 className="text-xs text-gray-600 mb-1">Additional Feedback</h3>
           <textarea
             className="w-full min-h-[100px] p-3 bg-red-50 rounded-lg text-xs
                        border-none focus:outline-none resize-none placeholder-gray-500"
             placeholder="Type your feedback here..."
             value={feedback}
             onChange={(e) => setFeedback(e.target.value)}
           />
         </div>
       </div>
  
       <button 
         className="w-full bg-[#1C3557] text-white py-2 px-4 rounded-lg text-xs font-medium mt-4
                    hover:bg-[#1C3557]/90 transition"
         onClick={handleSubmitfeed}
       >
         Submit Feedback
       </button>
     </div>
   </div>
  </div>
  
  
  ):(
          <div className="p-1 sm:p-2 relative">
  
          {/* Exit Button */}
          <button
            onClick={handleEndCall}
            className="absolute top-4 right-4 cursor-pointer"
            aria-label="Leave meeting"
          >
            <LogOut className="w-6 h-6 text-red-500 hover:text-red-600 transition" />
          </button>
          {/* Student Info */}
          <div className="mb-4">
            <h2 className="text-lg font-medium">{`${classData?.student.studentFirstName} ${classData?.student.studentLastName}`}</h2>
            <span className="text-sm text-gray-500">{classData?.startDate && (() => {
  const date = new Date(classData.startDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
})()}</span>
          </div>
    
          {/* Jitsi Video Box */}
          <div className="w-full h-[60vh] md:h-[70vh] rounded-md overflow-hidden shadow-inner border border-gray-300">
      {roomName && (
        <JitsiMeeting
          roomName={roomName}
          domain="meet.blackstoneinfomaticstech.com"
          userInfo={
             {
            displayName : `${classData?.student.studentFirstName} | ID : ${classData?.student.studentId}` ,
            email: `${classData?.student.studentEmail}` ,
            }
          }
          configOverwrite={{
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            toolbarButtons: [
              'microphone',
              'camera',
              'closedcaptions',
              'desktop',
              'fullscreen',
              'fodeviceselection',
              'hangup',
              'profile',
              'chat',
              'settings',
              'raisehand',
              'videoquality',
              'filmstrip',
              'shortcuts',
              'tileview',
              'recording'
            ]
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.border = '0px';
            iframeRef.style.height = '100%';
            iframeRef.style.width = '100%';
          }}
        />
      )}
    </div>
        </div>
                )} 
            </div>
          </div>
        </div>
    </BaseLayout2>
  );
}

export default LiveClass;
