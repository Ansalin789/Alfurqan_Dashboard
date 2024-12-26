import React from 'react';

const StudentList = () => {
  const students = [
    { name: 'Abdullah Sulaiman', course: 'Arabic' },
    { name: 'Iman Gabel', course: 'Quran' },
    { name: 'Hassan Ibrahim', course: 'Arabic' },
    { name: 'Hassan Ibrahim', course: 'Quran' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 ml-14">
      <h3 className="text-lg font-semibold mb-4">Students List</h3>
      <ul className="space-y-2">
        {students.map((student, index) => (
          <li key={index} className="flex justify-between items-center">
            <span>{student.name} ({student.course})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;
