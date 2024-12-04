'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}

interface PopupProps {
  isOpen: boolean;
  onRequestClose: () => void;
  user: any; // Update this type based on your user object structure
  onSave: (formData: any) => void; // Update this type based on your save function
}

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

const Popup: React.FC<PopupProps> = ({
  isOpen,
  onRequestClose,
  user,
  onSave,
}) => {
  const [formData, setFormData] = useState<User>({
    trailId: '',
    fname: '',
    lname: '',
    email: '',
    number: '',
    country: '',
    course: '',
    preferredTeacher: '',
    date: '',
    time: '',
    evaluationStatus: 'PENDING',
  });

  const [users, setUsers] = useState<User[]>([]);

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

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getAllUsers();
      if (result.success) {
        setUsers(result.data);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const router = useRouter();
  
  const handleStart = () => {
    router.push('/evaluation');
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
    >
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl p-8 w-[800px] max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#293552] to-[#1e273c] text-transparent bg-clip-text">
              {user ? 'Edit Student' : 'Start Evaluation'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button 
              className="bg-gradient-to-r from-[#293552] to-[#1e273c] text-white px-5 py-2 rounded-lg
                         hover:shadow-lg transition-all duration-300 text-sm font-medium
                         flex items-center gap-2 transform hover:translate-y-[-1px]" 
              onClick={handleStart}
            >
              <span>Start Evaluation</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button 
              onClick={onRequestClose} 
              className="text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all duration-300"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>
        {users.map((user) => (
        <form onSubmit={handleSubmit} key={user.trailId} className="space-y-6">
          <div className="grid grid-cols-3 gap-5">
            <div className="form-group">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">First Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="fname"
                  value={user.fname}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm
                           transition-all duration-300 ease-in-out
                           focus:border-[#293552] focus:ring-2 focus:ring-[#293552]/20 focus:outline-none
                           hover:border-[#293552]/50"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-0 transition-opacity duration-300 group-focus-within:opacity-100">
                  <div className="w-1 h-1 bg-[#293552] rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lname"
                value={user.lname}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="number"
                value={user.number}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={user.city}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Country</label>
              <input
                type="text"
                name="country"
                value={user.country}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Trial ID</label>
              <input
                type="text"
                name="trailId"
                value={user.trailId}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">How Many Students</label>
              <input
                type="number"
                name="students"
                value={user.students}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Preferred Teacher</label>
              <input
                type="text"
                name="preferredTeacher"
                value={user.preferredTeacher}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Course</label>
              <select
                name="course"
                value={user.course}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
                required
              >
                <option value="">Select Course</option>
                <option value="Quran">Quran</option>
                <option value="Islamic Studies">Islamic Studies</option>
                <option value="Arabic">Arabic</option>
              </select>
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={user.date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Time</label>
              <input
                type="text"
                name="time"
                value={user.time}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Evaluation Status</label>
              <select
                name="evaluationStatus"
                value={user.evaluationStatus}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              >
                <option value="PENDING">PENDING</option>
                <option value="IN PROGRESS">IN PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#293552] to-[#1e273c] text-white px-5 py-3 rounded-lg
                       hover:shadow-lg transition-all duration-300 text-sm font-medium
                       flex items-center justify-center gap-2 transform hover:translate-y-[-1px]"
          >
            <span>Save Changes</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
        ))}

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Users</h3>
          <ul className="mt-4 space-y-2">
            {users.map((user) => (
              <li key={user.trailId} className="flex justify-between items-center p-3 bg-white shadow rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.fname} {user.lname}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <p className="text-sm text-gray-600">{user.course}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default Popup;
