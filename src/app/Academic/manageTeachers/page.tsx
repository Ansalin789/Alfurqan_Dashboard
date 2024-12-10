'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaFilter, FaPlus } from 'react-icons/fa';
import { LiaStarSolid } from "react-icons/lia";
import { HiOutlineDotsVertical } from "react-icons/hi";
import BaseLayout1 from '@/components/BaseLayout1';

interface Teacher {
  userId: string;
  userName: string;
  email: string;
  profileImage?: string | null;
  level: string;
  subject: string;
  rating: number;
}

const ManageTeacher: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('http://localhost:5001/users');
        const data: Teacher[] = await response.json();

        console.log('Fetched teachers:', data);

        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setTeachers(data);
        } else {
          console.error('Data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <BaseLayout1>
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 p-2">
          <div className='flex items-center space-x-2 p-4'>
            <h2 className="text-2xl font-semibold text-[#223857]">Teachers List</h2>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex flex-1 space-x-4 items-center justify-between">
              <div className='flex'>
                <input
                  type="text"
                  placeholder="Search here..."
                  className={`border rounded-lg p-2 mx-4 shadow`}
                />
                <button className="flex items-center bg-white px-4 rounded-lg shadow">
                  <FaFilter className="mr-2 text-[#223857]" /> Filter
                </button>
              </div>
              <div className='flex px-4'>
                <button className={`border p-2 rounded-lg shadow flex items-center mx-4 bg-[#223857] text-white`}>
                  <FaPlus className="mr-2" /> Add new
                </button>
                <select className={`border rounded-lg p-2 shadow `}>
                  <option>Duration: Last month</option>
                  <option>Duration: Last week</option>
                  <option>Duration: Last year</option>
                </select>
              </div>
            </div>
          </div>
          {/* Cards */}
          <div className="grid grid-cols-6 gap-4 p-6">
            {teachers.map((teacher, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-4 w-48">
                <div className="flex justify-between items-center">
                  <Image
                    src={teacher.profileImage || "/assets/images/proff.jpg"}
                    alt="Teacher"
                    className="w-12 h-12 ml-12 mt-4 rounded-full" width={40} height={40}
                  />
                  <button className="text-gray-400">
                    <HiOutlineDotsVertical size={20} className='text-[#717579]'/>
                  </button>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-base font-bold text-[#223857] mb-2">{teacher.userName}</h3>
                  <p className="text-[#717579] text-sm">Level: {teacher.level}</p>
                  <p className="text-[#717579] p-1 text-sm">{teacher.subject}</p>
                  <div className='flex text-center justify-center'>
                    {Array.from({ length: teacher.rating || 0 }).map((_, i) => (
                      <LiaStarSolid key={i} className='text-[#223857]'/>
                    ))}
                  </div>
                  <button className="mt-4 text-[11px] bg-[#223857] text-white px-4 py-1 rounded-lg">
                    View Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseLayout1>
  );
}

export default ManageTeacher;
