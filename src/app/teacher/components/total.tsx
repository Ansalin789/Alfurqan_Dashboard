'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';

interface ApiResponse {
  totalclasses: number;
  totalstudents: number;
  totalhours: number;
  totalearnings: number;
}

const Total = () => {
  const [data, setData] = useState<ApiResponse>({
    totalclasses: 0,
    totalstudents: 0,
    totalhours: 0,
    totalearnings: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const teacherId = typeof window !== 'undefined' ? localStorage.getItem('TeacherPortalId') : null;
      const token = typeof window !== 'undefined' ? localStorage.getItem('TeacherAuthToken') : null;

      if (!teacherId || !token) return;

      try {
        const response = await axios.get(
          'https://api.blackstoneinfomaticstech.com/dashboard/teacher/counts',
          {
            params: { teacherId },
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const cards = [
    {
      title: 'Total Classes',
      count: data.totalclasses,
      icon: (
        <div className="bg-[#e3efff] dark:bg-[#3e4e50] rounded-full">
          <Image src="/assets/images/totalclass.png" alt="Total Classes" width={40} height={40} />
        </div>
      ),
      bg: 'bg-[#e3efff] dark:bg-[#3e4e50]',
    },
    {
      title: 'Total Students',
      count: data.totalstudents,
      icon: (
        <div className="bg-[#ede5ff] dark:bg-[#3f3e50] rounded-full">
          <Image src="/assets/images/totalstudents.png" alt="Total Students" width={40} height={40} />
        </div>
      ),
      bg: 'bg-[#ede5ff] dark:bg-[#3f3e50]',
    },
    {
      title: 'Total Hours',
      count: data.totalhours,
      icon: (
        <div className="bg-[#ffe9e9] dark:bg-[#503e3e] rounded-full">
          <Image src="/assets/images/totalhours.png" alt="Total Hours" width={40} height={40} />
        </div>
      ),
      bg: 'bg-[#ffe9e9] dark:bg-[#503e3e]',
    },
    {
      title: 'Total Earnings',
      count: `$ ${data.totalearnings}`,
      icon: (
        <div className="bg-[#fff5d4] dark:bg-[#504d3e] rounded-full">
          <Image src="/assets/images/totalearnings.png" alt="Total Earnings" width={40} height={40} />
        </div>
      ),
      bg: 'bg-[#fff5d4] dark:bg-[#504d3e]',
    },
  ];

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
            <p className="text-[28px] font-semibold text-black dark:text-white">{card.count}</p>
          </div>
          <div className={`${card.bg} p-3 rounded-full flex items-center justify-center`}>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Total;
