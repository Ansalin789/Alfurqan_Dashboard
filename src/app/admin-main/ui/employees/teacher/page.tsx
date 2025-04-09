"use client";

import React, { useState } from "react";
import BaseLayout4 from "@/components/BaseLayout4";
import { BsCalendar4Event, BsClockHistory } from "react-icons/bs";
import { MdOutlineCurrencyExchange } from "react-icons/md";
import { IoSunnyOutline } from "react-icons/io5";
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import { format } from 'date-fns/format'
import { parse } from 'date-fns/parse'
import { startOfWeek } from 'date-fns/startOfWeek'
import { getDay } from 'date-fns/getDay'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { FaUserGraduate } from "react-icons/fa6";




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

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === "Studentslist" && (
              <div className="space-y-2">
                <div className="rounded-lg border border-[#D5D5D5] shadow overflow-hidden">
                  <div className="overflow-x-auto max-h-[180px] overflow-y-auto custom-scrollbar">
                    <table className="w-full min-w-[600px] text-sm">
                      <thead className="text-gray-600 border-b border-gray-200">
                        <h2 className="mt-2 ml-4 font-semibold text-[#333B4C] text-[15px]">Total Students</h2>
                        <tr className="text-center">
                          <th className="p-4 font-semibold text-[12px] text-center">Student ID</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Student's name</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Country</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Subject</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Duration</th>
                          <th className="p-4 font-semibold text-[12px] text-center">Classes</th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                  <div className="overflow-y-scroll scrollbar-none max-h-[200px]">
                    <table className="w-full min-w-[600px] text-sm">
                      <tbody className="text-gray-800">
                        {[
                          ["jij2ihjknkjn", "john", "India", "Tajweed", "30mins", "10/20"],
                          ["jij2ihjknkjn", "Pathan jack", "Pakistan", "Tajweed", "60mins", "12/20"],
                          ["jij2ihjknkjn", "sahib hossain", "India", "Tajweed", "30mins", "10/20"],
                          ["jij2ihjknkjn", "john", "India", "Tajweed", "30mins", "10/20"],
                          ["jij2ihjknkjn", "john", "UAE", "Quran", "60mins", "6/20"],
                          ["jij2ihjknkjn", "john", "India", "Tajweed", "30mins", "10/20"],
                          ["jij2ihjknkjn", "john", "India", "Tajweed", "30mins", "10/20"],
                          ["jij2ihjknkjn", "john", "India", "Tajweed", "30mins", "10/20"],
                          ["jij2ihjknkjn", "john", "India", "Tajweed", "30mins", "10/20"],
                        ].map(([studentID, studentname, country, subject, duration, classes], index) => (
                          <tr
                            key={studentID}
                            className={`border-t border-gray-100 text-center ${index % 2 === 0 ? 'bg-[#faf9f9]' : 'bg-[#ebebeb]'}`}
                          >
                            <td className="p-2 text-[11px] text-center">
                              {studentID}
                            </td>
                            <td className="p-2 text-[11px] text-center">
                              {studentname}
                            </td>
                            <td className="p-2 text-[11px] text-center">
                              {country}
                            </td>
                            <td className="p-2 text-[11px] text-center">
                              {subject}
                            </td>
                            <td className="p-2 text-[11px] text-center">
                              {duration}
                            </td>
                            <td className="p-2 text-[11px] text-center">
                              {classes}
                            </td>
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
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-4">
                    <div className="space-x-4">
                      <button
                        className={`font-medium ${view === 'month' ? 'text-black' : 'text-gray-400'}`}
                        onClick={() => setView('month')}
                      >
                        Calendar View
                      </button>
                      <button
                        className={`font-medium ${view === 'agenda' ? 'text-black' : 'text-gray-400'}`}
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

                  {/* Conditional Rendering */}
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
                    <div className="bg-white rounded-xl shadow-md p-4">
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                          <thead className="bg-gray-100 text-gray-700">
                            <tr>
                              <th className="p-4">Student Name</th>
                              <th className="p-4">Student ID</th>
                              <th className="p-4">Course</th>
                              <th className="p-4">Course Type</th>
                              <th className="p-4">Course Duration</th>
                              <th className="p-4">Class - Date & Time</th>
                              <th className="p-4">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scheduledclass.map((event, index) => (
                              <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="p-4">{event.studentName}</td>
                                <td className="p-4 text-blue-600 font-medium">{event.studentId}</td>
                                <td className="p-4">{event.course}</td>
                                <td className="p-4">{event.courseType}</td>
                                <td className="p-4">{event.courseDuration}</td>
                                <td className="p-4">{format(event.start, 'MMMM d, yyyy – hh:mm a')}</td>
                                <td className="p-4">
                                  <span className={`text-xs font-semibold px-3 py-1 rounded-full inline-block ${statusStyle[event.status as keyof typeof statusStyle]}`}>
                                    {event.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Footer Pagination */}
                      <div className="flex items-center justify-between mt-4 px-2">
                        <p className="text-sm text-gray-500">Showing 1–10 of 100 data</p>
                        <div className="flex space-x-1">
                          <button className="w-8 h-8 rounded-full text-gray-400 border border-gray-300 hover:bg-gray-200">&lt;</button>
                          <button className="w-8 h-8 rounded-full bg-gray-200 text-gray-800">1</button>
                          <button className="w-8 h-8 rounded-full bg-blue-900 text-white">2</button>
                          <button className="w-8 h-8 rounded-full text-gray-400 border border-gray-300 hover:bg-gray-200">3</button>
                          <button className="w-8 h-8 rounded-full text-gray-400 border border-gray-300 hover:bg-gray-200">&gt;</button>
                        </div>
                      </div>
                    </div>
                  )}
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
                      <FaUserGraduate  />
                    </div>
                  </div>
                  <div className="bg-[#2D49AD] text-white rounded-xl p-4 flex items-center justify-between w-56 shadow-md">
                    <div>
                      <p className="text-xs">Total Hours</p>
                      <h2 className="text-lg font-bold mt-1">130</h2>
                    </div>
                    <div className="bg-[#8280ffc0] p-2 rounded-lg text-sm">
                      <BsClockHistory />
                    </div>
                  </div>
                  <div className="bg-[#667085] text-white rounded-xl p-4 flex items-center justify-between w-56 shadow-md">
                    <div>
                      <p className="text-xs">Total Earnings</p>
                      <h2 className="text-lg font-bold mt-1">$800</h2>
                    </div>
                    <div className="bg-[#979797] p-2 rounded-lg text-sm">
                      <MdOutlineCurrencyExchange />
                    </div>
                  </div>
                </div>

                {/* Scrollable Table */}
                <div className="rounded-xl border border-[#D5D5D5] shadow overflow-hidden">
                  <div className="overflow-x-auto max-h-[180px] overflow-y-auto custom-scrollbar">
                    <table className="w-full min-w-[600px] text-sm text-left">
                      <thead className="text-gray-600 border-b border-gray-200 ">
                        <tr className="text-center">
                          <th className="p-4 font-semibold">Month</th>
                          <th className="p-4 font-semibold">
                            Total Classes
                          </th>
                          <th className="p-4 font-semibold">Total Hours</th>
                          <th className="p-4 font-semibold">
                            Total Earnings
                          </th>
                          <th className="p-4 font-semibold">
                            View
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-800">
                        {[
                          ["January", "170 Hours", "$1050", "$0"],
                          ["February", "185 Hours", "$170", "$0"],
                          ["March", "178 Hours", "$140", "$0"],
                          ["April", "180 Hours", "$125", "$100"],
                          ["May", "100 Hours", "$190", "$0"],
                          ["June", "180 Hours", "$138", "$100"],
                          ["July", "120 Hours", "$210", "$0"],
                          ["August", "130 Hours", "$260", "$100"],
                          ["September", "100 Hours", "$186", "$100"],
                        ].map(([month,  hours, earnings, deductions], index) => (
                          <tr
                            key={index}
                            className=""
                          >
                            <td className="py-2 text-[12px] text-center">
                              {month}
                            </td>
                            <td className="py-2 text-[12px] text-center">
                              {hours}
                            </td>
                            <td className="py-2 text-[12px] text-center">
                              {earnings}
                            </td>
                            <td className="py-2 text-[12px] text-center">
                              {deductions}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}


            {/* Leave Record Tab */}

            {activeTab === "Payments" && (
              <div className="space-y-6 ">
                {/* Summary Cards */}
                <div className="flex flex-wrap gap-4">
                  <div className="bg-[#11244D] text-white rounded-xl p-4 flex items-center justify-between w-56 shadow-md">
                    <div>
                      <p className="text-xs">Total Applied Leave(Days)</p>
                      <h2 className="text-lg font-bold mt-1">03</h2>
                    </div>
                  </div>
                  <div className="bg-[#4F4CD1] text-white rounded-xl p-4 w-56 shadow-md">
                    <div>
                      <p className="text-xs">Total Approved</p>
                      <h2 className="text-lg font-bold mt-1">02</h2>
                    </div>
                  </div>
                  <div className="bg-[#707791] text-white rounded-xl p-4 w-56 shadow-md">
                    <div>
                      <p className="text-xs">Total Declined</p>
                      <h2 className="text-lg font-bold mt-1">01</h2>
                    </div>
                  </div>
                </div>

                {/* Leave Table */}
                <div className="rounded-xl border border-[#D5D5D5] shadow overflow-hidden">
                  <div className="overflow-x-auto max-h-[180px] overflow-y-auto custom-scrollbar">
                    <table className="w-full min-w-[600px] text-sm text-left">
                      <thead className="text-gray-600 border-b border-gray-200 ">
                        <tr className="text-center">
                          <th className="p-4 font-semibold">Employee ID</th>
                          <th className="p-4 font-semibold">Employee Name</th>
                          <th className="p-4 font-semibold">Designation</th>
                          <th className="p-4 font-semibold">Leave Type</th>
                          <th className="p-4 font-semibold">Date Range</th>
                          <th className="p-4 font-semibold">Reason For Leave</th>
                          <th className="p-4 font-semibold">Status</th>
                          <th className="p-4 font-semibold text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-800">
                        {[
                          {
                            id: "#0983867",
                            name: "Robert james",
                            designation: "Supervisor",
                            type: "Sick Leave",
                            range: "11/02/2024 - 16/02/2024",
                            reason: "Sickness",
                            status: "Approved",
                          },
                          {
                            id: "#0983867",
                            name: "Stefan Salvatore",
                            designation: "Human Resource",
                            type: "Casual Leave",
                            range: "11/02/2024 - 16/02/2024",
                            reason: "Family Function",
                            status: "Approved",
                          },
                          {
                            id: "#0983867",
                            name: "Prasanna Popz",
                            designation: "Teacher",
                            type: "Privilege Leave",
                            range: "11/02/2024 - 16/02/2024",
                            reason: "Vacation",
                            status: "Declined",
                          },
                        ].map((item, index) => (
                          <tr
                            key={item.id}
                            className="border-t border-gray-100 hover:bg-gray-50"
                          >
                            <td className="p-2 text-[12px] text-center">
                              {item.id}
                            </td>
                            <td className="p-2 text-[12px] text-center">
                              {item.name}
                            </td>
                            <td className="p-2 text-[12px] text-center">
                              {item.designation}
                            </td>
                            <td className="p-2 text-[12px] text-center">
                              {item.type}
                            </td>
                            <td className="p-2 text-[12px] text-center">
                              {item.range}
                            </td>
                            <td className="p-2 text-[12px] text-center">
                              {item.reason}
                            </td>
                            <td className="p-2 text-[12px] text-center">
                              <div className="flex items-center gap-2">
                                {item.status === "Approved" ? (
                                  <>
                                    <span className="text-green-600 p-2 text-[12px] text-center">
                                      ✅
                                    </span>
                                    <span className="p-2 text-[12px] text-center">
                                      Approved
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-red-600 p-2 text-[12px] text-center">
                                      ❌
                                    </span>
                                    <span className="p-2 text-[12px] text-center">
                                      Declined
                                    </span>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-center text-lg text-gray-500 cursor-pointer">
                              ...
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}


            {activeTab === "WorkingHours" && (
              <div className="shadow overflow-hidden">
                <div className="overflow-x-auto max-h-[280px] overflow-y-auto custom-scrollbar">
                  <table className="w-full min-w-[600px] text-sm text-left border border-gray-200">
                    <thead className="text-gray-600 border-b border-gray-200">
                      <tr className="text-center">
                        <th className="p-4 font-semibold border-r border-gray-300">
                          <div className="flex items-center justify-center gap-2">
                            <BsCalendar4Event className="text-xl" />
                            <span>Day</span>
                          </div>
                        </th>
                        <th className="p-4 font-semibold border-r border-gray-300">
                          <div className="flex items-center justify-center gap-2">
                            <BsClockHistory className="text-xl" />
                            <span>Working Hours</span>
                          </div>
                        </th>
                        <th className="p-4 font-semibold">
                          <div className="flex items-center justify-center gap-2">
                            <IoSunnyOutline className="text-xl" />
                            <span>GMT</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-800">
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Friday", // duplicate as per image
                        "Sunday",
                      ].map((day, idx) => (
                        <tr
                          key={idx}
                          className="border-t border-gray-100 hover:bg-gray-50 text-center"
                        >
                          <td className="p-3 text-[12px] border-r border-gray-200">
                            {day}
                          </td>
                          <td className="p-3 text-[12px] border-r border-gray-200">
                            9 AM - 2 PM / 4 PM - 7 PM
                          </td>
                          <td className="p-3 text-[12px]">GMT +4</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
