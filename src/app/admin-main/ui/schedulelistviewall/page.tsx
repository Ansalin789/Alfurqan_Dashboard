"use client";

import React, { useEffect, useRef, useState } from "react";
import BaseLayout4 from "@/components/BaseLayout4";
import { Bell, Sun, X } from "lucide-react";
import { useRouter } from "next/navigation";

const SalaryCard = () => {
    const [activeTab, setActiveTab] = useState("Upcoming");
    const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;
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

   const upcomingData = [
    {
      employeeid: 798,
      employeename: "Samantha William",
      designation: "Angela Moss",
      salaryamount: "Tajweed Masterclass",
      paymentdate: "January 2, 2020",
      class: "Trial Class",
      status: " 7.30 AM",
    },
    {
      employeeid: 799,
      employeename: "Jordan Nico",
      designation: "Angela Moss",
      salaryamount: "Tajweed Masterclass",
      paymentdate: "January 2, 2020",
      class: "Trial Class",
      status: " 7.30 AM",
    },
    {
      employeeid: 800,
      employeename: "Nadila Adja",
      designation: "Angela Moss",
      salaryamount: "Tajweed Masterclass",
      paymentdate: "January 2, 2020",
      class: "Group Class",
      status: "Re-Schedule",
    },
    {
      employeeid: 801,
      employeename: "Aliyah Karim",
      designation: "Angela Moss",
      salaryamount: "Tajweed Masterclass",
      paymentdate: "January 3, 2020",
      class: "Trial Class",
      status: " 7.30 AM",
    },
    {
      employeeid: 802,
      employeename: "Zayd Malik",
      designation: "Angela Moss",
      salaryamount: "Tajweed Masterclass",
      paymentdate: "January 4, 2020",
      class: "Group Class",
      status: "Completed",
    },
    {
      employeeid: 803,
      employeename: "Fatima Noor",
      designation: "Angela Moss",
      salaryamount: "Tajweed Masterclass",
      paymentdate: "January 5, 2020",
      class: "Trial Class",
      status: " 7.30 AM",
    },
    {
      employeeid: 804,
      employeename: "Adam Yusuf",
      designation: "Angela Moss",
      salaryamount: "Tajweed Masterclass",
      paymentdate: "January 6, 2020",
      class: "Group Class",
      status: "Re-Schedule",
    },
    {
      employeeid: 805,
      employeename: "Layla Hassan",
      designation: "Angela Moss",
      salaryamount: "Tajweed Masterclass",
      paymentdate: "January 7, 2020",
      class: "Trial Class",
      status: " 7.30 AM",
    },
    {
      employeeid: 806,
      employeename: "Bilal Rahman",
      designation: "Angela Moss",
      salaryamount: "Tajweed Masterclass",
      paymentdate: "January 8, 2020",
      class: "Group Class",
      status: "Completed",
    },
    {
      employeeid: 807,
      employeename: "Amina Khalid",
      designation: "Angela Moss",
      salaryamount: "Tajweed Masterclass",
      paymentdate: "January 9, 2020",
      class: "Trial Class",
      status: "Re-Schedule",
    },
    {
      employeeid: 808,
      employeename: "Hasan Ali",
      designation: "Angela Moss",
      salaryamount: "Tajweed Masterclass",
      paymentdate: "January 10, 2020",
      class: "Trial Class",
      status: " 7.30 AM",
    },
    {
      employeeid: 809,
      employeename: "Sara Iqbal",
      designation: "Angela Moss",
      salaryamount: "Tajweed Masterclass",
      paymentdate: "January 11, 2020",
      class: "Group Class",
      status: " 7.30 AM",
    },
    {
      employeeid: 810,
      employeename: "Yusuf Hamza",
      designation: "Angela Moss",
      salaryamount: "Tajweed Masterclass",
      paymentdate: "January 12, 2020",
      class: "Trial Class",
      status: "Completed",
    },
    {
      employeeid: 811,
      employeename: "Maryam Zain",
      designation: "Angela Moss",
      salaryamount: "Tajweed Masterclass",
      paymentdate: "January 13, 2020",
      class: "Group Class",
      status: "Re-Schedule",
    },
    {
      employeeid: 812,
      employeename: "Khalid Omar",
      designation: "Angela Moss",
      salaryamount: "Tajweed Masterclass",
      paymentdate: "January 14, 2020",
      class: "Trial Class",
      status: " 7.30 AM",
    },
  ];
  

  const completedData = upcomingData.map((row) => ({
    ...row,
    status: "Completed",
  }));

  const filteredData = activeTab === "Upcoming" ? upcomingData : completedData;
  const paginatedCourseData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <BaseLayout4>
      <div className="w-full h-screen bg-[#e9e9e9] px-4 py-6 mr-6">
      <div className="flex justify-between items-start mb-1.5">
  {/* Left Side - Expenses Heading */}
  <div className="text-start">
    <h2 className="text-black text-[22px] font-semibold">All Classes</h2>
  </div>

  {/* Right Side - Icons and Duration */}
  <div className="flex items-center gap-4">
    {/* Icons */}
    <div className="flex items-center gap-4 relative">
      <button className="p-2 bg-[#CED4DC] rounded-lg shadow hover:bg-gray-200">
        <Sun size={16} className="text-black" />
      </button>

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
          className="absolute right-0 top-14 w-80 backdrop-blur-xl bg-white/40 border border-white/20 rounded-xl shadow-2xl z-50 
                    transform transition-all duration-300 ease-out origin-top-right animate-fade-in-up scale-100"
          style={{ boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)" }}
        >
          <div className="p-4 border-b border-white/20 flex justify-between items-center bg-white/40 backdrop-blur-lg rounded-t-xl">
            <h4 className="font-semibold text-gray-900">Notifications</h4>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="h-60 overflow-y-auto scrollbar-hide p-1">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-2 border-b border-white/20 transition-colors duration-200 rounded-lg
                              ${notification.seen
                                ? "bg-white/50 text-gray-700 hover:bg-white/60"
                                : "bg-blue-100 text-gray-900 font-semibold hover:bg-blue-200"} 
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
      </div>
      <br/>
         <div className="flex justify-between items-start  flex-wrap">

          </div>


        
        <div className="overflow-x-auto bg-white rounded-lg border-2 border-[#1C3557] w-full max-w-[1355px] mx-auto ">
       {/* Tabs */}
       <div className=" flex gap-4 ">
  <button
    onClick={() => { setActiveTab("Upcoming"); setCurrentPage(1); }}
    className={`px-4 py-2 text-sm font-semibold border-b-2 transition duration-200 ${
      activeTab === "Upcoming" 
        ? "border-black text-black" 
        : "border-transparent text-gray-700 hover:text-black"
    }`}
  >
    Upcoming
  </button>
  <button
    onClick={() => { setActiveTab("Completed"); setCurrentPage(1); }}
    className={`px-4 py-2 text-sm font-semibold border-b-2 transition duration-200 ${
      activeTab === "Completed" 
        ? "border-black text-black" 
        : "border-transparent text-gray-700 hover:text-black"
    }`}
  >
    Completed
  </button>
</div>

        <table className="w-full table-auto bg-white rounded-lg shadow text-xs">
            
        <thead className="border-b border-[#1C3557] text-[11px] font-semibold">
          <tr className="bg-gray-100">
            <th className="p-3 text-center">ID</th>
            <th className="p-3 text-center">Student Name</th>
            <th className="p-3 text-center">Teacher Name</th>
            <th className="p-3 text-center">Courses</th>
            <th className="p-3 text-center">Class</th>
            <th className="p-3 text-center">Date</th>
            <th className="p-3 text-center">Scheduled</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCourseData.map((row, index) => (
            <tr key={row.employeeid} className={`text-[9px] text-center font-medium ${index % 2 === 0 ? 'bg-[#faf9f9]' : 'bg-[#ebebeb]'}`}>
              <td className="p-2">{row.employeeid}</td>
              <td className="p-2">{row.employeename}</td>
              <td className="p-2">{row.designation}</td>
              <td className="p-2">{row.salaryamount}</td>
              <td className="p-2">{row.class}</td>
              <td className="p-2">{row.paymentdate}</td>
              <td className="p-2">
                {activeTab === "Completed" ? (
                  <span className="inline-flex items-center justify-center w-24 h-6 px-3 py-1 rounded-2xl bg-green-600 text-white">Completed</span>
                ) : (
                  <span
                    className={`inline-flex items-center justify-center w-24 h-6 px-3 py-1 rounded-2xl ${
                      row.status === " 7.30 AM" ? "bg-[#1C3557] text-white" : "bg-[#79D67B] text-white"
                    }`}
                  >
                    {row.status}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
          {/* Pagination */}
      <div className="flex justify-between items-center mt-4 p-2 text-sm text-gray-600">
        <p className="text-[11px]">
          Showing {paginatedCourseData.length} of {filteredData.length} classes
        </p>
        <div className="flex gap-2">
          {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, i) => (
            <button
              key={i}
              className={`w-5 h-5 text-[11px] flex items-center justify-center rounded ${
                currentPage === i + 1 ? "bg-[#1C3557] text-white" : "text-[#1C3557] border border-[#1C3557]"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

        </div>
      </div>
    </BaseLayout4>
  );
};

export default SalaryCard;