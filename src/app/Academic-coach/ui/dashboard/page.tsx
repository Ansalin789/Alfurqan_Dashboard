"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import BaseLayout1 from "../../../../components/BaseLayout1";
import TotalList from "../../components/TotalList";
import NextEvaluationClass from "../../components/NextEvaluationClass";
import TeachersStudents from "../../components/TeachersStudent";
import Countries from "../../components/Countries";
import Teacherscard from "../../components/Teachercard";
import Calender from "../../components/Calender";
import UpcomingClasses from "../../components/UpcommingClasses";
import AcademicHeader from "../../components/academicHeader";
import { getSocket } from "@/app/utils/socket";

type StudentData = {
  id: number;
  name: string;
  mobile: string;
  country: string;
  preferredTeacher: string;
  date: string;
  time: string;
};
interface Student {
  learningInterest: string; // Replace with the exact type if known
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentPhone: number;
  studentCountry: string;
  preferredTeacher: string;
  preferredFromTime: string;
  preferredToTime: string;
  preferredDate:Date;
  classStatus?: string;
  status?: string;
  trialClassStatus: string;
  studentStatus: string;
}

interface EvaluationItem {
  paymentLink: string;
  _id: string;
  student: Student;
  trialClassStatus: string;
  assignedTeacher: string;
  paymentStatus: string;
}

export default function Dashboard() {
  const [evaluationList, setEvaluationList] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
   useEffect(()=>{
     const academicId = typeof window !== "undefined"
        ? localStorage.getItem("AcademicCoachPortalId")
        : null;
        if(!academicId) return;
    const socket = getSocket(academicId);
     const handleList =(data : {event : string, data : EvaluationItem , sender : string})=>{
        console.log("📩 Received WebSocket Data:", data);
        if(data.event === "update"){
          console.log("➡️ Action: create", data.data._id);
          const formatted : StudentData ={
            id : evaluationList.length + 1,
            name: `${data.data.student.studentFirstName} ${data.data.student.studentLastName}`,
            mobile: data.data.student.studentPhone.toString(),
            country: data.data.student.studentCountry,
            preferredTeacher: data.data.student.preferredTeacher,
            date: new Date(data.data.student.preferredDate).toLocaleDateString(),
            time: `${data.data.student.preferredFromTime} - ${data.data.student.preferredToTime}`,
          }
          setEvaluationList((pre)=> [...pre, formatted]);
        }
     }
    socket.on('academicStudentList',handleList);
    return ()=>{
      socket.off('academicStudentList',handleList);
    }
   },[]);
  useEffect(() => {
    // Fetch data from API
    const academicId = typeof window !== "undefined"
        ? localStorage.getItem("AcademicCoachPortalId")
        : null;
    console.log("academicId>>", academicId);
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("AcademicCoachAuthToken")
        : null;

    if (!token) {
      console.error("❌ AdminAuthToken not found");
      return;
    }
    axios
      .get(`https://api.blackstoneinfomaticstech.com/evaluationlist`, {
        params: { academicCoachId: academicId },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (!response.data) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.data;
      })
      .then((data) => {
        const formattedData: StudentData[] = data.evaluation.map(
          (
            item: {
              student: {
                studentFirstName: string;
                studentLastName: string;
                studentPhone: string;
                studentCountry: string;
                preferredTeacher: string;
                preferredDate: string;
                preferredFromTime: string;
                preferredToTime: string;
              };
            },
            index: number
          ) => ({
            id: index + 1,
            name: `${item.student.studentFirstName} ${item.student.studentLastName}`,
            mobile: item.student.studentPhone,
            country: item.student.studentCountry,
            preferredTeacher: item.student.preferredTeacher,
            date: new Date(item.student.preferredDate).toLocaleDateString(),
            time: `${item.student.preferredFromTime} - ${item.student.preferredToTime}`,
          })
        );
        setEvaluationList(formattedData.slice(-5)); // Keep only the latest 5 records
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (error) return <div>Error: {error}</div>;
  return (
    <BaseLayout1>
      <AcademicHeader currentSection="Dashboard" />
      <div className="flex flex-row gap-4 p-0 min-h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <TotalList />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <NextEvaluationClass />
          </div>

          {/* Charts Row */}
          <div className="flex gap-4">
            <div className="w-[33%] bg-white dark:bg-[#343434] rounded-xl h-[350px] overflow-scroll scrollbar-none flex flex-col">
              <TeachersStudents />
            </div>
            <div className="w-[33%] bg-white rounded-xl dark:bg-[#343434] h-[350px] overflow-scroll scrollbar-none flex flex-col">
              <Countries />
            </div>
            <div className="w-[33%] bg-white rounded-xl dark:bg-[#343434] h-[350px] overflow-scroll scrollbar-none flex flex-col">
              <Teacherscard />
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-xl shadow-lg dark:bg-[#343434]">
            <div className="overflow-x-auto scrollbar-none h-full">
              <div className="overflow-y-auto h-[335px] rounded-xl scrollbar-none">
                <table className="min-w-full text-xs border-collapse table-fixed px-4">
                  <thead className=" text-[12px] bg-[#4C6993] text-white dark:bg-[#44699d]">
                    <tr>
                      {[
                        "Trail",
                        "Name",
                        "Mobile",
                        "Country",
                        "Preferred Teacher",
                        "Date",
                        "Time",
                      ].map((col) => (
                        <th
                          key={col}
                          className="py-4 px-2 font-semibold text-left border border-[#466993] dark:border-[#466993]"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {evaluationList.map((item, index) => (
                      <tr
                        key={item.id}
                        className="text-[11px] px-2 py-4 border-none outline-none odd:bg-[#f8f8f8] even:bg-[#ffffff] dark:odd:bg-[#2c2c2c] dark:even:bg-[#303030]"
                      >
                        <td className="py-4 px-2 text-left">{item.id}</td>
                        <td className="py-4 px-2 text-left">{item.name}</td>
                        <td className="py-4 px-2 text-left">{item.mobile}</td>
                        <td className="py-4 px-2 text-left">{item.country}</td>
                        <td className="py-4 px-2 text-left">
                          {item.preferredTeacher}
                        </td>
                        <td className="py-4 px-2 text-left">{item.date}</td>
                        <td className="py-4 px-2 text-left">{item.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
              <span className="text-left -ml-60 ">
                {/* Showing {applicants.length} of {totalApplications} */}
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-[310px] flex flex-col gap-4">
          {/* Calendar */}
          <div className="rounded-xl shadow-lg">
            <div className="h-[320px] bg-white rounded-xl flex items-center justify-center text-gray-400 dark:bg-[#343434]">
              <Calender />
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-xl shadow-lg p-4 dark:bg-[#343434] h-[600px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[16px] font-semibold text-gray-700 dark:text-[#ffff]">
                Upcoming Class
              </h3>
              <button className="px-2 py-1 rounded flex font-medium items-center gap-1 text-[10px] dark:text-[#576CBC] dark:bg-[#3D414A] bg-[#ebefff] text-[#576CBC]">
                Today 
              </button>
            </div>

            {/* Timeline */}
            <div className="relative pl-4 space-y-4 h-full overflow-y-auto scrollbar-none">
              <UpcomingClasses />
            </div>
          </div>
        </div>
      </div>
    </BaseLayout1>
  );
}
