"use client";

import BaseLayout2 from "@/components/BaseLayout2";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCalendarAlt, FaSort } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MyClass from "./MyClass";

type UpcomingClass = {
  [x: string]: any;
  classID: number;
  name: string;
  teacherName: string;
  course: string;
  date: string;
  scheduled: string;
};

type CompletedClass = {
  classID: number;
  name: string;
  teacherName: string;
  course: string;
  date: string;
  scheduled: string;
  status: string;
};

type SortableKeys = "classID" | "name" | "teacherName" | "course" | "date" | "scheduled" | "status";

const Classes = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"Upcoming" | "Completed">("Upcoming");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [popupVisible, setPopupVisible] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortKey, setSortKey] = useState<SortableKeys>("classID");
  const [isPremiumUser, setIsPremiumUser] = useState(true); // Replace with actual role determination logic
  const itemsPerPage = 10;
  console.log('set premium user ....', setIsPremiumUser);

  const upcomingClasses: UpcomingClass[] = Array.from({ length: 25 }, (_, index) => ({
    classID: 1000 + index,
    name: `Student ${index + 1}`,
    teacherName: `Teacher ${index + 1}`,
    course: `Course ${index + 1}`,
    date: "January 15, 2025",
    scheduled: "10:00 AM - 11:30 AM",
  }));

  const completedClasses: CompletedClass[] = Array.from({ length: 18 }, (_, index) => ({
    classID: 2000 + index,
    name: `Student ${index + 1}`,
    teacherName: `Teacher ${index + 1}`,
    course: `Course ${index + 1}`,
    date: "December 25, 2024",
    scheduled: "9:00 AM - 10:30 AM",
    status: "Completed",
  }));

  const sortClasses = (classes: UpcomingClass[] | CompletedClass[]) => {
    return classes.sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortKey as keyof UpcomingClass] > b[sortKey as keyof UpcomingClass] ? 1 : -1;
      }
      return a[sortKey as keyof UpcomingClass] < b[sortKey as keyof UpcomingClass] ? 1 : -1;
    });
  };

  const filteredClasses =
    activeTab === "Upcoming"
      ? sortClasses(upcomingClasses)
      : sortClasses(completedClasses);

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const displayedClasses = filteredClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTabChange = (tab: "Upcoming" | "Completed") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePopupToggle = (classID: number) => {
    setPopupVisible(popupVisible === classID ? null : classID);
  };

  const handleReschedule = (classID: number) => {
    router.push(`/student/ui/Reschedule`);
  };

  const handleCancel = (classID: number) => {
    console.log(`Cancel clicked for classID: ${classID}`);
    setPopupVisible(null);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleSort = (key: SortableKeys) => {
    const order = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(order);
    setSortKey(key);
  };

  const handleUpgradePlan = () => {
    setPopupVisible(null); // Close the popup
    console.log("User prompted to switch to a higher plan.");
  };

  return (
    <BaseLayout2>
      <div className="p-4 mx-auto w-[1250px]">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">My Class</h1>
        <MyClass />

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Scheduled Classes</h2>

        <div className="bg-white rounded-lg border-2 border-[#1C3557] h-[500px]">
          <div className="flex">
            <button
              onClick={() => handleTabChange("Upcoming")}
              className={`py-3 px-2 ml-5 ${
                activeTab === "Upcoming"
                  ? "text-[#1C3557] border-b-2 border-[#1C3557] font-semibold"
                  : "text-gray-500"
              } focus:outline-none text-[13px]`}
            >
              Upcoming ({upcomingClasses.length})
            </button>
            <button
              onClick={() => handleTabChange("Completed")}
              className={`py-3 px-6 ${
                activeTab === "Completed"
                  ? "text-[#1C3557] border-b-2 border-[#1C3557] font-semibold"
                  : "text-gray-500"
              } focus:outline-none text-[13px]`}
            >
              Completed ({completedClasses.length})
            </button>
          </div>
          <div className="flex justify-end px-4 h-6">
            <div className="flex items-center border border-[#1C3557] rounded-md overflow-hidden bg-[#1C3557]">
              <div className="bg-[#1C3557] px-3 py-2 flex items-center">
                <FaCalendarAlt className="text-white text-sm" />
              </div>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="MMMM d, yyyy"
                className="w-40 text-sm text-gray-600 focus:outline-none"
                placeholderText="Date"
              />
              <div className="px-0 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 text-gray-100"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 9l-7.5 7.5L4.5 9"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead className="border-b-[1px] border-[#1C3557] text-[12px] font-semibold">
                <tr>
                  <th className="px-6 py-3 text-center">
                    Class ID{" "}
                    <FaSort
                      className="inline ml-2 cursor-pointer"
                      onClick={() => handleSort("classID")}
                    />
                  </th>
                  <th className="px-6 py-3 text-center">
                    Name{" "}
                    <FaSort
                      className="inline ml-2 cursor-pointer"
                      onClick={() => handleSort("name")}
                    />
                  </th>
                  <th className="px-6 py-3 text-center">
                    Teacher Name{" "}
                    <FaSort
                      className="inline ml-2 cursor-pointer"
                      onClick={() => handleSort("teacherName")}
                    />
                  </th>
                  <th className="px-6 py-3 text-center">
                    Course{" "}
                    <FaSort
                      className="inline ml-2 cursor-pointer"
                      onClick={() => handleSort("course")}
                    />
                  </th>
                  <th className="px-6 py-3 text-center">
                    Date{" "}
                    <FaSort
                      className="inline ml-2 cursor-pointer"
                      onClick={() => handleSort("date")}
                    />
                  </th>
                  <th className="px-6 py-3 text-center">Scheduled</th>
                  {activeTab === "Completed" && (
                    <th className="px-6 py-3 text-center">Status</th>
                  )}
                  {activeTab === "Upcoming" && <th className="px-6 py-3 text-center"></th>}
                </tr>
              </thead>
              <tbody>
                {displayedClasses.map((item) => (
                  <tr
                    key={item.classID}
                    className="text-[12px] font-medium"
                    style={{ backgroundColor: "rgba(230, 233, 237, 0.22)" }}
                  >
                    <td className="px-6 py-2 text-center">{item.classID}</td>
                    <td className="px-6 py-2 text-center">{item.name}</td>
                    <td className="px-6 py-2 text-center">{item.teacherName}</td>
                    <td className="px-6 py-2 text-center">{item.course}</td>
                    <td className="px-6 py-2 text-center">{item.date}</td>
                    <td className="px-6 py-2 text-center">{item.scheduled}</td>
                    {activeTab === "Completed" && (
                      <td className="px-6 py-1 text-center">
                        <div className="px-2 py-1 text-[#223857] rounded-lg border-[1px] border-[#95b690] bg-[#D0FECA] opacity-55 text-[10px]">
                          {String(item.status)}
                        </div>
                      </td>
                    )}
                    {activeTab === "Upcoming" && (
                      <td className="relative px-6 py-2 text-center">
                        <BsThreeDots
                          className="cursor-pointer"
                          onClick={() => handlePopupToggle(item.classID)}
                        />
                        {popupVisible === item.classID && (
                          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                            {isPremiumUser ? (
                              <>
                                <button
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => handleReschedule(item.classID)}
                                >
                                  Reschedule
                                </button>
                                <button
                                  className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100"
                                  onClick={() => handleCancel(item.classID)}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                                  <div className="bg-[#fff5f3] p-10 rounded shadow border border-[#F4B0A1] flex">
                                  <p className="text-[#27303A] text-lg font">Switch to a higher plan for extended benefits...</p>
                                  <button
                                    className="bg-[#1C3557] text-white px-4 py-2 rounded text-center ml-10"
                                    onClick={handleUpgradePlan}
                                  >
                                    OK
                                  </button>
                                  </div>
                                  
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end items-center px-6 py-4">
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-5 h-5 text-[13px] flex items-center justify-center rounded ${
                      page === currentPage
                        ? "bg-[#1C3557] text-white"
                        : "text-[#1C3557] border border-[#1C3557]"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout2>
  );
};

export default Classes;
