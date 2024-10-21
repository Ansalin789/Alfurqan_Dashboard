import React from 'react';
import BaseLayout1 from '@/components/BaseLayout1';


export default function ManageStudents() {
  return (
  <>
    <BaseLayout1>
        <div className="flex h-screen bg-gray-100">
        <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
            <div className="relative">
                <input
                type="text"
                placeholder="Search here..."
                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
                />
                <i className="fas fa-search absolute left-3 top-2.5 text-gray-400"></i>
            </div>
            <button className="bg-pink-500 text-white px-4 py-2 rounded-full">
                New Student
            </button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-200 text-gray-600">
                <tr>
                    <th className="w-1/12 px-4 py-2">ID</th>
                    <th className="w-2/12 px-4 py-2">Date Join</th>
                    <th className="w-2/12 px-4 py-2">Name</th>
                    <th className="w-2/12 px-4 py-2">Teacher's Name</th>
                    <th className="w-2/12 px-4 py-2">City</th>
                    <th className="w-1/12 px-4 py-2">Contact</th>
                    <th className="w-1/12 px-4 py-2">Schedule Classes</th>
                    <th className="w-1/12 px-4 py-2">Classes Not Schedule</th>
                    <th className="w-1/12 px-4 py-2">Level</th>
                    <th className="w-1/12 px-4 py-2">Status</th>
                </tr>
                </thead>
                <tbody className="text-gray-700">
                <tr>
                    <td className="border px-4 py-2">#001234</td>
                    <td className="border px-4 py-2">June 1, 2020, 08:22 AM</td>
                    <td className="border px-4 py-2">Fanny Siregar</td>
                    <td className="border px-4 py-2">Mr. Johnson</td>
                    <td className="border px-4 py-2">City</td>
                    <td className="border px-4 py-2">
                    <i className="fas fa-comments text-pink-500"></i>
                    </td>
                    <td className="border px-4 py-2 text-center">10</td>
                    <td className="border px-4 py-2 text-center">3</td>
                    <td className="border px-4 py-2 text-center">1</td>
                    <td className="border px-4 py-2 text-center">
                    <button className="bg-blue-500 text-white px-4 py-1 rounded-full">
                        View
                    </button>
                    </td>
                </tr>
                {/* Repeat the above <tr> for more rows */}
                </tbody>
            </table>
            </div>
            <div className="flex justify-between items-center mt-4">
            <span>Showing 10 from 46 data</span>
            <div className="flex space-x-2">
                <button className="bg-pink-500 text-white px-3 py-1 rounded-full">
                1
                </button>
                <button className="bg-white text-pink-500 px-3 py-1 rounded-full border border-pink-500">
                2
                </button>
                <button className="bg-white text-pink-500 px-3 py-1 rounded-full border border-pink-500">
                3
                </button>
                <button className="bg-white text-pink-500 px-3 py-1 rounded-full border border-pink-500">
                4
                </button>
            </div>
            </div>
        </div>
        </div>
    </BaseLayout1>
  </>
    
  );
};
