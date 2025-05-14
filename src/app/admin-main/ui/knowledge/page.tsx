"use client";

import {  useEffect, useState } from "react";
import { Filter, Plus, FileText, Video } from "lucide-react";
import BaseLayout4 from "@/components/BaseLayout4";
const tabs = ["Quran", "Arabic", "Islamic Studies"] as const;
type TabType = (typeof tabs)[number];
type PDF = { title: string; type: string };
type Video = {
  title: string;
  uploadedFile: {
    data: number[];  // or use `Buffer` if that's what you're using
  };
  // other properties of your video object
};

// Define the type for a PDF object
interface Pdf {
  title: string;
  details: string;
  pdfUrl: string;
}
interface KnowledgeBaseEntry {
  courseName: string;
  subjectTitle: string;
  uploadedFormat: string;
  uploadedFile: string;  // base64 string
  status: string;
  createdDate: string;
  createdBy: string;
  updatedBy: string;
  updatedDate: string;
}
interface KnowledgeBaseItem {
  _id: string;
  courseName: string;
  subjectTitle: string;
  uploadedFormat: string;
  uploadedFile: {
    type: string;
    data: number[];
  };
  status: string;
  createdDate: string;
  createdBy: string;
  __v: number;
}
interface ProcessedKnowledgeBaseItem extends KnowledgeBaseItem {
  base64File: string;
}

export default function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState<TabType>("Quran");
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

 
 
  const [knowledgeBaseData, setKnowledgeBaseData] = useState<KnowledgeBaseEntry>({
    courseName: '',
    subjectTitle: '',
    uploadedFormat: '',
    uploadedFile: '',
    status: 'Active',
    createdDate: new Date().toISOString(),
    createdBy: 'admin',
    updatedBy: 'admin',
    updatedDate: new Date().toISOString(),
  });
  
   // Empty dependency array ensures it runs once on mount

  const handleViewClick = (base64File : any) => {
    setPdfUrl(base64File); // set your base64 string here
    setShowPdf(true); // open modal
  };
  const [knowledgeBaseList, setKnowledgeBaseList] = useState<ProcessedKnowledgeBaseItem[]>([]);

  useEffect(() => {
  const token = localStorage.getItem('AdminAuthToken');
  if (token) {
    fetchKnowledgeBaseList(token); // Or call the function that performs the GET request
  } else {
    alert("No auth token found.");
  }
}, []);
const fetchKnowledgeBaseList = async (token: string) => {
  try {
    const response = await fetch('http://localhost:5001/knowledgebase/list',
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
    const result = await response.json();
     console.log(result);
    if (result.status === 'success') {
      const processedData = result.data.map((item: KnowledgeBaseItem) => ({
        ...item,
        base64File: `data:application/octet-stream;base64,${arrayBufferToBase64(item.uploadedFile.data)}`
      }));

      setKnowledgeBaseList(processedData);
    } else {
      console.error('Failed to fetch knowledge base list');
    }
  } catch (error) {
    console.error('Error fetching knowledge base list:', error);
  }
};

// Helper function to convert array buffer to Base64
const arrayBufferToBase64 = (buffer: number[]) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const pdfFiles = knowledgeBaseList.filter(
  (item) => item.uploadedFormat.toLowerCase() === 'pdf' && item.courseName === activeTab
);

const videoFiles = knowledgeBaseList.filter(
  (item) => item.uploadedFormat.toLowerCase() === 'video' && item.courseName === activeTab
);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setKnowledgeBaseData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1]; // get base64 after comma
        setKnowledgeBaseData(prev => ({
          ...prev,
          uploadedFile: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); 
  
    console.log('Knowledge Base Data:', knowledgeBaseData);
    console.log('Save button clicked!');
  
    try {
      console.log('Sending API request...');
  
      const response = await fetch('http://localhost:5001/knowledgebase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(knowledgeBaseData),
      });
  
      console.log('Response Status:', response.status);
  
      if (response.ok) {
        console.log('Successfully uploaded');
        
        // Reset the form data
        setKnowledgeBaseData({
          courseName: '',
          subjectTitle: '',
          uploadedFormat: '',
          uploadedFile: '',
          status: 'Active',
          createdDate: new Date().toISOString(),
          createdBy: 'admin',
          updatedBy: 'admin',
          updatedDate: new Date().toISOString(),
        });
  
        // Hide the modals
        setShowModal(false);
        setShowUploadModal(false);
      } else {
        console.error('Upload failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  
  const [pdfBlobUrl, setPdfBlobUrl] = useState('');

  useEffect(() => {
    if (pdfUrl) {
      let blobUrl;
      try {
        let base64String = pdfUrl;
  
        if (pdfUrl.startsWith('data:')) {
          // If data URL, remove the prefix
          base64String = pdfUrl.split(',')[1];
        }
  
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        blobUrl = URL.createObjectURL(blob);
        setPdfBlobUrl(blobUrl);
  
      } catch (error) {
        console.error('Invalid base64 PDF', error);
      }
    }
  
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfUrl]);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    if (selectedVideo?.uploadedFile?.data) {
      // Convert Buffer to base64 if it's a Buffer
      const base64String = Buffer.from(selectedVideo.uploadedFile.data).toString('base64');

      try {
        const byteCharacters = atob(base64String); // Decode base64
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
          const slice = byteCharacters.slice(offset, offset + 1024);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          byteArrays.push(new Uint8Array(byteNumbers));
        }

        const blob = new Blob(byteArrays, { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);

        setVideoUrl(url);

        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (error) {
        console.error('Error decoding base64:', error);
      }
    }
  }, [selectedVideo]);
  
  
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
            {pdfFiles.map((pdf) => (
              <div
                key={pdf._id}
                className="border-2 rounded-lg p-4 flex flex-col items-center text-center shadow-sm h-48 justify-between w-full"
              >
                <FileText className="h-12 w-12 text-red-600 hover:text-red-700 transition-colors duration-200" />
                <div className="flex flex-col flex-1 justify-between">
                  <p className="text-sm font-semibold mt-2">{pdf.subjectTitle}</p>
                  <p className="text-xs text-gray-500 mb-2">{new Date(pdf.createdDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  className="text-xs px-3 py-1 bg-[#002b4d] text-white rounded-md"
                  onClick={() => handleViewClick(pdf.base64File)}
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
              {/* Render PDF with react-pdf-js */}
              <div className="w-full h-[500px]">
        <iframe
          src={pdfBlobUrl}
          width="100%"
          height="100%"
          title="PDF Viewer"
        />
      </div>
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
        <label htmlFor= 'hvvuhhvhv' className="block text-sm font-medium text-gray-700 mb-1">
          Course Name
        </label>
        <input
          type="text"
          name="courseName"
          value={knowledgeBaseData.courseName}
          onChange={handleInputChange}
          placeholder="Quran"
          className="w-full border rounded-xl px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#002b4d]"
        />
      </div>

      {/* Subject Title */}
      <div className="mb-4">
        <label htmlFor= 'hvvujbvujh' className="block text-sm font-medium text-gray-700 mb-1">
          Subject Title
        </label>
        <input
          type="text"
          name="subjectTitle"
          value={knowledgeBaseData.subjectTitle}
          onChange={handleInputChange}
          placeholder="Mercy"
          className="w-full border rounded-xl px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#002b4d]"
        />
      </div>

      {/* Upload Format */}
      <div className="mb-4">
        <label htmlFor= 'hvvuhuh' className="block text-sm font-medium text-gray-700 mb-1">
          Upload Format
        </label>
        <select
          name="uploadedFormat"
          value={knowledgeBaseData.uploadedFormat}
          onChange={handleInputChange}
          className="w-full border rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#002b4d]"
        >
          <option value="Pdf">Pdf</option>
          <option value="Video">Video</option>
        </select>
      </div>

      {/* Uploaded By */}
      <div className="mb-4">
        <label htmlFor= 'hvvudh' className="block text-sm font-medium text-gray-700 mb-1">
          Uploaded By
        </label>
        <input
          type="text"
          value="Admin"
          disabled
          className="w-full border rounded-xl px-4 py-2 text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
        />
      </div>

      {/* Upload File */}
      <div className="mb-6">
        <label  htmlFor= 'hvvuh' className="block text-sm font-medium text-gray-700 mb-1">
          Upload File
        </label>
        <div className="w-full h-40 border-2 border-gray-300 rounded-xl flex items-center justify-center relative bg-gray-50">
          <input
            type="file"
            accept=".pdf,.mp4" // Accept pdf or video
            onChange={handleFileChange}
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
        <button
          className="px-6 py-2 bg-[#002b4d] text-white rounded-xl hover:bg-[#001f36] transition"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

        </div>

        {/* Videos */}
        <div className="p-4 mt-4 bg-white rounded-lg overflow-y-auto h-[300px] w-full scrollbar-none">
          <div className="flex gap-4 flex-wrap mt-4">
            {/* Add Video Card */}
            <button
              className="cursor-pointer"
              onClick={() => setShowUploadModal(true)}
            >
              <AddCards isVideo onClicks={() => setShowUploadModal(true)} />
            </button>

            {/* Video Cards */}
            {videoFiles.map((vid) => (
              <div
              key={vid._id}
              className="w-64 h-64 border-2 rounded-lg overflow-hidden shadow-sm flex flex-col items-center justify-center"
            >
              <div className="relative flex items-center justify-center">
                {/* Video icon */}
                <Video className="h-12 w-12 text-blue-500 hover:text-blue-700 transition-colors duration-200" />
              </div>
                <div className="p-2 text-xs text-center">
                  <h4 className="font-semibold mb-1">
                    {vid.subjectTitle} 
                  </h4>
                  <p>
                   on {new Date(vid.createdDate).toLocaleDateString()}

                  </p>
                  <button
                    className="mt-2 px-3 py-1 bg-[#002b4d] text-white rounded-md"
                    onClick={() => setSelectedVideo({
                      title: vid.courseName,  // Assuming vid has a title property
                      uploadedFile: vid.uploadedFile,  // Pass the uploadedFile as part of the Video object
                    })}
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
        <label htmlFor= 'hvvuhhvhv' className="block text-sm font-medium text-gray-700 mb-1">
          Course Name
        </label>
        <input
          type="text"
          name="courseName"
          value={knowledgeBaseData.courseName}
          onChange={handleInputChange}
          placeholder="Quran"
          className="w-full border rounded-xl px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#002b4d]"
        />
      </div>

      {/* Subject Title */}
      <div className="mb-4">
        <label htmlFor= 'hvvujbvujh' className="block text-sm font-medium text-gray-700 mb-1">
          Subject Title
        </label>
        <input
          type="text"
          name="subjectTitle"
          value={knowledgeBaseData.subjectTitle}
          onChange={handleInputChange}
          placeholder="Mercy"
          className="w-full border rounded-xl px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#002b4d]"
        />
      </div>

      {/* Upload Format */}
      <div className="mb-4">
        <label htmlFor= 'hvvuhuh' className="block text-sm font-medium text-gray-700 mb-1">
          Upload Format
        </label>
        <select
          name="uploadedFormat"
          value={knowledgeBaseData.uploadedFormat}
          onChange={handleInputChange}
          className="w-full border rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#002b4d]"
        >
          <option value="Pdf">Pdf</option>
          <option value="Video">Video</option>
        </select>
      </div>

      {/* Uploaded By */}
      <div className="mb-4">
        <label htmlFor= 'hvvudh' className="block text-sm font-medium text-gray-700 mb-1">
          Uploaded By
        </label>
        <input
          type="text"
          value="Admin"
          disabled
          className="w-full border rounded-xl px-4 py-2 text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
        />
      </div>

      {/* Upload File */}
      <div className="mb-6">
        <label  htmlFor= 'hvvuh' className="block text-sm font-medium text-gray-700 mb-1">
          Upload File
        </label>
        <div className="w-full h-40 border-2 border-gray-300 rounded-xl flex items-center justify-center relative bg-gray-50">
          <input
            type="file"
            accept=".pdf,.mp4" // Accept pdf or video
            onChange={handleFileChange}
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
        <button
          className="px-6 py-2 bg-[#002b4d] text-white rounded-xl hover:bg-[#001f36] transition"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

          {/* Video Playback Modal */}
          {selectedVideo && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-xl p-6 max-w-3xl  h-[600px] w-full shadow-lg relative">
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
                >
                  &times;
                </button>
                <h3 className="text-lg font-semibold text-[#002b4d] mb-4">
                Course
                </h3>
                <video
                 src={videoUrl}
                  controls
                   className="w-[800px] h-[500px] rounded-lg"
                  autoPlay
                  >
                    <track
                 src="/assets/captions-en.vtt"
                    kind="captions"
                     srcLang="en"
                  label="English"
                     default
                     />
                  </video>    
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
  }: Readonly<{
    isVideo?: boolean;
    onClick?: () => void;
  }>) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center justify-center border-2 border-gray-300 rounded-lg cursor-pointer ${
          isVideo ? "w-64 h-48" : "h-48 w-full"
        }`}
      >
        <div className="flex items-center justify-center w-12 h-12 bg-[#002c5f] rounded-full">
          <Plus className="text-white" size={24} />
        </div>
      </button>
    );
  }

  function AddCards({
    isVideo = false,
    onClicks,
  }: Readonly<{
    isVideo?: boolean;
    onClicks?: () => void;
  }>) {
    return (
      <div className="w-72 h-64 border-2 border-gray-300 rounded-lg flex items-center justify-center shadow-sm">
        <button
          className="flex items-center justify-center w-12 h-12 bg-[#002c5f] rounded-full cursor-pointer"
          onClick={onClicks}
        >
          <Plus className="text-white" size={24} />
        </button>
      </div>
    );
  }
}
