'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  PhoneOff,
  Timer,
  ChevronDown
} from 'lucide-react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import BaseLayout from '@/components/BaseLayout';
import axios from 'axios';
interface Student {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  city:string;
  country:string;
  trailId:string;
  course:string;
  classStatus:string;
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
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [ratings, setRatings] = useState([0, 0, 0]);
    const [feedback, setFeedback] = useState('');
    const apiRef = useRef<any>(null);
    const [classData, setClassData] = useState<ClassData | null>(null);
  const[isFormData,setIsFormData]=useState(true);
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
  // Fetch class data
  
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const teacherId = localStorage.getItem('TeacherPortalId');
        const authToken = localStorage.getItem('TeacherAuthToken');
        // Ensure studentId and authToken are valid
        if (!teacherId || !authToken) {
          console.log('Missing studentId or authToken');
          return;
        }
  
        const response = await axios.get<ApiResponse>(`http://localhost:5001/classShedule/teacher`, {
          params: { teacherId },
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        console.log('Raw API Response:', response.data.classSchedule); // Check data format

          const nextClass = filterUpcomingClass(response.data);
          
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
    
  
  
  
  
  

  const handleJitsiControl = (action: string) => {
    if (!apiRef.current) return;

    switch (action) {
      case 'toggleAudio':
        apiRef.current.executeCommand('toggleAudio');
        setIsMuted(!isMuted);
        break;
      case 'toggleVideo':
        apiRef.current.executeCommand('toggleVideo');
        setIsVideoOn(!isVideoOn);
        break;
      case 'toggleShareScreen':
        apiRef.current.executeCommand('toggleShareScreen');
        setIsScreenSharing(!isScreenSharing);
        break;
    }
  };

  const handleEndCall = () => {
    if (apiRef.current) {
      apiRef.current.dispose();
      setShowFeedback(true);
    }
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
  const handleSubmit = async () => {
   

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
      const response = await axios.post("http://localhost:5001/feedback", feedbackData, {
        headers: {
          "Content-Type": "application/json",
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
  
  
  

  

  const handleStartSession = () => {
    setIsFormData(false);
  };
  const categories = ["Listening Ability", "Reading Ability", " Overall Performance"];
  const [timeRemaining, setTimeRemaining] = useState("");
  useEffect(() => {
    if (!classData) return;

    const updateRemainingTime = () => {
      const now = new Date();

      // Extract class date and time
      const classDate = new Date(classData.startDate);
      const [hours, minutes] = classData.startTime[0].split(":").map(Number);  // Assuming startTime is an array

      classDate.setHours(hours, minutes, 0, 0);  // Set time for the class

      const diff = classDate.getTime() - now.getTime();

      if (diff > 0) {
        const remainingDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        const remainingHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const remainingMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        setTimeRemaining(`${remainingDays}d ${remainingHours}h ${remainingMinutes}m`);
      } else {
        setTimeRemaining("Started");
      }
    };

    updateRemainingTime();  // Initial call

    const timer = setInterval(updateRemainingTime, 60000);  // Update every minute

    return () => clearInterval(timer);  // Cleanup on unmount
  }, [classData]);
  
  return (
    <BaseLayout>
      <div className="flex h-screen bg-[#E6E9ED]">
        {isFormData ? (
               <div className="min-h-screen bg-[#E6E9ED] p-4">
               <div className="max-w-[100%] mx-auto">
                 <h1 className="text-[35px] font-semibold text-gray-800 mb-3">Trial Class</h1>
                 
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                   {/* Form Section */}
                   <form className="lg:col-span-2 bg-[#1E3F6C] h-[100%] w-[80%] rounded-3xl opacity-[90%] text-white p-5 justify-center ml-28">
                     <h2 className="text-[14px] font-medium mb-4">Student Details</h2>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                         <label htmlFor='firtname' className="block text-[12px] mb-2">First name</label>
                         <input
                           type="text"
                           name="firstName"
                           value={classData?.student.studentFirstName}
                           
                           className="w-full px-4 text-[12px] py-2 rounded-lg bg-white text-[#030303] border border-white/20 focus:outline-none focus:border-blue-400"
                           required
                         />
                       </div>
                       
                       <div>
                         <label htmlFor='firname'  className="block text-[12px] mb-2">Last name</label>
                         <input
                           type="text"
                           name="lastName"
                           value={classData?.student.studentLastName}
                           
                           className="w-full px-4 py-2 text-[12px] rounded-lg bg-white text-[#030303] border border-white/20 focus:outline-none focus:border-blue-400"
                           required
                         />
                       </div>
         
                       <div>
                         <label  htmlFor='fname' className="block text-[12px] mb-2">City</label>
                         <div className="relative">
                           <select
                             name="city"
                             value={classData?.student.city}
                             className="w-full px-4 text-[12px] py-2 rounded-lg bg-white text-[#030303] border border-white/20 focus:outline-none focus:border-blue-400 appearance-none"
                             required
                           >
                             
                           </select>
                           <ChevronDown className="absolute text-[#030303] right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
                         </div>
                       </div>
         
                       <div>
                         <label htmlFor='firthgchgname'  className="block text-[12px] mb-2">Country</label>
                         <div className="relative">
                           <select
                             name="country"
                             value={classData?.student.country}
                             className="w-full px-4 py-2 text-[12px] rounded-lg bg-white text-[#030303] border border-white/20 focus:outline-none focus:border-blue-400 appearance-none"
                             required
                           >
                             
                           </select>
                           <ChevronDown className="absolute text-[#030303] right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
                         </div>
                       </div>
         
                       <div>
                         <label htmlFor='firfftname'  className="block text-[12px] mb-2">Trial ID</label>
                         <input
                           type="text"
                           name="trialId"
                           value={classData?.student.trailId}
                          
                           className="w-full px-4 py-2 text-[12px] rounded-lg bg-white text-[#030303] border border-white/20 focus:outline-none focus:border-blue-400"
                           required
                         />
                       </div>
         
                       <div>
                         <label htmlFor='firtghggname'  className="block text-[12px] mb-2">Course</label>
                         <div className="relative">
                           <select
                             name="course"
                             value={classData?.student.course}
                             className="w-full px-4 py-2 text-[12px] rounded-lg bg-white text-[#030303] border border-white/20 focus:outline-none focus:border-blue-400 appearance-none"
                             required
                           >
                           </select>
                           <ChevronDown className="absolute text-[#030303] right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
                         </div>
                       </div>
                     </div>
         
                     <div className="mt-6 w-1/2 ml-36">
                       <label htmlFor='fifffrtname'  className="block text-[12px] mb-2">Class Status</label>
                       <div className="relative">
                         <select
                           name="classStatus"
                           value={classData?.student.classStatus}
                         
                           className="w-full px-4 py-2 text-[12px] rounded-lg bg-white text-[#030303] border border-white/20 focus:outline-none focus:border-blue-400 appearance-none"
                           required
                         >
                           <option value="Joining">Joining</option>
                           <option value="In Progress">In Progress</option>
                           <option value="Completed">Completed</option>
                         </select>
                         <ChevronDown className="absolute text-[#030303] right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
                       </div>
                     </div>
         
                     <div className="mt-6">
                       <label htmlFor='fiiugigrtname'  className="block text-[12px] mb-2">Additional Comments (Optional)</label>
                       <textarea
                         name="comments"
                         placeholder="Write your comment here..."
                         className="w-full px-4 py-2 text-[12px] rounded-lg bg-white text-[#030303] border border-white/20 focus:outline-none focus:border-blue-400 h-24 resize-none"
                       />
                     </div>
         
                     <div className="mt-6 flex justify-end gap-4">
                       <button
                         type="button"
                         className="px-6 py-2 rounded-lg text-[12px] border border-white/20 hover:bg-white/10 transition-colors"
                       >
                         Clear
                       </button>
                       <button
                         type="submit"
                         className="px-6 py-2 rounded-lg text-[12px] bg-[#587EB4] border-[#2A7CEB] border-2 transition-colors"
                       >
                         Save
                       </button>
                     </div>
                   </form>
                   
                   {/* Student Info Card */}
                   <div className=" rounded-lg p-6 h-fit">
                    <div className='bg-[#fff] p-3 rounded-2xl'>
                    <div className="flex justify-center">
                       <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                         <img
                           src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100"
                           alt="Student avatar"
                           className="w-20 h-20 rounded-full object-cover"
                         />
                       </div>
                     </div>
                     <h2 className="text-xl font-semibold text-center mt-4">
                       {classData?.student.studentFirstName} {classData?.student.studentLastName}
                     </h2>
                     <div className="flex items-center justify-center gap-2 mt-2 text-gray-600">
                       <Timer size={16} />
                       <span>{classData?.classDay[0]} - {new Date(classData?.startDate ?? '2022-01-01').toLocaleDateString()}</span>
                     </div>
                     <div className="mt-6 text-center">
                       <p className="text-gray-600 mb-2">Trial Session<br />is Due in</p>
                       <div className="inline-block relative">
                         <div className="w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center">
                           <span className="font-bold text-[10px]">{timeRemaining}</span>
                         </div>
                         <span className="text-xs text-gray-500 mt-1 block">Mins</span>
                       </div>
                     </div>
                    </div>
                     
         
                     <button
                       onClick={handleStartSession}
                       className="w-full bg-red-500 text-white rounded-lg py-3 mt-6 hover:bg-red-600 transition-colors"
                     >
                       Start Trial Session Now
                     </button>
         
                     <div className="mt-4 bg-red-100 rounded-lg p-3 text-sm text-red-800">
                       Once start session is clicked, link to be sent to the student
                     </div>
                   </div>
                 </div>
               </div>
             </div>
        ):(
          <div className="flex h-screen bg-[#E6E9ED]">
            <div className={`
               fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50
              bg-[#1C3557] text-white px-8 py-4 rounded-xl shadow-lg
                flex items-center gap-3 transition-opacity duration-300
                 ${showPopup ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                `}>
        <img src='/assets/images/Check.png' alt='find' className='w-[50px] mt-2'/>
        <span className="font-semibold">Submitted Successfully</span>
             </div>

             {/* Backdrop overlay */}
         <div className={`
        fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity z-20 duration-300
        ${showPopup ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `} />
        {/* Main Content */}
        <div className="flex-1 overflow-auto  w-[1200px] mt-5 ml-5 h-[800px]">
          <div className="p-6 w-[100%]">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold text-[#1C3557]">My Class</h1>
            </div>
            {showFeedback ? (
              <div className="flex items-center justify-center gap-10 mb-6">
            <div className="bg-white rounded-3xl shadow-lg w-full max-w-sm">
        <div className="relative ">
          <img 
            src="/assets/images/tajweedmasterclass.png"
            alt="Tajweed" 
            className="w-full h-52 object-cover  rounded-t-3xl"
          />
        </div>
        <div className="p-8">
          <div className="text-center">
          <h3 className="text-2xl text-primary font-bold mb-3"> Masterclass</h3>
            <h2 className="text-base text-gray-600 font-medium mb-1">{classData?.classDay[0]} - {new Date(classData?.startDate ?? '2022-01-01').toLocaleDateString()}</h2>
            <div className="text-gray-600 mb-6 font-medium">
              <span>{classData?.startTime[0]} to {classData?.endTime[0]}</span>
            </div>
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-gray-900 font-bold">{classData?.student.studentFirstName}</span>
            </div>
            <div className="text-gray-500 text-sm font-medium">Session - 12</div>
          </div>
        </div>
         </div>

           {/* Rating Card */}
          <div className="bg-white rounded-3xl shadow-lg w-full max-w-sm p-8">
        <div className="flex items-center gap-2 mb-8"> 
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#19216C"/>
          </svg>
          <h2 className="text-lg text-gray-700 font-semibold">Rating for the Class</h2>
        </div>
        {categories.map((category,index) => (
        <div key={category} className="mb-4">
          <p className="text-gray-600 text-sm font-medium mb-2">Rate {category}</p>
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

        <div className="mt-8">
          <h3 className="text-gray-700 text-sm font-medium mb-3">Additional feedback</h3>
          <textarea
            className="w-full min-h-[120px] p-4 bg-red-50 rounded-xl mb-4 resize-none text-sm
                     border-none focus:outline-none focus:ring-0 placeholder-gray-500"
            placeholder="If you have any additional feedback, please type it in here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>
        <button 
          className="w-full bg-[#1C3557] text-white py-3 px-6 rounded-xl font-semibold text-sm
                   hover:bg-primary/90 transition-colors"
          onClick={handleSubmit}
        >
          Submit feedback
        </button>
        </div>
        </div>):(
            <div className="flex gap-6">
              {/* Left Column - Video */}
                             <div className="flex-1 bg-white rounded-lg shadow-sm p-5">
                               <h2 className="text-lg font-medium">{classData?.teacher.teacherName}</h2>
                               <span className="text-sm text-gray-500">{new Date(classData?.startDate ?? '2022-01-01').toLocaleDateString()} - 
                               {classData?.startTime[0]} to {classData?.endTime[0]}</span>
                               
                               <div className="mt-4 rounded-lg overflow-hidden">
                                 <JitsiMeeting
                                   roomName={classData?.classLink ?? ''}
                                   configOverwrite={{
                                     startWithAudioMuted: false,
                                     startWithVideoMuted: false,
                                     disableTileView: true,
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
                                       'tileview'
                                     ]
                                   }}
                                   getIFrameRef={(iframeRef) => {
                                     iframeRef.style.height = '500px';
                                     iframeRef.style.borderRadius = '0.5rem';
                                   }}
                                   onApiReady={(apiObj) => {
                                     apiRef.current = apiObj;
                                   }}
                                 />
                               </div>
             
                               <div className="flex justify-center gap-4 mt-4">
                                 <button 
                                   className="p-3 bg-gray-100 rounded-full"
                                   onClick={() => handleJitsiControl('toggleAudio')}
                                 >
                                   {isMuted ? (
                                     <MicOff className="text-gray-500" size={20} />
                                   ) : (
                                     <Mic className="text-gray-700" size={20} />
                                   )}
                                 </button>
                                 <button
                                   className="p-3 bg-gray-100 rounded-full"
                                   onClick={() => handleJitsiControl('toggleVideo')}
                                 >
                                   {isVideoOn ? (
                                     <Video className="text-green-600" size={20} />
                                   ) : (
                                     <VideoOff className="text-gray-700" size={20} />
                                   )}
                                 </button>
                                 <button
                                   className="p-3 bg-gray-100 rounded-full"
                                   onClick={() => handleJitsiControl('toggleShareScreen')}
                                 >
                                   <Monitor className="text-gray-700" size={20} />
                                 </button>
                                 <button
                                   className="p-3 bg-red-100 rounded-full"
                                   onClick={handleEndCall}
                                 >
                                   <PhoneOff className="text-red-600" size={20} />
                                 </button>
                               </div>
                             </div>

              {/* Right Column - Course Content & Live Chat */}
              <div className="w-80 ">
                {/* Course Content */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                  <h3 className="text-base font-medium mb-3">Course Content</h3>
                  <div className="space-y-2 h-[600px] overflow-y-auto pr-2">
                    <div>
                      <p className="text-sm font-medium">Title: Arabic</p>
                      <p className="text-sm text-gray-600">Session: 12</p>
                    </div>
                    <p className="text-xs text-gray-600">
                      Tajweed is the art of reciting the Quran with proper pronunciation, intonation, and rhythm. The
                      word "Tajweed" comes from the Arabic root word "j-w-d," which means "to make better."
                    </p>
                    <p className="text-xs text-gray-600">
                      Tajweed is the science of making the Quranic recitation better, by following the rules of
                      pronunciation and intonation.
                    </p>
                  </div>
                </div>

                
              </div>
            </div>
              )} 
          </div>
        </div>
        </div>
        )}
      </div>
    </BaseLayout>
  );
}

export default LiveClass;
