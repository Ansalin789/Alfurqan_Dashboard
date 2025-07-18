"use client";

import React, { useEffect, useRef, useState } from "react";
import "react-calendar/dist/Calendar.css";
import BaseLayout4 from "@/components/BaseLayout4";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import TrialRequests from "../../components/trailclassdashboard";
import Notifications from "../../components/notificationsdashboard";
import TeachersStudents from "../../components/teachersstudentsdashboard";
import TotalClasses from "../../components/totalclassesdashboard";
import Calender from "../../components/calenderdashboard";
import UpcomingClasses from "../../components/upcomingclassdasboard";
import { Sun, Bell, X } from "lucide-react";
import StudentTeacherStaff from "../../components/StudentTeacherStaff";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { json } from "stream/consumers";
import AdminHeader from "../../components/AdminHeader";
ChartJS.register(ArcElement, Tooltip, Legend);


const Page = () => {

  return (
    <div>
      <BaseLayout4>
      <AdminHeader currentSection="Dashboard" />
  <div className="py-2 px-4 w-full mx-auto">

    {/* Main Dashboard Content */}
    <div className="flex flex-col lg:flex-row mt-4 gap-4">
      <div className="flex-1">
        <main className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="col-span-12">
            <StudentTeacherStaff />
          </div>
          <div className="md:col-span-4">
            <TeachersStudents />
          </div>
          <div className="md:col-span-8">
            <TrialRequests />
            <div className="mb-4"></div> {/* Add space here */}
            <TotalClasses />
          </div>
          {/* <div className="md:col-span-5">
            <Notifications />
          </div>
          <div className="md:col-span-7">
            <TotalClasses />
          </div> */}
        </main>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-[250px] flex flex-col gap-6">
        <div>
          <Calender />
        </div>
        <div>
          <UpcomingClasses />
        </div>
      </div>
    </div>
  </div>
</BaseLayout4>

    </div>
  )
}

export default Page;