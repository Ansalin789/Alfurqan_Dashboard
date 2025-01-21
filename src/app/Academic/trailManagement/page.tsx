'use client'

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaSyncAlt, FaFilter, FaPlus, FaEdit } from 'react-icons/fa';
import BaseLayout1 from '@/components/BaseLayout1';
import AddStudentModal from '@/components/Academic/AddStudentModel';
import Popup from '@/components/Academic/Popup';
import { useRouter } from 'next/navigation';
import { table } from 'console';
import axios from 'axios';
import API_URL from '@/app/acendpoints/page';

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
    const auth=localStorage.getItem('authToken');
    const academicId=localStorage.getItem('academicId');
    console.log("academicId>>",academicId);
    const response = await axios.get(`${API_URL}/studentlist`,{
      params:{academicCoachId:academicId },
      headers: {
        'Content-Type': 'application/json',
         'Authorization': `Bearer ${auth}`,
      },
    });
console.log("response>>>",response)

   // const rawData = JSON.stringify(response.data);
   // console.log('Raw API Response:', rawData); // Debug log
    // Check if rawData.students exists and is an array
    if (!response.data.students || !Array.isArray(response.data.students)) {
      throw new Error('Invalid data structure received from API');
    }

    // Transform API data to match User interface
    const transformedData = response.data.students.map((item: { _id: string; firstName: string; lastName: string; email: string; phoneNumber: string; country: string; learningInterest: string; preferredTeacher: string; startDate: string; preferredFromTime: string; preferredToTime: string; evaluationStatus?: string; }) => ({
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
      evaluationStatus: item.evaluationStatus,
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

      <div className ="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState<User | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  console.log(setItemsPerPage);

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

const Pagination = () => {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

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
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} entries
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


  useEffect(() => {
    const fetchData = async () => {
      try {
        const allData = await getAllUsers();
        if (allData.success && allData.data) {
          setUsers(allData.data);
          setFilteredUsers(allData.data); 
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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = users.filter(user => {
      const fullName = `${user.fname} ${user.lname}`.toLowerCase();
      return (
        user.studentId.toLowerCase().includes(query.toLowerCase()) ||
        fullName.includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.number.includes(query) ||
        user.country.toLowerCase().includes(query.toLowerCase()) ||
        user.course.toLowerCase().includes(query.toLowerCase()) ||
        user.preferredTeacher.toLowerCase().includes(query.toLowerCase()) ||
        user.time.toLowerCase().includes(query.toLowerCase()) ||
        ( user.evaluationStatus?.toLowerCase().includes(query.toLowerCase()))
      );
    });
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  };



  if (errorMessage) {
    return (
      <BaseLayout1>
        <div className="min-h-screen p-2">{errorMessage}</div>
      </BaseLayout1>
    );
  }

  return (
    <BaseLayout1>
      <div className={`min-h-screen p-4 bg-[#EDEDED]`}>
        <div className="flex justify-between items-center">
            <div className='flex items-center space-x-2'>
              <h2 className="text-[18px] font-semibold">Scheduled Evaluation Session</h2>
              <button className="bg-gray-800 text-white p-[4px] rounded-full shadow-2xl" onClick={handleSyncClick}>
                <FaSyncAlt />
              </button>
            </div>
        </div>
        <div className={`p-6 rounded-lg bg-[#EDEDED]`}>
          <div className="flex justify-between items-center mb-2">
            <div className="flex flex-1 items-center justify-between">
              <div className='flex'>
                <input
                  type="text"
                  placeholder="Search here..."
                  className={`border rounded-lg px-2 text-[13px] mr-4 shadow`}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <button 
                  onClick={() => setIsFilterModalOpen(true)}
                  className="flex items-center bg-gray-200 p-2 rounded-lg text-[12px] shadow"
                >
                  <FaFilter className="mr-2" /> Filter
                </button>
              </div>
              <div className='flex'>
                <button 
                  onClick={() => openModal(null)}
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
          <table className="min-w-full rounded-lg shadow bg-white" style={{ width: '100%', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th className="p-3 text-[12px] text-center" style={{ width: '24%' }}>Trail ID</th>
                <th className="p-3 text-[12px] text-center" style={{ width: '25%' }}>Student Name</th>
                <th className="p-3 text-[12px] text-center" style={{ wordWrap: 'break-word', width: '35%' }}>Email</th>
                <th className="p-3 text-[12px] text-center" style={{ width: '12%' }}>Mobile</th>
                <th className="p-3 text-[12px] text-center" style={{ width: '10%' }}>Country</th>
                <th className="p-3 text-[12px] text-center" style={{ width: '10%' }}>Course</th>
                <th className="p-3 text-[12px] text-center" style={{ width: '10%' }}>Preferred Teacher</th>
                <th className="p-3 text-[12px] text-center" style={{ width: '10%' }}>Time</th>
                <th className="p-3 text-[12px] text-center" style={{ width: '15%' }}>Evaluation Status</th>
                <th className="p-3 text-[12px] text-center" style={{ width: '8%' }}>Status</th>
                <th className="p-3 text-[12px] text-center" style={{ width: '10%' }}>Action</th>
                
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={item.studentId || index} className={`border-t`}>
                    <td className="p-2 px-6 text-[11px] text-start">{item.studentId}</td>
                    <td className="p-2 text-[11px] text-center">
                      {item.fname} {item.lname}
                    </td>
                    <td className="p-2 text-[11px] text-center" style={{ wordWrap: 'break-word', width: '5%' }}>{item.email}</td>
                    <td className="p-2 text-[11px] text-center">{item.number}</td>
                    <td className="p-2 text-[11px] text-center">{item.country}</td>
                    <td className="p-2 text-[11px] text-center">{item.course}</td>
                    <td className="p-2 text-[11px] text-center">{item.preferredTeacher}</td>
                    <td className="p-2 text-[11px] text-center">{item.time}</td>
                    <td className="p-2 text-[11px] text-center">
                      <span className={` text-[10px] text-center py-1 px-4 rounded-3xl ${
                        item.evaluationStatus === 'PENDING' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.evaluationStatus ?? 'PENDING'}
                      </span>
                    </td>
                    <td className="p-2 text-[11px] text-center">
                      <span className={`px-2 text-[11px] text-center py-1 rounded-2xl ${
                        item.status === 'Active' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.status ?? 'Active'}
                      </span>
                    </td>
                    <td className="p-2 px-8">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="bg-gray-800 hover:cursor-pointer text-center text-white p-2 rounded-lg shadow hover:bg-gray-900"
                      >
                        <FaEdit size={10}/>
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
            user={{
              ...selectedUserData,
              city: selectedUserData.city ?? '', // Provide a default value for city if undefined
            }}
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