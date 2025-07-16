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
  inprogressCount: number;
  studentJointCount: number;
  studentNotJointCount: number;
}

//Total trail class

const STATUS_COLORS = [
  { name: "Completed", color: "#B6C6F5" },
  { name: "Scheduled", color: "#6CA8F7" },
  { name: "No Response", color: "#A7D3F5" },
  { name: "Cancelled", color: "#C6E2F9" },
];

const TotalScheduledChart = () => {
  const [totalTrailclass, setTotalTrailclass] = useState<TotalTrailclassData[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('AdminAuthToken');
      if (token) {
        fetchChartData(token);
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
      // Map API data to the correct order and color
      const chartArray: TotalTrailclassData[] = [
        { name: "Completed", value: apiData.completedCount, color: STATUS_COLORS[0].color },
        { name: "Scheduled", value: apiData.pendingCount, color: STATUS_COLORS[1].color },
        { name: "No Response", value: apiData.studentNotJointCount, color: STATUS_COLORS[2].color },
        { name: "inprogress", value: apiData.inprogressCount, color: STATUS_COLORS[3].color },
      ];
      setTotalTrailclass(chartArray);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Title */}
      <div className="text-[#010E30] text-[15px] font-semibold dark:text-white mb-6">Total Requests</div>
      <div className="flex flex-row items-center justify-between">
        {/* Legend */}
        <div className="flex flex-col gap-4 min-w-[120px]">
          {totalTrailclass.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: entry.color }}></span>
              <div className="flex flex-col">
                <span className="font-medium text-[13px] text-[#1A2341]">{entry.name}</span>
                <span className="text-[10px] text-[#7A869A]">{entry.value}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Donut Chart */}
        <div className="relative flex items-center justify-center">
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie
                data={totalTrailclass}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={65}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                stroke="none"
                cornerRadius={8}
                isAnimationActive={false}
              >
                {totalTrailclass.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-[#1A2341]">
              {totalTrailclass.reduce((sum, entry) => sum + entry.value, 0)}
            </span>
          </div>
        </div>
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
      const response = await fetch("http://localhost:5001/totaltrialclass",{
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
          color: "#9FD0FF",
        },
        {
          name: "Not Joined",
          value: data[0]?.studentNotJointCount || 0,
          color: "#AFC0FF",
        },
        {
          name: "No Response",
          value: data[0]?.studentNotJointCount || 0,
          color: "#78A1DB",
        },
      ];

      setChartData(transformedData);
    };

  
    
  return (
    <div>
      <h2 className="text-[15px] font-semibold text-gray-900">Student Status</h2>

      <ResponsiveContainer width="100%" height={198}>
        <BarChart data={chartData} barCategoryGap={30}>
          <Tooltip
            content={<CustomTooltip active={undefined} payload={undefined} />}
            wrapperStyle={{
              backgroundColor: "transparent",
              border: "none",
              boxShadow: "none",
              padding: 0,
            }}
            cursor={{ fill: "transparent" }}
          />
          <Bar dataKey="value" radius={[15, 15, 15, 15]} barSize={25}>
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} fillOpacity={1} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-center mt-4 space-x-6">
        {chartData.map((entry) => (
          <div key={entry.name} className="flex items-center space-x-2">
            <div
              className="w-[10px] h-[10px] rounded-[2px]"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-[10px] text-[#010E30] font-semibold">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

//Teacher Assigned - Not Assigned


const TEACHER_COLORS = ["#9FD0FF", "#AFC0FF", "#78A1DB"];

const getPieLabelPosition = (
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
) => {
  const midAngle = (startAngle + endAngle) / 2;
  const radius = (innerRadius + outerRadius) / 2;
  const RADIAN = Math.PI / 180;
  return {
    x: cx + radius * Math.cos(-midAngle * RADIAN),
    y: cy + radius * Math.sin(-midAngle * RADIAN),
  };
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
      const res = await fetch("http://localhost:5001/teacherstatus",{
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
  const total = assigned + notassigned;
  const assignedPercent = total > 0 ? Math.round((assigned / total) * 100) : 0;
  const notAssignedPercent = total > 0 ? Math.round((notassigned / total) * 100) : 0;

  // Pie label positions
  const assignedAngles = {
    start: -90,
    end: -90 + (assigned / (total || 1)) * 360,
  };
  const notAssignedAngles = {
    start: assignedAngles.end,
    end: 270,
  };
  const assignedLabelPos = getPieLabelPosition(75, 75, 0, 55, assignedAngles.start, assignedAngles.end);
  const notAssignedLabelPos = getPieLabelPosition(75, 75, 0, 50, notAssignedAngles.start, notAssignedAngles.end);

  return (
    <div>
      <div>
        <h2 className="text-sm font-semibold text-gray-900">
          Teacher Assigned - Not Assigned
        </h2>
        <div className="relative flex items-center justify-center -ml-2 mt-2">
          <PieChart width={150} height={150}>
            {/* Assigned Segment */}
            <Pie
              data={[{ name: "Assigned", value: assigned }]}
              cx={75}
              cy={75}
              innerRadius={0}
              outerRadius={55}
              startAngle={assignedAngles.start}
              endAngle={assignedAngles.end}
              dataKey="value"
              strokeWidth={0}
              fill={TEACHER_COLORS[0]}
              label={false}
              labelLine={false}
            />
            {assigned > 0 && (
              <text
                x={assignedLabelPos.x}
                y={assignedLabelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14px"
                fontWeight="bold"
                fill="#fff"
              >
                {assignedPercent}%
              </text>
            )}
            {/* Not Assigned Segment */}
            <Pie
              data={[{ name: "Not Assigned", value: notassigned }]}
              cx={75}
              cy={75}
              innerRadius={0}
              outerRadius={50}
              startAngle={notAssignedAngles.start}
              endAngle={notAssignedAngles.end}
              dataKey="value"
              strokeWidth={0}
              fill={TEACHER_COLORS[1]}
              label={false}
              labelLine={false}
            />
            {notassigned > 0 && (
              <text
                x={notAssignedLabelPos.x}
                y={notAssignedLabelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="13px"
                fontWeight="bold"
                fill="#fff"
              >
                {notAssignedPercent}%
              </text>
            )}
            {/* Outline */}
            <Pie
              data={[{ name: "Assigned", value: assigned }]}
              cx={75}
              cy={75}
              innerRadius={58}
              outerRadius={62}
              startAngle={assignedAngles.start}
              endAngle={assignedAngles.end}
              dataKey="value"
              strokeWidth={0}
              fill={TEACHER_COLORS[2]}
            />
          </PieChart>
        </div>
        <div className="grid grid-cols-2 gap-1 w-full mt-10">
          {/* Legend for Assigned and Not Assigned */}
          <div className="flex flex-col items-center text-start">
            <div className="flex items-center gap-[3px]">
              <div className="w-[12px] h-[12px] rounded-[2px]" style={{ backgroundColor: TEACHER_COLORS[0] }}></div>
              <span className="text-[10px] font-semibold text-[#010E30]">Assigned</span>
            </div>
            <div className="text-[10px] font-medium mt-[2px] text-[#010E30]">{assigned}</div>
          </div>
          <div className="flex flex-col items-center text-start">
            <div className="flex items-center gap-[3px]">
              <div className="w-[12px] h-[12px] rounded-[2px]" style={{ backgroundColor: TEACHER_COLORS[1] }}></div>
              <span className="text-[10px] font-semibold text-[#010E30]">Not Assigned</span>
            </div>
            <div className="text-[10px] font-medium mt-[2px] text-[#010E30]">{notassigned}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

//Trail by Teachers


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
    fetch("http://localhost:5001/teacher-student-count", {
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
