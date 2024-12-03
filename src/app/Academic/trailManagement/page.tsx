'use client'

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaSyncAlt, FaFilter, FaPlus, FaEdit } from 'react-icons/fa';
import BaseLayout1 from '@/components/BaseLayout1';
import AddStudentModal from '@/components/Academic/AddStudentModel';
import Popup from '@/components/Academic/Popup';
import { createPortal } from 'react-dom';


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
    const transformedData = rawData.students.map((item: any) => ({
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

const TrailManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState<User | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const togglePopup = (user: User) => {
    setSelectedUser(user);
    setIsPopupOpen(!isPopupOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allData = await getAllUsers();
        console.log('Fetched data:', allData); // Debug log
        
        if (allData.success && allData.data) {
          console.log('Setting users:', allData.data);
          setUsers(allData.data);
        } else {
          console.error('Failed to fetch:', allData.message);
          setErrorMessage(allData.message ?? 'Failed to fetch users');
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
        setErrorMessage('An unexpected error occurred');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    Modal.setAppElement('body');
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const openModal = (user: User | null = null) => {
    setSelectedUser(user);
    setIsEditMode(!!user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUserData(user);
    setModalIsOpen(true);
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
      <div className={`min-h-screen p-4 bg-[#EDEDED] mt-5 ${darkMode ? 'bg-[#111317] text-[#ffffff]' : 'bg-gray-100 text-gray-800'}`}>
        <div className="flex justify-between items-center mb-6">
          <div className='flex items-center space-x-2'>
            <h2 className="text-2xl font-semibold">Scheduled Evaluation Session</h2>
            <button className="bg-gray-800 text-white p-2 rounded-full shadow">
              <FaSyncAlt />
            </button>
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
        <div className={`p-6 rounded-lg bg-[#EDEDED] overflow-y-scroll h-[600px] ${darkMode ? 'bg-[#24282D] text-[#000]' : 'bg-white text-gray-800'}`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-1 space-x-4 items-center justify-between">
              <div className='flex'>
                <input
                  type="text"
                  placeholder="Search here..."
                  className={`border rounded-lg p-2 mx-4 shadow ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
                />
                <button className="flex items-center bg-gray-200 p-2 rounded-lg shadow">
                  <FaFilter className="mr-2" /> Filter
                </button>
              </div>
              <div className='flex'>
                <button 
                  onClick={() => openModal(null)}
                  className={`border p-2 rounded-lg shadow flex items-center mx-4 ${
                    darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-800 text-white border-gray-300'
                  }`}
                >
                  <FaPlus className="mr-2" /> Add new
                </button>
                <select className={`border rounded-lg p-2 shadow ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}>
                  <option>Duration: Last month</option>
                  <option>Duration: Last week</option>
                  <option>Duration: Last year</option>
                </select>
              </div>
            </div>
          </div>
          <table className={`min-w-full rounded-lg shadow ${darkMode ? 'bg-[#1f222a] text-white' : 'bg-[#fff] p-4 text-gray-800'}`}>
            <thead>
              <tr>
                <th className="p-4 text-[13px] text-center">Trail ID</th>
                <th className="p-4 text-[13px] text-center">Student Name</th>
                <th className="p-4 text-[13px] text-center">Email</th>
                <th className="p-4 text-[13px] text-center">Mobile</th>
                <th className="p-4 text-[13px] text-center">Country</th>
                <th className="p-4 text-[13px] text-center">Course</th>
                <th className="p-4 text-[13px] text-center">Preferred Teacher</th>
                <th className="p-4 text-[13px] text-center">Time Slot</th>
                <th className="p-4 text-[13px] text-center">Status</th>
                <th className="p-4 text-[13px] text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((item, index) => (
                  <tr key={item.trailId || index} className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                    <td className="p-2 text-[13px] text-center">{item.trailId}</td>
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
                        {item.evaluationStatus || 'PENDING'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="bg-gray-800 hover:cursor-pointer text-center text-white p-2 rounded-lg shadow hover:bg-blue-600"
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
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <h2>Edit User</h2>
        {selectedUserData && (
          <div>
            <Popup isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} userData={selectedUserData} />
          </div>
        )}
        <button onClick={() => setModalIsOpen(false)}>Close</button>
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
    </BaseLayout1>
  );
};

export default TrailManagement;