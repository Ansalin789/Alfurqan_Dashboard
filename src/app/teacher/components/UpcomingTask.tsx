'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ClassEvent {
  _id: string;
  package: string;
  startDate: string;
  startTime: string[];
  sessionClassType: string;
}

const UpcomingTasks: React.FC = () => {
  const [classes, setClasses] = useState<ClassEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const classTypeStyles: Record<string, { dot: string; text: string }> = {
    REGULARCLASS: { dot: 'bg-[#d77277]', text: 'text-[#d77277]' }, 
    GROUPCLASS: { dot: 'bg-[#72B0D7]', text: 'text-[#72B0D7]' },   
    QURAN: { dot: 'bg-[#BF63B3]', text: 'text-[#BF63B3]' },        
    ARABIC: { dot: 'bg-[#6EBF63]', text: 'text-[#6EBF63]' },      
    ISLAMIC: { dot: 'bg-[#BFBC63]', text: 'text-[#BFBC63]' },      
    DEFAULT: { dot: 'bg-gray-400', text: 'text-gray-500' },
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const teacherId = localStorage.getItem('TeacherPortalId');
        const token = localStorage.getItem('TeacherAuthToken');

        if (!teacherId || !token) {
          throw new Error('Teacher credentials not found');
        }

        const response = await axios.get(
          'https://api.blackstoneinfomaticstech.com/classShedule/teacher',
          {
            params: { teacherId },
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const today = new Date();
        const todayClasses = response.data.classSchedule
          .filter((item: ClassEvent) => {
            const classDate = new Date(item.startDate);
            return classDate.toDateString() === today.toDateString();
          })
          .map((item: ClassEvent) => ({
            ...item,
            sessionClassType: item.sessionClassType.trim().toUpperCase(),
          }))
          .sort((a: { startTime: string[] }, b: { startTime: string[] }) =>
            a.startTime[0].localeCompare(b.startTime[0])
          );

        setClasses(todayClasses);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch classes'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#343434] w-full rounded-xl px-4 pt-4 pb-6">
        <p className="text-center text-gray-500 dark:text-white">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-[#343434] w-full rounded-xl px-4 pt-4 pb-6">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#343434] w-full rounded-xl px-4 pt-4 pb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="font-semibold text-[16px] text-[#010e30] dark:text-white">
          Upcoming Tasks
        </h2>
        <span className="bg-[#EBEFFF] dark:bg-[#576CBC33] text-[#6B73FF] text-xs font-medium px-2 py-1 rounded-md">
          Today
        </span>
      </div>

      <div className="relative">
        {/* Vertical Dotted Line (Dark mode → white) */}
        <div className="absolute left-[58px] top-0 bottom-0 border-l-2 border-dotted border-black dark:border-white" />

        <div className="space-y-4 pl-[8px]">
          {classes.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-white text-sm p-4">
              No classes scheduled for today.
            </p>
          ) : (
            classes.map((classItem) => {
              const classType = classItem.sessionClassType;
              const style = classTypeStyles[classType] || classTypeStyles.DEFAULT;

              return (
                <div
                  key={classItem._id}
                  className="flex items-start relative w-full"
                >
                  {/* Time */}
                  <div className="w-[45px] text-[13px] text-black dark:text-white mt-[6px] text-right pr-1">
                    {classItem.startTime[0]}
                  </div>

                  {/* Dot centered on line */}
                  <div className="absolute left-[46px] top-[50%] -translate-y-1/2 z-10">
                    <div
                      className={`w-[10px] h-[10px] rounded-full ${style.dot}`}
                    />
                  </div>

                  {/* Card */}
                  <div className="ml-[24px] flex-1 bg-[#f4f4f4] dark:bg-[#404040] rounded-md px-3 py-2 flex justify-between items-center">
                    <span
                      className={`text-[14px] font-bold uppercase ${style.text}`}
                    >
                      {classItem.sessionClassType}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingTasks;
