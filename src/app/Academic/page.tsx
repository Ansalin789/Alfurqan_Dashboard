"use client";

import React from "react";
import "react-calendar/dist/Calendar.css";
import BaseLayout1 from "@/components/BaseLayout1";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import TotalList from "../../components/Academic/TotalList";
import NextEvaluationClass from "../../components/Academic/NextEvaluationClass";
import TeachersStudent from "../../components/Academic/TeachersStudent";
import Countries from "@/components/Academic/Countries";
import Teachers from "@/components/Academic/Teachers";
import Calender from "@/components/Academic/Calender";
import UpcomingClasses from "@/components/Academic/UpcommingClasses";
import Dashboardevaluation from "@/components/Academic/Dashboardevaluation";
import { Search, Sun, Bell } from "lucide-react";
import Link from "next/link";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Academic() {
  return (
    <div>
      <BaseLayout1>
        <div className="p-2 w-[100%] mx-auto">
          <div className="p-0 flex items-center justify-between mr-12">
            <div className="relative w-1/4 left-3">
              <Search
                className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={13}
              />
              <input
                type="text"
                placeholder="Search here..."
                className="h-9 w-60 pl-10 text-sm text-[#35324B] bg-[#E1E5EA] rounded-[10px] shadow-[0_4px_6px_rgba(0,0,0,0.2)] outline-none focus:ring-2 focus:ring-[#9CA3AF]"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 bg-[#CED4DC] rounded-lg shadow hover:bg-gray-200">
                <Sun size={16} className="text-black" />
              </button>
              <button className="p-2 bg-[#CED4DC] rounded-lg shadow hover:bg-gray-200">
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
                  <TotalList />
                </div>
                <div className="col-span-12 grid grid-cols-1 p-0">
                  <NextEvaluationClass />
                </div>

                <div className="col-span-5 grid grid-cols-1 p-0">
                  <TeachersStudent />
                </div>
                <div className="col-span-4 grid grid-cols-1 p-0">
                  <Countries />
                </div>
                <div className="col-span-3 grid grid-cols-1 p-0">
                  <Teachers />
                </div>
                <div className="col-span-12 grid grid-cols-1 p-0">
                  <Dashboardevaluation />
                </div>
              </main>
            </div>

            <div className="lg:w-[250px] lg:mt-2 rounded-[20px] pr-14">
              <div className="pr-0 mb-0 rounded-[20px]">
                <Calender />
              </div>
              <div className="pr-0 rounded-lg w-64 mt-11 -ml-12">
                <UpcomingClasses />
              </div>
            </div>
          </div>
        </div>
      </BaseLayout1>
    </div>
  );
}
