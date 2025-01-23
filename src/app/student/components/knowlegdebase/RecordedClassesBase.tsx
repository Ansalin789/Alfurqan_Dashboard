'use client';
import { useState } from "react";
import { FiFilter } from "react-icons/fi";

const RecordedClassesBase: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; isYouTube: boolean } | null>(null);

  // Sample data for videos
  const videoData = [
    {
      id: 1,
      thumbnail: "/assets/images/teaching.jpg",
      videoUrl: "https://www.youtube.com/watch?v=hTYsf6bdSJ8&t=1778s",
      title: "Class Id | Tajweed | Angela Moss",
      time: "10.30 am 12/06/2024",
    },
    {
      id: 2,
      thumbnail: "/assets/images/teaching.jpg",
      videoUrl: "/assets/videos/recorded-class-2.mp4",
      title: "Class Id | Arabic | John Doe",
      time: "11.30 am 12/06/2024",
    },
    {
      id: 3,
      thumbnail: "/assets/images/teaching.jpg",
      videoUrl: "/assets/videos/recorded-class-3.mp4",
      title: "Class Id | Islamic Studies | John Doe",
      time: "12.00 am 12/06/2024",
    },
    {
      id: 4,
      thumbnail: "/assets/images/teaching.jpg",
      videoUrl: "/assets/videos/recorded-class-4.mp4",
      title: "Class Id | Quran | Jane Doe",
      time: "12.30 pm 12/06/2024",
    },
  ];

  const handleVideoClick = (videoUrl: string) => {
    const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
    setSelectedVideo({ url: videoUrl, isYouTube });
  };

  return (
    <section className="bg-[#ffffff] p-6 py-3 rounded-xl mt-4">
      <div className="flex items-center justify-between mb-2 p-1 border-b-2 border-b-[#525151]">
        <h2 className="text-[25px] font-bold text-[#5C5F85]">Recorded Classes Base</h2>
        {/* Date and Filter */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="MM/DD/YYYY"
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full pr-10"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10m-9 4h4m-7-6h16a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
                />
              </svg>
            </div>
          </div>
          <button>
            <FiFilter className="w-6 h-6 text-[#687E9C]" />
          </button>
        </div>
      </div>

      {/* Video Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 p-1 overflow-y-scroll scrollbar-thin scrollbar-track-black">
        {videoData.map((video) => (
          <button
          key={video.id}
          className="w-60 bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
          onClick={() => handleVideoClick(video.videoUrl)}
          aria-label={`Play video ${video.title}`}
        >
          <img
            src={video.thumbnail}
            alt="Class Thumbnail"
            className="w-full h-32 object-cover"
          />
          <div className="p-3">
            <h3 className="text-[12px] font-bold text-gray-800 mb-1">{video.title}</h3>
            <p className="text-[11px] text-gray-500 mb-2">{video.time}</p>
            <p className="text-[10px] text-gray-500 bg-[#dadada] px-[8px] py-[2px] rounded-lg">
              <b>Note:</b> Recorded classes will remain available for a maximum of one month from the class date.
            </p>
          </div>
        </button>
        ))}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden max-w-2xl w-full">
            {selectedVideo.isYouTube ? (
              <iframe
                width="100%"
                height="400"
                src={`${selectedVideo.url.replace("watch?v=", "embed/")}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video src={selectedVideo.url} controls className="w-full h-auto" />
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
