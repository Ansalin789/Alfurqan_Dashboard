import React from 'react';

const data = [
  { title: 'Trail Assigned', value: 100, change: 15, isPositive: true, color: 'bg-purple-100' },
  { title: 'Evaluation Completed', value: 80, change: -3, isPositive: false, color: 'bg-blue-200' },
  { title: 'Evaluation Pending', value: 20, change: -3, isPositive: false, color: 'bg-purple-100' },
  { title: 'Total Dropped', value: 10, change: 5, isPositive: true, color: 'bg-blue-200' },
];

const Card = ({ title, value, change, isPositive, color }) => (
  <div className={`p-8 rounded-lg shadow flex flex-col items-center ${color}`}>
    <div className="flex justify-between items-center w-full mb-2">
      <span className={`text-sm px-2 py-1 rounded-full ${isPositive ? 'bg-white text-green-800' : 'bg-white text-red-800'}`}>
        {isPositive ? '↑' : '↓'} {Math.abs(change)}%
      </span>
      <span className="text-gray-500">...</span>
    </div>
    <span className="text-2xl font-semibold">{value}</span>
    <span className="text-[#2c2c2c] font-semibold text-[15px]">{title}</span>
  </div>
);

const Dashboard = () => (
  <div className="grid grid-cols-4 gap-4">
    {data.map((item, index) => (
      <Card key={index} {...item} />
    ))}
  </div>
);

export default Dashboard;
