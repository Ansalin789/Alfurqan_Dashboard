

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaUserGraduate, FaCheckCircle, FaClock, FaHourglassHalf } from "react-icons/fa";

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
const initialData: Omit<DataItem, 'value'>[] = [
  { title: 'Trail Assigned', color: 'bg-[#0BF4C8]', icon: <FaUserGraduate size={20} color="#0BF4C8" />, iconBg: 'bg-[#fff]' },
  { title: 'Evaluation Done', color: 'bg-[#F2A0FF]', icon: <FaCheckCircle size={20} color="#F2A0FF" />, iconBg: 'bg-[#fff]' },
  { title: 'Evaluation Pending', color: 'bg-[#FAD85D]', icon: <FaClock size={20} color="#FAD85D" />, iconBg: 'bg-[#fff]' },
  { title: 'Total Pendings', color: 'bg-[#0BF4C8]', icon: <FaHourglassHalf size={20} color="#0BF4C8" />, iconBg: 'bg-[#fff]' },
];

// Card Component
const Card: React.FC<DataItem> = ({ title, value, color, icon, iconBg }) => (
  <div className={`p-4 size-[100%] rounded-2xl py-5 shadow-lg flex flex-col items-start ${color} relative bg-pattern`}>
    <div className={`absolute top-4 right-2 ${iconBg} p-2 rounded-[100%] shadow-md`}>
      {React.isValidElement(icon) ? (
        <div className="flex items-center justify-center w-4 h-4">
          {icon}
        </div>
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

// Dashboard Component
const Dashboard = () => {
  const [data, setData] = useState<DataItem[]>(initialData.map(item => ({ ...item, value: 0 })));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const auth=localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5001/dashboard/widgets',{
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth}`, 
          },
        }); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const counts: ApiResponse = await response.json();

        // Update the data with API response
        setData(prevData =>
          prevData.map(item => {
            let value = 0;
            switch (item.title) {
              case 'Trail Assigned':
                value = counts.classtype || 0;
                break;
              case 'Evaluation Done':
                value = counts.status || 0;
                break;
              case 'Evaluation Pending':
                value = counts.totalPending || 0;
                break;
              case 'Total Pendings':
                value = counts.totalActive || 0;
                break;
            }
            return { ...item, value };
          })
        );
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Replace with a loading spinner if needed
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      {data.map((item) => (
        <Card key={item.title} {...item} />
      ))}
    </div>
  );
};

export default Dashboard;
