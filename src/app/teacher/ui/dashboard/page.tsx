'use client';

import React from 'react'
import 'react-calendar/dist/Calendar.css'
import BaseLayout from '@/components/BaseLayout'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaSearch } from "react-icons/fa";
// import { BiFilterAlt } from "react-icons/bi";
import Calender from '@/app/teacher/components/Calender';
import Total from '@/app/teacher/components/total';
import NextScheduleClass from '@/app/teacher/components/NextScheduleclass';
import ClassAnalyticsChart from '@/app/teacher/components/ClassAnalyticsChart';
import EarningAnalytics from '../../components/EarningAnalytics';
import TeachingActivity from '../../components/TeachingActivity';
import UpcomingTask from '../../components/UpcomingTask';
import StudentsCard from '../../components/Students';


// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);


export default function Academic() {


  return (
    <div>
      <BaseLayout>
        <div className="flex flex-col lg:flex-row p-2 w-full">
          <div className="flex-1 pr-8 pl-4">
          <header className="flex p-2">
            <div className="flex space-x-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {/* Search Icon */}
                  <FaSearch className="absolute w-4 h-4 left-3 top-1/2 transform -translate-y-1/2 text-[#35324B]" />
                  {/* Input Field */}
                  <input
                    type="text"
                    placeholder="Search here..."
                    className="h-9 w-60 pl-10 text-sm text-[#35324B] bg-[#E1E5EA] rounded-[10px] shadow-[0_4px_6px_rgba(0,0,0,0.2)] outline-none focus:ring-2 focus:ring-[#9CA3AF]"
                  />
                </div>
              </div>
            </div>
            {/* <div className="flex space-x-4 ml-[590px]">
              <div className="flex items-center space-x-4">
                <div className="relative">
                <button
                  className="flex items-center bg-[#D5D7DA] p-[4px] rounded-lg text-[14px]  shadow-[0_4px_6px_rgba(0,0,0,0.2)] outline-none focus:ring-2 focus:ring-[#9CA3AF]"
                >
                  <BiFilterAlt className="mr-2 p-2" /><span className='text-[#223857]'>Filter</span> 
                </button>
                </div>
              </div>
            </div> */}
          </header>
          
            <main className="grid grid-cols-12 gap-5 pr-20">
              <div className="col-span-12 grid grid-cols-1 gap-4 p-0">
                <Total />
              </div>
              <div className="col-span-12 grid grid-cols-1 gap-4 p-0">
                <NextScheduleClass />
              </div>

              <div className="col-span-6 grid grid-cols-1 gap-4 p-0">
                <EarningAnalytics />
              </div>
              <div className="col-span-6 grid grid-cols-1 gap-4 p-0">
              <ClassAnalyticsChart />
              </div>

              <div className="col-span-9 grid grid-cols-1 gap-4 p-0">
                <TeachingActivity />
              </div>
              
              <div className="col-span-3 grid grid-cols-1 gap-4 p-0">
                <StudentsCard />
              </div>
              
            </main>
          </div>
          {/* calender sidebar */}
          <div className=" lg:w-[250px] mt-8 lg:mt-1 rounded-[20px] h-[70vh]">
            <div className="col-span-4 pr-8 rounded-lg">
              <Calender />
            </div>
            <div className="col-span-4 pr-8 rounded-lg mt-4">
              <UpcomingTask />
            </div>
          </div>
        </div>
      </BaseLayout>
    </div>
  )
}
