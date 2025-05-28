'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SuccessPopup from "@/app/supervisor/components/successPopup";
type LeaveFormProps =
 {
  readonly onClose: () => void;
};

export default function LeaveForm({ onClose }: LeaveFormProps) {
  const [form, setForm] = useState({
    employeeId: '',
    name: '',
    leaveType: '',
    leaveStatus: 'WAITINGLIST',
    role:'Supervisor',
    fromDate: '',
    toDate: '',
    reason: '',
  status: 'Active',
  createdDate: new Date().toISOString(),
  createdBy: 'Admin',
  UpdatedDate: new Date().toISOString(),
  UpdatedBy: 'Admin'
  });
  const [success,setSucces]=useState(false);

useEffect(() => {
  const Id = localStorage.getItem("SupervisorPortalId") ?? '';
  const Name = localStorage.getItem("SupervisorPortalName") ?? '';
  setForm((prev) => ({
    ...prev,
    employeeId: Id,
    name: Name,
  }));
}, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setForm(prev => ({
    ...prev,
    [name]: value,
  }));
};

const handleSubmit = async (e:any) => {
  e.preventDefault();

  try {
  const token = typeof window !== "undefined" ? localStorage.getItem("SupervisorAuthToken") : null;

  const response = await axios.post(
    'http://localhost:5001/leaverequest',
    form, 
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  );

  console.log('Leave request submitted:', response.data);
  setSucces(true); // Show popup if using success state
} catch (error) {
  console.error('Error submitting leave request:', error);
}
};


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
  <form
    onSubmit={handleSubmit}
    className="bg-white rounded-lg shadow-xl p-5 w-full max-w-3xl mx-3 text-sm dark:bg-[#1D1D1D]"
    style={{ maxHeight: '90vh', overflowY: 'auto' }}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left Section */}
      <div>
        <h1 className="text-lg font-normal text-gray-800 mb-3 dark:text-[#FFFFFF] ">Fill Details</h1>

        <div className="mb-4">
          <label htmlFor="employeeId" className="block text-sm font-normal text-gray-600 mb-1 dark:text-[#FFFFFF]">
            Employee ID
          </label>
          <input
            name="employeeId"
            value={form.employeeId}
            readOnly
            type="text"
            className="w-full border  rounded px-3 py-2 text-xs dark:text-[#FFFFFF] dark:bg-[#343434] dark:border-[#5C5C5C]"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="employeeName" className="block text-sm font-normal text-gray-600 mb-1 dark:text-[#FFFFFF]">
            Employee Name
          </label>
          <input
            name="employeeName"
            value={form.name}
            readOnly
            type="text"
            className="w-full border rounded px-3 py-2 text-xs dark:text-[#FFFFFF] dark:bg-[#343434] dark:border-[#5C5C5C]"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="designation" className="block text-sm font-normal text-gray-600 mb-1 dark:text-[#FFFFFF]">
            Designation
          </label>
          <input
            name="designation"
            value="Supervisor"
            readOnly
            type="text"
            className="w-full border rounded px-3 py-2 text-xs dark:text-[#FFFFFF] dark:bg-[#343434] dark:border-[#5C5C5C]"
          />
        </div>

        <div className="mb-4">
  <label htmlFor="leaveType" className="block text-sm font-normal text-gray-600 mb-1 dark:text-[#FFFFFF]">
    Leave Type
  </label>
  <select
    name="leaveType"
    value={form.leaveType}
    onChange={handleChange}
    className="w-full border rounded px-3 py-2 text-xs dark:text-[#FFFFFF] dark:bg-[#343434] dark:border-[#5C5C5C]"
  >
    <option value="">Select Leave Type</option>
    <option value="SICK">SICK</option>
    <option value="CASUAL">CASUAL</option>
    <option value="PAID">PAID</option>
  </select>
</div>


        <div className="mb-4">
          <label htmlFor="fromDate" className="block text-sm font-normal text-gray-600 mb-1 dark:text-[#FFFFFF]">
            From Date
          </label>
          <input
            name="fromDate"
            value={form.fromDate}
            onChange={handleChange}
            type="date"
            className="w-full border rounded px-3 py-2 text-xs dark:text-[#FFFFFF] dark:bg-[#343434] dark:border-[#5C5C5C]"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="toDate" className="block text-sm font-normal text-gray-600 mb-1 dark:text-[#FFFFFF]">
            To Date
          </label>
          <input
            name="toDate"
            value={form.toDate}
            onChange={handleChange}
            type="date"
            className="w-full border rounded px-3 py-2 text-xs dark:text-[#FFFFFF] dark:bg-[#343434] dark:border-[#5C5C5C]"
          />
        </div>
      </div>

      {/* Right Section */}
      <div>
        <h2 className="text-lg font-normal text-gray-800 mb-3 dark:text-[#FFFFFF]">Leave Records</h2>

        <div className="mb-4">
          <label htmlFor="sickLeave" className="block text-sm font-normal text-gray-600 mb-1 dark:text-[#FFFFFF]">
            Sick Leave
          </label>
          <input
            type="text"
            value="2"
            readOnly
            className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-800 text-xs dark:text-[#FFFFFF] dark:bg-[#343434] dark:border-[#5C5C5C]"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="casualLeave" className="block text-sm font-normal text-gray-600 mb-1 dark:text-[#FFFFFF]">
            Casual Leave
          </label>
          <input
            type="text"
            value="2"
            readOnly
            className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-800 text-xs dark:text-[#FFFFFF] dark:bg-[#343434] dark:border-[#5C5C5C]"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="lossOfPay" className="block text-sm font-normal text-gray-600 mb-1 dark:text-[#FFFFFF]">
            Loss of Pay
          </label>
          <input
            type="text"
            value="2"
            readOnly
            className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-800 text-xs dark:text-[#FFFFFF] dark:bg-[#343434] dark:border-[#5C5C5C]"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="reason" className="block text-sm font-normal text-gray-600 mb-1 dark:text-[#FFFFFF]">
            Reason For Leave
          </label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            rows={2}
            className="w-full border rounded px-3 py-3 h-full text-xs dark:text-[#FFFFFF] dark:bg-[#343434] dark:border-[#5C5C5C]"
          />
        </div>
      </div>
    </div>

    {/* Divider and Buttons */}
    <div className="border-t pt-4 mt-4 flex justify-end gap-2">
      <button
        type="button"
        onClick={onClose}
        className="px-3 py-1 border border-[#576CBC] rounded text-[#576CBC] hover:bg-gray-100 transition "
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-3 py-1 bg-[#576CBC] text-white rounded hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </div>
  </form>
  {
    success && (
        <SuccessPopup 
        onClose={()=>setSucces(false)}  
        title = 'Leave Request' />
    )
  }
</div>


  );
}
