import { Card } from "@nextui-org/react";
import { useState } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
  Bar,
  LabelList,
  BarChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const lineData = [
  { month: "Jan", value: 30 },
  { month: "Feb", value: 45 },
  { month: "Mar", value: 55 },
  { month: "Apr", value: 40 },
  { month: "May", value: 60 },
  { month: "Jun", value: 50 },
  { month: "Jul", value: 80 },
  { month: "Aug", value: 75 },
  { month: "Sep", value: 65 },
  { month: "Oct", value: 70 },
  { month: "Nov", value: 60 },
  { month: "Dec", value: 55 },
];

const bardata = [
  { label: "Total Classes", value: 120, color: "bg-[#16C7F0]" },
  { label: "Ongoing Classes", value: 90, color: "bg-[#00579B]" },
  { label: "Upcoming Classes", value: 75, color: "bg-[#4A368F]" },
  { label: "Completed Classes", value: 60, color: "bg-[#87AFFF]" },
];

const pieData = [
  { name: "Trial Classes", value: 10, color: "#29CDFF" },
  { name: "Regular Classes", value: 40, color: "#993AFF" },
  { name: "Group Classes", value: 75, color: "#B388EB" },
];

export default function DashboardClasses() {
  const [duration, setDuration] = useState("Last 8 Months");
  const [pieRange, setPieRange] = useState("Today");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxValue = Math.max(...bardata.map((item) => item.value));
  const total = pieData.reduce((acc, item) => acc + item.value, 0);
  const [range, setRange] = useState("Today");

  return (
<div className="w-full max-w-[1365px] mx-auto ">
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">      {/* Line Chart Panel */}
      <div className="bg-white rounded-xl p-3 shadow-md h-[250px]  flex flex-col justify-between min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-semibold text-sm text-gray-800">Total Classes</h4>
          <select className="text-xs bg-gray-100 px-2 py-1 rounded">
            <option>Last 8 Months</option>
            <option>Last 6 Months</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={lineData}>
            <defs>
              <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#003C85" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#003C85" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#888888" fontSize={10} />
            <YAxis stroke="#888888" fontSize={10} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#000"
              fillOpacity={1}
              fill="url(#colorArea)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart Panel */}
      <Card className="p-3 rounded-lg shadow-md bg-white h-[250px] flex flex-col justify-between min-w-0">
        <h2 className="font-semibold text-sm text-gray-900 mb-2">
          Total Classes Overview
        </h2>
        <div className="space-y-2">
          {bardata.map((item, index) => (
            <button
              key={index}
              className="relative w-full focus:outline-none"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative bg-gray-200 h-4 rounded-full w-full">
                <div
                  className={`h-4 rounded-full ${item.color} relative transition-all duration-300`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                >
                  {hoveredIndex === index && (
                    <div className="absolute -top-6 right-0 bg-gray-900 text-white text-[10px] font-semibold px-2 py-[1px] rounded shadow">
                      {item.value}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap mt-3 gap-x-3 gap-y-1 text-[10px]">
          {bardata.map((item) => (
            <div key={item.color} className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
              <span className="text-gray-700 font-medium text-[10px]">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Donut Chart Panel */}
      <div className="bg-white rounded-xl shadow-md w-full max-w-[520px] h-[250px] p-4 flex flex-col items-center gap-3">
        {/* Header */}
        <div className="w-full flex justify-between items-center">
          <h3 className="font-semibold text-sm text-gray-900">
            Total Classes - Class wise
          </h3>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="bg-gray-100 text-xs rounded px-2 py-1"
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>

        {/* Donut Chart */}
        <div className="relative w-[100px] h-[100px] items-center justify-center">
          <PieChart width={180} height={150}>
            <Pie
              data={[{ value: 100 }]}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={75}
              startAngle={90}
              endAngle={-270}
              fill="#051937"
            />
            {pieData.map((item, index) => (
              <Pie
                key={index}
                data={[item, { value: total - item.value }]} // value and rest
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={52 + index * 7}
                outerRadius={57 + index * 7}
                startAngle={90}
                endAngle={-270}
                cornerRadius={6}
                stroke="none"
                isAnimationActive={false}
              >
                <Cell fill={item.color} stroke="none" />
                <Cell fill="transparent" stroke="none" />
              </Pie>
            ))}
          </PieChart>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <p className="text-[20px] font-bold text-gray-900 ml-20 mt-10">
              {total}
            </p>
            <p className="text-[11px] text-gray-500 ml-20">Classes</p>
          </div>
        </div>

        {/* Legend */}
        <div className="text-xs w-full flex flex-col gap-1 mt-2">
          {pieData.map((item) => (
            <div key={item.name} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span className="text-gray-700">{item.name}</span>
              </div>
              <span className="font-semibold text-gray-800">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>

  );
}
