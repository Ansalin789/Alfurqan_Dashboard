'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';


if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}

interface User {
  fname: string;
  lname: string;
  email: string;
  number: string;
  city: string;
  country: string;
  trailId: string;
  students: string;
  preferredTeacher: string;
  course: string;
  date: string;
  time: string;
  evaluationStatus: string;
  comment: string;
}

interface AddStudentModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  user?: User | null;
  onSave?: (user: User) => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onRequestClose,
  user,
  onSave,
}) => {
  const [formData, setFormData] = useState<User>({
    fname: '',
    lname: '',
    email: '',
    number: '',
    city: '',
    country: '',
    trailId: '',
    students: '',
    preferredTeacher: '',
    course: '',
    date: '',
    time: '',
    evaluationStatus: '',
    comment: '',
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour.toString().padStart(2, '0')}:${minutes} ${ampm}`;
      };

      const studentData = {
        firstName: formData.fname.trim(),
        lastName: formData.lname.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: parseInt(formData.number.replace(/\D/g, '')),
        country: formData.country.trim(),
        countryCode: "+1",
        learningInterest: formData.course as "Quran" | "Islamic Studies" | "Arabic",
        numberOfStudents: parseInt(formData.students),
        preferredTeacher: formData.preferredTeacher as "Male" | "Female" | "Either",
        preferredFromTime: formatTime(formData.time),
        preferredToTime: formatTime(formData.time),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        referralSource: "Other" as "Friend" | "Social Media" | "E-Mail" | "Google" | "Other",
        startDate: formData.date,
        evaluationStatus: (formData.evaluationStatus || "PENDING") as "PENDING" | "INPROGRESS" | "COMPLETED",
        status: "Active" as "Active" | "Inactive" | "Deleted",
        createdBy: "SYSTEM",
        lastUpdatedBy: "SYSTEM",
        createdDate: new Date().toISOString(),
        lastUpdatedDate: new Date().toISOString()
      };

      if (!studentData.firstName || studentData.firstName.length < 3) {
        throw new Error('First name must be at least 3 characters long');
      }
      if (!studentData.lastName || studentData.lastName.length < 1) {
        throw new Error('Last name is required');
      }
      if (!studentData.email || !/\S+@\S+\.\S+/.test(studentData.email)) {
        throw new Error('Valid email is required');
      }
      if (!studentData.phoneNumber || studentData.phoneNumber.toString().length < 10) {
        throw new Error('Phone number must be at least 10 digits');
      }

      console.log('Sending data:', studentData);

      const response = await fetch('http://localhost:5001/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      const responseData = await response.json();
      console.log('Response:', response.status, responseData);

      if (!response.ok) {
        throw new Error(`Server error: ${responseData.message || 'Unknown error'}`);
      }

      if (onSave) {
        onSave(formData);
      }
      onRequestClose();
      alert('Student saved successfully!');
    } catch (error) {
      console.error('Error details:', error);
      alert(`Failed to save student: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
              {user ? 'Edit Student' : 'Add Student'}
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-3 gap-5">
            <div className="form-group">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">First Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="fname"
                  value={formData.fname}
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
                value={formData.lname}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Trial ID</label>
              <input
                type="text"
                name="trailId"
                value={formData.trailId}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">How Many Students</label>
              <input
                type="number"
                name="students"
                value={formData.students}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Preferred Teacher</label>
              <select
                name="preferredTeacher"
                value={formData.preferredTeacher}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
                required
              >
                <option value="">Select Teacher</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Either">Either</option>
              </select>
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Course</label>
              <select
                name="course"
                value={formData.course}
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
              <label className="block mb-1 text-xs font-medium text-gray-700">Preferred Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Preferred Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-1 text-xs font-medium text-gray-700">Evaluation Status</label>
              <select
                name="evaluationStatus"
                value={formData.evaluationStatus}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
                required
              >
                <option value="PENDING">Pending</option>
                <option value="INPROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-700">Comment</label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none resize-none h-[38px]"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4 gap-2">
            <button
              type="button"
              onClick={onRequestClose}
              className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#293552] text-white rounded-lg hover:bg-[#1e273c] text-sm"
            >
              {user ? 'Save Changes' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddStudentModal;
