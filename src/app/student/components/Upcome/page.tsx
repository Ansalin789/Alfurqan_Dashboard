'use client';
import React, { useEffect, useState } from "react";
import { Calendar, User } from "lucide-react";
import axios from "axios";

const UpcomingClasses = () => {
  interface ClassEvent {
    student: {
      studentId: string;
      studentFirstName: string;
      studentLastName: string;
      studentEmail: string;
    };
    teacher: {
      teacherId: string;
      teacherName: string;
      teacherEmail: string;
    };
    _id: string;
    classDay: string[];
    package: string;
    preferedTeacher: string;
    totalHours: number;
    startDate: string;
    endDate: string;
    startTime: string[];
    endTime: string[];
    scheduleStatus: string;
    status: string;
    createdBy: string;
    createdDate: string;
    lastUpdatedDate: string;
    __v: number;
  }
  
  // API Response Interface
  interface ApiResponse {
    totalCount: number;
    classSchedule: ClassEvent[];
  }

  const [classes, setClasses] = useState<ClassEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNextEvaluationClass = async () => {
      try {
        const studentId = localStorage.getItem('StudentPortalId');
        const auth = localStorage.getItem('StudentAuthToken');
        const response = await axios.get<ApiResponse>('https://alfurqanacademy.tech/classShedule/students', {
          params: { studentId: studentId },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth}`,
          },
        });

        const sortedClasses = response.data.classSchedule.toSorted(
          (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        
        setClasses(sortedClasses.slice(0, 4));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNextEvaluationClass();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 className="text-[16px] font-bold text-gray-800 p-[0px] px-4 -mt-[21px]">Upcoming classes</h2>
      <div className="bg-[#375074] p-1 rounded-xl shadow-md mt-[4px]">
        {classes.map((cls, index) => (
          <div
            key={cls._id}
            className="flex flex-col md:flex-row justify-between items-center text-white rounded-xl px-4 py-[3px] mb-0 md:mb-0"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-[12px]">{cls._id} - {cls.package}</span>
              <div className="flex items-center ml-28">
                <User size={15} />&nbsp;
                <span className="font-medium text-[12px]">by {cls.teacher.teacherName}</span>
              </div>
            </div>
            <div className="flex items-center gap-28">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span className="font-medium text-[11px]">{new Date(cls.startDate).toLocaleDateString()}</span>
              </div>
              <div className="px-3 py-1 rounded-lg font-medium text-[10px] text-white bg-blue-500">
                {cls.startTime[0]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingClasses;
