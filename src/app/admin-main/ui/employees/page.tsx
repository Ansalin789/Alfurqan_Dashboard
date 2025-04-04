'use client';

import BaseLayout4 from '@/components/BaseLayout4';
import React, { useState } from 'react';
import { Sun, Bell } from "lucide-react";
import Link from 'next/link';
import StudentsRecord from "../../components/studentrecord";
import CountriesCard from "../../components/counteries";
import GaugeChart from "../../components/gender";
import TrailManagement from "../../components/studentlist";
import EmployeeDepartment from '../../components/EmployeeDepartment';
import TeachersRecord from '../../components/TeachersRecord';
import TeachersGender from '../../components/TeachersGender';
import EmployeeGender from '../../components/EmployeeGender';
import TeachersCountry from '../../components/TeachersCountry';
import EmployeeCountry from '../../components/EmployeeCountry';
import TeachersCards from '../../components/TeachersCards';
import EmployeeCards from '../../components/EmployeeCards';


const Page = () => {
    const [activeTab, setActiveTab] = useState<'teachers' | 'otheremployees' | 'recruitment'>('teachers');

    return (
        <BaseLayout4>
            <div className="p-4 min-h-screen mx-auto w-full">
                <div className="p-0 flex items-center justify-between mr-12">
                    <div className="relative">
                        <h2 className='text-xl font-semibold mb-6'>Employees</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 bg-[#fff] rounded-lg shadow hover:bg-gray-200">
                            <Sun size={16} className="text-black" />
                        </button>
                        <button className="p-2 bg-[#fff] rounded-lg shadow hover:bg-gray-200">
                            <Bell size={16} className="text-black" />
                        </button>
                        <Link href="#">
                            <img
                                src="/assets/images/student-profile.png"
                                alt="Profile"
                                className="w-8 h-8 rounded-lg border border-gray-300 shadow"
                            />
                        </Link>
                    </div>
                </div>
                <div className="flex space-x-4 border-b pb-2 p-6">
                    <button
                        className={`px-4 py-2 text-[13px] font-semibold ${activeTab === 'teachers' ? 'bg-[#012A4A] text-white rounded-lg' : ''}`}
                        onClick={() => setActiveTab('teachers')}
                    >
                        Teachers
                    </button>
                    <button
                        className={`px-4 py-2 text-[13px] font-semibold ${activeTab === 'otheremployees' ? 'bg-[#012A4A] text-white rounded-lg' : ''}`}
                        onClick={() => setActiveTab('otheremployees')}
                    >
                        Other Employees
                    </button>
                    <button
                        className={`px-4 py-2 text-[13px] font-semibold ${activeTab === 'recruitment' ? 'bg-[#012A4A] text-white rounded-lg' : ''}`}
                        onClick={() => setActiveTab('recruitment')}
                    >
                        Recruitment
                    </button>
                </div>

                {/* Tab Content */}
                <div className="mt-4">
                    {activeTab === 'teachers' && (
                        <div className="flex w-full mx-auto">
                            <main className="flex-grow p-6">
                                <div className="flex flex-wrap gap-6">
                                    <TeachersRecord />
                                    <TeachersGender />
                                    <TeachersCountry />
                                </div>
                                <div className="flex flex-wrap gap-4 mt-2">
                                    <TeachersCards />
                                </div>
                                <div className="flex justify-end ">
                                    <button className="flex items-center gap-1 text-gray-600 text-sm bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300 transition">
                                        View all
                                        <span className="text-lg">›</span>
                                    </button>
                                </div>

                            </main>
                        </div>
                    )}
                    {activeTab === 'otheremployees' && (
                        <div className="flex mx-auto">
                            <main className="flex-grow p-6">
                                <div className="flex flex-wrap gap-6">
                                    <EmployeeDepartment />
                                    <EmployeeGender />
                                    <EmployeeCountry />
                                </div>
                                <div className="flex flex-wrap gap-4 mt-2">
                                    <EmployeeCards />
                                </div>
                                <div className="flex justify-end ">
                                    <button className="flex items-center gap-1 text-gray-600 text-sm bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300 transition">
                                        View all
                                        <span className="text-lg">›</span>
                                    </button>
                                </div>

                            </main>
                        </div>
                    )}
                    {activeTab === 'recruitment' && (
                        <div>
                            <h2 className="text-xl font-bold">Recruitment Section</h2>
                            <p>Details about recruitment will go here.</p>
                        </div>
                    )}
                </div>
            </div>
        </BaseLayout4>
    );
};

export default Page;
