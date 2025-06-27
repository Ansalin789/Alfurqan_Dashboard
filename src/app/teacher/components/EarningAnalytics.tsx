'use client';
import React, { useState } from 'react';

const EarningAnalytics = () => {
  const [activeTab, setActiveTab] = useState('Regular Class');
  const tabs = ['Regular Class', 'Trail Class', 'Group Class'];

  return (
    <div className="w-full h-full bg-white dark:bg-[#343434] rounded-2xl shadow-md p-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-[#010E30] dark:text-white">
          Earning Analytics
        </h2>
        <select className="bg-[#EFEFEF] dark:bg-[#565656] text-[#3E5E8A] dark:text-white py-[2px] px-2 rounded-md text-[11px] font-medium">
          <option>Monthly</option>
          <option>Weekly</option>
          <option>Daily</option>
        </select>
      </div>

      {/* Earnings */}
      <h3 className="text-2xl font-semibold text-[#010E30] dark:text-white mb-4 -mt-2">
        $2000
      </h3>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
              activeTab === tab
                ? 'bg-[#576CBC] text-white'
                : 'bg-[#EFEFEF] dark:bg-[#444] text-[#7A7A7A] dark:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Monthly Data */}
      <div className="space-y-3">
        <div className="flex justify-between items-center p-2 bg-[#F9F9F9] dark:bg-[#3A3A3A] rounded-lg">
          <div className="text-sm font-medium text-[#010E30] dark:text-white">
            This Month
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#010E30] dark:text-white">
              $15
            </span>
            <span className="text-green-600 bg-green-100 dark:bg-green-900 text-[11px] font-semibold px-2 py-[2px] rounded-md">
              +3.4%
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center p-2 bg-[#F9F9F9] dark:bg-[#3A3A3A] rounded-lg">
          <div className="text-sm font-medium text-[#010E30] dark:text-white">
            Last Month
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#010E30] dark:text-white">
              $10
            </span>
            <span className="text-red-600 bg-red-100 dark:bg-red-900 text-[11px] font-semibold px-2 py-[2px] rounded-md">
              -0.1%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningAnalytics;
