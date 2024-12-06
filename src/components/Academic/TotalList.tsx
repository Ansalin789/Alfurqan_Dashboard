import Image from 'next/image';
import React from 'react';
import { FaUserGraduate, FaCheckCircle, FaClock, FaHourglassHalf } from "react-icons/fa";

const data = [
  { title: 'Trail Assigned', value: 100, color: 'bg-[#0BF4C8]', icon: <FaUserGraduate size={20} color="#0BF4C8" />, iconBg: 'bg-[#fff]' },
  { title: 'Evaluation Done', value: 80, color: 'bg-[#F2A0FF]', icon: <FaCheckCircle size={20} color="#F2A0FF" />, iconBg: 'bg-[#fff]' },
  { title: 'Evaluation Pending', value: 20, color: 'bg-[#FAD85D]', icon: <FaClock size={20} color="#FAD85D" />, iconBg: 'bg-[#fff]' },
  { title: 'Total Pendings', value: 10, color: 'bg-[#0BF4C8]', icon: <FaHourglassHalf size={20} color="#0BF4C8" />, iconBg: 'bg-[#fff]' },
];

const Card: React.FC<{ title: string; value: number; color: string; icon: React.ReactNode; iconBg: string }> = ({ title, value, color, icon, iconBg }) => (
  <div className={`p-4 size-[100%] rounded-2xl py-8 shadow-lg flex flex-col items-start ${color} relative bg-pattern`}>
    <div className={`absolute top-2 right-2 ${iconBg} p-2 rounded-[100%] shadow-md`}>
      {React.isValidElement(icon) ? (
        <div className="flex items-center justify-center">
          {icon}
        </div>
      ) : (
        <Image src={icon as string} alt={`${title} icon`} className="w-6 h-6 opacity-60" />
      )}
    </div>
    <div className="flex flex-col justify-between h-full">
      <div>
        <span className="text-base font-semibold text-black">{title}</span>
      </div>
      <div>
        <span className="text-2xl font-bold text-black">{value}</span>
      </div>
    </div>
  </div>
);

const Dashboard = () => (
  <div className="grid grid-cols-4 gap-4">
    {data.map((item, index) => (
      <Card key={index} {...item} />
    ))}
  </div>
);

export default Dashboard;

