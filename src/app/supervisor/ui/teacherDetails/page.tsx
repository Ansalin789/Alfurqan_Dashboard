"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { FaRegEdit } from "react-icons/fa";
import { VscGraphLeft } from "react-icons/vsc";
import { IoMdAttach } from "react-icons/io";

import BaseLayout3 from "@/components/BaseLayout3";
import SupervisorHeader from "../../components/supervisorHeader";

const TeacherDetails = () => {
  const router = useRouter();
  interface Teacher {
    _id: string;
    userId: string;
    userName: string;
    email: string;
    profileImage?: string | null;
    level: string;
    subject: string;
    rating: number;
  }
  interface Student {
    studentId: string;
    studentFirstname: string;
    studentLastName: string;
  }

  interface StatsResponse {
    totalStudents: number;
    totalClasses: number;
    totalAttendance: number | string;
    totalWorkingHours: number | string;
    overallPerformance: number;
    students: Student[];
  }
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<Teacher>();
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("SupervisorAuthToken")
            : null;

        if (!token) {
          console.error("❌ SupervisorAuthToken not found");
          return;
        }
        const response = await fetch(
          `https://api.blackstoneinfomaticstech.com/users/${localStorage.getItem(
            "supervisormanageTeacherId"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "appliation/json",
            },
          }
        );
        const data = await response.json();

        console.log("Fetched data:", data);
        setTeachers(data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    const fetchStats = async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("SupervisorAuthToken")
          : null;
          
      const teacherId =
          typeof window !== "undefined"
            ? localStorage.getItem("supervisormanageTeacherId")
            : null;
      if (!token) {
        console.error("❌ SupervisorAuthToken not found");
        return;
      }

      const response = await fetch(
        `http://localhost:5001/classstudentsattendancecounts?teacherId=${teacherId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch data");
      const data: StatsResponse = await response.json();
      console.log("Fetched stats:", data);
      setStats(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };
    fetchStats();
    fetchTeachers();
  }, []);

 



  // Format working hours like "32h 40m"
  const formatWorkingHours = (hours: number | string) => {
    if (typeof hours === "number") {
      const h = Math.floor(hours);
      const m = Math.round((hours - h) * 60);
      return `${h}h ${m}m`;
    }
    return hours;
  };
  return (
    <BaseLayout3>
      <SupervisorHeader
        currentSection="Teacher Details"
        showBackButton={true}
      />
      <div className="p-2 mx-auto">
        {/* Main Container */}
        <div className="flex gap-x-5 w-auto">
          {/* Left Profile Card */}
          <div className="bg-white dark:bg-[#3b3b3b] shadow-lg rounded-xl p-0 h-[616px] w-[400px]">
            {/* Header with edit icon */}
            <div className="bg-[#5e6578] h-[200px] rounded-t-xl relative">
              {/* Edit icon */}
              <button className="absolute top-8 right-6 text-white rounded-full p-1 hover:bg-white/40">
                <FaRegEdit className="w-10" />
              </button>
              {/* Profile image */}
              <div className="absolute left-1/2 -bottom-16 transform -translate-x-1/2">
                <Image
                  className="rounded-full border-2 border-white"
                  src={teachers?.profileImage ?? "/assets/images/proff.jpg"}
                  width={155}
                  height={155}
                  alt="Profile"
                />
              </div>
            </div>
            {/* Name and role */}
            <div className="pt-20 pb-2 text-center">
              <h2 className="text-xl font-semibold text-[#22223b] dark:text-[#fff]">
                {teachers?.userName ?? "Will Jonto"}
              </h2>
              <p className="text-[#4b5563] dark:text-[#a1a1a1] text-sm">
                Teacher
              </p>
            </div>
            {/* Divider */}
            <hr className="my-2 border-gray-200" />
            {/* Personal Info */}
            <div className="px-6 pb-6">
              <h3 className="text-[16px] font-semibold mb-4 text-[#22223b] dark:text-[#fff]">
                Personal Info
              </h3>
              <ul className="space-y-2 text-[14px]">
                <li className="flex justify-between">
                  <span className="font-normal text-gray-600 dark:text-[#fff] opacity-[90%]">
                    Full Name
                  </span>
                  <span className="text-gray-500 text-[12px] dark:text-[#a1a1a1]">
                    {teachers?.userName}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="font-normal text-gray-600 dark:text-[#fff] opacity-[90%]">
                    Time Zone
                  </span>
                  <span className="text-gray-500 text-[12px] dark:text-[#a1a1a1]">
                    USA( time)
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="font-normal text-gray-600 dark:text-[#fff] opacity-[90%]">
                    Country
                  </span>
                  <span className="text-gray-500 text-[12px] dark:text-[#a1a1a1]">
                    USA
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="font-normal text-gray-600 dark:text-[#fff] opacity-[90%]">
                    Level
                  </span>
                  <span className="text-gray-500 text-[12px] dark:text-[#a1a1a1]">
                    {teachers?.level}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="font-normal text-gray-600 dark:text-[#fff] opacity-[90%]">
                    Date Of Joining
                  </span>
                  <span className="text-gray-500 text-[12px] dark:text-[#a1a1a1]">
                    06/10/2023
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="font-normal text-gray-600 dark:text-[#fff] opacity-[90%]">
                    Course Handling
                  </span>
                  <span className="text-gray-500 text-[12px] dark:text-[#a1a1a1]">
                    {teachers?.subject}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="font-normal text-gray-600 dark:text-[#fff] opacity-[90%]">
                    BioData
                  </span>
                  <a
                    href="/"
                    className="text-[#5183ca] underline flex items-center gap-1"
                  >
                    <IoMdAttach className="rotate-45" /> Resume
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Section */}
          <div className="items-center rounded-xl w-[915px] h-[616px]">
            {/* Lecture Performance */}
            <div className="bg-[#5e6578] h-[316px] text-white p-4 rounded-2xl shadow-lg text-center flex flex-col justify-center items-center">
              <h4 className="text-[24px] font-medium">Lecture Performance</h4>
              <div className="flex items-center space-x-4 mt-4">
                <div className="text-center">
                  <p className="text-[20px] font-medium">{stats?.overallPerformance?.toFixed(1)}%</p>
                  <p className="text-[16px] font-normal">
                    Overall Performance Score
                  </p>
                </div>
              </div>
              <div className="bg-[#6e768c] p-4 mt-4 rounded-xl">
                <p className="text-[14px] font-normal">
                  Performance has increased by 20% than the Previous Month
                </p>
              </div>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-2 mt-2">
           {[
          {
            title: "Total Students",
            value: stats?.totalStudents?.toString() ?? "-",
            sub: "60% increase than Last Month",
          },
          {
            title: "Total Classes",
            value: stats?.totalClasses?.toString() ?? "-",
            sub: "80% increase than Last Month",
          },
          {
            title: "Total Attendance",
            value: stats?.totalAttendance?.toString() ?? "-",
            sub: "90% Progressive than Last Month",
          },
          {
            title: "Total Working Hours",
            value: formatWorkingHours(stats?.totalWorkingHours ?? "-"),
            sub: "95% Progressive than Last Month",
          },
        ].map((item) => (
         
                <div
                  key={item.title}
                  className="bg-[#7689bd] text-white p-6 rounded-2xl shadow-lg"
                >
                  <h4 className="text-[20px] font-semibold mb-[19px]">
                    {item.title}
                  </h4>
                  <p className="text-[15px] font-semibold mt-2 flex gap-1">
                    {item.value}{" "}
                    <VscGraphLeft className="rotate-180 mt-[2px]" />
                  </p>
                  <p className="text-[12px] mt-1">{item.sub}</p>
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
