'use client'

import BaseLayout1 from '@/components/BaseLayout1';
import React from 'react'
import { useRouter } from 'next/navigation';
import { FaSyncAlt, FaEdit, FaFilter} from 'react-icons/fa';




function Page() {

    const router = useRouter();
    const handleSyncClick = () => {
        if (router) {
        router.push('trailManagement');
        } else {
        console.error('Router is not available');
        }
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
                        {/* <div className="flex items-center space-x-2">
                            <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                            <span className="text-xl">🔄</span>
                            </button>
                            <div className="flex items-center space-x-2">
                            <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                                🌞
                            </button>
                            <span className="font-medium">Harsh</span>
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                🤖
                            </div>
                            </div>
                        </div> */}
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
                    <div className="flex items-center space-x-4">
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
                    <table className="w-full  text-sm">
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
        </BaseLayout1>
      );
}

export default Page