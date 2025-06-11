'use client';

import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  FaUserGraduate,
  FaCheckCircle,
  FaClock,
  FaHourglassHalf,
  FaGraduationCap,
  FaHandHolding ,
} from "react-icons/fa";


// Define the type for the data items
type DataItem = {
  title: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  iconBg: string;
};

// Define the type for the API response
type ApiResponse = {
  classtype: number;
  status: number;
  totalPending: number;
  totalActive: number;
};

// Initial data configuration
const initialData: Omit<DataItem, "value">[] = [
  {
    title: "Trail Assigned",
    color: "bg-[#fff]",
    icon: (
      <div className="bg-[#e3f4ff] dark:bg-[#3e4e50] p-0 rounded-full">
        <FaGraduationCap size={20} color="#49aad0" />
        <FaHandHolding size={20} color="#49aad0" className="-mt-[14px] -ml-[3px]"/>
      </div>
    ),
    iconBg: "bg-[#e3f4ff] dark:bg-[#3e4e50]",
  },
  {
    title: "Evaluation Completed",
    color: "bg-[#fff]",
    icon: <FaCheckCircle size={20} color="#F2A0FF" />,
    iconBg: "bg-[#e1ffde] dark:bg-[#3f503e]",
  },
  {
    title: "Evaluation Pending",
    color: "bg-[#fff]",
    icon: <FaClock size={40} color="#ca5a5a" />,
    iconBg: "bg-[#ffdfde] dark:bg-[#503e3e]",
  },
  {
    title: "Total Pendings",
    color: "bg-[#fff]",
    icon: <FaClock  size={20} color="#0BF4C8" />,
    iconBg: "bg-[#fff1de] dark:bg-[#504d3e]",
  },
];

// Card Component
const Card: React.FC<DataItem> = ({ title, value, color, icon, iconBg }) => (
  <div
    className={`p-4 py-5 shadow-lg items-start rounded-xl w-full ${color} relative dark:bg-[#343434] dark:text-[#fff]`}
  >
    <div
      className={`absolute top-8 right-6 ${iconBg} p-4 rounded-[100%]`}
    >
      {React.isValidElement(icon) ? (
        <div className="flex items-center justify-center">{icon}</div>
      ) : (
        <Image
          src={icon as string}
          alt={`${title} icon`}
          className="w-6 h-6 opacity-60"
        />
      )}
    </div>
    <div className="flex flex-col justify-between h-full">
      <div>
        <span className="text-[14px] font-medium text-black dark:text-[#fff]">
          {title.split(' ').map((word, index) => (
            <React.Fragment key={index}>
              {word}
              {index < title.split(' ').length - 1 && <br />}
            </React.Fragment>
          ))}
        </span>
      </div>
      <div>
        <span className="text-[28px] font-semibold text-black dark:text-[#fff]">{value ?? 0}</span>
      </div>
    </div>
  </div>
);

// Fetch data from the API
const fetchDashboardData = async (
  authToken: string | null
): Promise<ApiResponse> => {
    const token =
    typeof window !== "undefined" ? localStorage.getItem("AcademicCoachAuthToken") : null;

  if (!token) {
    console.error("❌ AdminAuthToken not found");
  }
  const response = await axios.get(
    `https://api.blackstoneinfomaticstech.com/dashboard/widgets`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }
  );

  if (response.status !== 200) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return response.data;
};

// Map API response to dashboard data
const mapApiResponseToData = (apiResponse: ApiResponse): DataItem[] => {
  return initialData.map((item) => {
    let value = 0;
    switch (item.title) {
      case "Trail Assigned":
        value = apiResponse.classtype || 0;
        break;
      case "Evaluation Done":
        value = apiResponse.status || 0;
        break;
      case "Evaluation Pending":
        value = apiResponse.totalPending || 0;
        break;
      case "Total Pendings":
        value = apiResponse.totalActive || 0;
        break;
    }
    return { ...item, value };
  });
};

// Dashboard Component
const Dashboard = () => {
  const [data, setData] = useState<DataItem[]>(
    initialData.map((item) => ({ ...item, value: 0 }))
  );
  // const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // setIsLoading(true);
        setError(null);

        const authToken = localStorage.getItem("authToken");
        const apiResponse = await fetchDashboardData(authToken);

        const updatedData = mapApiResponseToData(apiResponse);
        setData(updatedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        // setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // if (isLoading) {
  //   return <div>Loading...</div>; // Replace with a loading spinner if needed
  // }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {data.map((item) => (
        <Card key={item.title} {...item} />
      ))}
    </div>
  );
};

export default Dashboard;
