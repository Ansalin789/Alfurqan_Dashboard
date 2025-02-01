'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { BsThreeDots } from 'react-icons/bs';

type Assignment = {
  id: string;
  assignedBy: string;
  course: string;
  type: string;
  assignedDate: string;
  dueDate: string;
  status: string;
  statusColor: string;
};

const AssignmentList = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [currentPage, setCurrentPage] = useState(1);
  const [isClient, setIsClient] = useState(false); 

  const assignments: Assignment[] = Array.from({ length: 10 }, (_, index) => ({
    id: `assignment-${index + 1}`,
    assignedBy: `Instructor ${index + 1}`,
    course: `Course ${index + 1}`,
    type: index % 2 === 0 ? 'Quiz' : 'Writing',
    assignedDate: `January ${index + 1}, 2023`,
    dueDate: `January ${index + 5}, 2023`, 
    status: index % 3 === 0 ? 'Completed' : 'Pending', 
    statusColor: index % 3 === 0 ? 'bg-green-100 text-green-400 border border-green-600' : 'bg-red-100 text-red-400 border border-red-600', 
  }));

  useEffect(() => {
    setIsClient(true);
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
    <div className="p-4 mx-auto w-[1250px] pr-20">
      <h1 className="text-2xl font-semibold text-gray-800 p-2 py-4">Assignment List</h1>
      <div className="bg-white rounded-lg border-2 border-[#1C3557] h-[340px] overflow-y-scroll scrollbar-none flex flex-col justify-between">
        <div>
          <div className="flex">
            <button
              className={`py-3 px-2 ml-5 ${
                activeTab === 'Upcoming' ? 'text-[#1C3557] border-b-2 border-[#1C3557] font-semibold' : 'text-gray-500'
              } focus:outline-none text-[13px]`}
              onClick={() => setActiveTab('Upcoming')}
            >
              Upcoming ({assignments.filter((a) => a.status !== 'Completed').length})
            </button>
            <button
              className={`py-3 px-6 ${
                activeTab === 'Completed' ? 'text-[#1C3557] border-b-2 border-[#1C3557] font-semibold' : 'text-gray-500'
              } focus:outline-none text-[13px]`}
              onClick={() => setActiveTab('Completed')}
            >
              Completed ({assignments.filter((a) => a.status === 'Completed').length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead className="border-b-[1px] border-[#1C3557] text-[12px] font-semibold">
                <tr>
                  <th className="px-6 py-3 text-center">Assignment ID</th>
                  <th className="px-6 py-3 text-center">Assigned By</th>
                  <th className="px-6 py-3 text-center">Course</th>
                  <th className="px-6 py-3 text-center">Assignment Type</th>
                  <th className="px-6 py-3 text-center">Assigned Date</th>
                  <th className="px-6 py-3 text-center">Due Date</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedAssignments.map((assignment) => (
                  <tr key={assignment.id} className="text-[12px] font-medium mt-2"
                  style={{ backgroundColor: "rgba(230, 233, 237, 0.22)" }}>
                    <td className="px-6 py-2 text-center">{assignment.id}</td>
                    <td className="px-6 py-2 text-center">{assignment.assignedBy}</td>
                    <td className="px-6 py-2 text-center">{assignment.course}</td>
                    <td className="px-6 py-2 text-center">{assignment.type}</td>
                    <td className="px-6 py-2 text-center">{assignment.assignedDate}</td>
                    <td className="px-6 py-2 text-center">{assignment.dueDate}</td>
                    <td className="px-6 py-1 text-center">
                      <span
                        className={`px-2 py-1 text-[#223857] rounded-lg border-[1px] border-[#95b690] bg-[#D0FECA] text-[10px] ${assignment.statusColor}`}
                      >
                        {assignment.status}
                      </span>
                    </td>
                    <td className="relative px-6 py-2 text-center">
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
        </div>
        <div className='p-4'>
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <p>
              Showing {paginatedAssignments.length} of {getFilteredAssignments().length} assignments
            </p>
            <div className="flex gap-2">
              {Array.from({ length: Math.ceil(getFilteredAssignments().length / 5) }, (_, i) => (
                <button
                  key={`page-${i}`}
                  className={`w-5 h-5 text-[13px] flex items-center justify-center rounded ${
                    currentPage === i + 1 ? 'bg-[#1C3557] text-white' : 'text-[#1C3557] border border-[#1C3557]'
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentList;
