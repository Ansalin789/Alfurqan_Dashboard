'use client'

import React from 'react'
import 'react-calendar/dist/Calendar.css'
import BaseLayout1 from '@/components/BaseLayout1'
import Image from 'next/image'

import { FaUser } from 'react-icons/fa';
import { FaCalendarAlt } from 'react-icons/fa';
import { FaClock } from 'react-icons/fa';
import { FaUserAlt } from 'react-icons/fa';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaMale, FaFemale } from 'react-icons/fa';
import TeachersList from '../../components/Academic/TeachersList';
import TotalList from '../../components/Academic/TotalList';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);


export default function Academic() {

  const ClassCard = ({ title, name, date, time }) => (
    <div className="bg-blue-500 p-6 rounded-lg shadow text-white mb-4">
      {classes.map((classInfo, index) => (
        <div key={index} className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="mr-8 flex gap-28">
              <h3 className="text-lg font-medium">{classInfo.title}</h3>
              <div className="flex items-center">
                <FaUser className="mr-2 w-4 h-4" />
                <p>{classInfo.name}</p>
              </div>
            </div>
            <div className="flex items-center ml-40">
              <FaCalendarAlt className="mr-2 w-4 h-4" />
              <p>{classInfo.date}</p>
            </div>
          </div>
          <div className="flex items-center font-bold bg-white text-[#0e3c50] p-2 rounded-lg shadow">
            <FaClock className="mr-2" />
            <p>{classInfo.time}</p>
          </div>
        </div>
      ))}
    </div>
  );

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

  const classes = [
    {
      title: 'Evaluation Class',
      name: 'Abinesh',
      date: '06 May 2024',
      time: '9:00 AM - 10:00 AM',
    },
    {
      title: 'Evaluation Class',
      name: 'sagarps',
      date: '08 May 2024',
      time: '10:00 AM - 11:00 AM',
    },
  ];



  return (
    <div>
      <BaseLayout1>
        <div className="flex flex-col lg:flex-row p-4 w-full">
          <div className="flex-1 overflow-y-scroll scrollbar-hide h-[93vh] pr-4">
            <header className="flex justify-between mb-8">
              <div className="flex space-x-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Search here..."
                    className="p-2 w-80 rounded-md border border-gray-300"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Search here..."
                    className="p-2 w-80 rounded-md border border-gray-300"
                  />
                </div>
              </div>
            </header>

            <main className="grid grid-cols-12 gap-4">
              <div className="col-span-12 grid grid-cols-1 gap-4">
                {/* {['Trail Assigned', 'Evaluation Completed', 'Evaluation Pending', 'Total Dropped'].map(
                  (title, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg shadow flex flex-col items-center"
                    >
                      <span className="text-2xl font-semibold">{index * 20 + 20}</span>
                      <span className="text-gray-500">{title}</span>
                    </div>
                  )
                )} */}
                <TotalList />
              </div>

              <div className="col-span-6 bg-white p-6 rounded-lg shadow-lg flex justify-between items-center">
                  {/* Left: Chart and Total Students */}
                  <div className="relative flex flex-col items-center">
                    <Doughnut
                      data={data}
                      options={{
                        cutoutPercentage: 70,
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                      width={200}
                      height={200}
                    />
                    <div className=" flex flex-col items-center justify-center">
                      <p className="absolute -mt-[124px] text-lg font-bold bg-slate-300 rounded-full p-2">450</p>
                    </div>
                  </div>

                {/* Right: Stats and Legend */}
                <div className="flex flex-col ml-8 space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">Total Students</h3>
                  <div className="flex flex-col items-center">
                    {/* Icons of Boys and Girls */}
                    <div className="flex items-center space-x-2 mb-4">
                        <FaMale className="text-blue-400" size={30} />
                        <FaFemale className="text-pink-500" size={30} />
                    </div>

                    {/* Boys and Girls Counts */}
                    <div className="flex justify-between space-x-10">
                        {/* Boys */}
                        <div className="flex flex-col items-center">
                            <span className="w-2 h-2 bg-blue-400 rounded-full mb-2"></span>
                            <p className="text-[15px] font-bold text-gray-700">200</p>
                            <p className="text-gray-600 text-[10px]">Boys (47%)</p>
                        </div>

                        {/* Girls */}
                        <div className="flex flex-col items-center">
                            <span className="w-2 h-2 bg-pink-500 rounded-full mb-2"></span>
                            <p className="text-[15px] font-bold text-gray-700">250</p>
                            <p className="text-gray-600 text-[10px]">Girls (53%)</p>
                        </div>
                    </div>
                </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                      <span className="text-gray-700 text-[12px]">Active (27%)</span>
                    </div>
                    <p className="text-gray-700 font-semibold text-[12px]">763</p>

                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                      <span className="text-gray-700 text-[12px]">Not Active (50%)</span>
                    </div>
                    <p className="text-gray-700 font-semibold text-[12px]">321</p>

                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      <span className="text-gray-700 text-[12px]">On Leave (23%)</span>
                    </div>
                    <p className="text-gray-700 font-semibold text-[12px]">69</p>

                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-gray-300 rounded-full mr-2"></span>
                      <span className="text-gray-700 text-[12px]">Left (23%)</span>
                    </div>
                    <p className="text-gray-700 font-semibold text-[12px]">69</p>
                  </div>
                </div>
              </div>

             <TeachersList />

              <div className="col-span-12 bg-red-500 p-4 rounded-lg shadow flex items-center justify-between text-white">
                
                <div className="items-center space-x-4">
                  <h3 className="text-lg font-medium p-2">Next Evaluation Class Starts in</h3>
                  <div className="flex items-center space-x-8">
                    <div className="flex items-center space-x-2">
                      {/* User Icon */}
                      <FaUserAlt className="w-4 h-4" />
                      <p className="text-sm">Abinesh</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Clock Icon */}
                      <AiOutlineClockCircle className="w-4 h-4" />
                      <p className="text-sm">9:00 AM</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <p className="text-lg font-medium text-[#fff0f0]">Starts in</p>
                  {/* Timer box styling */}
                  <div className="bg-white p-3 rounded-xl shadow-lg flex items-center justify-center space-x-4">
                    {/* Hours */}
                    <div className="bg-[#0e3c50] text-white text-center px-2 py-2 rounded-md">
                      <p className="text-base font-bold">20</p>
                      <p className="text-[10px] tracking-widest">HOURS</p>
                    </div>
                    {/* Separator */}
                    <span className="text-2xl text-[#0e3c50]">:</span>
                    {/* Minutes */}
                    <div className="bg-[#0e3c50] text-white text-center px-2 py-2 rounded-md">
                      <p className="text-base font-bold">12</p>
                      <p className="text-[10px] tracking-widest">MINUTES</p>
                    </div>
                    {/* Separator */}
                    <span className="text-lg text-[#0e3c50]">:</span>
                    {/* Seconds */}
                    <div className="bg-[#0e3c50] text-white text-center px-2 py-2 rounded-md">
                      <p className="text-base font-bold">19</p>
                      <p className="text-[10px]">SECONDS</p>
                    </div>
                  </div>

                </div>
              </div>


              <div className="col-span-12">
                <ClassCard classes={classes} />
              </div>

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
                        <th className="p-2">Teacher's Name</th>
                        <th className="p-2">No. of Students</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Abdullah Sulaiman', students: 20 },
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
