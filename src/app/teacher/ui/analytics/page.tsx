"use client";
import React, { useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import BaseLayout from '@/components/BaseLayout';
import { FaSort } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface Student {
  id: string;
  name: string;
  course: string;
  courseType: string;
  classDateTime: string;
  courseDuration: string;
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
  classDateTime: number;
  courseDuration: number;
  courseType: number;
  date: string;
  status: 'Paid' | 'Pending';
}

type ViewType = 'students' | 'classes' | 'earnings';

function Analytics() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>('students');
  const [filters, setFilters] = useState({
    name: '',
    id: '',
    course: '',
    status: '',
    date: '',
  });
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortKey, setSortKey] = useState<keyof Student | keyof Class | keyof Earning>("name"); // Default sort key

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
      courseDuration: '4',
      classDateTime: '4',
      joinDate: 'January 2, 2020',
      level: 2,
      status: 'Active'
    },
    {
      id: '1234567891',
      name: 'Jordan Nico',
      course: 'Arabic',
      courseType: 'Group Class',
      courseDuration:'4',
      classDateTime:'4',
      joinDate: 'January 2, 2020',
      level: 2,
      status: 'Active'
    },
    {
      id: '1234567892',
      name: 'Nadila Adja',
      course: 'Quran',
      courseType: 'Regular Class',
      courseDuration: '4',
      classDateTime: '4',
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
      classDateTime: 150,
      courseDuration: 150,
      courseType: 150,
      date: 'March 15, 2024',
      status: 'Paid'
    },
    {
      id: 'PAY002',
      studentName: 'Jordan Nico',
      course: 'Arabic',
      amount: 200,
      classDateTime: 150,
      courseDuration: 150,
      courseType: 150,
      date: 'March 14, 2024',
      status: 'Pending'
    },
    {
      id: 'PAY003',
      studentName: 'Nadila Adja',
      course: 'Quran',
      amount: 175,
      classDateTime: 150,
      courseDuration: 150,
      courseType: 150,
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

  // Function to handle sorting
  const handleSort = (key: keyof Student | keyof Class | keyof Earning) => {
    const order = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(order);
    setSortKey(key);
  };

  // Sorting logic for filtered data
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortKey as keyof Student].toString().localeCompare(b[sortKey as keyof Student].toString());
    }
    return b[sortKey as keyof Student].toString().localeCompare(a[sortKey as keyof Student].toString());
  });

  const sortedClasses = [...filteredClasses].sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortKey as keyof Class].toString().localeCompare(b[sortKey as keyof Class].toString());
    }
    return b[sortKey as keyof Class].toString().localeCompare(a[sortKey as keyof Class].toString());
  });

  const sortedEarnings = [...filteredEarnings].sort((a, b) => {
    const aValue = a[sortKey as keyof Earning];
    const bValue = b[sortKey as keyof Earning];
    
    if (aValue === undefined || bValue === undefined) {
      return 0; // or handle the case as needed
    }

    if (sortOrder === "asc") {
      return aValue.toString().localeCompare(bValue.toString());
    }
    return bValue.toString().localeCompare(aValue.toString());
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  return (
    <BaseLayout>
    <div className="h-screen w-screen">
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-800 p-2">Analytics</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6 w-[80%] ml-32">
            {/* Total Students Card */}
            <button
              className={`bg-white ${activeView === 'students' ? 'border-[3px]' : 'border-[1px]'} border-[#1C3557] rounded-xl p-4 shadow-lg cursor-pointer hover:shadow-md transition-shadow`}
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
              className={`bg-white ${activeView === 'classes' ? 'border-[3px]' : 'border-[1px]'} border-[#1C3557] rounded-xl p-4 shadow-lg cursor-pointer hover:shadow-md transition-shadow`}
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
              className={`bg-white ${activeView === 'earnings' ? 'border-[3px]' : 'border-[1px]'} border-[#1C3557] rounded-xl p-4 shadow-lg cursor-pointer hover:shadow-md transition-shadow`}
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
          <div className="bg-white rounded-lg border-2 border-[#1C3557] h-[40vh] mt-16">
            <div className="p-4 flex justify-between items-center">
              <h2 className="text-[15px] font-semibold text-[#1e293b]">
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
              <div className="items-center gap-3 -mt-16">
                <button
                  className="flex items-center gap-2 ml-36 shadow-lg bg-[#FAFAFA] px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 text-sm"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                <div className="relative shadow-lg mt-4 rounded-xl p-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search"
                    onChange={(e) => handleFilterChange('name', e.target.value)}
                    className="pl-9 pr-4 py-1.5 bg-[#FAFAFA] text-sm focus:outline-none focus:ring-2 rounded-xl focus:ring-[#1C3557] w-56"
                  />
                </div>
                
              </div>
            </div>

            {activeView === 'students' && (
              <table className="table-auto w-full">
                <thead className='border-b-[1px] border-[#1C3557] text-[11px] font-semibold'>
                  <tr>
                    <th className="px-6 py-3 text-center">
                      Name <FaSort className="inline ml-2 cursor-pointer" onClick={() => handleSort('name')} />
                    </th>
                    <th className="px-6 py-3 text-center">
                      Student ID <FaSort className="inline ml-2 cursor-pointer" onClick={() => handleSort('id')} />
                    </th>
                    <th className="px-6 py-3 text-center">
                      Courses <FaSort className="inline ml-2 cursor-pointer" onClick={() => handleSort('course')} />
                    </th>
                    <th className="px-6 py-3 text-center">
                      Course Type <FaSort className="inline ml-2 cursor-pointer" onClick={() => handleSort('courseType')} />
                    </th>
                    <th className="px-6 py-3 text-center">
                      Join Date <FaSort className="inline ml-2 cursor-pointer" onClick={() => handleSort('joinDate')} />
                    </th>
                    <th className="px-6 py-3 text-center">Level</th>
                    <th className="px-6 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStudents.map((student) => (
                    <tr key={student.id} className="text-[11px] font-medium mt-2"
                    style={{ backgroundColor: "rgba(230, 233, 237, 0.22)" }}>
                      <td className="px-4 py-2 text-center">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-[#DBDBDB] rounded-md"></div>
                          <span className="px-6 py-2 text-center">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-2 text-center">{student.id}</td>
                      <td className="px-6 py-2 text-center">{student.course}</td>
                      <td className="px-6 py-2 text-center">{student.courseType}</td>
                      <td className="px-6 py-2 text-center">{student.joinDate}</td>
                      <td className="px-6 py-2 text-center">
                        <div className="flex items-center gap-2">
                          <span className="text-[#1e293b] text-[11px]">Level {student.level}</span>
                          <div className="w-3 h-3 bg-[#1e293b] rounded-full text-white flex items-center justify-center text-[7px]">
                            {student.level}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 bg-[#4ade80]/10 text-[#299350] border border-[#299350] rounded-lg text-[11px]">
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeView === 'classes' && (
              <table className="table-auto w-full">
                <thead className='border-b-[1px] border-[#1C3557] text-[11px] font-semibold'>
                  <tr>
                    <th className="px-6 py-3 text-center">
                      Class Name <FaSort className="inline ml-2 cursor-pointer" onClick={() => handleSort('name')} />
                    </th>
                    <th className="px-6 py-3 text-center">
                      Student ID <FaSort className="inline ml-2 cursor-pointer" onClick={() => handleSort('id')} />
                    </th>
                    <th className="px-6 py-3 text-center">
                      Courses <FaSort className="inline ml-2 cursor-pointer" onClick={() => handleSort('instructor')} />
                    </th>
                    <th className="px-6 py-3 text-center">
                      Course Type <FaSort className="inline ml-2 cursor-pointer" onClick={() => handleSort('schedule')} />
                    </th>
                    <th className="px-6 py-3 text-center">
                      Course Duration <FaSort className="inline ml-2 cursor-pointer" onClick={() => handleSort('students')} />
                    </th>
                    <th className="px-6 py-3 text-center">
                      Class-Date & time <FaSort className="inline ml-2 cursor-pointer" onClick={() => handleSort('type')} />
                    </th>
                    <th className="px-6 py-3 text-center">
                      Status <FaSort className="inline ml-2 cursor-pointer" onClick={() => handleSort('status')} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedClasses.map((cls) => (
                    <tr key={cls.id} className="text-[11px] font-medium mt-2"
                    style={{ backgroundColor: "rgba(230, 233, 237, 0.22)" }}>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-[#DBDBDB] rounded-md"></div>
                          <span className="px-6 py-2 text-center">{cls.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-2 text-center">{cls.id}</td>
                      <td className="px-6 py-2 text-center">{cls.instructor}</td>
                      <td className="px-6 py-2 text-center">{cls.schedule}</td>
                      <td className="px-6 py-2 text-center">{cls.students}</td>
                      <td className="px-6 py-2 text-center">{cls.type}</td>
                      <td className="px-6 py-1 text-center">
                        <span className={`px-2.5 py-1 ${
                          cls.status === 'Ongoing' ? 'bg-[#4ade80]/10 text-[#4ade80]' : 'bg-gray-100 text-[#1e293b]'
                        } rounded-lg text-[10px] border border-[#4ade80]`}>
                          {cls.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeView === 'earnings' && (
              <table className="table-auto w-full">
                <thead className='border-b-[1px] border-[#1C3557] text-[11px] font-semibold'>
                  <tr>
                    <th className="px-6 py-3 text-center">
                      Name <FaSort className="inline ml-2 cursor-pointer" onClick={() => handleSort('studentName')} />
                    </th>
                    <th className="px-6 py-3 text-center">
                      Student ID <FaSort className="inline ml-2 cursor-pointer" onClick={() => handleSort('id')} />
                    </th>
                    <th className="px-6 py-3 text-center">
                      Courses <FaSort className="inline ml-2 cursor-pointer" onClick={() => handleSort('course')} />
                    </th>
                    <th className="px-6 py-3 text-center">
                      Course Type <FaSort className="inline ml-2 cursor-pointer" onClick={() => handleSort('courseType')} />
                    </th>
                    <th className="px-6 py-3 text-center">
                      Course Duration <FaSort className="inline ml-2 cursor-pointer" onClick={() => handleSort('courseDuration')} />
                    </th>
                    <th className="px-6 py-3 text-center">
                      Class Date-Time <FaSort className="inline ml-2 cursor-pointer" onClick={() => handleSort('classDateTime')} />
                    </th>
                    <th className="px-6 py-3 text-center">
                      Amount <FaSort className="inline ml-2 cursor-pointer" onClick={() => handleSort('amount')} />
                    </th>
                    <th className="px-6 py-3 text-center">
                      Status <FaSort className="inline ml-2 cursor-pointer" onClick={() => handleSort('status')} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedEarnings.map((earning) => (
                    <tr key={earning.id} className="text-[11px] font-medium mt-2"
                    style={{ backgroundColor: "rgba(230, 233, 237, 0.22)" }}>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-[#DBDBDB] rounded-md"></div>
                          <span className="px-6 py-2 text-center">{earning.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-2 text-center">{earning.studentName}</td>
                      <td className="px-6 py-2 text-center">{earning.course}</td>
                      <td className="px-6 py-2 text-center">{earning.courseType}</td>
                      <td className="px-6 py-2 text-center">{earning.courseDuration}</td>
                      <td className="px-6 py-2 text-center">{earning.classDateTime}</td>
                      <td className="px-6 py-2 text-center">${earning.amount}</td>
                      <td className="px-6 py-2 text-center">
                        <span className={`px-2.5 py-1 ${
                          earning.status === 'Paid' ? 'bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80] px-5' : 'bg-yellow-100 border border-yellow-600 text-yellow-600 px-2.5'
                        } rounded-lg text-[10px]`}>
                          {earning.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="flex justify-end">
          <button
            className="text-[#fff] mt-4 text-[11px] bg-[#223857] cursor-pointer rounded-md border-none px-2 py-1"
            onClick={() => {
              if (activeView === 'students') {
                router.push('/teacher/ui/analytics/totalstudents');
              } else if (activeView === 'classes') {
                router.push('/teacher/ui/analytics/classes');
              } else {
                router.push('/teacher/ui/analytics/earnings');
              }
            }}
          >
            View All
          </button>
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