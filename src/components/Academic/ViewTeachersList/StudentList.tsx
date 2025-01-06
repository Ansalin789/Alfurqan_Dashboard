import React from 'react';
import Image from 'next/image';
import { nanoid } from 'nanoid'; // Import nanoid for generating unique IDs

const StudentList = () => {
  const students = [
    { id: nanoid(), name: 'Abdullah Sulaiman', course: 'Arabic', avatar: '/assets/images/proff.jpg' },
    { id: nanoid(), name: 'Iman Gabel', course: 'Quran', avatar: '/assets/images/proff.jpg' },
    { id: nanoid(), name: 'Hassan Zadran', course: 'Arabic', avatar: '/assets/images/proff.jpg' },
    { id: nanoid(), name: 'Hassan dummy', course: 'Quran', avatar: '/assets/images/proff.jpg' },
    { id: nanoid(), name: 'Hassan Data', course: 'Quran', avatar: '/assets/images/proff.jpg' },
    { id: nanoid(), name: 'Hassan Ibrahim', course: 'Quran', avatar: '/assets/images/proff.jpg' },
  ];

  return (
    <div className="bg-[#CED4DC] rounded-lg shadow-lg p-6 w-72 h-[300px] ml-20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Teachers List</h3>
        <span className="text-lg font-semibold">20</span>
      </div>
      <ul className="space-y-2 overflow-y-auto h-40 scrollbar-thin scrollbar-track-black">
        {students.map((student) => (
          <li key={student.id} className="flex items-center">
            <Image
              src={student.avatar}
              width={24}
              height={24}
              className="rounded-full"
              alt={`${student.name} avatar`}
            />
            <span className="ml-3 text-[12px]">{student.name} ({student.course})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;