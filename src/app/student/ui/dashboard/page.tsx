'use client';

import React from 'react';
import 'react-calendar/dist/Calendar.css';
import dynamic from 'next/dynamic';
import BaseLayout2 from '@/components/BaseLayout2';
import { Search, Sun, Bell } from "lucide-react";
import Link from 'next/link';


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
        
        <div className="p-2 w-[100%]">
          <div className="bg-white p-1 flex items-center justify-between shadow-md rounded-lg ml-4 mr-7">
            <div className="relative w-1/4 left-3">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={13} />
              <input
                type="text"
                placeholder="Search here..."
                className="w-full pl-10 pr-3 py-[4px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-[13px]"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 bg-white rounded-lg shadow hover:bg-gray-200">
                <Sun size={18} className="text-gray-600" />
              </button>
              <button className="p-2 bg-white rounded-lg shadow hover:bg-gray-200">
                <Bell size={18} className="text-gray-600" />
              </button>
              {/* <button className="p-2 bg-white rounded-lg shadow hover:bg-gray-200">
                <Settings size={18} className="text-gray-600" />
              </button> */}
              {/* Profile Image */}
              <Link href="/student/ui/student-profile">
                <img
                  src="/assets/images/student-profile.png" // Replace with the actual image URL
                  alt="Profile"
                  className="w-9 h-9 rounded-lg border border-gray-300 shadow"
                />
              </Link>
            </div>
          </div>
            <div className="flex flex-col lg:flex-row">
            <div className="flex-1 p-2">
            <main className="grid grid-cols-12 gap-2 pr-6">
              <div className="col-span-12 grid grid-cols-1 gap-2 p-2">
                <NextEvalu />
              </div>
              <div className="col-span-12 grid grid-cols-1 gap-2 p-2">
                <DashboardStats />
              </div>
              <div className="col-span-7 grid grid-cols-3 gap-2 p-2">
                <Activity />
              </div>
              <div className="col-span-5 grid grid-cols-3 gap-2 p-2">
                <Totalhours />
              </div>
              <div className="col-span-12 grid grid-cols-1 gap-2 p-2">
                <Upcome />
              </div>
            </main>
          </div>

          {/* Calendar sidebar */}
          <div className="lg:w-[280px] mr-6 lg:mt-[79px] border-[1px] border-[#727272] bg-white rounded-[8px] h-[675px]">
            <div className="col-span-2 gap-2">
              <Profile />
            </div>
            <div className="col-span-2 gap-2">
              <GeneratePage />
            </div>
          </div>
        </div>
        </div>
      </BaseLayout2>
    </div>
  );
}
