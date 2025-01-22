'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { BsThreeDots } from 'react-icons/bs';

const AssignmentList = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [currentPage, setCurrentPage] = useState(1);
  const [isClient, setIsClient] = useState(false); // To ensure client-side rendering

  // Mock data for assignments
  const allAssignments = [
    { id: '1234567890', assignedBy: 'Will Jonto', course: 'Arabic', type: 'Quiz', assignedDate: 'January 2, 2020', dueDate: 'January 8, 2020', status: 'Not Assigned', statusColor: 'bg-yellow-200 text-yellow-600' },
    { id: '1234567891', assignedBy: 'Will Jonto', course: 'Arabic', type: 'Quiz', assignedDate: 'January 2, 2020', dueDate: 'January 8, 2020', status: 'Pending', statusColor: 'bg-red-200 text-red-600' },
    { id: '1234567892', assignedBy: 'Angela Moss', course: 'Quran', type: 'Writing', assignedDate: 'January 2, 2020', dueDate: 'January 8, 2020', status: 'Not Assigned', statusColor: 'bg-yellow-200 text-yellow-600' },
    { id: '1234567893', assignedBy: 'Angela Moss', course: 'Quran', type: 'Writing', assignedDate: 'January 2, 2020', dueDate: 'January 8, 2020', status: 'Pending', statusColor: 'bg-red-200 text-red-600' },
    { id: '1234567894', assignedBy: 'Chris', course: 'Tajweed', type: 'Reading', assignedDate: 'January 2, 2020', dueDate: 'January 8, 2020', status: 'Pending', statusColor: 'bg-red-200 text-red-600' },
    { id: '1234567895', assignedBy: 'Chris', course: 'Tajweed', type: 'Image Identification', assignedDate: 'January 2, 2020', dueDate: 'January 8, 2020', status: 'Pending', statusColor: 'bg-red-200 text-red-600' },
  ];

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleThreeDotsClick = (assignment: any) => {
    if (isClient && assignment.status === 'Pending') {
      router.push(`/student/components/assignment/quizpage?type=${assignment.type}`);
    }
  };

  // Filtered data based on active tab
  const filteredAssignments = allAssignments.filter((assignment) =>
    activeTab === 'Completed' ? assignment.status === 'Completed' : assignment.status !== 'Completed'
  );

  // Pagination logic
  const startIndex = (currentPage - 1) * 5; // Number of items per page
  const endIndex = startIndex + 5;
  const paginatedAssignments = filteredAssignments.slice(startIndex, endIndex);

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Assignment List</h1>

      {/* Tabs */}
      <div className="flex mb-4 border-b-2 border-gray-300">
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'Upcoming' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('Upcoming')}
        >
          Upcoming ({allAssignments.filter((a) => a.status !== 'Completed').length})
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'Completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('Completed')}
        >
          Completed ({allAssignments.filter((a) => a.status === 'Completed').length})
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-200 bg-white rounded-lg shadow-md">
          <thead className="bg-gray-100 border-b border-gray-300 text-sm font-semibold text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Assignment ID</th>
              <th className="px-4 py-2 text-left">Assigned By</th>
              <th className="px-4 py-2 text-left">Course</th>
              <th className="px-4 py-2 text-left">Assignment Type</th>
              <th className="px-4 py-2 text-left">Assigned Date</th>
              <th className="px-4 py-2 text-left">Due Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedAssignments.map((assignment, index) => (
              <tr key={index} className={`text-sm font-medium ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <td className="px-4 py-2">{assignment.id}</td>
                <td className="px-4 py-2">{assignment.assignedBy}</td>
                <td className="px-4 py-2">{assignment.course}</td>
                <td className="px-4 py-2">{assignment.type}</td>
                <td className="px-4 py-2">{assignment.assignedDate}</td>
                <td className="px-4 py-2">{assignment.dueDate}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${assignment.statusColor}`}>
                    {assignment.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    className={`text-gray-500 hover:text-gray-700 ${assignment.status !== 'Pending' ? 'cursor-not-allowed opacity-50' : ''}`}
                    onClick={() => handleThreeDotsClick(assignment)}
                    disabled={assignment.status !== 'Pending'}
                  >
                    <span className="sr-only">Options</span>
                    <BsThreeDots />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <p>
          Showing {startIndex + 1}-{Math.min(endIndex, filteredAssignments.length)} of {filteredAssignments.length} assignments
        </p>
        <div className="flex gap-2">
          {Array.from({ length: Math.ceil(filteredAssignments.length / 5) }, (_, i) => (
            <button
              key={i}
              className={`w-8 h-8 rounded-md ${currentPage === i + 1 ? 'bg-blue-200 text-blue-600 font-semibold' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignmentList;
