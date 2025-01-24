import Image from 'next/image';
import React, {  useState } from 'react';
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

// Map API response to dashboard data
const mapApiResponseToData = (apiResponse: ApiResponse): DataItem[] => {
  return initialData.map(item => {
    let value = 0;
    switch (item.title) {
      case 'Trail Classes':
        value = apiResponse.classtype || 0;
        break;
      case 'Total Students':
        value = apiResponse.status || 0;
        break;
      case 'Total Hour':
        value = apiResponse.totalPending || 0;
        break;
      case 'Total Earnings':
        value = apiResponse.totalActive || 0;
        break;
    }
    return { ...item, value };
  });
};

// Dashboard Component
const Dash = () => {
  const [data] = useState<DataItem[]>(initialData.map(item => ({ ...item, value: 0 })));
  const [error] = useState<string | null>(null);

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
