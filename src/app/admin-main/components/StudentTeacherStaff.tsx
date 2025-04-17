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

const COLORS = ["#4B9EFF", "#FF9EE2"];

const StudentTeacherStaff = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-4 ">
      {data.map((item) => (
        <div
          key={item.title}
          className="bg-[#032848] text-white p-4 rounded-2xl w-[350px] shadow-lg h-[120px]"
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
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col sm:flex-row text-sm text-gray-300 gap-2">
              <div className="flex items-center text-[14px]">
                <span className="w-2 h-2 bg-blue-500 rounded-[2px] mr-2"></span>
                <span>Male</span>
              </div>
              <div className="flex items-center text-[14px]">
                <span className="w-2 h-2 bg-pink-400 rounded-[2px] mr-2"></span>
                <span>Female</span>
              </div>
            </div>

            {/* Responsive Pie Chart */}
            <div className="relative -mr-2 -mt-4">
              <PieChart width={70} height={50}>
                <Tooltip />
                {/* Male segment */}
                <Pie
                  data={[{ value: item.male }]}
                  cx={35}
                  cy={18}
                  innerRadius={0}
                  outerRadius={18}
                  startAngle={-90}
                  endAngle={-90 + ((item.male / (item.male + item.female)) * 360)}
                  fill={COLORS[0]}
                  stroke="none"
                  dataKey="value"
                />
                {/* Female segment */}
                <Pie
                  data={[{ value: item.female }]}
                  cx={35}
                  cy={18}
                  innerRadius={0}
                  outerRadius={14}
                  startAngle={-90 + ((item.male / (item.male + item.female)) * 360)}
                  endAngle={270}
                  fill={COLORS[1]}
                  stroke="none"
                  dataKey="value"
                />
                {/* Male outline */}
                <Pie
                  data={[{ value: item.male }]}
                  cx={35}
                  cy={18}
                  innerRadius={20}
                  outerRadius={22}
                  startAngle={-90}
                  endAngle={-90 + ((item.male / (item.male + item.female)) * 360)}
                  fill={COLORS[0]}
                  stroke="none"
                  dataKey="value"
                />
              </PieChart>
            </div>
          </div>
          
        </div>
      ))}
    </div>
  );
};

export default StudentTeacherStaff;