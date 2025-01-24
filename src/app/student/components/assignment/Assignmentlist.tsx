'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { BsThreeDots } from 'react-icons/bs';

const AssignmentList = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [currentPage, setCurrentPage] = useState(1);
  const [isClient, setIsClient] = useState(false); // To ensure client-side rendering
  const [assignments, setAssignments] = useState([
    { id: '1234567890', assignedBy: 'Will Jonto', course: 'Arabic', type: 'Quiz', assignedDate: 'January 2, 2020', dueDate: 'January 8, 2020', status: 'Not Assigned', statusColor: 'bg-yellow-200 text-yellow-600' },
    { id: '1234567891', assignedBy: 'Will Jonto', course: 'Arabic', type: 'Quiz', assignedDate: 'January 2, 2020', dueDate: 'January 8, 2020', status: 'Pending', statusColor: 'bg-red-200 text-red-600' },
    { id: '1234567892', assignedBy: 'Angela Moss', course: 'Quran', type: 'Writing', assignedDate: 'January 2, 2020', dueDate: 'January 8, 2020', status: 'Not Assigned', statusColor: 'bg-yellow-200 text-yellow-600' },
    { id: '1234567893', assignedBy: 'Angela Moss', course: 'Quran', type: 'Writing', assignedDate: 'January 2, 2020', dueDate: 'January 8, 2020', status: 'Pending', statusColor: 'bg-red-200 text-red-600' },
    { id: '1234567894', assignedBy: 'Chris', course: 'Tajweed', type: 'Reading', assignedDate: 'January 2, 2020', dueDate: 'January 8, 2020', status: 'Pending', statusColor: 'bg-red-200 text-red-600' },
    { id: '1234567895', assignedBy: 'Chris', course: 'Tajweed', type: 'Image Identification', assignedDate: 'January 2, 2020', dueDate: 'January 8, 2020', status: 'Pending', statusColor: 'bg-red-200 text-red-600' },
    { id: '1234567896', assignedBy: 'John', course: 'Arabic', type: 'Word Matching', assignedDate: 'January 2, 2020', dueDate: 'January 8, 2020', status: 'Pending', statusColor: 'bg-red-200 text-red-600' },
    { id: '1234567897', assignedBy: 'Will Jonto', course: 'Arabic', type: 'Quiz', assignedDate: 'January 2, 2020', dueDate: 'January 8, 2020', status: 'Completed', statusColor: 'bg-green-200 text-green-600' },
    { id: '1234567898', assignedBy: 'Angela Moss', course: 'Quran', type: 'Writing', assignedDate: 'January 2, 2020', dueDate: 'January 8, 2020', status: 'Completed', statusColor: 'bg-green-200 text-green-600' },
  ]);

  useEffect(() => {
    setIsClient(true); // Ensure client-side rendering
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { id, action } = event.data;
      if (action === 'complete') {
        setAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment.id === id
              ? { ...assignment, status: 'Completed', statusColor: 'bg-green-200 text-green-600' }
              : assignment
          )
        );
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleThreeDotsClick = (assignment: any) => {
    if (isClient && assignment.status === 'Pending') {
      router.push(
        `/student/components/assignment/quizpage?id=${assignment.id}&type=${assignment.type}`
      );
    }
  };

  const getFilteredAssignments = () =>
    assignments.filter((assignment) =>
      activeTab === 'Completed' ? assignment.status === 'Completed' : assignment.status !== 'Completed'
    );

  const getPaginatedAssignments = () => {
    const filtered = getFilteredAssignments();
    const startIndex = (currentPage - 1) * 5;
    const endIndex = startIndex + 5;
    return filtered.slice(startIndex, endIndex);
  };

  const paginatedAssignments = getPaginatedAssignments();

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Assignment List</h1>

      <div className="flex mb-4 border-b-2 border-gray-300">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'Upcoming' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('Upcoming')}
        >
          Upcoming ({assignments.filter((a) => a.status !== 'Completed').length})
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'Completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('Completed')}
        >
          Completed ({assignments.filter((a) => a.status === 'Completed').length})
        </button>
      </div>

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
            {paginatedAssignments.map((assignment) => (
              <tr key={assignment.id} className="text-sm font-medium">
                <td className="px-4 py-2">{assignment.id}</td>
                <td className="px-4 py-2">{assignment.assignedBy}</td>
                <td className="px-4 py-2">{assignment.course}</td>
                <td className="px-4 py-2">{assignment.type}</td>
                <td className="px-4 py-2">{assignment.assignedDate}</td>
                <td className="px-4 py-2">{assignment.dueDate}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${assignment.statusColor}`}
                  >
                    {assignment.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    className={`text-gray-500 hover:text-gray-700 ${
                      assignment.status !== 'Pending' ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                    onClick={() => handleThreeDotsClick(assignment)}
                    disabled={assignment.status !== 'Pending'}
                  >
                    <BsThreeDots />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <p>
          Showing {paginatedAssignments.length} of {getFilteredAssignments().length} assignments
        </p>
        <div className="flex gap-2">
          {Array.from({ length: Math.ceil(getFilteredAssignments().length / 5) }, (_, i) => (
            <button
              key={`page-${i}`}
              className={`w-8 h-8 rounded-md ${
                currentPage === i + 1 ? 'bg-blue-200 text-blue-600 font-semibold' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
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
