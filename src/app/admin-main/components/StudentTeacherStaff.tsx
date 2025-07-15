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
        "https://api.blackstoneinfomaticstech.com/dashboard/admin/count",
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
    <div className="flex flex-col md:flex-row justify-center items-center gap-4 ">
      {data.map((item) => (
        <div
          key={item.title}
          className="bg-[#FFFFFF] flex flex-row justify-between  p-4 rounded-2xl w-[350px] shadow-lg h-[120px]"
        >
          <div>
            <div className="text-[14px] text-black mt-1">{item.title}</div>

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
          <div className="relative mt-6 flex justify-center">
            <PieChart width={160} height={100} style={{ display: 'block', margin: '0 auto' }}>
              <Tooltip content={<CustomTooltip />} />
              {/* Male segment */}
              <Pie
                data={[{ name: "male", value: item.male }]}
                cx={35}
                cy={18}
                innerRadius={0}
                outerRadius={20}
                startAngle={-90}
                endAngle={-90 + (item.male / (item.male + item.female)) * 360}
                fill={COLORS[0]}
                stroke="none"
                dataKey="value"
              />
              {/* Female segment */}
              <Pie
                data={[{ name: "female", value: item.female }]}
                cx={35}
                cy={18}
                innerRadius={0}
                outerRadius={14}
                startAngle={-90 + (item.male / (item.male + item.female)) * 360}
                endAngle={270}
                fill={COLORS[1]}
                stroke="none"
                dataKey="value"
              />
              {/* Male outline */}
              <Pie
                data={[{ name: "male", value: item.male }]}
                cx={35}
                cy={18}
                innerRadius={20}
                outerRadius={22}
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
