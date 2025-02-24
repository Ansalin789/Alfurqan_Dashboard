'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Settings2,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  PhoneOff,
  LogOut,
} from 'lucide-react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import axios from 'axios';
import BaseLayout3 from '@/components/BaseLayout3';
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
  classSchedule: ClassData;
}


function LiveClass() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [ratings, setRatings] = useState([0, 0, 0, 0]);
  const [feedback, setFeedback] = useState('');
  const apiRef = useRef<any>(null);
  const [classData, setClassData] = useState<ClassData | null>(null);
   
  useEffect(() => {
    const datafeedshow =localStorage.getItem('showfeedbackdirect');
    const classScheduleid=localStorage.getItem('showfeedbackid');
    console.log(classScheduleid);
    setShowFeedback(datafeedshow === "true"); 
    const fetchClassData = async () => {
      try {
       
        const authToken = localStorage.getItem('SupervisorAuthToken');
        
        // Ensure studentId and authToken are valid
        if (!authToken) {
          console.log('Missing studentId or authToken');
          return;
        }
  
        const response = await axios.get<ClassData>(`http://localhost:5001/classShedule/${classScheduleid}`, {
          
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        console.log('Full API Response:', response.data);  // ✅ Log full response

      if (response.data) {
        console.log('Setting classData:', response.data); // ✅ Log before setting state
        setClassData(response.data);
      } else {
        console.log('Error: classSchedule is missing in API response');
      }
      } catch (err) {
        console.log('Error loading class details:', err);
      }
    };
    fetchClassData();
  }, []);
  useEffect(() => {
    console.log('Updated classData:', classData); // ✅ Log changes to classData
  }, [classData]);
    const handleSubmitfeed = async () => {
      // Create request body
      const feedbackData = {
        supervisor: {
          supervisorId: localStorage.getItem('SupervisorPortalId'),
          supervisorFirstName:localStorage.getItem('SupervisorPortalName'), 
          supervisorLastName: localStorage.getItem('SupervisorPortalName'), 
         supervisorEmail: "john.doe@example.com",
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
          knowledgeofstudentsandcontent: ratings[0],
          assessmentofstudents: ratings[1],
          communicationandcollaboration: ratings[2],
          professionalism: ratings[3],
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
       console.log(feedbackData);
      try {
        const response = await axios.post("http://localhost:5001/supervisorfeedback", feedbackData, {
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
  
  const categories = ["knowledge of students and content", "Assessment of Students", " Communication and Collaboration","Professionalism"];

  return (
    <BaseLayout3>
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
           <Link  href="/supervisor/ui/viewschedule" className="absolute top-4 right-4 cursor-pointer" >
                <LogOut className="w-6 h-6 text-red-500 hover:text-red-500 transition" />
            </Link>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-[#1C3557]">Live Class</h1>
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
              <h2 className="text-base text-gray-600 font-medium mb-1">{classData?.classDay} - {new Date(classData?.startDate ?? '2022-01-01').toLocaleDateString()}</h2>
              <div className="text-gray-600 mb-6 font-medium">
                <span>{classData?.startTime[0]} to {classData?.endTime[0]}</span>
              </div>
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-gray-900 font-bold">{classData?.teacher?.teacherName}</span>
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
            onClick={handleSubmitfeed}
          >
            Submit feedback
          </button>
          </div>
          </div>
      ):(
              <div className="flex gap-6">
                <div className="flex-1 bg-white rounded-lg shadow-sm p-5">
                  <h2 className="text-lg font-medium">{classData?.student.studentFirstName}</h2>
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
              <div className="w-80">
                {/* Course Content */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                  <h3 className="text-base font-medium mb-3">Course Content</h3>
                  <div className="space-y-2 h-[calc(100%-2rem)] overflow-y-auto pr-2">
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

                {/* Live Chat */}
                <div className="bg-white rounded-lg shadow-sm p-4 flex-1 overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-medium">Live Chat</h3>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Settings2 size={16} />
                    </button>
                  </div>
                  <div className="space-y-3 mb-3 h-[200px] overflow-y-auto">
                    <div className="flex gap-2">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                        alt="Samantha"
                        className="w-6 h-6 rounded-full"
                      />
                      <div>
                        <p className="text-xs font-medium">Samantha</p>
                        <p className="bg-gray-50 rounded-lg p-2 mt-1 text-xs">
                          Lorem ipsum dolor sit amet ut labore et
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <div className="text-right">
                        <p className="text-xs font-medium">You</p>
                        <p className="bg-blue-50 text-gray-800 rounded-lg p-2 mt-1 text-xs">
                          Lorem ipsum dolor sit amet ut labore et dolore magna
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type here..."
                      className="flex-1 border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button className="bg-blue-500 text-white p-1.5 rounded-full">
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
              )} 
          </div>
        </div>
      </div>
    </BaseLayout3>
  );
}

export default LiveClass;
