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
        <div className="p-2 w-[100%] mx-auto">
          <div className="p-0 flex items-center justify-between mr-12">
            <div className="relative w-1/4 left-2 top-2">
              <h3 className="text-black text-[22px] font-semibold">Dashboard</h3>
            </div>

            <div className="flex items-center gap-4 relative">
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

             {/* Enhanced Notification Panel */}
      {showNotifications && (
      <div
        ref={notificationRef}
        className="absolute right-0 top-14 w-80 backdrop-blur-xl bg-white/40 border border-white/20 rounded-xl shadow-2xl z-50 
                  transform transition-all duration-300 ease-out origin-top-right animate-fade-in-up scale-100"
        style={{
          boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Panel Header */}
        <div className="p-4 border-b border-white/20 flex justify-between items-center bg-white/40 backdrop-blur-lg rounded-t-xl">
          <h4 className="font-semibold text-gray-900">Notifications</h4>
          <button
            onClick={() => setShowNotifications(false)}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Notifications List */}
        <div className="h-60 overflow-y-auto scrollbar-hide p-1">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-2 border-b border-white/20 transition-colors duration-200 rounded-lg
                            ${
                              notification.seen
                                ? "bg-white/50 text-gray-700 hover:bg-white/60" // Seen notifications
                                : "bg-blue-100 text-gray-900 font-semibold hover:bg-blue-200" // Unseen notifications
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
              <div className="text-gray-400 mb-2">
                <Bell size={40} className="mx-auto" />
              </div>
              <p className="text-gray-600">No new notifications</p>
            </div>
          )}
        </div>
      </div>
    )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row mt-2">
            <div className="flex-1 p-1">
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
              <div className="pr-0 rounded-lg w-50 mt-6 -ml-12">
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