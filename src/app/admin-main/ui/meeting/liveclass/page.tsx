'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  PhoneOff,
  LogOut,
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import BaseLayout3 from '@/components/BaseLayout3';
import { io, Socket } from 'socket.io-client';

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
  classDay: string[];
  package: string;
  preferedTeacher: string;
  totalHourse: number;
  startDate: string;
  endDate: string;
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

let socket: Socket | null = null;

function LiveClass() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [classData, setClassData] = useState<ClassData | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const router = useRouter();

  useEffect(() => {
    // WebSocket connection for signaling
    socket = io('http://alfurqanacademy.tech:5001'); // Replace with your actual socket URL

    socket.on('connect', () => {
      console.log('Connected to the signaling server');
      startCall()
      // ✅ Emit join-meeting after connection is established
      socket!.emit('join-meeting', { meetingId: '123456', userId: '1' });
    });
   
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('user-left', (userId: string) => {
      console.log(`User ${userId} left the meeting`);
    });

    // Fetch class data and join the meeting room based on meetingId
    const fetchClassData = async () => {
      try {
        const response = await axios.get<ClassData>('https://alfurqanacademy.tech/classShedule/yourClassId'); // Replace with actual class ID
        setClassData(response.data);
      } catch (error) {
        console.error('Error fetching class data:', error);
      }
    };

    fetchClassData();

    // Start local media stream
    startLocalStream();

    return () => {
      socket?.disconnect();
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const createPeerConnection = (meetingId: string) => {
    const peerConnection = new RTCPeerConnection();
  
    // Add local media tracks if available
    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }
  
    // Handling incoming remote tracks
    peerConnection.ontrack = (event) => {
      const remoteStream = event.streams[0];
      setRemoteStream(remoteStream);
  
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };
  
    // Handling ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit('ice-candidate', { meetingId, candidate: event.candidate });
      }
    };
  
    // Optionally: Handle connection state or any error
    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === 'failed') {
        console.error('Connection failed!');
        // Handle disconnection or retry logic here
      }
    };
  
    return peerConnection;
  };
  

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    const peerConnection = createPeerConnection('123456');
    peerConnectionRef.current = peerConnection;

    await peerConnection.setRemoteDescription(offer);

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket?.emit('answer', { meetingId: 123456, answer });
  };

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (peerConnectionRef.current) {
      await peerConnectionRef.current.setRemoteDescription(answer);
    }
  };

  const handleIceCandidate = (candidate: RTCIceCandidate) => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.addIceCandidate(candidate);
    }
  };

  const startCall = async () => {
    if (!classData) return;

    const peerConnection = createPeerConnection('123456');
    peerConnectionRef.current = peerConnection;

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket?.emit('offer', { meetingId: 123456, offer });
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setRemoteStream(null);
    socket?.emit('leave-meeting', 123456);
  };

  const handleJitsiControl = (action: string) => {
    if (!localStream) return;

    switch (action) {
      case 'toggleAudio':
        setIsMuted(!isMuted);
        break;
      case 'toggleVideo':
        setIsVideoOn(!isVideoOn);
        break;
      case 'toggleShareScreen':
        setIsScreenSharing(!isScreenSharing);
        break;
    }
  };

  const handleLogout = () => {
    router.push("/admin-main/ui/meeting");
  };

  return (
    <BaseLayout3>
      <div className="flex h-screen bg-[#E6E9ED]">
        <div className="flex-1 overflow-auto w-[1100px] ml-5 h-[700px] scrollbar-none">
          <div className="p-6 w-[100%]">
            <button onClick={handleLogout} className="absolute top-4 right-4 cursor-pointer">
              <LogOut className="w-6 h-6 text-red-500 hover:text-red-500 transition" />
            </button>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-[#1C3557]">Live Class</h1>
            </div>
            <div className="flex gap-6">
              <div className="flex-1 bg-white rounded-lg shadow-sm p-5">
                <h2 className="text-lg font-medium">{classData?.student.studentFirstName}</h2>
                <span className="text-sm text-gray-500">
                  {new Date(classData?.startDate ?? '2022-01-01').toLocaleDateString()} - 
                  {classData?.startTime[0]} to {classData?.endTime[0]}
                </span>

                <div className="mt-4 rounded-lg overflow-hidden">
                  {/* Video Call Stream */}
                  <div className="flex justify-center gap-4 mt-4">
                    <video ref={localVideoRef} autoPlay muted className="w-[500px] h-[400px] rounded-md" />
                    <video
                      ref={remoteVideoRef} 
                      autoPlay 
                      className="w-[500px] h-[400px] rounded-md" 
                    />
                  </div>
                </div>

                <div className="flex justify-center gap-4 mt-4">
                  <button className="p-3 bg-gray-100 rounded-full" onClick={() => handleJitsiControl('toggleAudio')}>
                    {isMuted ? <MicOff className="text-gray-500" size={20} /> : <Mic className="text-gray-700" size={20} />}
                  </button>
                  <button className="p-3 bg-gray-100 rounded-full" onClick={() => handleJitsiControl('toggleVideo')}>
                    {isVideoOn ? <Video className="text-green-600" size={20} /> : <VideoOff className="text-gray-700" size={20} />}
                  </button>
                  <button className="p-3 bg-gray-100 rounded-full" onClick={() => handleJitsiControl('toggleShareScreen')}>
                    <Monitor className="text-gray-700" size={20} />
                  </button>
                  <button className="p-3 bg-red-100 rounded-full" onClick={endCall}>
                    <PhoneOff className="text-red-600" size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout3>
  );
}

export default LiveClass;
