'use client'

import React, { useState } from 'react';
import BaseLayout3 from '@/components/BaseLayout3';
import { CalendarDays, Clock } from 'lucide-react';
import SupervisorHeader from '../../components/supervisorHeader';

const SchedulePage = () => {
  const [activeView, setActiveView] = useState<'monthly' | 'weekly' | 'daily'>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());

  const tabs = ['monthly', 'weekly', 'daily'] as const;

  const events = [
    { date: 2, color: 'text-[#21BAFF] , border-[#21BAFF]' },
    { date: 11, color: 'text-[#ce4b49] , border-[#ce4b49]' },
    { date: 14, color: 'text-[#5362e4] , border-[#5362e4]' },
    { date: 23, color: 'text-[#e49d2c] , border-[#e49d2c]' },
    { date: 28, color: 'text-[#74c22a] , border-[#74c22a]' },
  ];

  const listItems = [
    { title: 'Group discussion', color: 'text-[#21BAFF]' },
    { title: 'Team standup', color: 'text-red-500' },
    { title: 'One-on-one', color: 'text-indigo-500' },
    { title: 'Planning call', color: 'text-amber-500' },
    { title: 'Demo session', color: 'text-green-500' },
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDay.getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase();
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const WeeklyView = () => (
    <div className="grid grid-cols-2 gap-4">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
        <div key={idx} className="text-gray-500 mb-2 dark:bg-[#414141] bg-gray-100 rounded-xl dark:text-[#fff] p-4 min-h-[100px]">
          <h4 className="text-sm font-semibold mb-2">{day}</h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">9:00 AM - Team Meeting</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">2:00 PM - Project Sync</p>
        </div>
      ))}
    </div>
  );

  const DailyView = () => (
    <div className="space-y-4  h-[600px] overflow-y-scroll scrollbar-none">
      {[
        { time: '9:00 AM', title: 'Team Sync', color: 'text-sky-500' },
        { time: '10:30 AM', title: 'Client Call', color: 'text-red-500' },
        { time: '12:00 PM', title: 'Lunch Break', color: 'text-indigo-500' },
        { time: '2:00 PM', title: 'Design Review', color: 'text-amber-500' },
        { time: '4:00 PM', title: 'Wrap-up Meeting', color: 'text-green-500' },
      ].map((item, idx) => (
        <div key={idx} className="p-4 text-gray-500 mb-2 dark:bg-[#414141] bg-gray-100 rounded-xl dark:text-[#fff]">
          <div className={`text-sm font-semibold ${item.color}`}>{item.title}</div>
          <div className="text-[10px] text-gray-400">{item.time}</div>
        </div>
      ))}
    </div>
  );

  const MonthlyView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    
    // Create array of all days in the month
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    
    // Create array of empty cells for days before the first day of the month
    const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => null);
    
    // Combine empty cells and days
    const totalDays = [...emptyCells, ...days];

    return (
      <>
        {/* Month Header */}
        <div className="flex items-end justify-end mb-4 -mt-10 gap-2">
          <button 
            onClick={handlePrevMonth}
            className="py-[1px] px-2 rounded-lg bg-gray-100 dark:bg-[#414141] hover:bg-gray-200 dark:hover:bg-[#505050] transition-colors"
          >
            &lt;
          </button>
          <h2 className="text-[16px] font-semibold">{formatMonthYear(currentDate)}</h2>
          <button 
            onClick={handleNextMonth}
            className="py-[1px] px-2 rounded-lg bg-gray-100 dark:bg-[#414141] hover:bg-gray-200 dark:hover:bg-[#505050] transition-colors"
          >
            &gt;
          </button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 mt-12 gap-2 text-center text-sm font-medium text-gray-500 mb-2 dark:bg-[#414141] bg-gray-100 rounded-xl p-3 dark:text-[#fff]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Calendar Dates */}
        <div className="grid grid-cols-7 gap-2 text-sm h-[455px] overflow-scroll scrollbar-none">
          {totalDays.map((day, i) => {
            if (day === null) {
              return <div key={i} className="min-h-[80px] bg-transparent" />;
            }

            const todayEvent = events.find(e => e.date === day);
            const isValidDay = day > 0 && day <= daysInMonth;
            
            return (
              <div
                key={i}
                className={`min-h-[80px] rounded-xl flex flex-col items-center justify-center ${
                  isValidDay 
                    ? todayEvent 
                      ? `${todayEvent.color} border ${todayEvent.color.replace('text', 'border')}`
                      : isToday(day)
                        ? 'bg-[#27176518] text-white'
                        : 'bg-gray-100 dark:bg-[#414141] dark:text-[#fff] text-gray-500'
                    : 'bg-transparent'
                }`}
              >
                {isValidDay && (
                  <>
                    <div className={`font-semibold ${isToday(day) ? 'text-white' : ''}`}>{day}</div>
                    {todayEvent && (
                      <div className="text-[10px] mt-1">
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
      </>
    );
  };

  return (
    <BaseLayout3>
    <SupervisorHeader currentSection='Calendar'/>
      <div className="p-2">
        <div className=" mx-auto gap-4 flex flex-col md:flex-row overflow-hidden h-[630px]">
          {/* Left Section */}
          <div className="w-full md:w-2/3 p-6 bg-white dark:bg-[#343434] shadow-md rounded-xl">
            {/* Tabs */}
            <div className="flex space-x-4 text-sm font-medium mb-4">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveView(tab)}
                  className={`capitalize ${
                    activeView === tab ? 'text-[#576cbc] border-b-2 border-[#576cbc]' : 'text-gray-400'
                  } pb-1`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Conditional Views */}
            {activeView === 'monthly' && <MonthlyView />}
            {activeView === 'weekly' && <WeeklyView />}
            {activeView === 'daily' && <DailyView />}
          </div>

          {/* Right List Schedule Section */}
          <div className="w-full md:w-1/3 p-6 bg-white dark:bg-[#343434] shadow-md rounded-xl">
            <h3 className="text-[18px] font-semibold mb-6">List Schedule</h3>
            <div className="space-y-6 overflow-y-scroll scrollbar-none h-[600px]">
              {listItems.map((item, index) => (
                <div key={index} className="border-b dark:border-[#414141] pb-4">
                  <div className='flex justify-between'>
                  <h4 className={`font-medium text-[12px] ${item.color}`}>{item.title}</h4>
                  <div className="flex items-center text-gray-400 text-[10px] mt-1 gap-2">
                    <span className="flex items-center gap-1 dark:text-[#f4f4f4]">
                      <Clock size={14} /> 9:00 AM – 10:30 AM
                    </span>
                    <span className="flex items-center gap-1 dark:text-[#f4f4f4]">
                      <CalendarDays size={14} /> 06/05/2024
                    </span>
                  </div>
                  </div>
                  
                  <p className="text-gray-500 dark:text-[#f9f9f9] text-[10px] mt-2">
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
