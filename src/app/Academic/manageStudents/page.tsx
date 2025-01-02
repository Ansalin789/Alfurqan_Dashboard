'use client'

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaFilter, FaPlus } from 'react-icons/fa';
import BaseLayout1 from '@/components/BaseLayout1';
import { useRouter } from 'next/navigation';
import AddTrailStudentModal from '@/components/Academic/AddTrailStudentModel';
import Students from '@/components/Supervisor/Students';

const TrailManagement = () => {
  interface Student {
    studentId: string;
    student: {
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
  const [users, setUsers] = useState({ totalCount: 0, students: [] });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  console.log(setItemsPerPage);
  const router = useRouter();

const handleSyncClick = (studentId: string) => {
  if (router) {
  router.push('managestudentview');
  console.log(studentId);
  localStorage.setItem('studentManageID',studentId);
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
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(Students.length / itemsPerPage);
  
  const Pagination = () => {
    const renderPageNumbers = () => {
      const pageNumbers = [];
      const totalPages = Math.ceil(Students.length / itemsPerPage);
  
      for (let i = 1; i <= totalPages; i++) {
        if (i <= 3 || i > totalPages - 3 || (currentPage >= 4 && currentPage <= totalPages - 3 && (i === currentPage - 1 || i === currentPage + 1))) {
          pageNumbers.push(
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === i
                  ? 'bg-gray-800 text-white text-[13px]'
                  : 'bg-white text-gray-800 text-[13px] hover:bg-gray-50'
              }`}
            >
              {i}
            </button>
          );
        } else if (i === 4 || i === totalPages - 1) {
          pageNumbers.push(<span key={i} className="px-3 py-1">...</span>);
        }
      }
  
      return pageNumbers;
    };
  
    return (
      <div className="flex justify-between items-center mt-4 px-4">
        <div className="text-[12px] text-gray-700">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, Students.length)} of {Students.length} entries
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-[13px] rounded-lg ${
              currentPage === 1
                ? 'bg-gray-100 text-[13px] text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 text-[13px] hover:bg-gray-50 border'
            }`}
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-[13px] rounded-lg ${
              currentPage === 1
                ? 'bg-gray-100 text-[13px] text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 text-[13px] hover:bg-gray-50 border'
            }`}
          >
            Previous
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-[13px] rounded-lg ${
              currentPage === totalPages
                ? 'bg-gray-100 text-[13px] text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 text-[13px] hover:bg-gray-50 border'
            }`}
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-[13px] rounded-lg ${
              currentPage === totalPages
                ? 'bg-gray-100 text-[13px] text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 text-[13px] hover:bg-gray-50 border'
            }`}
          >
            Last
          </button>
        </div>
      </div>
    );
  };

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedUsers(Students.map((user: { trailId: any; }) => user.trailId));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (trailId: string) => {
    if (selectedUsers.includes(trailId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== trailId));
    } else {
      setSelectedUsers([...selectedUsers, trailId]);
    }
  };

 
 
  useEffect(() => {
    const fetchData = async () => {
      const auth=localStorage.getItem('authToken');
      const response = await fetch("http://localhost:5001/alstudents",
        {
          headers: {
                 'Authorization': `Bearer ${auth}`,
          },
      });
      const data = await response.json();
      setUsers(data);
      console.log(data);
    };
    fetchData();
  }, []);
  
  return (
    <BaseLayout1>
      <div className={`min-h-screen p-1 bg-[#EDEDED]`}>
        <div className="flex justify-between items-center">
          <div className='flex items-center space-x-2'>
            <h2 className="text-[18px] p-2 font-semibold">Students List</h2>
          </div>
        </div>
        <div className={`p-4 rounded-lg bg-[#EDEDED]`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-1 space-x-4 items-center justify-between">
              <div className='flex'>
                <input
                  type="text"
                  placeholder="Search here..."
                  className={`border rounded-lg px-2 text-[13px] mr-4 shadow`}
                />
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center bg-gray-200 p-2 rounded-lg shadow"
                >
                  <FaFilter className="mr-2" /> Filter
                </button>
              </div>
              <div className='flex'>
                <button 
                  onClick={() => openModal()}
                  className={`border text-[14px] p-2 rounded-lg shadow flex bg-[#223857] text-[#fff] items-center mx-4`}
                >
                  <FaPlus className="mr-2" /> Add new
                </button>
                <select className={`border rounded-lg p-2 shadow text-[14px]`}>
                  <option>Duration: Last month</option>
                  <option>Duration: Last week</option>
                  <option>Duration: Last year</option>
                </select>
              </div>
            </div>
          </div>
          <table className={`min-w-full rounded-lg shadow bg-[#fff]`} style={{ width: '100%', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th className="p-4 text-[13px] text-center" style={{ width: '8%' }}>
                  <input type="checkbox" onChange={(e) => handleSelectAll(e.target.checked)} />
                </th>
                <th className="p-4 text-[12px] text-center" style={{ width: '24%' }}>Student ID</th>
                <th className="p-4 text-[12px] text-center"style={{ width: '15%' }}>Date of Joining</th>
                <th className="p-4 text-[12px] text-center"style={{ width: '18%' }}>Student Name</th>
                <th className="p-4 text-[12px] text-center"style={{ width: '18%' }}>Teacher Name</th>
                <th className="p-4 text-[12px] text-center"style={{ width: '15%' }}>Contact</th>
                <th className="p-4 text-[12px] text-center"style={{ width: '14%' }}>Scheduled Classes</th>
                <th className="p-4 text-[12px] text-center"style={{ width: '12%' }}>Level</th>
                <th className="p-4 text-[12px] text-center"style={{ width: '10%' }}>Action</th>
              </tr>
            </thead>
            <tbody>
                 {users.students && users.students.length > 0 ? (
                          users.students.map((student, index) => (
                            <tr key={student.studentId || index} className="border-t">
                    <td className="p-2 text-center">
                   <input type="checkbox" onChange={() => handleSelectUser(student.student?.studentId)} />
                             </td>
                      <td className="p-2 text-[11px] text-center">{student.student?.studentId}</td>
        <td className="p-2 text-[11px] text-center">{new Date(student.createdDate).toLocaleDateString()}</td>
        <td className="p-2 text-[11px] text-center">{student.username}</td>
        <td className="p-2 text-[11px] text-center"></td>
        <td className="p-2 text-[11px] text-center">{student.student?.studentPhone}</td>
        <td className="p-2 text-[11px] text-center">{student.classScheduleCount}</td>
        <td className="p-2 text-[11px] text-center">1</td>
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
          <Pagination />
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <h2>Edit User</h2>
      </Modal>
      <AddTrailStudentModal
        isOpen={isModalOpen}
        onRequestClose={closeModal} 
        isEditMode={isEditMode}
        onSave={() => {
          closeModal();
        }}
      />
     
    </BaseLayout1>
  );
};

export default TrailManagement;