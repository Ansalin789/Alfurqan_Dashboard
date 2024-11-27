'use client'

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaSyncAlt, FaFilter, FaPlus, FaEdit } from 'react-icons/fa';
import BaseLayout1 from '@/components/BaseLayout1';
import AddStudentModal from '@/components/Academic/AddStudentModel';


// Define the return type of the getAllUsers function
interface User {
  trailId: string;
  fname: string;
  lname: string;
  number: string;
  country: string;
  course: string;
  preferredTeacher: string;
  date: string;
  time: string;
}

interface GetAllUsersResponse {
  success: boolean;
  data: User[];
  message?: string; // Make message optional
}

// Mock implementation of getAllUsers function
const getAllUsers = async (): Promise<GetAllUsersResponse> => {
  // Replace with actual API call
  return {
    success: true,
    data: [
      {
        trailId: '1',
        fname: 'John',
        lname: 'Doe',
        number: '1234567890',
        country: 'USA',
        course: 'Math',
        preferredTeacher: 'Mr. Smith',
        date: '2024-12-01',
        time: '10:00 AM',
      },
      // Add more user objects as needed
    ],
    message: 'Users fetched successfully', // Example message
  };
};

const TrailManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      const allData = await getAllUsers();
      if (allData.success && allData.data) {
        setUsers(allData.data);
      } else {
        setErrorMessage(allData.message ?? 'Failed to fetch users');
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
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
      <div className={`min-h-screen p-4 rounded-lg shadow mt-5 ${darkMode ? 'bg-[#111317] text-[#ffffff]' : 'bg-gray-100 text-gray-800'}`}>
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
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-[#24282D] text-[#000]' : 'bg-white text-gray-800'}`}>
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
                <button onClick={openModal} className={`border p-2 rounded-lg shadow flex items-center mx-4 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}>
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
          <table className={`min-w-full rounded-lg shadow ${darkMode ? 'bg-[#1f222a] text-white' : 'bg-gray-100 text-gray-800'}`}>
            <thead>
              <tr>
                <th className="p-4 text-left">Trail ID</th>
                <th className="p-4 text-left">Student Name</th>
                <th className="p-4 text-left">Mobile</th>
                <th className="p-4 text-left">Country</th>
                <th className="p-4 text-left">Course</th>
                <th className="p-4 text-left">Preferred Teacher</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Time</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody> 
              {users.map((item, index) => (
                <tr key={index} className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                  <td className="p-4">{item.trailId}</td>
                  <td className="p-4">{item.fname} {item.lname}</td>
                  <td className="p-4">{item.number}</td>
                  <td className="p-4">{item.country}</td>
                  <td className="p-4">{item.course}</td>
                  <td className="p-4">{item.preferredTeacher}</td>
                  <td className="p-4">{item.date}</td>
                  <td className="p-4">{item.time}</td>
                  <td className="p-4">
                    <button className="bg-blue-500 text-white p-2 rounded-lg shadow">
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AddStudentModal isOpen={isModalOpen} onRequestClose={closeModal} />
    </BaseLayout1>
  );
};

export default TrailManagement;