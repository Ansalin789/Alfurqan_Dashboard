"use client";

import React, { useState, useEffect } from "react";
import BaseLayout3 from "@/components/BaseLayout3";
import { CalendarDays, Clock } from "lucide-react";
import SupervisorHeader from "../../components/supervisorHeader";
import axios from "axios";
import moment from "moment";

interface Meeting {
  _id: string;
  meetingId: string;
  meetingName: string;
  meetingStatus: "Scheduled" | "Reschedule" | "Completed";
  selectedDate: string;
  startTime: string;
  endTime: string;
  description: string;
  createdDate: string;
  createdBy: string;
  supervisor: {
    supervisorId: string;
    supervisorName: string;
    supervisorEmail: string;
    supervisorRole: string;
  };
  teacher: {
    teacherId: string;
    teacherName: string;
    teacherEmail: string;
  }[];
}

const SchedulePage = () => {
  const [activeView, setActiveView] = useState<'monthly' | 'weekly' | 'daily'>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);

  const tabs = ["monthly", "weekly", "daily"] as const;

  // Add meeting type colors
  const meetingTypeColors = {
    'Group Meeting': {
      text: 'text-[#21BAFF]',
      border: 'border-[#21BAFF]',
      bg: 'bg-[#21BAFF]/10'
    },
    'Teacher Meeting': {
      text: 'text-[#ce4b49]',
      border: 'border-[#ce4b49]',
      bg: 'bg-[#ce4b49]/10'
    },
    'Weekly Meeting': {
      text: 'text-[#5362e4]',
      border: 'border-[#5362e4]',
      bg: 'bg-[#5362e4]/10'
    }
  };

  // Helper function to get meeting type color
  const getMeetingTypeColor = (meetingName: string) => {
    const lowerName = meetingName.toLowerCase();
    if (lowerName.includes('group')) return meetingTypeColors['Group Meeting'];
    if (lowerName.includes('teacher')) return meetingTypeColors['Teacher Meeting'];
    if (lowerName.includes('weekly')) return meetingTypeColors['Weekly Meeting'];
    return meetingTypeColors['Group Meeting']; // default color
  };

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("SupervisorAuthToken") : null;
        if (!token) {
          console.error("❌ SupervisorAuthToken not found");
          return;
        }

        const response = await axios.get("https://api.blackstoneinfomaticstech.com/allMeetings", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.data?.data?.meetings) {
          const sortedMeetings = response.data.data.meetings.sort((a: Meeting, b: Meeting) => 
            new Date(a.selectedDate).getTime() - new Date(b.selectedDate).getTime()
          );
          setMeetings(sortedMeetings);
          setFilteredMeetings(sortedMeetings);
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchMeetings();
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDay.getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const formatMonthYear = (date: Date) => {
    return date
      .toLocaleString("default", { month: "long", year: "numeric" })
      .toUpperCase();
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const getMeetingsForDate = (date: Date) => {
    return meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.selectedDate);
      return (
        meetingDate.getDate() === date.getDate() &&
        meetingDate.getMonth() === date.getMonth() &&
        meetingDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const dayMeetings = meetings.filter(meeting => {
      const meetingDate = new Date(meeting.selectedDate);
      return meetingDate.getDate() === date.getDate() &&
             meetingDate.getMonth() === date.getMonth() &&
             meetingDate.getFullYear() === date.getFullYear();
    });
    setFilteredMeetings(dayMeetings);
  };

  const handleClearFilter = () => {
    setSelectedDate(null);
    setFilteredMeetings(meetings);
  };

  const WeeklyView = () => {
    if (!selectedMonth) {
      // Show months view
      const months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(i);
        return date;
      });

      return (
        <div className="space-y-4 h-[600px] overflow-y-scroll scrollbar-none">
          {months.map((month, idx) => {
            const monthMeetings = meetings.filter(meeting => {
              const meetingDate = new Date(meeting.selectedDate);
              return meetingDate.getMonth() === month.getMonth() &&
                     meetingDate.getFullYear() === month.getFullYear();
            });

            return (
              <div
                key={idx}
                onClick={() => setSelectedMonth(month)}
                className="text-gray-500 mb-2 dark:bg-[#414141] bg-gray-100 rounded-xl dark:text-[#fff] p-4 min-h-[100px] cursor-pointer hover:bg-gray-200 dark:hover:bg-[#505050] transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-semibold">
                    {month.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h4>
                  <span className="text-[10px] bg-[#576cbc] text-white px-2 py-1 rounded-full">
                    {monthMeetings.length} Events
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-[9px] text-gray-400">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day}>{day}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Show events for selected month
    const monthMeetings = meetings.filter(meeting => {
      const meetingDate = new Date(meeting.selectedDate);
      return meetingDate.getMonth() === selectedMonth.getMonth() &&
             meetingDate.getFullYear() === selectedMonth.getFullYear();
    });

    return (
      <div className="space-y-4 h-[600px] overflow-y-scroll scrollbar-none">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSelectedMonth(null)}
            className="text-[12px] text-[#576cbc] hover:text-[#576cbc]/80 flex items-center gap-1"
          >
            ← Back to Months
          </button>
          <h3 className="text-[16px] font-semibold">
            {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
        </div>

        {monthMeetings.map((meeting, idx) => {
          const colors = getMeetingTypeColor(meeting.meetingName);
          const meetingDate = new Date(meeting.selectedDate);
          
          return (
            <div
              key={idx}
              className={`p-4 text-gray-500 mb-2 dark:bg-[#414141] bg-gray-100 rounded-xl dark:text-[#fff] ${colors.border} border`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className={`text-sm font-semibold ${colors.text}`}>
                    {meeting.meetingName}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    {meeting.startTime} - {meeting.endTime}
                  </div>
                </div>
                <div className="text-[10px] bg-[#576cbc] text-white px-2 py-1 rounded-full">
                  {meetingDate.toLocaleString('default', { weekday: 'short', day: 'numeric' })}
                </div>
              </div>
              <div className="text-[10px] text-gray-400 mt-2">
                {meeting.description}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const DailyView = () => {
    const dayMeetings = getMeetingsForDate(currentDate);

    return (
      <div className="space-y-4 h-[600px] overflow-y-scroll scrollbar-none">
        {dayMeetings.map((meeting, idx) => {
          const colors = getMeetingTypeColor(meeting.meetingName);
          return (
            <div
              key={idx}
              className={`p-4 text-gray-500 mb-2 dark:bg-[#414141] bg-gray-100 rounded-xl dark:text-[#fff] ${colors.border} border`}
            >
              <div className={`text-sm font-semibold ${colors.text}`}>
                {meeting.meetingName}
              </div>
              <div className="text-[10px] text-gray-400">
                {meeting.startTime} - {meeting.endTime}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">
                {meeting.description}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const MonthlyView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => null);
    const totalDays = [...emptyCells, ...days];

    return (
      <>
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

        <div className="grid grid-cols-7 mt-12 gap-2 text-center text-sm font-medium text-gray-500 mb-2 dark:bg-[#414141] bg-gray-100 rounded-xl p-3 dark:text-[#fff]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 text-sm h-[455px] overflow-scroll scrollbar-none">
          {totalDays.map((day, i) => {
            if (day === null) {
              return <div key={i} className="min-h-[80px] bg-transparent" />;
            }

            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayMeetings = getMeetingsForDate(date);
            const hasMeetings = dayMeetings.length > 0;
            const colors = hasMeetings ? getMeetingTypeColor(dayMeetings[0].meetingName) : null;
            const isSelected = selectedDate && 
              date.getDate() === selectedDate.getDate() &&
              date.getMonth() === selectedDate.getMonth() &&
              date.getFullYear() === selectedDate.getFullYear();
            
            return (
              <div
                key={i}
                onClick={() => handleDateClick(date)}
                className={`min-h-[80px] rounded-xl flex flex-col items-center justify-start mt-1 p-1 cursor-pointer ${
                  hasMeetings 
                    ? `${colors?.border} ${colors?.text} ${colors?.bg} border text-[10px]`
                    : isToday(day)
                      ? 'bg-[#27176518] text-white'
                      : 'bg-gray-100 dark:bg-[#414141] dark:text-[#fff] text-gray-500'
                } ${isSelected ? 'ring-2 ring-[#576cbc]' : ''}`}
              >
                <div className={`font-semibold ${isToday(day) ? 'text-black' : ''}`}>{day}</div>
                {hasMeetings && (
                  <div className="w-full overflow-hidden">
                    <div className="text-[9px] truncate px-1">
                      {dayMeetings[0].meetingName}
                    </div>
                    <div className="text-[8px] truncate px-1">
                      {dayMeetings[0].startTime} - {dayMeetings[0].endTime}
                    </div>
                  </div>
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
        <div className="mx-auto gap-4 flex flex-col md:flex-row overflow-hidden h-[630px]">
          <div className="w-full md:w-2/3 p-6 bg-white dark:bg-[#343434] shadow-md rounded-xl">
            <div className="flex space-x-4 text-sm font-medium mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveView(tab)}
                  className={`capitalize ${
                    activeView === tab
                      ? "text-[#576cbc] border-b-2 border-[#576cbc]"
                      : "text-gray-400"
                  } pb-1`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeView === "monthly" && <MonthlyView />}
            {activeView === "weekly" && <WeeklyView />}
            {activeView === "daily" && <DailyView />}
          </div>

          <div className="w-full md:w-1/3 p-6 bg-white dark:bg-[#343434] shadow-md rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[18px] font-semibold">List Schedule</h3>
              {selectedDate && (
                <button
                  onClick={handleClearFilter}
                  className="text-[12px] text-[#576cbc] hover:text-[#576cbc]/80"
                >
                  Show All
                </button>
              )}
            </div>
            <div className="space-y-6 overflow-y-scroll scrollbar-none h-[600px]">
              {filteredMeetings.map((meeting, index) => {
                const colors = getMeetingTypeColor(meeting.meetingName);
                return (
                  <div key={index} className="border-b dark:border-[#414141] pb-4">
                    <div className='flex justify-between'>
                      <h4 className={`font-medium w-40 text-[12px] ${colors.text}`}>{meeting.meetingName}</h4>
                      <div className="flex items-center text-gray-400 text-[9px] mt-1 gap-2">
                        <span className="flex items-center gap-1 dark:text-[#f4f4f4]">
                          <Clock size={10} /> {meeting.startTime} - {meeting.endTime}
                        </span>
                        <span className="flex items-center gap-1 dark:text-[#f4f4f4]">
                          <CalendarDays size={10} /> {moment(meeting.selectedDate).format('DD/MM/YYYY')}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-500 dark:text-[#f9f9f9] text-[9px] mt-2">
                      {meeting.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout3>
  );
};

export default SchedulePage;
