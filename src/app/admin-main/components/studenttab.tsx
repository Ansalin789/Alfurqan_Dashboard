"use client";
import { useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import StudentsRecord from "./studentcourseprogress";

const TabbedTable = () => {
  const [activeTab, setActiveTab] = useState("Class");
  const tabs = ["Class", "Courses", "Payment", "Assessments"];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const classData = [
    {
      id: 798,
      name: "Robert James",
      course: "Arabic",
      date: "Jan 2, 2020",
      time: "8:00-10:30 AM",
    },
    {
      id: 799,
      name: "Robert James",
      course: "Quran",
      date: "Jan 2, 2020",
      time: "8:00-10:30 AM",
    },
    {
      id: 800,
      name: "Robert James",
      course: "Islamic Studies",
      date: "Jan 2, 2020",
      time: "8:00-10:30 AM",
    },
    {
      id: 801,
      name: "Robert James",
      course: "Islamic Studies",
      date: "Jan 2, 2020",
      time: "Reschedule",
      reschedule: true,
    },
    {
      id: 802,
      name: "Robert James",
      course: "Quran",
      date: "Jan 2, 2020",
      time: "8:00-10:30 AM",
    },

    {
      id: 803,
      name: "Robert James",
      course: "Tajweed Masterclass",
      date: "Jan 2, 2020",
      time: "8:00-10:30 AM",
    },
    {
      id: 804,
      name: " James",
      course: " Masterclass",
      date: "Jan 4, 2020",
      time: "8:10-10:30 AM",
    },
  ];

  const coursesData = [
    {
      id: "#0983867",
      name: "Arabic",
      date: "11/02/2024",
      package: "Elite",
      status: "Active",
    },
    {
      id: "#0983867",
      name: "Quran",
      date: "15/04/2024",
      package: "Premium",
      status: "Active",
    },
    {
      id: "#0983867",
      name: "Islamic Studies",
      date: "15/04/2024",
      package: "Standard",
      status: "Inactive",
    },
  ];

  const progressData = [
    { label: "Level", value: 20, color: "#00C8FF" },
    { label: "Attendance", value: 68, color: "#003F88" },
    { label: "Total Classes", value: 70, color: "#503291" },
    { label: "Duration", value: 40, color: "#72A4F7" },
  ];

  const transactions = [
    {
      invoiceid: "1",
      date: "11/1/2022",
      course: "arabic",
      duebydays: "2 days",
      paiddate: "11/2/2024",
      status: "Paid",
    },
    {
      invoiceid: "1",
      date: "11/1/2022",
      course: "arabic",
      duebydays: "2 days",
      paiddate: "11/2/2024",
      status: "Cancelled",
    },
    {
      invoiceid: "1",
      date: "11/1/2022",
      course: "arabic",
      duebydays: "2 days",
      paiddate: "11/2/2024",
      status: "Void",
    },
    {
      invoiceid: "1",
      date: "11/1/2022",
      course: "arabic",
      duebydays: "2 days",
      paiddate: "11/2/2024",
      status: "Pending",
    },
  ];

  const assessment = [
    {
      subject: "islamic hisztory",
      date: "1/12/2024",
      score: "85%",
      grade: "A",
      status: "Completed",
    },
    {
      subject: "islamic hisztory",
      date: "1/12/2024",
      score: "85%",
      grade: "A",
      status: "Retake Required",
    },
  ];
  // Calculate paginated assignments
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClassData = classData.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const paginatedCourseData = coursesData.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const paginatedPaymentData = transactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const paginatedAssessmentData = assessment.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className=" overflow-x-auto mt-4 bg-white shadow-md rounded-lg p-3 ">
      {/* Tabs */}
      <div className="flex space-x-4 border-b pb-1 text-sm text-black mb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 ${
              activeTab === tab
                ? "text-white bg-[#002c5f] rounded-lg"
                : "text-black "
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table for 'Class' Tab */}
      {activeTab === "Class" && (
        <div className="p-4">
          <div className="overflow-x-auto bg-white rounded-lg border-2 border-[#1C3557] w-full max-w-[1255px] mx-auto  ">
            <table className="w-full text-[12px]">
              <thead className="border-b-[1px] border-[#1C3557] text-[11px] font-semibold">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">Teacher</th>
                  <th className="p-2">Course</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClassData.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`text-[9px] text-center font-medium mt-0 ${
                      index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                    }`}
                  >
                    <td className="p-2">{row.id}</td>
                    <td className="p-2">{row.name}</td>
                    <td className="p-2">{row.course}</td>
                    <td className="p-2">{row.date}</td>
                    <td className="p-2">
                      <span
                        className={`inline-flex items-center justify-center w-24 h-6 px-3 py-1 rounded-2xl ${
                          row.reschedule
                            ? "bg-green-200 text-green-700"
                            : "bg-[#002c5f] text-white"
                        }`}
                      >
                        {row.time}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600 p-1">
              <p className="text-[11px]">
                Showing {paginatedClassData.length} of {classData.length}{" "}
                classes
              </p>
              <div className="flex gap-2">
                {Array.from(
                  { length: Math.ceil(classData.length / itemsPerPage) },
                  (_, i) => (
                    <button
                      key={i}
                      className={`w-4 h-4 text-[13px] flex items-center justify-center rounded ${
                        currentPage === i + 1
                          ? "bg-[#1C3557] text-white"
                          : "text-[#1C3557] border border-[#1C3557]"
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Courses Tab */}
      {activeTab === "Courses" && (
        <div className="mt-4 p-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            {progressData.map((item) => {
              let suffix = "";
              if (item.label === "Attendance") {
                suffix = "%";
              } else if (item.label === "Duration") {
                suffix = " HRS";
              }

              return (
                <div key={item.label} className="flex flex-col items-center">
                  <div className="relative w-24 h-20 flex items-center justify-center">
                    <CircularProgressbar
                      value={item.value}
                      maxValue={item.label === "Attendance" ? 100 : undefined}
                      strokeWidth={15}
                      styles={buildStyles({
                        pathColor: item.color,
                        trailColor: "#D3D3D3",
                        strokeLinecap: "round",
                      })}
                    />
                    <div className="absolute text-md font-bold text-black">
                      {item.value}
                      {suffix}
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium">{item.label}</p>
                </div>
              );
            })}
          </div>
          <div className="overflow-x-auto bg-white rounded-lg border-2 border-[#1C3557] w-full max-w-[1255px] mx-auto mt-3">
            <table className="w-full text-[12px]">
              <thead className="border-b-[1px] border-[#1C3557] text-[11px] font-semibold">
                <tr>
                  <th className="p-2">Course ID</th>
                  <th className="p-2">Course Name</th>
                  <th className="p-2">Start Date</th>
                  <th className="p-2">Package</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCourseData.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`text-[9px] text-center font-medium mt-0 ${
                      index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                    }`}
                  >
                    <td className="p-2">{row.id}</td>
                    <td className="p-2">{row.name}</td>
                    <td className="p-2">{row.date}</td>
                    <td className="p-2">{row.package}</td>
                    <td className="p-2">
                      <span
                        className={`inline-flex items-center justify-center w-16 h-6 px-3 py-1 rounded-2xl ${
                          row.status === "Active"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600 p-1">
              <p className="text-[11px]">
                Showing {paginatedCourseData.length} of {coursesData.length}{" "}
                classes
              </p>
              <div className="flex gap-2">
                {Array.from(
                  { length: Math.ceil(coursesData.length / itemsPerPage) },
                  (_, i) => (
                    <button
                      key={i}
                      className={`w-4 h-4 text-[13px] flex items-center justify-center rounded ${
                        currentPage === i + 1
                          ? "bg-[#1C3557] text-white"
                          : "text-[#1C3557] border border-[#1C3557]"
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table for 'Payment' Tab */}
      {activeTab === "Payment" && (
        <div className="overflow-hidden   p-4">
          {/* Search Bar */}
          <div className="relative mb-4 flex justify-end">
            <input
              type="text"
              placeholder="Search"
              className="w-40 px-3 h-8 py-1.5 pl-8 border border-black rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <svg
              className="absolute left-auto right-3 top-2 w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M15 10a5 5 0 10-10 0 5 5 0 0010 0z"
              />
            </svg>
          </div>
          {/* Transactions Table */}
          <div className="overflow-x-auto bg-white rounded-lg border-2 border-[#1C3557] w-full max-w-[1275px] mx-auto">
            <table className="w-full text-[12px]">
              <thead className="border-b-[1px] border-[#1C3557] text-[11px] font-semibold">
                <tr>
                  <th className="p-2">Invoice ID</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Course</th>
                  <th className="p-2">Due By Days</th>
                  <th className="p-2">Paid Date</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPaymentData.map((row, index) => {
                  let statusClass = "";

                  switch (row.status) {
                    case "Paid":
                      statusClass = "bg-green-500 text-white";
                      break;
                    case "Pending":
                      statusClass = "bg-red-500 text-white";
                      break;
                    case "Void":
                      statusClass = "bg-yellow-500 text-white";
                      break;
                    case "Cancelled":
                      statusClass = "bg-gray-500 text-white";
                      break;
                  }

                  return (
                    <tr
                      key={row.invoiceid}
                      className={`text-[9px] text-center font-medium mt-0 ${
                        index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                      }`}
                    >
                      <td className="p-2">{row.invoiceid}</td>
                      <td className="p-2">{row.date}</td>
                      <td className="p-2">{row.course}</td>
                      <td className="p-2">{row.duebydays}</td>
                      <td className="p-2">{row.paiddate}</td>
                      <td className="p-2">
                        <span
                          className={`inline-flex items-center justify-center w-16 h-6 px-3 py-1 rounded-2xl ${statusClass}`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600 p-1 ">
              <p className="text-[11px]">
                Showing {paginatedPaymentData.length} of {transactions.length}{" "}
                classes
              </p>
              <div className="flex gap-2">
                {Array.from(
                  { length: Math.ceil(transactions.length / itemsPerPage) },
                  (_, i) => (
                    <button
                      key={i}
                      className={`w-4 h-4 text-[13px] flex items-center justify-center rounded ${
                        currentPage === i + 1
                          ? "bg-[#1C3557] text-white"
                          : "text-[#1C3557] border border-[#1C3557]"
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table for 'Assessments' Tab */}
      {activeTab === "Assessments" && (
        <div className="overflow-hidden rounded-lg  p-4">
          {/* Search Bar */}
          <div className="relative mb-4 flex justify-left">
            <StudentsRecord />
          </div>
          {/* Transactions Table */}
          <div className="overflow-x-auto bg-white rounded-lg border-2 border-[#1C3557] w-full max-w-[1255px] mx-auto">
            <table className="w-full text-[12px]">
              <thead className="border-b-[1px] border-[#1C3557] text-[11px] font-semibold">
                <tr>
                  <th className="p-2">Subject</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Score</th>
                  <th className="p-2">Grade</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAssessmentData.map((row, index) => {
                  let statusClass = "";

                  switch (row.status) {
                    case "Completed":
                      statusClass = "bg-green-500 text-white";
                      break;
                    case "Retake Required":
                      statusClass = "bg-red-500 text-white";
                      break;
                  }

                  return (
                    <tr
                      key={row.subject}
                      className={`text-[9px] text-center font-medium mt-0 ${
                        index % 2 === 0 ? "bg-[#faf9f9]" : "bg-[#ebebeb]"
                      }`}
                    >
                      <td className="p-2">{row.subject}</td>
                      <td className="p-2">{row.date}</td>
                      <td className="p-2">{row.score}</td>
                      <td className="p-2">{row.grade}</td>
                      <td className="p-2">
                        <span
                          className={`inline-flex items-center justify-center w-28 h-6 px-3 py-1 rounded-2xl ${statusClass}`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600 p-1 ">
              <p className="text-[11px]">
                Showing {paginatedAssessmentData.length} of {assessment.length}{" "}
                classes
              </p>
              <div className="flex gap-2">
                {Array.from(
                  { length: Math.ceil(assessment.length / itemsPerPage) },
                  (_, i) => (
                    <button
                      key={i}
                      className={`w-4 h-4 text-[13px] flex items-center justify-center rounded ${
                        currentPage === i + 1
                          ? "bg-[#1C3557] text-white"
                          : "text-[#1C3557] border border-[#1C3557]"
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabbedTable;
