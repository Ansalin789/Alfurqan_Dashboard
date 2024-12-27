import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Link from 'next/link'


// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Teachers() {
    const data = {
        labels: ['', '', ''],
        datasets: [
            {
                label: 'Male',
                data: [80, 50, 20],
                backgroundColor: '#6fd4ff',
                borderRadius: {
                    topLeft: 6,
                    topRight: 6,
                    bottomLeft: 6,
                    bottomRight: 6
                },
                barThickness: 11,
            },
            {
                label: 'Female',
                data: [50, 30, 12],
                backgroundColor: '#ff82f5',
                borderRadius: {
                    topLeft: 6,
                    topRight: 6,
                    bottomLeft: 6,
                    bottomRight: 6
                },
                barThickness: 11,
            }
        ],
    };

    const options = {
        scales: {
            y: {
                display: false,
                beginAtZero: true,
                grid: {
                    display: false
                },
                ticks: {
                    padding: 10
                }
            },
            x: {
                display: false,
                grid: {
                    display: false
                }
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 10,
                right: 10,
                top: 20,
                bottom: 20,
            },
        },
    };

    return (
        <Link 
        href="/Academic/manageTeachers"
        className="block col-span-12 bg-[#3e68a1] p-4 py-3 rounded-[25px] shadow-xl 
                 transition-transform hover:scale-[1.02] 
                 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="View Teachers and Students Management"
    >
        <div className="col-span-12 bg-[#3e68a1] p-4 rounded-[25px] shadow-lg">
            <div className="flex justify-between items-center gap-6">
                <h3 className="text-[15px] font-semibold text-white">Teachers</h3>
                <div className="flex gap-2 -ml-2">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#6fd4ff]"></div>
                        <span className="text-white/60 text-[10px]">Male</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#ff82f5]"></div>
                        <span className="text-white/60 text-[10px]">Female</span>
                    </div>
                </div>
            </div>
            <div className="relative h-[120px]">
                <Bar data={data} options={options} />
            </div>
            <div className="flex justify-between mt-4">
                <div className="text-center">
                    <p className="text-white/60 text-[10px]">Total Teachers</p>
                </div>
                <div className="text-center">
                    <p className="text-white/60 text-[10px]">Total Assigned</p>
                </div>
                <div className="text-center">
                    <p className="text-white/60 text-[10px]">Total on leave</p>
                </div>
            </div>
        </div>
        </Link>
    );
}
