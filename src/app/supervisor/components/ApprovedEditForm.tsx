import React, { useState } from "react";

const ApprovedEditForm = ({ applicant, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    studentName: applicant?.studentName || "",
    supervisorRemarks: applicant?.supervisorRemarks || "",
    approvedDate: applicant?.approvedDate || "",
    joiningDate: applicant?.joiningDate || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onSubmit(formData); // Send updated data back
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-lg font-semibold mb-4 dark:text-[#fff]">
          Edit Approved Application
        </h2>

        {/* Student Name */}
        <label className="text-sm text-slate-700 dark:text-gray-300">Student Name</label>
        <input
          type="text"
          name="studentName"
          value={formData.studentName}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md mb-3 bg-white dark:bg-[#3a3a3a] dark:text-white"
        />

        {/* Supervisor Remarks */}
        <label className="text-sm text-slate-700 dark:text-gray-300">Remarks</label>
        <textarea
          name="supervisorRemarks"
          value={formData.supervisorRemarks}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md mb-3 h-20 bg-white dark:bg-[#3a3a3a] dark:text-white"
        />

        {/* Approved Date */}
        <label className="text-sm text-slate-700 dark:text-gray-300">
          Approved Date
        </label>
        <input
          type="date"
          name="approvedDate"
          value={formData.approvedDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md mb-3 bg-white dark:bg-[#3a3a3a] dark:text-white"
        />

        {/* Joining Date */}
        <label className="text-sm text-slate-700 dark:text-gray-300">
          Joining Date
        </label>
        <input
          type="date"
          name="joiningDate"
          value={formData.joiningDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md mb-4 bg-white dark:bg-[#3a3a3a] dark:text-white"
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-red-600 border border-red-600 rounded-md text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovedEditForm;
