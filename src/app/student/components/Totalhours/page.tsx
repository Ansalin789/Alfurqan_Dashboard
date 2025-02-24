'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ClassEvent {
  totalHours: number;
  classStatus: string; // Either "Completed" or "Pending"
}

// API Response Interface
interface ApiResponse {
  totalCount: number;
  classSchedule: ClassEvent[];
}

const Page = () => {
  const [data, setData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const studentId = localStorage.getItem("StudentPortalId");
        const auth = localStorage.getItem("StudentAuthToken");

        const response = await axios.get<ApiResponse>("http://localhost:5001/classShedule", {
          params: { studentId },
          headers: { Authorization: `Bearer ${auth}` },
        });

        // Extract class schedule
        const classSchedule = response.data.classSchedule;

        // Calculate total completed and pending hours
        const completedHours = classSchedule
          .filter((event) => event.classStatus === "Completed")
          .reduce((sum, event) => sum + event.totalHours, 0);

        const pendingHours = classSchedule
          .filter((event) => event.classStatus === "Pending")
          .reduce((sum, event) => sum + event.totalHours, 0);

        const total = completedHours + pendingHours;

        setTotalHours(total);

        // Prepare chart data
        setData([
          { name: "Pending hours", value: pendingHours, color: "#FACC15" },
          { name: "Completed hours", value: completedHours, color: "#A78BFA" },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching class schedule:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const percentage = totalHours > 0 ? Math.round((data[0]?.value / totalHours) * 100) : 0;

  return (
    <div className="block col-span-12 bg-[#f7f7f9] p-4 py-3 rounded-[17px] h-60 -mt-3 border-[#c8c8c8] border-[1px]">
      {/* Title */}
      <h2 className="text-[13px] font-semibold text-gray-700 text-center mb-2">
        Total class hours - {totalHours} Hrs
      </h2>

      {/* Loading Indicator */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <>
          {/* Donut Chart */}
          <div className="relative w-40 h-40 mx-auto">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius={45}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={450}
                  paddingAngle={2}
                  cornerRadius={10}
                  stroke="#f7f7f9"
                  strokeWidth={0}
                >
                  {data.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[16px] font-bold text-gray-700">{percentage}%</span>
            </div>
          </div>

          {/* Legends */}
          <div className="flex flex-col items-start text-sm -mt-2">
            {data.map((entry) => (
              <div key={entry.name} className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                <span className="text-gray-600 text-[11px]">{entry.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
