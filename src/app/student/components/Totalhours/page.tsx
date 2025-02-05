// 'use client';
// import { Doughnut } from 'react-chartjs-2';
// import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

// Chart.register(ArcElement, Tooltip, Legend);

// const DonutChart = () => {
//   const data = {
//     labels: ['Completed hours', 'Pending hours'],
//     datasets: [
//       {
//         data: [73, 27], // 73% completed, 27% pending
//         backgroundColor: ['#FBBF24', '#8B5CF6'], // Yellow and purple colors
//         hoverBackgroundColor: ['#FACC15', '#7C3AED'], // Hover colors
//       },
//     ],
//   };

//   const options = {
//     cutout: '70%', // Creates the donut effect
//     plugins: {
//       legend: {
//         display: false, // Disable default legend
//       },
//       tooltip: {
//         callbacks: {
//           label: (tooltipItem: { label: any; raw: any; }) => {
//             return `${tooltipItem.label}: ${tooltipItem.raw}%`;
//           },
//         },
//       },
//     },
//   };

//   return (
//     <div className="block col-span-12 bg-[#f7f7f9] p-4 py-3 rounded-[17px] h-60 -mt-3 border-[#979595] border-[1px]">
//       {/* Title */}
//       <h3 className="text-[13px] font-semibold text-gray-700 text-center mb-2">
//         Total class hours - 12 Hrs
//       </h3>

//       {/* Chart */}
//       <div className="relative w-32 h-32 mx-auto">
//         <Doughnut data={data} options={options} />
//         <div className="absolute inset-0 flex items-center justify-center">
//           <span className="text-[16px] font-bold text-gray-700">73%</span>
//         </div>
//       </div>

//       {/* Legend */}
//       <div className="flex flex-col items-start text-sm mt-4">
//         <div className="flex items-center space-x-2">
//           <span
//             className="w-3 h-3 rounded-full"
//             style={{ backgroundColor: '#FBBF24' }}
//           ></span>
//           <span className="text-gray-600 text-[11px]">Completed hours</span>
//         </div>
//         <div className="flex items-center space-x-2 mt-1">
//           <span
//             className="w-3 h-3 rounded-full"
//             style={{ backgroundColor: '#8B5CF6' }}
//           ></span>
//           <span className="text-gray-600 text-[11px]">Pending hours</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DonutChart;






import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Pending hours", value: 4, color: "#FACC15" },
  { name: "Completed hours", value: 10, color: "#A78BFA" },
];

const totalHours = 12;
const percentage = Math.round((data[0].value / totalHours) * 100);

const Page = () => {
  return (
    <div className="block col-span-12 bg-[#f7f7f9] p-4 py-3 rounded-[17px] h-60 -mt-3 border-[#c8c8c8] border-[1px]">
        {/* Title */}
        <h2 className="text-[13px] font-semibold text-gray-700 text-center mb-2">
          Total class hours - {totalHours} Hrs
        </h2>

        {/* Donut Chart */}
        <div className="relative w-40 h-40 mx-auto">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={45}
                outerRadius={80}
                startAngle={90}
                endAngle={460}
                paddingAngle={2}
                cornerRadius={10}
                stroke="#f7f7f9"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))} 
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[16px] font-bold text-gray-700">{percentage}%</span>
          </div>
        </div>

        {/* Legends */}
        <div className="flex flex-col items-start text-sm -mt-2">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></span>
              <span className="text-gray-600 text-[11px]">{entry.name}</span>
            </div>
          ))}
        </div>
    </div>
  );
};

export default Page;



