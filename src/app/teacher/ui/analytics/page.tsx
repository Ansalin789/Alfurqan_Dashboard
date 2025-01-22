"use client";
import React, { useState } from 'react';
import { Filter, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import BaseLayout from '@/components/BaseLayout';
interface Student {
  id: string;
  name: string;
  course: string;
  courseType: string;
  joinDate: string;
  level: number;
  status: 'Active' | 'Inactive';
}

interface Class {
  id: string;
  name: string;
  instructor: string;
  schedule: string;
  students: number;
  type: string;
  status: 'Ongoing' | 'Completed';
}

interface Earning {
  id: string;
  studentName: string;
  course: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending';
}

type ViewType = 'students' | 'classes' | 'earnings';

function Analytics() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('students');
  const [filters, setFilters] = useState({
    name: '',
    id: '',
    course: '',
    status: '',
    date: '',
  });

  const studentData = [
    { month: 'Jan', students: 8000 },
    { month: 'Feb', students: 6000 },
    { month: 'Mar', students: 4000 },
    { month: 'Apr', students: 7500 },
    { month: 'May', students: 5000 },
    { month: 'Jun', students: 6500 },
  ];

  const classData = [
    { month: 'Jan', classes: 65 },
    { month: 'Feb', classes: 75 },
    { month: 'Mar', classes: 85 },
    { month: 'Apr', classes: 70 },
    { month: 'May', classes: 80 },
    { month: 'Jun', classes: 100 },
  ];

  const earningsData = [
    { month: 'Jan', earnings: 30000 },
    { month: 'Feb', earnings: 35000 },
    { month: 'Mar', earnings: 32000 },
    { month: 'Apr', earnings: 40000 },
    { month: 'May', earnings: 38000 },
    { month: 'Jun', earnings: 45741 },
  ];

  const students: Student[] = [
    {
      id: '1234567890',
      name: 'Samantha William',
      course: 'Tajweed',
      courseType: 'Trial Class',
      joinDate: 'January 2, 2020',
      level: 2,
      status: 'Active'
    },
    {
      id: '1234567891',
      name: 'Jordan Nico',
      course: 'Arabic',
      courseType: 'Group Class',
      joinDate: 'January 2, 2020',
      level: 2,
      status: 'Active'
    },
    {
      id: '1234567892',
      name: 'Nadila Adja',
      course: 'Quran',
      courseType: 'Regular Class',
      joinDate: 'January 2, 2020',
      level: 2,
      status: 'Active'
    }
  ];

  const classes: Class[] = [
    {
      id: 'CLS001',
      name: 'Basic Arabic',
      instructor: 'Ahmed Hassan',
      schedule: 'Mon, Wed 10:00 AM',
      students: 15,
      type: 'Group Class',
      status: 'Ongoing'
    },
    {
      id: 'CLS002',
      name: 'Advanced Tajweed',
      instructor: 'Sarah Ahmad',
      schedule: 'Tue, Thu 2:00 PM',
      students: 10,
      type: 'Group Class',
      status: 'Ongoing'
    },
    {
      id: 'CLS003',
      name: 'Quran Memorization',
      instructor: 'Mohammad Ali',
      schedule: 'Fri 9:00 AM',
      students: 8,
      type: 'Regular Class',
      status: 'Ongoing'
    }
  ];

  const earnings: Earning[] = [
    {
      id: 'PAY001',
      studentName: 'Samantha William',
      course: 'Tajweed',
      amount: 150,
      date: 'March 15, 2024',
      status: 'Paid'
    },
    {
      id: 'PAY002',
      studentName: 'Jordan Nico',
      course: 'Arabic',
      amount: 200,
      date: 'March 14, 2024',
      status: 'Pending'
    },
    {
      id: 'PAY003',
      studentName: 'Nadila Adja',
      course: 'Quran',
      amount: 175,
      date: 'March 13, 2024',
      status: 'Paid'
    }
  ];

  const filteredStudents = students.filter(student => {
    return (
      student.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      student.id.includes(filters.id) &&
      (filters.course === '' || student.course === filters.course) &&
      (filters.status === '' || student.status === filters.status)
    );
  });

  const filteredClasses = classes.filter(cls => {
    return (
      cls.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      cls.id.includes(filters.id) &&
      (filters.status === '' || cls.status === filters.status)
    );
  });

  const filteredEarnings = earnings.filter(earning => {
    return (
      earning.studentName.toLowerCase().includes(filters.name.toLowerCase()) &&
      earning.id.includes(filters.id) &&
      (filters.status === '' || earning.status === filters.status)
    );
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  return (
    <BaseLayout>
    <div className="h-screen w-screen bg-[#f1f1f4]">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#1e293b]">Analytics</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Total Students Card */}
            <button
              className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveView('students')}
            >
              <h3 className="text-base font-semibold text-[#1e293b] mb-3">Total Students</h3>
              <div className="flex flex-col">
                <div className="h-20 mb-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={studentData}>
                      <Bar dataKey="students" fill="#4ade80" />
                      <Tooltip 
                        contentStyle={{ background: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                        labelStyle={{ color: '#1e293b' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xl font-bold text-[#1e293b]">12,345</p>
                <p className="text-xs text-[#4ade80] font-medium">5.4% than last year</p>
              </div>
            </button>

            {/* Classes Card */}
            <button
              className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveView('classes')}
            >
              <h3 className="text-base font-semibold text-[#1e293b] mb-3">Classes</h3>
              <div className="flex flex-col">
                <div className="h-20 mb-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={classData}>
                      <defs>
                        <linearGradient id="colorClasses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="classes" 
                        stroke="#fbbf24" 
                        fill="url(#colorClasses)" 
                      />
                      <Tooltip 
                        contentStyle={{ background: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                        labelStyle={{ color: '#1e293b' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xl font-bold text-[#1e293b]">100</p>
                <p className="text-xs text-[#4ade80] font-medium">+15% than last month</p>
              </div>
            </button>

            {/* Earnings Card */}
            <button
              className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveView('earnings')}
            >
              <h3 className="text-base font-semibold text-[#1e293b] mb-3">Earnings</h3>
              <div className="flex flex-col">
                <div className="h-20 mb-2 relative">
                  <div className="absolute top-0 right-0 w-6 h-6 bg-[#fbbf24] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">$</span>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={earningsData}>
                      <Line 
                        type="monotone" 
                        dataKey="earnings" 
                        stroke="#4ade80" 
                        strokeWidth={2}
                        dot={{ fill: '#4ade80', r: 3 }}
                        activeDot={{ r: 4, fill: '#4ade80' }}
                      />
                      <Tooltip 
                        contentStyle={{ background: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                        labelStyle={{ color: '#1e293b' }}
                        formatter={(value: any) => [`$${value}`, 'Earnings']}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xl font-bold text-[#1e293b]">$45,741</p>
                <p className="text-xs text-[#4ade80] font-medium">+15% than last month</p>
              </div>
            </button>
          </div>

          {/* List View */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-[#1e293b]">
              {(() => {
  if (activeView === 'students') {
    return 'Students List';
  } else if (activeView === 'classes') {
    return 'Classes List';
  } else {
    return 'Earnings List';
  }
})()}

              </h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search"
                    onChange={(e) => handleFilterChange('name', e.target.value)}
                    className="pl-9 pr-4 py-1.5 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4ade80] w-56"
                  />
                </div>
                <button
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-gray-600 hover:bg-gray-100 text-sm"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {activeView === 'students' && (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 border-y border-gray-100">
                    <th className="px-4 py-3 font-medium text-sm">Name</th>
                    <th className="px-4 py-3 font-medium text-sm">Student ID</th>
                    <th className="px-4 py-3 font-medium text-sm">Courses</th>
                    <th className="px-4 py-3 font-medium text-sm">Course Type</th>
                    <th className="px-4 py-3 font-medium text-sm">Join Date</th>
                    <th className="px-4 py-3 font-medium text-sm">Level</th>
                    <th className="px-4 py-3 font-medium text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-gray-100 last:border-b-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                          <span className="font-medium text-[#1e293b] text-sm">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">{student.id}</td>
                      <td className="px-4 py-3 text-[#1e293b] text-sm">{student.course}</td>
                      <td className="px-4 py-3 text-gray-500 text-sm">{student.courseType}</td>
                      <td className="px-4 py-3 text-gray-500 text-sm">{student.joinDate}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[#1e293b] text-sm">Level {student.level}</span>
                          <div className="w-5 h-5 bg-[#1e293b] rounded-full text-white flex items-center justify-center text-xs">
                            {student.level}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 bg-[#4ade80]/10 text-[#4ade80] rounded-full text-xs">
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeView === 'classes' && (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 border-y border-gray-100">
                    <th className="px-4 py-3 font-medium text-sm">Class Name</th>
                    <th className="px-4 py-3 font-medium text-sm">Class ID</th>
                    <th className="px-4 py-3 font-medium text-sm">Instructor</th>
                    <th className="px-4 py-3 font-medium text-sm">Schedule</th>
                    <th className="px-4 py-3 font-medium text-sm">Students</th>
                    <th className="px-4 py-3 font-medium text-sm">Type</th>
                    <th className="px-4 py-3 font-medium text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClasses.map((cls) => (
                    <tr key={cls.id} className="border-b border-gray-100 last:border-b-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                          <span className="font-medium text-[#1e293b] text-sm">{cls.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-sm">{cls.id}</td>
                      <td className="px-4 py-3 text-[#1e293b] text-sm">{cls.instructor}</td>
                      <td className="px-4 py-3 text-gray-500 text-sm">{cls.schedule}</td>
                      <td className="px-4 py-3 text-gray-500 text-sm">{cls.students}</td>
                      <td className="px-4 py-3 text-[#1e293b] text-sm">{cls.type}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 ${
                          cls.status === 'Ongoing' ? 'bg-[#4ade80]/10 text-[#4ade80]' : 'bg-gray-100 text-gray-600'
                        } rounded-full text-xs`}>
                          {cls.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeView === 'earnings' && (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 border-y border-gray-100">
                    <th className="px-4 py-3 font-medium text-sm">Payment ID</th>
                    <th className="px-4 py-3 font-medium text-sm">Student Name</th>
                    <th className="px-4 py-3 font-medium text-sm">Course</th>
                    <th className="px-4 py-3 font-medium text-sm">Amount</th>
                    <th className="px-4 py-3 font-medium text-sm">Date</th>
                    <th className="px-4 py-3 font-medium text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEarnings.map((earning) => (
                    <tr key={earning.id} className="border-b border-gray-100 last:border-b-0">
                      <td className="px-4 py-3 text-gray-500 text-sm">{earning.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
                          <span className="font-medium text-[#1e293b] text-sm">{earning.studentName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#1e293b] text-sm">{earning.course}</td>
                      <td className="px-4 py-3 text-[#1e293b] text-sm">${earning.amount}</td>
                      <td className="px-4 py-3 text-gray-500 text-sm">{earning.date}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 ${
                          earning.status === 'Paid' ? 'bg-[#4ade80]/10 text-[#4ade80]' : 'bg-yellow-100 text-yellow-600'
                        } rounded-full text-xs`}>
                          {earning.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100">
            <p className="text-xs text-gray-500">
  Showing 1-
  {(() => {
    if (activeView === 'students') {
      return filteredStudents.length;
    } else if (activeView === 'classes') {
      return filteredClasses.length;
    } else {
      return filteredEarnings.length;
    }
  })()}
  of{' '}
  {(() => {
    if (activeView === 'students') {
      return students.length;
    } else if (activeView === 'classes') {
      return classes.length;
    } else {
      return earnings.length;
    }
  })()} data
</p>

              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-7 h-7 rounded-lg bg-[#4ade80] text-white text-sm">1</button>
                <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl w-[400px] p-6 relative">
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        onClick={() => setIsFilterOpen(false)}
      >
        <X className="w-5 h-5" />
      </button>
      <h2 className="text-xl font-semibold mb-4">Filter By</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {(() => {
              if (activeView === 'students') {
                return 'Student Name';
              } else if (activeView === 'classes') {
                return 'Class Name';
              } else {
                return 'Student Name'; // Default case for other views (like earnings)
              }
            })()}
          </label>
          <input
            type="text"
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4ade80] focus:border-[#4ade80] sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {(() => {
              if (activeView === 'students') {
                return 'Student ID';
              } else if (activeView === 'classes') {
                return 'Class ID';
              } else {
                return 'Payment ID'; // Default case for earnings
              }
            })()}
          </label>
          <input
            type="text"
            value={filters.id}
            onChange={(e) => handleFilterChange('id', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4ade80] focus:border-[#4ade80] sm:text-sm"
          />
        </div>
        {activeView === 'students' && (
          <div>
            <label htmlFor='hvbahi' className="block text-sm font-medium text-gray-700">Course</label>
            <select
              value={filters.course}
              onChange={(e) => handleFilterChange('course', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4ade80] focus:border-[#4ade80] sm:text-sm"
            >
              <option value="">All</option>
              <option value="Arabic">Arabic</option>
              <option value="Quran">Quran</option>
              <option value="Tajweed">Tajweed</option>
            </select>
          </div>
        )}
        <div>
          <label htmlFor='hvbahi'  className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4ade80] focus:border-[#4ade80] sm:text-sm"
          >
            <option value="">All</option>
            {(() => {
              if (activeView === 'students') {
                return (
                  <>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </>
                );
              } else if (activeView === 'classes') {
                return (
                  <>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </>
                );
              } else {
                return (
                  <>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </>
                );
              }
            })()}
          </select>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          className="px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200"
          onClick={() => {
            setFilters({
              name: '',
              id: '',
              course: '',
              status: '',
              date: '',
            });
            setIsFilterOpen(false);
          }}
        >
          Reset
        </button>
        <button
          className="px-4 py-2 bg-[#4ade80] text-white rounded-md hover:bg-[#3ecf6e]"
          onClick={() => setIsFilterOpen(false)}
        >
          Apply
        </button>
      </div>
    </div>
  </div>
)}
    </div>
    </BaseLayout>
  );
}

export default Analytics;