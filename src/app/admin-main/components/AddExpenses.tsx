import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { X } from "lucide-react";

interface ExpenseFormData {
  paymentDate: string;
  expenseType: string;
  amount: number | string;
  category: string;
  paymentMethod: string;
  status: string;
}

interface AddExpensesProps {
  onClose: () => void;
  refreshExpenses?: () => void;
}

const AddExpenses: React.FC<AddExpensesProps> = ({ onClose, refreshExpenses }) => {
  const ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IkFkbWluIiwic3ViIjoiNjgwNWRhOGMwNjU0MmFhMzM4NThiODg5IiwiaWF0IjoxNzUzMTYxMDQxLCJleHAiOjE3NTMyNDc0NDF9.EK8JgTJWzUDyQTY1ZReIAt0-LEhq2m1euQfPztK0-VE";

  const [formData, setFormData] = useState<ExpenseFormData>({
    paymentDate: "",
    expenseType: "",
    amount: "",
    category: "",
    paymentMethod: "Cash",
    status: "Active",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.paymentDate) {
      toast.error("Payment date is required");
      return false;
    }
    
    if (!formData.expenseType.trim()) {
      toast.error("Expense type is required");
      return false;
    }
    
    if (!formData.amount) {
      toast.error("Amount is required");
      return false;
    }
    
    if (Number(formData.amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return false;
    }
    
    if (!formData.category) {
      toast.error("Category is required");
      return false;
    }
    
    if (!formData.paymentMethod) {
      toast.error("Payment method is required");
      return false;
    }

    return true;
  };

  const handleAddPayment = async () => {
    try {
      if (!validateForm()) return;

      setIsSubmitting(true);
      setSubmitSuccess(false);

      const payload = {
        paymentDate: formData.paymentDate,
        expenseType: formData.expenseType.trim(),
        amount: formData.amount.toString(),
        category: formData.category,
        paymentMethod: formData.paymentMethod,
        status: formData.status,
        createdBy: "Admin"
      };

      const response = await axios.post(
        "https://api.blackstoneinfomaticstech.com/expense",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ADMIN_TOKEN}`
          },
          timeout: 10000
        }
      );

      toast.success("Expense recorded successfully!");
      
      // Reset form and show success message briefly
      setSubmitSuccess(true);
      setTimeout(() => {
        setFormData({
          paymentDate: "",
          expenseType: "",
          amount: "",
          category: "",
          paymentMethod: "Cash",
          status: "Active",
        });
        setSubmitSuccess(false);
      }, 1500);

      // Call refreshExpenses if provided
      if (refreshExpenses) {
        refreshExpenses();
      }

    } catch (error: any) {
      console.error("Full error details:", error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 400) {
            toast.error(error.response.data.message || "Validation failed. Please check all fields.");
          } else {
            toast.error("Payment processing failed");
          }
        } else if (error.request) {
          toast.error("No response received from server. Please try again.");
        } else {
          toast.error("Request setup error: " + error.message);
        }
      } else {
        toast.error("Error: " + (error.message || "Unknown error occurred"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="max-w-xl w-full mx-auto p-6 bg-white rounded-lg shadow-md relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Admin Expense Entry</h2>
        
        {submitSuccess ? (
          <div className="p-4 bg-green-50 text-green-700 rounded-lg text-center">
            <h3 className="font-bold text-lg">Expense Recorded Successfully!</h3>
          </div>
        ) : (
          <form className="space-y-5">
            <div>
              <label className="block font-medium">Payment Date*</label>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                className="w-full border p-2 rounded border-gray-300"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Expense Type*</label>
              <input
                type="text"
                name="expenseType"
                value={formData.expenseType}
                onChange={handleChange}
                className="w-full border p-2 rounded border-gray-300"
                placeholder="e.g., Office supplies"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Amount*</label>
              <div className="relative">
                <span className="absolute left-3 top-2">$</span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  className="w-full border p-2 rounded border-gray-300 pl-8"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-medium">Category*</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border p-2 rounded border-gray-300"
                required
              >
                <option value="">Select Category</option>
                <option value="Rent">Rent</option>
                <option value="Utilities">Utilities</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Travel">Travel</option>
                <option value="Meals">Meals</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-medium">Payment Method*</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full border p-2 rounded border-gray-300"
                required
              >
                <option value="">Select Method</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Check">Check</option>
              </select>
            </div>

            <div>
              <label className="block font-medium">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border p-2 rounded border-gray-300"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
              </select>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddPayment}
                disabled={isSubmitting}
                className={`flex-1 py-3 px-4 rounded-lg text-white font-medium ${
                  isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Submit Expense"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddExpenses;