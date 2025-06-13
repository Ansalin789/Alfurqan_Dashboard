"use client";

import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaGraduationCap,
  FaHandHolding,
} from "react-icons/fa";
import { GiSuitcase } from "react-icons/gi";
import { useSearchParams } from "next/navigation";
import { TbClockHour9  } from "react-icons/tb";
import { LuCircleCheck } from "react-icons/lu";



// Define the type for the data items
type DataItem = {
  title: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  iconBg: string;
};

type ApiResponse = {
  trialAssigned: number;
  evaluationCompleted: number;
  evaluationPending: number;
  totalPending: number;
};

// Initial card data (without values)
const initialData: Omit<DataItem, "value">[] = [
  {
    title: "Trial Assigned",
    color: "bg-[#fff]",
    icon: (
      <div className="bg-[#e3f4ff] dark:bg-[#3e4e50] rounded-full">
        <img
          src="/assets/images/acgr.svg"
          className="w-10 h-10 object-contain"
        />
      </div>
    ),
    iconBg: "bg-[#e3f4ff] dark:bg-[#3e4e50]",
  },
  {
    title: "Evaluation Completed",
    color: "bg-[#fff]",
    icon: (
      <div className="bg-[#e1ffde] dark:bg-[#3f503e] rounded-full relative">
        <img
          src="/assets/images/accom.svg" 
          alt="Evaluation Completed"
          className="w-10 h-10 object-contain"
        />
      </div>
    ),
    iconBg: "bg-[#e1ffde] dark:bg-[#3f503e]",
  },
  {
    title: "Evaluation Pending",
    color: "bg-[#fff]",
    icon: (
      <img
        src="/assets/images/acpend.svg"
        alt="Evaluation Pending"
        className="w-10 h-10 object-contain"
      />
    ),
    iconBg: "bg-[#ffdfde] dark:bg-[#503e3e]",
  },
  {
    title: "Total Pendings",
    color: "bg-[#fff]",
    icon: (
      <div className="bg-[#fff1de] dark:bg-[#504d3e] rounded-full relative">
        <img
          src="/assets/images/acepend.svg" // replace with your actual image path
          alt="Total Pending"
          className="w-10 h-10 object-contain"
        />
      </div>
    ),
    iconBg: "bg-[#fff1de] dark:bg-[#504d3e]",
  },
];


// Card component
const Card: React.FC<DataItem> = ({ title, value, color, icon, iconBg }) => (
  <div
    className={`p-4 py-4 shadow-lg items-start rounded-xl w-full ${color} relative dark:bg-[#343434] dark:text-[#fff]`}
  >
    <div className={`absolute top-8 right-6 ${iconBg} p-1 rounded-[100%]`}>
      {React.isValidElement(icon) ? (
        icon
      ) : (
        <Image
          src={icon as string}
          alt={`${title} icon`}
          className="w-8 h-8 opacity-60"
        />
      )}
    </div>
    <div className="flex flex-col justify-between h-full">
      <span className="text-[14px] font-medium text-black dark:text-white">
        {title.split(" ").map((word, index) => (
          <React.Fragment key={index}>
            {word}
            {index < title.split(" ").length - 1 && <br />}
          </React.Fragment>
        ))}
      </span>
      <span className="text-[28px] font-semibold text-black dark:text-white">
        {value ?? 0}
      </span>
    </div>
  </div>
);

// Main Dashboard Component
const Dashboard = () => {
  const [data, setData] = useState<DataItem[]>(
    initialData.map((item) => ({ ...item, value: 0 }))
  );
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const academicCoachId = searchParams.get("academicCoachId");

  useEffect(() => {
    const fetchData = async () => {
      if (!academicCoachId) {
        console.warn("⚠️ Missing academicCoachId in URL query params.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5001/dashboard/widgets?academicCoachId=${academicCoachId}`
        );
        const apiData: ApiResponse = response.data;

        const mappedData: DataItem[] = initialData.map((item) => {
          let value = 0;
          switch (item.title) {
            case "Trial Assigned":
              value = apiData.trialAssigned ?? 0;
              break;
            case "Evaluation Completed":
              value = apiData.evaluationCompleted ?? 0;
              break;
            case "Evaluation Pending":
              value = apiData.evaluationPending ?? 0;
              break;
            case "Total Pendings":
              value = apiData.totalPending ?? 0;
              break;
          }
          return { ...item, value };
        });

        setData(mappedData);
      } catch (err) {
        setError("❌ Failed to fetch dashboard data.");
        console.error(err);
      }
    };

    fetchData();
  }, [academicCoachId]);

  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((item) => (
        <Card key={item.title} {...item} />
      ))}
    </div>
  );
};

export default Dashboard;
