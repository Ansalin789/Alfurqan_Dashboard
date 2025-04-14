"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, DotProps } from "recharts"
import BaseLayout4 from "@/components/BaseLayout4"



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



const data = [
  { client: "Robert", course: "Arabic", amount: "$ 20.00", status: "Paid" },
  { client: "Ryan", course: "Quran", amount: "$ 15.00", status: "Paid" },
  { client: "James", course: "Arabic", amount: "$ 10.00", status: "Paid" },
];

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
    { name: "United States", flag: "/assets/images/flags/us.png", value: 110002, color: "#012A4A" },
    { name: "Germany", flag: "/assets/images/flags/germany.png", value: 103499, color: "#012A4A" },
    { name: "United Kingdom", flag: "/assets/images/flags/united-kingdom.png", value: 96998, color: "#012A4A" },
    { name: "England", flag: "/assets/images/flags/england.png", value: 89061, color: "#012A4A" },
    { name: "France", flag: "/assets/images/flags/france.png", value: 82000, color: "#012A4A" },
  ];
  
  const CountriesCard = () => {
    const maxValue = Math.max(...countriesData.map((c) => c.value)); // Find max for bar scaling
  
    return (
      <div className="bg-white p-5 rounded-xl shadow-md w-full border border-gray-200">
        <h2 className="text-base font-semibold mb-3 text-gray-700">Countries</h2>
  
        <div className="space-y-5">
          {countriesData.map((country) => (
            <div key={country.name}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img src={country.flag} alt={country.name} className="w-5 h-5 rounded-full" />
                  <span className="text-xs text-gray-700">{country.name}</span>
                </div>
                <span className="text-xs font-medium text-gray-600">${country.value.toLocaleString()}</span>
              </div>
  
              <div className="w-full h-2 rounded-full bg-[#0092FF] mt-1">
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
  
  
  const CoursesChart = () => {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md w-full border border-gray-200">
  <h2 className="text-base font-semibold mb-3 text-gray-700">Courses</h2>

  <ResponsiveContainer width="100%" height={195}>
    <BarChart
      data={courseData}
      barCategoryGap={30}
      onMouseMove={() => {}} // prevents default active shape overlay
    >
      {/* Hide XAxis completely */}
      <XAxis hide />
      {/* Tooltip only shows value in transparent style */}
      <Tooltip
        content={({ active, payload }) =>
          active && payload?.length ? (
            <div className="bg-white text-gray-800 text-sm px-2 py-1 rounded shadow border border-gray-200">
              {payload[0]?.value}
            </div>
          ) : null
        }
        cursor={{ fill: "transparent" }}
      />

      {/* Bar without hover highlight */}
      <Bar dataKey="value" radius={[15, 15, 15, 15]} barSize={35} activeBar={false}>
        {courseData.map((entry) => (
          <Cell key={entry.name} fill={entry.color} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>

  {/* Legend below the chart */}
  <div className="flex justify-center mt-4 space-x-6">
    {courseData.map((entry) => (
      <div key={entry.name} className="flex items-center space-x-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: entry.color }}
        ></div>
        <span className="text-[12px] text-gray-700">{entry.name}</span>
      </div>
    ))}
  </div>
</div>

    );
  };
  
  const CustomDot = (props: DotProps & { payload?: any }) => {
    const { cx, cy, payload } = props;
    // This assumes July is the 7th item (index 6) and you're plotting 'Instagram'
    if (payload?.name === "Jul" && cx !== undefined && cy !== undefined) {
      return (
        <circle cx={cx} cy={cy} r={6} fill="#0F172A" stroke="#fff" strokeWidth={2} />
      );
    }
    return null;
  };
  
  
  const CustomLegend = () => (
    <div className="flex justify-center mt-4 space-x-8 text-sm font-medium text-slate-700">
      <div className="flex items-center space-x-2">
        <span className="w-3 h-3 rounded-full bg-[#0F172A]"></span>
        <span>Instagram</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="w-3 h-3 rounded-full bg-[#94A3B8]"></span>
        <span>Facebook</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="w-3 h-3 rounded-full bg-[#3B82F6]"></span>
        <span>Website</span>
      </div>
    </div>
  );

  const revenueDatas = [
    { month: "Jan", amount: 15 },
    { month: "Feb", amount: 19 },
    { month: "Mar", amount: 13 },
    { month: "Apr", amount: 12 },
    { month: "May", amount: 15 },
    { month: "Jun", amount: 19 },
    { month: "Jul", amount: 28 },
    { month: "Aug", amount: 21 },
    { month: "Sep", amount: 16 },
    { month: "Oct", amount: 10 },
    { month: "Nov", amount: 13 },
    { month: "Dec", amount: 15 },
  ];
  
  const getBarColor = (value: number) => {
    if (value >= 25) return "#0f172a"; // darkest
    if (value >= 20) return "#3b82f6"; // strong blue
    if (value >= 15) return "#60a5fa"; // medium blue
    if (value >= 10) return "#93c5fd"; // light blue
    return "#bae6fd"; // lightest
  };
  
export default function Home() {
  return (
    <BaseLayout4>
      {/* Main Content */}
      <div className="flex-1 overflow-auto scrollbar-hide">
        <div className="p-5 mr-6">
          <div className="mb-3">
            <h1 className="text-lg font-bold mb-4">Analytics</h1>
            </div>
            {/* Revenue Section */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-3">
  {/* Total Income Card */}
  <div className="bg-[#203e7b] text-white rounded-2xl p-3 relative overflow-hidden flex flex-col justify-left items-center h-40 w-full">
  <h3 className="text-sm font-medium mb-1">Total Income</h3>
  <div className="text-2xl md:text-3xl font-bold mb-1">$8954.57</div>
  <div className="flex items-center text-sm text-white gap-1">
    <div className="rounded-full border border-white p-1">
      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 5l5 5H5l5-5z" clipRule="evenodd" />
      </svg>
    </div>
    <span>15%</span>
  </div>

  {/* Decorative Wave Background */}
  <div className="absolute bottom-0 left-0 w-full">
    <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-16">
      <path d="M0.00,49.98 C150.00,150.00 350.00,-50.00 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" fill="rgba(255,255,255,0.1)" />
      <path d="M0.00,49.98 C150.00,150.00 350.00,-50.00 500.00,49.98" stroke="white" strokeWidth="4" fill="none" />
    </svg>
  </div>
</div>


  {/* Table Section */}
  <div className="col-span-3">
    <div className="bg-white rounded-xl shadow-lg overflow-x-auto w-full">
      <table className="w-full min-w-[500px] text-xs">
        <thead className="bg-[#203e7b] text-white">
          <tr>
            <th className="py-3 px-4 text-center font-semibold">Clients</th>
            <th className="py-3 px-4 text-center font-semibold">Course</th>
            <th className="py-3 px-4 text-center font-semibold">Amount</th>
            <th className="py-3 px-4 text-center font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="text-black">
          {data.map((row) => (
            <tr key={row.client} className="border-b last:border-none">
              <td className="py-3 px-4 text-center">{row.client}</td>
              <td className="py-3 px-4 text-center">{row.course}</td>
              <td className="py-3 px-4 text-center">{row.amount}</td>
              <td className="py-3 px-4 text-center">{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

          
          {/* Visitor Insights & Countries/Courses */}
<div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
  {/* Visitor Insights spans 2 columns on lg+ */}
  <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-lg">
      <h3 className="text-base font-semibold text-slate-800 mb-4">Visitor Insights</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={visitorData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              padding: "10px",
              fontSize:"13px"
            }}
          />
          <Line
            type="monotone"
            dataKey="Instagram"
            stroke="#0F172A"
            strokeWidth={3.5}
            dot={<CustomDot />}
          />
          <Line
            type="monotone"
            dataKey="Facebook"
            stroke="#94A3B8"
            strokeWidth={3.5}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Website"
            stroke="#3B82F6"
            strokeWidth={3.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <CustomLegend />
    </div>

  {/* Countries */}
  <div className="lg:col-span-1">
    <CountriesCard />
  </div>

  {/* Courses */}
  <div className="lg:col-span-1">
    <CoursesChart />
  </div>
</div>


          {/* Recent Transactions & Trials */}
          <div className="col-span-3 bg-white p-4 rounded-xl shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-base font-semibold text-slate-700">Revenue</h3>
      <select className="bg-transparent border rounded-lg px-2 py-1 text-xs text-slate-500">
        <option>2023</option>
      </select>
    </div>

    <ResponsiveContainer width="100%" height={170}>
      <BarChart
        data={revenueDatas}
        margin={{ top: 15, right: 10, left: 10, bottom: 0 }}
      >
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#94a3b8", fontSize: 12 }}
        />
        <YAxis hide />
        <CartesianGrid vertical={false} horizontal={false} />
        <Tooltip
          cursor={{ fill: "transparent" }}
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: "10px",
            padding: "10px",
            fontSize:"13px"
          }}
          formatter={(value: number) => [`$${value}K`, "Revenue"]}
        />
        <Bar
          dataKey="amount"
          radius={[15, 15, 15, 15]}
          barSize={32}
          label={{
            position: "top",
            formatter: (value: number) => `$${value}K`,
            fill: "#0f172a",
            fontSize: 10,
          }}
        >
          {revenueDatas.map((entry) => (
            <Cell key={`cell-${entry.month}`} fill={getBarColor(entry.amount)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
        </div>
      </div>
    </BaseLayout4>
  )
}

