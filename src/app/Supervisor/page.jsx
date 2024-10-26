'use client'

import BaseLayout2 from '@/components/BaseLayout2';
import React from 'react';
import EmploymentStatusChart from '@/components/Supervisor/EmploymentStatusChart'
import Students from '@/components/Supervisor/Students'


import { useState } from 'react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Supervisor() {

  const data = [
    { name: 'Sep 01', companyWebsite: 30, socialMedia: 20, employeeRef: 50 },
    { name: 'Sep 02', companyWebsite: 45, socialMedia: 10, employeeRef: 80 },
    { name: 'Sep 03', companyWebsite: 70, socialMedia: 25, employeeRef: 60 },
    { name: 'Sep 04', companyWebsite: 55, socialMedia: 30, employeeRef: 90 },
    { name: 'Sep 05', companyWebsite: 85, socialMedia: 20, employeeRef: 100 },
    { name: 'Sep 06', companyWebsite: 40, socialMedia: 25, employeeRef: 70 },
    { name: 'Sep 07', companyWebsite: 60, socialMedia: 15, employeeRef: 90 },
  ];


  return (
    <>
    <BaseLayout2>
    <div className="flex flex-col lg:flex-row p-4 w-full">
      <div className="grid grid-cols-12 gap-4 mt-10">

        {/* Main content */}
        <div className="col-span-10">
          <div className="grid grid-cols-12 gap-4">
            {/* Top stats */}
            <div className="col-span-12 grid grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-purple-100 rounded-lg shadow-lg">
                <div>
                  <h2 className="text-sm text-gray-500">Total Applications</h2>
                  <h1 className="text-4xl font-bold">2187</h1>
                  <div className="flex items-center">
                    <span className="text-green-600 font-semibold">+12%</span>
                    <span className="ml-2 bg-green-100 text-green-500 text-sm px-2 py-1 rounded-full">▲ 12%</span>
                  </div>
                </div>
              
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-300"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-purple-500"
                      strokeWidth="3.8"
                      strokeDasharray="76, 100"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-purple-500">76%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#EEF4FE] rounded-lg shadow-lg">
                <div>
                  <h2 className="text-sm text-gray-500">Shortlisted candidates</h2>
                  <h1 className="text-4xl font-bold">1379</h1>
                  <div className="flex items-center">
                    <span className="text-green-600 font-semibold">+16%</span>
                    <span className="ml-2 bg-green-100 text-green-500 text-sm px-2 py-1 rounded-full">▲ 16%</span>
                  </div>
                </div>
              
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-300"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-blue-500"
                      strokeWidth="3.8"
                      strokeDasharray="76, 100"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-500">63%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#F3EEFE] rounded-lg shadow-lg">
                <div>
                  <h2 className="text-sm text-gray-500">Rejected Candidates</h2>
                  <h1 className="text-4xl font-bold">232</h1>
                  <div className="flex items-center">
                    <span className="text-green-600 font-semibold">+14%</span>
                    <span className="ml-2 bg-green-100 text-green-500 text-sm px-2 py-1 rounded-full">▲ 14%</span>
                  </div>
                </div>
              
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-300"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-red-500"
                      strokeWidth="3.8"
                      strokeDasharray="76, 100"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-red-500">21%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='col-span-12 grid grid-cols-2 gap-4'>
            <div className="mt-6 p-6 rounded-lg">
              <h3 className="text-xl font-semibold">Application Received Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="companyWebsite" stroke="#8884d8" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="socialMedia" stroke="#82ca9d" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="employeeRef" stroke="#ff7300" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Employment by Status and Students */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="col-span-6 bg-white p-6 rounded-lg shadow-lg" >
                <EmploymentStatusChart />
              </div>
              <div className="col-span-6 bg-white p-6 rounded-lg shadow-lg">
                <Students />
                {/* Students Stats Component */}
              </div>
            </div>
          </div>

        </div>

      </div>

      <div className="w-full lg:w-[300px] mt-6 lg:mt-0 bg-[#1c3557] p-6 rounded-[20px] h-[600px]">
                <div className="col-span-4 bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-medium">Calendar</h3>
                </div>
                <div className="col-span-4 bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-medium">Students/Teacher</h3>
                  <table className="w-full mt-4">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="p-2">Teacher Name</th>
                        <th className="p-2">No. of Students</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Abdullah Sulaima', students: 20 },
                        { name: 'Iman Gabel', students: 10 },
                        { name: 'Hassan Ibrahim', students: 40 },
                        { name: 'Maryam Hosain', students: 11 },
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
      </div>
    </div>
    </BaseLayout2>
    </>
  );
}
