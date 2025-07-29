"use client";

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
  classscheduleRegular: {
    _id: string | null;
    totalRegularClassCount: number;
  }[];
  evaluationStats: {
    _id: string | null;
    totalTrialClassCount: number;
  }[];
  classscheduleGroup: {
    _id: string | null;
    totalGroupClassCount: number;
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
  const [lineData, setLineData] = useState<{ month: string; value: number }[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [barData, setBarData] = useState<
    { label: string; value: number; color: string }[]
  >([]);
  const [range, setRange] = useState("Today");
  const [pieData, setPieData] = useState<PieData[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("AdminAuthToken");
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
        "https://api.blackstoneinfomaticstech.com/classShedule/totalclasses?dateRange=last8months",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
          typeof window !== "undefined"
            ? localStorage.getItem("AdminAuthToken")
            : null;

        if (!token) {
          console.error("❌ AdminAuthToken not found");
          return;
        }
        const response = await fetch(
          "https://api.blackstoneinfomaticstech.com/classShedule/classstatuscount",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data: ClassStatusData = await response.json();

        const formattedData = [
          {
            label: "Upcoming",
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
            label: "Total Classes",
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
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("AdminAuthToken")
          : null;
      if (!token) {
        console.error("❌ AdminAuthToken not found");
        return;
      }

      try {
        const response = await fetch(
          "https://api.blackstoneinfomaticstech.com/classShedule/classwisecount",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data: ClassWiseCountResponse = await response.json();
        // Extract values safely
        const regular =
          data.classscheduleRegular?.[0]?.totalRegularClassCount ?? 0;
        const trial = data.evaluationStats?.[0]?.totalTrialClassCount ?? 0;
        const group = data.classscheduleGroup?.[0]?.totalGroupClassCount ?? 0;
        const totalCount = regular + trial + group;

        setPieData([
          { name: "Regular", value: regular, color: "#74E7AA" },
          { name: "Trial", value: trial, color: "#A9B1FF" },
          { name: "Group", value: group, color: "#FFA1A2" }, // <-- changed to pink
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
        {/* Line Chart Panel — Updated to match design */}
        <Card className="rounded-2xl p-4 shadow-md h-[250px] flex flex-col justify-between min-w-0 bg-[#FAFAFB] dark:bg-[#343434]">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-sm text-[#010E30] dark:text-[#FFFFFF]">
              Total Classes
            </h4>
            <select
              className="text-xs bg-white dark:bg-[#2D2D2D] text-[#010E30] dark:text-[#FFFFFF] px-2 py-[2px] rounded border border-gray-200 dark:border-gray-600"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option>Last 8 Months</option>
              <option>Last 6 Months</option>
            </select>
          </div>

          {error ? (
            <div className="text-center text-red-400 text-sm">{error}</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={lineData}>
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#87AFFF" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#87AFFF" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  stroke="currentColor"
                  strokeOpacity={0.5}
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  className="text-[#010E30] dark:text-[#FFFFFF]"
                />
                <YAxis
                  stroke="currentColor"
                  strokeOpacity={0.5}
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  className="text-[#010E30] dark:text-[#FFFFFF]"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FAFAFB",
                    border: "1px solid #E5E7EB",
                    borderRadius: "6px",
                    color: "#010E30",
                    fontSize: "12px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="basis"
                  dataKey="value"
                  stroke="#87AFFF"
                  fillOpacity={1}
                  fill="url(#blueGradient)"
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Bar Chart Panel (unchanged) */}
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

        {/* Donut Chart Panel (unchanged) */}
        <Card className="p-3 rounded-lg shadow-md bg-[#FAFAFB] dark:bg-[#343434] h-[250px] flex flex-col justify-between min-w-0 text-[#010E30] dark:text-[#FFFFFF]">
          <h2 className="font-semibold text-sm mb-2 text-[#010E30] dark:text-[#FFFFFF]">Total Classes - Class Wise</h2>
          <div className="flex items-center justify-center h-full">
            <div className="relative flex flex-col items-center justify-center w-[130px] h-[130px] ">
              <PieChart width={130} height={130}>
                {pieData.map((item, index) => (
                  <Pie
                    key={index}
                    data={[item, { value: total - item.value }]}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={50 + index * 5}
                    outerRadius={53 + index * 5}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                    isAnimationActive={false}
                  >
                    <Cell fill={item.color} />
                    <Cell fill="transparent" />
                  </Pie>
                ))}
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold leading-none">{total}</p>
                <p className="text-[8px] text-[#010E30] dark:text-[#FFFFFF] mt-1 leading-none">
                  TOTAL CLASSES
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 ml-6">
              {pieData.map((item) => {
                const percentage =
                  total > 0 ? ((item.value / total) * 100).toFixed(0) : 0;
                return (
                  <div
                    key={item.name}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span>{item.name} Class</span>
                    </div>
                    <span className="font-semibold ml-4">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardClasses;