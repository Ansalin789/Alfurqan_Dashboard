import BaseLayout from '@/components/BaseLayout';
import React from 'react'

export default function Analytics() {

    const cards = [
        {
          title: 'Total Students',
          value: '12,345',
          growth: '5.4% from last year',
          chart: '📊',
        },
        {
          title: 'Classes',
          value: '100',
          growth: '+15% than last month',
          chart: '📈',
        },
        {
          title: 'Earnings',
          value: '$45,741',
          growth: '+15%',
          chart: '💵',
        },
      ];

      const students = [
        { name: 'Samantha William', id: '1234567890', course: 'UI Design Courses', date: 'January 2, 2020', status: 'Active' },
        { name: 'Jordan Nico', id: '1234567890', course: 'Fullstack Developer', date: 'January 2, 2020', status: 'Active' },
        { name: 'Nadila Adja', id: '1234567890', course: 'UX Research', date: 'January 2, 2020', status: 'Active' },
      ];

  return (
    <>
    <BaseLayout>
    <div className="flex min-h-screen">

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <h1 className="text-3xl font-semibold mb-6">Analytics</h1>

        <div className="grid grid-cols-3 gap-6">
            {cards.map((card, index) => (
                <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between"
                >
                <div>
                    <h2 className="text-xl font-semibold">{card.title}</h2>
                    <p className="text-gray-600">{card.value}</p>
                    <p className="text-green-500 text-sm">{card.growth}</p>
                </div>
                <div className="text-3xl">{card.chart}</div>
                </div>
            ))}
        </div>

        {/* Students Table */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Students List</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search"
            className="border rounded-lg px-4 py-2"
          />
          <button className="text-green-600">View All</button>
        </div>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th>Name</th>
            <th>Student ID</th>
            <th>Courses</th>
            <th>Join Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index} className="border-t">
              <td>{student.name}</td>
              <td>{student.id}</td>
              <td>{student.course}</td>
              <td>{student.date}</td>
              <td>
                <span className={`px-2 py-1 rounded-lg ${student.status === 'Active' ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
                  {student.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-end items-center space-x-4">
        <span>Showing 1-5 of 100 data</span>
        <div className="flex space-x-1">
          <button className="px-3 py-1 border rounded">1</button>
          <button className="px-3 py-1 border rounded bg-green-500 text-white">2</button>
          <button className="px-3 py-1 border rounded">3</button>
        </div>
      </div>
        </div>
      </div>
    </div>
    </BaseLayout>
    
    </>
  )
}
