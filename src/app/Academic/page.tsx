'use client'

import React from 'react'
import 'react-calendar/dist/Calendar.css'
import BaseLayout1 from '@/components/BaseLayout1'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import TotalList from '../../components/Academic/TotalList';
import { FaSearch } from "react-icons/fa";
import NextEvaluationClass from '../../components/Academic/NextEvaluationClass'
import TeachersStudent from '../../components/Academic/TeachersStudent'
import Countries from '@/components/Academic/Countries';
import Teachers from '@/components/Academic/Teachers';
import Calender from '@/components/Academic/Calender';
import UpcomingClasses from '@/components/Academic/UpcommingClasses';


// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);


export default function Academic() {


  return (
    <div>
      <BaseLayout1>
        <div className="flex flex-col lg:flex-row p-4 w-full">
          <div className="flex-1 overflow-y-scroll scrollbar-hide h-[93vh] pr-4">
            <header className="flex justify-between mb-8 p-4">
              <div className="flex space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search here..."
                      className="p-2 pl-10 w-80 rounded-xl bg-[#CED4DC] text-white border border-gray-300"
                    />
                  </div>
                </div>
              </div>
            </header>

            <main className="grid grid-cols-12 gap-4 -mt-8">
              <div className="col-span-12 grid grid-cols-1 gap-4 p-4">
                <TotalList />
              </div>
              <div className="col-span-12 grid grid-cols-1 gap-4 p-4">
                <NextEvaluationClass />
              </div>

              <div className="col-span-5 grid grid-cols-3 gap-4 p-4">
                <TeachersStudent />
              </div>
              <div className="col-span-3 grid grid-cols-3 gap-4 p-4">
                <Countries />
              </div>
              <div className="col-span-4 grid grid-cols-3 gap-4 p-4">
                <Teachers />
              </div>
            

              <div className="col-span-12 bg-[#CED4DC] p-6 rounded-[30px] shadow">
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
                        id: 1,
                        name: 'Emily Peterson',
                        topic: 'World War II',
                        task: 'Essay on the Impact of WWII on Modern Europe',
                        date: 'April 30, 2024',
                        action: 'Active',
                      },
                      {
                        id: 2,
                        name: 'Jacob Lee',
                        topic: 'The Cold War',
                        task: 'Research Paper on the Cuban Missile Crisis',
                        date: 'May 5, 2024',
                        action: 'Not Viewed',
                      },
                      {
                        id: 3,
                        name: 'Sarah Martin',
                        topic: 'European Colonization',
                        task: 'Prepare Arguments for Class Debate',
                        date: 'April 29, 2024',
                        action: 'Reviewing',
                      },
                      {
                        id: 4,
                        name: 'Liam Johnson',
                        topic: 'American History',
                        task: 'Presentation on the Civil Rights Movement',
                        date: 'May 10, 2024',
                        action: 'Not Viewed',
                      },
                    ].map((item) => (
                      <tr key={item.id} className="border-b">
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
              
            </main>
          </div>
      {/* calender sidebar */}
          <div className="w-full lg:w-[300px] mt-6 lg:mt-0 p-0 rounded-[20px] h-[600px]">
            <div className="col-span-4 p-4 rounded-lg shadow">
              <Calender />
            </div>
            <div className="col-span-4 bg-white p-0 rounded-lg shadow">
              <UpcomingClasses />
            </div>
          </div>
        </div>
      </BaseLayout1>
    </div>
  )
}
