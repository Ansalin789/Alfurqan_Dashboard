'use client';
import { useEffect, useState } from "react";


type TeacherAPI = {
  _id: string;
  teacherName: string;
  teacherEmail: string;
  studentCount: number;
  maleCount: number;
  femaleCount: number;
};
  
  export default function TeachersStudents() {
    const [teachers, setTeachers] = useState<TeacherAPI[]>([]);
    const colors = ["bg-red-800", "bg-yellow-800", "bg-red-500", "bg-green-700", "bg-purple-600", "bg-blue-500"];

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('AdminAuthToken');
        if (token) {
          fetchTeacherStudentCount(token);
        } else {
          console.log("No auth token found.");
        }
      }
    }, []);
    
    const fetchTeacherStudentCount = async (token: string) => {
      try {
        const res = await fetch("http://localhost:5001/teacher-student-count", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
    
        const data = await res.json();
        if (data.success) {
          setTeachers(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
      }
    };
    
  
    return (
      <div className="bg-white rounded-lg shadow-sm p-5 h-[528px]">
        <div className="flex justify-between text-sm font-semibold mb-2">
          <span>Teachers</span>
          <span>Students</span>
        </div>
  
        <div className="max-h-40 overflow-y-auto pr-2">
          {teachers.map((teacher, index) => (
            <div key={teacher._id} className="flex items-center py-[2px] my-1">
              <div className="w-5 flex-shrink-0">
              <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
              </div>
              <div className="flex-grow truncate">
                <span className="text-xs text-gray-700">{teacher.teacherName}</span>
              </div>
              <div className="w-10 text-right">
                <span className="text-xs">{teacher.studentCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  