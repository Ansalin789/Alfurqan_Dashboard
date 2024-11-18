'use client';

import BaseLayout1 from '@/components/BaseLayout1';
import React, { useState, useEffect } from 'react';
import { FaFilter, FaPlus, FaEdit, FaSyncAlt, FaChevronDown, FaUserCircle, FaBell } from 'react-icons/fa';
import ToggleSwitch from '@/components/ToggleSwitch';

// Define the User type
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

const TrailManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const allData = await getAllUsers();
      if (allData.success && allData.data) {
        setUsers(allData.data);
      } else {
        setErrorMessage(allData.message || 'Failed to fetch users');
      }
    };

    fetchData();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
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
      <div className={`min-h-screen p-4 rounded-lg shadow mt-5 ${darkMode ? 'bg-[#000] text-[#ffffff]' : 'bg-gray-100 text-gray-800'}`}>
        <div className="flex justify-between items-center mb-6">
          <div className='flex items-center space-x-2'>
            <h2 className="text-2xl font-semibold">Scheduled Evaluation Session</h2>
            <button className="bg-gray-800 text-white p-2 rounded-full shadow">
              <FaSyncAlt />
            </button>
          </div>
          <div className="flex items-center space-x-4">
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
          </div>
        </div>
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-[#111317] text-[#000]' : 'bg-white text-gray-800'}`}>
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
                <button className={`border p-2 rounded-lg shadow flex items-center mx-4 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}>
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
    </BaseLayout1>
  );
};

export default TrailManagement;
