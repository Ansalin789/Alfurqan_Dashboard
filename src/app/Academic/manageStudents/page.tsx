'use client';

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaFilter, FaPlus } from 'react-icons/fa';
import BaseLayout1 from '@/components/BaseLayout1';
import { useRouter } from 'next/navigation';
import AddTrailStudentModal from '@/components/Academic/AddTrailStudentModel';
import PaginationPre from '@/components/PaginationPre';


const TrailManagement = () => {
  interface Student {
    username: string;
    createdDate: string | number | Date;
    studentId: string;
    student: {
      studentPhone: number;
      studentId: string;
      username: string;
      createdDate: string;
    };
    classScheduleCount: number;
    _id: string;
    teacherName: string;
    level: string;
  }

  interface Users {
    totalCount: number;
    students: Student[];
  }
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // State for filter moda
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

  const openFilterModal = () => {
    setIsFilterModalOpen(true); // Open filter modal
    setIsModalOpen(false); // Ensure add student modal is closed
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
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
      const response = await fetch(`http://localhost:5001/alstudents`, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      });
      const data = await response.json();
      console.log(auth);
      setUsers(data);
    };

    fetchData();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = users.students.slice(startIndex, startIndex + itemsPerPage);

  const FilterModal = ({ 
    isOpen, 
    onClose,
    onApplyFilters, 
    users 
  }: { 
    isOpen: boolean;  
    onClose: () => void; 
    onApplyFilters: (filters: { 
      studentId: string; 
      dateOfJoining: string; 
      studentName: string; 
      teacherName: string; 
      contact: string; 
      scheduledClasses: string; 
      level: string; 
    }) => void;
    users: Student[];
  }) => {
    const [filters, setFilters] = useState({
      studentId: '',
      dateOfJoining: '',
      studentName: '',
      teacherName: '',
      contact: '',
      scheduledClasses: '',
      level: '',
    });

    const handleApply = () => {
      onApplyFilters(filters);
      onClose();
    };

    const handleReset = () => {
      setFilters({
        studentId: '',
        dateOfJoining: '',
        studentName: '',
        teacherName: '',
        contact: '',
        scheduledClasses: '',
        level: '',
      });
    };

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg w-[500px]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[18px] font-semibold">Filter Options</h2>
          <button 
            onClick={onClose}
            className="text-[#223857] hover:text-gray-700 font-semibold text-[20px]"
          >
            ×
          </button>
        </div>

        <div className ="grid grid-cols-2 gap-5">
          <div>
            <label htmlFor="studentId" className="block text-[14px] font-medium text-gray-700 mb-1">
              Student ID
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg text-[12px] font-medium"
              value={filters.studentId}
              onChange={(e) => setFilters({...filters, studentId: e.target.value})}
            />
          </div>

          <div>
            <label htmlFor="dateOfJoining" className="block text-[14px] font-medium text-gray-700 mb-1">
              Date of Joining
            </label>
            <input
              type="date"
              className="w-full p-2 border rounded-lg text-[12px] font-medium"
              value={filters.dateOfJoining}
              onChange={(e) => setFilters({...filters, dateOfJoining: e.target.value})}
            />
          </div>

          <div>
            <label htmlFor="studentName" className="block text-[14px] font-medium text-gray-700 mb-1">
              Student Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg text-[12px] font-medium"
              value={filters.studentName}
              onChange={(e) => setFilters({...filters, studentName: e.target.value})}
            />
          </div>

          <div>
            <label htmlFor="teacherName" className="block text-[14px] font-medium text-gray-700 mb-1">
              Teacher Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg text-[12px] font-medium"
              value={filters.teacherName}
              onChange={(e) => setFilters({...filters, teacherName: e.target.value})}
            />
          </div>

          <div>
            <label htmlFor="contact" className="block text-[14px] font-medium text-gray-700 mb-1">
              Contact
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg text-[12px] font-medium"
              value={filters.contact}
              onChange={(e) => setFilters({...filters, contact: e.target.value})}
            />
          </div>

          <div>
            <label htmlFor="scheduledClasses" className="block text-[14px] font-medium text-gray-700 mb-1">
              Scheduled Classes
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg text-[12px] font-medium"
              value={filters.scheduledClasses}
              onChange={(e) => setFilters({...filters, scheduledClasses: e.target.value})}
            />
          </div>

          <div>
            <label htmlFor="level" className="block text-[14px] font-medium text-gray-700 mb-1">
              Level
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg text-[12px] font-medium"
              value={filters.level}
              onChange={(e) => setFilters({...filters, level: e.target.value})}
            />
          </div>

          <div className="flex space-x-4 mt-4 ml-12">
            <button
              onClick={handleReset}
              className="px-4 py-[2px] border rounded-lg hover:bg-gray-50 text-[13px] font-medium shadow bg-[#fff]"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-[2px] bg-gray-800 text-white rounded-lg shadow hover:bg-gray-900 text-[13px] font-medium"
            >
              Apply
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const handleApplyFilters = (filters: { 
    studentId: string; 
    dateOfJoining: string; 
    studentName: string; 
    teacherName: string; 
    contact: string; 
    scheduledClasses: string; 
    level: string; 
  }) => {
    let filtered = [...users.students];
    
    if (filters.studentId) {
      filtered = filtered.filter(user => user.studentId.includes(filters.studentId));
    }
    if (filters.dateOfJoining) {
      filtered = filtered.filter(user => new Date(user.createdDate).toLocaleDateString() === new Date(filters.dateOfJoining).toLocaleDateString());
    }
    if (filters.studentName) {
      filtered = filtered.filter(user => user.username.toLowerCase().includes(filters.studentName.toLowerCase()));
    }
    if (filters.teacherName) {
      filtered = filtered.filter(user => user.teacherName?.toLowerCase().includes(filters.teacherName.toLowerCase()));
    }
    if (filters.contact) {
      filtered = filtered.filter(user => user.student?.studentPhone.toString().includes(filters.contact));
    }
    if (filters.scheduledClasses) {
      filtered = filtered.filter(user => user.classScheduleCount.toString().includes(filters.scheduledClasses));
    }
    if (filters.level) {
      filtered = filtered.filter(user => user.level?.toString().includes(filters.level)); // Adjust as necessary
    }

    setUsers({ ...users, students: filtered });
    setCurrentPage(1); // Reset to first page when filters change
  };

  return (
    <BaseLayout1>
      <div className="min-h-screen p-4 bg-[#EDEDED]">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h2 className="text-[18px] p-2 font-semibold">Students List</h2>
          </div>
        </div>
        <div className="p-6 rounded-lg bg-[#EDEDED]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-1 items-center justify-between">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search here..."
                  className="border rounded-lg px-2 text-[13px] mr-4 shadow"
                />
                <button
                  onClick={openFilterModal}
                  className="flex items-center bg-gray-200 p-2 rounded-lg text-[12px] shadow font-medium"
                >
                  <FaFilter className="mr-2" /> Filter
                </button>
              </div>
              <div className="flex">
                <button
                  onClick={() => openModal()}
                  className="text-[12px] p-2 rounded-lg shadow flex bg-[#223857] text-[#fff] items-center mx-4"
                >
                  <FaPlus className="mr-2" /> Add new
                </button>
                <select className="border rounded-lg p-2 shadow text-[12px]">
                  <option>Duration: Last month</option>
                  <option>Duration: Last week</option>
                  <option>Duration: Last year</option>
                </select>
              </div>
            </div>
          </div>
          <table
            className="min-w-full rounded-lg shadow bg-[#fff]"
            style={{ width: '100%', tableLayout: 'fixed' }}
          >
            <thead>
              <tr>
                <th className="p-4 text-[12px] text-center" style={{ width: '24%' }}>Student ID</th>
                <th className="p-4 text-[12px] text-center" style={{ width: '15%' }}>Date of Joining</th>
                <th className="p-4 text-[12px] text-center" style={{ width: '18%' }}>Student Name</th>
                <th className="p-4 text-[12px] text-center" style={{ width: '18%' }}>Teacher Name</th>
                <th className="p-4 text-[12px] text-center" style={{ width: '15%' }}>Contact</th>
                <th className="p-4 text-[12px] text-center" style={{ width: '20%' }}>Scheduled Classes</th>
                <th className="p-4 text-[12px] text-center" style={{ width: '12%' }}>Level</th>
                <th className="p-4 text-[12px] text-center" style={{ width: '10%' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student, index) => (
                  <tr key={student.studentId || index} className="border-t">
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
                  <td colSpan={8} className="p-2 text-center">
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
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={closeFilterModal}
        onApplyFilters={handleApplyFilters}
        users={users.students}
      />
    </BaseLayout1>
  );
};

export default TrailManagement;
