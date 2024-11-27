import React from 'react';

const data = [
  { title: 'Trail Assigned', value: 100, color: 'bg-[#0BF4C8]', icon: '/assets/images/Vector1.png', iconBg: 'bg-[#fff]' },
  { title: 'Evaluation Done', value: 80, color: 'bg-[#F2A0FF]', icon: '/assets/images/Vector2.png', iconBg: 'bg-[#fff]' },
  { title: 'Evaluation Pending', value: 20, color: 'bg-[#FAD85D]', icon: '/assets/images/Vector3.png', iconBg: 'bg-[#fff]' },
  { title: 'Total Pending', value: 10, color: 'bg-[#0BF4C8]', icon: '/assets/images/Vector4.png', iconBg: 'bg-[#fff]' },
];

const Card = ({ title, value, color, icon, iconBg }) => (
  <div className={`p-8 rounded-3xl py-14 shadow-lg flex flex-col items-start ${color} relative bg-pattern`}>
    <div className={`absolute top-6 right-2 ${iconBg} p-3 rounded-[100%]`}>
      <img src={icon} alt={`${title} icon`} className="w-8 h-8 opacity-60" />
    </div>
    <div className="flex flex-col justify-between h-full">
      <div>
        <span className="text-lg font-semibold text-black">{title}</span>
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

