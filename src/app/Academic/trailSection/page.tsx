'use client'

import BaseLayout1 from '@/components/BaseLayout1';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { FaSyncAlt, FaEdit, FaFilter} from 'react-icons/fa';
import AddEvaluationModel from '@/components/Academic/AddEvaluationModel';
import { User } from '@/types'; // Adjust the path as necessary

// Define the return type of the getAllUsers function
interface User {
    student: {
      studentFirstName: string;
      studentLastName: string;
      studentEmail: string;
      studentPhone: number;
      studentCountry: string;
      studentCity?: string;
      studentLanguage?: string;
      studentCountryCode: string;
      learningInterest: "Quran" | "Islamic Studies" | "Arabic";
      numberOfStudents: number;
      preferredTeacher: "Male" | "Female" | "Either";
      preferredFromTime: string;
      preferredToTime: string;
      timeZone: string;
      referralSource: "Friend" | "Social Media" | "E-Mail" | "Google" | "Other";
      preferredDate: Date;
      evaluationStatus: "PENDING" | "INPROGRESS" | "COMPLETED";
      status: "Active" | "Inactive" | "Deleted";
    };
    isLanguageLevel: boolean;
    languageLevel: string;
    isReadingLevel: boolean;
    readingLevel?: string;
    isGrammarLevel: boolean;
    grammarLevel: string;
    hours: number;
    subscription: {
      subscriptionName: string;
      subscriptionPricePerHr: number;
      subscriptionDays: number;
      subscriptionStartDate: Date;
      subscriptionEndDate: Date;
    };
    planTotalPrice: number;
    classStartDate: Date;
    classEndDate?: Date;
    classStartTime: string;
    classEndTime: string;
    gardianName: string;
    gardianEmail: string;
    gardianPhone: string;
    gardianCity: string;
    gardianCountry: string;
    gardianTimeZone: string;
    gardianLanguage: string;
    studentStatus?: string;
    classStatus?: string;
    comment?: string;
  }


function Page() {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false); 



    const router = useRouter();
    const handleSyncClick = () => {
        if (router) {
        router.push('trailManagement');
        } else {
        console.error('Router is not available');
        }
    };

    const openModal = (user: User | null = null) => {
        setSelectedUser(user);
        setIsEditMode(!!user);
        setIsModalOpen(true);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalIsOpen(false);
    };

    const handleEditClick = () => {
        setShowModal(true);
      };
    
      const handleCloseModal = () => {
        setShowModal(false);
      };
    
    return (
        <BaseLayout1>
            <div className="p-4 bg-[#EDEDED] min-h-screen">
                <div className="rounded-lg p-4">
                    {/* Header */}
                    <div className="flex items-center mb-6 space-x-2">
                        <h2 className="text-2xl font-bold text-gray-800">Scheduled Trail Session</h2>
                        <button className="bg-gray-800 text-white p-2 rounded-full shadow" onClick={handleSyncClick}>
                        <FaSyncAlt />
                        </button>
                    </div>
    
                    {/* Search and Filter */}
                    <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <input
                        type="text"
                        placeholder="Search here..."
                        className="p-2 border rounded-md w-64"
                        />
                        <button className="flex items-center bg-gray-200 p-2 rounded-lg shadow" >
                            <FaFilter className="mr-2" /> Filter
                        </button>
                    </div>
                    <div className="flex items-center space-x-4"onClick={() => openModal(null)}>
                        <button className="px-4 py-2 rounded-md bg-[#223857] text-white hover:bg-[#1c2f49]">
                        + Add new
                        </button>
                        <div>
                        <select className="p-2 border rounded-md">
                            <option>Duration: Last month</option>
                            <option>Duration: Last week</option>
                        </select>
                        </div>
                    </div>
                    </div>
    
                    {/* Table */}
                    <div
                        className="overflow-x-auto bg-white shadow-3xl rounded-md h-[580px]"
                        style={{
                            scrollbarWidth: 'thin', // For Firefox
                            scrollbarColor: '#4A5568 #E2E8F0', // Thumb color and track color for Firefox
                        }}
                    >
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="">
                            {[
                            'Trail ID',
                            'Student Name',
                            'Mobile',
                            'Country',
                            'Course',
                            'Preferred Teacher',
                            'Assigned Teacher',
                            'Class Status',
                            'Student Status',
                            'Action',
                            ].map((header) => (
                            <th
                                key={header}
                                className="shadow-md p-6 text-left font-medium text-gray-700"
                            >
                                {header}
                            </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {Array.from({ length: 80 }).map((_, index) => (
                            <tr key={index}>
                            <td className="p-4 text-[13px] text-center border border-b-gray-300">#0983867</td>
                            <td className="p-4 text-[13px] text-center border border-b-gray-300">Stefan Salvatore</td>
                            <td className="p-4 text-[13px] text-center border border-b-gray-300">9347655367</td>
                            <td className="p-4 text-[13px] text-center border border-b-gray-300">UAE</td>
                            <td className="p-4 text-[13px] text-center border border-b-gray-300">Arabic</td>
                            <td className="p-4 text-[13px] text-center border border-b-gray-300">Male</td>
                            <td className="p-4 text-[13px] text-center border border-b-gray-300">Robert James</td>
                            <td className="p-4 text-[13px] text-center border border-b-gray-300">Completed</td>
                            <td className="p-4 text-[13px] text-center border border-b-gray-300">Joined</td>
                            <td className="p-4 text-[13px] text-center border border-b-gray-300">
                                <button className="bg-[#223857] hover:cursor-pointer text-center text-white p-2 rounded-lg shadow hover:bg-grey-900" onClick={handleEditClick}>                                
                                <FaEdit />
                                </button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
            <AddEvaluationModel
        isOpen={isModalOpen}
        onRequestClose={closeModal} 
        userData={selectedUser}
        isEditMode={isEditMode}
        onSave={() => {
        //   fetchStudents();
          closeModal();
        }}
      />
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-[80%] max-w-3xl h-[720px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Student Details</h3>
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={handleCloseModal}
              >
                ✖
              </button>
            </div>
            <form className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-black text-xs font-medium">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  value="Enter your FirstName"
                  readOnly
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-black text-xs font-medium">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  value="Enter your LastName"
                  readOnly
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-black text-xs font-medium">Email</label>
                <input
                  id="email"
                  type="email"
                  value="Enter your Email"
                  readOnly
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-black text-xs font-medium">Phone Number</label>
                <input
                  id="phoneNumber"
                  type="number"
                  value="Enter your Phone Number"
                  readOnly
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-black text-xs font-medium">City</label>
                <input
                  id="city"
                  type="text"
                  value="Enter your City"
                  readOnly
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="timeZone" className="block text-black text-xs font-medium">Country</label>
                <select id="timeZone" className="w-full mt-2 p-1 border rounded-md text-xs text-gray-400">
                  <option>USA</option>
                </select>
              </div>
              <div>
                <label htmlFor="language" className="block text-black text-xs font-medium">Language</label>
                <input
                  id="language"
                  type="text"
                  value="English"
                  readOnly
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="timeZone" className="block text-black text-xs font-medium">Time Zone</label>
                <input
                  id="preferredTime"
                  type="time"
                  value="9:00 AM to 12:00 PM"
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="trailId" className="block text-black text-xs font-medium">Trail ID</label>
                <select id="trailId" className="w-full mt-2 p-1 border rounded-md text-xs text-gray-400">
                  <option>Enter Trail ID</option>
                </select>
              </div>
              <div>
                <label htmlFor="course" className="block text-black text-xs font-medium">Course</label>
                <input
                  id="course"
                  type="text"
                  value="Arabic"
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="preferredTeacher" className="block text-black text-xs font-medium">Preferred Teacher</label>
                <input
                  id="preferredTeacher"
                  type="text"
                  value="Enter Preferred Teacher"
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="level" className="block text-black text-xs font-medium">Level</label>
                <input
                  id="level"
                  type="text"
                  value="Enter Level"
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="preferredDate" className="block text-black text-xs font-medium">Preferred Date</label>
                <input
                  id="preferredDate"
                  type="date"
                  value="2024-12-02"
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="preferredTime" className="block text-black text-xs font-medium">Preferred Time</label>
                <input
                  id="preferredTime"
                  type="time"
                  value="9:00 AM to 12:00 PM"
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="preferredHours" className="block text-black text-xs font-medium">Preferred Hours</label>
                <input
                  id="preferredHours"
                  type="text"
                  value="9:00 AM to 12:00 PM"
                  readOnly
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="rescheduleDate" className="block text-black text-xs font-medium">Reschedule Date</label>
                <select id="rescheduleDate" className="w-full mt-2 p-1 border rounded-md text-xs text-gray-400">
                  <option>Enter Reschedule Date</option>
                </select>
              </div>
              <div>
                <label htmlFor="selectedTeacher" className="block text-black text-xs font-medium">Select Teacher</label>
                <input
                  id="selectedTeacher"
                  type="text"
                  value="Enter Selected Teacher"
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="prefferdPackage" className="block text-black text-xs font-medium">Prefferd packages</label>
                <input
                  id="prefferdPackage"
                  type="text"
                  value="Enter Prefferd Package"
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="guardianName" className="block text-black text-xs font-medium">Guardian's name</label>
                <input
                  id="guardianName"
                  type="text"
                  value="Enter Guardian's name"
                  className="w-full mt-2 p-1 border rounded-md text-xs text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="guardianEmail" className="block text-black text-xs font-medium">Guardian's email</label>
                <select id="guardianEmail" className="w-full mt-2 p-1 border rounded-md text-xs text-gray-400">
                  <option>Enter Guardian's email</option>
                </select>
              </div>
              <div>
                <label htmlFor="guardianPhone" className="block text-black text-xs font-medium">Guardian's phone number</label>
                <select id="guardianPhone" className="w-full mt-2 p-1 border rounded-md text-xs text-gray-400">
                  <option>Enter Guardian's phone number</option>
                </select>
              </div>
              <div>
                <label htmlFor="classStatus" className="block text-black text-xs font-medium">Class Status</label>
                <select id="classStatus" className="w-full mt-2 p-1 border rounded-md text-xs text-gray-400">
                  <option>Enter Class Status</option>
                </select>
              </div>
              <div>
                <label htmlFor="studentStatus" className="block text-black text-xs font-medium">Student status</label>
                <select id="studentStatus" className="w-full mt-2 p-1 border rounded-md text-xs text-gray-400">
                  <option>Enter Student status</option>
                </select>
              </div>
              <div className="col-span-2">
                <label htmlFor="comment" className="block text-black text-xs font-medium">Comment</label>
                <textarea
                  id="comment"
                  placeholder="Write your comment here..."
                  className="w-full mt-2  border rounded-md text-xs text-gray-400"
                ></textarea>
              </div>
              {/* Save and Cancel Buttons */}
              <div className="col-span-2 flex justify-end space-x-4 mt-0">
                <button
                  type="button"
                  className="px-4 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-[#223857] text-white rounded-md hover:bg-[#1c2f49]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </BaseLayout1>
      );
}

export default Page