"use client";

import { SetStateAction, useEffect, useState } from "react";
import { Filter, Plus, PlayCircle } from "lucide-react";
import BaseLayout4 from "@/components/BaseLayout4";

const tabs = ["Quran", "Arabic", "Islamic Studies"] as const;
type TabType = (typeof tabs)[number];

type PDF = { title: string; type: string };
type Video = {
  title: string;
  teacher: string;
  date: string;
  time: string;
  url: string;
};

// Define the type for a PDF object
interface Pdf {
  title: string;
  details: string;
  pdfUrl: string;
}

export default function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState<TabType>("Quran");
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  // Define the type for currentPDFs state as an array of Pdf objects
  const [currentPDFs, setCurrentPDFs] = useState<Pdf[]>([]);

  // Dummy data (simulating the backend response)
  useEffect(() => {
    const dummyData: Pdf[] = [
      {
        title: "Sample PDF 1",
        details: "Details about PDF 1",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Sample URL
      },
      {
        title: "Sample PDF 2",
        details: "Details about PDF 2",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Sample URL
      },
      {
        title: "Sample PDF 3",
        details: "Details about PDF 3",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Sample URL
      },
      {
        title: "Sample PDF 4",
        details: "Details about PDF 4",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Sample URL
      },
      {
        title: "Sample PDF 5",
        details: "Details about PDF 5",
        pdfUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Sample URL
      },
    ];

    // Set dummy data to the state
    setCurrentPDFs(dummyData);
  }, []); // Empty dependency array ensures it runs once on mount

  const handleViewClick = (pdfUrl: string) => {
    setPdfUrl(pdfUrl);
    setShowPdf(true); // Open PDF viewer
  };
  const [currentVideos, setCurrentVideos] = useState([
    {
      title: "Class 01 | Tajweed",
      teacher: "Angela Moss",
      date: "12/06/2024",
      time: "10:30 am",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
  ]);

  return (
    <BaseLayout4>
      <div className="p-4">
        <h1 className="text-xl font-semibold text-[#002b4d] mb-4">
          Knowledge Base
        </h1>

        {/* Tabs */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <div className="flex gap-4 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-sm ${
                  activeTab === tab
                    ? "bg-[#002b4d] text-white"
                    : "text-[#002b4d] bg-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-[#002b4d] bg-[#002b4d] rounded-md text-white text-sm">
            <Filter size={16} />
            Filter
          </button>
        </div>

        {/* PDF Grid */}

        <div className="relative w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 bg-white rounded-lg overflow-y-auto h-[240px] max-w-full scrollbar-none w-full">
            <AddCard onClick={() => setShowModal(true)} />
            {currentPDFs.map((pdf) => (
              <div
                key={pdf.title}
                className="border-2 rounded-lg p-4 flex flex-col items-center text-center shadow-sm h-48 justify-between w-full"
              >
                <img
                  src="/assets/pdf-icon.png"
                  alt="PDF"
                  className="h-12 mb-2"
                />
                <div className="flex flex-col flex-1 justify-between">
                  <p className="text-sm font-semibold mt-2">{pdf.title}</p>
                  <p className="text-xs text-gray-500 mb-2">{pdf.details}</p>
                </div>
                <button
                  className="text-xs px-3 py-1 bg-[#002b4d] text-white rounded-md"
                  onClick={() => handleViewClick(pdf.pdfUrl)}
                >
                  View
                </button>
              </div>
            ))}
          </div>

          {/* Modal for PDF */}
          {showPdf && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-2xl w-full max-w-4xl shadow-lg">
                <h3 className="text-lg font-semibold text-[#002b4d] mb-6">
                  PDF Viewer
                </h3>
                <div className="flex justify-end">
                  <button
                    className="px-6 py-2 border rounded-xl text-gray-700 hover:bg-gray-100 transition"
                    onClick={() => setShowPdf(false)}
                  >
                    Close
                  </button>
                </div>
                <div className="w-full h-[500px]">
                  <iframe
                    src={`https://docs.google.com/gview?url=${pdfUrl}&embedded=true`}
                    width="100%"
                    height="100%"
                    title="PDF Viewer"
                    frameBorder="0"
                    
                  />
                </div>
              </div>
            </div>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-lg">
                <h3 className="text-lg font-semibold text-[#002b4d] mb-6">
                  Knowledge Base File Upload
                </h3>

                {/* Course Name */}
                <div className="mb-4">
                  <label
                    htmlFor="course name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Course Name
                  </label>
                  <input
                    type="text"
                    placeholder="Quran"
                    className="w-full border rounded-xl px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#002b4d]"
                  />
                </div>

                {/* Subject Title */}
                <div className="mb-4">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subject Title
                  </label>
                  <input
                    type="text"
                    placeholder="Mercy"
                    className="w-full border rounded-xl px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#002b4d]"
                  />
                </div>

                {/* Upload Format */}
                <div className="mb-4">
                  <label
                    htmlFor="upload"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Upload Format
                  </label>
                  <select className="w-full border rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#002b4d]">
                    <option>.pdf</option>
                    <option>.video</option>
                  </select>
                </div>

                {/* Uploaded By */}
                <div className="mb-4">
                  <label
                    htmlFor="upload"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Uploaded By
                  </label>
                  <input
                    type="text"
                    placeholder="Admin"
                    className="w-full border rounded-xl px-4 py-2 text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                    disabled
                  />
                </div>

                {/* Upload File */}
                <div className="mb-6">
                  <label
                    htmlFor="file"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Upload File
                  </label>
                  <div className="w-full h-40 border-2 border-gray-300 rounded-xl flex items-center justify-center relative bg-gray-50">
                    <input
                      type="file"
                      className="absolute w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center pointer-events-none">
                      <div className="bg-[#002b4d] text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl">
                        +
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4">
                  <button
                    className="px-6 py-2 border rounded-xl text-gray-700 hover:bg-gray-100 transition"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="px-6 py-2 bg-[#002b4d] text-white rounded-xl hover:bg-[#001f36] transition">
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Videos */}
        <div className="p-4 mt-4 bg-white rounded-lg overflow-y-auto h-[290px] w-full scrollbar-none">
          <div className="flex gap-4 flex-wrap mt-4">
            {/* Add Video Card */}
            <div
              className="cursor-pointer"
              onClick={() => setShowUploadModal(true)}
            >
              <AddCards isVideo onClicks={() => setShowUploadModal(true)} />
            </div>

            {/* Video Cards */}
            {currentVideos.map((vid) => (
              <div
                key={vid.title}
                className="w-64 border-2 rounded-lg overflow-hidden shadow-sm h-64"
              >
                <div className="relative">
                  <img
                    src="/video-thumb.jpg"
                    alt="Video"
                    className="w-full h-36 object-cover"
                  />
                  <PlayCircle
                    className="absolute top-2 left-2 text-white bg-black bg-opacity-50 rounded-full"
                    size={24}
                  />
                </div>
                <div className="p-2 text-xs">
                  <h4 className="font-semibold mb-1">
                    {vid.title} | {vid.teacher}
                  </h4>
                  <p>
                    {vid.time} on {vid.date}
                  </p>
                  <button
                    className="mt-2 px-3 py-1 bg-[#002b4d] text-white rounded-md"
                    onClick={() => setSelectedVideo(vid)}
                  >
                    Watch
                  </button>
                  <p className="text-gray-500 mt-1">
                    Note: Recorded classes will remain available for a maximum
                    of three months from the class date.
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-lg">
                <h3 className="text-lg font-semibold text-[#002b4d] mb-6">
                  Knowledge Base File Upload
                </h3>

                {/* Course Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Name
                  </label>
                  <input
                    type="text"
                    placeholder="Quran"
                    className="w-full border rounded-xl px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#002b4d]"
                  />
                </div>

                {/* Subject Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Title
                  </label>
                  <input
                    type="text"
                    placeholder="Mercy"
                    className="w-full border rounded-xl px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#002b4d]"
                  />
                </div>

                {/* Upload Format */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Format
                  </label>
                  <select className="w-full border rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#002b4d]">
                    <option>.pdf</option>
                    <option>.video</option>
                  </select>
                </div>

                {/* Uploaded By */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Uploaded By
                  </label>
                  <input
                    type="text"
                    placeholder="Admin"
                    className="w-full border rounded-xl px-4 py-2 text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                    disabled
                  />
                </div>

                {/* Upload File */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload File
                  </label>
                  <div className="w-full h-40 border-2 border-gray-300 rounded-xl flex items-center justify-center relative bg-gray-50">
                    <input
                      type="file"
                      className="absolute w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center pointer-events-none">
                      <div className="bg-[#002b4d] text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl">
                        +
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Buttons */}
                <div className="flex justify-end gap-4">
                  <button
                    className="px-6 py-2 border rounded-xl text-gray-700 hover:bg-gray-100 transition"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="px-6 py-2 bg-[#002b4d] text-white rounded-xl hover:bg-[#001f36] transition">
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Video Playback Modal */}
          {selectedVideo && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-lg relative">
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                >
                  &times;
                </button>
                <h3 className="text-lg font-semibold text-[#002b4d] mb-4">
                  {selectedVideo.title}
                </h3>
                <video
                  src={selectedVideo.url}
                  controls
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseLayout4>
  );

  // Plus Button for PDFs
  function AddCard({
    isVideo = false,
    onClick,
  }: {
    isVideo?: boolean;
    onClick?: () => void;
  }) {
    return (
      <div
        onClick={onClick}
        className={`flex items-center justify-center border-2 border-gray-300 rounded-lg cursor-pointer ${
          isVideo ? "w-64 h-48" : "h-48 w-full"
        }`}
      >
        <div className="flex items-center justify-center w-12 h-12 bg-[#002c5f] rounded-full">
          <Plus className="text-white" size={24} />
        </div>
      </div>
    );
  }

  function AddCards({
    isVideo = false,
    onClicks,
  }: {
    isVideo?: boolean;
    onClicks?: () => void;
  }) {
    return (
      <div className="w-72 h-64 border-2 border-gray-300 rounded-lg flex items-center justify-center shadow-sm">
        <div
          className="flex items-center justify-center w-12 h-12 bg-[#002c5f] rounded-full cursor-pointer"
          onClick={onClicks}
        >
          <Plus className="text-white" size={24} />
        </div>
      </div>
    );
  }
}
