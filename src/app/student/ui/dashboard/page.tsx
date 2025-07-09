"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import BaseLayout2 from "../../../../components/BaseLayout2";
import NextScheduledClass from "@/app/student/components/NextScheduledClass";
import ApplicationChart from "../../components/Growth";
import axios from "axios";
import Subject from "../../components/SubjectCard";
import CourseOverview from "../../components/CourseOverview";
import UpcomingTable from "../../components/UpcomingTable";
import StudentProfile from "../../components/StudentProfile";
import StudentHeader from "../../components/StudentHeader";

const Dashboard = () => {

    const rows = [
        {
          id: "#0983867",
          teacher: "Robert james",
          course: "Arabic",
          date: "Jan 20, 2020",
          time: "Starts at 07.30",
          status: "Scheduled",
        },
        // You can add more rows if needed
        {
          id: "#0983867",
          teacher: "Robert james",
          course: "Arabic",
          date: "Jan 20, 2020",
          time: "Starts at 07.30",
          status: "Scheduled",
        },
        {
          id: "#0983867",
          teacher: "Robert james",
          course: "Arabic",
          date: "Jan 20, 2020",
          time: "Starts at 07.30",
          status: "Scheduled",
        },
      ];

  return (
    <BaseLayout2>
    <StudentHeader currentSection="Dashboard"/>

      <div className="flex flex-row gap-4 p-0 min-h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Next Class Schedule */}
          <div className="grid grid-cols-1 gap-4">
            <NextScheduledClass />
          </div>

          {/* Course Overview */}
          <CourseOverview />

          {/* Charts Row */}
          <div className="flex gap-4">
            <div className="w-[67%] rounded-xl h-[270px] flex flex-col">
              <div className="flex-1 flex items-center justify-center">
                <ApplicationChart />
              </div>
            </div>
            {/* <div className="w-[33%] bg-white rounded-xl dark:bg-[#343434] h-[270px] flex flex-col"> */}
              <Subject />
            {/* </div> */}
          </div>

          {/* Applications Table */}
                  <UpcomingTable />
        </div>
        
        {/* Sidebar */}
        <div className="w-[310px] flex flex-col gap-4">
  {/* student profile */}
  {/* <div className="rounded-xl shadow-lg bg-white h-[280px] dark:bg-[#343434] p-4 relative">
    <h3 className="text-[#010E30] font-semibold text-[16px] mb-2 dark:text-white">Student Profile</h3>

    <img
      src="https://randomuser.me/api/portraits/men/32.jpg"
      alt="profile"
      className="w-20 h-20 rounded-full mx-auto mb-2"
    />

    <h3 className="text-[#010E30] font-bold text-[16px] dark:text-white text-center">Will Jonto</h3>
    <p className="text-gray-500 text-[12px] text-center">Will@gmail.com</p>
    <p className="text-gray-500 text-[12px] mb-2 text-center">Level - 2</p>

    <div className="flex justify-center space-x-1 mb-2">
      {[...Array(4)].map((_, i) => (
        <span key={i} className="text-yellow-400 text-lg">★</span>
      ))}
      <span className="text-gray-300 text-lg">★</span>
    </div>

  </div> */}
<StudentProfile />

  {/* Payment Item */}

  <div className="rounded-xl shadow-lg bg-white dark:bg-[#343434] p-4 w-full">
  <h3 className="text-[#010E30] font-semibold text-[16px] mb-3 dark:text-white">Upcoming Payments</h3>
  
  {[1, 2].map((_, idx) => (
    <div key={idx} className="flex items-center justify-between py-2 border-b last:border-b-0">
      <div className="flex items-center gap-2">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="user"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div>
          <p className="text-[#010E30] text-[13px] dark:text-white">Internet Bill</p>
          <p className="text-[#010E30] text-[13px] font-semibold dark:text-white">$75.00</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="text-gray-400 text-[11px]">Due date</p>
        <p className="text-gray-400 text-[12px]">Jan 20, 2020</p>
      </div>
    </div>
  ))}
</div>


  {/* Payment Item */}
  <div className="rounded-xl shadow-lg bg-white dark:bg-[#343434] p-4 w-full">
  <h3 className="text-[#010E30] font-semibold text-[16px] mb-3 dark:text-white">Recent Payments</h3>
  
  {[1, 2].map((_, idx) => (
    <div key={idx} className="flex items-center justify-between py-2 border-b last:border-b-0">
      <div className="flex items-center gap-2">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="user"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div>
          <p className="text-[#010E30] text-[13px] dark:text-white">Internet Bill</p>
          <p className="text-[#010E30] text-[13px] font-semibold dark:text-white">$75.00</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="text-gray-400 text-[11px]">Due date</p>
        <p className="text-gray-400 text-[12px]">Jan 20, 2020</p>
      </div>
    </div>
  ))}
</div>

  {/* Gradient Action Cards - Example 1 */}
  <div className="flex items-center justify-between p-4 rounded-xl mb-3 bg-gradient-to-r from-[#7e57c2] to-[#5c6bc0] text-white">
  <div className="flex items-center gap-4">
    {/* ICON CIRCLE with image */}
    <div className="bg-white bg-opacity-20 p-3 rounded-full w-12 h-12 flex items-center justify-center">
    <img
        src="/refer-icon.png" // <-- your uploaded image
        alt="Refer Icon"
        className="w-6 h-6 object-contain"
      />
    </div>

    {/* Text */}
    <div>
      <p className="text-sm font-semibold">Refer a Friend</p>
      <p className="text-xs opacity-80">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.</p>
    </div>
  </div>

  {/* Arrow Icon */}
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </div>
</div>


  {/* Gradient Action Cards - Example 2 */}
  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#ef5350] via-[#ec407a] to-[#ab47bc] text-white mb-3">
  <div className="flex items-center gap-4">
    {/* Image icon in circle */}
    <div className="bg-white bg-opacity-20 p-3 rounded-full w-12 h-12 flex items-center justify-center">
      <img
        src="/upgrade-icon.png" // ← your uploaded image
        alt="Upgrade Icon"
        className="w-6 h-6 object-contain"
      />
    </div>

    {/* Text content */}
    <div>
      <p className="text-sm font-semibold">Upgrade Packages</p>
      <p className="text-xs opacity-80">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.</p>
    </div>
  </div>

  {/* Right arrow */}
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </div>
</div>


</div>
</div>
    </BaseLayout2>
  );
};

export default Dashboard;
