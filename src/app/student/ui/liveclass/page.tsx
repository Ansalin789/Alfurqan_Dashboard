'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Settings2,
  Mic,
  Video,
  MonitorStop,
  PhoneOff
} from 'lucide-react';
import BaseLayout2 from '@/components/BaseLayout2';

function LiveClass() {
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // State to manage microphone mute
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  

  useEffect(() => {
    if (isVideoCallActive) {
      startVideoCall();
    } else {
      endVideoCall();
    }

    return () => {
      endVideoCall();
    };
  }, [isVideoCallActive]);

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
    setIsVideoCallActive(false); // Ends the call
  };

  return (
    <BaseLayout2>
      <div className="flex h-screen bg-[#E6E9ED]">
        {/* Main Content */}
        <div className="flex-1 overflow-auto w-[1200px] mt-5 ml-5 h-[800px]">
          <div className="p-6 w-[100%]">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold text-[#1C3557]">My Class</h1>
            </div>

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
                      <button
                        className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200"
                        onClick={toggleMute}  // Toggle microphone mute/unmute
                      >
                        <Mic size={18} className="text-gray-700" />
                      </button>
                      <button
                        className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200"
                        onClick={() => setIsVideoCallActive(!isVideoCallActive)}
                      >
                        <Video size={18} className="text-gray-700" />
                      </button>
                      <button className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200">
                        <MonitorStop size={18} className="text-gray-700" />
                      </button>
                      <button
                        className="p-2.5 rounded-full bg-red-100 hover:bg-red-200"
                        onClick={endCall}  // End call functionality
                      >
                        <PhoneOff size={18} className="text-red-600" />
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
          </div>
        </div>
      </div>
    </BaseLayout2>
  );
}

export default LiveClass;
