'use client'

// import React, { useState } from 'react'
import 'react-calendar/dist/Calendar.css'
import BaseLayout1 from '@/components/BaseLayout1'
import Image from 'next/image'

export default function Academic() {

  return (
    <div>
      <BaseLayout1>
        <div className="flex h-screen">
          <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
            <header className="flex justify-between mb-8">
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Search here..."
                  className="p-2 w-80 rounded-md border border-gray-300"
                />
                <input
                  type="text"
                  placeholder="Search here..."
                  className="p-2 w-80 rounded-md border border-gray-300"
                />
              </div>
              <div className="flex items-center space-x-4">
                <Image
                  src="/path/to/profile.png"
                  alt="Profile"
                  className="w-10 h-10 rounded-full" width={40} height={40}
                />
              </div>
            </header>

            <main className="grid grid-cols-12 gap-4">
              {/* Statistics Cards */}
              <div className="col-span-9 grid grid-cols-4 gap-4">
                {['Trail Assigned', 'Evaluation Completed', 'Evaluation Pending', 'Total Dropped'].map(
                  (title, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg shadow flex flex-col items-center"
                    >
                      <span className="text-2xl font-semibold">{index * 20 + 20}</span>
                      <span className="text-gray-500">{title}</span>
                    </div>
                  )
                )}
              </div>
              <div className="col-span-3 bg-white p-4 rounded-lg shadow flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mb-2"></div>
                <h2 className="text-xl font-semibold">Siddhesh</h2>
              </div>

              {/* Pie Charts */}
              <div className="col-span-6 bg-white p-4 rounded-lg shadow">
                {/* Total Students */}
                <h3 className="text-lg font-medium">Total Students</h3>
                <div className="flex items-center justify-center mt-4">
                  {/* Add your pie chart here */}
                </div>
              </div>
              <div className="col-span-6 bg-white p-4 rounded-lg shadow">
                {/* Total Teachers */}
                <h3 className="text-lg font-medium">Total Teachers</h3>
                <div className="flex items-center justify-center mt-4">
                  {/* Add your pie chart here */}
                </div>
              </div>

              {/* Next Evaluation Class */}
              <div className="col-span-12 bg-red-500 p-4 rounded-lg shadow flex items-center justify-between text-white">
                <div>
                  <h3 className="text-lg font-medium">Your Next Evaluation Class</h3>
                  <p>Abinesh @ 9:00 AM</p>
                </div>
                <div className="text-3xl font-semibold">Starts in 20:12:19</div>
              </div>

              {/* Evaluation Classes */}
              <div className="col-span-12 grid grid-cols-2 gap-4">
                {['Evaluation Class', 'Evaluation Class'].map((title, index) => (
                  <div
                    key={index}
                    className="bg-blue-500 p-4 rounded-lg shadow text-white flex justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-medium">{title}</h3>
                      <p>Abinesh</p>
                    </div>
                    <div className="text-right">
                      <p>06 May 2024</p>
                      <p>9:00 AM - 10:00 AM</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trail Request List */}
              <div className="col-span-12 bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium">Trail Request List</h3>
                <table className="w-full mt-4">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="p-2">Student Name</th>
                      <th className="p-2">Topic</th>
                      <th className="p-2">Task Name</th>
                      <th className="p-2">Submission Date</th>
                      <th className="p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: 'Emily Peterson',
                        topic: 'World War II',
                        task: 'Essay on the Impact of WWII on Modern Europe',
                        date: 'April 30, 2024',
                        action: 'Active',
                      },
                      {
                        name: 'Jacob Lee',
                        topic: 'The Cold War',
                        task: 'Research Paper on the Cuban Missile Crisis',
                        date: 'May 5, 2024',
                        action: 'Not Viewed',
                      },
                      {
                        name: 'Sarah Martin',
                        topic: 'European Colonization',
                        task: 'Prepare Arguments for Class Debate',
                        date: 'April 29, 2024',
                        action: 'Reviewing',
                      },
                      {
                        name: 'Liam Johnson',
                        topic: 'American History',
                        task: 'Presentation on the Civil Rights Movement',
                        date: 'May 10, 2024',
                        action: 'Not Viewed',
                      },
                    ].map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{item.name}</td>
                        <td className="p-2">{item.topic}</td>
                        <td className="p-2">{item.task}</td>
                        <td className="p-2">{item.date}</td>
                        <td className="p-2">{item.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calendar and Student List */}
              <div className="col-span-4 bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium">Calendar</h3>
                {/* Add your calendar here */}
              </div>
              <div className="col-span-4 bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium">Students/Teacher</h3>
                <table className="w-full mt-4">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="p-2">Teachers Name</th>
                      <th className="p-2">No. of Students</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Abdullah Sulaiman', students: 20 },
                      { name: 'Iman Gabel', students: 10 },
                      { name: 'Hassan Ibrahim', students: 40 },
                      { name: 'Maryam Hossain', students: 11 },
                      { name: 'Ayesha Islam', students: 1 },
                    ].map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{item.name}</td>
                        <td className="p-2">{item.students}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </main>
          </div>
        </div>
      </BaseLayout1>
    </div>
  )
}
