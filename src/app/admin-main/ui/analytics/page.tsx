"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, TooltipProps, Cell } from "recharts"
import { CircleDollarSign, TrendingUp } from "lucide-react"
import Image from "next/image"
import BaseLayout4 from "@/components/BaseLayout4"

const revenueData = [
  { month: "Jan", amount: 5000, label: "$5K" },
  { month: "Feb", amount: 9000, label: "$9K" },
  { month: "Mar", amount: 3000, label: "$3K" },
  { month: "Apr", amount: 12000, label: "$12K" },
  { month: "May", amount: 15000, label: "$15K" },
  { month: "Jun", amount: 19000, label: "$19K" },
  { month: "Jul", amount: 30000, label: "$30K" },
  { month: "Aug", amount: 21000, label: "$21K" },
  { month: "Sep", amount: 16000, label: "$16K" },
  { month: "Oct", amount: 10000, label: "$10K" },
  { month: "Nov", amount: 3000, label: "$3K" },
  { month: "Dec", amount: 5000, label: "$5K" },
]

const visitorData = [
  { name: "Jan", Instagram: 320, Facebook: 240, Website: 280 },
  { name: "Feb", Instagram: 380, Facebook: 290, Website: 300 },
  { name: "Mar", Instagram: 280, Facebook: 220, Website: 250 },
  { name: "Apr", Instagram: 250, Facebook: 200, Website: 220 },
  { name: "May", Instagram: 300, Facebook: 250, Website: 280 },
  { name: "Jun", Instagram: 350, Facebook: 300, Website: 320 },
  { name: "Jul", Instagram: 400, Facebook: 350, Website: 380 },
  { name: "Aug", Instagram: 380, Facebook: 320, Website: 350 },
  { name: "Sep", Instagram: 340, Facebook: 280, Website: 300 },
]

const countryData = [
  { country: "United States", amount: 3800, flag: "🇺🇸" },
  { country: "Germany", amount: 1900, flag: "🇩🇪" },
  { country: "United Kingdom", amount: 2000, flag: "🇬🇧" },
  { country: "England", amount: 2500, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { country: "France", amount: 2050, flag: "🇫🇷" },
]

const transactions = [
  { id: 1, name: "Piyush Chawla", service: "Web Design", amount: 20000 },
  { id: 2, name: "Piyush Chawla", service: "Web Design", amount: 20000 },
  { id: 3, name: "Piyush Chawla", service: "Web Design", amount: 20000 },
]

const teacherTrials = [
  { name: "Abdullah S.", trials: 5, joined: 3 },
  { name: "Abdur R.", trials: 6, joined: 5 },
  { name: "Mariam H.", trials: 5, joined: 4 },
  { name: "Hassan I.", trials: 6, joined: 4 },
  { name: "Imran G.", trials: 4, joined: 3 },
  { name: "Hussain A.", trials: 5, joined: 5 },
]

const CustomBarLabel = (props: any) => {
  const { x, y, width, label } = props

  // Check if x or width is undefined or NaN
  if (x === undefined || width === undefined || isNaN(x) || isNaN(width)) {
    return null
  }

  return (
    <text x={x + width / 2} y={y - 10} fill="#64748b" textAnchor="middle" fontSize="12">
      {label}
    </text>
  )
}
const countriesData = [
    { name: "United States", flag: "/assets/images/flags/us.png", value: 110002, color: "#002c5f" },
    { name: "Germany", flag: "/assets/images/flags/germany.png", value: 103499, color: "#5b9bd5" },
    { name: "United Kingdom", flag: "/assets/images/flags/united-kingdom.png", value: 96998, color: "#002c5f" },
    { name: "England", flag: "/assets/images/flags/england.png", value: 89061, color: "#5b9bd5" },
    { name: "France", flag: "/assets/images/flags/france.png", value: 82000, color: "#002c5f" },
  ];
  
  const CountriesCard = () => {
    const maxValue = Math.max(...countriesData.map((c) => c.value)); // Find max for bar scaling
  
    return (
      <div className="bg-white p-5 rounded-xl shadow-md w-64 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Countries</h2>
  
        <div className="space-y-4">
          {countriesData.map((country) => (
            <div key={country.name}>
              {/* Country Row */}
              <div className="flex items-center justify-between">
                {/* Flag & Name */}
                <div className="flex items-center space-x-3">
                  <img src={country.flag} alt={country.name} className="w-6 h-6 rounded-full" />
                  <span className="text-[12px] text-gray-700">{country.name}</span>
                </div>
  
                {/* Value */}
                <span className="text-sm font-semibold text-gray-600">{country.value.toLocaleString()}</span>
              </div>
  
              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-gray-200 mt-1">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${(country.value / maxValue) * 100}%`,
                    background: country.color,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  const courseData = [
    { name: "Quran", value: 30, color: "#7f9cb6" },
    { name: "Arabic", value: 45, color: "#001d3d" },
    { name: "Islamic", value: 60, color: "#4a90e2" },
  ];
  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white text-gray-900 text-sm px-2 py-1 rounded shadow-md border">
          {payload[0]?.value}
        </div>
      );
    }
    return null;
  };
  
  const CoursesChart = () => {
    return (
      <div className="bg-white p-5 rounded-xl shadow-md w-64 border border-gray-200 ">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Courses</h2>
  
        <ResponsiveContainer width="100%" height={198}>
          <BarChart
            data={courseData}
            barCategoryGap={30} // Controls the gap between bars
          >
            <XAxis
              dataKey="name"
              tick={{ fill: "#7f9cb6", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip active={undefined} payload={undefined} />} />
            
            <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={35}> {/* Set bar width */}
              {courseData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
  
        <div className="flex justify-center mt-4 space-x-6">
          {courseData.map((entry) => (
            <div key={entry.name} className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-[12px] text-gray-700">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

export default function Home() {
  return (
    <BaseLayout4>
      {/* Main Content */}
      <div className="flex-1 overflow-auto scrollbar-hide">
        <div className="p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-4">Analytics</h1>

            {/* Revenue Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="col-span-1 bg-gradient-to-br from-[#002B3D] to-[#004B6B] text-white p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Total Income</h3>
                  <CircleDollarSign className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold mb-1">$8954.57</div>
                <div className="flex items-center text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>15%</span>
                </div>
                <div className="mt-2">
                  <svg width="100%" height="40" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M0,40 C20,20 40,60 60,40 C80,20 100,60 120,40 C140,20 160,60 180,40 C190,30 200,40 200,40"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="2"
                    />
                    <path
                      d="M0,40 C20,20 40,60 60,40 C80,20 100,60 120,40 C140,20 160,60 180,40 C190,30 200,40 200,40"
                      stroke="white"
                      strokeWidth="2"
                      strokeDasharray="3 3"
                    />
                  </svg>
                </div>
              </div>

              <div className="col-span-3 bg-white p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Revenue</h3>
                  <select className="bg-transparent border rounded-lg px-2 py-1 text-sm">
                    <option>2023</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={revenueData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} display="none" />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        padding: "8px",
                      }}
                    />
                    <Bar
                      dataKey="amount"
                      fill="#60A5FA"
                      radius={[4, 4, 0, 0]}
                      barSize={25}
                      label={<CustomBarLabel />}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Visitor Insights & Countries/Courses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Visitor Insights</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={visitorData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      padding: "8px",
                    }}
                  />
                  <Line type="monotone" dataKey="Instagram" stroke="#0EA5E9" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Facebook" stroke="#6366F1" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Website" stroke="#10B981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <CountriesCard/>
              {/* Courses */}
              <CoursesChart/>
            </div>
          </div>

          {/* Recent Transactions & Trials */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
                <select className="bg-transparent border rounded-lg px-2 py-1 text-sm">
                  <option>7 days</option>
                </select>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="pb-2 font-medium text-sm">Client</th>
                    <th className="pb-2 font-medium text-sm">Service</th>
                    <th className="pb-2 font-medium text-sm">Amount</th>
                    <th className="pb-2 font-medium text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-t">
                      <td className="py-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full mr-2 flex items-center justify-center overflow-hidden">
                            <Image src="/placeholder.svg?height=32&width=32" alt={tx.name} width={32} height={32} />
                          </div>
                          <span className="font-medium text-sm">{tx.name}</span>
                        </div>
                      </td>
                      <td className="py-2 text-gray-600 text-sm">{tx.service}</td>
                      <td className="py-2 font-medium text-sm">${tx.amount}</td>
                      <td className="py-2">
                        <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          Paid
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Trials Taken by Teacher</h3>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="pb-2 font-medium text-sm">Name</th>
                    <th className="pb-2 font-medium text-sm">Total Trials</th>
                    <th className="pb-2 font-medium text-sm">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {teacherTrials.map((teacher) => (
                    <tr key={teacher.name} className="border-t">
                      <td className="py-2 font-medium text-sm">{teacher.name}</td>
                      <td className="py-2 text-gray-600 text-sm">{teacher.trials}</td>
                      <td className="py-2 text-gray-600 text-sm">{teacher.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout4>
  )
}

