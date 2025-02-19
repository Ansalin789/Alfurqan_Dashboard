'use client';
import React, { useEffect, useState } from 'react';
import { Search, Filter, Bell, Sun, Moon, User } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import BaseLayout3 from '../../../../components/BaseLayout3';
import moment from "moment"; 
import axios from 'axios';
interface Applicant {
  _id: string;
  candidateFirstName: string;
  candidateLastName: string;
  applicationDate: string;
  candidateEmail: string;
  candidatePhoneNumber: number;
  candidateCountry: string;
  candidateCity: string;
  positionApplied: string;
  currency: string;
  expectedSalary: number;
  preferedWorkingHours: string;
  uploadResume: { type: string; data: number[] };
  comments: string;
  applicationStatus: string;
  status: string;
  createdDate: string;
  createdBy: string;
}

interface DashboardCounts {
  totalApplication: number;
  shortlisted: number;
  rejected: number;
}


const pieData = [
  { name: 'Arabic', value: 70, color: '#1e40af', female: 48, male: 22 },
  { name: 'Quran', value: 24, color: '#60a5fa', female: 12, male: 12 },
  { name: 'Tajweed', value: 6, color: '#93c5fd', female: 2, male: 4 }
];

const scheduleData = [
  { time: '10:00 AM', title: 'Teachers Meeting', type: 'teachers', color: 'bg-amber-100 text-amber-800' },
  { time: '12:00 AM', title: 'Group Meeting', type: 'group', color: 'bg-green-100 text-green-800' },
  { time: '01:30 AM', title: 'Interview', type: 'interview', color: 'bg-blue-100 text-blue-800' },
  { time: '03:00 AM', title: 'Weekly Meeting', type: 'weekly', color: 'bg-purple-100 text-purple-800' }
];
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};



export default function Dashboard() {
  
  const [mounted, setMounted] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [barData, setBarData] = useState<any[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>(""); // Store the selected week label
  const [weekRange, setWeekRange] = useState<{ startDate: Date; endDate: Date }>({
    startDate: moment().startOf("week").toDate(), // Start of the current week (Sunday)
    endDate: moment().endOf("week").toDate(), // End of the current week (Saturday)
  });
  const [dashboardCounts, setDashboardCounts] = useState<DashboardCounts>({
    totalApplication: 0,
    shortlisted: 0,
    rejected: 0,
  });
 
  useEffect(() => {
    setMounted(true);
    const auth = localStorage.getItem('SupervisorAuthToken');
    axios
      .get("http://localhost:5001/applicants", {
        headers: {
          Authorization: `Bearer ${auth}`, // Add Authorization header with the Bearer token
        }
      })
      .then((response) => setApplicants(response.data.applicants))
      .catch((error) => console.error("Error fetching applicants:", error));

      axios
      .get("http://localhost:5001/dashboard/supervisor/counts")
      .then((response) => {
        console.log("Dashboard Counts Response:", response.data); // Log response correctly
        setDashboardCounts(response.data);
      })
      .catch((error) => console.error("Error fetching dashboard counts:", error));
  }, []);
  useEffect(() => {
    // Update the week range label (e.g., "08-14 Nov") dynamically
    const start = moment(weekRange.startDate);
    const end = moment(weekRange.endDate);
    const weekLabel = `${start.format("DD MMM")} - ${end.format("DD MMM")}`;
    setSelectedWeek(weekLabel);
  
    // Process applicants data based on the selected week range
    const processedData: any = [];
    const { startDate, endDate } = weekRange;
  
    applicants.forEach((applicant) => {
      const applicationDate = new Date(applicant.applicationDate);
  
      // Convert startDate and endDate to JavaScript Date objects for comparison
      const startDateObject = moment(startDate).toDate();
      const endDateObject = moment(endDate).toDate();
  
      // Filter applicants based on the selected week
      if (applicationDate >= startDateObject && applicationDate <= endDateObject) {
        const formattedDate = `${applicationDate.getDate()} ${applicationDate.toLocaleString("default", {
          month: "short",
        })}`;
  
        // Find if the date already exists in the processedData
        let existingData = processedData.find((data: any) => data.name === formattedDate);
  
        if (!existingData) {
          // If not, add a new entry for the date
          existingData = { name: formattedDate, Applied: 0, Shortlisted: 0 };
          processedData.push(existingData);
        }
  
        // Increment Applied count for each applicant
        existingData.Applied += 1;
  
        // Increment Shortlisted count if the applicant is shortlisted
        if (applicant.applicationStatus === "SHORTLISTED") {
          existingData.Shortlisted += 1;
        }
      }
    });
  
    setBarData(processedData);
  }, [applicants, weekRange]);
  

  const handleWeekChange = (startDate: Date, endDate: Date) => {
    setWeekRange({ startDate, endDate });
  };

  
  if (!mounted) return null;
  const data = [
    { name: "Islamic Studies", value: 60, color: "#fbbf24" },
    { name: "Arabic", value: 110, color: "#3b82f6" },
    { name: "Quran", value: 80, color: "#a855f7" },
  ];
  
  const totalApplications = dashboardCounts.totalApplication || 0;
  const totalShortlisted = dashboardCounts.shortlisted || 0;
  const totalRejected = dashboardCounts.rejected || 0;

  const total = totalApplications + totalShortlisted + totalRejected + 100; // Adjusted to account for total applications, shortlisted, and rejected

  const percentageApplications = (totalApplications / total) * 100;
  const percentageShortlisted = (totalShortlisted / total) * 100;
  const percentageRejected = (totalRejected / total) * 100;

  const remainingApplications = 100 - percentageApplications;
  const remainingShortlisted = 100 - percentageShortlisted;
  const remainingRejected = 100 - percentageRejected;
  console.log(remainingApplications);
  return (
    <BaseLayout3>
      <div className='flex flex-col h-screen w-full mr-5 '>
        {/* Header - Made more compact on small screens */}
        <header className="p-2 flex flex-col sm:flex-row justify-between items-center mt-2 mr-4  gap-2 sm:gap-3 text-sm">
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-1.5 rounded-lg bg-gray-100 w-full sm:w-[250px] text-sm"
              />
            </div>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 whitespace-nowrap">
              <Filter size={16} />
              <span className="hidden sm:inline text-sm">Filter</span>
            </button>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1">
              <Sun size={16} className="text-gray-600" />
              <div className="w-10 h-5 bg-gray-200 rounded-full p-0.5">
                <div className="w-4 h-4 bg-white rounded-full transform transition-transform duration-200 translate-x-5"></div>
              </div>
              <Moon size={16} className="text-gray-600" />
            </div>
            <Bell size={16} className="text-gray-600" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={16} className="text-gray-600" />
              </div>
              <span className="font-medium hidden sm:inline text-sm">Harsh</span>
            </div>
          </div>
        </header>
      
        <div className="flex flex-1 min-h-0">
          <main className="flex-1 p-2 sm:p-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
          <div className="bg-[#D0E0EC] p-2 rounded-lg shadow-lg">
    <h3 className="text-gray-500 text-sm mb-2">TOTAL APPLICATIONS</h3>
    <div className="flex justify-between items-center">
      <span className="text-lg font-bold">{dashboardCounts.totalApplication}</span>
      <div className="w-10 h-10">
      <PieChart width={40} height={40}>
        <Pie
          data={[
            { name: "Applications", value: percentageApplications, fill: "#8b5cf6" }, // Purple
            { name: "Remaining", value: remainingApplications, fill: "#f59e0b" }, // Orange
          ]}
          innerRadius={15}
          outerRadius={20}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
        />
      </PieChart>
      </div>
    </div>
    <span className="text-green-500 text-xs flex items-center gap-1">
      <span className="text-[10px]">↑</span> 12%
    </span>
  </div>

  <div className="bg-[#D0E0EC] p-2 rounded-lg shadow-lg">
    <h3 className="text-gray-500 text-sm mb-2">SHORTLISTED CANDIDATES</h3>
    <div className="flex justify-between items-center">
      <span className="text-lg font-bold">{dashboardCounts.shortlisted}</span>
      <div className="w-10 h-10">
      <PieChart width={40} height={40}>
        <Pie
          data={[
            { name: "Shortlisted", value: percentageShortlisted, fill: "#34d399" }, // Green
            { name: "Remaining", value: remainingShortlisted, fill: "#f59e0b" }, // Orange
          ]}
          innerRadius={15}
          outerRadius={20}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
        />
      </PieChart>
      </div>
    </div>
    <span className="text-red-500 text-xs flex items-center gap-1">
      <span className="text-[10px]">↓</span> 16%
    </span>
  </div>

  <div className="bg-[#D0E0EC] p-2 rounded-lg shadow-lg">
    <h3 className="text-gray-500 text-sm mb-2">REJECTED CANDIDATES</h3>
    <div className="flex justify-between items-center">
      <span className="text-lg font-bold ">{dashboardCounts.rejected}</span>
      <div className="w-10 h-10">
      <PieChart width={40} height={40}>
        <Pie
          data={[
            { name: "Rejected", value: percentageRejected, fill: "#f87171" }, // Red
            { name: "Remaining", value: remainingRejected, fill: "#f59e0b" }, // Orange
          ]}
          innerRadius={15}
          outerRadius={20}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
        />
      </PieChart>
      </div>
    </div>
    <span className="text-green-500 text-xs flex items-center gap-1">
      <span className="text-[10px]">↑</span> 14%
    </span>
  </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
          <div className="bg-white p-3 rounded-xl h-[calc(30vh-2rem)] shadow-lg">
  {/* Header */}
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
    <h3 className="text-gray-800 font-medium text-xs sm:text-sm">Applications</h3>
    <div className="flex items-center gap-3 mt-2 sm:mt-0">
      {/* Legend */}
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 bg-blue-100 rounded"></div>
        <span className="text-xs text-gray-600">Applied</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 bg-blue-900 rounded"></div>
        <span className="text-xs text-gray-600">Shortlisted</span>
      </div>
      {/* Calendar Button */}
      <div className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 rounded-md">
        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none">
          <path d="M3 7H21M7 3V7M17 3V7M7 11H17M7 15H14M7 19H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <button
        className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 rounded-md"
        onClick={() => handleWeekChange(
          moment().startOf("week").toDate(), // Start of the current week
          moment().endOf("week").toDate()    // End of the current week
        )}
      >
        {selectedWeek} {/* Display the selected week */}
      </button>
        {/* You can add more buttons for other weeks */}
      </div>
    </div>
  </div>

  {/* Bar Chart */}
  <div className="h-40 w-120">
      <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} barCategoryGap="25%">
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
            <Tooltip />
            <Bar dataKey="Shortlisted" stackId="a" fill="#1e40af" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Applied" stackId="a" fill="#e0e7ff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
  </div>
</div>


<div className="bg-[#D0E0EC] p-3 rounded-xl h-[calc(30vh-2rem)] shadow-lg">
  <div className="flex justify-between items-center mb-2">
    <h3 className="text-gray-800 font-medium text-xs sm:text-sm">Teachers By Subject</h3>
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-pink-400 rounded"></div>
        <span className="text-xs text-gray-600">Female</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-blue-400 rounded"></div>
        <span className="text-xs text-gray-600">Male</span>
      </div>
    </div>
  </div>

  <div className="flex">
    {/* Pie Chart */}
    <div className="w-1/2 flex justify-center">
      <PieChart width={150} height={150}>
        <Pie
          data={pieData}
          cx={75}
          cy={75}
          innerRadius={40}
          outerRadius={60}
          dataKey="value"
        >
          {pieData.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </div>

    {/* Legend */}
    <div className="w-1/2 flex flex-col justify-center gap-3 ">
      {pieData.map((item) => (
        <div key={item.name} className="flex items-center justify-between">
          <div className="flex  gap-1">
            <div className="w-2 h-2 rounded" style={{ backgroundColor: item.color }}></div>
            <span className="text-xs text-gray-600">{item.name}</span>
          </div>
          <div className="flex items-center gap-4 mr-9">
            <span className="text-xs text-pink-400">{item.female}%</span>
            <span className="text-xs text-blue-400">{item.male}%</span>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
          </div>

          <div className="bg-white p-3 rounded-lg">
  {/* Header */}
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
    <div className="flex items-center gap-2">
      <h3 className="text-base font-semibold">New Applicants List</h3>
      <span className="text-gray-500 font-medium text-sm">(1142)</span>
    </div>

    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600">Sort By:</span>
        <button className="px-2 py-1 bg-gray-200 rounded text-xs flex items-center gap-1">
          Name <span className="text-gray-500">▼</span>
        </button>
      </div>
      <button className="text-xs text-blue-600">See All</button>
    </div>
  </div>

  {/* Table */}
  <div className="overflow-x-auto rounded-xl h-[calc(40vh-2rem)] shadow-lg gap-5">
    {/* All Applicants Button */}
    <div className="px-2 py-1 ">
      <button className="px-2 py-1 bg-blue-900 text-white rounded-lg text-xs">All Applicants</button>
    </div>

    <table className="w-full text-xs border-collapse">
      {/* Table Head */}
      <thead>
        <tr className="bg-[#CAC7C7] text-gray-800">
          {[
            "Name", "Contact", "Country", "Course",
            "Date", "Hours", "Resume", "Status"
          ].map((col) => (
            <th key={col} className="py-2 px-2 text-left font-medium">
              {col} <span className="text-gray-600 text-[10px]">▲▼</span>
            </th>
          ))}
        </tr>
      </thead>

      {/* Table Body */}
      <tbody className="divide-y divide-gray-200 ">
        {applicants.map((applicant) => (
          <tr key={applicant._id} className="hover:bg-gray-100 border-b ">
            <td className="py-2 px-2">{applicant.candidateFirstName}</td>
            <td className="py-2 px-2">{applicant.candidateEmail}</td>
            <td className="py-2 px-2">{applicant.candidatePhoneNumber}</td>
            <td className="py-2 px-2">{applicant.positionApplied}</td>
            <td className="py-2 px-2">{formatDate(applicant.applicationDate)}</td>
            <td className="py-2 px-2 text-center">{applicant.preferedWorkingHours}</td>
            <td className="py-2 px-2">
              <button className="text-blue-600  flex items-center gap-1 text-xs">
                📎 Resume
              </button>
            </td>
            <td className="py-2 px-2">
              <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                {applicant.applicationStatus}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


        </main>

        <aside className="w-64 p-2 hidden lg:block space-y-2">
  {/* Calendar Section */}
  <div className="bg-[#D0E0EC] p-2 rounded-lg">
    {/* Calendar Header */}
    <div className="relative flex flex-col items-center pb-2">
      <div className="w-full h-5 bg-gray-300 rounded-t-md"></div> {/* Spiral Binding Effect */}
      <h3 className="text-sm font-semibold text-gray-700 mt-1">JANUARY, 2022</h3>
    </div>

    {/* Days of the Week */}
    <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mt-2">
      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => (
        <div key={day}>{day}</div>
      ))}
    </div>

    {/* Calendar Dates */}
    <div className="grid grid-cols-7 gap-1 text-center mt-1">
      {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
        <button
          key={date}
          className={`p-2 text-xs rounded-md ${
            date === 5 || date === 17 ? 'bg-blue-900 text-white font-semibold' : 'text-gray-700'
          }`}
        >
          {date}
        </button>
      ))}
    </div>
  </div>

  {/* Teachers Section */}
  <div className="bg-white p-2 rounded-xl border border-blue-300 shadow-lg">
  <h3 className="text-md font-semibold text-gray-800 mb-1">Teachers</h3>

  <div className="flex items-center justify-between">
    {/* Circular Chart */}
    <div className="relative w-[90px] h-[90px] flex items-center justify-center mb-5">
      <PieChart width={90} height={90}>
        <Pie
          data={data}
          cx={45}
          cy={45}
          innerRadius={25}
          outerRadius={35}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>

      {/* Centered Total Teachers Count */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="mt-3 ml-2 text-xs font-bold text-gray-900 ">250</span>
        <p className="ml-3 text-[8px] text-gray-500">Teachers</p>
      </div>
    </div>

    {/* Teacher Stats */}
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.name} className="flex items-center justify-between w-32 bg-gray-100 p-1 rounded-lg">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="text-xs font-semibold text-gray-800">{item.name}</span>
          </div>
          <span className="text-gray-600 text-xs font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
</div>


  {/* Schedule Section */}
  <div className="bg-white p-2 rounded-lg">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-semibold text-gray-700">Schedule</h3>
      <button className="px-2 py-1 bg-gray-100 rounded text-xs flex items-center gap-1">
        Today <span className="text-gray-500">▼</span>
      </button>
    </div>

    <div className="space-y-3">
      {scheduleData.map((item) => (
        <div key={item.title} className="flex items-start gap-3">
          <span className="text-xs text-gray-500 w-16">{item.time}</span>
          <div className={`flex items-center px-3 py-2 rounded-lg flex-1 ${item.color} text-xs font-medium`}>
            <span className="mr-2">📅</span> {item.title}
          </div>
        </div>
      ))}
    </div>
  </div>
</aside>


      </div>
    </div>
    </BaseLayout3>
  );
}