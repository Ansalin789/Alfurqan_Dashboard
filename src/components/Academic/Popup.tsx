// components/Academic/Popup.tsx
import React from 'react';
import Modal from 'react-modal';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  userData?: User | null; // Optional user data for editing
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, userData }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit User"
      className="modal"
      overlayClassName="overlay"
    >
      <div className="p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit User Details</h2>
        <form>
          <div className="mb-2">
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              defaultValue={userData?.fname || ''}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              defaultValue={userData?.lname || ''}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              defaultValue={userData?.email || ''}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Mobile</label>
            <input
              type="text"
              defaultValue={userData?.number || ''}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              defaultValue={userData?.country || ''}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Course</label>
            <input
              type="text"
              defaultValue={userData?.course || ''}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Preferred Teacher</label>
            <input
              type="text"
              defaultValue={userData?.preferredTeacher || ''}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Time Slot</label>
            <input
              type="text"
              defaultValue={userData?.time || ''}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default Popup;






