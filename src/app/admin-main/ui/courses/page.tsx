'use client';
import BaseLayout4 from "@/components/BaseLayout4";
import React, { useEffect } from "react";
import Link from "next/link";

const cardData = [
  {
    title: "Courses",
    idLabel: "Course ID",
    id: "HBC/ENG/28/29",
    totalLabel: "Total Levels",
    total: "100",
    course: "Islamic History",
    city: "India",
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
    href: "/admin-main/ui/assignments",
  },
  {
    title: "Assessments",
    idLabel: "Assessment ID",
    id: "HBC/ENG/28/31",
    totalLabel: "Total Levels",
    total: "100",
    course: "Islamic History",
    city: "US",
    href: "/admin-main/ui/assessments",
  },
  {
    title: "Knowledge Base",
    idLabel: "Knowledge Base ID",
    id: "HBC/ENG/28/32",
    totalLabel: "Total Levels",
    total: "100",
    course: "Islamic History",
    city: "India",
    href: "/admin-main/ui/knowledge",
  },
  {
    title: "Packages",
    idLabel: "Package ID",
    id: "HBC/ENG/28/33",
    totalLabel: "Total Packages",
    total: "100",
    href: "/admin-main/ui/package",
  },
];

const Page = () => {
  useEffect(() => {
    const fetchCardData = async (token: string) => {
      try {
        const response = await fetch("http://localhost:5001/some-auth-endpoint", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("Fetched card data:", data);
        // You can update `cardData` here using state if needed
      } catch (error) {
        console.error("Error fetching card data:", error);
      }
    };

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("AdminAuthToken");
      if (token) {
        fetchCardData(token);
      } else {
        alert("No auth token found.");
      }
    }
  }, []);

  return (
    <BaseLayout4>
      <div className="min-h-screen w-full px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 xl:gap-10 place-items-center overflow-y-auto h-[750px] mt-10 scrollbar-none">
          {cardData.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="w-full max-w-[360px] h-[450px] bg-white rounded-xl shadow p-5 hover:shadow-lg transition-shadow duration-200"
            >
              <h2 className="text-lg font-bold text-[#0b2447] mb-4 text-center">
                {item.title}
              </h2>

              <div className="flex flex-col">
                <div className="w-full h-28 border border-gray-400 rounded-lg mb-4" />
                <p className="text-[10px] text-gray-600 mb-4 leading-snug">
                  Description for this particular {item.title.toLowerCase()},
                  description for this particular {item.title.toLowerCase()},
                  description for this particular {item.title.toLowerCase()}
                </p>
              </div>

              <div className="text-[10px] text-gray-600 space-y-[13px] mt-3">
                <div className="flex justify-between">
                  <span className="font-semibold">{item.idLabel}</span>
                  <span>{item.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">{item.totalLabel}</span>
                  <span>{item.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Date added</span>
                  <span>11/04/2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Course</span>
                  <span>{item.course}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">City</span>
                  <span>{item.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Country</span>
                  <span>Egyptian</span>
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
