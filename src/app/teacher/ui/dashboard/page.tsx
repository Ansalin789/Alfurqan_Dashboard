"use client";

import React from "react";
import "react-calendar/dist/Calendar.css";
import BaseLayout from "@/components/BaseLayout";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Calender from "../../components/Calender";
import Total from "@/app/teacher/components/total";
import NextScheduleClass from "@/app/teacher/components/NextScheduleclass";
import ClassAnalyticsChart from "@/app/teacher/components/ClassAnalyticsChart";
import EarningAnalytics from "../../components/EarningAnalytics";
import TeachingActivity from "../../components/TeachingActivity";
import UpcomingTask from "../../components/UpcomingTask";
import StudentsCard from "../../components/Students";
import TeacherHeader from "../../components/TeacherHeader";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Academic() {
  return (
    <BaseLayout>
      <TeacherHeader currentSection="Dashboard" />

<div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_290px] gap-4 bg-[#E4E7F4] dark:bg-[#252525] lg:items-stretch">  {/* ================= Left Content ================= */}
  <div className="min-w-0 flex flex-col gap-4">
    {/* Summary Cards */}
    <Total />

    {/* Next Schedule */}
    <NextScheduleClass />

    {/* Analytics */}
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      <div className="md:col-span-8">
        <EarningAnalytics />
      </div>

      <div className="md:col-span-4">
        <StudentsCard />
      </div>
    </div>

    {/* Bottom Section */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-8">
        <TeachingActivity />
      </div>

      <div className="lg:col-span-4">
        <ClassAnalyticsChart />
      </div>
    </div>
  </div>

  {/* ================= Sidebar ================= */}
 <aside className="w-full lg:w-[290px] lg:flex-shrink-0 flex flex-col gap-4">
  {/* Calendar */}
  <div className="rounded-xl bg-white dark:bg-[#343434] shadow-lg p-2">
    <Calender />
  </div>

  {/* Upcoming */}
  <div className="rounded-xl bg-white dark:bg-[#343434] shadow-lg flex-1 min-h-[250px] overflow-hidden">
    <UpcomingTask />
  </div>
</aside>
</div>
    </BaseLayout>
  );
}
