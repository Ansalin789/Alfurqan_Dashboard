
"use client";

import axios from "axios";
import { useState, useEffect } from "react";

interface Teacher {
  _id: string;
  teacherId: string | null;
  teacherName: string;
  teacherEmail: string;
  studentCount: number;
  maleCount: number;
  femaleCount: number;
}

interface TeacherListProps {
  teachers: Teacher[];
}

const fetchTeacherData = async (): Promise<Teacher[] | null> => {
  try {
    const studentId = localStorage.getItem("TeacherPortalId");
    console.log(">>>>>", studentId);
    const response = await axios.get("http://localhost:5001/teacher-student-count",
      {
        params:{teacherId: studentId}
      }
    );
    
    return response.data.data;
  } catch (error) {
    console.error("Error fetching teacher data", error);
    return null;
  }
};

const StudentsCard: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[] | null>(null);

  useEffect(() => {
    const getTeacherData = async () => {
      const data = await fetchTeacherData();
      setTeachers(data);
    };
    getTeacherData();
  }, []);

  return (
<div>
      {teachers?.map((teacher) => (
        <div key={teacher._id} className="bg-[#324F78] text-white rounded-[15px] shadow-lg w-[100%] h-[205px] p-4">
          <div className="flex justify-center items-center mb-2 -mt-2 bg-[#fff] text-center rounded-md">
            <h2 className="text-[14px] font-semibold text-[#242424] text-center py-[1px]">{localStorage.getItem('TeacherPortalName')}</h2>
          </div>

          <div className="relative flex justify-center items-center">
            <div className="relative w-[100px] h-[100px] rounded-full">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(#fff 0% ${(teacher.maleCount / teacher.studentCount) * 100}%, #83DBFC ${(teacher.maleCount / teacher.studentCount) * 100}% 100%)`,
                }}
              ></div>

              <div
                className="absolute inset-[10px] w-[80px] h-[80px] rounded-full bg-[#324F78]"
                style={{
                  clipPath: "inset(0 round 50px)",
                  background: `conic-gradient(#FF5BBE 0% ${(teacher.femaleCount / teacher.studentCount) * 100}%, #fff ${(teacher.femaleCount / teacher.studentCount) * 100}% 100%)`,
                }}
              ></div>

              <div className="absolute inset-[20px] w-[60px] h-[60px] bg-[#324F78] rounded-full flex items-center justify-center">
                <span className="text-[18px] text-blue-400">{teacher.maleCount}</span>
                <span className="text-[18px] text-pink-400 ml-1">{teacher.femaleCount}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-around text-center text-[12px]">
            <div>
              <div className="flex items-center justify-center space-x-1">
                <span className="w-[8px] h-[8px] bg-blue-400 rounded-full"></span>
                <span className="font-bold">{teacher.maleCount}</span>
              </div>
              <span className="text-gray-300">Boys ({((teacher.maleCount / teacher.studentCount) * 100).toFixed(1)}%)</span>
            </div>
            <div>
              <div className="flex items-center justify-center space-x-1">
                <span className="w-[8px] h-[8px] bg-pink-400 rounded-full"></span>
                <span className="font-bold">{teacher.femaleCount}</span>
              </div>
              <span className="text-gray-300">Girls ({((teacher.femaleCount / teacher.studentCount) * 100).toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentsCard;
