"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip } from "recharts";
import { ArrowUpRight } from "lucide-react";
interface DashboardCount {
  totalStudents: number;
  maleStudents: number;
  femaleStudents: number;
  totalTeachers: number;
  maleTeachers: number;
  femaleTeachers: number;
  totalStaffs: number;
  maleStaffs: number;
  femaleStaffs: number;
}

interface GroupedData {
  title: string;
  count: number;
  male: number;
  female: number;
}

const StudentTeacherStaff = () => {
  const COLORS = ["#72DAF3", "#EF95F4", "#E5E5E5"];
  const [data, setData] = useState<GroupedData[]>([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("AdminAuthToken");
      if (token) {
        fetchData(token);
      } else {
        console.log("No auth token found.");
      }
    }
  }, []);

  const fetchData = async (token: string) => {
    try {
      const res = await fetch(
        "http://localhost:5001/dashboard/admin/count",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json: DashboardCount = await res.json();

      const grouped: GroupedData[] = [
        {
          title: "Students",
          count: json.totalStudents,
          male: json.maleStudents,
          female: json.femaleStudents,
        },
        {
          title: "Teachers",
          count: json.totalTeachers,
          male: json.maleTeachers,
          female: json.femaleTeachers,
        },
        {
          title: "Staffs",
          count: json.totalStaffs,
          male: json.maleStaffs,
          female: json.femaleStaffs,
        },
      ];

      setData(grouped);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white text-black text-xs px-2 py-1 rounded shadow-sm">
          <p>{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
<div className="flex flex-wrap gap-4 p-0 w-full">
  {data.map((item) => (
    <div
      key={item.title}
      className="bg-white dark:bg-[#343434] flex flex-row justify-between items-center p-4 rounded-2xl shadow-lg h-[120px] min-w-[232px] w-full sm:w-[58%] lg:w-[32%] xl:w-[30%]"
    >
          <div>
            <div className="text-[14px] text-black mt-1 dark:text-[#fff]">
              {item.title}
            </div>

            {/* Top Section with Number and Icon */}
            <div className="flex justify-between text items-center">
              <div className="text-2xl font-semibold">
                {(item.count ?? 0).toLocaleString()}
              </div>
            </div>

            {/* Pie Chart and Legend */}
            <div className="flex items-center mt-2">
              <div className="flex flex-col sm:flex-row text-sm text-black-300 gap-2">
                <div className="flex items-center text-[12px]">
                  <span className="w-2 h-2 bg-[#EF95F4] rounded-[2px] mr-2"></span>
                  <span>Female</span>
                </div>
                <div className="flex items-center text-[12px]">
                  <span className="w-2 h-2 bg-[#72DAF3] rounded-[2px] mr-2"></span>
                  <span>Male</span>
                </div>
              </div>
            </div>
          </div>

          {/* Responsive Pie Chart */}
          <div className="flex items-center justify-center w-[88px] h-[88px]">
          <PieChart width={88} height={80}>
              {/* slightly larger chart to fit full pie */}
              <Tooltip content={<CustomTooltip />} />
              {/* Male segment */}
              <Pie
                data={[{ name: "male", value: item.male }]}
                cx={50}
                cy={40}
                innerRadius={0}
                outerRadius={30} // larger pie
                startAngle={-90}
                endAngle={-90 + (item.male / (item.male + item.female)) * 360}
                fill={COLORS[0]}
                stroke="none"
                dataKey="value"
              />
              {/* Female segment */}
              <Pie
                data={[{ name: "female", value: item.female }]}
                cx={50}
                cy={40}
                innerRadius={0}
                outerRadius={24} // slightly smaller for layering
                startAngle={-90 + (item.male / (item.male + item.female)) * 360}
                endAngle={270}
                fill={COLORS[1]}
                stroke="none"
                dataKey="value"
              />
              {/* Male outline ring */}
              <Pie
                data={[{ name: "male", value: item.male }]}
                cx={50}
                cy={40}
                innerRadius={30}
                outerRadius={32} // small outer ring
                startAngle={-90}
                endAngle={-90 + (item.male / (item.male + item.female)) * 360}
                fill={COLORS[2]}
                stroke="none"
                dataKey="value"
              />
            </PieChart>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentTeacherStaff;
