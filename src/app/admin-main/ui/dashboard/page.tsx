"use client";

import React from "react";
import "react-calendar/dist/Calendar.css";
import BaseLayout4 from "@/components/BaseLayout4";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import TrialRequests from "../../components/trailclassdashboard";
import Notifications from "../../components/notificationsdashboard";
import TeachersStudents from "../../components/teachersstudentsdashboard";
import TotalClasses from "../../components/totalclassesdashboard";
import Calender from "@/components/Academic/Calender";
import UpcomingClasses from "@/components/Academic/UpcommingClasses";
import { Sun, Bell } from "lucide-react";
import StudentTeacherStaff from "../../components/StudentTeacherStaff";

ChartJS.register(ArcElement, Tooltip, Legend);


const page = () => {
  return (
    <div>
      <BaseLayout4>
        <div className="p-2 w-[100%] mx-auto">
          <div className="p-0 flex items-center justify-between mr-12">
            <div className="relative w-1/4 left-2 top-2">
              <h3 className="text-black text-[22px] font-semibold">Dashboard</h3>
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
                  <StudentTeacherStaff />
                </div>

                <div className="col-span-7 grid grid-cols-1 p-0">
                  <TrialRequests />
                </div>
                <div className="col-span-5 grid grid-cols-1 p-0">
                  <Notifications />
                </div>
                <div className="col-span-7 grid grid-cols-1 p-0">
                  <TotalClasses />
                </div>
                <div className="col-span-5 grid grid-cols-1 p-0">
                  <TeachersStudents />
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
      </BaseLayout4>
    </div>
  )
}

export default page
