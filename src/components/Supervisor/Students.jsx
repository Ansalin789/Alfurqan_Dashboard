import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Students = () => {
  const data = {
    labels: ['Boys', 'Girls'],
    datasets: [
      {
        data: [47, 53], // Boys 47%, Girls 53%
        backgroundColor: ['#ADD8E6', '#FF69B4'], // Light blue for boys, pink for girls
        hoverBackgroundColor: ['#87CEEB', '#FF1493'],
        borderWidth: 0,
        cutout: '75%', // Makes the hole in the middle bigger
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the default chart legend
      },
    },
  };

  return (
    <div className="bg-white p-0 rounded-lg w-72">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Students</h3>
        <span className="text-gray-400">•••</span> {/* Dots in the top right */}
      </div>
      
      <div className="relative flex justify-center items-center h-20 w-20 mx-auto my-4">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="flex items-center space-x-0">
            <span className="text-xl">👦</span> 
            <span className="text-xl">👧</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-around mt-4">
        <div className="text-center">
          <div className="flex items-center space-x-1">
            <span className="block w-3 h-3 bg-blue-300 rounded-full"></span>
            <p className="text-lg font-bold">45,414</p>
          </div>
          <p className="text-gray-500 text-sm">Boys (47%)</p>
        </div>
        <div className="text-center">
          <div className="flex items-center space-x-1">
            <span className="block w-3 h-3 bg-pink-400 rounded-full"></span>
            <p className="text-lg font-bold">40,270</p>
          </div>
          <p className="text-gray-500 text-sm">Girls (53%)</p>
        </div>
      </div>
    </div>
  );
};

export default Students;
