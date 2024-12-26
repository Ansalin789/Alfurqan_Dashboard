import React from 'react';
import { useRouter } from 'next/navigation';
import { FiCalendar, FiClock } from 'react-icons/fi';

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddScheduleModal: React.FC<AddScheduleModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  const handleReschedule = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    router.push('/Academic/studentreschedules');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 w-[300px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[14px] font-semibold">Add new Schedule</h3>
          <button onClick={onClose} className="text-gray-600 text-[18px]">×</button>
        </div>
        <form>
          <div className="mb-2">
            <label className="block text-[12px] mb-1">Title</label>
            <input type="text" className="w-full border rounded-lg p-1 text-[12px]" />
          </div>
          <div className="mb-2 flex space-x-2">
            <div className="w-1/2">
              <label className="block text-[12px] mb-1">Date</label>
              <div className="flex items-center border rounded-lg p-1">
                <FiCalendar className="text-gray-500 text-[14px]" />
                <input type="date" className="w-full border-none text-[12px]" />
              </div>
            </div>
            <div className="w-1/2">
              <label className="block text-[12px] mb-1">Time</label>
              <div className="flex items-center border rounded-lg p-1">
                <FiClock className="text-gray-500 text-[14px]" />
                <input type="time" className="w-full border-none text-[12px]" />
              </div>
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-[12px] mb-1">Comment</label>
            <textarea className="w-full border rounded-lg p-1 text-[12px]" rows={2}></textarea>
          </div>
          <button type="submit" className="w-full bg-gray-900 text-white text-[12px] p-1 rounded-lg" onClick={handleReschedule}>
            Submit Schedule
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddScheduleModal;
