'use client';

import { Card } from "@nextui-org/react";
import { useState, useEffect } from "react";
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

interface ClassScheduleData {
  date: string;
  totalClass: number;
}

interface ClassStatusData {
  total: number;
  pendingPercentage: string;
  reschedulePercentage: string;
  completePercentage: string;
}

interface ClassWiseCountResponse {
  classschedule: {
    _id: string | null;
    totalRegularClassCount: number;
  }[];
  evaluationStats: {
    _id: string | null;
    totalTrialClassCount: number;
  }[];
}

interface PieData {
  name: string;
  value: number;
  color: string;
}

const DashboardClasses = () => {
  const [duration, setDuration] = useState("Last 8 Months");
  const [pieRange, setPieRange] = useState("Today");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lineData, setLineData] = useState<{ month: string; value: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [barData, setBarData] = useState<{ label: string; value: number; color: string }[]>([]);
  const [range, setRange] = useState("Today");
  const [pieData, setPieData] = useState<PieData[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('AdminAuthToken');
      if (token) {
        fetchClassData(token);
      } else {
        console.log("No auth token found.");
      }
    }
  }, []);

  const fetchClassData = async (token: string) => {
    try {
      const response = await fetch(
        "https://api.blackstoneinfomaticstech.com/classShedule/totalclasses?dateRange=last8months",{
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });        
        const data: ClassScheduleData[] = await response.json();

      const transformedData = data.map((item) => ({
        month: item.date,
        value: item.totalClass,
      }));

      setLineData(transformedData);
    } catch (err) {
      setError("Failed to load total classes data");
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchClassStatus = async () => {
      try {
         const token =
    typeof window !== "undefined" ? localStorage.getItem("AdminAuthToken") : null;

  if (!token) {
    console.error("❌ AdminAuthToken not found");
    return;
  }
        const response = await fetch(
          "https://api.blackstoneinfomaticstech.com/classShedule/classstatuscount",{
            headers:{
               'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          }
        );
        const data: ClassStatusData = await response.json();

        const formattedData = [
          {
            label: "Pending",
            value: parseFloat(data.pendingPercentage),
            color: "bg-[#8B93D2]",
          },
          {
            label: "Rescheduled",
            value: parseFloat(data.reschedulePercentage),
            color: "bg-[#9AD7D5]",
          },
          {
            label: "Completed",
            value: parseFloat(data.completePercentage),
            color: "bg-[#B48BD2]",
          },
          {
            label: "total",
            value: data.total,
            color: "bg-[#87AFFF]",
          },
        ];

        setBarData(formattedData);
      } catch (error) {
        console.error("Failed to fetch class status", error);
      }
    };

    fetchClassStatus();
  }, []);

 useEffect(() => {
  const fetchClassWiseCount = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('AdminAuthToken') : null;
    if (!token) {
      console.error("❌ AdminAuthToken not found");
      return;
    }

    try {
      const response = await fetch("https://api.blackstoneinfomaticstech.com/classShedule/classwisecount", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data: ClassWiseCountResponse = await response.json();
      const regular = data.classschedule?.[0]?.totalRegularClassCount || 0;
      const trial = data.evaluationStats?.[0]?.totalTrialClassCount || 0;
      const totalCount = regular + trial;

      setPieData([
        { name: "Regular", value: regular, color: "#74E7AA" },
        { name: "Trial", value: trial, color: "#A9B1FF" },
      ]);
      setTotal(totalCount);
    } catch (error) {
      console.error("❌ Error fetching class wise count:", error);
    }
  };

  fetchClassWiseCount();
}, []);

  const maxValue = Math.max(...barData.map((item) => item.value), 100);

  return (
    <div className="w-full max-w-[1365px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Line Chart Panel */}
        <div className="bg-[#FAFAFB] dark:bg-[#343434] rounded-xl p-3 shadow-md h-[250px] flex flex-col justify-between min-w-0">
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-semibold text-sm text-[#010E30] dark:text-[#FFFFFF]">
              Total Classes
            </h4>
            <select className="text-xs bg-gray-100 dark:bg-[#444] dark:text-[#FFFFFF] px-2 py-1 rounded">
              <option className="dark:text-[#010E30]">Last 8 Months</option>
              <option className="dark:text-[#010E30]">Last 6 Months</option>
            </select>
          </div>

          {error ? (
            <div className="text-center text-red-500 dark:text-red-400 text-sm">{error}</div>
          ) : (
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
          )}
        </div>
        
        {/* Bar Chart Panel */}
        <Card className="p-3 rounded-lg shadow-md bg-[#FAFAFB] dark:bg-[#343434] h-[250px] flex flex-col justify-between min-w-0">
          <h2 className="font-semibold text-sm text-[#010E30] dark:text-[#FFFFFF]">
            Total Classes Overview
          </h2>
          <div className="space-y-2">
            {barData.map((item, index) => (
              <button
                key={index}
                className="relative w-full focus:outline-none"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative bg-gray-200 dark:bg-[#444] h-4 rounded-full w-full">
                  <div
                    className={`h-4 rounded-full ${item.color} relative transition-all duration-300`}
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                  >
                    {hoveredIndex === index && (
                      <div className="absolute -top-6 right-0 bg-gray-900 dark:bg-gray-700 text-white text-[10px] font-semibold px-2 py-[1px] rounded shadow">
                        {item.value}%
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap mt-3 gap-x-3 gap-y-1 text-[10px]">
            {barData.map((item) => (
              <div key={item.label} className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                <span className="text-[#010E30] dark:text-[#FFFFFF] font-medium text-[10px]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Donut Chart Panel */}
        <div className="bg-[#FAFAFB] dark:bg-[#343434] rounded-xl shadow-md w-full max-w-[520px] h-[250px] p-4 flex flex-col items-center gap-3">
          <div className="w-full flex justify-between items-center">
            <h3 className="font-semibold text-sm text-[#010E30] dark:text-[#FFFFFF]">
              Total Classes - Class wise
            </h3>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="bg-gray-100 dark:bg-[#444] dark:text-[#FFFFFF] text-xs rounded px-2 py-1"
            >
              <option className="dark:text-[#010E30]">Today</option>
              <option className="dark:text-[#010E30]">This Week</option>
              <option className="dark:text-[#010E30]">This Month</option>
            </select>
          </div>

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
                  data={[item, { value: total - item.value }]}
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

            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <p className="text-[20px] font-bold text-[#010E30] dark:text-[#FFFFFF] ml-20 mt-10">
                {total}
              </p>
              <p className="text-[11px] text-[#010E30] dark:text-[#FFFFFF] ml-20">Classes</p>
            </div>
          </div>

          <div className="text-xs w-full flex flex-col gap-1 mt-2">
            {pieData.map((item) => (
              <div
                key={item.name}
                className="flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span className="text-[#010E30] dark:text-[#FFFFFF]">{item.name}</span>
                </div>
                <span className="font-semibold text-[#010E30] dark:text-[#FFFFFF]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardClasses;