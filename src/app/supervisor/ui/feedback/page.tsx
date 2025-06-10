"use client";

import React, { useEffect, useState } from "react";
import BaseLayout3 from "@/components/BaseLayout3";
import SupervisorHeader from "../../components/supervisorHeader";
import { FaStar } from "react-icons/fa";

import { Search } from "lucide-react";
import Pagination from "@/components/Pagination";
import { MdTune } from "react-icons/md";
import axios from "axios";
interface FlattenedFeedbackItem {
  _id: string;
  Review: string;
  Teacher: string;
  class: string;
  Feedback: string;
  level: number;
}

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

interface Course {
  courseId: string;
  courseName: string;
}

interface StudentsRating {
  classUnderstanding: number;
  engagement: number;
  homeworkCompletion: number;
}

interface TeacherRatings {
  listeningAbility: number;
  readingAbility: number;
  overallPerformance: number;
}

interface RawFeedbackItem {
  _id: string;
  student: Student;
  teacher: Teacher;
  course: Course;
  studentsRating?: StudentsRating;
  teacherRatings?: TeacherRatings;
  classDay: string;
  preferedTeacher?: string;
  sessionId?: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  feedbackmessage: string;
  createdDate: string;
  createdBy: string;
  lastUpdatedDate: string;
  lastUpdatedBy: string;
}

interface FeedbackItemWithLevel extends RawFeedbackItem {
  level: number;
  stars: string;
}

const FeedbackDetails: React.FC = () => {
  const [applicants, setApplicants] = useState<
    Array<{
      _id: string;
      Review: string;
      Teacher: string;
      class: string;
      Feedback: string;
      level: number;
    }>
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplicant, setSelectedApplicant] =  useState<FlattenedFeedbackItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false); // Popup visibility
  const [selectedCourse, setSelectedCourse] = useState(""); // Final selected course for API
  const [tempCourse, setTempCourse] = useState(""); // Temp selection inside popup
  const [feedbackData, setFeedbackData] = useState([]);

  // Mapping for query parameter
  const courseQueryMap: Record<string, string> = {
    "Quran Studies": "Quran Studies",
    "Islamic Studies": "Islamic Studies",
    "Arabic Studies": "Arabic Studies",
  };

  useEffect(() => {
    if (!selectedCourse) return;

    const fetchFeedback = async () => {
      try {
        const courseQuery = courseQueryMap[selectedCourse];
        const response = await axios.get(
          `http://localhost:5001/allfeedback?course=${courseQuery}`
        );
        console.log(response.data);
        const rawData = await response.data;
        console.log("API Response:", rawData); // Debug log

        // Check if rawData exists and has feedbackRecords
        if (!rawData || !rawData.feedbackRecords) {
          console.error("Invalid API response structure:", rawData);
          return;
        }

        const feedbackArray: RawFeedbackItem[] = rawData.feedbackRecords;

        if (feedbackArray.length === 0) {
          console.log("No feedback records found");
          setApplicants([]);
          return;
        }

        const formattedData: FlattenedFeedbackItem[] = feedbackArray.map(
          (item) => ({
            _id: item._id,
            Review:
              item.student?.studentFirstName +
              " " +
              (item.student?.studentLastName || ""),
            Teacher: item.teacher?.teacherName || "Unknown",
            class: item.course?.courseName || "Unknown",
            Feedback: item.feedbackmessage || "",
            level: calculateLevel(item),
          })
        );

        setApplicants(formattedData);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedback();
  }, [selectedCourse]);

  // Filter applications based on search query
  const filteredApplications = applicants.filter((applicant) => {
    const searchLower = searchQuery.toLowerCase();
    const reviewMatch =
      applicant.Review?.toLowerCase().includes(searchLower) || false;
    const teacherMatch =
      applicant.Teacher?.toLowerCase().includes(searchLower) || false;
    const classMatch =
      applicant.class?.toLowerCase().includes(searchLower) || false;
    const feedbackMatch =
      applicant.Feedback?.toLowerCase().includes(searchLower) || false;

    return reviewMatch || teacherMatch || classMatch || feedbackMatch;
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredApplications.slice(indexOfFirst, indexOfLast);

  // Declare this outside your component or hook
  function calculateLevel(item: RawFeedbackItem): number {
    if (item.studentsRating) {
      const values = Object.values(item.studentsRating).filter(
        (n) => typeof n === "number"
      );
      if (values.length === 0) return 0;
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      return Math.min(5, Math.max(0, Math.round(avg)));
    }
    if (item.teacherRatings) {
      const values = Object.values(item.teacherRatings).filter(
        (n) => typeof n === "number"
      );
      if (values.length === 0) return 0;
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      return Math.min(5, Math.max(0, Math.round(avg)));
    }
    return 0;
  }

  const [showModal, setShowModal] = useState(false);

  const handleDetailsClick = (applicant: FlattenedFeedbackItem) => {
    setSelectedApplicant(applicant);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("SupervisorAuthToken")
            : null;

        if (!token) {
          console.error("❌ SupervisorAuthToken not found");
          return;
        }

        const res = await fetch(
          "https://api.blackstoneinfomaticstech.com/allfeedback",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          console.error("Fetch error:", res.statusText);
          return;
        }

        const rawData = await res.json();
        console.log("API Response:", rawData); // Debug log

        // Check if rawData exists and has feedbackRecords
        if (!rawData || !rawData.feedbackRecords) {
          console.error("Invalid API response structure:", rawData);
          return;
        }

        const feedbackArray: RawFeedbackItem[] = rawData.feedbackRecords;

        if (feedbackArray.length === 0) {
          console.log("No feedback records found");
          setApplicants([]);
          return;
        }

        const formattedData: FlattenedFeedbackItem[] = feedbackArray.map(
          (item) => ({
            _id: item._id,
            Review:
              item.student?.studentFirstName +
              " " +
              (item.student?.studentLastName || ""),
            Teacher: item.teacher?.teacherName || "Unknown",
            class: item.course?.courseName || "Unknown",
            Feedback: item.feedbackmessage || "",
            level: calculateLevel(item),
          })
        );

        setApplicants(formattedData);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setApplicants([]); // Set empty array on error
      }
    };

    fetchFeedback();
  }, []);

  return (
    <BaseLayout3>
      <SupervisorHeader
        currentSection="Feedback"
        showBackButton={true}
        showBackPath="/supervisor/ui/teachers"
      />
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-3 md:space-y-0">
          <div className="flex flex-wrap gap-2 mb-0">
            {/* Add any additional controls here */}
          </div>
        </div>

        <div className="w-full h-[590px] bg-[#FAFAFB] rounded-lg dark:bg-[#343434]">
          {/* Header Search & Filter */}
          <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434] h-10">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none text-[15px] w-52 py-3"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative ">
              {/* Filter Button: Tune + Filter Left, Arrow Right */}
              <div
                className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] mt-2 py-[13px] border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
                onClick={() => setFilterOpen(true)}
              >
                {/* <BsFilterLeft /> */}
                <MdTune className="w-4 h-4" />
                <span>Filter</span>
              </div>

              {/* Filter Popup */}
              {filterOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                  <div className="bg-white p-6 rounded-lg w-[350px] relative dark:bg-[#252525]">
                    {/* Close Icon */}
                    <button
                      className="absolute top-2 right-3 text-gray-400 text-xl"
                      onClick={() => setFilterOpen(false)}
                    >
                      &times;
                    </button>

                    <h2 className="text-lg font-semibold mb-4">Filter by</h2>

                    {/* Dropdown */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        Course
                      </label>
                      <select
                        className="w-full border rounded-md p-2 text-[12px] dark:bg-[#343434] dark:text-[#D6D6D6] dark:border-[#565656]"
                        value={tempCourse}
                        onChange={(e) => setTempCourse(e.target.value)}
                      >
                        <option value="">-- Select Class --</option>
                        <option>Quran Studies</option>
                        <option>Islamic Studies</option>
                        <option>Arabic Studies</option>
                      </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setFilterOpen(false)}
                        className="px-4 py-1 rounded-md border border-[#576CBC] text-[#576CBC] font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCourse(tempCourse); // Triggers API fetch
                          setFilterOpen(false); // Closes popup
                        }}
                        className="px-4 py-1 rounded-md bg-[#576CBC] text-white font-medium"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
              <span className="text-left -ml-60 ">
                Showing {currentItems.length} Of {filteredApplications.length}
              </span>
            </div>
          </div>

          {/* Table */}
          <table
            className="table-auto w-full border-separate border-spacing-y-2 "
            style={{ tableLayout: "fixed" }} // Ensures all columns follow fixed sizing
          >
            <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
              <tr className="font-medium">
                {[
                  "Review",
                  "Teacher Name",
                  "Feedback",
                  "Class",
                  "Rating",
                  "Details",
                ].map((header) => (
                  <th
                    key={header}
                    className="text-left px-3 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0] truncate"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((applicant, index) => (
                <tr
                  key={applicant._id}
                  className={`text-[12px] ${
                    index % 2 === 0
                      ? "bg-[#fff] dark:bg-[#2C2C2C]"
                      : "bg-[#F8F8F8] dark:bg-[#303030]"
                  }`}
                >
                  <td className="px-3 py-2 text-[#17243E] dark:text-white truncate">
                    {applicant.Review}
                  </td>
                  <td className="px-3 py-2 text-[#17243E] dark:text-white truncate">
                    {applicant.Teacher}
                  </td>
                  <td className="px-3 py-2 text-[#17243E] dark:text-white truncate">
                    <div className="overflow-hidden whitespace-nowrap text-ellipsis">
                      {applicant.Feedback}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-[#17243E] dark:text-white truncate">
                    {applicant.class}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`w-4 h-4 ${
                            (Number(applicant.level) || 0) >= star
                              ? "text-[#FAAB3C]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      className="text-xs px-3 py-1 rounded-md bg-[#4C6993] text-white dark:bg-[#6087C0] hover:bg-[#3b5574] dark:hover:bg-[#4e72a0] transition-colors"
                      onClick={() => handleDetailsClick(applicant)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showModal && selectedApplicant && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[600px] p-6 relative dark:bg-[#252525] space-y-12">
              <h2 className="text-xl font-semibold mb-4">Feedback</h2>

              <div className="grid grid-cols-2 gap-8 text-sm mb-4">
                <div>
                  <label
                    htmlFor="review"
                    className="font-medium mb-2 block text-gray-800 dark:text-white "
                  >
                    Reviewed By
                  </label>
                  <div className="border p-2 rounded w-full dark:bg-[#343434] dark:border-[#5C5C5C]">
                    {selectedApplicant.Review}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="teacher"
                    className="font-medium mb-2 block text-gray-800 dark:text-white"
                  >
                    Teacher Name
                  </label>
                  <div className="border p-2 rounded w-full dark:bg-[#343434] dark:border-[#5C5C5C]">
                    {selectedApplicant.Teacher}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="class"
                    className="font-medium mb-2 block text-gray-800 dark:text-white"
                  >
                    Class
                  </label>
                  <div className="border p-2 rounded w-full dark:bg-[#343434] dark:border-[#5C5C5C]">
                    {selectedApplicant.class}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="level"
                    className="font-medium mb-2 block text-gray-800 dark:text-white"
                  >
                    Rating
                  </label>
                  <div className="border p-2 rounded w-full text-yellow-500 dark:bg-[#343434] dark:border-[#5C5C5C]">
                    {"⭐".repeat(selectedApplicant.level || 0)}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="feedback"
                  className="font-medium mb-2 block text-gray-800 dark:text-white  "
                >
                  Feedback Given
                </label>
                <div className="border p-3 rounded text-sm text-gray-700 whitespace-pre-wrap dark:text-[#ffff] dark:border-[#5C5C5C] dark:bg-[#343434]">
                  {selectedApplicant.Feedback}
                </div>
              </div>

              <div className="flex justify-start dark:border-[#576CBC]">
                <button
                  onClick={closeModal}
                  className=" ml-[480px] px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium dark:text-[#576CBC] dark:bg-[#576CBC1A] dark:border-[#576CBC]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </BaseLayout3>
  );
};

export default FeedbackDetails;
