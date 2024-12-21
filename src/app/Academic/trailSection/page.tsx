"use client"

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaSyncAlt, FaFilter, FaPlus, FaEdit } from 'react-icons/fa';
import BaseLayout1 from '@/components/BaseLayout1';

import { useRouter } from 'next/navigation';
import AddEvaluationModal from '@/components/Academic/AddEvaluationModel';

// Updated function to fetch users from the new API endpoint
const getAllUsers = async (): Promise<{success: boolean; data: any[]; message: string}> => {
  try {
    const response = await fetch('http://localhost:5001/evaluationlist');
    // Check for response.ok to handle HTTP errors
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawData = await response.json();
    // Ensure rawData has the expected structure
    if (!rawData || !rawData.evaluation || !Array.isArray(rawData.evaluation)) {
      throw new Error('Invalid data structure received from API');
    }

    // Transform API data to match User interface
    const transformedData = rawData.evaluation.map((item: {
      
      _id: string;
      student: {
        learningInterest: any; 
        studentId: string; 
        studentFirstName: string; 
        studentLastName: string; 
        studentPhone: number; 
        studentCountry: string; 
        preferredTeacher: string; 
        preferredFromTime: string; 
        preferredToTime: string; 
        evaluationStatus?: string; 
        status?: string; 
        trialClassStatus: string;
      }; 
      trialClassStatus: string;
      // Add other fields as necessary
    }) => ({
      _id: item._id,
      studentId: item.student.studentId,
      studentFirstName: item.student.studentFirstName,
      studentLastName: item.student.studentLastName,
      number: item.student.studentPhone ? item.student.studentPhone.toString() : '',
      country: item.student.studentCountry,
      course: item.student.learningInterest, // Assuming this field exists in the new structure
      preferredTeacher: item.student.preferredTeacher,
      time: item.student.preferredFromTime,
      evaluationStatus: item.student.evaluationStatus,
      status: item.student.status,
      trialClassStatus: item.trialClassStatus
    }));

    console.log(">>>>transformedData", transformedData)

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




const trailSection = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false); 
  const [formData, setFormData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  


    
  const router = useRouter();
  const handleSyncClick = async () => {
    setIsLoading(true);
    if (router) {
      await router.push('trailManagement');
    } else {
      console.error('Router is not available');
    }
    setIsLoading(false);
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

const handleClick = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:5001/evaluationlist/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Set the form data with the fetched user data
    setFormData({
      
      firstName: data.student.studentFirstName,
      lastName: data.student.studentLastName,
      email: data.student.studentEmail,
      phoneNumber: data.student.studentPhone.toString(),
      city: data.gardianCity,
      country: data.student.studentCountry,
      language: data.gardianLanguage,
      preferredTime: `${data.classStartTime} to ${data.classEndTime}`,
      trailId: data._id,
      course: data.student.learningInterest,
      preferredTeacher: data.student.preferredTeacher,
      level: data.languageLevel,
      preferredDate: data.student.preferredDate,
      selectedTeacher: data.student.preferredTeacher,
      subscriptionName: data.subscription.subscriptionName,
      guardianName: data.gardianName,
      guardianEmail: data.gardianEmail,
      guardianPhone: data.gardianPhone,
      trialClassStatus: data.trialClassStatus,
      evaluationStatus: data.student.evaluationStatus,
      comment: '',
    });

    // Open the modal after setting the form data
    setShowModal(true);
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

  const handleCloseModal = () => {
    setShowModal(false);
  };
  // Add filter handling functionF
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



  const updateClick = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5001/evaluationlist/${id}`);

      console.log("response",response)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // const data = await response.json();
      
      // // Set the form data with the fetched user data
      // setFormData({
        
      //   firstName: data.student.studentFirstName,
      //   lastName: data.student.studentLastName,
      //   email: data.student.studentEmail,
      //   phoneNumber: data.student.studentPhone.toString(),
      //   city: data.gardianCity,
      //   country: data.student.studentCountry,
      //   language: data.gardianLanguage,
      //   preferredTime: `${data.classStartTime} to ${data.classEndTime}`,
      //   trailId: data._id,
      //   course: data.student.learningInterest,
      //   preferredTeacher: data.student.preferredTeacher,
      //   level: data.languageLevel,
      //   preferredDate: data.student.preferredDate,
      //   selectedTeacher: data.student.preferredTeacher,
      //   subscriptionName: data.subscription.subscriptionName,
      //   guardianName: data.gardianName,
      //   guardianEmail: data.gardianEmail,
      //   guardianPhone: data.gardianPhone,
      //   trialClassStatus: data.trialClassStatus,
      //   evaluationStatus: data.student.evaluationStatus,
      //   comment: '',
      // });
  
      // Open the modal after setting the form data
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };











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

  if (errorMessage) {
    return (
      <BaseLayout1>
        <div className="min-h-screen p-4">{errorMessage}</div>
      </BaseLayout1>
    );
  }

  return (
    <BaseLayout1>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white">Loading...</div>
        </div>
      )}
      <div className={`min-h-screen p-4 bg-[#EDEDED]`}>
        <div className="flex justify-between items-center">
            <div className='flex items-center space-x-2'>
              <h2 className="text-[20px] font-semibold">Scheduled Trail Session</h2>
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
          <table className={`min-w-full rounded-lg shadow bg-white`} style={{ width: '100%', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th className="p-3 text-[12px] text-center"style={{ width: '24%' }}>Trail ID</th>
                <th className="p-3 text-[12px] text-center"style={{ width: '20%' }}>Student Name</th>
                <th className="p-3 text-[12px] text-center"style={{ width: '15%' }}>Mobile</th>
                <th className="p-3 text-[12px] text-center"style={{ width: '12%' }}>Country</th>
                <th className="p-3 text-[12px] text-center"style={{ width: '13%' }}>Course</th>
                <th className="p-3 text-[12px] text-center"style={{ width: '10%' }}>Preferred Teacher</th>
                <th className="p-3 text-[12px] text-center"style={{ width: '18%' }}>Assigned Teacher</th>

                <th className="p-3 text-[12px] text-center"style={{ width: '14%' }}>Time</th>
                <th className="p-3 text-[12px] text-center"style={{ width: '15%' }}>Class Status</th>
                <th className="p-3 text-[12px] text-center"style={{ width: '15%' }}>Student Status</th>
                <th className="p-3 text-[12px] text-center"style={{ width: '10%' }}>Action</th>
                {/* <th
                    className="shadow-md p-2 text-left font-medium text-gray-700"
                >
                </th> */}
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={item._id || index} className={`border-t`}>
                    <td className="p-2 px-6 text-[11px] text-center">{item._id}</td>
                    <td className="p-2 text-[11px] text-center">{item.studentFirstName} {item.studentLastName}</td>
                    <td className="p-2 text-[11px] text-center">{item.number}</td>
                    <td className="p-2 text-[11px] text-center">{item.country}</td>
                    <td className="p-2 text-[11px] text-center">{item.course}</td>
                    <td className="p-2 text-[11px] text-center">{item.preferredTeacher}</td>
                    <td className="p-2 text-[11px] text-center">{item.AssignedTeacher}</td>
                    <td className="p-2 text-[11px] text-center">{item.time}</td>
                    <td className="p-2 text-[11px] text-center">
                      <span className={`px-2 text-[11px] text-center py-1 rounded-full ${
                        item.evaluationStatus === 'PENDING' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.evaluationStatus ?? 'PENDING'}
                      </span>
                    </td>
                    <td className="p-2 text-[11px] text-center">
                      <span className={`px-2 text-[13px] text-center py-1 rounded-full ${
                        item.status === 'Active' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.status ?? 'Active'}
                      </span>
                    </td>
                    <td className="p-2 px-8">
                      <button
                        onClick={() => handleClick(item._id)}
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


      </Modal>
      <AddEvaluationModal
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

{showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-[80%] max-w-3xl h-[720px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Student Details</h3>
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={handleCloseModal}
              >
                ✖
              </button>
            </div>
            <form className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-black text-xs font-medium">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName} // Bind to formData
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-black text-xs font-medium">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName} // Bind to formData
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-black text-xs font-medium">Email</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email} // Bind to formData
                  readOnly
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-black text-xs font-medium">Phone Number</label>
                <input
                  id="phoneNumber"
                  type="number"
                  value={formData.phoneNumber} // Bind to formData
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-black text-xs font-medium">City</label>
                <input
                  id="city"
                  type="text"
                  value={formData.city} // Bind to formData
                  readOnly
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-black text-xs font-medium">Country</label>
                <input
                  id="country"
                  type="text"
                  value={formData.country} // Bind to formData
                  readOnly
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="language" className="block text-black text-xs font-medium">Language</label>
                <input
                  id="language"
                  type="text"
                  value={formData.language} // Bind to formData
                  readOnly
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="preferredTime" className="block text-black text-xs font-medium">Preferred Time</label>
                <input
                  id="preferredTime"
                  type="text"
                  value={formData.preferredTime} // Bind to formData
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="trailId" className="block text-black text-xs font-medium">Trail ID</label>
                <input
                  id="trailId"
                  type="text"
                  value={formData.trailId} // Bind to formData
                  readOnly
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="course" className="block text-black text-xs font-medium">Course</label>
                <input
                  id="course"
                  type="text"
                  value={formData.course} // Bind to formData
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="preferredTeacher" className="block text-black text-xs font-medium">Preferred Teacher</label>
                <input
                  id="preferredTeacher"
                  type="text"
                  value={formData.preferredTeacher} // Bind to formData
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="level" className="block text-black text-xs font-medium">Level</label>
                <input
                  id="level"
                  type="text"
                  value={formData.level} // Bind to formData
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="preferredDate" className="block text-black text-xs font-medium">Preferred Date</label>
                <input
                  id="preferredDate"
                  type="date"
                  value={formData.preferredDate} // Bind to formData
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="preferredHours" className="block text-black text-xs font-medium">Preferred Hours</label>
                <input
                  id="preferredHours"
                  type="text"
                  value={formData.preferredTime} // Bind to formData
                  readOnly
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="preferredPackage" className="block text-black text-xs font-medium">Preferred package</label>
                <input
                  id="preferredPackage"
                  type="text"
                  value={formData.subscriptionName} // Check if subscription exists
                  readOnly
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="guardianName" className="block text-black text-xs font-medium">Guardian's name</label>
                <input
                  id="guardianName"
                  type="text"
                  value={formData.guardianName} // Bind to formDat
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="guardianEmail" className="block text-black text-xs font-medium">Guardian's email</label>
                <input
                  id="guardianEmail"
                  type="email"
                  value={formData.guardianEmail} // Bind to formData
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="guardianPhone" className="block text-black text-xs font-medium">Guardian's phone number</label>
                <input
                  id="guardianPhone"
                  type="text"
                  value={formData.guardianPhone} // Bind to formData
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="trialClassStatus" className="block text-black text-xs font-medium">Trail Class Status</label>
                <input
                  id="trialClassStatus"
                  type="text"
                  value={formData.trialClassStatus} // Bind to formData
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>

              <div>
                <label htmlFor="evaluationStatus" className="block text-black text-xs font-medium">Evaluation status</label>
                <input
                  id="evaluationStatus"
                  type="text"
                  value={formData.evaluationStatus} // Bind to formData
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-800"
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="comment" className="block text-black text-xs font-medium">Comment</label>
                <textarea
                  id="comment"
                  placeholder="Write your comment here..."
                  value={formData.comment} // Bind to formData
                  className="w-full mt-2 border rounded-md text-xs text-gray-800"
                ></textarea>
              </div>
              {/* Save and Cancel Buttons */}
              <div className="col-span-2 flex justify-end space-x-4 mt-0">
                <button
                  type="button"
                  className="px-4 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-800"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                 onClick={() => updateClick(item._id)}
                  type="submit"
                  className="px-4 py-1 bg-[#223857] text-white rounded-md hover:bg-[#1c2f49]"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </BaseLayout1>
  );
};

export default trailSection
