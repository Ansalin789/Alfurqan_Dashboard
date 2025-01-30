'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { BsThreeDots } from 'react-icons/bs';
interface Assignment {
  _id: string; // Unique identifier for the assignment
  studentId: string; // ID of the student associated with the assignment
  assignmentName: string; // Name of the assignment
  assignedTeacher: string; // Teacher who assigned the task
  assignmentType: string; // JSON string describing the assignment type, e.g., {"type": "Multiple Choice", "name": "Quiz"}
  chooseType: boolean; // Flag to determine if the type of the assignment is chosen
  trueorfalseType: boolean; // Flag for True/False type assignment
  question: string; // The question or prompt for the assignment
  hasOptions: boolean; // Whether the assignment has multiple choice options
  options: {
    optionOne: string; // First option
    optionTwo: string; // Second option
    optionThree: string; // Third option
    optionFour: string; // Fourth option
  };
  uploadFile: string; // File associated with the assignment, possibly encoded as a base64 string
  audioFile?: string; // Optional audio file, possibly encoded as a base64 string
}

interface ApiResponse {
  assignments: Assignment[]; // List of assignments
}


const AssignmentList = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [currentPage, setCurrentPage] = useState(1);
  const [isClient, setIsClient] = useState(false); // To ensure client-side rendering
  const [searchQuery, setSearchQuery] = useState('');
  const [assignments, setAssignments] = useState([
    { id: '1234567890', assignedBy: 'Will Jonto', course: 'Arabic', type: 'Quiz', assignedDate: 'January 2, 2020', dueDate: 'January 8, 2020', status: 'Not Assigned' },
    { id: '1234567891', assignedBy: 'Will Jonto', course: 'Arabic', type: 'Quiz', assignedDate: 'January 2, 2020', dueDate: 'January 8, 2020', status: 'Pending' },
    { id: '1234567892', assignedBy: 'Angela Moss', course: 'Quran', type: 'Writing', assignedDate: 'January 2, 2020', dueDate: 'January 8, 2020', status: 'Not Assigned' },
    { id: '1234567893', assignedBy: 'Angela Moss', course: 'Quran', type: 'Writing', assignedDate: 'January 2, 2020', dueDate: 'January 8, 2020', status: 'Pending' },
    { id: '1234567894', assignedBy: 'Chris', course: 'Tajweed', type: 'Reading', assignedDate: 'January 2, 2020', dueDate: 'January 8, 2020', status: 'Pending' },
    { id: '1234567895', assignedBy: 'Chris', course: 'Tajweed', type: 'Image Identification', assignedDate: 'January 2, 2020', dueDate: 'January 8, 2020', status: 'Pending' },
    { id: '1234567896', assignedBy: 'John', course: 'Arabic', type: 'Word Matching', assignedDate: 'January 2, 2020', dueDate: 'January 8, 2020', status: 'Pending' },
    { id: '1234567897', assignedBy: 'Will Jonto', course: 'Arabic', type: 'Quiz', assignedDate: 'January 2, 2020', dueDate: 'January 8, 2020', status: 'Completed' },
    { id: '1234567898', assignedBy: 'Angela Moss', course: 'Quran', type: 'Writing', assignedDate: 'January 2, 2020', dueDate: 'January 8, 2020', status: 'Completed' },
  ]);

  useEffect(() => {
    setIsClient(true); // Ensure client-side rendering
  }, []);

  console.log(setAssignments);

  const handleThreeDotsClick = (assignment: any) => {
    if (isClient && assignment.status === 'Pending') {
      router.push(
        `/student/components/assignment/quizpage?id=${assignment.id}&type=${assignment.type}`
      );
    }
  };

  const getFilteredAssignments = () => {
    const filtered = assignments.filter((assignment) =>
      activeTab === 'Completed' ? assignment.status === 'Completed' : assignment.status !== 'Completed'
    );
    if (searchQuery.trim() !== '') {
      return filtered.filter((assignment) =>
        Object.values(assignment).some((value) =>
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    return filtered;
  };

  const getPaginatedAssignments = () => {
    const filtered = getFilteredAssignments();
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    return filtered.slice(startIndex, endIndex);
  };

  const paginatedAssignments = getPaginatedAssignments();

  return (
    <div className="p-4 sm:p-6 bg-gray-50 rounded-lg">
      <h1 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Assignment List</h1>

    {/* Tabs and Search Bar in a Row */}
    <div className="flex flex-wrap items-center justify-between mb-4 border-b-2 border-gray-300 pb-2">
      {/* Tabs */}
      <div className="flex gap-4">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'Upcoming' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('Upcoming')}
        >
          Upcoming ({assignments.filter((a) => a.status !== 'Completed').length})
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'Completed' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('Completed')}
        >
          Completed ({assignments.filter((a) => a.status === 'Completed').length})
        </button>
      </div>


      {/* Search Bar */}
      <div className="relative w-[40px] sm:w-1/3 ml-auto">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-4 py-2 border rounded-md shadow-md focus:ring-2 focus:ring-red-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full text-sm text-left bg-white">
          <thead>
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Assigned By</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Assigned Date</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAssignments.map((assignment) => {
              let statusClass = '';
              if (assignment.status === 'Not Assigned') {
                statusClass = 'bg-yellow-100 text-yellow-600';
              } else if (assignment.status === 'Pending') {
                statusClass = 'bg-red-100 text-red-600';
              } else {
                statusClass = 'bg-green-100 text-green-600';
              }

              return (
                <tr
                  key={assignment.id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">{assignment.id}</td>
                  <td className="px-4 py-3">{assignment.assignedBy}</td>
                  <td className="px-4 py-3">{assignment.course}</td>
                  <td className="px-4 py-3">{assignment.type}</td>
                  <td className="px-4 py-3">{assignment.assignedDate}</td>
                  <td className="px-4 py-3">{assignment.dueDate}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className={`text-gray-500 hover:text-gray-700 ${
                        assignment.status !== 'Pending'
                          ? 'cursor-not-allowed opacity-50'
                          : ''
                      }`}
                      onClick={() => handleThreeDotsClick(assignment)}
                      disabled={assignment.status !== 'Pending'}
                    >
                      <BsThreeDots />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap justify-between items-center mt-4 text-sm text-gray-600">
        <p>
          Showing {paginatedAssignments.length} of {getFilteredAssignments().length} assignments
        </p>
        <div className="flex gap-2">
          {Array.from(
            { length: Math.ceil(getFilteredAssignments().length / 5) },
            (_, i) => (
              <button
                key={`page-${i}`}
                className={`w-8 h-8 rounded-lg ${
                  currentPage === i + 1
                    ? 'bg-green-300 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentList;
