'use client';
import React, { useState, useEffect, useMemo } from 'react';
import {LogOut} from 'lucide-react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import BaseLayout2 from '@/components/BaseLayout2';
import axios from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SupervisorHeader from '@/app/supervisor/components/supervisorHeader';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { FaUser } from 'react-icons/fa';
import { MdDateRange } from 'react-icons/md';

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
interface Course {
  courseId: string;
  courseName: string;
}
interface ClassData {
  _id: string;
  student: Student;
  teacher: Teacher;
  classDay: string[]; 
  package: string;
  preferedTeacher: string;
  totalHourse: number;
  startDate: string;
  endDate: string;
  course: Course;
  startTime: string[];  
  endTime: string[];    
  scheduleStatus: string;
  classLink: string;
  status: string;
  createdBy: string;
  createdDate: string;
  lastUpdatedDate: string;
  __v: number;
}


function LiveClass() {
  const searchParams = useSearchParams();
  const [showFeedback, setShowFeedback] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [ratings, setRatings] = useState([0, 0, 0]);
  const [feedback, setFeedback] = useState('');
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [roomName, setRoomName] = useState<string>(''); 
useEffect(() => {
  const fetchClassData = async () => {
      try {
          const studentId = localStorage.getItem('StudentPortalId');
const token =
    typeof window !== "undefined" ? localStorage.getItem("StudentAuthToken") : null;
    const id = searchParams.get("id");
    console.log(id);
          if (!studentId || !token) {
              console.log('Missing studentId or authToken');
              return;
          }

          const response = await axios.get(`https://api.blackstoneinfomaticstech.com/classShedule/${id}`, {
             headers: { 
              "Content-Type": "application/json",
               'Authorization': `Bearer ${token}`,
           },
          });

          console.log('Raw API Response:', response.data); 

          const nextClass = response.data;
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
          courseId: classData?.course.courseId,
          courseName: classData?.course.courseName,
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
  const userInfo = useMemo(() => ({
  displayName: `${classData?.student?.studentFirstName} | ID : ${classData?.student?.studentId}`,
  email: `${classData?.student?.studentEmail}`
}), [classData?.student?.studentFirstName, classData?.student?.studentId, classData?.student?.studentEmail]);
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
  <SupervisorHeader
    currentSection="Re-Schedule Class"
    showBackButton={true}
    showBackPath="schedule"
  />

  <div className="relative flex flex-col min-h-screen px-2 sm:px-4 md:px-6">

    {/* ✅ Centered Popup */}
    <div className={`
      fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300
      ${showPopup ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
    `}>
      <div className="bg-[#1C3557] text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 w-[90%] max-w-sm">
        <img src='/assets/images/Check.png' alt='Success' className='w-10' />
        <span className="text-sm font-semibold">Submitted Successfully</span>
      </div>
    </div>

    {/* ✅ Overlay */}
    <div className={`
      fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300
      ${showPopup ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    `} />

    {/* ✅ Page Layout */}
    <div className="flex flex-col lg:flex-row gap-4 w-full max-w-screen-xl mx-auto py-1 flex-grow">
      <div className="w-full">
        {/* Header */}
        <div className="relative mb-4 flex justify-between items-center">
          {showFeedback && (
            <Link href="/supervisor/ui/viewschedule">
              <LogOut className="w-6 h-6 text-red-500 hover:text-red-600 transition" />
            </Link>
          )}
        </div>

        {/* Content Area */}
        {showFeedback ? (
          <div className="flex flex-col xl:flex-row gap-6 items-start justify-center">
            {/* ✅ Feedback Card */}
            <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl shadow-lg w-full max-w-md">
              <img 
                src="/assets/images/tajweedmasterclass.png"
                alt="Masterclass"
                className="w-full h-40 object-cover rounded-t-2xl"
              />
              <div className="p-4 text-center space-y-1">
                <h3 className="text-lg font-semibold text-[#1C3557] dark:text-white">Masterclass</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {classData?.classDay} - {new Date(classData?.startDate ?? '').toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {classData?.startTime[0]} to {classData?.endTime[0]}
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {classData?.teacher?.teacherName}
                </p>
                <span className="text-xs text-gray-400 dark:text-gray-400">Session - 12</span>
              </div>
            </div>

            {/* ✅ Rating Card */}
            <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl shadow-lg w-full max-w-md p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#19216C">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                  <h2 className="text-sm text-gray-700 dark:text-white font-medium">Rate this Class</h2>
                </div>

                {categories.map((category, index) => (
                  <div key={category} className="mb-3">
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">Rate {category}</p>
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
                  <h3 className="text-xs text-gray-600 dark:text-gray-300 mb-1">Additional Feedback</h3>
                  <textarea
                    className="w-full p-3 rounded-md text-xs bg-red-50 dark:bg-[#2C2C2C] dark:text-white placeholder-gray-500"
                    rows={4}
                    placeholder="Type your feedback here..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>
              </div>

              <button 
                className="w-full mt-4 py-2 bg-[#1C3557] hover:bg-[#1C3557]/90 text-white rounded-lg text-sm font-medium transition"
                onClick={handleSubmitfeed}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Student Info */}
            <div className='space-y-3 ml-3 '>
              <h2 className="text-lg font-semibold text-[#1C3557] dark:text-white">
                {classData?.course.courseName} Class
              </h2>
 <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm sm:text-sm md:text-base">
                <span className="flex items-center gap-1">
                            <FaUser className="dark:text-[#FFFFFFCC]/70 text-base sm:text-sm text-[#010E30]" />
                             <div className="dark:text-[#FFFFFFCC]/70 text-base sm:text-sm text-[#010E30]">
                            {classData?.teacher?.teacherName ?? "Unknown"}
                            </div>
                          </span>
                
                          <span className="flex items-center gap-1 border-y-0 border-l-2 border-r-2 px-4 border-[#010E30] dark:border-[#868585]">
                            <MdDateRange className="dark:text-[#FFFFFFCC]/70 text-base sm:text-sm text-[#010E30]" />
                             <div className="dark:text-[#FFFFFFCC]/70 text-base sm:text-sm text-[#010E30]">
                            {classData?.startDate &&
                  (() => {
                    const d = new Date(classData.startDate);
                    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
                  })()}
                  </div>
                          </span>
                
                          <span className="flex items-center gap-1">
                            <AiOutlineClockCircle className="dark:text-[#FFFFFFCC]/70 text-base sm:text-sm text-[#010E30]" />
                            <div className="dark:text-[#FFFFFFCC]/70 text-base sm:text-sm text-[#010E30]">
                            {classData?.startTime?.[0] ?? "09:00"}
                            </div>
                          </span>
              </div>
            </div>

            {/* ✅ Responsive Video Area */}
            <div className="w-full h-[60vh] md:h-[70vh] rounded-md overflow-hidden shadow-inner border border-gray-300 dark:border-gray-600">
              {roomName && (
                <JitsiMeeting
                  roomName={roomName}
                  domain="meet.blackstoneinfomaticstech.com"
                  userInfo={userInfo}
                  configOverwrite={{
                    startWithAudioMuted: false,
                    startWithVideoMuted: false,
                    toolbarButtons: [
                      'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen', 'fodeviceselection',
                      'hangup', 'profile', 'chat', 'settings', 'raisehand', 'videoquality',
                      'filmstrip', 'shortcuts', 'tileview', 'recording'
                    ]
                  }}
                  onApiReady={(api) => {
                    api.addListener("videoConferenceLeft", handleEndCall);
                  }}
                  getIFrameRef={(ref) => {
                    ref.style.border = '0px';
                    ref.style.height = '100%';
                    ref.style.width = '100%';
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
