"use client";

import { useEffect, useState } from "react";
import { Calendar, File, MapPin, Phone, Upload, X } from "lucide-react";
import BaseLayout4 from "@/components/BaseLayout4";
import axios from "axios";
import { Student } from "../studentlistviewall/page";

export interface IStudent {
  student: {
    studentId: string;
    studentEmail: string;
    studentPhone: number;
    gender: string;
    package: string;
  };
  _id: string;
  username: string;
  password: string;
  role: "Student" | "Admin" | "Teacher"; // Adjust based on your app roles
  status: "Active" | "Inactive";
  createdDate: string; // ISO Date string
  createdBy: string;
  updatedDate: string; // ISO Date string
  __v: number;
  classScheduleCount: number;
}

// If you are handling a list:
export type IStudentList = IStudent[];

export interface IStudentInvoice {
  student: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    country: string;
    city: string;
  };
  courseName: string;
  amount: number;
  invoiceNumber: number;
  invoiceStatus: "Pending" | "Paid" | "Cancelled"; // You can adjust these values based on your app
  packageType: string;
  itemDescription: string;
  duration: string;
  rate: string;
  description: string;
  attachFile: string; // Base64 string
  status: "Active" | "Inactive"; // Adjust if needed
  dueDate: string; // ISO date string
  createdBy: string;
  lastUpdatedBy: string;
}

export default function InvoicePage() {
  const [attachedFile] = useState({
    name: "Contact_2020.pdf",
    size: "456 KB",
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<
    (typeof students)[0] | null
  >(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "https://alfurqanacademy.tech/alstudents"
        );

        // Remove duplicates based on studentId
        const uniqueStudentsMap = new Map();
        response.data.students.forEach((student: Student) => {
          uniqueStudentsMap.set(student.student.studentId, student);
        });

        const uniqueStudents = Array.from(uniqueStudentsMap.values());

        const sorted = uniqueStudents.sort(
          (a, b) =>
            new Date(b.createdDate).getTime() -
            new Date(a.createdDate).getTime()
        );

        setStudents(sorted.slice(0, 5)); // Take most recent 5 students
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };

    fetchStudents();
  }, []);
  const [invoiceData, setInvoiceData] = useState<IStudentInvoice>({
    student: {
      studentId: '',
      studentName: '',
      studentEmail: '',
      studentPhone: '',
      country: '',
      city: '',
    },
    courseName: '',
    amount: 0,
    invoiceNumber: 0,
    invoiceStatus: "Pending",
    packageType: '',
    itemDescription: '',
    duration: '',
    rate: '',
    description: '',
    attachFile: '',
    status: "Active",
    dueDate: '',
    createdBy: '',
    lastUpdatedBy: '',
  });

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5001/invoice/send', invoiceData);
      console.log('Invoice created successfully:', response.data);
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  // Trigger the file input click
  const triggerFileInput = () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setInvoiceData({ ...invoiceData, attachFile: file });
      setAttachedFile(file);
    }
  };

  // Remove the attached file
  const removeFile = () => {
    setInvoiceData({ ...invoiceData, attachFile: null });
    setAttachedFile(null);
  };

  return (
    <BaseLayout4>
      <div className="flex items-center justify-center py-4 ml-16">
        <div className="w-full max-w-5xl mx-auto p-5 ml-5  bg-white rounded-xl shadow-sm">
          <div className="space-y-4">
            {/* SELECT STUDENT */}

            <div>
              <h2 className="text-base font-semibold mb-3">SELECT STUDENT</h2>

              {/* Dropdown and Student Details in one row */}
              <div className="flex flex-wrap md:flex-nowrap gap-6 flex-grow">
                {/* Dropdown */}
                <div className="w-full md:w-64 mb-6">
                <select
              className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={selectedStudent?._id || ""}
              onChange={(e) => {
                const selected = students.find((stu) => stu._id === e.target.value);
                setSelectedStudent(selected || null);

                if (selected) {
                  setInvoiceData((prev: any) => ({
                    ...prev,
                    student: {
                      studentId: selected._id,
                      studentName: selected.username,
                      studentEmail: selected.student.studentEmail,
                      studentPhone: selected.student.studentPhone,
                      country: selected.student.country,
                      city: selected.student.city,
                    },
                  }));
                }
              }}
            >
              <option value="" disabled>Select a student</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.username}
              </option>
            ))}
          </select>
                </div>

                {/* Selected Student Details */}
                {selectedStudent && (
                  <div className="flex flex-wrap md:flex-nowrap gap-32 flex-grow">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">ADDRESS</p>
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <MapPin className="w-4 h-4 text-gray-700 mt-0.5" />
                        <p className="text-xs">
                          {selectedStudent.student.city || "No City Provided"},{" "}
                          {selectedStudent.student.country ||
                            "No Country Provided"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">EMAIL</p>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 flex items-center justify-center text-gray-700">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                        </div>
                        <p className="text-xs">
                          {selectedStudent.student.studentEmail}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">TELEPHONE</p>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-700" />
                        <p className="text-xs">
                          {selectedStudent.student.studentPhone}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* GENERAL */}
            <div>
              <h2 className="text-base font-semibold mb-3">GENERAL</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">AMOUNT (USD)</p>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    onChange={(e) =>
                      setInvoiceData({ ...invoiceData, amount: parseFloat(e.target.value) })
                    }/>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">DUE DATE</p>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md p-2 pr-8 text-sm"
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, dueDate: e.target.value })
                      }/>
                    <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-700" />
                  </div>
                </div>
              </div>
            </div>

            {/* ITEM DESCRIPTION */}
            <div>
              <h2 className="text-base font-semibold mb-3">Item Description</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-500">
                      <th className="pb-2 font-normal">PACKAGE TYPE</th>
                      <th className="pb-2 font-normal">ITEM DESCRIPTION</th>
                      <th className="pb-2 font-normal">DURATION</th>
                      <th className="pb-2 font-normal">RATE</th>
                      <th className="pb-2 font-normal text-right">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 text-sm">
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded p-1 text-sm"
                          placeholder="Package Type"
                          onChange={(e) =>
                            setInvoiceData({ ...invoiceData, packageType: e.target.value })
                          }/>
                      </td>
                      <td className="py-3 text-sm">
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded p-1 text-sm"
                          placeholder="item description"
                          onChange={(e) =>
                            setInvoiceData({ ...invoiceData, itemDescription: e.target.value })
                          }/>
                      </td>
                      <td className="py-3 text-sm">
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded p-1 text-sm"
                          placeholder="Duration"
                          onChange={(e) =>
                            setInvoiceData({ ...invoiceData, duration: e.target.value })
                          }/>
                      </td>
                      <td className="py-3 text-sm">
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded p-1 text-sm"
                          placeholder="Rate"
                          onChange={(e) =>
                            setInvoiceData({ ...invoiceData, rate: e.target.value })
                          }/>
                      </td>
                      <td className="py-3 text-sm text-right">
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded p-1 text-sm text-right"
                          placeholder="Amount"
                          onChange={(e) =>
                            setInvoiceData({ ...invoiceData, amount: parseFloat(e.target.value) || 0 })
                          }/>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-3">
                <textarea
                  placeholder="Type description here..."
                  className="w-full border border-gray-300 rounded-md p-2 text-sm min-h-[60px]"
                />
              </div>
            </div>

            {/* ATTACH FILE */}
            <div>
      <h2 className="text-base font-semibold mb-3">Attach File</h2>
      <div className="flex flex-col md:flex-row gap-3">
        <div className="border border-dashed border-green-200 bg-green-50 rounded-lg p-3 flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-900 rounded-md flex items-center justify-center">
            <Upload className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-medium text-sm">Upload Files</p>
            <p className="text-xs text-gray-500">
              PDF, DOC, PPT, JPG, PNG
            </p>

            {/* Custom button to trigger file input */}
            <button
              type="button"
              className="text-blue-500"
              onClick={triggerFileInput}
            >
              Choose a file
            </button>

            {/* Hidden file input */}
            <input
              id="fileInput"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.ppt,.jpg,.png"
              onChange={handleFileChange}
            />

            {/* Display selected file */}
            {invoiceData.attachFile && (
              <p className="text-sm text-gray-700">Selected File: {invoiceData.attachFile.name}</p>
            )}
          </div>
        </div>

        {/* Display attached file */}
        {attachedFile && (
          <div className="border rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <File className="w-4 h-4 text-blue-900" />
              <div>
                <p className="text-xs font-medium">
                  {attachedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {attachedFile.size} bytes
                </p>
              </div>
            </div>
            <button
              className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center"
              onClick={removeFile}
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3 mt-4">
              <button className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-1.5 rounded-md text-sm"
                onClick={handleSubmit}
              >
                SEND INVOICE
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-1.5 rounded-md text-sm">
                SAVE TO LATER
              </button>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout4>
  );
}
