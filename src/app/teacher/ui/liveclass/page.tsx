'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Settings2,
  Mic,
  Video,
  MonitorStop,
  PhoneOff,Disc,Timer, ChevronDown
} from 'lucide-react';
import BaseLayout from '@/components/BaseLayout';

function LiveClass() {
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const [ratings, setRatings] = useState([0, 0, 0]);
  const [feedback, setFeedback] = useState('');
  const[showFeedback,setShowFeedback]=useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const[isScreenSharing,setIsScreenSharing]=useState(false);
  const[isFormData,setIsFormData]=useState(true);

  function StarRating({
    value,
    onChange,
  }: {
    readonly value: number;
    readonly onChange: (rating: number) => void;
  }) {
    return (
      <div className="flex gap-1" role="radiogroup" aria-label="Star Rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <label
            key={star}
            className="text-xl cursor-pointer flex items-center"
          >
            <input
              type="radio"
              name="rating"
              value={star}
              checked={star === value}
              onChange={() => onChange(star)}
              className="hidden"
            />
            <span
              className={`${
                star <= value ? 'text-yellow-400' : 'text-gray-200'
              }`}
            >
              ★
            </span>
          </label>
        ))}
      </div>
    );
  }
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
  }, [showPopup])

  useEffect(() => {
    if (isVideoCallActive) {
      startVideoCall();
    } else {
      endVideoCall();
    }
  
    // Cleanup on unmount or when the call ends
    return () => {
      endVideoCall();
    };
  }, [isVideoCallActive]);
  const handleSubmitrate = () => {
    console.log({ ratings, feedback })
    setShowPopup(true)
  }

  const startVideoCall = async () => {
    try {
      // Get local media stream (audio + video)
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = localStream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      // Set up peer connection
      const peerConnection = new RTCPeerConnection();
      peerConnectionRef.current = peerConnection;

      // Add local stream to peer connection
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      // Handle incoming stream (remote stream)
      peerConnection.ontrack = (event) => {
        if (event.streams[0]) {
          remoteStreamRef.current = event.streams[0];
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        }
      };

      // Create offer and set local description
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // Here you would send the offer to the remote peer and handle the signaling process
      // This could involve using WebSockets, Firebase, or another signaling mechanism
      // await sendOfferToRemotePeer(offer);

    } catch (err) {
      console.error('Error starting video call:', err);
    }
  };

  const endVideoCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => track.stop());
      remoteStreamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const endCall = () => {
    setIsVideoCallActive(false);
    setShowFeedback(true); 
  };
  const handleScreenShareToggle = async () => {
    if (!isScreenSharing) {
      console.log('Starting screen sharing...');
      await startScreenSharing();
    } else {
      console.log('Stopping screen sharing...');
      stopScreenSharing();
    }
  };
  
  const startRecording = () => {
    // Logic to start recording
    console.log('Recording started');
    setIsRecording(true);
  };
  
  const stopRecording = () => {
    // Logic to stop recording
    console.log('Recording stopped');
    setIsRecording(false);
  };
  const [student, setStudent] = useState({
    firstName: 'Samantha',
    lastName: 'William',
    city: 'Texas',
    country: 'USA',
    trialId: '#098367',
    course: 'Arabic',
    classStatus: 'Joining',
    sessionDate: '2024-05-06',
    sessionTime: '04:23',
    comments: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStudent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', student);
  };

  const handleStartSession = () => {
    console.log('Starting session for student:', student);
    setIsFormData(false);
  };

  const handleClear = () => {
    setStudent({
      firstName: '',
      lastName: '',
      city: '',
      country: '',
      trialId: '',
      course: '',
      classStatus: 'Joining',
      sessionDate: '',
      sessionTime: '',
      comments: '',
    });
  };

  const renderStudentForm = () => {
    return (
      <form onSubmit={handleSubmit} className="lg:col-span-2 bg-[#1E3F6C] w-[900px] h-[90vh] rounded-3xl opacity-[90%] text-white p-5 justify-center ml-28">
        <h2 className="text-[17px] font-medium mb-4">Student Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor='firtname' className="block text-[12px] mb-2">First name</label>
            <input
              type="text"
              name="firstName"
              value={student.firstName}
              onChange={handleInputChange}
              className="w-full px-4 text-[12px] py-2 rounded-lg bg-[#C0C9D6] text-[#030303] border border-white/20 focus:outline-none focus:border-blue-400"
              required
              readOnly
            />
          </div>
          
          <div>
            <label htmlFor='firname'  className="block text-[12px] mb-2">Last name</label>
            <input
              type="text"
              name="lastName"
              value={student.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 text-[12px] rounded-lg bg-[#C0C9D6] text-[#030303] border border-white/20 focus:outline-none focus:border-blue-400"
              required
              readOnly
            />
          </div>

          <div>
            <label  htmlFor='fname' className="block text-[12px] mb-2">City</label>
            <div className="relative">
              <select
                name="city"
                value={student.city}
                onChange={handleInputChange}
                className="w-full px-4 text-[12px] py-2 rounded-lg bg-white text-[#030303] border border-white/20 focus:outline-none focus:border-blue-400 appearance-none"
                required
                disabled
              >
                <option value="Texas">Texas</option>
                <option value="New York">New York</option>
                <option value="California">California</option>
              </select>
              <ChevronDown className="absolute text-[#030303] right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label htmlFor='firthgchgname'  className="block text-[12px] mb-2">Country</label>
            <div className="relative">
              <select
                name="country"
                value={student.country}
                onChange={handleInputChange}
                className="w-full px-4 py-2 text-[12px] rounded-lg bg-white text-[#030303] border border-white/20 focus:outline-none focus:border-blue-400 appearance-none"
                required
                disabled
              >
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="UK">UK</option>
              </select>
              <ChevronDown className="absolute text-[#030303] right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label htmlFor='firfftname'  className="block text-[12px] mb-2">Trial ID</label>
            <input
              type="text"
              name="trialId"
              value={student.trialId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 text-[12px] rounded-lg bg-[#C0C9D6] text-[#030303] border border-white/20 focus:outline-none focus:border-blue-400"
              required
              readOnly
            />
          </div>

          <div>
            <label htmlFor='firtghggname'  className="block text-[12px] mb-2">Course</label>
            <div className="relative">
              <select
                name="course"
                value={student.course}
                onChange={handleInputChange}
                className="w-full px-4 py-2 text-[12px] rounded-lg bg-white text-[#030303] border border-white/20 focus:outline-none focus:border-blue-400 appearance-none"
                required
                disabled
              >
                <option value="Arabic">Arabic</option>
                <option value="Islamic Studies">Islamic Studies</option>
                <option value="Quran">Quran</option>
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
              value={student.classStatus}
              onChange={handleInputChange}
              className="w-full px-4 py-2 text-[12px] rounded-lg bg-[#f5f9ff] text-[#030303] border border-white/20 focus:outline-none focus:border-blue-400 appearance-none"
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
            value={student.comments}
            onChange={handleInputChange}
            placeholder="Write your comment here..."
            className="w-full px-4 py-2 text-[12px] rounded-lg bg-[#f5f9ff] text-[#030303] border border-white/20 focus:outline-none focus:border-blue-400 h-24 resize-none"
          />
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={handleClear}
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
    );
  };

  const renderStudentInfoCard = () => {
    return (
      <div className="rounded-lg p-6 w-[90%] mt-20 h-[90%]">
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
         <h2 className="text-[#1C3557] text-[22px] font-semibold text-center mt-4">
           {student.firstName} {student.lastName}
         </h2>
         <div className="flex items-center justify-center gap-2 mt-2 text-[#1C3557] text-[14px]">
           <Timer size={16} />
           <span>Monday - {student.sessionDate}</span>
         </div>
         
         <div className="mt-6 text-center">
           <p className="text-[#1C3557] text-[14px] mb-2">Trial Session is <br />Due in</p>
           <div className="inline-block relative">
             <div className="w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center">
               <span className="font-bold">{student.sessionTime}</span>
             </div>
             <span className="text-[#1C3557] text-[14px] mt-1 block">Mins</span>
           </div>
         </div>
        </div>
         

        <button
          onClick={handleStartSession}
          className="w-full bg-red-500 text-white text-[14px] rounded-2xl py-3 mt-6 hover:bg-red-600 transition-colors justify-center "
        >
          Start Trial Session Now
        </button>
      </div>
    );
  };

  const handleVideoCallToggle = () => {
    setIsVideoCallActive((prev) => !prev);
  };

  const stopScreenSharing = () => {
    const tracks = localStreamRef.current?.getTracks();
    tracks?.forEach((track) => {
      if (track.kind === 'video') {
        track.stop();
      }
    });
    localStreamRef.current!.getVideoTracks()[0].enabled = true;
    setIsScreenSharing(false);
  };

  const startScreenSharing = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getTracks()[0];
      const localStream = localStreamRef.current;
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        localStream.addTrack(screenTrack);
      }
      localStreamRef.current = localStream;
      setIsScreenSharing(true);
    } catch (err) {
      console.error('Error starting screen share:', err);
    }
  };

  return (
    <BaseLayout>
      <div className="flex mx-auto">
        {isFormData ? (
          <div className="mx-auto p-4">
            <h1 className="text-2xl font-semibold text-gray-800 p-2">Trial Class</h1>
            <div className="flex gap-6 w-full">
              {renderStudentForm()}
              {renderStudentInfoCard()}
            </div>
          </div>
        ) : (
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
            <h3 className="text-2xl text-primary font-bold mb-3">Tajweed Masterclass</h3>
              <h2 className="text-base text-gray-600 font-medium mb-1">Monday - 06.05.2024</h2>
              <div className="text-gray-600 mb-6 font-medium">
                <span>9:00 AM - 10:30 AM</span>
              </div>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary rounded-full"></div>
                <span className="text-gray-700 font-medium">Prof. Smith</span>
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
          
          {[0, 1, 2].map((index) => (
            <div key={index} className="mb-6">
              <p className="text-gray-600 text-sm font-medium mb-2">Your rating for this class</p>
              <StarRating
                value={ratings[index]}
                onChange={(rating) => {
                  const newRatings = [...ratings]
                  newRatings[index] = rating
                  setRatings(newRatings)
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
            onClick={handleSubmitrate}
          >
            Submit feedback
          </button>
          </div>
          </div>):(
              <div className="flex gap-6">
                {/* Left Column - Video */}
                <div className="flex-1">
                  <div className="bg-white rounded-lg shadow-sm p-5">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h2 className="text-lg font-medium">Tajweed</h2>
                        <p className="text-sm text-gray-500">Angelina Crispy</p>
                      </div>
                      <span className="text-sm text-gray-500">08/05/2024</span>
                    </div>

                    {/* Video Container */}
                    <div className="bg-black aspect-video rounded-lg mb-4 relative">
                      <div className="absolute top-3 left-3">
                        <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">Live</span>
                      </div>

                      {/* Local Video Stream */}
                      <video ref={localVideoRef} autoPlay muted={isMuted} className="absolute top-0 left-0 w-full h-full object-cover">
                                <track kind="captions" />
                                </video>
                      {/* Remote Video Stream */}
                      <video ref={remoteVideoRef} autoPlay muted={isMuted} className="absolute top-0 left-0 w-full h-full object-cover">
                        <track kind="captions" />
                        </video>
                    </div>
                    {/* Controls */}
                    <div className="flex justify-center items-center gap-4 ">
                    <div className="flex gap-4 mb-2">
    {/* Mute Button */}
    <button
      className={`p-2.5 rounded-full ${
        isMuted ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 hover:bg-gray-200'
      }`}
      onClick={toggleMute} // Toggle microphone mute/unmute
    >
      <Mic size={18} className={isMuted ? 'text-gray-500' : 'text-gray-700'} />
    </button>

    {/* Video Button */}
    <button
      className={`p-2.5 rounded-full ${
        isVideoCallActive ? 'bg-green-200 hover:bg-green-300' : 'bg-gray-100 hover:bg-gray-200'
      }`}
      onClick={handleVideoCallToggle}
    >
      <Video size={18} className={isVideoCallActive ? 'text-green-600' : 'text-gray-700'} />
    </button>

    {/* Screen Share Button */}
    <button
      className={`p-2.5 rounded-full ${
        isScreenSharing ? 'bg-blue-200 hover:bg-blue-300' : 'bg-gray-100 hover:bg-gray-200'
      }`}
      onClick={handleScreenShareToggle}
    >
      <MonitorStop size={18} className={isScreenSharing ? 'text-blue-600' : 'text-gray-700'} />
    </button>

    {/* End Call Button */}
    <button
      className="p-2.5 rounded-full bg-red-100 hover:bg-red-200"
      onClick={endCall} // End call functionality
    >
      <PhoneOff size={18} className="text-red-600" />
    </button>

    {/* Recording Button */}
    <button
      className={`p-2.5 rounded-full ${
        isRecording ? 'bg-red-200 hover:bg-red-300' : 'bg-gray-100 hover:bg-gray-200'
      }`}
      onClick={() => {
        if (isRecording) {
          stopRecording();
        } else {
          startRecording();
        }
        setIsRecording(!isRecording);
      }}
    >
      <Disc size={18} className={isRecording ? 'text-red-600' : 'text-gray-700'} />
    </button>
  </div>

                      
                    </div>
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
          )}
      </div>
    </BaseLayout>
  );
}

export default LiveClass;
