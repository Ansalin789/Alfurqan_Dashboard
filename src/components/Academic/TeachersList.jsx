import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { FaMale, FaFemale } from 'react-icons/fa';

export default function Academic() {
    const data = {
        labels: ['Teacher Assigned', 'Not Assigned', 'On Leave', 'Left'],
        datasets: [
            {
                label: 'Teacher Distribution',
                data: [763, 321, 69, 69], // Corresponding percentages
                backgroundColor: ['#FFC107', '#F44336', '#4CAF50', '#E0E0E0'],
                hoverBackgroundColor: ['#FFB300', '#D32F2F', '#388E3C', '#BDBDBD'],
            },
        ],
    };

    return (
        <div className="col-span-6 bg-white p-6 rounded-lg shadow-lg flex justify-between items-center">
                  {/* Left: Chart and Total Students */}
                  <div className="relative flex flex-col items-center">
                    <Doughnut
                      data={data}
                      options={{
                        cutoutPercentage: 120,
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                      width={200}
                      height={200}
                    />
                    <div className=" flex flex-col items-center justify-center">
                      <p className="absolute -mt-[124px] text-lg font-bold rounded-full p-2">451</p>
                    </div>
                  </div>

                {/* Right: Stats and Legend */}
                <div className="flex flex-col ml-8 space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">Total Teachers</h3>
                  <div className="flex flex-col items-center" size={30}>
                    {/* Icons of Boys and Girls */}
                    <div className="flex items-center space-x-2 mb-4">
                        <FaMale className="text-blue-400" size={30} />
                        <FaFemale className="text-pink-500" size={30} />
                    </div>

                    {/* Boys and Girls Counts */}
                    <div className="flex justify-between space-x-10">
                        {/* Boys */}
                        <div className="flex flex-col items-center">
                            <span className="w-2 h-2 bg-blue-400 rounded-full mb-2"></span>
                            <p className="text-[15px] font-bold text-gray-700">200</p>
                            <p className="text-gray-600 text-[10px]">Boys (47%)</p>
                        </div>

                        {/* Girls */}
                        <div className="flex flex-col items-center">
                            <span className="w-2 h-2 bg-pink-500 rounded-full mb-2"></span>
                            <p className="text-[15px] font-bold text-gray-700">250</p>
                            <p className="text-gray-600 text-[10px]">Girls (53%)</p>
                        </div>
                    </div>
                </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                      <span className="text-gray-700 text-[12px]">Active (27%)</span>
                    </div>
                    <p className="text-gray-700 font-semibold text-[12px]">763</p>

                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                      <span className="text-gray-700 text-[12px]">Not Active (50%)</span>
                    </div>
                    <p className="text-gray-700 font-semibold text-[12px]">321</p>

                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      <span className="text-gray-700 text-[12px]">On Leave (23%)</span>
                    </div>
                    <p className="text-gray-700 font-semibold text-[12px]">69</p>

                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-gray-300 rounded-full mr-2"></span>
                      <span className="text-gray-700 text-[12px]">Left (23%)</span>
                    </div>
                    <p className="text-gray-700 font-semibold text-[12px]">69</p>
                  </div>
                </div>
              </div>
    );
}
