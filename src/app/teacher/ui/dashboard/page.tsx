'use client';

import React from 'react';
import 'react-calendar/dist/Calendar.css';
import BaseLayout from '@/components/BaseLayout';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Calender from '../../components/Calender';
import Total from '@/app/teacher/components/total';
import NextScheduleClass from '@/app/teacher/components/NextScheduleclass';
import ClassAnalyticsChart from '@/app/teacher/components/ClassAnalyticsChart';
import EarningAnalytics from '../../components/EarningAnalytics';
import TeachingActivity from '../../components/TeachingActivity';
import UpcomingTask from '../../components/UpcomingTask';
import StudentsCard from '../../components/Students';
import TeacherHeader from '../../components/TeacherHeader';
import { useSearchParams } from 'next/navigation';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Academic() {

    const params = useSearchParams();
  const testMode = params.get('test');
  if (testMode && process.env.NODE_ENV === 'development') {
    localStorage.setItem('TeacherPortalId', 'TEST_TEACHER_123');
    localStorage.setItem('TeacherAuthToken', 'TEST_TOKEN_ABC');
  }
  return (
    <BaseLayout>
      <TeacherHeader currentSection="Dashboard" />

      <div className="flex flex-col lg:flex-row gap-4 bg-[#E4E7F4] dark:bg-[#252525]   min-h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-4 w-full">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4">
            <Total />
          </div>

          {/* Next Class Schedule */}
          <div className="grid grid-cols-1 gap-4">
            <NextScheduleClass />
          </div>

          {/* Analytics Row */}
         <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full">
  <div className="col-span-12 md:col-span-8">
    <EarningAnalytics />
  </div>
  <div className="col-span-12 md:col-span-4">
    <StudentsCard />
  </div>
</div>



          {/* Teaching Activity and Class Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-8">
              <TeachingActivity />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <ClassAnalyticsChart />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[310px] flex flex-col gap-4">
          {/* Calendar */}
          <div className="rounded-xl shadow-lg h-[320px] bg-white dark:bg-[#343434] flex items-center justify-center">
            <Calender />
          </div>

          {/* Upcoming Tasks */}
          <div className="rounded-xl shadow-lg bg-white dark:bg-[#343434] overflow-y-auto scrollbar-none flex-1">
            <UpcomingTask />
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
