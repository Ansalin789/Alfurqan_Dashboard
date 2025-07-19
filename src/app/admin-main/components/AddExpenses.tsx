"use client";

import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { X } from "lucide-react";

interface AddExpensesProps {
  onClose: () => void;
}

const AddExpenses: React.FC<AddExpensesProps> = ({ onClose }) => {
  const theme: any = useTheme();
  const darkMode = theme?.darkMode ?? false;

  const [formData, setFormData] = useState({
    date: "",
    type: "",
    amount: "",
    category: "",
    method: "",
    status: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className={`w-full max-w-md rounded-lg p-6 relative shadow-lg ${darkMode ? "bg-[#1e1e1e] text-white" : "bg-white text-black"}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-[15px]">Add Expense</h2>
          <button onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Payment Date */}
          <div>
            <label className="block text-sm mb-1">Payment Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none ${darkMode ? "bg-[#2b2b2b] border-gray-700 text-white" : "bg-white border-gray-300"}`}
            />
          </div>

          {/* Expense Type */}
          <div>
            <label className="block text-sm mb-1">Expense Type</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Enter type"
              className={`w-full px-3 py-2 border rounded focus:outline-none ${darkMode ? "bg-[#2b2b2b] border-gray-700 text-white" : "bg-white border-gray-300"}`}
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              className={`w-full px-3 py-2 border rounded focus:outline-none ${darkMode ? "bg-[#2b2b2b] border-gray-700 text-white" : "bg-white border-gray-300"}`}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none ${darkMode ? "bg-[#2b2b2b] border-gray-700 text-white" : "bg-white border-gray-300"}`}
            >
              <option value="">Select category</option>
              <option value="rent">Rent</option>
              <option value="utilities">Utilities</option>
              <option value="salary">Salary</option>
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm mb-1">Payment Method</label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none ${darkMode ? "bg-[#2b2b2b] border-gray-700 text-white" : "bg-white border-gray-300"}`}
            >
              <option value="">Select method</option>
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
              <option value="online">Online</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none ${darkMode ? "bg-[#2b2b2b] border-gray-700 text-white" : "bg-white border-gray-300"}`}
            >
              <option value="">Select status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border rounded text-sm hover:bg-gray-100 dark:hover:bg-[#333]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#576CBC] text-white text-sm rounded hover:bg-[#4051a3]"
            >
              Add Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenses;
