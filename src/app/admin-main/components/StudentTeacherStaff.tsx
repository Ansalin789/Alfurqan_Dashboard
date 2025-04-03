import React from "react";
import { PieChart, Pie, Tooltip } from "recharts";
import { ArrowUpRight } from "lucide-react";

const data = [
  {
    title: "Students",
    count: 1738,
    male: 1200,
    female: 538,
  },
  {
    title: "Teachers",
    count: 200,
    male: 100,
    female: 100,
  },
  {
    title: "Staffs",
    count: 180,
    male: 60,
    female: 120,
  },
];

const COLORS = ["#4B9EFF", "#FF9EE2"]; // Updated colors to match the image

const StudentTeacherStaff = () => {
  return (
    <div className="flex justify-center items-center gap-4 ">
      {data.map((item) => (
        <div
          key={item.title}
          className="bg-[#032848] text-white p-4 rounded-2xl w-[320px] shadow-lg h-[160px]"
        >
          {/* Top Section with Number and Icon */}
          <div className="flex justify-between items-center">
            <div className="text-2xl font-semibold">{item.count.toLocaleString()}</div>
            <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
              <ArrowUpRight size={14} />
            </div>
          </div>

          {/* Title */}
          <div className="text-[14px] mt-1">{item.title}</div>

          {/* Pie Chart and Legend */}
          <div className="flex items-center justify-between">
            <div className="flex text-sm text-gray-300 gap-2">
              <div className="flex items-center text-[14px]">
                <span className="w-2 h-2 bg-blue-500 rounded-[2px] mr-2"></span>
                <span>Male</span>
              </div>
              <div className="flex items-center text-[14px]">
                <span className="w-2 h-2 bg-pink-400 rounded-[2px] mr-2"></span>
                <span>Female</span>
              </div>
            </div>

            {/* Pie Chart with Different Sizes and Outline */}
            <PieChart width={100} height={90}>
              <Tooltip />
              {/* Male segment - larger */}
              <Pie
                data={[{ value: item.male }]}
                cx={50}
                cy={35}
                innerRadius={0}
                outerRadius={32}
                startAngle={-90}
                endAngle={-90 + ((item.male / (item.male + item.female)) * 360)}
                dataKey="value"
                animationBegin={0}
                animationDuration={500}
                animationEasing="ease-in-out"
                strokeWidth={0}
                fill={COLORS[0]}
              />
              {/* Female segment - smaller */}
              <Pie
                data={[{ value: item.female }]}
                cx={50}
                cy={35}
                innerRadius={0}
                outerRadius={27}
                startAngle={-90 + ((item.male / (item.male + item.female)) * 360)}
                endAngle={270}
                dataKey="value"
                animationBegin={0}
                animationDuration={500}
                animationEasing="ease-in-out"
                strokeWidth={0}
                fill={COLORS[1]}
              />
              {/* Outline for male segment */}
              <Pie
                data={[{ value: item.male }]}
                cx={50}
                cy={35}
                innerRadius={34}
                outerRadius={37}
                startAngle={-90}
                endAngle={-90 + ((item.male / (item.male + item.female)) * 360)}
                dataKey="value"
                animationBegin={0}
                animationDuration={500}
                animationEasing="ease-in-out"
                strokeWidth={0}
                fill={COLORS[0]}
              />
            </PieChart>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentTeacherStaff;