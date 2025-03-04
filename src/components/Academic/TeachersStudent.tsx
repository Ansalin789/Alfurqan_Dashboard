import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import axios from "axios";

interface TeacherData {
  _id: string | null;
  teacherName: string;
  teacherEmail: string;
  studentCount: number;
}

interface ApiResponse {
  data: TeacherData[];
}

export default function Academic() {
  const [teachersData, setTeachersData] = useState<TeacherData[]>([]);

  useEffect(() => {
    const fetchTeachersData = async () => {
      try {
        const teacherId = "some_teacher_id"; // Replace with actual teacherId
        const response = await axios.get<ApiResponse>(
          `http://alfurqanacademy.tech:5001/teacher-student-count`,
          {
            params: { teacherId },
          }
        );
        setTeachersData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchTeachersData();
  }, []);

  return (
    <Link
      href="/Academic/manageStudents"
      className="block col-span-12 bg-[#3e68a1] p-4 py-3 rounded-[20px] shadow-xl"
    >
      <div className="col-span-12">
        <h3 className="text-[13px] font-medium text-white mb-1">
          Teachers - Students
        </h3>
        <div className="max-h-40 overflow-y-scroll scrollbar-none ml-6">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-start text-[12px] font-normal text-white underline underline-offset-2">
                  Teachers
                </th>
                <th className="px-4 py-2 text-center text-[12px] font-normal text-white underline underline-offset-2">
                  Students
                </th>
              </tr>
            </thead>
            <tbody className="mb-1">
              {teachersData.map((teacher) => (
                <tr key={teacher._id || teacher.teacherEmail}>
                  <td className="px-4 py-1 text-[11px] text-center flex text-white ">
                    <FaUserCircle className="text-[#ffffff] mr-2 mt-1" />
                    {teacher.teacherName}
                  </td>
                  <td className="px-4 py-1 text-[11px] whitespace-nowrap text-center text-white">
                    {teacher.studentCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Link>
  );
}
