import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

export default function Academic() {
    const teachersData = [
        { name: 'Abdullah Sulaiman', students: 20 },
        { name: 'Iman Gabel', students: 10 },
        { name: 'Hassan Ibrahim', students: 40 },
        { name: 'AL Amin', students: 60 },
        { name: 'Azar Ahmed', students: 80 },
    ];

    return (
        <div className="col-span-5 bg-[#3e68a1] p-6 rounded-[25px] shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Teachers - Students</h3>
            <div className="max-h-48 overflow-y-scroll scrollbar-hide">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-white">Teachers</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-white">Students</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {teachersData.map((teacher, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2 whitespace-nowrap flex items-center text-white">
                                    <FaUserCircle className="text-red-500 mr-2" />
                                    {teacher.name}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-right text-white">{teacher.students}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
