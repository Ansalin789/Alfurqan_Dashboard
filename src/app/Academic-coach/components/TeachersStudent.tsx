'use client';

import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import axios from "axios";
import { getSocket } from "@/app/utils/socket";

interface TeacherData {
  _id: string | null;
  teacherName: string;
  teacherEmail: string;
  studentCount: number;
  maleCount:string;
  femaleCount:string;
}

interface ApiResponse {
  data: TeacherData[];
}

export default function Academic() {
  const [teachersData, setTeachersData] = useState<TeacherData[]>([]);
    useEffect(()=>{
     const academicId = typeof window !== "undefined"
            ? localStorage.getItem("AcademicCoachPortalId")
            : null;
            if(!academicId) return;
        const socket = getSocket(academicId);
        const handlecount =(data : TeacherData)=>{
            console.log("📩 Received WebSocket Data:", data);
            setTeachersData((pre)=>
              pre.map((app)=>
                app._id?.toString() === data._id?.toString() ? {...app , studentCount : data.studentCount} : app
              )
          )    
        };
        socket.on("academicDashboardTeachersStudentCount",handlecount);
        return()=>{
        socket.off("academicDashboardTeachersStudentCount",handlecount);
        }
    },[]);
  useEffect(() => {
    const fetchTeachersData = async () => {
      try {
          const token =
    typeof window !== "undefined" ? localStorage.getItem("AcademicCoachAuthToken") : null;

  if (!token) {
    console.error("❌ AdminAuthToken not found");
    return;
  }
        const teacherId = "some_teacher_id"; // Replace with actual teacherId
        const response = await axios.get<ApiResponse>(
          `https://api.blackstoneinfomaticstech.com/teacher-student-count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              },
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
    >
      <div className="col-span-12 p-2 text-[#000] dark:text-[#fff]">
        <h3 className="text-[16px] font-semibold text-[#000] dark:text-[#fff] mb-1 px-3 py-2 justify-between flex items-center">
         <div>Teachers</div>
         <div>Students</div>
        </h3>
        <div className="overflow-y-scroll scrollbar-none">
          <table className="min-w-full">
            {/* <thead>
              <tr>
                <th className="px-4 py-2 text-start text-[12px] font-normal text-[#000] dark:text-[#fff] underline underline-offset-2">
                  Teachers
                </th>
                <th className="px-4 py-2 text-center text-[12px] font-normal text-[#000] dark:text-[#fff] underline underline-offset-2">
                  Students
                </th>
              </tr>
            </thead> */}
            <tbody className="mb-1">
              {teachersData.map((teacher) => (
                <tr key={teacher._id ?? teacher.teacherEmail}>
                  <div className="justify-between items-center flex border-b-[1px]  dark:border-[#585858] px-3 py-1">

                  
                  <td className=" py-1 text-[11px] text-center font-normal flex text-[#010e30] opacity-90 dark:text-[#fff]">
                    {/* <FaUserCircle className="text-[#000] mr-2 mt-1" /> */}
                    <img src="/assets/images/teacheravt.svg" alt="" className="mr-1 -mt-[3px]"/>
                    {teacher.teacherName}
                  </td>
                  <td className=" py-1 text-[13px] whitespace-nowrap text-center text-[#010e30] dark:text-[#fff] font-medium">
                    {teacher.studentCount}
                  </td>
                  </div>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Link>
  );
}
