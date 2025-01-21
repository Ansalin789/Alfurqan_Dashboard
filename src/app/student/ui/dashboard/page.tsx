'use client'

import React from 'react';
import 'react-calendar/dist/Calendar.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import BaseLayout2 from '@/components/BaseLayout2';
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
