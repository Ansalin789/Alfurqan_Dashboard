"use client";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image"; // ✅ Correct Import

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

//Total trail class

const TotalScheduledChart = () => {
  const data = [
    { name: "Completed", value: 134, color: "#012A4A" }, // Dark Blue
    { name: "Scheduled", value: 63, color: "#3084D6" }, // Medium Blue
    { name: "No Response", value: 85, color: "#6C94B3" }, // Light Blue
    { name: "Cancelled", value: 48, color: "#9AC3E3" }, // Lightest Blue
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-64 border border-gray-200 -ml-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-900">
          Total Trial Classes
        </h2>
        <MoreHorizontal size={16} className="text-gray-500" />
      </div>

      {/* Pie Chart with Centered Text */}
      <div className="relative flex items-center justify-center mt-2">
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={65}
              dataKey="value"
              startAngle={90}
              endAngle={-270} // Ensures the gap is at the top
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center text inside the chart */}
        <div className="absolute text-center">
          <div className="text-2xl font-bold text-gray-900">
            {data.reduce((sum, entry) => sum + entry.value, 0)}
          </div>
        </div>
      </div>

      {/* Legend Section */}
      <div className="grid grid-cols-2 gap-y-2 px-3 mt-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center">
            <span
              className="w-3 h-3 rounded-sm mr-2"
              style={{ backgroundColor: entry.color }}
            ></span>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-600">{entry.name}</span>
              <span className="text-[10px] font-semibold text-gray-900">
                {entry.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Student -Status

const courseData = [
  { name: "Joined", value: 30, color: "#7f9cb6" },
  { name: "Not Joined", value: 45, color: "#001d3d" },
  { name: "No Response", value: 60, color: "#4a90e2" },
];
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
}) => {
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
    <div className="bg-white p-4 rounded-lg shadow-md w-60 border border-gray-200 ">
      <h2 className="text-sm font-semibold text-gray-900">Student Status</h2>

      <ResponsiveContainer width="100%" height={198}>
        <BarChart data={courseData} barCategoryGap={30}>
          <XAxis
            dataKey="name"
            tick={{ fill: "#7f9cb6", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip active={undefined} payload={undefined} />}
            wrapperStyle={{ backgroundColor: "transparent", border: "none" }} // Remove tooltip bg
          />

          {/* Bar with border radius on both top and bottom */}
          <Bar dataKey="value" radius={[15, 15, 15, 15]} barSize={25}>
            {courseData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} fillOpacity={1} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-center mt-4 space-x-2">
        {courseData.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center space-x-2 whitespace-nowrap mt-6"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-[10px] text-gray-700">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

//Teacher Assigned - Not Assigned

const data = [
  {
    title: "Students",
    count: 1738,
    assigned: 1200,
    notassigned: 538,
  },
];

const COLORS = ["#0D1B2A", "#4B9EFF", "#81878B"];

const PreferredTeachersCard = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-60 border border-gray-200 justify-between flex flex-col">
      <div>
        <h2 className="text-sm font-semibold text-gray-900">
          Teacher Assigned - Not Assigned
        </h2>
        <div className="relative flex items-center justify-center">
          {data.map((item) => (
            <div key={item.count}>
              <PieChart width={150} height={150}>
                <Tooltip />
                {/* Male segment - larger */}
                <Pie
                  data={[{ value: item.assigned }]}
                  cx={75}
                  cy={75}
                  innerRadius={0}
                  outerRadius={55}
                  startAngle={-90}
                  endAngle={
                    -90 +
                    (item.assigned / (item.assigned + item.notassigned)) * 360
                  }
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={500}
                  animationEasing="ease-in-out"
                  strokeWidth={0}
                  fill={COLORS[0]}
                />
                {/* Female segment - smaller */}
                <Pie
                  data={[{ value: item.notassigned }]}
                  cx={75}
                  cy={75}
                  innerRadius={0}
                  outerRadius={50}
                  startAngle={
                    -90 +
                    (item.assigned / (item.assigned + item.notassigned)) * 360
                  }
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
                  data={[{ value: item.assigned }]}
                  cx={75}
                  cy={75}
                  innerRadius={58}
                  outerRadius={62}
                  startAngle={-90}
                  endAngle={
                    -90 +
                    (item.assigned / (item.assigned + item.notassigned)) * 360
                  }
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={500}
                  animationEasing="ease-in-out"
                  strokeWidth={0}
                  fill={COLORS[2]}
                />
              </PieChart>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="flex justify-center gap-4 mt- text-gray-700 text-sm">
          <div className="flex items-center text-[10px]">
            <span className="w-3 h-3 bg-[#0D1B2A] rounded-sm mr-1"></span>
            Male
          </div>
          <div className="flex items-center text-[10px]">
            <span className="w-3 h-3 bg-[#4B9EFF] rounded-sm mr-1"></span>
            Female
          </div>
        </div>
      </div>
    </div>
  );
};

//Teacher-Student

type Teacher = {
  id: number;
  name: string;
  trials: number;
  joined: number;
  avatar: string;
};

const TeachersStudents = () => {
  const teachers: Teacher[] = [
    {
      id: 1,
      name: "Abdullah Sulaiman",
      trials: 5,
      joined: 3,
      avatar: "/assets/images/student-profile1.png", // Replace with actual image paths
    },
    {
      id: 2,
      name: "Iman Gabel",
      trials: 6,
      joined: 4,
      avatar: "/assets/images/student-profile.png",
    },
    {
      id: 3,
      name: "Hassan Ibrahim",
      trials: 5,
      joined: 4,
      avatar:"/assets/images/student-profile1.png", 
    },
    {
      id: 4,
      name: "Maryam Hossan",
      trials: 6,
      joined: 1,
      avatar: "/assets/images/student-profile.png", 
    },
    {
      id: 5,
      name: "Ayesha Islam",
      trials: 6,
      joined: 1,
      avatar: "/assets/images/student-profile1.png", 
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 ">
      <h2 className="text-[15px] font-semibold text-gray-800 mb-3">
        Teachers - Students
      </h2>
      <div className="flex justify-between text-[10px] mb-2 border-b pb-2">
        <span>Teachers</span>
        <span>Students</span>
      </div>

      {/* Scrollable List */}
      <div className="max-h-48 p-4 overflow-y-auto pr-2 scrollbar-none scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="flex items-center py-2 border-b">
            {/* Avatar */}
            <Image
              src={teacher.avatar}
              width={24}
              height={24}
              className="rounded-full mr-3" alt={""}            />
            {/* Name */}
            <div className="flex-grow truncate">
              <span className="text-[12px] text-gray-900">{teacher.name}</span>
            </div>
            {/* Students Count */}
            <div className="text-sm font-medium text-gray-900">
              {teacher.trials}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4  w-full max-w-[1300px] mx-auto">
      <TotalScheduledChart />
      <CoursesChart />
      <PreferredTeachersCard />
      <TeachersStudents />
    </div>
  );
}
