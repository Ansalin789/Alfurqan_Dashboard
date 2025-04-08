"use client";

import React, { useEffect, useRef, useState } from 'react';
import BaseLayout4 from '@/components/BaseLayout4';
import { Sun, Bell, X, FileText } from 'lucide-react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement, 
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Page() {
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

  // Generate month names for the chart labels
 
  const chartTemplate = (color: string) => ({
    labels: Array(8).fill(''),
    datasets: [
      {
        data: [12, 19, 11, 17, 14, 18, 13, 16],
        fill: true,
        borderColor: color,
        backgroundColor: color + '22',
        tension: 0.4,
        borderWidth: 6, // Thicker line
        pointRadius: 0,
      },
    ],
  });
  
  const smallChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
  };
  // Bar chart data
 const barData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  datasets: [
    {
      label: 'Total Invoices',
      data: [80, 70, 80, 90, 70, 78, 85, 70, 75], // Full bar height
      backgroundColor: '#0f172a', // Dark color for full total
      borderRadius: 20,
      barThickness: 20,
    },
    {
      label: 'Paid Invoices',
      data: [45, 50, 43, 60, 34, 50, 58, 39, 48], // Overlay light
      backgroundColor: '#3b82f6', // Light color for paid
      borderRadius: 20,
      barThickness: 20,
    },
  ],
};

  
  
  
  
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 10,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          drawBorder: false,
          drawTicks: false,
          drawOnChartArea: false, // This removes all horizontal lines including center one
        },
      },
    },
  };
  
  
  
  
  
  // Doughnut data
  const doughnutData = {
    labels: ['0 - 10', '10 - 20', '20 - 30', 'More than 30'],
    datasets: [
      {
        data: [35, 20, 18, 10],
        backgroundColor: ['#0f172a', '#8b5cf6', '#0ea5e9', '#3b82f6'],
        borderWidth: 0,
      },
    ],
  };
  
  const doughnutOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { usePointStyle: true, pointStyle: 'circle', boxWidth: 8 },
      },
    },
  };

  return (
    <div>
      <BaseLayout4>
        <div className="p-6 w-full mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Invoice</h1>
            <div className="flex items-center gap-4">
              <button className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                <Sun size={16} className="text-gray-700" />
              </button>
              
              <button 
                className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 relative"
                onClick={toggleNotifications}
              >
                <Bell size={16} className="text-gray-700" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Notification Panel */}
          {showNotifications && (
            <div
              ref={notificationRef}
              className="absolute right-6 top-20 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h4 className="font-semibold text-gray-900">Notifications</h4>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="h-60 overflow-y-auto p-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-gray-100 ${
                      notification.seen ? "bg-white" : "bg-blue-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-sm mt-0.5">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invoice Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-2 rounded-xl">
      {/* Reusable Card Component */}
      {[
        {
          title: 'Total Invoices',
          count: '2,478',
          color: 'gray',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-500',
          chartColor: '#64748b',
        },
        {
          title: 'Paid Invoices',
          count: '983',
          color: 'indigo',
          iconBg: 'bg-indigo-100',
          iconColor: 'text-indigo-500',
          chartColor: '#6366f1',
        },
        {
          title: 'Unpaid Invoices',
          count: '1,256',
          color: 'cyan',
          iconBg: 'bg-cyan-100',
          iconColor: 'text-cyan-500',
          chartColor: '#06b6d4',
        },
        {
          title: 'Void Invoices',
          count: '652',
          color: 'blue',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-500',
          chartColor: '#3b82f6',
        },
      ].map((card, i) => (
        <div
          key={i}
          className="bg-white  shadow-md rounded-xl flex flex-col justify-between"
        >
          <div className="flex items-start justify-between px-4 mt-2 mb-2">
            <div className={`w-10 h-10 rounded-full ${card.iconBg} flex items-center justify-center`}>
              <FileText size={20} className={card.iconColor} />
            </div>
            <div className="text-right">
              <h3 className="text-2xl font-bold text-gray-800">{card.count}</h3>
              <p className="text-sm text-gray-500">{card.title}</p>
            </div>
          </div>
          <div className="h-16">
            <Line data={chartTemplate(card.chartColor)} options={smallChartOptions} />
          </div>
        </div>
      ))}
    </div>

          {/* Middle Sections */}
          <div className="grid grid-cols-3 gap-6 mb-6 items-start">
      {/* Total Invoice Section */}
      <div className="bg-white rounded-xl shadow-sm p-4">
  {/* Title + Legend + Year Dropdown */}
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-semibold text-gray-800">Total Invoice</h3>
    
    <div className="flex items-center space-x-4 text-sm text-gray-500">
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 rounded-full bg-slate-800" />
        <span>Total</span>
      </div>
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 rounded-full bg-blue-500" />
        <span>Paid</span>
      </div>
      <span className="text-sm text-gray-400">Last year ⌄</span>
    </div>
  </div>

  {/* Bar Chart */}
  <Bar data={barData} options={barOptions} height={220} />
</div>


      {/* Invoices Due by Days */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Invoices Due by Days</h3>
        <div className="w-full flex justify-center">
          <Doughnut data={doughnutData} options={doughnutOptions} width={200} height={200} />
        </div>
      </div>

      {/* Duration Dropdown */}
      <div className="flex justify-end items-start h-full">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <label className="text-sm text-gray-500 font-medium">Duration :</label>
          <div className="text-base font-semibold text-gray-700">Last month ⌄</div>
        </div>
      </div>
    </div>

         

          {/* Invoice Table */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-sm">
                    <th className="pb-4">Invoice ID</th>
                    <th className="pb-4">Date</th>
                    <th className="pb-4">Student Name</th>
                    <th className="pb-4">Student ID</th>
                    <th className="pb-4">Course</th>
                    <th className="pb-4">Due By Days</th>
                    <th className="pb-4">Paid Date</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {/* Row 1 */}
                  <tr className="border-b border-gray-100">
                    <td className="py-4">#12342451</td>
                    <td>June 1, 2020, 08:22 AM</td>
                    <td>Jason Peros</td>
                    <td>#0953587</td>
                    <td>Article</td>
                    <td>2 days</td>
                    <td>June 4, 2020, 08:22 AM</td>
                    <td className="text-green-500">PAID</td>
                  </tr>
                  
                  {/* Row 2 */}
                  <tr className="border-b border-gray-100">
                    <td className="py-4">#12342451</td>
                    <td>June 1, 2020, 08:22 AM</td>
                    <td>Samantha Cool</td>
                    <td>#0953587</td>
                    <td>Queen</td>
                    <td>2 days</td>
                    <td>-</td>
                    <td className="text-yellow-500">Pending</td>
                  </tr>
                  
                  {/* Row 3 */}
                  <tr className="border-b border-gray-100">
                    <td className="py-4">#12342451</td>
                    <td>June 1, 2020, 08:22 AM</td>
                    <td>Mooncroft</td>
                    <td>#0953587</td>
                    <td>Islamic Studies</td>
                    <td>2 days</td>
                    <td>June 4, 2020, 08:22 AM</td>
                    <td className="text-green-500">PAID</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-right">
              <button className="text-blue-500 text-sm hover:underline">View all &gt;</button>
            </div>
          </div>
        </div>
      </BaseLayout4>
    </div>
  );
}