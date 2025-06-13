"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { FaRegEdit } from "react-icons/fa";
import { VscGraphLeft } from "react-icons/vsc";
import { IoMdAttach } from "react-icons/io";

import BaseLayout1 from "@/components/BaseLayout1";
import SupervisorHeader from "@/app/supervisor/components/supervisorHeader";
import ViewTeachersList from "../../components/viewteacherlist/page";
import { Search } from "lucide-react";

const TeacherDetails = () => {
  interface IProfessionalExperience {
    jobRole: string;
    organizationName: string;
    jobLocation: string;
    fromDate: string | null;
    toDate: string | null;
    jobDescription: string;
    _id: string;
  }

  interface ICandidateApplication {
    _id: string;
    candidateFirstName: string;
    candidateLastName: string;
    supervisor: {
      supervisorId: string;
      supervisorName: string;
      supervisorEmail: string;
      supervisorRole: string;
    };
    gender: string;
    applicationDate: string; // ISO date string
    candidateEmail: string;
    candidatePhoneNumber: number;
    candidateCountry: string;
    candidateCity: string;
    positionApplied: string;
    currency: string;
    expectedSalary: number;
    preferedWorkingHours: string;
    comments: string;
    applicationStatus: string;
    overallRating: number;
    professionalExperience: IProfessionalExperience[];
    skills: string;
    status: string;
    createdDate: string; // ISO date string
    createdBy: string;
    __v: number;
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
  const [teachers, setTeachers] = useState<ICandidateApplication>();
  const [activeTab, setActiveTab] = useState<"scheduled" | "completed">(
    "scheduled"
  );
  const [scheduledClasses, setScheduledClasses] = useState<ClassSchedule[]>([]);
  const [completedClasses, setCompletedClasses] = useState<ClassSchedule[]>([]);
  const [paginatedData, setPaginatedData] = useState<ClassSchedule[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const search = useSearchParams();
  const teacherId = search.get("teacherId");
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
          `https://api.blackstoneinfomaticstech.com/applicants/${teacherId}`,
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
        if (!token) {
          console.error("❌ SupervisorAuthToken not found");
          return;
        }

        const response = await fetch(
          `https://api.blackstoneinfomaticstech.com/classstudentsattendancecounts?teacherId=${teacherId}`,
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
        console.log(err.message ?? "Unknown error");
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
    <BaseLayout1>
      <SupervisorHeader
        currentSection="Teacher Details"
        showBackButton={true}
        showBackPath="/supervisor/ui/teachers"
      />
        <div className="p-2 mx-auto">
            {/* Main Container */}
            <div className="flex gap-x-5 w-auto">
            {/* Left Profile Card */}
            <div className="bg-[#5e6578] text-white rounded-xl flex items-center p-6 w-[630px] h-[246px]">
                {/* Profile Section */}
                <div className="flex flex-col items-center w-1/3">
                <Image
                    src="/assets/images/proff.jpg"
                    width={100}
                    height={100}
                    alt="Profile"
                    className="rounded-full border-4 border-white mb-4"
                />
                <h2 className="text-lg font-semibold">
                    {teachers?.candidateFirstName ?? "Will Jonto"}
                </h2>
                <p className="text-sm text-gray-200">
                    {teachers?.candidateEmail ?? "willjonto@gmail.com"}
                </p>
                </div>

                {/* Divider */}
                <div className="w-px bg-gray-400 h-[150px] mx-6" />

                {/* Personal Info */}
                <div className="w-2/3">
                <h3 className="text-[16px] font-semibold mb-4">Personal Info</h3>
                <ul className="text-sm space-y-2">
                    <li className="flex justify-between">
                    <span>Contact</span>
                    <span className="text-gray-300">(📞) 2345 6789 3245</span>
                    </li>
                    <li className="flex justify-between">
                    <span>Level</span>
                    <span className="text-gray-300">
                        {teachers?.overallRating ?? "2"}
                    </span>
                    </li>
                    <li className="flex justify-between">
                    <span>Package</span>
                    <span className="text-gray-300">Standard</span>
                    </li>
                    {/* <li className="flex justify-between">
            <span>Mother Tongue</span>
            <span className="text-gray-300">{teachers?.motherTongue ?? "Arabic"}</span>
        </li> */}
                </ul>
                </div>
            </div>

            {/* Right Section */}
           {/* Right Section */}
<div className="rounded-xl w-[610px] h-[246px] flex flex-col justify-between">
  <div className="grid grid-cols-2 gap-3 h-full">
    {[
      {
        title: "Performance",
        value: stats?.totalStudents?.toString() ?? "-",
        sub: "60% increase than Last Month",
      },
      {
        title: "Package",
        value: stats?.totalClasses?.toString() ?? "-",
        sub: "80% increase than Last Month",
      },
      {
        title: "Total Attendance",
        value: stats?.totalAttendance?.toString() ?? "-",
        sub: "90% Progressive than Last Month",
      },
      {
        title: "Total Reward Points",
        value: formatWorkingHours(stats?.totalWorkingHours ?? "-"),
        sub: "95% Progressive than Last Month",
      },
    ].map((item) => (
      <div
        key={item.title}
        className="bg-[#7689bd] text-white p-4 rounded-2xl shadow-md flex flex-col justify-between"
      >
        <h4 className="text-[16px] font-semibold">{item.title}</h4>
        <p className="text-[14px] font-semibold mt-2 flex gap-1 items-center">
          {item.value} <VscGraphLeft className="rotate-180" />
        </p>
        <p className="text-[12px]">{item.sub}</p>
      </div>
    ))}
  </div>
</div>

            </div>
 
            <div className="flex space-x-6  px-4 py-2 rounded-md">
          <button
            className={`relative text-[14px] transition font-medium ${
              activeTab === "scheduled"
                ? "text-[#576CBC] font-semibold"
                : "text-[#0A0A12] dark:text-[#fff] opacity-80"
            }`}
            onClick={() => {
              setActiveTab("scheduled");
              setCurrentPage(1);
            }}
          >
            Scheduled ({scheduledClasses.length})
            {activeTab === "scheduled" && (
              <span className="absolute left-0 ml-5 -bottom-1 w-[60px] h-[2px] rounded-full bg-[#576CBC] dark:text-[#576CBC]" />
            )}
          </button>

          <button
            className={`relative text-[14px] transition font-medium ${
              activeTab === "completed"
                ? "text-[#576CBC] font-semibold"
                : "text-[#0A0A12] dark:text-[#fff] opacity-80"
            }`}
            onClick={() => {
              setActiveTab("completed");
              setCurrentPage(1);
            }}
          >
            Completed ({completedClasses.length})
            {activeTab === "completed" && (
              <span className="absolute left-0 ml-3 -bottom-1 w-[60px] h-[3px] rounded-full bg-[#576CBC]" />
            )}
          </button>
        </div>

        <div className="w-full bg-[#FAFAFB] rounded-lg dark:bg-[#343434] mt-2">
          <div className="flex justify-between items-center px-4 py-0 rounded-md dark:bg-[#343434]">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Search className="w-4 h-4 text-gray-400 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search by keyword"
                className="bg-transparent outline-none text-[15px] w-52 py-3 "
                // value={searchText}
                // onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <div
              className="flex items-center gap-2 text-sm text-gray-400 dark:border-[#606060] py-2 border-r-2 border-l-2 px-48 -ml-60 cursor-pointer"
              //   onClick={() => setShowModal(true)}
            >
              {/* <BsFilterLeft /> */}
              <MdTune className="w-4 h-4" />
              <span>Filter</span>
            </div>

            <div className="flex items-center gap-2 text-[14px] text-gray-400 dark:text-gray-400">
              <span className="text-left -ml-60 ">
                {/* Showing {currentApplicants.length} Of{" "}
                                {dataToShow.length} */}
              </span>
            </div>
          </div>

          {/* Table */}
          <table
            className="table-auto xw-full"
            style={{ width: "100%", tableLayout: "fixed" }}
          >
            <thead className="text-[12px] bg-[#4C6993] text-white dark:bg-[#6087C0]">
              <tr className="font-medium">
                <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                  Student Name
                </th>
                <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                  Course
                </th>
                <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                  Date
                </th>
                <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                  Time
                </th>
                <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                  Class Type
                </th>
                <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-medium border border-[#4C6993] dark:border-[#6087C0]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-[#343434] dark:divide-gray-600">
              {paginatedData.map((item, index) => (
                <tr
                  key={item._id}
                  className={`text-[12px] ${
                    index % 2 === 0
                      ? "bg-[#fff] dark:bg-[#2C2C2C]"
                      : "bg-[#F8F8F8] dark:bg-[#303030]"
                  }`}
                >
                  <td className="px-3 py-3 text-[#3D8FDE] font-medium text-left">
                    {item.student.studentFirstName}{" "}
                    {item.student.studentLastName}
                  </td>
                  <td className="px-3 py-3 text-[#17243E] dark:text-[#FDFDFD] text-left">
                    {item.package}
                  </td>
                  <td className="px-3 py-3 text-[#17243E] dark:text-[#FDFDFD] text-left">
                    {new Date(item.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-3 py-3 text-[#17243E] dark:text-[#FDFDFD] text-left">
                    {item.startTime[0]} - {item.endTime[0]}
                  </td>
                  <td className="px-3 py-3 text-[#17243E] dark:text-[#FDFDFD] text-left">
                    Group Class
                  </td>
                  <td className="px-3 py-3 text-[#17243E] dark:text-[#FDFDFD] text-left">
                    <span
                      className={`font-semibold px-3 py-1 rounded-md text-[10px] ${
                        item.scheduleStatus === "Scheduled"
                          ? "bg-[#ECFDF3] dark:bg-[#374336] dark:text-[#377E36] text-[#377E36]"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.scheduleStatus}
                    </span>
                  </td>
                  <td className="py-1 text-center relative" ref={dropdownRef}>
                    <button
                      onClick={
                        item.scheduleStatus === "Scheduled"
                          ? () => toggleDropdown(index)
                          : undefined
                      }
                      className={`${
                        item.scheduleStatus === "Scheduled"
                          ? "cursor-pointer"
                          : "cursor-default"
                      }`}
                    >
                      <MoreVertical
                        className={`w-4 h-4 ${
                          item.scheduleStatus === "Scheduled"
                            ? "text-slate-600 dark:text-[#FDFDFD]"
                            : "text-gray-400 dark:text-gray-600 opacity-50"
                        }`}
                      />
                    </button>

                    {/* Only show dropdown if status is Scheduled and activeDropdown is set */}
                    {item.scheduleStatus === "Scheduled" &&
                      activeDropdown === index && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border dark:border-[#5c5c5c] dark:bg-[#343434]"
                        >
                          <div className="py-1">
                            <button
                              className="w-full text-left px-4 py-2 text-[12px] text-gray-700  dark:text-[#fff]"
                              onClick={handleReschedule}
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => setActiveDropdown(null)}
                              className="w-full text-left px-4 py-2 text-red-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        </div>
    </BaseLayout1>
  );
};

export default TeacherDetails;
