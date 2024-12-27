'use client'

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaFilter, FaPlus } from 'react-icons/fa';
import BaseLayout1 from '@/components/BaseLayout1';
import { useRouter } from 'next/navigation';
import AddTrailStudentModal from '@/components/Academic/AddTrailStudentModel';



// Define the return type of the getAllUsers function
interface User {
  trailId: string;
  fname: string;
  lname: string;
  email: string;
  number: string;
  country: string;
  course: string;
  preferredTeacher: string;
  date: string;
  time: string;
  evaluationStatus?: string;
}

interface GetAllUsersResponse {
  success: boolean;
  data: User[];
  message?: string; // Make message optional
}

//Update the getAllUsers function to fetch from your API
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
      trailId: item._id,
      fname: item.firstName,
      lname: item.lastName,
      email: item.email,
      number: item.phoneNumber.toString(),
      country: item.country,
      course: item.learningInterest,
      preferredTeacher: item.preferredTeacher,
      date: new Date(item.startDate).toLocaleDateString(),
      time: `${item.preferredFromTime} - ${item.preferredToTime}`,
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

//Define a type for filters
interface Filters {
  country: string;
  course: string;
  teacher: string;
  status: string;
}

// Update the FilterModal component
const FilterModal = ({ 
  isOpen, 
  onClose,
  onApplyFilters, 
  users 
}: { 
  isOpen: boolean;  
  onClose: () => void; 
  onApplyFilters: (filters: Filters) => void; // Updated type
  users: User[];
}) => {
  const [filters, setFilters] = useState<Filters>({
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </Modal>
  );
};

const TrailManagement = () => {
  const [users, setUsers] = useState({ totalCount: 0, students: [] });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  console.log(setItemsPerPage);


  const router = useRouter();
  const handleSyncClick = (student: any) => {
  // if (student && student.studentId) {
  //   // Your logic to handle the click
  //   const studentId = student.studentId; // Use studentId
    router.push('/managestudentview');
  // } else {
  //   console.error('Student data is not available');
  // }
};
const handleSyncClick = (studentId) => {
  if (router) {
  router.push('managestudentview');
  console.log(studentId);
  localStorage.setItem('studentManageID',studentId);
  } else {
  console.error('Router is not available');
  }
};



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
      } catch {
        setErrorMessage('An unexpected error occurred'); // Set error message for UI
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
    } catch {
      setErrorMessage('An unexpected error occurred');
    }
  };

  //Update the handleApplyFilters function
  const handleApplyFilters = (filters: Filters) => { // Updated type
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

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedUsers(filteredUsers.map(user => user.trailId));
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

  if (errorMessage) {
    return (
      <BaseLayout1>
        <div className="min-h-screen p-4">{errorMessage}</div>
      </BaseLayout1>
    );
  }
  const userset=async()=>{
    try {
      const response = await fetch('http://localhost:5001/alstudents');
      const data = await response.json();
      setUsers(data);
      console.log(data);
    }
    catch{
           console.log("Error fetching data");
    }
   };
   useEffect(()=>{
    userset();
   },[]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5001/alstudents");
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
          {/* <div className="flex items-center space-x-4">
            <ToggleSwitch darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <button className={`bg-gray-200 p-2 rounded-full shadow ${darkMode ? 'bg-[#1f222a] text-[#fff]' : 'bg-white text-gray-800'}`}>
              <FaBell />
            </button>
            <div className="flex items-center space-x-2">
              <FaUserCircle className="text-2xl" />
              <span>Harsh</span>
              <button className={`bg-gray-200 p-2 rounded-full shadow ${darkMode ? 'bg-[#1f222a] text-[#fff]' : 'bg-white text-gray-800'}`}>
                <FaChevronDown />
              </button>
            </div>
          </div> */}
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
                  onClick={() => setIsFilterModalOpen(true)}
                  className="flex items-center bg-gray-200 p-2 rounded-lg shadow"
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
        <td className="p-2 text-[11px] text-center">-</td>
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