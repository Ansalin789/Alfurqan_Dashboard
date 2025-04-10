"use client";

import React, { useState } from "react";
import BaseLayout4 from "@/components/BaseLayout4";
import { BsCalendar4Event, BsClockHistory } from "react-icons/bs";
import { MdOutlineCurrencyExchange, MdOutlineCancel } from "react-icons/md";
import { IoSunnyOutline } from "react-icons/io5";
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import { format } from 'date-fns/format'
import { parse } from 'date-fns/parse'
import { startOfWeek } from 'date-fns/startOfWeek'
import { getDay } from 'date-fns/getDay'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { FaUserGraduate } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";





const locales = {
  'en-US': require('date-fns/locale/en-US'),
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const Teacher = () => {
  const [activeTab, setActiveTab] = useState("Studentslist");
  const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const tabs = ["Studentslist", "ScheduledClass", "Earnings", "Payments", "Wages", "WorkingHours"];
  const events = [
    {
      title: 'Evaluation Class (20)',
      start: new Date(2024, 0, 2),
      end: new Date(2024, 0, 2),
    },
    {
      title: 'To-Do Task (01)',
      start: new Date(2024, 0, 2),
      end: new Date(2024, 0, 2),
    },
    {
      title: 'Meeting (01)',
      start: new Date(2024, 0, 17),
      end: new Date(2024, 0, 17),
    },
  ]

  const statusStyle = {
    Completed: 'bg-[#002F56] text-white',
    Cancelled: 'bg-gray-300 text-gray-700',
    Rescheduled: 'bg-yellow-300 text-black',
  };


  const scheduledclass = [
    {
      studentName: 'Robert James',
      studentId: '#0938367',
      course: 'Arabic',
      courseType: 'Trial Class',
      courseDuration: '30 Minutes',
      start: new Date(2022, 0, 2, 9, 0),
      status: 'Completed',
    },
    {
      studentName: 'Stefan Salvatore',
      studentId: '#0938367',
      course: 'Quran',
      courseType: 'Regular Class',
      courseDuration: '60 Minutes',
      start: new Date(2022, 0, 2, 9, 30),
      status: 'Cancelled',
    },
    {
      studentName: 'Gio Rose',
      studentId: '#0938367',
      course: 'Islamic Studies',
      courseType: 'Group Class',
      courseDuration: '45 Minutes',
      start: new Date(2022, 0, 2, 8, 30),
      status: 'Completed',
    },
    {
      studentName: 'Stefan Salvatore',
      studentId: '#0938367',
      course: 'Arabic',
      courseType: 'Regular Class',
      courseDuration: '45 Minutes',
      start: new Date(2022, 0, 2, 9, 30),
      status: 'Rescheduled',
    },
  ]


  const CustomToolbar = (toolbar: any) => (
    <div className="flex justify-center items-center py-2 px-4">
      {/* <div className="space-x-4">
        <button onClick={() => toolbar.onView('month')} className="text-sm px-3 py-1 rounded bg-blue-500 text-white">Month</button>
        <button onClick={() => toolbar.onView('agenda')} className="text-sm px-3 py-1 rounded bg-blue-500 text-white">List</button>
      </div> */}
      <h2 className="text-xl font-semibold text-center">{toolbar.label}</h2>
      {/* <div className="space-x-2">
        <button onClick={() => toolbar.onNavigate('PREV')} className="text-sm">Prev</button>
        <button onClick={() => toolbar.onNavigate('TODAY')} className="text-sm">Today</button>
        <button onClick={() => toolbar.onNavigate('NEXT')} className="text-sm">Next</button>
      </div> */}
    </div>
  )


  return (
    <BaseLayout4>
      <div className="p-4 min-h-screen w-full">
        <h2 className="font-semibold pb-2">Teachers</h2>

        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3 bg-white p-4 rounded-xl shadow flex justify-between flex-row">
            <div className="flex flex-col items-center md:w-1/3 text-center">
              <div className="border-r-2 p-6 -ml-8">
                <div className="w-10 h-10 rounded-full overflow-hidden ml-8">
                  <img
                    src="/assets/images/Avatar.png" // Replace with your actual image path or use a placeholder
                    alt="Avatar"
                    width={96}
                    height={96}
                  />
                </div>
                <div className="-ml-6">
                  <h2 className="text-xs font-medium mt-4">Abdullah Sulaiman</h2>
                  <p className="text-gray-500 text-[11px]">Mufti & imam</p>
                  <div className="mt-4">
                    <div className=" h-1 bg-[#455E8F] rounded-full w-[150px]">
                      <div className="h-1 bg-[#8CB2FF] rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <div className="text-[10px] text-gray-500 mb-1 mt-2">Course completion : 75%</div>

                  </div>
                </div>

              </div>
            </div>
            <div className="flex-1 gap-y-2 gap-x-6 text-sm">
              <h2 className="text-xs py-4 font-medium">Contact & Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3">
                <div className="text-[12px]">
                  <p className="text-gray-500">Email</p>
                  <p className="text-[10px] text-gray-400">asul403@gmail.com</p>
                </div>
                <div className="text-[12px]">
                  <p className="text-gray-500">Phone</p>
                  <p className="text-[10px] text-gray-400">+880 1234 567891</p>
                </div>
                <div className="text-[12px]">
                  <p className="text-gray-500">Gender</p>
                  <p className="text-[10px] text-gray-400">Male</p>
                </div>
                <div className="text-[12px]">
                  <p className="text-gray-500">Course</p>
                  <p className="text-[10px] text-gray-400">Islamic History</p>
                </div>
                <div className="text-[12px]">
                  <p className="text-gray-500">Ijaz</p>
                  <p className="text-[10px] text-gray-400">Yes</p>
                </div>
                <div className="text-[12px]">
                  <p className="text-gray-500">Specialization</p>
                  <p className="text-[10px] text-gray-400">Aqeeda & Fiqh</p>
                </div>
                <div className="text-[12px]">
                  <p className="text-gray-500">Country</p>
                  <p className="text-[10px] text-gray-400">UAE</p>
                </div>
                <div className="text-[12px]">
                  <p className="text-gray-500">Nationality</p>
                  <p className="text-[10px] text-gray-400">Egyptian</p>
                </div>
                <div className="text-[12px]">
                  <p className="text-gray-500">Employment</p>
                  <p className="text-[10px] text-gray-400">Full-time</p>
                </div>
              </div>

            </div>
          </div>
          <div className="col-span-2 bg-white p-4 rounded-xl shadow">
            <div className=" text-xs w-full">
              <div className="max-w-md mx-auto bg-white rounded-full p-2">
                {/* Dropdown */}
                <div className="flex justify-start mb-6">
                  <select className="bg-[#0F2C59] text-white w-[120px] text-center text-[11px] px-2 py-2 rounded-lg focus:outline-none">
                    <option>Quran</option>
                    <option className="hover:bg-[#0f2c59]">Tajweed</option>
                    <option>Islamic Studies</option>
                  </select>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-y-6 text-center text-sm">
                  <div>
                    <p className="text-xl font-normal text-[#012A4A]">30</p>
                    <p className="text-gray-500 text-xs">Students</p>
                  </div>
                  <div>
                    <p className="text-xl font-normal text-[#15A033]">20</p>
                    <p className="text-gray-500 text-xs">Total classes</p>
                  </div>
                  <div>
                    <p className="text-xl font-normal text-[#38A0FF]">$500</p>
                    <p className="text-gray-500 text-xs">Total earned</p>
                  </div>
                  <div>
                    <p className="text-xl font-normal text-[#FF4D4D]">3</p>
                    <p className="text-gray-500 text-xs">Absent</p>
                  </div>
                  <div>
                    <p className="text-xl font-normal text-[#6C2BD9]">5</p>
                    <p className="text-gray-500 text-xs">Days on leave</p>
                  </div>
                  <div>
                    <p className="text-xl font-normal text-[#FF922E]">2</p>
                    <p className="text-gray-500 text-xs">Rescheduled</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-4 bg-white p-4 rounded-xl shadow h-min">
          {/* Tabs */}
          <div className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-3 py-[7px] text-xs font-medium rounded-lg focus:outline-none transition-all duration-200 ${activeTab === tab
                  ? "bg-[#102645] text-white shadow"
                  : "text-black"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-4">
            {activeTab === "Studentslist" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-[#000] shadow overflow-hidden">
                  <h2 className="mt-2 ml-4 font-semibold text-[#333B4C] text-[15px]">Total Students</h2>

                  <div className="overflow-x-auto max-h-[254px] overflow-y-auto custom-scrollbar scrollbar-none">
                    <table className="w-full min-w-[900px] text-sm text-left">
                      <thead className="text-gray-600 border-b border-[#D5D5D5] sticky top-0 bg-white z-10 text-xs font-medium">
                        <tr>
                          <th className="p-4 font-semibold text-[12px] text-center">Student ID</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Student's name</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Country</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Subject</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Duration</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Classes</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs text-[#1D2939]">
                        {[
                          {
                            id: "11/11/2022",
                            name: "$500",
                            country: "Monthly Salary",
                            subject: "Monthly Salary",
                            duration: "Monthly Salary",
                            classes: "Monthly Salary",
                          },
                          {
                            id: "11/11/2022",
                            name: "$500",
                            country: "Monthly Salary",
                            subject: "Monthly Salary",
                            duration: "Monthly Salary",
                            classes: "Monthly Salary",
                          },
                          {
                            id: "11/11/2022",
                            name: "$500",
                            country: "Monthly Salary",
                            subject: "Monthly Salary",
                            duration: "Monthly Salary",
                            classes: "Monthly Salary",
                          },
                          {
                            id: "11/11/2022",
                            name: "$500",
                            country: "Monthly Salary",
                            subject: "Monthly Salary",
                            duration: "Monthly Salary",
                            classes: "Monthly Salary",
                          },
                          {
                            id: "11/11/2022",
                            name: "$500",
                            country: "Monthly Salary",
                            subject: "Monthly Salary",
                            duration: "Monthly Salary",
                            classes: "Monthly Salary",
                          },
                          {
                            id: "11/11/2022",
                            name: "$500",
                            country: "Monthly Salary",
                            subject: "Monthly Salary",
                            duration: "Monthly Salary",
                            classes: "Monthly Salary",
                          },
                          {
                            id: "11/11/2022",
                            name: "$500",
                            country: "Monthly Salary",
                            subject: "Monthly Salary",
                            duration: "Monthly Salary",
                            classes: "Monthly Salary",
                          },
                        ].map((item, index) => (
                          <tr
                            key={index}
                            className={`border-t border-gray-100 text-center ${index % 2 === 0 ? 'bg-[#faf9f9]' : 'bg-[#ebebeb]'}`}
                          >
                            <td className="p-3">{item.id}</td>
                            <td className="p-3">{item.name}</td>
                            <td className="p-3">{item.country}</td>
                            <td className="p-3">{item.subject}</td>
                            <td className="p-3">{item.duration}</td>
                            <td className="p-3">{item.classes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "ScheduledClass" && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-0">
                    <div className="space-x-4">
                      <button
                        className={`font-medium text-[14px] ${view === 'month' ? 'text-black' : 'text-gray-400'}`}
                        onClick={() => setView('month')}
                      >
                        Calendar View
                      </button>
                      <button
                        className={`font-medium text-[14px] ${view === 'agenda' ? 'text-black' : 'text-gray-400'}`}
                        onClick={() => setView('agenda')}
                      >
                        List View
                      </button>
                    </div>
                    <div className="space-x-2">
                      <button className="bg-[#012A4A] text-white text-[11px] px-4 py-1 rounded">+ Add Meeting</button>
                      <button className="bg-[#012A4A] text-white text-[11px] px-4 py-1 rounded">+ Add ToDoList</button>
                      <button className="bg-[#012A4A] text-white text-[11px] px-4 py-1 rounded">+ Add Schedule</button>
                    </div>
                  </div>
                  <div className="overflow-x-auto max-h-[213px] overflow-y-auto custom-scrollbar scrollbar-none">
                    {view === 'month' ? (
                      <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 600, width: '100%' }}
                        view={view}
                        onView={(newView) => setView(newView as 'month' | 'week' | 'day' | 'agenda')}
                        onNavigate={(date) => console.log('Navigated to:', date)}
                        selectable
                        popup
                        components={{ toolbar: CustomToolbar }}
                        eventPropGetter={(event) => ({
                          style: {
                            backgroundColor: event.title.includes("Meeting") ? "#fcd4d4" : "#e8fcd8",
                            color: "#000",
                            fontSize: "10px",
                            padding: "2px 4px",
                          },
                        })}
                      />
                    ) : (
                      <div className="space-y-6 mt-2">
                        <div className="rounded-xl border border-[#000]">
                          <h2 className="mt-2 ml-4 font-semibold text-[#333B4C] text-[15px]">Total Students</h2>

                          <div className="overflow-x-auto max-h-[170px] overflow-y-scroll  scrollbar-none">
                            <table className="w-full min-w-[900px] text-sm text-left">
                              <thead className="text-gray-600 border-b border-[#D5D5D5] sticky top-0 bg-white z-10 text-xs font-medium">
                                <tr>
                                <th className="p-4 font-semibold text-[12px] text-center">Student name</th>
                                  <th className="p-4 font-semibold text-[12px] text-center">Student ID</th>
                                  <th className="p-4 font-semibold text-[12px] text-center">Courses</th>
                                  <th className="p-4 font-semibold text-[12px] text-center">Course Type</th>
                                  <th className="p-4 font-semibold text-[12px] text-center">Course Duration</th>
                                  <th className="p-4 font-semibold text-[12px] text-center">Class - Date & Time</th>
                                  <th className="p-4 font-semibold text-[12px] text-center">Status</th>
                                </tr>
                              </thead>
                              <tbody className="text-xs text-[#1D2939]">
                                {[
                                  { 
                                    name: "Ansalin",
                                    id: "#17655hhjk",
                                    course: "Monthly Salary",
                                    coursetype: "Monthly Salary",
                                    courseduration: "Monthly Salary",
                                    classdatetime: "Monthly Salary",
                                    status: "completed",
                                  },
                                  { 
                                    name: "Ansalin",
                                    id: "#17655hhjk",
                                    course: "Monthly Salary",
                                    coursetype: "Monthly Salary",
                                    courseduration: "Monthly Salary",
                                    classdatetime: "Monthly Salary",
                                    status: "pending",
                                  },
                                  { 
                                    name: "Ansalin",
                                    id: "#17655hhjk",
                                    course: "Monthly Salary",
                                    coursetype: "Monthly Salary",
                                    courseduration: "Monthly Salary",
                                    classdatetime: "Monthly Salary",
                                    status: "completed",
                                  },
                                  { 
                                    name: "Ansalin",
                                    id: "#17655hhjk",
                                    course: "Monthly Salary",
                                    coursetype: "Monthly Salary",
                                    courseduration: "Monthly Salary",
                                    classdatetime: "Monthly Salary",
                                    status: "pending",
                                  },
                                  { 
                                    name: "Ansalin",
                                    id: "#17655hhjk",
                                    course: "Monthly Salary",
                                    coursetype: "Monthly Salary",
                                    courseduration: "Monthly Salary",
                                    classdatetime: "Monthly Salary",
                                    status: "completed",
                                  },
                                  { 
                                    name: "Ansalin",
                                    id: "#17655hhjk",
                                    course: "Monthly Salary",
                                    coursetype: "Monthly Salary",
                                    courseduration: "Monthly Salary",
                                    classdatetime: "Monthly Salary",
                                    status: "completed",
                                  },
                                  { 
                                    name: "Ansalin",
                                    id: "#17655hhjk",
                                    course: "Monthly Salary",
                                    coursetype: "Monthly Salary",
                                    courseduration: "Monthly Salary",
                                    classdatetime: "Monthly Salary",
                                    status: "completed",
                                  },
                                ].map((item, index) => (
                                  <tr
                                    key={index}
                                    className={`border-t border-gray-100 text-center ${index % 2 === 0 ? 'bg-[#faf9f9]' : 'bg-[#ebebeb]'}`}
                                  >
                                    <td className="p-3">{item.name}</td>
                                    <td className="p-3">{item.id}</td>
                                    <td className="p-3">{item.course}</td>
                                    <td className="p-3">{item.coursetype}</td>
                                    <td className="p-3">{item.courseduration}</td>
                                    <td className="p-3">{item.classdatetime}</td>
                                    <td className="p-3">{item.status}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {activeTab === "Earnings" && (
              <div className="space-y-6">
                {/* Top Cards */}
                <div className="flex flex-wrap gap-4">
                  <div className="bg-[#012A4A] text-white rounded-xl p-4 flex items-center justify-between w-56 shadow-md">
                    <div>
                      <p className="text-xs">Total Classes</p>
                      <h2 className="text-lg font-bold mt-1">100</h2>
                    </div>
                    <div className="bg-[#003E6E] p-2 rounded-lg text-sm">
                      <FaUserGraduate className="text-[#ffffffbd]" />
                    </div>
                  </div>
                  <div className="bg-[#2D49AD] text-white rounded-xl p-4 flex items-center justify-between w-56 shadow-md">
                    <div>
                      <p className="text-xs">Total Hours</p>
                      <h2 className="text-lg font-bold mt-1">130</h2>
                    </div>
                    <div className="bg-[#8280ffc0] p-2 rounded-lg text-sm">
                      <BsClockHistory className="text-[#15255f]" />
                    </div>
                  </div>
                  <div className="bg-[#667085] text-white rounded-xl p-4 flex items-center justify-between w-56 shadow-md">
                    <div>
                      <p className="text-xs">Total Earnings</p>
                      <h2 className="text-lg font-bold mt-1">$800</h2>
                    </div>
                    <div className="bg-[#979797] p-2 rounded-lg text-sm">
                      <MdOutlineCurrencyExchange className="text-[#4F5154]" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-xl border border-[#000] shadow overflow-hidden">
                    <div className="overflow-x-auto max-h-[181px] overflow-y-auto custom-scrollbar scrollbar-none">
                      <table className="w-full min-w-[900px] text-sm text-left">
                        <thead className="text-gray-600 border-b border-[#D5D5D5] sticky top-0 bg-white z-10 text-xs font-medium">
                          <tr>
                            <th className="p-4 font-semibold text-[12px] text-center">Month</th>
                            <th className="p-4 font-semibold text-[12px] text-center">Total Classes</th>
                            <th className="p-4 font-semibold text-[12px] text-center">Total Hours</th>
                            <th className="p-4 font-semibold text-[12px] text-center">Total Earnings</th>
                            <th className="p-4 font-semibold text-[12px] text-center">View</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs text-[#1D2939]">
                          {[
                            {
                              month: "11/11/2022",
                              class: "$500",
                              hours: "Monthly Salary",
                              earnings: "Monthly Salary",
                              view: <FaRegEye />,
                            },
                            {
                              month: "11/11/2022",
                              class: "$500",
                              hours: "Monthly Salary",
                              earnings: "Monthly Salary",
                              view: <FaRegEye />,
                            },
                            {
                              month: "11/11/2022",
                              class: "$500",
                              hours: "Monthly Salary",
                              earnings: "Monthly Salary",
                              view: <FaRegEye />,
                            },
                            {
                              month: "11/11/2022",
                              class: "$500",
                              hours: "Monthly Salary",
                              earnings: "Monthly Salary",
                              view: <FaRegEye />,
                            },
                            {
                              month: "11/11/2022",
                              class: "$500",
                              hours: "Monthly Salary",
                              earnings: "Monthly Salary",
                              view: <FaRegEye />,
                            },
                            {
                              month: "11/11/2022",
                              class: "$500",
                              hours: "Monthly Salary",
                              earnings: "Monthly Salary",
                              view: <FaRegEye />,
                            },
                            {
                              month: "11/11/2022",
                              class: "$500",
                              hours: "Monthly Salary",
                              earnings: "Monthly Salary",
                              view: <FaRegEye />,
                            },
                          ].map((item, index) => (
                            <tr
                              key={index}
                              className={`border-t border-gray-100 text-center ${index % 2 === 0 ? 'bg-[#faf9f9]' : 'bg-[#ebebeb]'}`}
                            >
                              <td className="p-3">{item.month}</td>
                              <td className="p-3">{item.class}</td>
                              <td className="p-3">{item.hours}</td>
                              <td className="p-3">{item.earnings}</td>
                              <td className="p-3">{item.view}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Payments" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-[#000] shadow overflow-hidden">
                  <div className="overflow-x-auto max-h-[285px] overflow-y-auto custom-scrollbar scrollbar-none">
                    <table className="w-full min-w-[900px] text-sm text-left">
                      <thead className="text-gray-600 border-b border-[#D5D5D5] sticky top-0 bg-white z-10 text-xs font-medium">
                        <tr>
                          <th className="p-4 font-semibold text-[12px] text-center">Payment Date</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Amount</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Description</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Payment Method</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Status</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Comments for Reference</th>
                          <th className="p-4 font-semibold text-[12px] text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="text-xs text-[#1D2939]">
                        {[
                          {
                            date: "11/11/2022",
                            amount: "$500",
                            description: "Monthly Salary",
                            method: "PayPal",
                            status: "Paid",
                          },
                          {
                            date: "22/10/2022",
                            amount: "$500",
                            description: "Bonus",
                            method: "PayPal",
                            status: "Paid",
                          },
                          {
                            date: "22/05/2022",
                            amount: "$500",
                            description: "Monthly Salary",
                            method: "PayPal",
                            status: "Pending",
                          },
                          {
                            date: "14/07/2020",
                            amount: "$500",
                            description: "Monthly Salary",
                            method: "Stripe",
                            status: "Paid",
                          },
                          {
                            date: "12/04/2021",
                            amount: "$500",
                            description: "Monthly Salary",
                            method: "Bank Transfer",
                            status: "Pending",
                          },
                          {
                            date: "02/02/2022",
                            amount: "$500",
                            description: "Bonus",
                            method: "Bank Transfer",
                            status: "Paid",
                          },
                          {
                            date: "02/02/2022",
                            amount: "$500",
                            description: "Bonus",
                            method: "Bank Transfer",
                            status: "Paid",
                          },
                        ].map((item, index) => (
                          <tr
                            key={index}
                            className={`border-t border-gray-100 text-center ${index % 2 === 0 ? 'bg-[#faf9f9]' : 'bg-[#ebebeb]'}`}
                          >
                            <td className="p-3">{item.date}</td>
                            <td className="p-3">{item.amount}</td>
                            <td className="p-3">{item.description}</td>
                            <td className="p-3">{item.method}</td>
                            <td className="p-3">
                              {item.status === "Paid" ? (
                                <span className="inline-flex items-center justify-center  gap-1">
                                  <span className="text-lg"><IoIosCheckmarkCircleOutline className="text-green-600" />
                                  </span> Paid
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center  gap-1">
                                  <span className="text-lg"><MdOutlineCancel className="text-red-600" />
                                  </span> Pending
                                </span>
                              )}
                            </td>
                            <td className="p-3"></td>
                            <td className="p-3 text-center">
                              <button className="text-gray-600 hover:text-blue-500 text-lg">
                                ⬇️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Wages" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-[#000] shadow overflow-hidden">
                  <div className="overflow-x-auto max-h-[285px] overflow-y-auto custom-scrollbar scrollbar-none">
                    <table className="w-full min-w-[900px] text-sm text-left">
                      <thead className="text-gray-600 border-b border-[#D5D5D5] sticky top-0 bg-white z-10 text-xs font-medium">
                        <tr>
                          <th className="p-4 font-semibold text-[12px] text-center">Class Type</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Rate</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Currency</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs text-[#1D2939]">
                        {[
                          {
                            type: "11/11/2022",
                            rate: "$500",
                            currency: "Monthly Salary",
                            duration: "Monthly Salary",
                          },
                          {
                            type: "11/11/2022",
                            rate: "$500",
                            currency: "Monthly Salary",
                            duration: "Monthly Salary",
                          },
                          {
                            type: "11/11/2022",
                            rate: "$500",
                            currency: "Monthly Salary",
                            duration: "Monthly Salary",
                          },
                          {
                            type: "11/11/2022",
                            rate: "$500",
                            currency: "Monthly Salary",
                            duration: "Monthly Salary",
                          },
                          {
                            type: "11/11/2022",
                            rate: "$500",
                            currency: "Monthly Salary",
                            duration: "Monthly Salary",
                          },
                          {
                            type: "11/11/2022",
                            rate: "$500",
                            currency: "Monthly Salary",
                            duration: "Monthly Salary",
                          },
                          {
                            type: "11/11/2022",
                            rate: "$500",
                            currency: "Monthly Salary",
                            duration: "Monthly Salary",
                          },
                        ].map((item, index) => (
                          <tr
                            key={index}
                            className={`border-t border-gray-100 text-center ${index % 2 === 0 ? 'bg-[#faf9f9]' : 'bg-[#ebebeb]'}`}
                          >
                            <td className="p-3">{item.type}</td>
                            <td className="p-3">{item.rate}</td>
                            <td className="p-3">{item.currency}</td>
                            <td className="p-3">{item.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "WorkingHours" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-[#000] shadow overflow-hidden">
                  <div className="overflow-x-auto max-h-[285px] overflow-y-auto custom-scrollbar scrollbar-none">
                    <table className="w-full min-w-[900px] text-sm text-left">
                      <thead className="text-gray-600 border-b border-[#D5D5D5] sticky top-0 bg-white z-10 text-xs font-medium">
                        <tr>
                          <th className="p-4 font-semibold text-[12px] text-center">Day</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Working Hours</th>
                          <th className="p-4 font-semibold text-[12px] text-center">GMT</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs text-[#1D2939]">
                        {[
                          {
                            day: "11/11/2022",
                            whours: "$500",
                            GMT: "Monthly Salary",
                          },
                          {
                            day: "11/11/2022",
                            whours: "$500",
                            GMT: "Monthly Salary",
                          },
                          {
                            day: "11/11/2022",
                            whours: "$500",
                            GMT: "Monthly Salary",
                          },
                          {
                            day: "11/11/2022",
                            whours: "$500",
                            GMT: "Monthly Salary",
                          },
                          {
                            day: "11/11/2022",
                            whours: "$500",
                            GMT: "Monthly Salary",
                          },
                          {
                            day: "11/11/2022",
                            whours: "$500",
                            GMT: "Monthly Salary",
                          },
                          {
                            day: "11/11/2022",
                            whours: "$500",
                            GMT: "Monthly Salary",
                          },
                        ].map((item, index) => (
                          <tr
                            key={index}
                            className={`border-t border-gray-100 text-center ${index % 2 === 0 ? 'bg-[#faf9f9]' : 'bg-[#ebebeb]'}`}
                          >
                            <td className="p-3">{item.day}</td>
                            <td className="p-3">{item.whours}</td>
                            <td className="p-3">{item.GMT}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </BaseLayout4>
  );
};

export default Teacher;
