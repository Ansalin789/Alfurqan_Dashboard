'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

interface Teacher {
  _id: string;
  teacherId: string | null;
  teacherName: string;
  teacherEmail: string;
  studentCount: number;
  maleCount: number;
  femaleCount: number;
}

const fetchTeacherData = async (): Promise<Teacher | null> => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('TeacherAuthToken') : null;
    const studentId = localStorage.getItem('TeacherPortalId');
    if (!token || !studentId) return null;

    const response = await axios.get(
      'https://api.blackstoneinfomaticstech.com/teacher-student-count',
      {
        params: { teacherId: studentId },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data?.data?.[0] ?? null;
  } catch (error) {
    console.error('Error fetching teacher data', error);
    return null;
  }
};

const StudentsCard: React.FC = () => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    fetchTeacherData().then(setTeacher);
  }, []);

  const getPercentage = (count: number, total: number) =>
    total > 0 ? Math.round((count / total) * 100) : 0;

  if (!teacher) return null;

  const malePercent = getPercentage(teacher.maleCount, teacher.studentCount);
  const femalePercent = 100 - malePercent;
  const showCenterValue = malePercent === 100 || femalePercent === 100;

  return (
    <div className="bg-white dark:bg-[#343434] rounded-xl shadow-md w-full h-full p-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-sm font-semibold text-[#010E30] dark:text-white">Students</h2>
        <div className="flex gap-2 text-[10px]">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-pink-400"></span>
            <span className="text-[#010E30] dark:text-white">Female</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-sky-300"></span>
            <span className="text-[#010E30] dark:text-white">Male</span>
          </div>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="relative mx-auto my-4 aspect-square w-full max-w-[180px] min-w-[140px]">
        <div
          className="w-full h-full rounded-full"
          style={{
            background: `conic-gradient(#83DBFC 0% ${malePercent}%, #FFB6F1 ${malePercent}% 100%)`,
            border: '8px solid transparent',
          }}
        ></div>

        {/* Inner Circle */}
        {/* Inner Circle - solid and seamless */}
<div
  className="absolute inset-1/4 w-1/2 h-1/2 dark:bg-[#343434] rounded-full flex items-center justify-center bg-white dark:bg-[#242424] shadow-inner"
>
  <span className="text-sm font-bold text-[#010E30] dark:text-white">
    {showCenterValue ? '100%' : ''}
  </span>
</div>



        {/* Male % */}
        {malePercent > 0 && malePercent < 100 && (
          <div
            className="absolute text-[10px] font-semibold text-[#010E30] dark:text-white"
            style={{
              top: '25%',
              left: '70%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {malePercent}%
          </div>
        )}

        {/* Female % */}
        {femalePercent > 0 && femalePercent < 100 && (
          <div
            className="absolute text-[10px] font-semibold text-[#010E30] dark:text-white"
            style={{
              top: '75%',
              left: '30%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {femalePercent}%
          </div>
        )}
      </div>

      {/* Optional Name from LocalStorage */}
      {/* <div className="mt-3 text-center text-xs text-[#010E30] dark:text-white font-medium">
        {localStorage.getItem("TeacherPortalName")}
      </div> */}
    </div>
  );
};

export default StudentsCard;
