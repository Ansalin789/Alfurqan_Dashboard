"use client";
import { useState, useEffect } from "react";
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


type TeacherAPI = {
  _id: string;
  teacherName: string;
  teacherEmail: string;
  studentCount: number;
  maleCount: number;
  femaleCount: number;
};

interface CourseBar {
  name: string;
  value: number;
  color: string;
}

interface TotalTrailclassData{
  name:string;
  value:number;
  color:string;
}

interface TrialClassData {
  _id: string | null;
  totalCount: number;
  maleCount: number;
  femaleCount: number;
  completedCount: number;
  pendingCount: number;
  studentJointCount: number;
  studentNotJointCount: number;
}

//Total trail class

const TotalScheduledChart = () => {
  const [totalTrailclass, setTotalTrailclass] = useState<TotalTrailclassData[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('AdminAuthToken');
      if (token) {
        fetchChartData(token); // pass token into the function
      } else {
        console.log("No auth token found.");
      }
    }
  }, []);
    const fetchChartData = async (token: string) => {
      try {
        const response = await fetch("https://api.blackstoneinfomaticstech.com/totaltrialclass",{
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const result: TrialClassData[] = await response.json();

        const apiData = result[0];

        const chartArray: TotalTrailclassData[] = [
          { name: "completed", value: apiData.completedCount, color: "#012A4A" },
          { name: "scheduled", value: apiData.pendingCount, color: "#3084D6" },
          { name: "no response", value: 0, color: "#6C94B3" },
          { name: "cancelled", value: 0, color: "#9AC3E3" },
        ];

        setTotalTrailclass(chartArray);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-900">
          Total Trial Classes
        </h2>
        
      </div>

      {/* Pie Chart with Centered Text */}
      <div className="relative flex items-center justify-center mt-2">
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie
              data={totalTrailclass}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={65}
              dataKey="value"
              startAngle={90}
              endAngle={-270} // Ensures the gap is at the top
              stroke="none"
            >
              {totalTrailclass.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center text inside the chart */}
        <div className="absolute text-center">
          <div className="text-2xl font-bold text-gray-900">
            {totalTrailclass.reduce((sum, entry) => sum + entry.value, 0)}
          </div>
        </div>
      </div>

      {/* Legend Section */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 px-3 mt-9">
        {totalTrailclass.map((entry) => (
          <div key={entry.name} className="flex items-center">
            <span
              className="w-2 h-2 rounded-full mr-1"
              style={{ backgroundColor: entry.color }}
            ></span>
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-600 whitespace-nowrap">
                {entry.name} ({entry.value})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Student -Status

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
  const [chartData, setChartData] = useState<CourseBar[]>([]);

 useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('AdminAuthToken');
      if (token) {
        fetchData(token); // pass token into the function
      } else {
        console.log("No auth token found.");
      }
    }
  }, []);    
  
  const fetchData = async (token: string) => {
      const response = await fetch("https://api.blackstoneinfomaticstech.com/totaltrialclass",{
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      const data: TrialClassData[] = await response.json();

      const transformedData: CourseBar[] = [
        {
          name: "Joined",
          value: data[0]?.studentJointCount || 0,
          color: "#012A4A",
        },
        {
          name: "Not Joined",
          value: data[0]?.studentNotJointCount || 0,
          color: "#3084D6",
        },
        {
          name: "No Response",
          value: 0,
          color: "#6C94B3",
        },
      ];

      setChartData(transformedData);
    };

  
    
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-900">Student Status</h2>

      <ResponsiveContainer width="100%" height={198}>
        <BarChart data={chartData} barCategoryGap={30}>
          {/* <XAxis
            // dataKey="name"
            // tick={{ fill: "#7f9cb6", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          /> */}
          <Tooltip
            content={<CustomTooltip active={undefined} payload={undefined} />}
            wrapperStyle={{ backgroundColor: "transparent", border: "none" }}
            cursor={{ fill: 'transparent' }}
          />

          {/* Bar with border radius on both top and bottom */}
          <Bar dataKey="value" radius={[15, 15, 15, 15]} barSize={25}>
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} fillOpacity={1} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-center mt-4 space-x-2">
        {chartData.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center space-x-2 whitespace-nowrap mt-5"
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


const COLORS = ["#0D1B2A", "#4B9EFF", "#81878B"];

const CustomTooltips = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const label = payload[0]?.name;
    const value = payload[0]?.value;
    return (
      <div className="bg-white border rounded px-2 py-1 text-xs text-gray-800 shadow">
        {label} - {value}
      </div>
    );
  }
  return null;
};

const PreferredTeachersCard = () => {
  const [teacherData, setTeacherData] = useState({
    total: 0,
    assignedTeacherPercentage: "0",
    notAssignedTeacherPercentage: "0",
  });

 useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('AdminAuthToken');
      if (token) {
        fetchData(token); // pass token into the function
      } else {
        console.log("No auth token found.");
      }
    }
  }, []);  
  const fetchData = async (token: string) => {
      try {
        const res = await fetch("https://api.blackstoneinfomaticstech.com/teacherstatus",{
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setTeacherData(data);
      } catch (err) {
        console.error("Error fetching teacher status:", err);
      }
    };


  const assigned = Number(
    ((parseFloat(teacherData.assignedTeacherPercentage) / 100) *
      teacherData.total).toFixed(0)
  );
  const notassigned = teacherData.total - assigned;
  return (
    <div>
      <div>
        <h2 className="text-sm font-semibold text-gray-900">
          Teacher Assigned - Not Assigned
        </h2>
        <div className="relative flex items-center justify-center pt-4">
          <PieChart width={150} height={150}>
            <Tooltip content={<CustomTooltips />}/>
            {/* Assigned */}
            <Pie
              data={[{ name:'Assigned', value: assigned }]}
              cx={75}
              cy={75}
              innerRadius={0}
              outerRadius={55}
              startAngle={-90}
              endAngle={
                -90 + (assigned / (assigned + notassigned)) * 360
              }
              dataKey="value"
              animationBegin={0}
              animationDuration={500}
              animationEasing="ease-in-out"
              strokeWidth={0}
              fill={COLORS[0]}
            />
            {/* Not Assigned */}
            <Pie
              data={[{name:'Not-Assigned', value: notassigned }]}
              cx={75}
              cy={75}
              innerRadius={0}
              outerRadius={50}
              startAngle={
                -90 + (assigned / (assigned + notassigned)) * 360
              }
              endAngle={270}
              dataKey="value"
              animationBegin={0}
              animationDuration={500}
              animationEasing="ease-in-out"
              strokeWidth={0}
              fill={COLORS[1]}
            />
            {/* Outline */}
            <Pie
              data={[{ name:'asssigned', value: assigned }]}
              cx={75}
              cy={75}
              innerRadius={58}
              outerRadius={62}
              startAngle={-90}
              endAngle={
                -90 + (assigned / (assigned + notassigned)) * 360
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
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-16 text-gray-700 text-sm">
        <div className="flex items-center text-[10px]">
          <span className="w-2 h-2 bg-[#0D1B2A] rounded-sm mr-1"></span>
          Assigned
        </div>
        <div className="flex items-center text-[10px]">
          <span className="w-2 h-2 bg-[#4B9EFF] rounded-sm mr-1"></span>
          Not-Assigned
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
  const [teachers, setTeachers] = useState<TeacherAPI[]>([]);
  const colors = ["bg-red-800", "bg-yellow-800", "bg-red-500", "bg-green-700", "bg-purple-600", "bg-blue-500"];

 useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('AdminAuthToken');

      if (token) {
        fetchData(token); // call the fetch function with token
      } else {
        console.log("No auth token found.");
      }
    }
  }, []);

  const fetchData = (token: string) => {
    fetch("https://api.blackstoneinfomaticstech.com/teacher-student-count", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTeachers(data.data);
        } else {
          console.error("Data fetch was unsuccessful:", data);
        }
      })
      .catch((err) => console.error("Failed to fetch teachers:", err));
  };

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-900 mb-3">
        Teachers - Students
      </h2>
      <div className="flex justify-between text-[10px] mb-2 border-b pb-2">
        <span>Teachers</span>
        <span>Students</span>
      </div>

      {/* Scrollable List */}
      <div className="h-48 p-4 overflow-y-scroll scrollbar-none pr-2 scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {teachers.map((teacher, index) => (
          <div key={teacher._id} className="flex items-center py-2 border-b">
            <div className="w-5 flex-shrink-0">
              <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
              </div>
            {/* Name */}
            <div className="flex-grow truncate">
              <span className="text-[12px] text-gray-900">{teacher.teacherName}</span>
            </div>
            {/* Students Count */}
            <div className="text-sm font-medium text-gray-900">
              {teacher.studentCount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full w-full px-2 py-4 md:mr-10 scrollbar-none">
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 h-full w-full">
        <TotalScheduledChart />
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 h-full w-full">
        <CoursesChart />
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 h-full w-full">
        <PreferredTeachersCard />
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 h-full w-full">
        <TeachersStudents />
      </div>
    </div>
  );
}
