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
  ArcElement
} from 'chart.js';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
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

  // Bar chart data
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct','Nov','Dec'],
    datasets: [
      {
        data: [80, 70, 80, 90, 70, 78, 85, 70, 75,35,35,65], // Total invoices
        backgroundColor: '#217EFD', // Light gray background for total
        borderRadius: {
          bottomLeft: 10,
          bottomRight: 10
        },
        barThickness: 25,
      },
      {
        data: [45, 50, 43, 60, 34, 50, 58, 39, 48,35,35,65], // Paid invoices
        backgroundColor: '#012A4A', // Blue color for paid portion
        borderRadius: {
          topLeft: 10,
          topRight: 10,
          bottomLeft: 0,
          bottomRight: 0
        },
        barThickness: 25,
      }
    ],
  };
  
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // allow height to be controlled by container
    layout: {
      padding: {
        top: 10,
        bottom: 0,
        left: 0,
        right: 0,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          afterBody: function (context: any) {
            const chart = context[0].chart;
            const index = context[0].dataIndex;
  
            const total = chart.data.datasets[0].data[index];
            const paid = chart.data.datasets[1].data[index];
  
            if (!total || !paid) return [`No data`];
  
            return [
              `Total: ${total}`,
              `Paid: ${paid} (${Math.round((paid / total) * 100)}%)`,
            ];
          },
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
        ticks: {
          stepSize: 20,
        },
        grid: {
          drawBorder: false,
          drawTicks: false,
          drawOnChartArea: false,
        },
      },
    },
  };
  
  
  
  const doughnutData = {
    labels: ['0-10', '10-20', '20-30', 'More than 30'],
    datasets: [
      {
        data: [35, 20, 18, 10],
        backgroundColor: ['#0f172a', '#8b5cf6', '#0ea5e9', '#3b82f6'],
        borderWidth: 0,
      },
    ],
  };
  
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false // Disable default legend
      }
    }
  };
  
  const InvoiceLegend = () => (
    <div className="space-y-3">
      {/* Legend Item 1 */}
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-gray-900" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">0-10 days</span>
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">
            35
          </span>
        </div>
      </div>
  
      {/* Legend Item 2 */}
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-purple-500" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">10-20 days</span>
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">
            35
          </span>
        </div>
      </div>
  
      {/* Legend Item 3 */}
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-sky-500" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">20-30 days</span>
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">
            35
          </span>
        </div>
      </div>
  
      {/* Legend Item 4 */}
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-blue-500" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">More than 30 days</span>
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">
            35
          </span>
        </div>
      </div>
    </div>
  );
  const handleviewlist = () => {
    router.push('/admin-main/ui/invoicelist');
  }

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
          <div className="grid grid-cols-4 gap-4 mb-3">
  {[
    {
      title: 'Total Invoices',
      count: '2,478',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-500',
      chartColor: '#64748b',
    },
    {
      title: 'Paid Invoices',
      count: '983',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-500',
      chartColor: '#6366f1',
    },
    {
      title: 'Unpaid Invoices',
      count: '1,256',
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-500',
      chartColor: '#06b6d4',
    },
    {
      title: 'Void Invoices',
      count: '652',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-500',
      chartColor: '#3b82f6',
    },
  ].map((card, i) => (
    <div
      key={i}
      className="bg-white shadow-sm rounded-lg flex flex-col justify-between overflow-hidden"
    >
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-start justify-between">
          <div className={`w-8 h-8 rounded-full ${card.iconBg} flex items-center justify-center`}>
            <FileText size={16} className={card.iconColor} />
          </div>
          <div className="text-right">
            <h3 className="text-xl font-semibold text-gray-800">{card.count}</h3>
            <p className="text-xs text-gray-500">{card.title}</p>
          </div>
        </div>
      </div>
      
      <div className="h-12 w-full relative">
        <Line 
          data={{
            labels: ['', '', '', '', '', ''],
            datasets: [{
              data: [3, 8, 4, 6, 5, 9],
              borderColor: card.chartColor,
              backgroundColor: `${card.chartColor}20`, // 20% opacity of border color
              borderWidth: 4,
              fill: {
                target: 'origin',
                above: `${card.chartColor}10`, // Lighter fill above origin (if needed)
                below: `${card.chartColor}20`  // Fill below the line
              },
              tension: 0.4
            }]
          }}
          options={{ 
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
              legend: { display: false },
              filler: {
                propagate: false
              }
            },
            scales: {
              x: { 
                display: false,
                grid: { display: false },
                ticks: { padding: 0 }
              },
              y: { 
                display: false,
                grid: { display: false },
                ticks: { padding: 0 },
                beginAtZero: true // Ensures fill goes to bottom
              }
            },
            layout: {
              padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }
            },
            elements: {
              point: { radius: 0 },
              line: { tension: 0.4, borderWidth: 2 },
            },
          }} 
        />
      </div>
    </div>
  ))}
</div>

          {/* Middle Sections */}
          <div className="grid grid-cols-2 gap-6 mb-6 items-start">
  {/* Total Invoice Section */}
  <div className="bg-white rounded-xl shadow-sm p-3 h-[300px] w-full">
      <div className="flex justify-between items-center mb-4">
      <h3 className="text-base font-semibold text-gray-800">Total Invoice</h3>
       <div className="flex gap-3 items-center flex-wrap">
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-full bg-[#012A4A]" />
      <span className="text-xs text-gray-600">Total</span>
    </div>
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-full bg-[#217EFD]" />
      <span className="text-xs text-gray-600">Paid</span>
    </div>
      <div className="bg-gray-100 text-gray-500 text-[10px] px-2 py-[2px] rounded shadow-sm">
      Last year
      </div>
   </div>
     </div>

    <div className="w-full" style={{ height: "240px" }}>
      <Bar data={barData} options={barOptions} />
    </div>
  </div>

  {/* Invoices Due by Days */}
  <div className="bg-white rounded-xl shadow-sm p-4 h-[300px] w-full">
  <h3 className="text-sm font-semibold text-gray-800 mb-2">Invoices Due by Days</h3>
  <div className="flex h-[calc(100%-50px)]"> {/* Subtract title height */}
    {/* Chart Container (60%) */}
    <div className="w-[50%] h-full flex items-center justify-center mt-3">
      <Doughnut 
        data={doughnutData} 
        options={{
          ...doughnutOptions,
          maintainAspectRatio: false,
          plugins: {
            ...doughnutOptions.plugins,
            legend: {
              display: false // Hide default legend since we're using custom one
            }
          }
        }} 
      />
    </div>
    
    {/* Legend Container (40%) */}
    <div className="w-[50%] h-full flex items-center justify-center pl-4">
      <InvoiceLegend />
    </div>
  </div>
  </div>
</div>


         

          {/* Invoice Table */}
          <div className="overflow-x-auto scrollbar-none bg-white rounded-lg border-2 border-[#1C3557] flex flex-col justify-between">
  <table className="min-w-full rounded-lg shadow bg-white" style={{ width: "100%", tableLayout: "fixed" }}>
    <thead className="border-b-[1px] border-[#1C3557] text-[12px] font-semibold">
      <tr>
        <th className="p-3 py-5 font-semibold text-center" style={{ width: "15%" }}>Invoice ID</th>
        <th className="p-3 py-5 font-semibold text-center" style={{ width: "15%" }}>Date</th>
        <th className="p-3 py-5 font-semibold text-center" style={{ width: "15%" }}>Student Name</th>
        <th className="p-3 py-5 font-semibold text-center" style={{ width: "12%" }}>Student ID</th>
        <th className="p-3 py-5 font-semibold text-center" style={{ width: "12%" }}>Course</th>
        <th className="p-3 py-5 font-semibold text-center" style={{ width: "10%" }}>Due By Days</th>
        <th className="p-3 py-5 font-semibold text-center" style={{ width: "15%" }}>Paid Date</th>
        <th className="p-3 py-5 font-semibold text-center" style={{ width: "10%" }}>Status</th>
      </tr>
    </thead>
    <tbody className="text-[10px] font-medium">
      {/* Row 1 */}
      <tr className="bg-[#faf9f9]">
        <td className="p-2 text-center">#12342451</td>
        <td className="p-2 text-center">June 1, 2020, 08:22 AM</td>
        <td className="p-2 text-center">Jason Peros</td>
        <td className="p-2 text-center">#0953587</td>
        <td className="p-2 text-center">Article</td>
        <td className="p-2 text-center">2 days</td>
        <td className="p-2 text-center">June 4, 2020, 08:22 AM</td>
        <td className="p-2 text-center">
          <span className="inline-flex items-center justify-center  w-12 h-4.5 px-3 py-1 rounded-md bg-green-100 text-green-800 border border-green-900 text-[7px] ">Paid</span>
        </td>
      </tr>

      {/* Row 2 */}
      <tr className="bg-[#ebebeb]">
        <td className="p-2 text-center">#12342451</td>
        <td className="p-2 text-center">June 1, 2020, 08:22 AM</td>
        <td className="p-2 text-center">Samantha Cool</td>
        <td className="p-2 text-center">#0953587</td>
        <td className="p-2 text-center">Queen</td>
        <td className="p-2 text-center">2 days</td>
        <td className="p-2 text-center">-</td>
        <td className="p-2 text-center">
          <span className="inline-flex items-center justify-center  w-12 h-4.5 px-3 py-1 rounded-md bg-yellow-100 text-yellow-800 border border-yellow-900 text-[7px] ">Pending</span>
        </td>
      </tr>

      {/* Row 3 */}
      <tr className="bg-[#faf9f9]">
        <td className="p-2 text-center">#12342451</td>
        <td className="p-2 text-center">June 1, 2020, 08:22 AM</td>
        <td className="p-2 text-center">Mooncroft</td>
        <td className="p-2 text-center">#0953587</td>
        <td className="p-2 text-center">Islamic Studies</td>
        <td className="p-2 text-center">2 days</td>
        <td className="p-2 text-center">June 4, 2020, 08:22 AM</td>
        <td className="p-2 text-center">
          <span className="inline-flex items-center justify-center  w-12 h-4.5 px-3 py-1 bg-green-100 text-green-800 border border-green-900 text-[7px]  rounded-md">Paid</span>
        </td>
      </tr>
    </tbody>
  </table>

  <div className="mt-1 text-right px-4 pb-2">
    <button className="text-blue-500 text-xs hover:underline" onClick={handleviewlist}>View all &gt;</button>
  </div>
</div>

        </div>
      </BaseLayout4>
    </div>
  );
}