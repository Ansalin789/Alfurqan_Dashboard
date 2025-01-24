"use client";
import React, { useEffect, useState } from "react";

type StudentData = {
  id: number;
  name: string;
  mobile: string;
  country: string;
  preferredTeacher: string;
  date: string;
  time: string;
};

const Upcome = () => {
  const [evaluationList] = useState<StudentData[]>([
    {
      id: 1,
      name: "John Doe",
      mobile: "123-456-7890",
      country: "USA",
      preferredTeacher: "Jane Smith",
      date: "01/30/2025",
      time: "10:00 AM - 11:00 AM",
    },
    {
      id: 2,
      name: "Alice Johnson",
      mobile: "987-654-3210",
      country: "Canada",
      preferredTeacher: "Mark Wilson",
      date: "02/05/2025",
      time: "02:00 PM - 03:00 PM",
    },
    {
      id: 3,
      name: "Bob Brown",
      mobile: "555-123-4567",
      country: "UK",
      preferredTeacher: "Emily Davis",
      date: "02/10/2025",
      time: "04:00 PM - 05:00 PM",
    },
    {
      id: 4,
      name: "Charlie Green",
      mobile: "444-789-0123",
      country: "Australia",
      preferredTeacher: "Sarah Lee",
      date: "02/15/2025",
      time: "11:00 AM - 12:00 PM",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false); // Data is hardcoded, so no need for actual loading logic
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="col-span-12 -mt-4">
      <h2 className="text-[13px] font-bold text-gray-800 px-4 mb-0">Upcoming Classes</h2>
      <div className="bg-[#969DB2] p-1 rounded-lg shadow-md">
        {evaluationList.map((item) => {
          let backgroundColor: string;

          if (item.id % 3 === 0) {
            backgroundColor = "#7C88CC";
          } else if (item.id % 3 === 1) {
            backgroundColor = "#FFD700";
          } else {
            backgroundColor = "#FF69B4";
          }

          return (
            <div
              key={item.id}
              className="flex flex-col md:flex-row justify-between items-center text-white rounded-xl px-4 py-[4px] mb-2 md:mb-0"
            >
              <div className="flex w-full md:w-auto mb-2 md:mb-0">
                <span className="font-semibold text-[11px] md:text-[11px]">{item.id} - {item.name}</span>
              </div>
              <div className="flex text-center w-full md:w-auto mb-2 md:mb-0">
                <span className="text-[10px] md:text-[11px]">by {item.preferredTeacher}</span>
              </div>
              <div className="flex flex-col items-center w-full md:w-auto mb-2 md:mb-0">
                <span className="flex items-center gap-2 text-[11px] md:text-[11px]">
                  <i className="fa fa-calendar" aria-hidden="true"></i>
                  {item.date}
                </span>
              </div>
              <div
                className="text-[10px] md:text-[10px] px-4 py-[px] rounded-md font-medium"
                style={{
                  backgroundColor,
                  color: "white",
                }}
              >
                {item.time}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Upcome;
