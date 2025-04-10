"use client";

import React, { useEffect, useRef, useState } from "react";
import BaseLayout4 from "@/components/BaseLayout4";
import { FaEdit } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { Bell, Sun, X } from "lucide-react";

const Expenses = () => {
  const [duration, setDuration] = useState("Last month");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupOpens, setIsPopupOpens] = useState<number | null>(null);
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

  const itemsPerPage = 7;

  const salaryData = [
    {
      date: "2024-02-01",
      expenseType: "Office Rent",
      amount: "15000",
      category: "Facilities",
      paymentMethod: "Bank Transfer",
      status: "Paid",
    },
    {
      date: "2024-02-02",
      expenseType: "Electricity Bill",
      amount: "3200",
      category: "Utilities",
      paymentMethod: "Credit Card",
      status: "Paid",
    },
    {
      date: "2024-02-03",
      expenseType: "Internet Bill",
      amount: "1200",
      category: "Utilities",
      paymentMethod: "Bank Transfer",
      status: "Pending",
    },
    {
      date: "2024-02-04",
      expenseType: "Software Subscription",
      amount: "899",
      category: "IT",
      paymentMethod: "Credit Card",
      status: "Paid",
    },
    {
      date: "2024-02-05",
      expenseType: "Marketing Campaign",
      amount: "2500",
      category: "Marketing",
      paymentMethod: "Cash",
      status: "Pending",
    },
    {
      date: "2024-02-06",
      expenseType: "Travel Reimbursement",
      amount: "1800",
      category: "HR",
      paymentMethod: "Cash",
      status: "Paid",
    },
    {
      date: "2024-02-07",
      expenseType: "Training Program",
      amount: "4000",
      category: "HR",
      paymentMethod: "Bank Transfer",
      status: "Paid",
    },
    {
      date: "2024-02-08",
      expenseType: "Stationery",
      amount: "750",
      category: "Admin",
      paymentMethod: "Cash",
      status: "Paid",
    },
    {
      date: "2024-02-09",
      expenseType: "Equipment Purchase",
      amount: "8000",
      category: "IT",
      paymentMethod: "Credit Card",
      status: "Pending",
    },
    {
      date: "2024-02-10",
      expenseType: "Office Supplies",
      amount: "1300",
      category: "Admin",
      paymentMethod: "Cash",
      status: "Paid",
    },
    {
      date: "2024-02-11",
      expenseType: "Maintenance",
      amount: "1500",
      category: "Facilities",
      paymentMethod: "Bank Transfer",
      status: "Paid",
    },
    {
      date: "2024-02-12",
      expenseType: "Client Meeting Expenses",
      amount: "900",
      category: "Operations",
      paymentMethod: "Cash",
      status: "Pending",
    },
  ];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourseData = salaryData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  function setIsOpenPopups(arg0: number | null): void {
    throw new Error("Function not implemented.");
  }

  return (
    <BaseLayout4>
      <div className="w-full h-screen bg-[#e9e9e9] px-4 py-6">
      <div className="flex justify-between items-start mb-1.5">
  {/* Left Side - Expenses Heading */}
  <div className="text-start">
    <h2 className="text-black text-[22px] font-semibold">Expenses</h2>
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
<div className="flex justify-between items-start mb-6 flex-wrap">
  {/* Cards Section */}
  <div className="flex gap-6 flex-wrap">
    <div className="w-[240px] h-[120px] p-5 rounded-xl bg-[#304DAF] text-white shadow-md">
      <h4 className="text-sm mb-2 opacity-90">Total Expenses</h4>
      <h1 className="text-xl font-bold">$ 120,000</h1>
      <div className="flex justify-between items-center mt-2 text-sm opacity-90">
        <span><strong>12%</strong> Increase From Target</span>
        <span className="text-lg">↑</span>
      </div>
    </div>

    <div className="w-[240px] h-[120px] p-5 rounded-xl bg-white text-[#475569] shadow-md">
      <h4 className="text-sm mb-2 opacity-90">Pending</h4>
      <h1 className="text-xl font-bold">$ 16,500</h1>
      <div className="flex justify-between items-center mt-2 text-sm opacity-90">
        <span><strong>2%</strong> Decrease From Target</span>
        <span className="text-lg">↓</span>
      </div>
    </div>

    <div className="w-[240px] h-[120px] p-5 rounded-xl bg-white text-[#475569] shadow-md">
      <h4 className="text-sm mb-2 opacity-90">Revenue</h4>
      <h1 className="text-xl font-bold">$ 48,670</h1>
      <div className="flex justify-between items-center mt-2 text-sm opacity-90">
        <span><strong>6%</strong> Increase From Target</span>
        <span className="text-lg">↑</span>
      </div>
    </div>

    <div className="w-[240px] h-[120px] p-5 rounded-xl bg-white text-[#475569] shadow-md">
      <h4 className="text-sm mb-2 opacity-90">Balance</h4>
      <h1 className="text-xl font-bold">$ 48,670</h1>
      <div className="flex justify-between items-center mt-2 text-sm opacity-90">
        <span><strong>6%</strong> Increase From Target</span>
        <span className="text-lg">↑</span>
      </div>
    </div>
  </div>

  {/* Duration Filter */}
  <div className="flex items-center rounded border border-gray-300 bg-white px-4 py-[5px] mt-2 md:mt-0">
    <label
      htmlFor="duration"
      className="font-medium text-gray-600 text-[10px] rounded-lg flex items-center mr-3"
    >
      Duration :
    </label>
    <select
      value={duration}
      onChange={(e) => setDuration(e.target.value)}
      className="text-[10px] bg-transparent focus:outline-none"
    >
      <option>Last week</option>
      <option>Last month</option>
      <option>Last 3 months</option>
      <option>Last year</option>
    </select>
  </div>
</div>


        <div className="flex justify-end mb-2">
          <button
            className="bg-[#0F3659] hover:bg-[#0c2b46] text-white text-[10px] font-medium px-2 py-2 rounded-lg shadow-sm transition flex items-center mr-3 "
            onClick={() => setIsPopupOpen(true)}
          >
            <AiOutlinePlus size={15} /> {/* Increase to 20 or more */}
            Add new Payment
          </button>
        </div>
        {isPopupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 scrollbar-none">
            <div className="relative w-[500px] h-[600px] bg-white rounded-2xl shadow-2xl px-4 py-6 overflow-y-auto scrollbar-none">
              <button
                className="absolute top-4 right-4 text-black text-xl font-bold"
                onClick={() => setIsPopupOpen(false)}
              >
                ×
              </button>
              <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
                Add Payment
              </h2>

              <div className="space-y-4 text-[11px]">
                <div>
                  <label
                    htmlFor="payment-date"
                    className="block font-medium text-gray-800 mb-1 text-left"
                  >
                    Payment Date
                  </label>
                  <input
                    type="date"
                    id="payment-date"
                    className="w-full h-10 px-4 rounded-xl border border-gray-300 bg-gray-100 text-gray-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="expense-type"
                    className="block font-medium text-gray-800 mb-1 text-left"
                  >
                    Expense Type
                  </label>
                  <input
                    type="text"
                    id="expense-type"
                    className="w-full h-10 px-4 rounded-xl border border-gray-300 bg-gray-100 text-gray-600"
                    placeholder="e.g. Internet Bills"
                  />
                </div>

                <div>
                  <label
                    htmlFor="amount"
                    className="block font-medium text-gray-800 mb-1 text-left"
                  >
                    Amount
                  </label>
                  <input
                    type="text"
                    id="amount"
                    className="w-full h-10 px-4 rounded-xl border border-gray-300 bg-gray-100 text-gray-600"
                    placeholder="$300"
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block font-medium text-gray-800 mb-1 text-left"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    className="w-full h-10 px-4 rounded-xl border border-gray-300 bg-gray-100 text-gray-600"
                  >
                    <option>Utilities</option>
                    <option>Rent</option>
                    <option>Supplies</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="method"
                    className="block font-medium text-gray-800 mb-1 text-left"
                  >
                    Payment Method
                  </label>
                  <select
                    id="method"
                    className="w-full h-10 px-4 rounded-xl border border-gray-300 bg-gray-100 text-gray-600"
                  >
                    <option>Bank Transfer</option>
                    <option>Cash</option>
                    <option>Cheque</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="block font-medium text-gray-800 mb-1 text-left"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    className="w-full h-10 px-4 rounded-xl border border-gray-300 bg-gray-100 text-gray-600"
                  >
                    <option>Paid</option>
                    <option>Pending</option>
                    <option>Failed</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-between gap-4">
                <button className="w-1/2 h-9 rounded-xl border border-gray-400 text-gray-700 font-medium text-[12px]">
                  Cancel
                </button>
                <button className="w-1/2 h-9 rounded-xl bg-blue-900 text-white font-medium text-[12px]">
                  Add Payment
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto bg-white rounded-lg border-2 border-[#1C3557] w-full max-w-[1255px] mx-auto">
          <table className="w-full table-auto bg-[#fff] rounded-lg shadow text-xs">
          <thead className="border-b-[1px] border-[#1C3557] text-[11px] font-semibold">
          <tr className="bg-gray-100">
                <th className="p-3 text-center">Date</th>
                <th className="p-3 text-center">Expense Type</th>
                <th className="p-3 text-center">Amount</th>
                <th className="p-3 text-center">Category</th>
                <th className="p-3 text-center">Payment Method</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCourseData.map((row, index) => (
        <tr key={row.date} className={`text-[9px] text-center font-medium mt-0 ${index % 2 === 0 ? 'bg-[#faf9f9]' : 'bg-[#ebebeb]'}` }>
                  <td className="p-2">{row.date}</td>
                  <td className="p-2">{row.expenseType}</td>
                  <td className="p-2">{row.amount}</td>
                  <td className="p-2">{row.category}</td>
                  <td className="p-2">{row.paymentMethod}</td>
                  <td className="p-2">
                    <span
                      className={`inline-flex items-center justify-center  w-14 h-6 px-3 py-1 rounded-2xl ${
                        row.status === "Paid"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="p-1 text-center align-middle relative">
                    <button
                      className="p-1 bg-[#1C3557] text-white rounded-full"
                      onClick={() => setIsPopupOpens(isPopupOpens === index ? null : index)}
                    >
                      <FaEdit size={10} />
                    </button>

                    {isPopupOpens === index && (
                       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 scrollbar-none">
                       <div className="relative w-[500px] h-[600px] bg-white rounded-2xl shadow-2xl px-4 py-6 overflow-y-auto scrollbar-none">
                         <button
                           className="absolute top-4 right-4 text-black text-xl font-bold"
                           onClick={() => setIsPopupOpens(null)}
                           >
                           ×
                         </button>
                         <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
                           Add Payment
                         </h2>
           
                         <div className="space-y-4 text-[11px]">
                           <div>
                             <label
                               htmlFor="payment-date"
                               className="block font-medium text-gray-800 mb-1 text-left"
                             >
                               Payment Date
                             </label>
                             <input
                               type="date"
                               id="payment-date"
                               className="w-full h-10 px-4 rounded-xl border border-gray-300 bg-gray-100 text-gray-600"
                             />
                           </div>
           
                           <div>
                             <label
                               htmlFor="expense-type"
                               className="block font-medium text-gray-800 mb-1 text-left"
                             >
                               Expense Type
                             </label>
                             <input
                               type="text"
                               id="expense-type"
                               className="w-full h-10 px-4 rounded-xl border border-gray-300 bg-gray-100 text-gray-600"
                               placeholder="e.g. Internet Bills"
                             />
                           </div>
           
                           <div>
                             <label
                               htmlFor="amount"
                               className="block font-medium text-gray-800 mb-1 text-left"
                             >
                               Amount
                             </label>
                             <input
                               type="text"
                               id="amount"
                               className="w-full h-10 px-4 rounded-xl border border-gray-300 bg-gray-100 text-gray-600"
                               placeholder="$300"
                             />
                           </div>
           
                           <div>
                             <label
                               htmlFor="category"
                               className="block font-medium text-gray-800 mb-1 text-left"
                             >
                               Category
                             </label>
                             <select
                               id="category"
                               className="w-full h-10 px-4 rounded-xl border border-gray-300 bg-gray-100 text-gray-600"
                             >
                               <option>Utilities</option>
                               <option>Rent</option>
                               <option>Supplies</option>
                             </select>
                           </div>
           
                           <div>
                             <label
                               htmlFor="method"
                               className="block font-medium text-gray-800 mb-1 text-left"
                             >
                               Payment Method
                             </label>
                             <select
                               id="method"
                               className="w-full h-10 px-4 rounded-xl border border-gray-300 bg-gray-100 text-gray-600"
                             >
                               <option>Bank Transfer</option>
                               <option>Cash</option>
                               <option>Cheque</option>
                             </select>
                           </div>
           
                           <div>
                             <label
                               htmlFor="status"
                               className="block font-medium text-gray-800 mb-1 text-left"
                             >
                               Status
                             </label>
                             <select
                               id="status"
                               className="w-full h-10 px-4 rounded-xl border border-gray-300 bg-gray-100 text-gray-600"
                             >
                               <option>Paid</option>
                               <option>Pending</option>
                               <option>Failed</option>
                             </select>
                           </div>
                         </div>
           
                         <div className="mt-8 flex justify-between gap-4">
                           <button className="w-1/2 h-9 rounded-xl border border-gray-400 text-gray-700 font-medium text-[12px]">
                             Cancel
                           </button>
                           <button className="w-1/2 h-9 rounded-xl bg-blue-900 text-white font-medium text-[12px]">
                             Add Payment
                           </button>
                         </div>
                       </div>
                     </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4 p-2 text-sm text-gray-600">
            <p className="text-[11px]">
              Showing {paginatedCourseData.length} of {salaryData.length}{" "}
              classes
            </p>
            <div className="flex gap-2">
              {Array.from(
                { length: Math.ceil(salaryData.length / itemsPerPage) },
                (_, i) => (
                  <button
                    key={i}
                    className={`w-4 h-4 text-[11px] flex items-center justify-center rounded ${
                      currentPage === i + 1
                        ? "bg-[#1C3557] text-white"
                        : "text-[#1C3557] border border-[#1C3557]"
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout4>
  );
};

export default Expenses;
