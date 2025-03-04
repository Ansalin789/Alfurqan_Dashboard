"use client";

import React from "react";
import "react-calendar/dist/Calendar.css";
import BaseLayout from "@/components/BaseLayout";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Calender from "@/app/teacher/components/Calender";
import Total from "@/app/teacher/components/total";
import NextScheduleClass from "@/app/teacher/components/NextScheduleclass";
import ClassAnalyticsChart from "@/app/teacher/components/ClassAnalyticsChart";
import EarningAnalytics from "../../components/EarningAnalytics";
import TeachingActivity from "../../components/TeachingActivity";
import UpcomingTask from "../../components/UpcomingTask";
import StudentsCard from "../../components/Students";
import { Search, Sun, Bell } from "lucide-react";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Academic() {
  return (
    <div>
      <BaseLayout>
        <div className="p-4 w-[100%] mx-auto">
          <div className="flex items-center justify-between mr-10">
            <div className="relative w-1/4 left-3">
              <Search
                className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={13}
              />
              <input
                type="text"
                placeholder="Search here..."
                className="h-9 w-60 pl-10 text-sm text-[#35324B] bg-[#f8f7f7] shadow rounded-[10px] outline-none focus:ring-2 focus:ring-[#9CA3AF]"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 bg-[#f8f7f7] rounded-lg shadow hover:bg-gray-200">
                <Sun size={16} className="text-black" />
              </button>
              <button className="p-2 bg-[#f8f7f7] rounded-lg shadow hover:bg-gray-200">
                <Bell size={16} className="text-black" />
              </button>
              {/* <button className="p-2 bg-white rounded-lg shadow hover:bg-gray-200">
                      <Settings size={18} className="text-gray-600" />
                    </button> */}
              {/* <Link href="#">
                  <img
                    src="/assets/images/student-profile.png" // Replace with the actual image URL
                    alt="Profile"
                    className="w-8 h-8 rounded-lg border border-gray-300 shadow"
                  />
                </Link> */}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row mt-2">
            <div className="flex-1 p-2">
              <main className="grid grid-cols-12 gap-4 pr-20">
                <div className="col-span-12 grid grid-cols-1 p-0">
                  <Total />
                </div>
                <div className="col-span-12 grid grid-cols-1 p-0">
                  <NextScheduleClass />
                </div>

                <div className="col-span-6 grid grid-cols-1 p-0">
                  <EarningAnalytics />
                </div>
                <div className="col-span-6 grid grid-cols-1 p-0">
                  <ClassAnalyticsChart />
                </div>

                <div className="col-span-9 grid grid-cols-1 p-0">
                  <TeachingActivity />
                </div>

                <div className="col-span-3 grid grid-cols-1 p-0">
                  <StudentsCard />
                </div>
              </main>
            </div>

            {/* calender sidebar */}
            <div className="lg:w-[250px] lg:mt-2 rounded-[20px] ml-5">
              <div className="pr-0 mb-0 rounded-[20px]">
                <Calender />
              </div>
              <div className="pr-0 rounded-lg w-64 mt-5">
                <UpcomingTask />
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    </div>
  );
}
