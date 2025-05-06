'use client';

import { JitsiMeeting } from '@jitsi/react-sdk';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import BaseLayout4 from '@/components/BaseLayout4';

const VideoCall = () => {
  const router = useRouter();
  const [roomName, setRoomName] = useState('');

  useEffect(() => {
    // Ideally this should come from your backend or query params
    const room = 'MyLiveClassRoom123'; // Replace with dynamic value
    setRoomName(room);
  }, []);

  const endCall = () => {
    router.push('/dashboard'); // Redirect after call ends
  };

  return (
    <BaseLayout4>
      <div className="flex min-h-screen ">
  <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-5 mx-auto rounded-md max-w-screen-2xl">
    <div className="p-1 sm:p-2 relative">

      {/* Exit Button */}
      <button
        onClick={endCall}
        className="absolute top-4 right-4 cursor-pointer"
        aria-label="Leave meeting"
      >
        <LogOut className="w-6 h-6 text-red-500 hover:text-red-600 transition" />
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1C3557]">Live Class</h1>
      </div>

      {/* Student Info */}
      <div className="mb-4">
        <h2 className="text-lg font-medium">Student Name</h2>
        <span className="text-sm text-gray-500">2022.4.16</span>
      </div>

      {/* Jitsi Video Box */}
      <div className="w-full h-[60vh] md:h-[70vh] rounded-md overflow-hidden shadow-inner border border-gray-300">
  {roomName && (
    <JitsiMeeting
      roomName={roomName}
      domain="meet.blackstoneinfomaticstech.com"
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
          'tileview'
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


      {/* End Call Button */}
      <div className="flex justify-center mt-6">
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition"
          onClick={endCall}
        >
          End Call
        </button>
      </div>
    </div>
  </div>
</div>

    </BaseLayout4>
  );
};

export default VideoCall;
