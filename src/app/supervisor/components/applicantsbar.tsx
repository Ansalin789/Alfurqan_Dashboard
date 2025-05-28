'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DateRange } from 'react-date-range';
import { format, addDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const data = [
  { date: '08 Nov', applied: 12, shortlisted: 6 },
  { date: '09 Nov', applied: 10, shortlisted: 5 },
  { date: '10 Nov', applied: 8, shortlisted: 4 },
  { date: '11 Nov', applied: 7, shortlisted: 5 },
  { date: '12 Nov', applied: 9, shortlisted: 5 },
  { date: '13 Nov', applied: 8, shortlisted: 5 },
  { date: '14 Nov', applied: 11, shortlisted: 6 },
];

const ApplicationChart = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<any[]>([
    {
      startDate: null,
      endDate: null,
      key: 'selection',
    },
  ]);

  const handleRangeChange = (ranges: any) => {
    const start = ranges.selection.startDate;
    const end = ranges.selection.endDate;

    if (start && end) {
      setDateRange([ranges.selection]);
      setShowCalendar(false);
    }
  };

  const formattedDate = dateRange[0].startDate && dateRange[0].endDate
    ? `${format(dateRange[0].startDate, 'dd MMM')}–${format(dateRange[0].endDate, 'dd MMM')}`
    : '';

  return (
    <div className="w-full relative">
      <div className="bg-white p-4 rounded-xl shadow-md w-[550px] h-[270px]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[#010E30] text-[14px] font-semibold">Application</h3>

          <div className="flex items-center gap-4 relative">
            {/* Legend - Applied */}
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-[#a6c1ff]" />
              <span className="text-[10px] font-normal text-[#010E30]">Applied</span>
            </div>

            {/* Legend - Shortlisted */}
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-[#d5e0ff]" />
              <span className="text-[10px] font-normal text-[#010E30]">Shortlisted</span>
            </div>

            {/* Date Picker Toggle */}
            <div
              className="flex items-center gap-1 px-2 py-[4px] text-[11px] bg-[#F5F7FB] rounded-md border text-gray-600 cursor-pointer"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <svg
                className="w-4 h-4 text-gray-500"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M3 7H21M7 3V7M17 3V7M7 11H17M7 15H14M7 19H10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{formattedDate || 'Select Date'}</span>
            </div>

            {/* Calendar Dropdown */}
            {showCalendar && (
              <div className="absolute right-0 top-[38px] z-50">
                <DateRange
                  editableDateInputs={true}
                  onChange={handleRangeChange}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                  rangeColors={['#0D356D']}
                />
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} barSize={30} barGap={0}>
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
            />
            <Bar dataKey="applied" stackId="a" fill="#a6c1ff" radius={[0, 0, 8, 8]} />
            <Bar dataKey="shortlisted" stackId="a" fill="#d5e0ff" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ApplicationChart;
