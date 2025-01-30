import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaUserGraduate, FaCheckCircle, FaClock, FaHourglassHalf } from "react-icons/fa";
import axios from 'axios';

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
  totalclasses: number;
  totalstudents: number;
  totalhours: number;
  totalearnings: number;
};

// Initial data configuration
const initialData: Omit<DataItem, 'value'>[] = [
  { title: 'Total Classes', color: 'bg-[#0BF4C8]', icon: <FaUserGraduate size={20} color="#0BF4C8" />, iconBg: 'bg-[#fff]' },
  { title: 'Total Students', color: 'bg-[#F2A0FF]', icon: <FaCheckCircle size={20} color="#F2A0FF" />, iconBg: 'bg-[#fff]' },
  { title: 'Total Hours', color: 'bg-[#FAD85D]', icon: <FaClock size={20} color="#FAD85D" />, iconBg: 'bg-[#fff]' },
  { title: 'Total Earnings', color: 'bg-[#0BF4C8]', icon: <FaHourglassHalf size={20} color="#0BF4C8" />, iconBg: 'bg-[#fff]' },
];

// Card Component
const Card: React.FC<DataItem> = ({ title, value, color, icon, iconBg }) => (
  <div className={`p-4 size-[100%] rounded-2xl py-5 shadow-lg flex flex-col items-start ${color} relative bg-pattern`}>
    <div className={`absolute top-4 right-2 ${iconBg} p-2 rounded-[100%] shadow-md`}>
      {React.isValidElement(icon) ? (
        <div className="flex items-center justify-center w-4 h-4">{icon}</div>
      ) : (
        <Image src={icon as string} alt={`${title} icon`} className="w-6 h-6 opacity-60" />
      )}
    </div>
    <div className="flex flex-col justify-between h-full">
      <div>
        <span className="text-[13px] font-semibold text-black">{title}</span>
      </div>
      <div>
        <span className="text-[17px] font-bold text-black">{value}</span>
      </div>
    </div>
  </div>
);

// Fetch data from the API using Axios
const fetchDashboardData = async (teacherId: string, authToken: string | null): Promise<ApiResponse> => {
  try {
    const response = await axios.get(`http://localhost:5001/dashboard/teacher/counts`, {
      params: {
        teacherId: teacherId
      },
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('HTTP Error');
  }
};

// Map API response to dashboard data
const mapApiResponseToData = (apiResponse: ApiResponse): DataItem[] => {
  return initialData.map(item => {
    let value = 0;
    switch (item.title) {
      case 'Total Classes':
        value = apiResponse.totalclasses || 0;
        break;
      case 'Total Students':
        value = apiResponse.totalstudents || 0;
        break;
      case 'Total Hours':
        value = apiResponse.totalhours || 0;
        break;
      case 'Total Earnings':
        value = apiResponse.totalearnings || 0;
        break;
    }
    return { ...item, value };
  });
};

// Dashboard Component
const Dash = () => {
  const [data, setData] = useState<DataItem[]>(initialData.map(item => ({ ...item, value: 0 })));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const authToken = localStorage.getItem('TeacherAuthToken');
        const teacherId = localStorage.getItem('TeacherPortalId'); // Retrieve teacherId from localStorage

        if (!teacherId) {
          throw new Error('Teacher ID is not available');
        }

        const apiResponse = await fetchDashboardData(teacherId, authToken);
        const updatedData = mapApiResponseToData(apiResponse);
        setData(updatedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      {data.map(item => (
        <Card key={item.title} {...item} />
      ))}
    </div>
  );
};

export default Dash;
