"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";

import BaseLayout3 from "@/components/BaseLayout3";

const TeacherDetails = () => {
  const router = useRouter();
  interface Teacher {
      _id:string;
      userId: string;
      userName: string;
      email: string;
      profileImage?: string | null;
      level: string;
      subject: string;
      rating: number;
    }
  
    const [teachers, setTeachers] = useState<Teacher>();
    useEffect(() => {
      
          const fetchTeachers = async () => {
            try {
              const response = await fetch(`https://alfurqanacademy.tech/users/${localStorage.getItem('supervisormanageTeacherId')}`);
              const data = await response.json();
      
              console.log('Fetched data:', data);
                 setTeachers(data);
            } catch (error) {
              console.error('Error fetching teachers:', error);
    
          }
        };
    
        fetchTeachers();
      }, []);

  return (
    <BaseLayout3>
      <div className="p-6 mt-6 min-h-screen w-full flex flex-col">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <IoArrowBackCircleSharp
              className="text-[30px] text-[#012a4a] cursor-pointer"
              onClick={() => router.push("/supervisor/ui/teachers")}
            />
            <h4 className="text-xl font-bold text-[#012A4A]">Teacher Details</h4>
          </div>
        </div>

        {/* Main Container */}
        <div className="flex flex-col md:flex-row gap-8 ">
          {/* Left Profile Card */}
          <div className="bg-white rounded-lg shadow-lg w-full md:w-[350px] overflow-hidden">
            <div className="bg-[#012A4A] relative p-6 text-center">
              <Image
                className="rounded-full border-4 border-white mx-auto"
                src="/assets/images/proff.jpg"
                width={100}
                height={100}
                alt="Profile"
              />
              <h2 className="mt-4 text-2xl font-semibold text-white">Will Jonto</h2>
              <p className="text-gray-300 text-sm">Teacher</p>
            </div>
            <div className="p-6 text-gray-800">
              <h3 className="text-lg font-semibold mb-4">Personal Info</h3>
              <ul className="space-y-2 text-sm">
                <li><strong>Full Name:</strong> {teachers?.userName}</li>
                <li><strong>Time Zone:</strong> USA (time)</li>
                <li><strong>Country:</strong> USA</li>
                <li><strong>Level:</strong> {teachers?.level}</li>
                <li><strong>Date of Joining:</strong> 06/10/2023</li>
                <li><strong>Course Handling:</strong> {teachers?.subject}</li>
                <li><strong>Biodata:</strong> <a href="/" className="text-blue-600 underline">Resume</a></li>
              </ul>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex-grow flex flex-col gap-8 justify-center items-center">
            {/* Lecture Performance */}
            <div className="bg-[#1A588A] text-white p-6 rounded-2xl shadow-lg w-[450px]">
              <h4 className="text-xl font-semibold">Lecture Performance</h4>
              <div className="flex items-center space-x-4 mt-4">
                <img
                  className="rounded-full border-2 border-white w-14 h-14"
                  src="/assets/images/proff.jpg"
                  alt="Profile"
                />
                <div>
                  <p className="text-3xl font-bold">91.5%</p>
                  <p className="text-sm">Overall Performance Score</p>
                </div>
              </div>
              <div className="bg-[#034980] p-5 mt-4 rounded-lg">
                <p className="text-lg font-bold">82%</p>
                <p className="text-sm">Performance has increased by 20% than the Previous Month</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-8">
              {[ 
                { title: "Total Students", value: "52", sub: "60% increase than Last Month" },
                { title: "Total Classes", value: "110", sub: "80% increase than Last Month" },
                { title: "Total Attendance", value: "97%", sub: "90% Progressive than Last Month" },
                { title: "Total Working Hours", value: "32h 40m", sub: "95% Progressive than Last Month" }
              ].map((item, index) => (
                <div key={item.title} className="bg-[#012A4A] text-white p-6 rounded-2xl shadow-lg">
                  <h4 className="text-lg font-semibold">{item.title}</h4>
                  <p className="text-3xl font-bold mt-2">{item.value}</p>
                  <p className="text-xs mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout3>
  );
};

export default TeacherDetails;
