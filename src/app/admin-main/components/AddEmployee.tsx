"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number | string;
  nationality: string;
  country: string;
  city: string;
  dateOfBirth: string;
  gender: string;
  residentialAddress: string;
  higherQualification: string;
  universityName: string;
  previousJob: string;
  experience: string;
  bankName: string;
  accountNumber: number | string;
  bankCode: string;
  passportNumber: string;
  languagesKnown: string[];
  emergencyContactNumber: number | string;
  relationshipWithEmployee: string;
  address: string;
  designation: string;
  department: string;
  preferedWorkingHours: number | string;
  preferedShiftFrom: string;
  preferedShiftTo: string;
  comments: string;
  profileImage: string | null;
  applicationDate: string;
  currency: string;
  expectedSalary: number | string;
  applicationStatus: string;
  preferedWorkingDays: string[];
  status: string;
}

interface AddEmployeeProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const AddEmployee: React.FC<AddEmployeeProps> = ({ onClose, onSuccess }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    nationality: "",
    country: "",
    city: "",
    dateOfBirth: "",
    gender: "",
    residentialAddress: "",
    higherQualification: "",
    universityName: "",
    previousJob: "",
    experience: "",
    bankName: "",
    accountNumber: "",
    bankCode: "",
    passportNumber: "",
    languagesKnown: [],
    emergencyContactNumber: "",
    relationshipWithEmployee: "",
    address: "",
    designation: "",
    department: "",
    preferedWorkingHours: 8,
    preferedShiftFrom: "09:00 AM",
    preferedShiftTo: "09:00 PM",
    comments: "",
    profileImage: null,
    applicationDate: new Date().toISOString(),
    currency: "USD",
    expectedSalary: "",
    applicationStatus: "Pending",
    preferedWorkingDays: [],
    status: "Active",
  });

  const [errors, setErrors] = useState<Partial<EmployeeFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<EmployeeFormData> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required";
    if (!formData.designation) newErrors.designation = "Designation is required";
    if (!formData.department) newErrors.department = "Department is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const formatTime = (value: string): string => {
    if (!value) return "";
    const [hour, minute] = value.split(":");
    const h = parseInt(hour, 10);
    const formattedHour = h.toString().padStart(2, "0");
    return `${formattedHour}:${minute}`;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formatted = formatTime(value);
    setFormData((prev) => ({ ...prev, [name]: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("AdminAuthToken");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formPayload.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formPayload.append(key, value.toString());
        }
      });

      await axios.post(
        "https://api.blackstoneinfomaticstech.com/otheremployee",
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Employee added successfully!");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Error adding employee. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profileImage: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = (day: string) => {
    setFormData((prev) => {
      const currentDays = Array.isArray(prev.preferedWorkingDays) 
        ? prev.preferedWorkingDays 
        : [];
      const days = new Set(currentDays);
      if (days.has(day)) {
        days.delete(day);
      } else {
        days.add(day);
      }
      return {
        ...prev,
        preferedWorkingDays: Array.from(days),
      };
    });
  };

  const renderFormField = (
    field: {
      label: string;
      name: keyof EmployeeFormData;
      type: string;
      full?: boolean;
      options?: string[];
    },
    index: number
  ) => {
    const fieldValue = formData[field.name];
    const error = errors[field.name];

    if (field.type === "checkbox-group" && field.options) {
      const valueArray = Array.isArray(fieldValue) 
        ? fieldValue 
        : typeof fieldValue === 'string' 
          ? [fieldValue] 
          : [];

      return (
        <div key={index} className={`flex flex-col ${field.full ? "col-span-2" : ""}`}>
          <label className="text-xs font-medium dark:text-[#FFFFFF] text-gray-700 mb-1 block">
            {field.label}
          </label>
          <div className="flex flex-wrap gap-3">
            {field.options.map((option) => (
              <label key={option} className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={valueArray.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                  className="rounded border-gray-300 dark:text-[#FFFFFF] text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="dark:text-gray-300">{option}</span>
              </label>
            ))}
          </div>
          {error && (
            <p className="text-red-500 text-xs mt-1">{error as string}</p>
          )}
        </div>
      );
    }

    return (
      <div key={index} className={`flex flex-col ${field.full ? "col-span-2" : ""}`}>
        <label className="text-xs font-medium text-gray-700 dark:text-[#FFFFFF] mb-1">
          {field.label}
        </label>
        {field.type === "file" ? (
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-xs bg-gray-100 dark:text-[#FFFFFF] dark:bg-[#5C5C5C] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2"
          />
        ) : field.type === "time" ? (
          <input
            type="time"
            name={field.name}
            onChange={handleTimeChange}
            className="w-full bg-gray-100 dark:text-[#FFFFFF] border dark:bg-[#5C5C5C] border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-xs"
          />
        ) : field.type === "date" ? (
          <input
            type="date"
            name={field.name}
            value={fieldValue as string}
            onChange={handleChange}
            className="w-full bg-gray-100 dark:bg-[#5C5C5C] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-xs text-gray-900 dark:text-gray-100 [color-scheme:light dark]"
          />
        ) : field.type === "select" && field.options ? (
          <select
            name={field.name}
            value={fieldValue as string}
            onChange={handleChange}
            className="w-full bg-gray-100 border dark:bg-[#5C5C5C] border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-xs text-gray-900 dark:text-gray-100"
          >
            <option value="">Select {field.label}</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : field.type === "textarea" ? (
          <textarea
            name={field.name}
            value={fieldValue as string}
            onChange={handleChange}
            className="w-full bg-gray-100 dark:bg-[#5C5C5C] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-xs text-gray-900 dark:text-gray-100"
            rows={3}
          />
        ) : (
          <input
            type={field.type}
            name={field.name}
            value={fieldValue as string | number}
            onChange={handleChange}
            className="w-full bg-gray-100 dark:bg-[#5C5C5C] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-xs text-gray-900 dark:text-gray-100"
          />
        )}
        {error && (
          <p className="text-red-500 text-xs mt-1">{error as string}</p>
        )}
      </div>
    );
  };

  const formFields: {
    label: string;
    name: keyof EmployeeFormData;
    type: string;
    full?: boolean;
    options?: string[];
  }[] = [
    { label: "First name", name: "firstName", type: "text" },
    { label: "Last name", name: "lastName", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Phone number", name: "phoneNumber", type: "number" },
    { label: "City", name: "city", type: "text" },
    { label: "Nationality", name: "nationality", type: "text" },
    { label: "Date of Birth", name: "dateOfBirth", type: "date" },
    { label: "Country", name: "country", type: "text" },
    { label: "Gender", name: "gender", type: "text" },
    {
      label: "Residential Address",
      name: "residentialAddress",
      type: "text",
      full: true,
    },
    {
      label: "Highest Qualification",
      name: "higherQualification",
      type: "text",
    },
    {
      label: "University/Institute Name",
      name: "universityName",
      type: "text",
    },
    { label: "Previous Job Title", name: "previousJob", type: "text" },
    { label: "Experience (in years)", name: "experience", type: "text" },
    { label: "Bank Name", name: "bankName", type: "text" },
    { label: "Account Number", name: "accountNumber", type: "number" },
    { label: "Bank Code", name: "bankCode", type: "text", full: true },
    { label: "Passport Number", name: "passportNumber", type: "text" },
    {
      label: "Emergency Contact Number",
      name: "emergencyContactNumber",
      type: "number",
    },
    {
      label: "Relationship with Employee",
      name: "relationshipWithEmployee",
      type: "text",
    },
    { label: "Address", name: "address", type: "text", full: true },
    { label: "Designation", name: "designation", type: "select" ,options: ["SUPERVISOR", "ACADEMICCOACH"] },
    { label: "Department", name: "department", type: "text"  },
    {
      label: "Preferred Working Hours",
      name: "preferedWorkingHours",
      type: "number",
    },
    { label: "Preferred Shift From", name: "preferedShiftFrom", type: "time" },
    { label: "Preferred Shift To", name: "preferedShiftTo", type: "time" },
    {
      label: "Languages Known",
      name: "languagesKnown",
      type: "text",
      full: true,
    },
    { label: "Currency", name: "currency", type: "select" , options: ["USD", "EUR", "INR", "AED"] },
    { label: "Expected Salary", name: "expectedSalary", type: "number" },
    {
      label: "Preferred Working Days",
      name: "preferedWorkingDays",
      type: "checkbox-group",
      options: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      full: true,
    },
    { label: "Profile Image", name: "profileImage", type: "file", full: true },
    {
      label: "Additional Comments",
      name: "comments",
      type: "textarea",
      full: true,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center overflow-auto">
      <div className="w-full max-w-4xl h-[90vh] bg-white dark:bg-[#1F1F1F] dark:text-[#FFFFFF] rounded-2xl shadow-lg overflow-hidden m-4">
        <div className="h-full overflow-y-auto p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Add Employee</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formFields.map((field, index) => renderFormField(field, index))}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-400 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-900 text-white rounded-lg text-sm hover:bg-blue-800 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;