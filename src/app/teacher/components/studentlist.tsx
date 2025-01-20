'use client';

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaFilter, FaPlus } from 'react-icons/fa';
import BaseLayout3 from '@/components/BaseLayout3';
import { useRouter } from 'next/navigation';
import AddTrailStudentModal from '@/components/Academic/AddTrailStudentModel';
import PaginationPre from '@/components/PaginationPre';

const TrailManagement = () => {
  interface Student {
    username: string;
    createdDate: string | number | Date;
    studentId: string;
    status: string; // Added status here
    student: {
      studentPhone: number;
      studentId: string;
      username: string;
      createdDate: string;
    };
    classScheduleCount: number;
    _id: string;
  }

  interface Users {
    totalCount: number;
    students: Student[];
  }

  const [users, setUsers] = useState<Users>({ totalCount: 0, students: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page
  const router = useRouter();

  const handleSyncClick = (studentId: string) => {
    if (router) {
      router.push('managestudentview');
      localStorage.setItem('studentManageID', studentId);
    } else {
      console.error('Router is not available');
    }
  };

  const openModal = () => {
    setIsEditMode(!!users);
    setIsModalOpen(true);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalIsOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchData = async () => {
      const auth = localStorage.getItem('authToken');
      const response = await fetch('http://alfurqanacademy.tech:5001/alstudents', {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      });
      const data = await response.json();
      setUsers(data);
    };

    fetchData();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = users.students.slice(startIndex, startIndex + itemsPerPage);

  const StatusBadge = ({ status }: { status: string }) => {
    let badgeClass = '';
    let label = '';
    switch (status) {
      case 'Completed':
        badgeClass = 'bg-green-100 text-green-700';
        label = 'Completed';
        break;
      case 'Not Completed':
        badgeClass = 'bg-yellow-100 text-yellow-700';
        label = 'Not Completed';
        break;
      case 'Not Assigned':
        badgeClass = 'bg-red-100 text-red-700';
        label = 'Not Assigned';
        break;
      default:
        badgeClass = 'bg-gray-100 text-gray-700';
        label = 'Unknown';
    }

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeClass}`}>
        {label}
      </span>
    );
  };

  return (
    <BaseLayout3>
      <div className="min-h-screen p-1 bg-[#EDEDED]">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h2 className="text-[18px] p-2 font-semibold">Students List</h2>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-[#EDEDED]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-1 space-x-4 items-center justify-between"></div>
          </div>
          <table
            className="min-w-full rounded-lg shadow bg-[#fff]"
            style={{ width: '100%', tableLayout: 'fixed' }}
          >
            <thead>
              <tr>
                <th className="p-4 text-[12px] text-center" style={{ width: '24%' }}>Assigned ID</th>
                <th className="p-4 text-[12px] text-center" style={{ width: '18%' }}>Student Name</th>
                <th className="p-4 text-[12px] text-center" style={{ width: '24%' }}>Student ID</th>
                <th className="p-4 text-[12px] text-center" style={{ width: '12%' }}>Level</th>
                <th className="p-4 text-[12px] text-center" style={{ width: '18%' }}>Courses</th>
                <th className="p-4 text-[12px] text-center" style={{ width: '15%' }}>Assigned Date</th>
                <th className="p-4 text-[12px] text-center" style={{ width: '14%' }}>Due Date</th>
                <th className="p-4 text-[12px] text-center" style={{ width: '14%' }}>Status</th>
                <th className="p-4 text-[12px] text-center" style={{ width: '10%' }}></th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student, index) => (
                  <tr key={student.studentId || index} className="border-t">
                    <td className="p-2 text-[11px] text-center">{}</td>
                    <td className="p-2 text-[11px] text-center">{student.username}</td>
                    <td className="p-2 text-[11px] text-center">{student.student?.studentId}</td>
                    <td className="p-2 text-[11px] text-center">{}</td>
                    <td className="p-2 text-[11px] text-center">{}</td>
                    <td className="p-2 text-[11px] text-center">{}</td>
                    <td className="p-2 text-[11px] text-center">{}</td>
                    <td className="p-2 text-[11px] text-center">
                      <StatusBadge status={student.status} />
                    </td>
                    <td className="p-1 text-center">
                      <button
                        className="bg-gray-800 text-[11px] hover:cursor-pointer text-center text-white px-3 py-1 rounded-full shadow hover:bg-gray-900"
                        onClick={() => handleSyncClick(student._id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-2 text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <PaginationPre
            totalItems={users.totalCount}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <h2>Edit User</h2>
      </Modal>
      <AddTrailStudentModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        isEditMode={isEditMode}
        onSave={closeModal}
      />
    </BaseLayout3>
  );
};

export default TrailManagement;
