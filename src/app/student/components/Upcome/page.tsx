import React from "react";
import { Calendar, User } from "lucide-react";

const UpcomingClasses = () => {
  const classes = [
    {
      id: 1,
      title: "Tajweed Masterclass",
      instructor: "Rose Poole",
      date: "06 May 2024",
      time: "9:00 AM - 10:30 AM",
      color: "bg-pink-600",
    },
    {
      id: 2,
      title: "Tajweed Masterclass",
      instructor: "Rose Poole",
      date: "07 May 2024",
      time: "9:00 AM - 10:30 AM",
      color: "bg-yellow-600",
    },
    {
      id: 3,
      title: "Tajweed Masterclass",
      instructor: "Rose Poole",
      date: "08 May 2024",
      time: "9:00 AM - 10:30 AM",
      color: "bg-blue-600",
    },
  ];

  return (
    <div>
      <h2 className="text-[16px] font-bold text-gray-800 p-[0px] px-4 -mt-[21px]">Upcoming classes</h2>
      <div className="bg-[#375074] p-1 rounded-xl shadow-md mt-[4px]">
        {classes.map((cls, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row justify-between items-center text-white rounded-xl px-4 py-[3px] mb-0 md:mb-0"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-[12px]">{cls.id} - {cls.title}</span>
              <div className="flex items-center ml-28">
                <User size={15} />&nbsp;
                <span className="font-medium text-[12px]">by {cls.instructor}</span>
              </div>
              
            </div>
            <div className="flex items-center gap-28">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span className="font-medium text-[11px]">{cls.date}</span>
              </div>
              <div className={`px-3 py-1 rounded-lg font-medium text-[10px] text-white ${cls.color}`}>
                {cls.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingClasses;
