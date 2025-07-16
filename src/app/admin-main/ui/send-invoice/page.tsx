"use client";

import { useEffect, useState } from "react";
import {  File, MapPin, Phone, Upload, X } from "lucide-react";
import BaseLayout4 from "@/components/BaseLayout4";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Document } from "mongoose";

interface IStudent {
  student: {
    studentId: string;
    studentEmail: string;
    studentPhone: number;
    gender: string;
    package: string;
    course: string;
    city: string;
    country: string;
  };
  _id: string;
  username: string;
  password: string;
  role: "Student" | "Admin" | "Teacher";
  status: "Active" | "Inactive";
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  __v: number;
  classScheduleCount: number;
  evaluation?: Array<{
    _id: string;
    academicCoachId: string;
    student: {
      studentId: string;
      studentFirstName: string;
      studentLastName: string;
      studentEmail: string;
      studentGender: string;
      studentPhone: number;
      studentCity: string;
      studentCountry: string;
      studentCountryCode: string;
      learningInterest: string;
      numberOfStudents: number;
      preferredTeacher: string;
      preferredFromTime: string;
      preferredToTime: string;
      timeZone: string;
      referralSource: string;
      preferredDate: string;
      evaluationStatus: string;
      status: string;
      createdDate: string;
      createdBy: string;
    };
    classType: string;
    teacher?: {
      teacherId: string;
      teacherName: string;
      teacherEmail: string;
    };
    classDay: string[];
    startTime: string[];
    endTime: string[];
    isLanguageLevel: boolean;
    languageLevel: string;
    isReadingLevel: boolean;
    readingLevel: string;
    isGrammarLevel: boolean;
    grammarLevel: string;
    hours: number;
    subscription?: {
      subscriptionName: string;
    };
    planTotalPrice: number;
    classStartDate: string;
    classEndDate: string;
    classStartTime: string;
    classEndTime: string;
    accomplishmentTime: string;
    studentRate: number;
    gardianName: string;
    gardianEmail: string;
    gardianPhone: string;
    gardianCity: string;
    gardianCountry: string;
    gardianTimeZone: string;
    gardianLanguage: string;
    assignedTeacher: string;
    studentStatus: string;
    classStatus: string;
    comments: string;
    trialClassStatus: string;
    invoiceStatus: string;
    paymentLink: string;
    paymentStatus: string;
    teacherStatus: string;
    status: string;
    createdDate: string;
    createdBy: string;
    updatedDate: string;
    updatedBy: string;
    expectedFinishingDate: number;
    assignedTeacherId: string;
    assignedTeacherEmail: string;
    __v: number;
  }>;
}
export interface IStudentInvoice {
  student: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    country: string;
    city: string;
  };
  evaluationData?: any; // Use a specific type if possible
  paymentDate?: Date; 
  courseName: string;
  amount: number; 
  packageType: string;
  itemDescription: string;
  duration: string;
  rate: string;
  description: string;
  attachFile?: string;
  dueDate?: string;
  invoiceStatus: string;
  status: string;
  createdDate?: string;
  createdBy: string;
  lastUpdatedDate?: string;
  lastUpdatedBy: string;
  invoiceNumber?: number;
}


export default function InvoicePage() {

  const [students, setStudents] = useState<IStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<
    (typeof students)[0] | null
  >(null);

  useEffect(() => {
   const token =
    typeof window !== "undefined" ? localStorage.getItem("AdminAuthToken") : null;

  if (!token) {
    console.error("❌ AdminAuthToken not found");
    return;
  }
    if (token) {
      fetchStudents(token); // Or call the function that performs the GET request
    } else {
      console.log("No auth token found.");
    }
  }, []);
    const fetchStudents = async (token: string) => {
      try {
        const response = await axios.get(
          "http://localhost:5001/alstudents",{
            method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        // Remove duplicates based on studentId
        const uniqueStudentsMap = new Map();
        response.data.students.forEach((student: IStudent) => {
          uniqueStudentsMap.set(student.student.studentId, student);
        });
        const uniqueStudentsArray = Array.from(uniqueStudentsMap.values());
        setStudents(uniqueStudentsArray); 
        console.log(uniqueStudentsArray);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };


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
    createdBy: 'Admin',
    lastUpdatedBy: "",
  });

   // useEffect to track changes in invoiceData and log the reset state
   useEffect(() => {
    console.log('Invoice data reset to initial state:', invoiceData);
  }, [invoiceData]);  // This will log when invoiceData changes

  // Submit function to handle invoice creation
  const handleSubmit = async () => {
    try {
      const token =
    typeof window !== "undefined" ? localStorage.getItem("AdminAuthToken") : null;

  if (!token) {
    console.error("❌ AdminAuthToken not found");
    return;
  }    
  console.log("Sending invoice data:", JSON.stringify(invoiceData, null, 2));

      // Always use the latest selectedStudent and their evaluation
      const firstEvaluation = selectedStudent?.evaluation?.[0];
      const payload = {
        ...invoiceData,
        evaluationData: firstEvaluation ? { ...firstEvaluation } : undefined,
      };

      // Send data to backend
      const response = await axios.post('http://localhost:5001/invoice/send', payload ,{
        headers:{
          'Content-Type' :'application/json',
          'Authorization' :`Bearer ${token}`,
        }
      });
      console.log('Full API response:', response);

      // Check if response is successful
      if (response.status === 201) {
        const invoiceWithEvaluation = {
          ...response.data.data,
          evaluationData: invoiceData.evaluationData
        };
        
        console.log("Combined invoice data:", invoiceWithEvaluation);
        toast.success('Invoice created successfully!', {
          position: 'top-right',
          autoClose: 3000, // Toast will auto-close after 3 seconds
        });

        // Reset the form data to initial state
        setInvoiceData({
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
          createdBy: 'Admin',
          lastUpdatedBy: "",
        });

      setSelectedStudent(null);


     setAttachedFile(null);
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Error creating invoice!', {
        position: 'top-right',
        autoClose: 3000, // Toast will auto-close after 3 seconds
      });
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
      const reader = new FileReader();
  
      reader.onloadend = () => {
        const result = reader.result as string;
        
        // Remove the "data:*/*;base64," prefix to get only the base64 string
        const base64String = result.split(',')[1];
  
        setInvoiceData({ 
          ...invoiceData, 
          attachFile: base64String // only pure base64 string
        });
  
        setAttachedFile(file);
      };
  
      reader.readAsDataURL(file);
    }
  };

  // Remove the attached file
  const removeFile = () => {
    setInvoiceData({ ...invoiceData, attachFile: "" });
    setAttachedFile(null);
  };

  return (
    <BaseLayout4>
  <div className="min-h-screen w-full px-4 md:px-6 lg:px-8">
    {/* Heading */}
    <div className="max-w-7xl mx-auto mb-6 mt-6">
      <h1 className="text-2xl font-bold text-gray-800">Send Invoice</h1>
    </div>

    {/* Invoice Box */}
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="space-y-3">

        {/* Select Student */}
        <section>
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Select Student</h2>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Dropdown */}
            <div className="flex-1 md:max-w-xs">
              <select
                className="w-full p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                value={selectedStudent?._id ?? ""}
               // In your select student onChange handler:
               onChange={(e) => {
                const selected = students.find((stu) => stu._id === e.target.value);
                setSelectedStudent(selected || null);
                if (selected) {
                  const firstEvaluation = selected.evaluation?.[0];
                  setInvoiceData((prev) => ({
                    ...prev,
                    lastUpdatedBy: new Date().toISOString(),
                    student: {
                      studentId: selected._id,
                      studentName: selected.username,
                      studentEmail: selected.student.studentEmail,
                      studentPhone: String(selected.student.studentPhone),
                      country: selected.student.country,
                      city: selected.student.city,
                    },
                    courseName: selected.student.course,
                    packageType: selected.student.package,
                    itemDescription: "Regular Class",
                    rate: "10",
                    duration: "30",
                    evaluationData: firstEvaluation ? { ...firstEvaluation } : undefined,
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

            {/* Student Details */}
            {selectedStudent && (
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div>
                  <p className="text-gray-500 mb-1">Address</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-700" />
                    <p>{selectedStudent.student.city || "No City"}, {selectedStudent.student.country || "No Country"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Email</p>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <p>{selectedStudent.student.studentEmail}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Telephone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-700" />
                    <p>{selectedStudent.student.studentPhone}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* General Info */}
        <section>
          <h2 className="text-sm font-semibold text-gray-700 mb-4">General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="hvhuvu" className="block text-gray-500 text-xs mb-1">Amount (USD)</label>
              <input
                type="number"
                className="w-full p-3 border rounded-md text-xs"
                value={invoiceData.amount || ''}
                onChange={(e) => setInvoiceData({ ...invoiceData, amount: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label htmlFor="hvuv" className="block text-gray-500 text-xs mb-1">Due Date</label>
              <input
                type="date"
                className="w-full p-3 border rounded-md text-xs"
                value={invoiceData.dueDate || ''} 
                onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Item Description */}
        <section>
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Item Description</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead className="bg-gray-100 text-gray-600 text-xs">
                <tr>
                  <th className="p-3 text-left">Package</th>
                  <th className="p-3 text-left">Course</th>
                  <th className="p-3 text-left">Item</th>
                  <th className="p-3 text-left">Duration</th>
                  <th className="p-3 text-left">Rate</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-3"><input className="w-full border rounded p-2 text-xs" value={selectedStudent?.student.package ?? ''} readOnly /></td>
                  <td className="p-3"><input className="w-full border rounded p-2 text-xs" value={selectedStudent?.student.course ?? ''} readOnly /></td>
                  <td className="p-3"><input className="w-full border rounded p-2 text-xs " value="Regular Class" readOnly /></td>
                  <td className="p-3"><input className="w-full border rounded p-2 text-xs" value={30} readOnly /></td>
                  <td className="p-3"><input className="w-full border rounded p-2 text-xs" value={10} readOnly /></td>
                  <td className="p-3 text-right"><input className="w-full border rounded p-2 text-right text-xs" value={300} readOnly /></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Additional Notes */}
          <div className="mt-4">
            <textarea
              className="w-full p-3 border rounded-md min-h-[80px] text-sm"
              placeholder="Additional description..."
              value={invoiceData.itemDescription ?? ''}
              onChange={(e) => setInvoiceData({ ...invoiceData, itemDescription: e.target.value })}
            />
          </div>
        </section>

        {/* Attach Files */}
        <section>
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Attach File</h2>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Upload box */}
            <div className="flex-1 flex items-center gap-2 p-2 bg-green-50 border border-dashed border-green-200 rounded-lg">
              <div className="w-12 h-12 bg-blue-900 flex items-center justify-center rounded-md">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-700">Upload Files</p>
                <p className="text-[10px] text-gray-500">PDF, DOC, PPT, JPG, PNG</p>
                <button
                  type="button"
                  className="mt-2 text-blue-900 text-xs underline"
                  onClick={triggerFileInput}
                >
                  Choose a file
                </button>
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.ppt,.jpg,.png"
                  onChange={handleFileChange}
                />
                {invoiceData.attachFile && (
                  <p className="text-xs mt-1">{attachedFile?.name}</p>
                )}
              </div>
            </div>

            {/* File Preview */}
            {attachedFile && (
              <div className="flex-1 flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <File className="w-5 h-5 text-blue-900" />
                  <div>
                    <p className="text-xs font-medium">{attachedFile.name}</p>
                    <p className="text-xs text-gray-500">{attachedFile.size} bytes</p>
                  </div>
                </div>
                <button
                  className="w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full"
                  onClick={removeFile}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-lg text-sm"
            onClick={handleSubmit}
          >
            Send Invoice
          </button>
          <button
            className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm"
          >
            Save for Later
          </button>
        </div>
        <ToastContainer />
      </div>
    </div>
  </div>
</BaseLayout4>

  );
}
