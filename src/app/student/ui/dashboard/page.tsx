'use client';

import React from 'react';
import 'react-calendar/dist/Calendar.css';
import dynamic from 'next/dynamic';
import BaseLayout2 from '@/components/BaseLayout2';

// Dynamic imports
const Activity = dynamic(() => import('../../components/Activity/page'), { ssr: false });
const Totalhours = dynamic(() => import('../../components/Totalhours/page'), { ssr: false });
const Profile = dynamic(() => import('../../components/Profile/page'), { ssr: false });
const GeneratePage = dynamic(() => import('../../components/Quotes/page'), { ssr: false });
const Upcome = dynamic(() => import('../../components/Upcome/page'), { ssr: false });
const NextEvalu = dynamic(() => import('../../components/NextEvalu/page'), { ssr: false });
const DashboardStats = dynamic(() => import('../../components/dashboard/DashboardStats'), { ssr: false });

export default function Academic() {
  const [isDarkMode] = React.useState(false);

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
