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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    onRequestClose();
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
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl max-h-[110vh] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{user ? 'Edit Student' : 'Add Student'}</h2>
          <button onClick={onRequestClose} className="text-gray-600 hover:text-gray-800">
            <FaTimes size={20} />
          </button>
        </div>
        <div className="flex justify-end items-center mb-4">
          <button className="bg-[#293552] text-white px-4 py-2 rounded-lg hover:bg-[#1e273c]" onClick={handleStart}>
            Start
          </button>
        </div>
        <div className="overflow-y-auto max-h-[75vh] pr-4 scrollbar-hide">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">First Name</label>
                <input
                  type="text"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Last Name</label>
                <input
                  type="text"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Phone Number</label>
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Trial ID</label>
                <input
                  type="text"
                  name="trailId"
                  value={formData.trailId}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Number of Students</label>
                <input
                  type="number"
                  name="students"
                  value={formData.students}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Preferred Teacher</label>
                <select
                  name="preferredTeacher"
                  value={formData.preferredTeacher}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Teacher</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Course</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Course</option>
                  <option value="Arabic">Arabic</option>
                  <option value="Math">Math</option>
                  <option value="Science">Science</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Preferred Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Preferred Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Evaluation Status</label>
                <select
                  name="evaluationStatus"
                  value={formData.evaluationStatus}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Status</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block mb-2">Comment</label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={onRequestClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 p-2 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#293552] hover:bg-[#1f283d] text-white p-2 px-6 rounded-lg"
              >
                {user ? 'Save Changes' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddStudentModal;
