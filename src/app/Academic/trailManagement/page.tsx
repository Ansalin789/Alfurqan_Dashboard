'use client'

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaSyncAlt, FaFilter, FaPlus, FaEdit } from 'react-icons/fa';
import BaseLayout1 from '@/components/BaseLayout1';
import AddStudentModal from '@/components/Academic/AddStudentModel';
import Popup from '@/components/Academic/Popup';
import { useRouter } from 'next/navigation';

// Define the return type of the getAllUsers function
interface User {
  studentId: string;
  fname: string;
  lname: string;
  email: string;
  number: string;
  country: string;
  course: string;
  preferredTeacher: string;
  date: string;
  time: string;
  status?: string;
  evaluationStatus?: string;
  city?: string;
  students?: number;
  comment?: string;
}

interface GetAllUsersResponse {
  success: boolean;
  data: User[];
  message?: string; // Make message optional
}

// Update the getAllUsers function to fetch from your API
const getAllUsers = async (): Promise<GetAllUsersResponse> => {
  try {
    const response = await fetch('http://localhost:5001/studentlist');
    const rawData = await response.json();
    console.log('Raw API Response:', rawData); // Debug log

    // Check if rawData.students exists and is an array
    if (!rawData.students || !Array.isArray(rawData.students)) {
      throw new Error('Invalid data structure received from API');
    }

    // Transform API data to match User interface
    const transformedData = rawData.students.map((item: { _id: string; firstName: string; lastName: string; email: string; phoneNumber: string; country: string; learningInterest: string; preferredTeacher: string; startDate: string; preferredFromTime: string; preferredToTime: string; evaluationStatus?: string; }) => ({
      studentId: item._id,
      fname: item.firstName,
      lname: item.lastName,
      email: item.email,
      number: item.phoneNumber.toString(),
      country: item.country,
      course: item.learningInterest,
      preferredTeacher: item.preferredTeacher,
      date: new Date(item.startDate).toLocaleDateString(),
      time: item.preferredFromTime,
      evaluationStatus: item.evaluationStatus
    }));

    return {
      success: true,
      data: transformedData,
      message: 'Users fetched successfully',
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : 'Failed to fetch users',
    };
  }
};

// Move FilterModal outside of the TrailManagement component
const FilterModal = ({ 
  isOpen, 
  onClose,
  onApplyFilters, 
  users 
}: { 
  isOpen: boolean;  
  onClose: () => void; 
  onApplyFilters: (filters: { country: string; course: string; teacher: string; status: string; }) => void;
  users: User[];
}) => {
  const [filters, setFilters] = useState({
    country: '',
    course: '',
    teacher: '',
    status: ''
  });

  // Get unique values for each filter
  const uniqueCountries = Array.from(new Set(users.map(user => user.country)));
  const uniqueCourses = Array.from(new Set(users.map(user => user.course)));
  const uniqueTeachers = Array.from(new Set(users.map(user => user.preferredTeacher)));

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      country: '',
      course: '',
      teacher: '',
      status: ''
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
        <h2 className="text-xl font-semibold">Filter Options</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <select
            className="w-full p-2 border rounded-lg"
            value={filters.country}
            onChange={(e) => setFilters({...filters, country: e.target.value})}
          >
            <option value="">All Countries</option>
            {uniqueCountries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course
          </label>
          <select
            className="w-full p-2 border rounded-lg"
            value={filters.course}
            onChange={(e) => setFilters({...filters, course: e.target.value})}
          >
            <option value="">All Courses</option>
            {uniqueCourses.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teacher
          </label>
          <select
            className="w-full p-2 border rounded-lg"
            value={filters.teacher}
            onChange={(e) => setFilters({...filters, teacher: e.target.value})}
          >
            <option value="">All Teachers</option>
            {uniqueTeachers.map((teacher) => (
              <option key={teacher} value={teacher}>{teacher}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            className="w-full p-2 border rounded-lg"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handleReset}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </Modal>
  );
};

const TrailManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState<User | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const router = useRouter();
  const handleSyncClick = () => {
    if (router) {
    router.push('trailSection');
    } else {
    console.error('Router is not available');
    }
};


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allData = await getAllUsers();
        if (allData.success && allData.data) {
          setUsers(allData.data);
          setFilteredUsers(allData.data); // Initialize filtered users
        } else {
          setErrorMessage(allData.message ?? 'Failed to fetch users');
        }
      } catch (error) {
        setErrorMessage('An unexpected error occurred');
        console.error('An unexpected error occurred', error);
        
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    Modal.setAppElement('body');
  }, []);

  const openModal = (user: User | null = null) => {
    setSelectedUser(user);
    setIsEditMode(!!user);
    setIsModalOpen(true);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalIsOpen(false);
  };

  useEffect(() => {
    console.log('Current users data:', users);
  }, [users]);

  const fetchStudents = async () => {
    try {
      const allData = await getAllUsers();
      if (allData.success && allData.data) {
        setUsers(allData.data);
      } else {
        setErrorMessage(allData.message ?? 'Failed to fetch users');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred');
      console.error('An unexpected error occurred', error);
    }
  };

  const handleEditClick = (studentId: User) => {
    setSelectedUserData(studentId);
    setModalIsOpen(true);
  };

  // Add filter handling function
  const handleApplyFilters = (filters: { country: string; course: string; teacher: string; status: string; }) => {
    let filtered = [...users];
    
    if (filters.country) {
      filtered = filtered.filter(user => user.country === filters.country);
    }
    if (filters.course) {
      filtered = filtered.filter(user => user.course === filters.course);
    }
    if (filters.teacher) {
      filtered = filtered.filter(user => user.preferredTeacher === filters.teacher);
    }
    if (filters.status) {
      filtered = filtered.filter(user => user.evaluationStatus === filters.status);
    }
    
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Add pagination controls component
  const Pagination = () => {
    return (
      <div className="flex justify-between items-center mt-4 px-4">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} entries
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-lg ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-lg ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            Previous
          </button>
          <div className="flex items-center space-x-1">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === index + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-lg ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-lg ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            Last
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing items per page
            }}
            className="border rounded-lg px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    );
  };

  if (errorMessage) {
    return (
      <BaseLayout1>
        <div className="min-h-screen p-4">{errorMessage}</div>
      </BaseLayout1>
    );
  }

  return (
    <BaseLayout1>
      <div className={`min-h-screen p-4 bg-[#EDEDED] mt-5`}>
        <div className="flex justify-between items-center mb-6">
            <div className='flex items-center space-x-2'>
              <h2 className="text-2xl font-semibold">Scheduled Evaluation Session</h2>
              <button className="bg-gray-800 text-white p-2 rounded-full shadow" onClick={handleSyncClick}>
                <FaSyncAlt />
              </button>
            </div>
          </div>
        <div className={`p-6 rounded-lg bg-[#EDEDED] overflow-y-scroll h-[600px]`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-1 space-x-4 items-center justify-between">
              <div className='flex'>
                <input
                  type="text"
                  placeholder="Search here..."
                  className={`border rounded-lg p-2 mx-4 shadow`}
                />
                <button 
                  onClick={() => setIsFilterModalOpen(true)}
                  className="flex items-center bg-gray-200 p-2 rounded-lg shadow"
                >
                  <FaFilter className="mr-2" /> Filter
                </button>
              </div>
              <div className='flex'>
                <button 
                  onClick={() => openModal(null)}
                  className={`border p-2 rounded-lg shadow flex bg-[#223857] text-[#fff] items-center mx-4`}
                >
                  <FaPlus className="mr-2" /> Add new
                </button>
                <select className={`border rounded-lg p-2 shadow`}>
                  <option>Duration: Last month</option>
                  <option>Duration: Last week</option>
                  <option>Duration: Last year</option>
                </select>
              </div>
            </div>
          </div>
          <table className={`min-w-full rounded-lg shadow bg-white`}>
            <thead>
              <tr>
                <th className="p-4 text-[13px] text-center">Trail ID</th>
                <th className="p-4 text-[13px] text-center">Student Name</th>
                <th className="p-4 text-[13px] text-center">Email</th>
                <th className="p-4 text-[13px] text-center">Mobile</th>
                <th className="p-4 text-[13px] text-center">Country</th>
                <th className="p-4 text-[13px] text-center">Course</th>
                <th className="p-4 text-[13px] text-center">Preferred Teacher</th>
                <th className="p-4 text-[13px] text-center">Time</th>
                <th className="p-4 text-[13px] text-center">Evaluation Status</th>
                <th className="p-4 text-[13px] text-center">Status</th>
                <th className="p-4 text-[13px] text-center">Action</th>
                <th
                    className="shadow-md p-2 text-left font-medium text-gray-700"
                >
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={item.studentId || index} className={`border-t`}>
                    <td className="p-2 text-[13px] text-center">{item.studentId}</td>
                    <td className="p-2 text-[13px] text-center">
                      {item.fname} {item.lname}
                    </td>
                    <td className="p-2 text-[13px] text-center">{item.email}</td>
                    <td className="p-2 text-[13px] text-center">{item.number}</td>
                    <td className="p-2 text-[13px] text-center">{item.country}</td>
                    <td className="p-2 text-[13px] text-center">{item.course}</td>
                    <td className="p-2 text-[13px] text-center">{item.preferredTeacher}</td>
                    <td className="p-2 text-[13px] text-center">{item.time}</td>
                    <td className="p-2 text-[13px] text-center">
                      <span className={`px-2 text-[13px] text-center py-1 rounded-full ${
                        item.evaluationStatus === 'PENDING' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.evaluationStatus ?? 'PENDING'}
                      </span>
                    </td>
                    <td className="p-2 text-[13px] text-center">
                    <span className={`px-2 text-[13px] text-center py-1 rounded-full ${
                        item.status === 'Active' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.status ?? 'Active'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="bg-gray-800 hover:cursor-pointer text-center text-white p-2 rounded-lg shadow hover:bg-gray-900"
                      >
                        <FaEdit size={13}/>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="p-4 text-center">
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
        {selectedUserData ? (
          <div>
            <Popup 
              isOpen={modalIsOpen} 
              onRequestClose={closeModal} 
              user={selectedUserData} 
              isEditMode={isEditMode} 
              onSave={() => {
                fetchStudents();
                closeModal();
              }} 
            />
          </div>
        ) : (
          <div>No user data available for editing.</div>
        )}
      </Modal>
      <AddStudentModal
        isOpen={isModalOpen}
        onRequestClose={closeModal} 
        userData={selectedUser}
        isEditMode={isEditMode}
        onSave={() => {
          fetchStudents();
          closeModal();
        }}
      />
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        users={users}
      />
    </BaseLayout1>
  );
};

export default TrailManagement;