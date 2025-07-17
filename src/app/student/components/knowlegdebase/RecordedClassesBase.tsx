'use client';
import { useEffect, useState, useMemo } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaPlay } from 'react-icons/fa';
import axios from 'axios';

interface VideoItem {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  time: string;
}

interface Props {
  searchValue?: string;
}

const RecordedClassesBase: React.FC<Props> = ({ searchValue = '' }) => {
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string;
    isYouTube: boolean;
  } | null>(null);

  const [videoData, setVideoData] = useState<VideoItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecordedClasses = async () => {
      try {
        const token = localStorage.getItem('StudentAuthToken');
        if (!token) {
          setError('StudentAuthToken not found');
          return;
        }

        const response = await axios.get(
          'https://api.blackstoneinfomaticstech.com/knowledgebase/list',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const filteredVideos = (response.data.data || []).filter(
          (item: any) =>
            item.uploadedFormat?.toLowerCase() === 'video' && item.uploadedFile?.data
        );

        const transformed = filteredVideos.map((item: any, index: number) => ({
          id: item._id || `video-${index}`,
          videoUrl: `data:video/mp4;base64,${arrayBufferToBase64(item.uploadedFile.data)}`,
          thumbnailUrl: '/assets/images/teaching.jpg',
          title: item.subjectTitle || 'Class Title',
          time: item.createdDate
            ? new Date(item.createdDate).toLocaleString()
            : 'Time not specified',
        }));

        setVideoData(transformed);
      } catch (err) {
        console.error('Failed to fetch recorded classes:', err);
        setError('Failed to load recorded classes');
      }
    };

    fetchRecordedClasses();
  }, []);

  const arrayBufferToBase64 = (buffer: number[]) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleVideoClick = (videoUrl: string) => {
    const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
    setSelectedVideo({ url: videoUrl, isYouTube });
  };

  const filteredVideos = useMemo(() => {
    return videoData.filter((video) =>
      video.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, videoData]);

  return (
    <section className="max-w-full h-full dark:bg-[#3b3b3b] p-2 rounded-xl mt-2">
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-2">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => handleVideoClick(video.videoUrl)}
            className="bg-[#FAFAFB] px-4 dark:bg-[#343434] rounded-xl shadow hover:shadow-md transition cursor-pointer overflow-hidden relative flex flex-col items-center text-center"
          >
            <div className="relative w-full">
              <img
                src={video.thumbnailUrl}
                alt="Thumbnail"
                className="w-full h-36 object-cover rounded-t-md"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white bg-opacity-90 dark:bg-[#ffffffc7] px-3 py-2 rounded-lg shadow">
                  <FaPlay className="text-gray-600 w-3 h-3" />
                </div>
              </div>
              <div className="absolute top-2 right-2 text-gray-200 dark:text-white z-10">
                <BsThreeDotsVertical className="w-4 h-4" />
              </div>
            </div>
            <div className="px-2 py-3">
              <h3 className="text-[13px] font-semibold dark:text-white text-[#223857] leading-snug">
                {video.title}
              </h3>
              <p className="text-[11px] text-[#8E8E8E] dark:text-[#AAAAAA] mt-1">
                {video.time}
              </p>
              <p className="text-[11px] text-[#4F4F4F] dark:text-[#AAAAAA] mt-2 leading-tight">
                <strong className="text-[#4F4F4F] dark:text-[#AAAAAA]">Note-</strong> Recorded
                classes will remain available for a maximum of three months
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden max-w-2xl w-full">
            {selectedVideo.isYouTube ? (
              <iframe
                width="100%"
                height="250"
                src={`${selectedVideo.url.replace('watch?v=', 'embed/')}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video src={selectedVideo.url} controls className="w-full h-[250px]" />
            )}

            <div className="flex justify-end p-2">
              <button
                onClick={() => setSelectedVideo(null)}
                className="px-4 py-2 text-white bg-gray-800 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RecordedClassesBase;
