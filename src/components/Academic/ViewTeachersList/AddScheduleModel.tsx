'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FiCalendar, FiClock } from 'react-icons/fi';

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Callback for success message
}

const AddScheduleModal: React.FC<AddScheduleModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const router = useRouter();

  const handleReschedule = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Trigger success message in parent
    onSuccess();
    
    // Close the modal
    onClose();

    // Redirect after 3 seconds
    setTimeout(() => {
      router.push('/Academic/viewTeacherSchedule');
    }, 3000);
  };


  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      
    >
      <div
        className="bg-white rounded-lg p-4 w-[300px]"
        
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[14px] font-semibold">Add new Schedule</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-gray-600 text-[18px] hover:text-gray-800 transition-colors"
          >
            ×
          </button>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-2">
            <label htmlFor="title" className="block text-[12px] mb-1">Title</label>
            <input
              id="title"
              type="text"
              className="w-full border rounded-lg p-1 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-2 flex space-x-2">
            <div className="w-1/2">
              <label htmlFor="date" className="block text-[12px] mb-1">Date</label>
              <div className="flex items-center border rounded-lg p-1 focus-within:ring-2 focus-within:ring-blue-500">
                <FiCalendar className="text-gray-500 text-[14px]" />
                <input
                  id="date"
                  type="date"
                  className="w-full border-none text-[12px] focus:outline-none"
                />
              </div>
            </div>
            <div className="w-1/2">
              <label htmlFor="time" className="block text-[12px] mb-1">Time</label>
              <div className="flex items-center border rounded-lg p-1 focus-within:ring-2 focus-within:ring-blue-500">
                <FiClock className="text-gray-500 text-[14px]" />
                <input
                  id="time"
                  type="time"
                  className="w-full border-none text-[12px] focus:outline-none"
                />
              </div>
            </div>
          </div>
          <div className="mb-2">
            <label htmlFor="comment" className="block text-[12px] mb-1">Comment</label>
            <textarea
              id="comment"
              className="w-full border rounded-lg p-1 text-[12px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white text-[12px] p-1 rounded-lg hover:bg-gray-700 transition-colors"
            onClick={handleReschedule}
          >
            Submit Schedule
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddScheduleModal;
