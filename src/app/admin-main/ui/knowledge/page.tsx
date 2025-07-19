"use client";

import { useEffect, useState } from "react";
import { Video, Search } from "lucide-react";
import BaseLayout4 from "@/components/BaseLayout4";
import SupervisorHeader from "@/app/supervisor/components/supervisorHeader";
import { MdTune } from "react-icons/md";
const tabs = ["Quran", "Arabic", "Islamic Studies"] as const;
type TabType = (typeof tabs)[number];
type PDF = { title: string; type: string };
type Video = {
  title: string;
  uploadedFile: {
    data: number[]; // or use `Buffer` if that's what you're using
  };
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
  uploadedFile: string;
  status: string;
  createdDate: string;
  createdBy: string;
  updatedBy: string;
  updatedDate: string;
}
interface KnowledgeBaseItem {
  _id: string;
  courseName: string;
  base64File: string;
  subjectTitle: string;
  uploadedFormat: string;
  uploadedFile: {
    type: string;
    data: number[];
    base64?: string;
  };
  status: string;
  createdDate: string;
  createdBy: string;
  __v: number;
}
interface Course {
  courseId: string;
  courseTitle: string;
}
interface CoursesListResponse {
  totalCount: number;
  courses: CourseAPIResponseItem[];
}
interface CourseAPIResponseItem {
  _id: string;
  courseName: string;
}
export default function KnowledgeBase() {
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClass, setFilteredClass] = useState<KnowledgeBaseItem[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filterCourse, setFilterCourse] = useState("");
  const [dashboardRead, setdashboardRead] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfFiles, setPdfFiles] = useState<KnowledgeBaseItem[]>([]);
  const [videoFiles, setVideoFiles] = useState<KnowledgeBaseItem[]>([]);
  const [searchQuery1, setSearchQuery1] = useState("");
  const [filteredClass1, setFilteredClass1] = useState<KnowledgeBaseItem[]>([]);
  const [showFilter1, setShowFilter1] = useState(false);
  const [filterCourse1, setFilterCourse1] = useState("");
  const [knowledgeBaseData, setKnowledgeBaseData] =
    useState<KnowledgeBaseEntry>({
      courseName: "",
      subjectTitle: "",
      uploadedFormat: "",
      uploadedFile: "",
      status: "Active",
      createdDate: new Date().toISOString(),
      createdBy: "admin",
      updatedBy: "admin",
      updatedDate: new Date().toISOString(),
    });

  // Empty dependency array ensures it runs once on mount
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("AdminAuthToken")
        : null;

    if (!token) {
      console.error("❌ AdminAuthToken not found");
      return;
    }
    if (token) {
      fetchKnowledgeBaseList(token);
      fetchCourses(token);
    } else {
      console.log("No auth token found.");
    }
    if (typeof window !== "undefined") {
      const roleAccessRaw = localStorage.getItem("AdminRolePermission");

      if (roleAccessRaw) {
        try {
          const roleAccess = JSON.parse(roleAccessRaw);
          const hasRead = roleAccess?.courses?.write ?? false;
          console.log(hasRead);
          setdashboardRead(hasRead);
        } catch (error) {
          console.error("Invalid JSON in AdminRolePermission:", error);
        }
      }
    }
  }, []);
  const fetchCourses = async (token: string) => {
    console.log("📥 Fetching courses...");
    try {
      const response = await fetch("https://api.blackstoneinfomaticstech.com/courses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("✅ Response received:", response);

      if (!response.ok) {
        throw new Error(
          `❌ Failed to fetch courses — Status: ${response.status}`
        );
      }

      const data: CoursesListResponse = await response.json();
      console.log("📦 Parsed JSON:", data);

      if (!data.courses || !Array.isArray(data.courses)) {
        throw new Error(
          "❌ Invalid data format: `courses` field missing or not an array"
        );
      }

      const transformedCourses: Course[] = data.courses
        .map((courseItem) => {
          if (!courseItem.courseName) {
            console.warn("⚠️ Missing `course` object in item:", courseItem);
            return null;
          }
          return {
            courseId: courseItem._id,
            courseTitle: courseItem.courseName,
          };
        })
        .filter(Boolean) as Course[];

      console.log("✅ Transformed Courses:", transformedCourses);
      setCourses(transformedCourses);
    } catch (err) {
      console.error("❌ Error in fetchCourses:", err);
    }
  };
  const fetchKnowledgeBaseList = async (token: string) => {
    try {
      const response = await fetch(
        "https://api.blackstoneinfomaticstech.com/knowledgebase/list",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        const pdfs: KnowledgeBaseItem[] = [];
        const videos: KnowledgeBaseItem[] = [];

        result.data.forEach((item: KnowledgeBaseItem) => {
          const fileBuffer = item.uploadedFile?.data;

          if (
            !fileBuffer ||
            !Array.isArray(fileBuffer) ||
            fileBuffer.length === 0
          ) {
            console.warn("Skipping item with invalid file buffer", item);
            return;
          }

          const base64File = `data:application/pdf;base64,${arrayBufferToBase64(
            fileBuffer
          )}`;
          const enrichedItem = { ...item, base64File };

          if (item.uploadedFormat.toLowerCase() === "pdf") {
            pdfs.push(enrichedItem);
          } else if (item.uploadedFormat.toLowerCase() === "video") {
            videos.push(enrichedItem);
          }
        });

        setPdfFiles(pdfs);
        setVideoFiles(videos);
      } else {
        console.error("❌ Failed to fetch knowledge base list");
      }
    } catch (error) {
      console.error("❌ Error fetching knowledge base list:", error);
    }
  };
  const arrayBufferToBase64 = (buffer: number[]): string => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setKnowledgeBaseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(",")[1]; // get base64 after comma
        setKnowledgeBaseData((prev) => ({
          ...prev,
          uploadedFile: base64String,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Knowledge Base Data:", knowledgeBaseData);
    console.log("Save button clicked!");

    try {
      console.log("Sending API request...");
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("AdminAuthToken")
          : null;

      if (!token) {
        console.error("❌ AdminAuthToken not found");
        return;
      }
      const response = await fetch("https://api.blackstoneinfomaticstech.com/knowledgebase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(knowledgeBaseData),
      });

      console.log("Response Status:", response.status);

      if (response.ok) {
        console.log("Successfully uploaded");

        // Reset the form data
        setKnowledgeBaseData({
          courseName: "",
          subjectTitle: "",
          uploadedFormat: "",
          uploadedFile: "",
          status: "Active",
          createdDate: new Date().toISOString(),
          createdBy: "admin",
          updatedBy: "admin",
          updatedDate: new Date().toISOString(),
        });

        // Hide the modals
        setShowModal(false);
        setShowUploadModal(false);
        fetchKnowledgeBaseList(token);
      } else {
        console.error("Upload failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  useEffect(() => {
    const query = searchQuery.toLowerCase();

    const filtered = pdfFiles.filter((cls) => {
      const courseName = cls.courseName?.toLowerCase() ?? "";

      const matchesSearch = courseName.includes(query);
      const matchesCourse = filterCourse
        ? courseName === filterCourse.toLowerCase()
        : true;

      return matchesSearch && matchesCourse;
    });

    setFilteredClass(filtered);
    setCurrentPage(1);
  }, [searchQuery, filterCourse, pdfFiles]);

  useEffect(() => {
    const query = searchQuery1.toLowerCase();

    const filtered = videoFiles.filter((cls) => {
      const courseName = cls.courseName?.toLowerCase() ?? "";

      const matchesSearch = courseName.includes(query);
      const matchesCourse = filterCourse1
        ? courseName === filterCourse1.toLowerCase()
        : true;

      return matchesSearch && matchesCourse;
    });

    setFilteredClass1(filtered);
  }, [searchQuery1, filterCourse1, videoFiles]);

  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    if (selectedVideo?.uploadedFile?.data) {
      // Convert Buffer to base64 if it's a Buffer
      const base64String = Buffer.from(
        selectedVideo.uploadedFile.data
      ).toString("base64");

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

        const blob = new Blob(byteArrays, { type: "video/mp4" });
        const url = URL.createObjectURL(blob);

        setVideoUrl(url);

        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (error) {
        console.error("Error decoding base64:", error);
      }
    }
  }, [selectedVideo]);
  const openPdfBlob = (base64: string) => {
    const byteCharacters = atob(base64);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
  };

  const itemsPerPage = 6;

  const getPaginatedCourses = () => {
    if (currentPage === 1) {
      return filteredClass.slice(0, itemsPerPage - 1);
    } else {
      const start = (currentPage - 1) * itemsPerPage - 1;
      return filteredClass.slice(start, start + itemsPerPage);
    }
  };

  const paginatedCourses = getPaginatedCourses();
  const totalItems = filteredClass.length + 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <BaseLayout4>
      <SupervisorHeader currentSection="knowledge base" />
      <div className="w-full min-h-100vh mx-auto  sm:px-1 lg:px-2">
        <div className="relative w-full bg-[#F5F5F5] dark:bg-[#3B3B3B] rounded-xl">
          {/* Search + Filter + Count Bar */}

          {/* Top Filter/Search/Info Bar */}
          <div className="flex flex-col md:flex-row items-start dark:bg-[#343434] bg-[#FAFAFB] rounded-xl md:items-center px-4 relative gap-4 md:gap-0">
            <div className="flex-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300 justify-start py-3 px-4">
              <Search className="w-5 h-5 text-gray-400 dark:text-gray-300" />
              <input
                type="text"
                placeholder="Search by Course Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm outline-none bg-transparent placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-100"
              />
            </div>

            <button
              onClick={() => setShowFilter(true)}
              className="flex-1 flex items-center gap-2 text-sm text-gray-400 dark:text-gray-300 cursor-pointer justify-start border-y-0 border-l-2 border-r-2 border-gray-300 dark:border-[#868585] h-full md:h-[40px] px-4"
            >
              <MdTune className="w-5 h-5" />
              <span>Filter</span>
            </button>

            <div className="flex-1 flex items-center text-sm text-gray-500 dark:text-gray-300 py-3 px-4 justify-start">
              <span>
                Showing {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} entries
              </span>
            </div>
          </div>

          {/* PDF Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4">
            {/* Add New Card */}
            {currentPage === 1 && (
              <div className="bg-white dark:bg-[#343434] rounded-xl p-6 border border-gray-200 dark:border-[#555] flex flex-col items-center hover:border-[#576CBC] text-center min-h-[12rem] transition-all duration-300 shadow-md hover:shadow-lg w-full">
                <div className="flex flex-col items-center">
                  <img
                    src="/assets/images/1321314985.svg"
                    alt="Add"
                    className="w-16 h-17 object-contain dark:invert dark:brightness-300"
                  />
                </div>
                <button
                  className="mt-5 px-6 py-1.5 bg-[#576CBC] text-white text-xs sm:text-[11px] justify-end font-medium rounded-md"
                  onClick={() => setShowModal(true)}
                >
                  Add New
                </button>
              </div>
            )}

            {/* PDF Cards */}
            {paginatedCourses.map((pdf, index) => (
              <div
                key={pdf._id || `video-${index}`}
                className="bg-white dark:bg-[#343434] rounded-xl p-6 border border-gray-200 dark:border-[#555] flex flex-col items-center hover:border-[#576CBC] text-center min-h-[12rem] transition-all duration-300 shadow-md hover:shadow-lg w-full"
              >
                <div className="flex flex-col items-center">
                  <img
                    src="/assets/images/text_3d_pdf.svg"
                    alt="PDF"
                    className="w-12 h-12 object-contain"
                  />
                  <p className="font-semibold text-sm mt-2 text-gray-800 dark:text-gray-100">
                    {pdf.subjectTitle}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    View Details
                  </span>
                </div>
                {pdf.base64File && (
                  <button
                    onClick={() => openPdfBlob(pdf.base64File.split(",")[1])}
                    className="mt-2 px-6 py-1.5 bg-[#576CBC] text-white text-xs font-medium rounded-md"
                  >
                    View File
                  </button>
                )}
              </div>
            ))}
          </div>
          {showFilter && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-sm rounded-xl shadow-xl p-6 relative space-y-5 mx-3 sm:mx-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-[#010E30] dark:text-white">
                    Filter by
                  </h3>
                  <button
                    className="text-red-500 hover:text-gray-700 dark:hover:text-white text-sm"
                    onClick={() => setShowFilter(false)}
                  >
                    ✕
                  </button>
                </div>

                {/* Course */}
                <div>
                  <label
                    htmlFor="jhvch"
                    className="text-sm text-[#010E30] dark:text-gray-300 mb-1 block"
                  >
                    Course
                  </label>
                  <select
                    value={filterCourse}
                    onChange={(e) => setFilterCourse(e.target.value)}
                    className="w-full border border-gray-300 dark:border-[#444] px-3 py-2 rounded-md text-sm bg-white dark:bg-[#2D2D2D] text-[#010E30CC]/80 dark:text-white"
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course.courseId} value={course.courseTitle}>
                        {course.courseTitle}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-7 pt-2 justify-center ">
                  <button
                    onClick={() => {
                      setFilterCourse("");
                      setShowFilter(false);
                    }}
                    className="px-4 py-1 border border-[#576CBC] rounded text-[#576CBC] hover:bg-gray-100 transition "
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowFilter(false)}
                    className="px-5 py-1 bg-[#576CBC] text-white rounded hover:bg-blue-700 transition"
                  >
                    Show {filteredClass.length} results
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-[#1D1D1D] p-4 md:p-6 rounded-xl w-full max-w-md shadow-xl text-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-[#002b4d] dark:text-white">
                    Knowledge Base File Upload
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl"
                  >
                    &times;
                  </button>
                </div>

                {/* Course Name */}
                <div className="mb-4">
                  <label
                    htmlFor="courseName"
                    className="block font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Course Name
                  </label>
                  <select
                    name="courseName"
                    value={knowledgeBaseData.courseName}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-4 py-2 bg-white dark:bg-[#343434] dark:border-[#5C5C5C] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#002b4d]"
                  >
                    <option value="" disabled>
                      Select a course
                    </option>
                    {courses.map((course) => (
                      <option key={course.courseId} value={course.courseTitle}>
                        {course.courseTitle}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject Title */}
                <div className="mb-4">
                  <label
                    htmlFor="hvyvuy"
                    className="block font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Subject Title
                  </label>
                  <input
                    type="text"
                    name="subjectTitle"
                    value={knowledgeBaseData.subjectTitle}
                    onChange={handleInputChange}
                    placeholder="Mercy"
                    className="w-full border rounded-md px-4 py-2 bg-white dark:bg-[#343434] dark:border-[#5C5C5C] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#002b4d]"
                  />
                </div>

                {/* Upload Format */}
                <div className="mb-4">
                  <label
                    htmlFor="uyvuyv"
                    className="block font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Upload Format
                  </label>
                  <select
                    name="uploadedFormat"
                    value={knowledgeBaseData.uploadedFormat}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-4 py-2 bg-white dark:bg-[#343434] dark:border-[#5C5C5C] text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#002b4d]"
                  >
                    <option value="">Select Format</option>
                    <option value="Pdf">Pdf</option>
                    <option value="Video">Video</option>
                  </select>
                </div>

                {/* Uploaded By */}
                <div className="mb-4">
                  <label
                    htmlFor="uyvyvf"
                    className="block font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Uploaded By
                  </label>
                  <input
                    type="text"
                    value="Admin"
                    disabled
                    className="w-full border rounded-md px-4 py-2 text-gray-400 bg-gray-100 dark:bg-[#343434] dark:border-[#5C5C5C] dark:text-gray-500 cursor-not-allowed"
                  />
                </div>

                {/* Upload File */}
                <div className="mb-6">
                  <label
                    htmlFor="uyfuy"
                    className="block font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Upload File
                  </label>
                  <div className="w-full h-20 border-2  border-gray-300  rounded-md bg-gray-50 dark:bg-[#343434] dark:border-[#5C5C5C] flex items-center justify-center relative">
                    <input
                      type="file"
                      accept=".pdf,.mp4"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center pointer-events-none">
                      <div className="bg-[#576CBC] text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-normal">
                        +
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                  <button
                    className="px-3 py-1 border border-[#576CBC] text-[#576CBC] hover:border-[#4459A9] rounded hover:bg-[#E6E9F5] dark:hover:bg-[#333]"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-1 bg-[#576CBC] text-white rounded hover:bg-[#4459A9]"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-wrap justify-end items-center gap-2 mt-3">
          {/* Prev Button */}
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 rounded-md border flex items-center justify-center bg-[#F5F5F2] text-sm disabled:opacity-50 hover:bg-gray-300 dark:bg-[#565656] dark:hover:bg-[#939393]"
          >
            &lt;
          </button>

          {/* Page Numbers with Ellipsis */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (page) =>
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
            )
            .map((page, idx, arr) => {
              const prevPage = arr[idx - 1];
              return (
                <>
                  {Boolean(prevPage && page - prevPage > 1) && (
                    <span className="px-2 text-sm text-gray-500 dark:text-gray-400">
                      …
                    </span>
                  )}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-md border flex items-center justify-center text-sm transition ${
                      page === currentPage
                        ? "bg-[#FAFAFB] text-[#203F78] border-[#203F78] dark:bg-[#939393]"
                        : "bg-white dark:bg-[#565656] text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#939393]"
                    }`}
                  >
                    {page}
                  </button>
                </>
              );
            })}

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 rounded-md border flex items-center justify-center text-sm bg-[#F5F5F2]  disabled:opacity-50 hover:bg-gray-300 dark:bg-[#565656] dark:hover:bg-[#939393]"
          >
            &gt;
          </button>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[#002b4d] dark:text-white">
            Recorded Classes
          </h3>

          {/* Videos */}
          <div className="mt-4 bg-[#F5F5F5] dark:bg-[#3B3B3B] rounded-xl overflow-y-auto h-[45vh] w-full scrollbar-none">
            {/* Top bar (search + filter) */}
            <div className="flex flex-col md:flex-row items-start dark:bg-[#343434] bg-[#FAFAFB] rounded-xl md:items-center px-4 gap-4">
              <div className="flex-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300 justify-start py-3 px-4">
                <Search className="w-5 h-5 text-gray-400 dark:text-gray-300" />
                <input
                  type="text"
                  placeholder="Search by Course Name"
                  value={searchQuery1}
                  onChange={(e) => setSearchQuery1(e.target.value)}
                  className="w-full text-sm outline-none bg-transparent placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-100"
                />
              </div>

              <button
                onClick={() => setShowFilter1(true)}
                className="flex-1 flex items-center gap-2 text-sm text-gray-400 dark:text-gray-300 cursor-pointer justify-start border-y-0 border-l-2 border-r-2 border-gray-300 dark:border-[#868585] h-full md:h-[40px] px-4"
              >
                <MdTune className="w-5 h-5" />
                <span>Filter</span>
              </button>

              <div className="flex-1 flex items-center text-sm text-gray-500 dark:text-gray-300 py-3 px-4 justify-start">
                <span>Showing {videoFiles.length} entries</span>
              </div>
            </div>

            {/* Scrollable row of cards */}
            <div className="flex flex-col lg:flex-row w-full gap-4 px-5 py-4 overflow-x-auto">
              {/* Add New Card */}
              <div className="flex-shrink-0 w-[80vw] sm:w-[50vw] md:w-[40vw] lg:w-[30vw] xl:w-[25vw] h-[35vh] bg-white dark:bg-[#343434] rounded-xl border border-gray-200 dark:border-[#555] flex flex-col items-center justify-center hover:border-[#576CBC] text-center transition-all duration-300 shadow-md hover:shadow-lg">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center mb-4">
                    <img
                      src="/assets/images/Vector.svg"
                      alt="Add"
                      className="w-20 h-20 object-contain dark:invert dark:brightness-500"
                    />
                  </div>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    disabled={!dashboardRead}
                    className="bg-[#576CBC] text-white px-6 py-1.5 rounded-md text-sm"
                  >
                    Add New
                  </button>
                </div>
              </div>

              {/* Video Cards */}
              <div className="w-full overflow-x-auto scrollbar-none">
                <div className="grid grid-flow-col auto-cols-[80vw] sm:auto-cols-[50vw] md:auto-cols-[40vw] lg:auto-cols-[30vw] xl:auto-cols-[25vw] gap-4 ">
                  {filteredClass1.map((vid, index) => (
                    <button
                      onClick={() =>
                        setSelectedVideo({
                          title: vid.courseName,
                          uploadedFile: vid.uploadedFile,
                        })
                      }
                      key={vid._id || `video-${index}`}
                      className="h-[35vh] bg-white dark:bg-[#343434] rounded-2xl border-2 border-gray-200 dark:border-[#555]  shadow-sm  hover:border-[#576CBC] text-center transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="relative h-45 sm:h-40 w-full overflow-hidden">
                        <img
                          src="/assets/images/profilePicture.svg"
                          alt="Video Thumbnail"
                          className="w-full  object-cover rounded-t-2xl"
                        />
                      </div>

                      {/* Info */}
                      <div className="p-3 text-center text-xs h-[calc(100%-10rem)] flex flex-col">
                        <div>
                          <h4 className="font-semibold text-sm sm:text-xs text-[#002b4d] dark:text-gray-300">
                            {vid.courseName} | {vid.subjectTitle}
                          </h4>
                          <p className="text-gray-600 text-xs sm:text-[10px] dark:text-gray-300 mt-1">
                            {new Date(vid.createdDate).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-gray-500 dark:text-gray-300 text-[11px] sm:text-[10px] mt-1 leading-snug">
                          Note: Recorded classes will remain available for a
                          maximum of three months from the class date.
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {showFilter1 && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-sm rounded-xl shadow-xl p-6 relative space-y-5 mx-3 sm:mx-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-[#010E30] dark:text-white">
                      Filter by
                    </h3>
                    <button
                      className="text-red-500 hover:text-gray-700 dark:hover:text-white text-sm"
                      onClick={() => setShowFilter1(false)}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Course */}
                  <div>
                    <label
                      htmlFor="jhvch"
                      className="text-sm text-[#010E30] dark:text-gray-300 mb-1 block"
                    >
                      Course
                    </label>
                    <select
                      value={filterCourse1}
                      onChange={(e) => setFilterCourse1(e.target.value)}
                      className="w-full border border-gray-300 dark:border-[#444] px-3 py-2 rounded-md text-sm bg-white dark:bg-[#2D2D2D] text-[#010E30CC]/80 dark:text-white"
                    >
                      <option value="">Select Course</option>
                      {courses.map((course) => (
                        <option
                          key={course.courseId}
                          value={course.courseTitle}
                        >
                          {course.courseTitle}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-7 pt-2 justify-center ">
                    <button
                      onClick={() => {
                        setFilterCourse1("");
                        setShowFilter1(false);
                      }}
                      className="px-4 py-1 border border-[#576CBC] rounded text-[#576CBC] hover:bg-gray-100 transition "
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setShowFilter1(false)}
                      className="px-5 py-1 bg-[#576CBC] text-white rounded hover:bg-blue-700 transition"
                    >
                      Show {filteredClass1.length} results
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
              <div className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-[#1D1D1D] p-4 md:p-6 rounded-xl w-full max-w-md shadow-xl text-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-[#002b4d] dark:text-white">
                      Knowledge Base File Upload
                    </h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Course Name */}
                  <div className="mb-4">
                    <label
                      htmlFor="courseName"
                      className="block font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      Course Name
                    </label>
                    <select
                      name="courseName"
                      value={knowledgeBaseData.courseName}
                      onChange={handleInputChange}
                      className="w-full border rounded-md px-4 py-2 bg-white dark:bg-[#343434] dark:border-[#5C5C5C] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#002b4d]"
                    >
                      <option value="" disabled>
                        Select a course
                      </option>
                      {courses.map((course) => (
                        <option
                          key={course.courseId}
                          value={course.courseTitle}
                        >
                          {course.courseTitle}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subject Title */}
                  <div className="mb-4">
                    <label
                      htmlFor="hvyvuy"
                      className="block font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      Subject Title
                    </label>
                    <input
                      type="text"
                      name="subjectTitle"
                      value={knowledgeBaseData.subjectTitle}
                      onChange={handleInputChange}
                      placeholder="Mercy"
                      className="w-full border rounded-md px-4 py-2 bg-white dark:bg-[#343434] dark:border-[#5C5C5C] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#002b4d]"
                    />
                  </div>

                  {/* Upload Format */}
                  <div className="mb-4">
                    <label
                      htmlFor="uyvuyv"
                      className="block font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      Upload Format
                    </label>
                    <select
                      name="uploadedFormat"
                      value={knowledgeBaseData.uploadedFormat}
                      onChange={handleInputChange}
                      className="w-full border rounded-md px-4 py-2 bg-white dark:bg-[#343434] dark:border-[#5C5C5C] text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#002b4d]"
                    >
                      <option value="">Select Format</option>
                      <option value="Pdf">Pdf</option>
                      <option value="Video">Video</option>
                    </select>
                  </div>

                  {/* Uploaded By */}
                  <div className="mb-4">
                    <label
                      htmlFor="uyvyvf"
                      className="block font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      Uploaded By
                    </label>
                    <input
                      type="text"
                      value="Admin"
                      disabled
                      className="w-full border rounded-md px-4 py-2 text-gray-400 bg-gray-100 dark:bg-[#343434] dark:border-[#5C5C5C] dark:text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  {/* Upload File */}
                  <div className="mb-6">
                    <label
                      htmlFor="uyfuy"
                      className="block font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      Upload File
                    </label>
                    <div className="w-full h-20 border-2  border-gray-300  rounded-md bg-gray-50 dark:bg-[#343434] dark:border-[#5C5C5C] flex items-center justify-center relative">
                      <input
                        type="file"
                        accept=".pdf,.mp4"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center pointer-events-none">
                        <div className="bg-[#576CBC] text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-normal">
                          +
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4">
                    <button
                      className="px-3 py-1 border border-[#576CBC] text-[#576CBC] hover:border-[#4459A9] rounded hover:bg-[#E6E9F5] dark:hover:bg-[#333]"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-1 bg-[#576CBC] text-white rounded hover:bg-[#4459A9]"
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
                <div className="bg-white rounded-xl p-6 max-w-3xl dark:bg-[#1D1D1D] h-[600px] w-full shadow-lg relative">
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="absolute top-2 right-2 text-gray-700 hover:text-black dark:hover:text-blue-900 text-xl"
                  >
                    &times;
                  </button>
                  <h3 className="text-lg font-semibold text-[#002b4d] dark:text-[#ffff] mb-4">
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
      </div>
    </BaseLayout4>
  );
}
