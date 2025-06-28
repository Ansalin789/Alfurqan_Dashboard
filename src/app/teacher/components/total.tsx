'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';

interface ApiResponse {
  totalclasses?: number;
  totalClasses?: number;
  totalstudents?: number;
  totalStudents?: number;
  totalhours?: number;
  totalHours?: number;
  totalearnings?: number;
  totalEarnings?: number;
}

const safeNumber = (value: any): number =>
  typeof value === 'number' && !isNaN(value) ? value : 0;

const formatValue = (value: number, isCurrency = false) =>
  isCurrency ? `$ ${value > 0 ? value : '0'}` : value > 0 ? value : '0';

const getIconContainer = (src: string, alt: string, bg: string) => (
  <div className={`${bg} p-3 rounded-full flex items-center justify-center`}>
    <div className="rounded-full">
      <Image src={src} alt={alt} width={40} height={40} />
    </div>
  </div>
);

const Total = () => {
  const [data, setData] = useState({
    totalclasses: 0,
    totalstudents: 0,
    totalhours: 0,
    totalearnings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const teacherId = localStorage.getItem('TeacherPortalId');
      const token = localStorage.getItem('TeacherAuthToken');

      if (!teacherId || !token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<ApiResponse>(
          'https://api.blackstoneinfomaticstech.com/dashboard/teacher/counts',
          {
            params: { teacherId },
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const res = response.data;

        setData({
          totalclasses: safeNumber(res.totalclasses ?? res.totalClasses),
          totalstudents: safeNumber(res.totalstudents ?? res.totalStudents),
          totalhours: safeNumber(res.totalhours ?? res.totalHours),
          totalearnings: safeNumber(res.totalearnings ?? res.totalEarnings),
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cards = [
    {
      title: 'Total Classes',
      count: formatValue(data.totalclasses),
      icon: getIconContainer(
        '/assets/images/tc1.svg',
        'Total Classes',
        'bg-[#e3efff] dark:bg-[#3e4e50]'
      ),
    },
    {
      title: 'Total Students',
      count: formatValue(data.totalstudents),
      icon: getIconContainer(
        '/assets/images/tc2.svg',
        'Total Students',
        'bg-[#ede5ff] dark:bg-[#3f3e50]'
      ),
    },
    {
      title: 'Total Hours',
      count: formatValue(data.totalhours),
      icon: getIconContainer(
        '/assets/images/tc3.svg',
        'Total Hours',
        'bg-[#ffe9e9] dark:bg-[#503e3e]'
      ),
    },
    {
      title: 'Total Earnings',
      count: formatValue(data.totalearnings, true),
      icon: getIconContainer(
        '/assets/images/tc4.svg',
        'Total Earnings',
        'bg-[#fff5d4] dark:bg-[#504d3e]'
      ),
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-[110px] bg-gray-200 dark:bg-[#404040] rounded-2xl animate-pulse"
          />
        ))}
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
              {card.title.split(' ').map((word, idx, arr) => (
                <React.Fragment key={idx}>
                  {word}
                  {idx < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
            <p className="text-[28px] font-semibold text-black dark:text-white">
              {card.count}
            </p>
          </div>
          {card.icon}
        </div>
      ))}
    </div>
  );
};

export default Total;
