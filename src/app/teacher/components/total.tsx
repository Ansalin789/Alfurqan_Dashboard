'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { getSocket } from '@/app/utils/socket';

interface TeacherDashboardStats {
  totalclasses: number;
  totalstudents: number;
  totalhours: number;
  totalearnings: number;
}

const safeNumber = (value: unknown): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

const formatValue = (value: number, isCurrency = false, suffix = ''): string => {
  if (isCurrency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
  return `${value}${suffix}`;
};

const Total = () => {
  const [stats, setStats] = useState<TeacherDashboardStats>({
    totalclasses: 0,
    totalstudents: 0,
    totalhours: 0,
    totalearnings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    const teacherId = localStorage.getItem('TeacherPortalId');
    const token = localStorage.getItem('TeacherAuthToken');

    if (!teacherId || !token) {
      setError('Please login as a teacher first');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get<TeacherDashboardStats>(
        'http://localhost:5001/dashboard/teacher/counts',
        {
          params: { teacher: teacherId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats({
        totalclasses: safeNumber(response.data.totalclasses),
        totalstudents: safeNumber(response.data.totalstudents),
        totalhours: parseFloat(safeNumber(response.data.totalhours).toFixed(1)),
        totalearnings: safeNumber(response.data.totalearnings),
      });
    } catch (err) {
      setError('Failed to load teacher statistics');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, []);

  // 🔁 Real-time socket update
  useEffect(() => {
    const teacherId = localStorage.getItem('TeacherPortalId');
    if (!teacherId) return;

    const socket = getSocket(teacherId);

    const handleLiveStats = (data: TeacherDashboardStats) => {
      setStats({
        totalclasses: safeNumber(data.totalclasses),
        totalstudents: safeNumber(data.totalstudents),
        totalhours: parseFloat(safeNumber(data.totalhours).toFixed(1)),
        totalearnings: safeNumber(data.totalearnings),
      });
    };

    socket.on('teacherDashboardCard', handleLiveStats);

    return () => {
      socket.off('teacherDashboardCard', handleLiveStats);
    };
  }, []);

  const cards = [
    {
      title: 'Total Classes',
      count: formatValue(stats.totalclasses),
      icon: '/assets/images/tc1.svg',
      bg: 'bg-[#e3efff] dark:bg-[#3e4e50]',
    },
    {
      title: 'Total Students',
      count: formatValue(stats.totalstudents),
      icon: '/assets/images/tc2.svg',
      bg: 'bg-[#ede5ff] dark:bg-[#3f3e50]',
    },
    {
      title: 'Total Hours',
      count: formatValue(stats.totalhours, false, ' hrs'),
      icon: '/assets/images/tc3.svg',
      bg: 'bg-[#ffe9e9] dark:bg-[#503e3e]',
    },
    {
      title: 'Total Earnings',
      count: formatValue(stats.totalearnings, true),
      icon: '/assets/images/tc4.svg',
      bg: 'bg-[#fff5d4] dark:bg-[#504d3e]',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[110px] bg-gray-200 dark:bg-[#404040] rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded-lg">
        {error}
        <button
          onClick={fetchData}
          className="ml-4 px-3 py-1 bg-red-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-5 rounded-2xl shadow-sm bg-white dark:bg-[#343434] dark:text-[#fff]"
        >
          <div>
            <p className="text-[14px] font-medium text-black dark:text-white">
              {card.title}
            </p>
            <p className="text-[28px] font-semibold text-black dark:text-white">
              {card.count}
            </p>
          </div>
          <div className={`${card.bg} p-3 rounded-full flex items-center justify-center`}>
            <Image
              src={card.icon}
              alt={card.title}
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Total;
