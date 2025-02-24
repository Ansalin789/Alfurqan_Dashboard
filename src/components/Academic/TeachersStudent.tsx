import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import Link from 'next/link';
import axios from 'axios';

interface TeacherData {
    _id: string | null;
    teacherName: string;
    teacherEmail: string;
    studentCount: number;
}

interface ApiResponse {
    data: TeacherData[];
}

export default function Academic() {
    const [teachersData, setTeachersData] = useState<TeacherData[]>([]);

    useEffect(() => {
        const fetchTeachersData = async () => {
            try {
                const teacherId = "some_teacher_id"; // Replace with actual teacherId
                const response = await axios.get<ApiResponse>(`https://alfurqanacademy.tech/teacher-student-count`, {
                    params: { teacherId }
                });
                setTeachersData(response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchTeachersData();
    }, []);

    return (
        <Link 
            href="/Academic/manageStudents"
            className="block col-span-12 bg-[#3e68a1] p-4 py-3 rounded-[25px] shadow-xl 
                     transition-transform hover:scale-[1.02] 
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="View Teachers and Students Management"
        >
            <div className="col-span-12 bg-[#3e68a1] p-4 py-3 rounded-[25px] shadow-xl">
                <h3 className="text-[15px] font-semibold text-white mb-2">Teachers - Students</h3>
                <div className="max-h-40 overflow-y-scroll scrollbar-none">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-white">Teachers</th>
                                <th className="px-4 py-2 text-right text-sm font-medium text-white">Students</th>
                            </tr>
                        </thead>
                        <tbody className="mb-1">
                            {teachersData.map((teacher) => (
                                <tr key={teacher._id || teacher.teacherEmail}>
                                    <td className="px-2 py-1 text-[12px] whitespace-nowrap flex items-center text-white">
                                        <FaUserCircle className="text-red-500 mr-2" />
                                        {teacher.teacherName}
                                    </td>
                                    <td className="px-4 py-1 text-[13px] whitespace-nowrap text-right text-white">{teacher.studentCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Link>
    );
}
