"use client";

import React, { useEffect, useState } from "react";
import BaseLayout3 from "@/components/BaseLayout3";
import SupervisorHeader from "../../components/supervisorHeader";
import {  FaStar } from "react-icons/fa";

import { Search } from "lucide-react";
import Pagination from "@/components/Pagination";
import { HiOutlineX } from "react-icons/hi";
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
const [applicants, setApplicants] = useState<Array<{
  _id: string;
  Review: string;
  Teacher: string;
  class: string;
  Feedback: string;
  level: number;
}>>([]);
  const [currentPage, setCurrentPage] = useState(1);
const [selectedApplicant, setSelectedApplicant] = useState<FlattenedFeedbackItem| null>(null);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(applicants.length / itemsPerPage);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = applicants.slice(indexOfFirst, indexOfLast);

  const [showFilter, setShowFilter] = useState(false);


const handleDetailsClick = (applicant: FlattenedFeedbackItem) => {
  setSelectedApplicant(applicant);
  setShowModal(true);
};


  const closeModal = () => {
    setShowModal(false);
  };
// Declare this outside your component or hook
function calculateLevel(item: RawFeedbackItem): number {
  if (item.studentsRating) {
    const values = Object.values(item.studentsRating).filter(n => typeof n === "number");
    if (values.length === 0) return 0;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return Math.min(5, Math.max(0, Math.round(avg)));
  }
  if (item.teacherRatings) {
    const values = Object.values(item.teacherRatings).filter(n => typeof n === "number");
    if (values.length === 0) return 0;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return Math.min(5, Math.max(0, Math.round(avg)));
  }
  return 0;
}

useEffect(() => {
  const fetchFeedback = async () => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("SupervisorAuthToken") : null;

      if (!token) {
        console.error("❌ SupervisorAuthToken not found");
        return;
      }

      const res = await fetch('http://localhost:5001/allfeedback', {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        console.error("Fetch error:", res.statusText);
        return;
      }

    const rawData = await res.json();

const feedbackArray: RawFeedbackItem[] = rawData.data.feedbackRecords;

if (!Array.isArray(feedbackArray)) {
  console.error("Expected feedbackRecords array but got:", feedbackArray);
  return;
}


      const formattedData: FlattenedFeedbackItem[] = feedbackArray.map(item => ({
        _id: item._id,
        Review: item.student.studentFirstName + " " + (item.student.studentLastName || ""),
        Teacher: item.teacher.teacherName,
        class: item.course.courseName,
        Feedback: item.feedbackmessage,
        level: calculateLevel(item),
      }));

      setApplicants(formattedData);
    } catch (err) {
      console.error('Error fetching feedback:', err);
    }
  };

  fetchFeedback();
}, []);




  return (
    <BaseLayout3>
      <SupervisorHeader currentSection="Feedback" />
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
              <Search className="w-4 h-4 text-gray-400 dark:text-gray-400 mt-3 " />
              <input
                type="text"
                placeholder="Search by keyword"
                className="bg-transparent outline-none  w-52 py-3 mt-3 text-sm"
              />
            </div>

            <div className="relative ">
              {/* Filter Button: Tune + Filter Left, Arrow Right */}
              <div
                className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer mt-3"
                onClick={() => setShowFilter(!showFilter)}
              >
                   <svg
                        width="19"
                        height="18"
                        viewBox="0 0 19 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.33594 16C1.0526 16 0.815271 15.904 0.623938 15.712C0.431938 15.5207 0.335938 15.2833 0.335938 15C0.335938 14.7167 0.431938 14.4793 0.623938 14.288C0.815271 14.096 1.0526 14 1.33594 14H5.33594C5.61927 14 5.85694 14.096 6.04894 14.288C6.24027 14.4793 6.33594 14.7167 6.33594 15C6.33594 15.2833 6.24027 15.5207 6.04894 15.712C5.85694 15.904 5.61927 16 5.33594 16H1.33594ZM1.33594 4C1.0526 4 0.815271 3.90433 0.623938 3.713C0.431938 3.521 0.335938 3.28333 0.335938 3C0.335938 2.71667 0.431938 2.479 0.623938 2.287C0.815271 2.09567 1.0526 2 1.33594 2H9.33594C9.61927 2 9.85694 2.09567 10.0489 2.287C10.2403 2.479 10.3359 2.71667 10.3359 3C10.3359 3.28333 10.2403 3.521 10.0489 3.713C9.85694 3.90433 9.61927 4 9.33594 4H1.33594ZM9.33594 18C9.0526 18 8.81527 17.904 8.62394 17.712C8.43194 17.5207 8.33594 17.2833 8.33594 17V13C8.33594 12.7167 8.43194 12.479 8.62394 12.287C8.81527 12.0957 9.0526 12 9.33594 12C9.61927 12 9.85694 12.0957 10.0489 12.287C10.2403 12.479 10.3359 12.7167 10.3359 13V14H17.3359C17.6193 14 17.8566 14.096 18.0479 14.288C18.2399 14.4793 18.3359 14.7167 18.3359 15C18.3359 15.2833 18.2399 15.5207 18.0479 15.712C17.8566 15.904 17.6193 16 17.3359 16H10.3359V17C10.3359 17.2833 10.2403 17.5207 10.0489 17.712C9.85694 17.904 9.61927 18 9.33594 18ZM5.33594 12C5.0526 12 4.81494 11.904 4.62294 11.712C4.4316 11.5207 4.33594 11.2833 4.33594 11V10H1.33594C1.0526 10 0.815271 9.904 0.623938 9.712C0.431938 9.52067 0.335938 9.28333 0.335938 9C0.335938 8.71667 0.431938 8.479 0.623938 8.287C0.815271 8.09567 1.0526 8 1.33594 8H4.33594V7C4.33594 6.71667 4.4316 6.479 4.62294 6.287C4.81494 6.09567 5.0526 6 5.33594 6C5.61927 6 5.85694 6.09567 6.04894 6.287C6.24027 6.479 6.33594 6.71667 6.33594 7V11C6.33594 11.2833 6.24027 11.5207 6.04894 11.712C5.85694 11.904 5.61927 12 5.33594 12ZM9.33594 10C9.0526 10 8.81527 9.904 8.62394 9.712C8.43194 9.52067 8.33594 9.28333 8.33594 9C8.33594 8.71667 8.43194 8.479 8.62394 8.287C8.81527 8.09567 9.0526 8 9.33594 8H17.3359C17.6193 8 17.8566 8.09567 18.0479 8.287C18.2399 8.479 18.3359 8.71667 18.3359 9C18.3359 9.28333 18.2399 9.52067 18.0479 9.712C17.8566 9.904 17.6193 10 17.3359 10H9.33594ZM13.3359 6C13.0526 6 12.8153 5.904 12.6239 5.712C12.4319 5.52067 12.3359 5.28333 12.3359 5V1C12.3359 0.716667 12.4319 0.479 12.6239 0.287C12.8153 0.0956666 13.0526 0 13.3359 0C13.6193 0 13.8566 0.0956666 14.0479 0.287C14.2399 0.479 14.3359 0.716667 14.3359 1V2H17.3359C17.6193 2 17.8566 2.09567 18.0479 2.287C18.2399 2.479 18.3359 2.71667 18.3359 3C18.3359 3.28333 18.2399 3.521 18.0479 3.713C17.8566 3.90433 17.6193 4 17.3359 4H14.3359V5C14.3359 5.28333 14.2399 5.52067 14.0479 5.712C13.8566 5.904 13.6193 6 13.3359 6Z"
                          fill="#DEDEDE"
                          fill-opacity="0.7"
                        />
                      </svg>
                    <span>Filter</span>

              </div>

              {/* Filter Popup */}
              {showFilter && (
                <div
                  className="absolute top-14 left-0 bg-white  dark:bg-[#343434] rounded-lg shadow-lg w-80 p-6 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-[#ffff]">
                      Filter by
                    </h3>
                    <button onClick={() => setShowFilter(false)}>
                      <HiOutlineX className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                    </button>
                  </div>
                  <label className="block text-sm text-gray-700 mb-1 dark:text-[#ffff]">
                    Class
                  </label>{" "}
                  <br />
                  <select className="w-full border border-gray-300  dark:bg-[#343434] dark:text-[#ffff] rounded-md p-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Trail Class</option>
                    <option>Other Class</option>
                  </select>
                  <hr className="my-4" />
                  <div className="flex justify-between">
                    <button
                      className="px-4 py-2 rounded-md border border-indigo-300 text-indigo-600 hover:bg-indigo-50 text-sm"
                      onClick={() => setShowFilter(false)}
                    >
                      Cancel
                    </button>
                    <button className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 text-sm">
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
              <span className="text-left -ml-60 mt-3 text-sm">
                Showing {currentItems.length} Of {applicants.length}
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
      {["Review", "Teacher", "Feedback", "Class", "Level", "Details"].map((header) => (
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
        index % 2 === 0 ? "bg-[#fff] dark:bg-[#2C2C2C]" : "bg-[#F8F8F8] dark:bg-[#303030]"
      }`}
    >
      <td className="px-3 py-2 text-[#17243E] dark:text-white truncate">{applicant.Review}</td>
      <td className="px-3 py-2 text-[#17243E] dark:text-white truncate">{applicant.Teacher}</td>
      <td className="px-3 py-2 text-[#17243E] dark:text-white truncate">
        <div className="overflow-hidden whitespace-nowrap text-ellipsis">{applicant.Feedback}</div>
      </td>
      <td className="px-3 py-2 text-[#17243E] dark:text-white truncate">{applicant.class}</td>
      <td className="px-3 py-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`w-4 h-4 ${
                (Number(applicant.level) || 0) >= star ? "text-[#FAAB3C]" : "text-gray-300"
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
        <label htmlFor="review" className="font-medium mb-2 block text-gray-800 dark:text-white ">Reviewed By</label>
        <div className="border p-2 rounded w-full dark:bg-[#343434] dark:border-[#5C5C5C]">{selectedApplicant.Review}</div>
      </div>
      <div>
        <label htmlFor="teacher" className="font-medium mb-2 block text-gray-800 dark:text-white">Teacher Name</label>
        <div className="border p-2 rounded w-full dark:bg-[#343434] dark:border-[#5C5C5C]">{selectedApplicant.Teacher}</div>
      </div>
      <div>
        <label htmlFor="class" className="font-medium mb-2 block text-gray-800 dark:text-white">Class</label>
        <div className="border p-2 rounded w-full dark:bg-[#343434] dark:border-[#5C5C5C]">{selectedApplicant.class}</div>
      </div>
      <div>
        <label htmlFor="level" className="font-medium mb-2 block text-gray-800 dark:text-white">Rating</label>
        <div className="border p-2 rounded w-full text-yellow-500 dark:bg-[#343434] dark:border-[#5C5C5C]">
          {"⭐".repeat(selectedApplicant.level || 0)}
        </div>
      </div>
    </div>

    <div className="mb-4">
      <label htmlFor="feedback" className="font-medium mb-2 block text-gray-800 dark:text-white  ">Feedback Given</label>
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
