import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

export default function Academic() {
    const teachersData = [
        { name: 'Abdullah Sulaiman', students: 20 },
        { name: 'Iman Gabel', students: 10 },
        { name: 'Hassan Ibrahim', students: 40 },
        { name: 'AL Amin', students: 60 },
        { name: 'Azar Ahmed', students: 80 },
        { name: 'Azar Ahmed', students: 80 },
        { name: 'Azar Ahmed', students: 80 },
        { name: 'Azar Ahmed', students: 80 },
        { name: 'Azar Ahmed', students: 80 },
        { name: 'Azar Ahmed', students: 80 },
    ];

    return (
        <div className="col-span-12 bg-[#3e68a1] p-4 py-3 rounded-[25px] shadow-xl">
            <h3 className="text-[15px] font-semibold text-white mb-2">Teachers - Students</h3>
            <div className="max-h-40 overflow-y-scroll scrollbar-thin">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-white">Teachers</th>
                            <th className="px-4 py-2 text-right text-sm font-medium text-white">Students</th>
                        </tr>
                    </thead>
                    <tbody className="mb-1">
                        {teachersData.map((teacher, index) => (
                            <tr key={index}>
                                <td className="px-2 py-1 text-[12px] whitespace-nowrap flex items-center text-white">
                                    <FaUserCircle className="text-red-500 mr-2" />
                                    {teacher.name}
                                </td>
                                <td className="px-4 py-1 text-[13px] whitespace-nowrap text-right text-white">{teacher.students}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
