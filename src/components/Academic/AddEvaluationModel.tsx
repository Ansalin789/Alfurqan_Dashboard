'use client';

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
// import { useRouter } from 'next/navigation';



if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}

interface User {
  [key: string]: any;
  trailId?: string;
  student: {
    studentFirstName: string;
    studentLastName: string;
    studentEmail: string;
    studentPhone: number;
    studentCountry: string;
    studentCity?: string;
    studentLanguage?: string;
    studentCountryCode: string;
    learningInterest: "Quran" | "Islamic Studies" | "Arabic";
    numberOfStudents: number;
    preferredTeacher: "Male" | "Female" | "Either";
    preferredFromTime: string;
    preferredToTime: string;
    timeZone: string;
    referralSource: "Friend" | "Social Media" | "E-Mail" | "Google" | "Other";
    preferredDate: string;
    evaluationStatus: "PENDING" | "INPROGRESS" | "COMPLETED";
    status: "Active" | "Inactive" | "Deleted";
  };
  isLanguageLevel: boolean;
  languageLevel: string;
  isReadingLevel: boolean;
  readingLevel?: string;
  isGrammarLevel: boolean;
  grammarLevel: string;
  hours: number;
  subscription: {
    subscriptionName: string;
    subscriptionPricePerHr: number;
    subscriptionDays: number;
    subscriptionStartDate: Date;
    subscriptionEndDate: Date;
  };
  planTotalPrice: number;
  classStartDate: Date;
  classEndDate?: Date;
  classStartTime: string;
  classEndTime: string;
  gardianName: string;
  gardianEmail: string;
  gardianPhone: string;
  gardianCity: string;
  gardianCountry: string;
  gardianTimeZone: string;
  gardianLanguage: string;
  studentStatus?: string;
  classStatus?: string;
  comment?: string;
}


interface AddEvaluationModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  userData?: User | null;
  isEditMode: boolean;
  onSave: () => void;
}

const AddEvaluationModal: React.FC<AddEvaluationModalProps> = ({
  isOpen,
  onRequestClose,
  userData,
  isEditMode,
  onSave,
}) => {
  const [formData, setFormData] = useState<User>({
    student: {
      studentFirstName: '',
      studentLastName: '',
      studentEmail: '',
      studentPhone: 0,
      studentCountry: '',
      studentCity: '',
      // studentLanguage: '',
      studentCountryCode: '',
      learningInterest: "Quran",
      numberOfStudents: 0,
      preferredTeacher: "Either",
      preferredFromTime: '',
      preferredToTime: '',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referralSource: "Other",
      preferredDate: new Date().toISOString(),
      evaluationStatus: "PENDING",
      status: "Active"
    },
    isLanguageLevel: false,
    languageLevel: '',
    isReadingLevel: false,
    readingLevel: '',
    isGrammarLevel: false,
    grammarLevel: '',
    hours: 0,
    subscription: {
      subscriptionName: 'Basic',
      subscriptionPricePerHr: 0,
      subscriptionDays: 0,
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(),
    },
    planTotalPrice: 0,
    classStartDate: new Date(),
    classStartTime: '',
    classEndTime: '',
    gardianName: '',
    gardianEmail: '',
    gardianPhone: '',
    gardianCity: '',
    gardianCountry: '',
    gardianTimeZone: '',
gardianLanguage: '',        
    studentStatus: '',
    comment: ''
  });

  useEffect(() => {
    if (userData) {
      setFormData(userData);
    }
  }, [userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const evaluationData = {
        ...formData,
        student: {
          ...formData.student,
          studentFirstName: formData.student.studentFirstName.trim(),
          studentLastName: formData.student.studentLastName.trim(),
          studentEmail: formData.student.studentEmail.trim().toLowerCase(),
          studentPhone: Number(formData.student.studentPhone),
          preferredFromTime: formatTimeToAMPM(formData.student.preferredFromTime),
          preferredToTime: formatTimeToAMPM(formData.student.preferredToTime),
          createdDate: new Date().toISOString(),
        },
        hours: Number(formData.hours),
        createdDate: new Date().toISOString(),
        createdBy: "SYSTEM",
      };

      if (!evaluationData.student.studentFirstName || evaluationData.student.studentFirstName.length < 3) {
        throw new Error('First name must be at least 3 characters long');
      }

      const response = await fetch('http://localhost:5001/evaluation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(evaluationData),
      });

      const responseData = await response.json();
      console.log('Response:', response.status, responseData);

      if (!response.ok) {
        throw new Error(`Server error: ${responseData.message || 'Unknown error'}`);
      }

      onSave();
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

    if (name === 'student.preferredDate') {
      setFormData((prev) => ({
        ...prev,
        student: {
          ...prev.student,
          preferredDate: new Date(value).toISOString(),
        },
      }));
    } else {
        if (name.includes('.')) {
          const [parent, child] = name.split('.');
          setFormData((prev) => ({
            ...prev,
            [parent]: {
              ...prev[parent],
              [child]: value,
            },
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            [name]: value,
          }));
          }
      }
    };

  const formatTimeToAMPM = (time: string): string => {
    if (!time) return '';
    
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${String(formattedHour).padStart(2, '0')}:${minutes} ${ampm}`;
    } catch (e) {
      return '';
    }
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
              {isEditMode ? 'Edit Student' : 'Add Trail Student'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {/* <button 
              className="bg-gradient-to-r from-[#293552] to-[#1e273c] text-white px-5 py-2 rounded-lg
                         hover:shadow-lg transition-all duration-300 text-sm font-medium
                         flex items-center gap-2 transform hover:translate-y-[-1px]" 
              onClick={handleStart}
            >
              <span>Start Evaluation</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button> */}
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
                  name="student.studentFirstName"
                  value={formData.student.studentFirstName}
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
                name="student.studentLastName"
                value={formData.student.studentLastName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="student.studentEmail"
                value={formData.student.studentEmail}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Phone Number</label>
              <input
                type="number"
                name="student.studentPhone"
                value={formData.student.studentPhone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">City</label>
              <input
                type="text"
                name="student.studentCity"
                value={formData.student.studentCity}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Country</label>
              <input
                type="text"
                name="student.studentCountry"
                value={formData.student.studentCountry}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            {/* <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Language</label>
              <input
                type="text"
                name="student.studentLanguage"
                value={formData.student.studentLanguage}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div> */}
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Time Zone</label>
              <input
                type="text"
                name="student.timeZone"
                value={formData.student.timeZone}
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
              <label className="block mb-1 text-xs font-medium text-gray-700">Course</label>
              <select
                name="Select Course"
                value={formData.student.learningInterest}
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
              <label className="block mb-1 text-xs font-medium text-gray-700">Preferred Teacher</label>
              <select
                name="Select Teacher"
                value={formData.student.preferredTeacher}
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
              <label className="block mb-1 text-xs font-medium text-gray-700">Level</label>
              <select
                name="languageLevel"
                value={formData.languageLevel}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
                required
              >
                <option value="">Level</option>
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
              </select>
            </div>
            
            
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Preferred Date</label>
              <input
                type="date"
                name="student.preferredDate"
                value={formData.student.preferredDate.split('T')[0]}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Preferred Time</label>
              <input
                type="time"
                name="student.preferredFromTime"
                value={formData.student.preferredFromTime}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Preferred Hours</label>
              <input
                type="number"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                min="0"
                step="1"
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Reachedule Date</label>
              <input
                type="date"
                name="student.preferredDate"
                value={formData.student.preferredDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Preferred Package</label>
              <select
                name="student.preferredTeacher"
                value={formData.student.preferredTeacher}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
                required
              >
                <option value="Basic">Basic</option>
                <option value="Advance">Advance</option>
                <option value="Pro">Pro</option>
                <option value="Elite">Elite</option>
              </select>
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Guardians Name</label>
              <input
                type="text"
                name="gardianName"
                value={formData.gardianName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="form-group">
              <label className="block mb-1 text-xs font-medium text-gray-700">Guardians Phone Number</label>
              <input
                type="text"
                name="gardianPhone"
                value={formData.gardianPhone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-1 text-xs font-medium text-gray-700">Class Status</label>
              <select
                name="student.evaluationStatus"
                value={formData.student.evaluationStatus}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
                required
              >
                <option value="PENDING">Pending</option>
                <option value="INPROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block mb-1 text-xs font-medium text-gray-700">Student Status</label>
              <select
                name="studentStatus"
                value={formData.studentStatus}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:border-[#293552] outline-none"
                required
              >
                <option value="PENDING">Joining</option>
                <option value="INPROGRESS">Waiting</option>
                <option value="COMPLETED">Not Joining</option>
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
              {isEditMode ? 'Save Changes' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddEvaluationModal;
