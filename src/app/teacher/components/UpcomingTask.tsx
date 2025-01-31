import React, { useState } from 'react';
import { FaBook, FaUsers, FaChalkboardTeacher } from 'react-icons/fa';

interface ClassItem {
  id: string;
  date: string;
  time: string;
  title: string;
  color: string;
  icon: JSX.Element;
  teacher: string;
}

const UpcomingTask: React.FC = () => {
  const [classes] = useState<ClassItem[]>([
    {
      id: '1',
      date: '06 May 2024',
      time: '10:00 AM - 11:30 AM',
      title: 'Quran Class',
      color: 'bg-[#FAD85D] opacity-[90%]',
      icon: <FaBook className="text-yellow-700" />, 
      teacher: 'Rahim',
    },
    {
      id: '2',
      date: '06 May 2024',
      time: '12:00 PM - 01:30 PM',
      title: 'Teachers Meeting',
      color: 'bg-[#0BF4C8] opacity-[90%]',
      icon: <FaChalkboardTeacher className="text-teal-700" />, 
      teacher: '',
    },
    {
      id: '3',
      date: '06 May 2024',
      time: '02:00 PM - 02:30 PM',
      title: 'Trial Class',
      color: 'bg-[#85D8F2] opacity-[90%]',
      icon: <FaUsers className="text-blue-700" />, 
      teacher: 'Abdullah',
    },
    {
      id: '4',
      date: '07 May 2024',
      time: '11:00 AM - 12:30 PM',
      title: 'BI- Weekly Meeting',
      color: 'bg-[#F2A0FF] opacity-[90%]',
      icon: <FaUsers className="text-purple-700" />, 
      teacher: '',
    },
  ]);

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg -ml-24 h-[33vh] overflow-y-scroll scrollbar-none">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[14px] font-semibold text-gray-800">Upcoming Task</h3>
      </div>
      <div className="space-y-3">
        {classes.map((classItem) => (
          <div key={classItem.id} className={`relative ${classItem.color} p-4 rounded-md shadow-md`}> 
            <div className="flex items-center space-x-2">
              {classItem.icon}
              <h4 className="text-[13px] font-medium text-gray-800">{classItem.title}</h4>
            </div>
            <p className="text-[10px] text-gray-600 mt-1">{classItem.date}</p>
            <p className="text-[10px] text-gray-600">{classItem.time}</p>
            {classItem.teacher && (
              <p className="absolute right-3 bottom-2 text-gray-700 text-[12px] font-medium">{classItem.teacher}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingTask;
