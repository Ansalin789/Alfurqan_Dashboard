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
import Dashboardevaluation from '@/components/Academic/Dashboardevaluation';


// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);


export default function Academic() {


  return (
    <div>
      <BaseLayout1>
        <div className="flex flex-col lg:flex-row p-2 w-full">
          <div className="flex-1 pr-8 pl-4">
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

            <main className="grid grid-cols-12 gap-4 pr-20">
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
