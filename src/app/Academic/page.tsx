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
        <div className="flex flex-col lg:flex-row p-2 w-full">
          <div className="flex-1 pr-4">
            <header className="flex justify-between p-[5px]">
              <div className="flex space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <FaSearch className="absolute w-3 left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search here..."
                      className=" h-7 pl-8 w-48 text-[12px] rounded-xl bg-[#CED4DC] text-white border border-gray-300"
                    />
                  </div>
                </div>
              </div>
            </header>

            <main className="grid grid-cols-12 gap-4 ">
              <div className="col-span-12 grid grid-cols-1 gap-4 p-0">
                <TotalList />
              </div>
              <div className="col-span-12 grid grid-cols-1 gap-4 p-0">
                <NextEvaluationClass />
              </div>

              <div className="col-span-5 grid grid-cols-3 gap-4 p-0">
                <TeachersStudent />
              </div>
              <div className="col-span-4 grid grid-cols-3 gap-4 p-0">
                <Countries />
              </div>
              <div className="col-span-3 grid grid-cols-3 gap-4 p-0">
                <Teachers />
              </div>
            

              <div className="col-span-12 bg-[#CED4DC] p-4 rounded-[30px] shadow mb-2">
                <h3 className="text-[15px] font-medium ml-4">Student Evaluation</h3>
                <table className="w-full mt-2">
                  <thead>
                    <tr className="text-center border-b text-[13px]">
                      <th className="p-2">Trail</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Mobile</th>
                      <th className="p-2">Country</th>
                      <th className="p-2">Preferred Teacher</th>
                      <th className="p-2">Date</th>
                      <th className="p-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        id: 1,
                        name: 'Ansalin',
                        task: '9344879988',
                        date: 'April 30, 2024',
                        action: 'Active',
                      },
                      {
                        id: 2,
                        name: 'Gowtham',
                        task: '9344349988',
                        date: 'May 5, 2024',
                        action: 'Not Viewed',
                      },
                      {
                        id: 3,
                        name: 'Vaishak',
                        task: '8944879988',
                        date: 'April 29, 2024',
                        action: 'Reviewing',
                      },
                      {
                        id: 4,
                        name: 'Bharath',
                        task: '9894879988',
                        date: 'May 10, 2024',
                        action: 'Not Viewed',
                      },
                    ].map((item) => (
                      <tr key={item.id} className="border-b text-[11px] text-center">
                        <td className="p-2">{item.id}</td>
                        <td className="p-2">{item.name}</td>
                        <td className="p-2">{item.task}</td>
                        <td className="p-2">{item.date}</td>
                        <td className="p-2">{item.action}</td>
                        <td className="p-2">{item.action}</td>
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
            <div className="col-span-4 p-4">
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
