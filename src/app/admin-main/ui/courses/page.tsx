"use client";
import BaseLayout4 from "@/components/BaseLayout4";
import React from "react";
import Link from "next/link";
import SupervisorHeader from "@/app/supervisor/components/supervisorHeader";

const cardData = [
  {
    title: "Courses",
    idLabel: "Course ID",
    id: "HBC/ENG/28/29",
    totalLabel: "Total Levels",
    total: "100",
    course: "Islamic History",
    city: "India",
    duration: "150 Hours",
    date: "11/05/25",
    createdBy: "Admin",
    href: "/admin-main/ui/courses/coursedetails",
  },
  {
    title: "Assignments",
    idLabel: "Assignment ID",
    id: "HBC/ENG/28/30",
    totalLabel: "Total Levels",
    total: "100",
    course: "Islamic History",
    city: "UAE",
    duration: "60 Hours",
    date: "12/05/25",
    createdBy: "Admin",
    href: "/admin-main/ui/assignments",
  },
  {
    title: "Assessments",
    idLabel: "Assessment ID",
    id: "HBC/ENG/28/31",
    totalLabel: "Total Levels",
    total: "100",
    duration: "70 Hours",
    date: "12/05/25",
    createdBy: "Admin",
    href: "/admin-main/ui/assessments",
  },
  {
    title: "Knowledge Base",
    idLabel: "Knowledge Base ID",
    id: "HBC/ENG/28/32",
    totalLabel: "Total Levels",
    total: "100",
    duration: "80 Hours",
    date: "13/05/25",
    createdBy: "Admin",
    href: "/admin-main/ui/knowledge",
  },
  {
    title: "Packages",
    idLabel: "Package ID",
    id: "HBC/ENG/28/33",
    totalLabel: "Total Packages",
    total: "100",
    date: "13/05/25",
    createdBy: "Admin",
    href: "/admin-main/ui/package",
  },
];

const Page = () => {
  return (
    <BaseLayout4>
      <SupervisorHeader currentSection="Course" />
      <div className="min-h-screen w-full px-4 sm:px-6 lg:px-10 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center">
          {cardData.map((item, idx) => (
            <Link
              key={item.title}
              href={item.href}
              className="w-full max-w-[360px] bg-white dark:bg-[#1D1D1D] rounded-xl shadow-md hover:shadow-lg transition duration-300 p-6 text-center"
            >
              <h2 className="text-lg font-bold text-[#0b2447] dark:text-white mb-4">
                {item.title}
              </h2>

              {/* Image Placeholder */}
              <div className="w-28 h-28 mx-auto bg-gray-300 rounded-lg mb-4" />

              {/* Description */}
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-6 leading-snug">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam
              </p>

              {/* Info List */}
              <div className="text-xs text-gray-700 dark:text-gray-300 space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="font-medium">Course ID</span>
                  <span>{item.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Course Duration</span>
                  <span>{item.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Number of Levels</span>
                  <span>{item.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Creation Date</span>
                  <span>{item.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Created By</span>
                  <span>{item.createdBy}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </BaseLayout4>
  );
};

export default Page;
