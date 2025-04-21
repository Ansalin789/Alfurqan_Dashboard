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
ChartJS.register(ArcElement, Tooltip, Legend);

interface INotification {
  _id: string; 
  messages: string;
  isRead: boolean;
  senderId: string;
  senderName: string;
  senderEmail: string;
  receiverId: string;
  receiverName: string;
  receiverEmail: string;
  notificationType: string;
  notificationStatus: string;
  status: string;
  createdDate: Date;
  createdBy: string;
  updatedDate?: Date;
  updatedBy?: string;
}

const Page = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const [activeTab, setActiveTab] = useState("unseen");
  const userId = "6805da8c06542aa33858b889";

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

  // Socket.IO connection and event handling
  useEffect(() => {
    // Initialize socket if not already connected
    if (!socketRef.current) {
      socketRef.current = io("https://alfurqanacademy.tech", {
        transports: ["websocket"],
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to Socket.IO with ID:", socketRef.current?.id);
        socketRef.current?.emit("subscribe", userId);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from Socket.IO");
      });

      socketRef.current.on("connect_error", (err :any) => {
        console.error("Connection error:", err);
      });
    }

    // Handle incoming notifications
    const handleNotification = (newNotification: INotification) => {
      console.log("Received new notification:", newNotification);
      setNotifications(prev => [newNotification, ...prev]);
      
      // Only increment count if notification is unread
      if (!newNotification.isRead) {
        setNotificationCount(prev => prev + 1);
      }
    };

    socketRef.current.on("notification", handleNotification);

    // Cleanup: remove only the notification listener
    return () => {
      socketRef.current?.off("notification", handleNotification);
    };
  }, [userId]);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(`https://alfurqanacademy.tech/notification/getlist?receiverId=${userId}`);
        console.log("📦 API response:", data);
    
        // Safely access the notifications array
        const notifications = data?.data?.notifications ?? []; // Fallback to an empty array if notifications are undefined
        setNotifications(notifications); // Set notifications to state
    
        // Count unread notifications safely
        const unreadCount = notifications.filter((n:any) => !n.isRead).length;
        setNotificationCount(unreadCount); // Update the unread notification count
      } catch (error) {
        console.error("❌ Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, [userId]);

  // 👁️ Mark notification as seen
  const handleNotificationClick = async (notificationId: string) => {
    try {
      await axios.put(`https://alfurqanacademy.tech/notification/${notificationId}`, {
        isRead: true,
        notificationStatus: "Seen",
      });
  
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true, notificationStatus: "Seen" } : n))
      );
  
      setNotificationCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("❌ Failed to mark as seen:", error);
    }
  };
  

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "STUDENT_NOTIFICATION":
        return "🎓";
      case "SYSTEM_ALERT":
        return "⚠️";
      default:
        return "🔔";
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
  {/* Theme Button */}
  <button className="p-2 bg-gradient-to-br from-[#d0cfd4] to-[#9597a0] rounded-lg shadow hover:opacity-90">
    <Sun size={16} className="text-white" />
  </button>

  {/* Notification Bell */}
  <button
    className="p-2 bg-gradient-to-br from-[#d0cfd4] to-[#9597a0]  rounded-lg shadow relative transition-all duration-200 hover:scale-105"
    onClick={toggleNotifications}
  >
    <Bell size={16} className="text-white" />
    {notificationCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
        {notificationCount}
      </span>
    )}
  </button>

  {/* Notification Dropdown */}
  {showNotifications && (
    <div
      ref={notificationRef}
      className="absolute right-0 top-14 w-96 bg-gradient-to-br from-[#c8c7cc] to-[#c8c7cc]/90 border-[#939299]  rounded-xl shadow-2xl z-50 animate-fade-in-up"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/20 flex justify-between items-center bg-white/10 rounded-t-xl backdrop-blur-sm">
        <h4 className="font-semibold text-[#341e55] text-lg">Notifications</h4>
        <button onClick={() => setShowNotifications(false)} className="text-white hover:text-gray-200">
          <X size={18} />
        </button>
      </div>

      {/* Tab Switch */}
      <div className="flex items-center justify-center backdrop-blur-md px-3 pt-2">
        <div className="flex w-full justify-around">
          <button
            className={`text-sm px-4 py-2 font-medium transition-all ${
              activeTab === "Unseen"
                ? "text-black border-b-2 border-[#341e55]"
                : "text-blue-900 "
            }`}
            onClick={() => setActiveTab("Unseen")}
          >
            Unseen
          </button>
          <button
            className={`text-sm px-4 py-2 font-medium transition-all ${
              activeTab === "Seen"
                ? "text-black border-b-2 border-[#341e55]"
                : "text-blue-900 "
            }`}
            onClick={() => setActiveTab("Seen")}
          >
            Seen
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="h-64 overflow-y-auto scrollbar-hide p-3">
        {notifications && notifications.length > 0 ? (
          notifications
            .filter((n) =>
              activeTab === "Seen" ? n.notificationStatus === "Seen" : n.notificationStatus !== "Seen"
            )
            .map((notification) => (
              <button
                key={notification._id}
                onClick={() => {
                  if (notification.notificationStatus !== "Seen") {
                    handleNotificationClick(notification._id);
                  }
                }}
                className={`cursor-pointer p-3 mb-2 rounded-lg transition-all duration-200 ${
                  notification.notificationStatus === "Seen"
                    ? "bg-white/20 text-gray-900 hover:bg-white/30"
                    : "bg-yellow-100/90 text-gray-900 font-medium hover:bg-yellow-200"
                }`}
              >
                <div className="flex items-start gap-3 ">
                  <span className="text-sm mt-0.5">{getNotificationIcon(notification.notificationType)}</span>
                  <div className="flex-1 ">
                    <p className="text-xs">{notification.messages}</p>
                    <p className="text-xs text-red-900 mt-1">
                      {new Date(notification.createdDate).toLocaleString()}
                    </p>
                  </div>
                  {notification.notificationStatus !== "Seen" && (
                    <span className="w-2 h-2 bg-blue-700 rounded-full mt-1.5"></span>
                  )}
                </div>
              </button>
            ))
        ) : (
          <div className="p-6 text-center text-white">
            <Bell size={40} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-900">No notifications found</p>
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