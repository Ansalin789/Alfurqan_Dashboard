'use client'

import BaseLayout1 from '@/components/BaseLayout1';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { FaSyncAlt, FaEdit, FaFilter} from 'react-icons/fa';
import AddEvaluationModel from '@/components/Academic/AddEvaluationModel';

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
                                <button className="bg-[#223857] hover:cursor-pointer text-center text-white p-2 rounded-lg shadow hover:bg-grey-900">
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
        </BaseLayout1>
      );
}

export default Page