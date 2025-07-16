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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {cardData.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="w-full bg-white dark:bg-[#343434] rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5 sm:p-6 text-center hover:border-[#576CBC] hover:border-[2.5px]"
            >
              {/* Title */}
              <h2 className="text-lg font-semibold text-[#0b2447] dark:text-white mb-4 break-words">
                {item.title}
              </h2>

              {/* Image Placeholder */}
              <div className="w-24 h-24 mx-auto bg-gray-200 dark:bg-[#C4C4C4] rounded-md mb-5" />

              {/* Info List */}
              <div className="w-full text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-3 text-left">
                {item.id && (
                  <div className="grid grid-cols-[auto_1fr] gap-2 w-full">
                    <span className="font-medium break-words">
                      {item.idLabel || "ID"}
                    </span>
                    <span className="text-right break-words">{item.id}</span>
                  </div>
                )}

                {item.duration && (
                  <div className="grid grid-cols-[auto_1fr] gap-2 w-full">
                    <span className="font-medium break-words">
                     Duration
                    </span>
                    <span className="text-right break-words">
                      {item.duration}
                    </span>
                  </div>
                )}

                {item.total && (
                  <div className="grid grid-cols-[auto_1fr] gap-2 w-full">
                    <span className="font-medium break-words">
                      {item.totalLabel || "Total"}
                    </span>
                    <span className="text-right break-words">{item.total}</span>
                  </div>
                )}

                <div className="grid grid-cols-[auto_1fr] gap-2 w-full">
                  <span className="font-medium break-words">Creation Date</span>
                  <span className="text-right break-words">{item.date}</span>
                </div>

                <div className="grid grid-cols-[auto_1fr] gap-2 w-full">
                  <span className="font-medium break-words">Created By</span>
                  <span className="text-right break-words">
                    {item.createdBy}
                  </span>
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
