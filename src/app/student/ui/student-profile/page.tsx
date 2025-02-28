"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import BaseLayout2 from "@/components/BaseLayout2";
import { FaUsers } from "react-icons/fa6";
import { LuListTodo } from "react-icons/lu";
import { MdAutoStories } from "react-icons/md";
import { FaMedal, FaArrowCircleUp } from "react-icons/fa";
import axios from "axios";

interface Student {
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

interface ApiResponse {
  totalCount: number;
  students: StudentRecord[];
}

const StudentProfile = () => {
  const router = useRouter();

  const [studentData, setStudentData] = useState<StudentRecord>();
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
    const auth = localStorage.getItem("StudentAuthToken");

    console.log("Retrieved Student ID:", studentId);

    if (studentId) {
      const fetchData = async () => {
        try {
          const studentId = localStorage.getItem("StudentPortalId");
          const response = await axios.get<ApiResponse>(
            "http://localhost:5001/alstudents",
            {
              headers: { Authorization: `Bearer ${auth}` },
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
            setStudentData(filteredStudent);
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
  return (
    <BaseLayout2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mx-auto">
        {/* Left Section - Student Info */}
        <div className="md:col-span-1 md:mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800 p-4">
            My Profile
          </h1>

          <div className="flex flex-col md:flex-row pt-4 mt-2">
            {/* Back Button */}
            <div className="p-2">
              <IoArrowBackCircleSharp
                className="text-[25px] bg-[#fff] rounded-full text-[#012a4a] cursor-pointer"
                onClick={() => router.push("/student/ui/dashboard")}
              />
            </div>

            {/* Profile Card */}
            <div className="flex flex-col items-center bg-[#fff] shadow-lg rounded-2xl md:w-[350px] h-[600px]">
              <div className="bg-[#012a4a] align-middle p-6 w-full h-1/4 rounded-t-2xl">
                {/* Profile Image */}
                <div className="justify-center">
                  <Image
                    src="/assets/images/student-profile1.png"
                    alt="Profile"
                    className="rounded-full mx-auto w-24 h-24 mb-4 mt-[73px]"
                    width={150}
                    height={150}
                  />
                </div>

                {/* Name & Role */}
                <div className="justify-center text-center border-b-2 border-black pb-2">
                  <h2 className="text-2xl font-semibold mb-2">
                    {studentData?.username ?? ""}
                  </h2>
                  <p className="text-[#012A4A] mb-4">Student</p>
                </div>

                {/* Personal Info */}
                <div className="text-left w-full p-2 pt-6">
                  <h3 className="font-semibold mb-2">Personal Info</h3>
                  <p className="text-gray-800 text-[14px] mt-4">
                    <span className="font-semibold text-[14px]">
                      Full Name:{" "}
                    </span>
                    {studentData?.username ?? ""}
                  </p>
                  <p className="text-gray-800 text-[14px] mt-3">
                    <span className="font-semibold text-[14px]">Email: </span>
                    {studentData?.student?.studentEmail}
                  </p>
                  <p className="text-gray-800 text-[14px] mt-3">
                    <span className="font-semibold text-[14px]">
                      Phone Number:{" "}
                    </span>
                    {studentData?.student?.studentPhone}
                  </p>
                  {/* <p className="text-gray-800 text-[14px] mt-3 hidden">
            <span className="font-semibold text-[14px]">Level: </span>{studentData?.student?.level ?? "N/A"}
          </p> */}
                  <p className="text-gray-800 text-[14px] mt-3">
                    <span className="font-semibold text-[14px]">Package: </span>
                    {studentData?.student?.package}
                  </p>

                  {/* Upgrade Button */}
                  <p className="p-2 flex justify-center items-center mt-10 bg-[#012a4a] rounded-2xl text-white">
                    Upgrade Your Package{" "}
                    <FaArrowCircleUp className="ml-2 mt-1" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Statistics and Assignment List */}
        <div className="md:col-span-3">
          <button
            className="ml-[900px] flex flex-1 cursor-pointer rounded-md mt-1 bg-black p-4 px-4 py-2 text-[#fff] text-[11px]"
            onClick={() => router.push("/student/ui/sign")}
          >
            Logout
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 mx-auto w-full md:w-[800px]">
              <div className="flex flex-wrap justify-center gap-6 p-2 mt-[9px] ml-40">
                <div className="w-[200px] h-[150px] bg-white rounded-2xl shadow-md flex items-center p-4 border border-[#012A4A]">
                  <div className="mr-6 flex justify-center items-center relative">
                    <div className="bg-blue-100 rounded-full p-2">
                      <FaUsers className="text-[#4ABDE8]" />
                    </div>
                  </div>
                  <div>
                    <div className="text-[24px] font-bold text-gray-800">
                      97%
                    </div>
                    <p className="text-gray-800 text-[16px] font-semibold mb-2">
                      Attendance
                    </p>
                  </div>
                </div>
                <div className="w-[200px] h-[150px] bg-white rounded-2xl shadow-md flex items-center p-4 border border-[#012A4A]">
                  {/* Circular Progress */}
                  <div className="mr-6 flex justify-center items-center relative">
                    <div className="bg-[#CFCEFF] rounded-full p-2">
                      <LuListTodo className="text-[#8785FF]" />
                    </div>
                  </div>
                  <div>
                    <div className="text-[24px] font-bold text-gray-800">
                      {studentData?.student?.package}
                    </div>
                    <p className="text-gray-800 text-[16px] font-semibold mb-2">
                      Package
                    </p>
                  </div>
                </div>
                <div className="w-[200px] h-[150px] bg-white rounded-2xl shadow-md flex items-center p-4 border border-[#012A4A]">
                  {/* Circular Progress */}
                  <div className="mr-6 flex justify-center items-center relative">
                    <div className="bg-[#FAE27C] rounded-full p-2">
                      <MdAutoStories className="text-[#FFAE41]" />
                    </div>
                  </div>
                  <div>
                    <div className="text-[24px] font-bold text-gray-800">
                      64%
                    </div>
                    <p className="text-gray-800 text-[16px] font-semibold mb-2">
                      Performance
                    </p>
                  </div>
                </div>
                <div className="w-[200px] h-[150px] bg-white rounded-2xl shadow-md flex items-center p-4 border border-[#012A4A]">
                  {/* Circular Progress */}
                  <div className="mr-6 flex justify-center items-center relative">
                    <div className="bg-[#FFDBF7] rounded-full p-2">
                      <FaMedal className="text-[#FF88E5]" />
                    </div>
                  </div>
                  <div>
                    <div className="text-[24px] font-bold text-gray-800">
                      245
                    </div>
                    <p className="text-gray-800 text-[16px] font-semibold mb-2">
                      Reward Points
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment List */}
            <div className="mt-[380px] -ml-[250px] mx-auto ">
              <div className="w-[500px] mx-auto p-3 rounded-lg shadow-md bg-white border border-black">
                <h2 className="text-[14px] font-bold text-orange-600 px-4">
                  Terms and Conditions
                </h2>
                <h3 className="text-[13px] font-semibold mt-2 px-4">
                  Your Agreement
                </h3>
                <div className="mt-2 p-4 bg-gray-50 rounded-md max-h-[180px] overflow-y-auto border scrollbar-thin">
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
          <div className="ml-[770px] -mt-[150px]">
            <img
              src="/assets/images/refera.png"
              alt=""
              width={250}
              height={250}
              className="w-20"
            />
            <img
              src="/assets/images/refera1.png"
              alt=""
              width={150}
              height={150}
              className="w-20"
            />
            <p className="text-[13px] font-semibold">
              Ready to get more hours ?
            </p>
            <p className="text-[11px] text-gray-600">
              Invite your friends now and unlock extra space for everyone!
            </p>
          </div>
        </div>
      </div>
    </BaseLayout2>
  );
};

export default StudentProfile;
