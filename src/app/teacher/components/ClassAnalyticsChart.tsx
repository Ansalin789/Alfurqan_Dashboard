import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface StatsData {
  scheduled: number;
  completed: number;
  absent: number;
  rescheduled?: number;
}

interface ArcData {
  path: string;
  dashArray: string;
}

const COLORS = {
  scheduled: '#B1A7F2',
  completed: '#6BE6C1',
  absent: '#FFA9A9',
};

const ClassAnalytics = () => {
  const [data, setData] = useState<StatsData>({ scheduled: 0, completed: 0, absent: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const teacherId = localStorage.getItem("TeacherPortalId");
      const token = localStorage.getItem("TeacherAuthToken");

      if (!teacherId || !token) throw new Error("Authentication info missing");

      const response = await axios.get<StatsData>(
        `http://localhost:5001/classShedule/teacher/count?teacherId=${teacherId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setData({
        scheduled: response.data.scheduled || 0,
        completed: response.data.completed || 0,
        absent: response.data.absent || 0,
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'API Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const total = data.scheduled + data.completed + data.absent;

  const circleConfig = [
    { radius: 100, color: COLORS.scheduled, value: data.scheduled },
    { radius: 75, color: COLORS.completed, value: data.completed },
    { radius: 60, color: COLORS.absent, value: data.absent },
  ];

  const getArcPath = (value: number, total: number, radius: number): ArcData | null => {
    if (total === 0) return null;
    const circumference = 2 * Math.PI * radius;
    const dashLength = (value / total) * circumference;
    const gapLength = circumference - dashLength;
    return {
      path: `M ${radius},0 A ${radius},${radius} 0 1,1 ${-radius},0`,
      dashArray: `${dashLength} ${gapLength}`,
    };
  };

  if (loading) {
    return (
      <div className="p-6 rounded-xl bg-white shadow-sm text-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-white shadow-sm text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-md p-4">
      <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-6 text-center md:text-left">
        Class Analytics
      </h2>

      <div className="flex flex-col md:flex-row items-center mt-14 justify-between gap-6 w-full">
        {/* Donut Chart */}
        <div className="relative w-full max-w-[260px] aspect-square mx-auto">
          <svg viewBox="-100 -100 200 200" className="w-full h-full">
            {circleConfig.map((circle, i) => {
              const arc = getArcPath(circle.value, total || 1, circle.radius);
              return arc ? (
                <path
                  key={i}
                  d={arc.path}
                  stroke={circle.color}
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={arc.dashArray}
                />
              ) : null;
            })}
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[22px] sm:text-[26px] font-bold text-gray-900">{total}</div>
            <div className="text-[9px] sm:text-[10px] text-center text-gray-800 leading-tight">
              TOTAL<br />CLASS<br />ASSIGNED
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full flex-1 max-w-sm md:max-w-xs space-y-4">
          {[
            { label: 'Scheduled', value: data.scheduled, color: COLORS.scheduled },
            { label: 'Completed', value: data.completed, color: COLORS.completed },
            { label: 'Absent', value: data.absent, color: COLORS.absent },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-800">{item.label}</span>
              </div>
              <span className="font-semibold text-sm text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassAnalytics;
