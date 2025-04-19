"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from "recharts";

const barData = [
  { name: "Total Students", value: 100, color: "#012A4A" },
  { name: "Students on Hold", value: 50, color: "#A6C3E5" },
  { name: "Active Students", value: 80, color: "#6D5DD3" },
  { name: "Inactive Students", value: 50, color: "#00CFFF" },
  { name: "Students on Break", value: 60, color: "#007BFF" },

];
const countriesData = [
  { name: "United States", flag: "/assets/images/flags/us.png", value: 110002 },
  { name: "Germany", flag: "/assets/images/flags/germany.png", value: 103499 },
  {
    name: "United Kingdom",
    flag: "/assets/images/flags/united-kingdom.png",
    value: 96998,
  },
  { name: "England", flag: "/assets/images/flags/england.png", value: 89061 },
];
const genderData = [
  { name: "Female", value: 40, color: "#FF82F5" },
  { name: "Male", value: 60, color: "#00CFFF" }
];
const maxValue = Math.max(...countriesData.map((c) => c.value));

const StudentsRecord = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-14 w-full">
    {/* Student Record */}
    <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 w-full lg:max-w-[580px] h-auto lg:h-[250px]">
      <h2 className="text-[16px] font-semibold text-gray-800 mb-4">Student Record</h2>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="space-y-4 text-xs mb-3 sm:mb-0 sm:mr-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#012A4A]"></div>
            <span>Total Students</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#A6C3E5]"></div>
            <span>Students on Hold</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#6D5DD3]"></div>
            <span>Active Students</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00CFFF]"></div>
            <span>Inactive Students</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#007BFF]"></div>
            <span>Students on Break</span>
          </div>
        </div>
        <div className="flex-1 h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barSize={40}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="name" axisLine={false} tick={false} />
              <YAxis hide />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  
    {/* Gender Chart */}
    <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 w-full lg:max-w-[280px] h-auto lg:h-[250px] flex flex-col items-center relative">
      <h2 className="text-[16px] font-semibold text-gray-800 self-start">Gender</h2>
      <div className="relative w-full h-[150px] sm:h-[170px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={genderData}
              dataKey="value"
              cx="50%"
              cy="90%"
              startAngle={180}
              endAngle={0}
              innerRadius={70}
              outerRadius={90}
            >
              {genderData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute left-1/2 bottom-[25px] w-1 h-[45px] bg-[#00CFFF] transform -translate-x-1/2 rotate-[40deg] origin-bottom rounded-sm"></div>
      </div>
      <div className="flex justify-between w-full px-6 text-gray-700 text-[14px] mt-2">
        <div className="flex flex-col items-center">
          <span className="text-[18px] font-bold">40%</span>
          <span className="text-[12px]">Female</span>
          <div className="w-10 h-1 bg-[#FF82F5] mt-1 rounded-full"></div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[18px] font-bold">60%</span>
          <span className="text-[12px]">Male</span>
          <div className="w-10 h-1 bg-[#00CFFF] mt-1 rounded-full"></div>
        </div>
      </div>
    </div>
  
    {/* Countries Block */}
    <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 w-full lg:max-w-[280px] h-auto lg:h-[250px] space-y-4">
      <h2 className="text-[16px] font-semibold text-gray-800">Countries</h2>
      {countriesData.map((country, i) => (
        <div key={i} className="flex items-center gap-2">
          <img src={country.flag} alt={country.name} className="w-5 h-5 rounded-full" />
          <div className="w-full">
            <div className="flex justify-between text-[12px] font-medium text-gray-800">
              <span>{country.name}</span>
              <span className="text-[#809FB8]">{country.value.toLocaleString()}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
              <div
                className="h-2 bg-[#012A4A] rounded-full"
                style={{ width: `${(country.value / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default StudentsRecord;
