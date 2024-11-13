// Import necessary components and icons
import React from 'react';
import { Bar } from 'react-chartjs-2';
// import { FiHome, FiUsers, FiCalendar, FiMessageCircle, FiHelpCircle } from 'react-icons/fi';
import { FaSun, FaMoon, FaUserCircle } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import 'react-circular-progressbar/dist/styles.css';
import BaseLayout1 from '@/components/BaseLayout1';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CircularProgressbar = dynamic(
  () => import('react-circular-progressbar').then(mod => mod.CircularProgressbar),
  { ssr: false }
);

export default function Academic() {
  // Data and options for the Teacher's chart
  const teachersChartData = {
    labels: ['Total Teachers', 'Trail Assigned', 'On Leave'],
    datasets: [
      {
        label: 'Teachers Data',
        data: [50, 30, 10], // Example data
        backgroundColor: ['#4A90E2', '#BD10E0', '#50E3C2'],
      },
    ],
  };

  const teachersChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <BaseLayout1>
      <div className="flex h-screen text-gray-800">
        <main className="flex-grow p-6 bg-gray-100">
          
          {/* Header */}
          <header className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Search here..."
              className="px-4 py-2 rounded-lg border shadow-sm w-1/2"
            />
            <div className="flex items-center space-x-4">
              <FaSun />
              <FaMoon />
              <FaUserCircle />
            </div>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {['Trail Assigned', 'Evaluation Completed', 'Evaluation Pending', 'Total Pending'].map((title, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg shadow text-center">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-2xl">{[100, 80, 20, 10][idx]}</p>
              </div>
            ))}
          </div>

          {/* Main Content Section */}
          <div className="grid grid-cols-3 gap-4">
            {/* Next Evaluation Class */}
            <div className="col-span-2 bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Your Next Evaluation Class</h2>
              <div className="flex items-center justify-between">
                <p className="text-lg">Abinesh <span className="text-gray-500">9:00 AM</span></p>
                <div className="w-16 h-16">
                  <CircularProgressbar value={70} text="4:23" />
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Calendar</h2>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {[...Array(31)].map((_, i) => (
                  <div key={i} className={`p-1 rounded ${[5, 6, 17].includes(i + 1) ? "bg-gray-300" : ""}`}>
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Teachers/Students List, Teacher's Chart, and Upcoming Classes */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {/* Teachers/Students List */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Teachers/Students</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span>Abdullah Sulaiman</span> <span>20</span></div>
                <div className="flex justify-between"><span>Iman Gabel</span> <span>10</span></div>
                <div className="flex justify-between"><span>Hassan Ibrahim</span> <span>40</span></div>
              </div>
            </div>

            {/* Teacher's Chart */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Teachers</h3>
              <Bar data={teachersChartData} options={teachersChartOptions} />
            </div>

            {/* Upcoming Classes */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Upcoming Classes</h3>
              <div className="space-y-2">
                <div>
                  <p>06 May 2024</p>
                  <p>09:00 AM - 10:00 AM</p>
                  <p className="text-gray-500">Evaluation Class</p>
                  <p className="text-gray-500">Abinesh</p>
                </div>
              </div>
            </div>
          </div>

          {/* E Request List */}
          <div className="bg-white p-4 rounded-lg shadow mt-6">
            <h3 className="text-xl font-semibold mb-4">E Request List</h3>
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2">Student Name</th>
                  <th className="text-left px-4 py-2">Topic</th>
                  <th className="text-left px-4 py-2">Task Name</th>
                  <th className="text-left px-4 py-2">Submission Date</th>
                  <th className="text-left px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2">Emily Peterson</td>
                  <td className="px-4 py-2">World War II</td>
                  <td className="px-4 py-2">Research Paper on the Cuban Missile Crisis</td>
                  <td className="px-4 py-2">May 5, 2024</td>
                  <td className="px-4 py-2 text-gray-500">Not Viewed</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">Olivia Smith</td>
                  <td className="px-4 py-2">Industrial Revolution</td>
                  <td className="px-4 py-2">Group Project on the Effects of Industrialization</td>
                  <td className="px-4 py-2">May 9, 2024</td>
                  <td className="px-4 py-2 text-yellow-500">Reviewing</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </BaseLayout1>
  );
}
