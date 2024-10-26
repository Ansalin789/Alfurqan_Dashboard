"use client";

import BaseLayout2 from "@/components/BaseLayout2";
import "react-calendar/dist/Calendar.css";
import React from "react";

import { FaUser } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Student() {
  const ClassCard = ({}) => (
    <div className="bg-blue-500 p-6 rounded-lg shadow text-white mb-4">
      {classes.map((classInfo, index) => (
        <div key={index} className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="mr-8 flex gap-28">
              <h3 className="text-lg font-medium">{classInfo.title}</h3>
              <div className="flex items-center">
                <FaUser className="mr-2 w-4 h-4" />
                <p>{classInfo.name}</p>
              </div>
            </div>
            <div className="flex items-center ml-40">
              <FaCalendarAlt className="mr-2 w-4 h-4" />
              <p>{classInfo.date}</p>
            </div>
          </div>
          <div className="flex items-center font-bold bg-white text-[#0e3c50] p-2 rounded-lg shadow">
            <FaClock className="mr-2" />
            <p>{classInfo.time}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const classes = [
    {
      count : 1,
      title: "Tajweed MasterClass",
      name: "Abineddshr",
      date: "06 May 2024",
      time: "9:00 AM - 10:00 AM",
    },
    { 
      count : 2,
      title: "Tajweed MasterClass",
      name: "sagarps",
      date: "08 May 2024",
      time: "10:00 AM - 11:00 AM",
    },
  ];
  return (
    <>
      <BaseLayout2>
        <div className="flex flex-col lg:flex-row p-4 w-full">
          <div className="flex-1 overflow-y-scroll scrollbar-hide h-[110vh] pr-4">
            <header className="flex justify-between mb-8">
              <div className="flex space-x-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Search here..."
                    className="p-2 w-80 rounded-md border border-gray-300"
                  />
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">
                      Refer a Friend
                    </button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded">
                      Upgrade Plan
                    </button>
                  </div>
                </div>
              </div>
            </header>

            <main className="grid grid-cols-12 gap-4">
              <h1 className="text-2xl font-bold col-span-12">Your Next Classes</h1>
              <div className="col-span-12 bg-red-500 p-4 rounded-lg shadow flex items-center justify-between text-white">
                <div className="items-center space-x-4">
                  <h3 className="text-lg font-medium p-2">
                  Tajweed Masterclass Session - 12
                  </h3>
                  <div className="flex items-center space-x-8">
                    <div className="flex items-center space-x-2">
                      {/* User Icon */}
                      <FaUserAlt className="w-4 h-4" />
                      <p className="text-sm">prof smith</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Clock Icon */}
                      <AiOutlineClockCircle className="w-4 h-4" />
                      <p className="text-sm">10:00 AM</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <p className="text-lg font-medium text-[#fff0f0]">
                    Starts in
                  </p>
                  {/* Timer box styling */}
                  <div className="bg-white p-3 rounded-xl shadow-lg flex items-center justify-center space-x-4">
                    {/* Hours */}
                    <div className="bg-[#0e3c50] text-white text-center px-2 py-2 rounded-md">
                      <p className="text-base font-bold">20</p>
                      <p className="text-[10px] tracking-widest">HOURS</p>
                    </div>
                    {/* Separator */}
                    <span className="text-2xl text-[#0e3c50]">:</span>
                    {/* Minutes */}
                    <div className="bg-[#0e3c50] text-white text-center px-2 py-2 rounded-md">
                      <p className="text-base font-bold">12</p>
                      <p className="text-[10px] tracking-widest">MINUTES</p>
                    </div>
                    {/* Separator */}
                    <span className="text-lg text-[#0e3c50]">:</span>
                    {/* Seconds */}
                    <div className="bg-[#0e3c50] text-white text-center px-2 py-2 rounded-md">
                      <p className="text-base font-bold">19</p>
                      <p className="text-[10px]">SECONDS</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12">
                <ClassCard classes={classes} />
              </div>

              <div className="col-span-12 bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium">Trail Request List</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-bold">Progress Learning</h3>
                    <div className="mt-4">
                      <div className="flex justify-between">
                        <p>Tajweed Masterclass</p>
                        <select className="border rounded px-2 py-1">
                          <option>Daily</option>
                          <option>Weekly</option>
                        </select>
                      </div>
                      {/* Placeholder for Progress Chart */}
                      <div className="mt-4 bg-gray-200 h-32 rounded"></div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-bold">Statistic</h3>
                    {/* Placeholder for Statistic Chart */}
                    <div className="mt-4 bg-gray-200 h-32 rounded"></div>
                  </div>
                </div>
              </div>
            </main>
          </div>
          {/* calender sidebar */}
          <div className="mt-6 lg:mt-0 lg:mb-10 lg:pb-20  bg-[#1c3557] p-6 rounded-[20px] h-[600px]">
            <div className="col-span-4 bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium">Sidesh</h3>
            </div>
            <div className="mt-4 bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Upcoming Classes</h3>
                <button className="text-gray-500">•••</button>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-100 p-2 rounded">Session 4</div>
                <div className="bg-gray-200 p-2 rounded">Session 5</div>
                <div className="bg-gray-300 p-2 rounded">Session 6</div>
                <div className="bg-gray-400 p-2 rounded">Session 7</div>
              </div>
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <p className="text-sm font-semibold">Your Total 10hr</p>
                <p className="text-center text-lg">Left 0hrs</p>
              </div>
              <div className="mt-4 p-4 bg-gray-200 rounded">
                <p className="text-sm font-semibold">Pending Fee</p>
                <p className="text-center text-lg">Pay Now</p>
              </div>
            </div>
          </div>
        </div>
      </BaseLayout2>
    </>
  );
}
