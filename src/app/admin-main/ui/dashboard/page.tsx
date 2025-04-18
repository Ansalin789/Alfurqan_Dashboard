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

ChartJS.register(ArcElement, Tooltip, Legend);

const Page = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(5);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New student registration pending approval", seen: false, time: "2 mins ago", type: "urgent" },
    { id: 2, message: "Class rescheduled for tomorrow", seen: false, time: "1 hour ago", type: "important" },
    { id: 3, message: "Payment received from student", seen: false, time: "3 hours ago", type: "payment" },
    { id: 4, message: "System maintenance scheduled", seen: true, time: "Yesterday", type: "system" },
    { id: 5, message: "New message from teacher", seen: true, time: "2 days ago", type: "message" },
  ]);

  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleNotifications = () => {
    if (!showNotifications) {
      // Mark all as seen when opening
      const updatedNotifications = notifications.map(notif => ({
        ...notif,
        seen: true
      }));
      setNotifications(updatedNotifications);
      setNotificationCount(0);
    }
    setShowNotifications(!showNotifications);
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'urgent': return '🔴';
      case 'important': return '🟡';
      case 'payment': return '💰';
      case 'system': return '⚙️';
      case 'message': return '✉️';
      default: return '🔵';
    }
  };

  return (
    <div>
      <BaseLayout4>
  <div className="py-2 px-4 w-full mx-auto">
    {/* Header */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
      <div className="sm:w-1/2">
        <h3 className="text-black text-xl sm:text-2xl font-semibold ml-2 mt-1">Dashboard</h3>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 ml-2 sm:ml-0 relative">
        <button className="p-2 bg-[#CED4DC] rounded-lg shadow hover:bg-gray-200">
          <Sun size={16} className="text-black" />
        </button>

        {/* Notification Bell with Count */}
        <button
          className="p-2 bg-[#CED4DC] rounded-lg shadow hover:bg-gray-200 relative transition-all duration-200 hover:scale-105"
          onClick={toggleNotifications}
        >
          <Bell size={16} className="text-black" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
              {notificationCount}
            </span>
          )}
        </button>

        {/* Notification Panel */}
        {showNotifications && (
          <div
            ref={notificationRef}
            className="absolute right-0 top-14 w-80 backdrop-blur-xl bg-white/40 border border-white/20 rounded-xl shadow-2xl z-50 animate-fade-in-up"
            style={{ boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)" }}
          >
            <div className="p-4 border-b border-white/20 flex justify-between items-center bg-white/40 backdrop-blur-lg rounded-t-xl">
              <h4 className="font-semibold text-gray-900">Notifications</h4>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="h-60 overflow-y-auto scrollbar-hide p-1">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-2 border-b border-white/20 rounded-lg transition-colors duration-200 
                      ${
                        notification.seen
                          ? "bg-white/50 text-gray-700 hover:bg-white/60"
                          : "bg-blue-100 text-gray-900 font-semibold hover:bg-blue-200"
                      } 
                      backdrop-blur-md`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-sm mt-0.5">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1">
                        <p className="text-xs">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                      {!notification.seen && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></span>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <Bell size={40} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600">No new notifications</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Main Dashboard Content */}
    <div className="flex flex-col lg:flex-row mt-4 gap-4">
      <div className="flex-1">
        <main className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="col-span-12">
            <StudentTeacherStaff />
          </div>
          <div className="md:col-span-7">
            <TrialRequests />
          </div>
          <div className="md:col-span-5">
            <Notifications />
          </div>
          <div className="md:col-span-7">
            <TotalClasses />
          </div>
          <div className="md:col-span-5">
            <TeachersStudents />
          </div>
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