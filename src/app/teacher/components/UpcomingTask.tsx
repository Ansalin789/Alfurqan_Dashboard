'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

interface ClassItem {
  id: string;
  date: string;
  time: string;
  title: string;
  teacher: string;
  startTime: string;
  endTime: string;
}

const UpcomingTask: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dotColors = [
    'bg-[#d77277]',
    'bg-[#72B0D7]',
    'bg-[#BF63B3]',
    'bg-[#BFBC63]',
    'bg-[#BF8C63]',
    'bg-[#6EBF63]',
  ];

  const textColors = [
    'text-[#d77277]',
    'text-[#72B0D7]',
    'text-[#BF63B3]',
    'text-[#BFBC63]',
    'text-[#BF8C63]',
    'text-[#6EBF63]',
  ];

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const teacherId = localStorage.getItem('TeacherPortalId');
        const token = localStorage.getItem('TeacherAuthToken');

        if (!teacherId || !token) {
          console.error('❌ Missing TeacherPortalId or AuthToken');
          return;
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
        today.setHours(0, 0, 0, 0);

        const todayClasses = response.data.classSchedule
          .map((item: any) => {
            const startDate = new Date(item.startDate);
            const isToday =
              startDate.getDate() === today.getDate() &&
              startDate.getMonth() === today.getMonth() &&
              startDate.getFullYear() === today.getFullYear();

            return isToday
              ? {
                  id: item._id,
                  date: startDate.toLocaleDateString('en-GB').replace(/\//g, '-'),
                  time: `${item.startTime[0]} - ${item.endTime[0]}`,
                  startTime: item.startTime[0],
                  endTime: item.endTime[0],
                  title: item.package,
                  teacher: item.teacher?.teacherName || 'N/A',
                }
              : null;
          })
          .filter((item: ClassItem | null) => item !== null) as ClassItem[];

        setClasses(todayClasses);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, []);

  return (
    <div className="bg-white dark:bg-[#343434] rounded-xl p-4 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#010e30] dark:text-white">Upcoming Tasks</h3>
        <span className="bg-[#EBEFFF] text-[#6B73FF] text-xs font-semibold px-3 py-1 rounded-md">
          Today
        </span>
      </div>

      <div className="relative pl-10">
        {/* Dotted vertical line */}
        <div className="absolute left-[33px] top-0 bottom-0 border-l-2 border-dotted border-gray-400 dark:border-white" />

        {loading ? (
          <p className="text-center text-gray-500 dark:text-white">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : classes.length === 0 ? (
          <p className="text-center text-gray-500 text-sm p-4">
            No classes scheduled for today.
          </p>
        ) : (
          classes.map((item, index) => {
            const dotColor = dotColors[index % dotColors.length];
            const textColor = textColors[index % textColors.length];

            return (
              <div key={item.id} className="relative flex items-start mb-6">
                {/* Dot and Time */}
                <div className="absolute -left-[46px] mt-6 flex flex-row items-center gap-2">
                  <span className="text-xs font-medium text-gray-700 dark:text-white">
                    {item.startTime}
                  </span>
                  <div className={`w-[10px] h-[10px] rounded-full ${dotColor}`} />
                </div>

                {/* Title Box */}
                <div className="bg-[#f4f4f4] dark:bg-[#404040] rounded-md p-2 w-full shadow-sm ml-4">
                  <h4 className={`text-[14px] font-medium ${textColor}`}>{item.title}</h4>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UpcomingTask;
