'use client'

import React from 'react'
import 'react-calendar/dist/Calendar.css'
import BaseLayout1 from '@/components/BaseLayout1'
import { FaUserAlt } from 'react-icons/fa';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaMale, FaFemale } from 'react-icons/fa';
import TeachersList from '../../components/Academic/TeachersList';
import TotalList from '../../components/Academic/TotalList';
import { FaSearch } from "react-icons/fa";
import NextEvaluationClass from '../../components/Academic/NextEvaluationClass'


// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);


export default function Academic() {

  // const ClassCard = ({}) => (
  //   <div className="bg-blue-500 p-6 rounded-lg shadow text-white mb-4">
  //     {classes.map((classInfo, index) => (
  //       <div key={index} className="flex justify-between items-center mb-4">
  //         <div className="flex items-center">
  //           <div className="mr-8 flex gap-28">
  //             <h3 className="text-lg font-medium">{classInfo.title}</h3>
  //             <div className="flex items-center">
  //               <FaUser className="mr-2 w-4 h-4" />
  //               <p>{classInfo.name}</p>
  //             </div>
  //           </div>
  //           <div className="flex items-center ml-40">
  //             <FaCalendarAlt className="mr-2 w-4 h-4" />
  //             <p>{classInfo.date}</p>
  //           </div>
  //         </div>
  //         <div className="flex items-center font-bold bg-white text-[#0e3c50] p-2 rounded-lg shadow">
  //           <FaClock className="mr-2" />
  //           <p>{classInfo.time}</p>
  //         </div>
  //       </div>
  //     ))}
  //   </div>
  // );

  const data = {
    labels: ['Active', 'Not Active', 'On Leave', 'Left'],
    datasets: [
      {
        data: [27, 50, 23, 23], // Corresponding percentages
        backgroundColor: ['#FFC107', '#F44336', '#4CAF50', '#E0E0E0'],
        hoverBackgroundColor: ['#FFB300', '#D32F2F', '#388E3C', '#BDBDBD'],
      },
    ],
  };

  // const classes = [
  //   {
  //     title: 'Evaluation Class',
  //     name: 'Abinesh',
  //     date: '06 May 2024',
  //     time: '9:00 AM - 10:00 AM',
  //   },
  //   {
  //     title: 'Evaluation Class',
  //     name: 'sagarps',
  //     date: '08 May 2024',
  //     time: '10:00 AM - 11:00 AM',
  //   },
  // ];



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

            <main className="grid grid-cols-12 gap-4">
              <div className="col-span-12 grid grid-cols-1 gap-4 p-4">
                <TotalList />
              </div>
              <div className="col-span-12 grid grid-cols-1 gap-4 p-4">
                <NextEvaluationClass />
              </div>

              <TeachersList />

            

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
              
            </main>
          </div>
      {/* calender sidebar */}
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
      </BaseLayout1>
    </div>
  )
}
