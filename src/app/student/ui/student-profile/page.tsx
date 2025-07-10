"use client";

import React, { useState, useRef, useEffect } from "react";
import { MdTune } from "react-icons/md";
import { MoreVertical, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import Modal from "react-modal";
import StudentHeader from "../../components/StudentHeader";


import Image from "next/image";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import BaseLayout2 from "@/components/BaseLayout2";
import { FaUsers } from "react-icons/fa6";
import axios from "axios";

interface Student {
  course: string;
  studentId: string;
  studentEmail: string;
  studentPhone: number;
  gender: string;
  package: string;
}

interface StudentRecord {
  student: Student;
  _id: string;
  username: string;
  password: string;
  role: string;
  status: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  __v: number;
  classScheduleCount: number;
}
interface StudentDashboardCounts {
  totalLevel: number;
  totalAttendance: number;
  totalClasses: number;
  totalDuration: number;
}

interface ApiResponse {
  totalCount: number;
  students: StudentRecord[];
}

type CardProps = {
  title: string;
  value: string | number;
  description: string;
};

const Card = ({ title, value, description }: CardProps) => (
  <div className="bg-[#7689BD] rounded-lg shadow-md p-4">
    <div className="text-[20px] text-[#fff] font font-semibold mb-4">
      {title}
    </div>
    <div className="text-[14px] text-[#fff] font-semibold ">{value}</div>
    <div className="text-[12px] text-[#fff] ">{description}</div>
  </div>
);

const StudentProfile = () => {
  const router = useRouter();

  const [studentRecord, setStudentRecord] = useState<StudentRecord>();
  const [studentData, setStudentData] = useState<StudentData>();
  interface StudentData {
    _id: string;
    username: string;
    role: string;
    status: string;
    createdDate: string;
    createdBy: string;
    updatedDate: string;
    classScheduleCount: number;
    student: {
      studentId: string;
      studentEmail: string;
      studentPhone: number;
      gender: string;
      package: string;
      course: string;
    };
  }
  useEffect(() => {
    const studentId = localStorage.getItem("StudentPortalId");
   

    console.log("Retrieved Student ID:", studentId);

    if (studentId) {
      const fetchData = async () => {
        try {
const token =
    typeof window !== "undefined" ? localStorage.getItem("StudentAuthToken") : null;

  if (!token) {
    console.error("❌ StudentAuthToken not found");
    return;
  }  
          const studentId = localStorage.getItem("StudentPortalId");
          const response = await axios.get<ApiResponse>(
            "https://api.blackstoneinfomaticstech.com/alstudents",{
               headers: { "Content-Type": "application/json",
               'Authorization': `Bearer ${token}`,
           },
            }
          );

          if (!studentId) {
            console.warn("No StudentPortalId found in localStorage");
            return;
          }

          // Filter the student based on studentId
          const filteredStudent = response.data.students.find(
            (student) => student._id === studentId
          );

          if (filteredStudent) {
            // Ensure the filteredStudent matches the StudentData type
            setStudentData({
              ...filteredStudent,
              student: {
                studentId: filteredStudent.student.studentId,
                studentEmail: filteredStudent.student.studentEmail,
                studentPhone: filteredStudent.student.studentPhone,
                gender: filteredStudent.student.gender,
                package: filteredStudent.student.package,
                course: filteredStudent.student.course ?? "", // fallback if course is missing
              },
            });
            console.log("Filtered Student Data:", filteredStudent);
          } else {
            console.warn(
              "No matching student found for StudentPortalId:",
              studentId
            );
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      };

      fetchData();
    }
  }, []);

  // Add state for dashboard stats
  const [dashboardStats, setDashboardStats] = useState<StudentDashboardCounts | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("StudentAuthToken") : null;
        const studentId = localStorage.getItem("StudentPortalId");
        if (!token || !studentId) {
          setStatsError("Missing student ID or token");
          setStatsLoading(false);
          return;
        }
        const response = await axios.get<StudentDashboardCounts>(
          "http://localhost:5001/dashboard/student/counts",
          {
            params: { studentId },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDashboardStats(response.data);
      } catch (err) {
        setStatsError("Failed to load stats");
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);
  return (
    <BaseLayout2>
      <div>
        <StudentHeader
          currentSection="Profile"
          showBackButton={true}
          showBackPath="dashboard"
        />

        {/* Top section */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Profile Card */}
          <div className="w-[560px] h-[246px] bg-[#54638C] rounded-lg text-white p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start">
            {/* Profile Image + Name */}
            <div className="flex flex-col items-center sm:pr-6 sm:border-r border-white/30">
              <img
                src="/assets/images/alstudent.jpg"
                alt="profile"
                className="w-[150px] h-[150px] rounded-full object-cover"
              />
              <h2 className="text-center text-[18px] font-semibold mt-3">
              {studentData?.username ?? ""}
              </h2>
              <p className="text-[12px] text-[#C9C9C9] mt-2">
              {studentData?.student?.studentEmail}
              </p>
            </div>

            {/* Personal Info */}
            <div className="pt-8 sm:pl-6 w-full">
              <h3 className="text-[16px] font-semibold mb-3">Personal Info</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white text-[14px]">Contact</span>
                  <span className="text-[#DADADACC] text-[12px]">
                  {studentData?.student?.studentPhone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white text-[14px]">Level</span>
                  <span className="text-[#DADADACC] text-[12px]">
                  {dashboardStats?dashboardStats.totalLevel : "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white text-[14px]">Package</span>
                  <span className="text-[#DADADACC] text-[12px]">
                    {studentData && studentData.student && studentData.student.package ? studentData.student.package : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white text-[14px]">Course</span>
                  <span className="text-[#DADADACC] text-[12px]">
                  {studentData?.student?.course}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            <Card
              title="Performance"
              value="72%"
              description="60% increase than Last Month"
            />
            <Card
              title="Package"
              value={studentData && studentData.student && studentData.student.package ? studentData.student.package : "-"}
              description="Upgraded package"
            />
            <Card
              title="Level"
              value={dashboardStats ? dashboardStats.totalLevel : "-"}
              description="Level of the Student"
            />
            <Card
              title="Total Attendance"
              value={dashboardStats ? dashboardStats.totalAttendance : "-"}
              description="Your total attendance"
            />
          </div>
        </div>



        <div className="w-full bg-[#FAFAFB] rounded-lg dark:bg-[#343434] mt-2">
              <div className="mx-auto p-3">
                <h2 className="text-[18px] font-semibold text-black px-4">
                  Terms and Conditions
                </h2>
                <h3 className="text-[13px] font-semibold mt-2 px-4">
                  Your Agreement
                </h3>
                <div className="mt-2 p-4 bg-gray-50 rounded-md max-h-[300px] overflow-y-auto  scrollbar-thin">
                  <p className="text-[10px] text-gray-600">
                    Last Revised: December 16, 2013
                  </p>
                  <p className="mt-2 text-gray-700 text-[11px]">
                    Welcome to www.lorem-ipsum.info. This site is provided as a
                    service to our visitors and may be used for informational
                    purposes only. Because the Terms and Conditions contain
                    legal obligations, please read them carefully.
                  </p>
                  <h4 className="font-semibold mt-3 text-gray-800 text-[11px]">
                    1. YOUR AGREEMENT
                  </h4>
                  <p className="text-gray-700 text-[11px] mt-1">
                    By using this Site, you agree to be bound by, and to comply
                    with, these Terms and Conditions. If you do not agree to
                    these Terms and Conditions, please do not use this site.
                  </p>
                  <p className="text-gray-700 text-[11px] mt-2">
                    PLEASE NOTE: We reserve the right, at our sole discretion,
                    to change, modify or otherwise alter these Terms and
                    Conditions at any time. Unless otherwise indicated,
                    amendments will become effective immediately. Please review
                    these Terms and Conditions periodically.
                  </p>
                  <h4 className="font-semibold mt-3 text-gray-800 text-[11px]">
                    2. PRIVACY
                  </h4>
                  <p className="text-gray-700 text-[11px] mt-1">
                    Please review our Privacy Policy, which also governs your
                    visit to this Site, to understand our practices.
                  </p>
                  <h4 className="font-semibold mt-3 text-gray-800 text-[11px]">
                    3. LINKED SITES
                  </h4>
                  <p className="text-gray-700 text-[11px] mt-1">
                    This Site may contain links to other independent third-party
                    Web sites (&quot;Linked Sites&quot;). These Linked Sites are
                    provided solely as a convenience to our visitors.
                  </p>
                </div>
              </div>
            </div>  
        </div>
    </BaseLayout2>
  );
};

export default StudentProfile;

