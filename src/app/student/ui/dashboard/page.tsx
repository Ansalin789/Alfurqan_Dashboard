'use client'

import React from 'react';
import 'react-calendar/dist/Calendar.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import BaseLayout2 from '../../components/BaseLayout2/page';
import DashboardStats from '../../components/dashboard/DashboardStats';
import Activity from '../../components/Activity/page';
import Totalhours from '../../components/Totalhours/page';
import Profile from '../../components/Profile/page';
import NextEvalu from '../../components/NextEvalu/page';
import GeneratePage from '../../components/Quotes/page';
import Upcome from '../../components/Upcome/page';
import { Search, Bell, Settings, Sun, User } from 'lucide-react';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Academic() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <BaseLayout2>
        <header className="w-[1240px] bg-white shadow-sm rounded-lg ml-3 mt-1 dark:bg-gray-800">
          <div className="flex justify-between items-center px-4 py-1">
            <div className="flex space-x-4">
              <div className="flex items-center space-x-4 p-1">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={14}
                  />
                  <input
                    type="text"
                    placeholder="Search here..."
                    className="h-6 pl-9 pr-4 w-64 text-[12px] rounded-lg bg-gray-100 text-gray-800 
                            placeholder-gray-500 border border-gray-200 focus:outline-none 
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                    aria-label="Search"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 mr-2">
              <button
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full dark:text-gray-300 dark:hover:bg-gray-700"
                aria-label="Toggle theme"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                <Sun size={15} />
              </button>

              <button
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full dark:text-gray-300 dark:hover:bg-gray-700"
                aria-label="Notifications"
              >
                <Bell size={15} />
              </button>

              <button
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full dark:text-gray-300 dark:hover:bg-gray-700"
                aria-label="Settings"
              >
                <Settings size={15} />
              </button>

              <button
                className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                aria-label="Profile"
              >
                <User size={15} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row p-2 w-full">
          <div className="flex-1 p-2">
            <main className="grid grid-cols-12 gap-4 pr-6">
              <div className="col-span-12 grid grid-cols-1 gap-2 p-0">
                <NextEvalu />
              </div>
              <div className="col-span-12 grid grid-cols-1 gap-2 p-0">
                <DashboardStats />
              </div>
              <div className="col-span-7 grid grid-cols-3 gap-4 p-0">
                <Activity />
              </div>
              <div className="col-span-5 grid grid-cols-3 gap-4 p-0">
                <Totalhours />
              </div>
              <Upcome />
            </main>
          </div>

          {/* Calendar sidebar */}
          <div className="lg:w-[370px] mt-6 mr-6 lg:mt-4 border-[1px] border-[#727272] bg-white rounded-[8px] h-[622px] dark:bg-gray-800">
            <div className="col-span-4 pr-2 mb-4">
              <Profile />
            </div>
            <div className="col-span-4 pr-2">
              <GeneratePage />
            </div>
          </div>
        </div>
      </BaseLayout2>
    </div>
  );
}
