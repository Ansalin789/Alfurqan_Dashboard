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
        labels: ['Total Teachers', 'Total Assigned', 'Total on leave'],
        datasets: [
            {
                label: 'Male',
                data: [60, 40, 20], // Corresponding values for Male
                backgroundColor: '#40C4FF',
            },
            {
                label: 'Female',
                data: [40, 50, 10], // Corresponding values for Female
                backgroundColor: '#FF4081',
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#FFFFFF',
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#FFFFFF',
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div className="col-span-3 bg-[#3e68a1] p-6 rounded-[25px] shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Teacher`&apos;`s</h3>
            <div className="relative h-52">
                <Bar data={data} options={options} />
            </div>
                {/* <div className="flex justify-between mt-4">
                    <div className="text-center">
                        <p className="text-white text-sm">Total Teachers</p>
                    </div>
                    <div className="text-center">
                        <p className="text-white text-sm">Total Assigned</p>
                    </div>
                    <div className="text-center">
                        <p className="text-white text-sm">Total on leave</p>
                    </div>
                </div> */}
        </div>
    );
}
