// pages/schedule.tsx

import React from 'react';
import BaseLayout3 from '@/components/BaseLayout3';
import { CalendarDays, Clock } from 'lucide-react';

const SchedulePage = () => {
  const events = [
    { date: 2, color: 'text-sky-500', border: 'border-sky-500' },
    { date: 11, color: 'text-red-500', border: 'border-red-500' },
    { date: 14, color: 'text-indigo-500', border: 'border-indigo-500' },
    { date: 23, color: 'text-amber-500', border: 'border-amber-500' },
    { date: 28, color: 'text-green-500', border: 'border-green-500' },
  ];

  const listItems = [
    { title: 'Group discussion', color: 'text-sky-500' },
    { title: 'Group discussion', color: 'text-red-500' },
    { title: 'Group discussion', color: 'text-indigo-500' },
    { title: 'Group discussion', color: 'text-amber-500' },
    { title: 'Group discussion', color: 'text-green-500' },
  ];

  return (
    <BaseLayout3>
      <div className="p-4 bg-[#F1F3FA] min-h-screen">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md flex flex-col md:flex-row overflow-hidden">
          {/* Left Calendar Section */}
          <div className="w-full md:w-2/3 p-6">
            {/* Tabs */}
            <div className="flex space-x-4 text-sm font-medium mb-4">
              <span className="text-indigo-600 border-b-2 border-indigo-600 pb-1 cursor-pointer">Monthly</span>
              <span className="text-gray-400 cursor-pointer">Weekly</span>
              <span className="text-gray-400 cursor-pointer">Daily</span>
            </div>

            {/* Month Header */}
            <div className="flex items-center justify-between mb-4">
              <button className="p-2 rounded-full hover:bg-gray-200">&lt;</button>
              <h2 className="text-lg font-bold">JANUARY, 2022</h2>
              <button className="p-2 rounded-full hover:bg-gray-200">&gt;</button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-500 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day}>{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2 text-sm">
              {Array.from({ length: 35 }).map((_, i) => {
                const day = i - 2;
                const todayEvent = events.find(e => e.date === day);
                return (
                  <div
                    key={i}
                    className={`min-h-[80px] rounded-xl flex flex-col items-center justify-center ${
                      todayEvent
                        ? `border ${todayEvent.border} text-xs text-gray-600`
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {day > 0 && (
                      <>
                        <div className="font-semibold">{day}</div>
                        {todayEvent && (
                          <div className={`${todayEvent.color} text-[10px] mt-1`}>
                            Group discussion
                            <br />
                            9:00 AM – 9:30 AM
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right List Section */}
          <div className="w-full md:w-1/3 border-l border-gray-200 p-6">
            <h3 className="text-xl font-semibold mb-4">List Schedule</h3>
            <div className="space-y-6">
              {listItems.map((item, index) => (
                <div key={index} className="border-b pb-4">
                  <h4 className={`font-semibold ${item.color}`}>{item.title}</h4>
                  <div className="flex items-center text-gray-400 text-sm space-x-4 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> 9:00 AM – 10:30 AM
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays size={14} /> 06/05/2024
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fermentum vehicula commodo. Quisque
                    semper nibh et egestas.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout3>
  );
};

export default SchedulePage;
