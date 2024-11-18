import React from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import BaseLayout from '@/components/BaseLayout';

export default function Assignment() {
    const studentData = [
        { name: 'Samantha William', id: '1234567890', course: 'UI Design Courses', date: 'January 2, 2020', status: 'Completed' },
        { name: 'Jordan Nico', id: '1234567890', course: 'Fullstack Developer', date: 'January 2, 2020', status: 'Not Completed' },
        { name: 'Nadila Adja', id: '1234567890', course: 'UX Research', date: 'January 2, 2020', status: 'Not Assigned' }
      ];

  return (
    <BaseLayout>
      <div className="flex h-screen bg-gray-200">

        {/* Main Content */}
        <div className="flex-1 p-6">
          <header className="mb-8">
            <h1 className="text-3xl font-semibold">Assignment</h1>
          </header>

          <main>
            {/* Current Status Section */}
            <section className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
                <div className="text-4xl font-semibold text-green-500">80%</div>
                <div className="text-xl font-medium">Total Assignment Assigned</div>
                <div className="text-2xl font-semibold">25</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
                <div className="text-4xl font-semibold text-yellow-500">62%</div>
                <div className="text-xl font-medium">Total Assignment Completed</div>
                <div className="text-2xl font-semibold">10</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
                <div className="text-4xl font-semibold text-red-500">62%</div>
                <div className="text-xl font-medium">Total Assignment Pending</div>
                <div className="text-2xl font-semibold">15</div>
              </div>
            </section>

            {/* Students List Section */}
            <section className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Students List</h2>
                <button className="text-green-500">View all</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Date</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 bg-gray-50"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {studentData.map((student, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.course}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.status === 'Completed' ? 'bg-green-100 text-green-800' : student.status === 'Not Completed' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <FiMoreVertical className="text-gray-400" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </div>
      </div>
    </BaseLayout>
    
  )
}
