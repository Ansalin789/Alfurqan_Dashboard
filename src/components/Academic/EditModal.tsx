import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#__next"); // Ensure accessibility

interface Student {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  course?: string;
  preferredTeacher?: string;
  date?: string;
  time?: string;
  evaluationStatus?: string;
  comment?: string;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSave: (updatedStudent: Student) => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, student, onSave }) => {
  const [formData, setFormData] = React.useState<Student | null>(student);

  React.useEffect(() => {
    setFormData(student);
  }, [student]);

  const handleInputChange = (field: keyof Student, value: string) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-lg shadow-lg max-w-3xl mx-auto p-6 mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-2xl font-bold mb-4">Edit Student Details</h2>
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label  htmlFor="first-name" className="block text-gray-700">First Name</label>
            <input
              type="text"
              value={formData?.fname}
              onChange={(e) => handleInputChange("fname", e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label  htmlFor="first-name" className="block text-gray-700">Last Name</label>
            <input
              type="text"
              value={formData?.lname}
              onChange={(e) => handleInputChange("lname", e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="first-name" className="block text-gray-700">Email</label>
            <input
              type="email"
              value={formData?.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="first-name" className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              value={formData?.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="first-name" className="block text-gray-700">City</label>
            <input
              type="text"
              value={formData?.city }
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="first-name" className="block text-gray-700">Country</label>
            <input
              type="text"
              value={formData?.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
          {/* Add more fields here */}
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditModal;
