'use client'

import React from 'react'
import 'react-calendar/dist/Calendar.css'
import BaseLayout1 from '@/components/BaseLayout1'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaSearch } from "react-icons/fa";
import { BiFilterAlt } from "react-icons/bi";
import Calender from '@/components/Academic/Calender';
import UpcomingClasses from '@/components/Academic/UpcommingClasses';
import Dashboardevaluation from '@/components/Academic/Dashboardevaluation';
import Total from '@/app/teacher/components/total';
import NextClass from '@/app/teacher/components/NextScheduleclass';
import ClassAnalyticsChart from '@/app/teacher/components/ClassAnalyticsChart';
import EarningAnalytics from '../../components/EarningAnalytics';


// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);


export default function Academic() {


  return (
    <div>
      <BaseLayout1>
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
            <div className="flex space-x-4 ml-[540px]">
              <div className="flex items-center space-x-4">
                <div className="relative">
                <button
                  className="flex items-center bg-[#D5D7DA] p-[4px] rounded-[10px] text-[14px]  shadow-[0_4px_6px_rgba(0,0,0,0.2)] outline-none focus:ring-2 focus:ring-[#9CA3AF]"
                >
                  <BiFilterAlt className="mr-2" /><span className='text-[#223857]'>Filter</span> 
                </button>
                </div>
              </div>
            </div>
          </header>
          
            <main className="grid grid-cols-12 gap-4 pr-20">
              <div className="col-span-12 grid grid-cols-1 gap-4 p-0">
                <Total />
              </div>
              <div className="col-span-12 grid grid-cols-1 gap-4 p-0">
                <NextClass />
              </div>

              <div className="col-span-6 grid grid-cols-2 gap-4 p-0">
                <EarningAnalytics />
              </div>
              <div className="col-span-6 grid grid-cols-3 gap-4 p-0">
              <ClassAnalyticsChart />
              </div>

              <Dashboardevaluation />
              
            </main>
          </div>
          {/* calender sidebar */}
          <div className=" lg:w-[300px] mt-6 lg:mt-0 rounded-[20px] h-[600px]">
            <div className="col-span-4 pr-8 mb-8">
              <Calender />
            </div>
            <div className="col-span-4 pr-8 -ml-16 rounded-lg">
              <UpcomingClasses />
            </div>
          </div>
        </div>
      </BaseLayout1>
    </div>
  )
}
