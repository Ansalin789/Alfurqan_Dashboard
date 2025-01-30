"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgress, Card, CardBody } from "@nextui-org/react";

// Component
export default function App({ studentId }: { studentId: string }) {
  const [data, setData] = useState({
    totalLevel: 0,
    totalAttendance: 0,
    totalClasses: 0,
    totalDuration: 0,
  });

  // Fetch data with dynamic studentId using axios
  const fetchData = async (studentId: string) => {
    try {
      const response = await axios.get('http://localhost:5001/dashboard/student/counts', {
        params: { studentId },
      });
      setData(response.data); // Set the fetched data into the state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(studentId); // Fetch data when component mounts, passing dynamic studentId
  }, [studentId]);

  // Cards data with dynamic values
  const cards = [
    { id: "card1", name: "Level", value: data.totalLevel, color: "#C1F0FF" },
    { id: "card2", name: "Attendance", value: data.totalAttendance, color: "#F6C5FE" },
    { id: "card3", name: "Total Classes", value: data.totalClasses, color: "#FFECA7" },
    { id: "card4", name: "Duration", value: data.totalDuration, color: "#93FFEB" },
  ];

  return (
    <div className="px-4 py-6">
      {/* Course Overview Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[16px] font-bold text-gray-800">Course Overview</h2>
        <div className="relative">
          <select
            className="block appearance-none w-full bg-white border rounded-xl border-gray-300 text-[11px] font-bold text-gray-800 py-[4px] px-2 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            name="quranOptions"
            id="quranDropdown"
          >
            <option value="Quran">Quran</option>
            <option value="Tajweed">Tajweed</option>
            <option value="Islamic Studies">Islamic Studies</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <svg
              className="fill-current h-4 w-4 text-gray-800"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card
            key={card.id}
            className="w-full h-[130px]" // Make card width responsive
            style={{
              backgroundColor: "#1C3557",
              borderTop: `4px solid ${card.color}`, // Fix borderTop style
            }}
          >
            <CardBody className="flex flex-col justify-center items-center">
              <p className="text-white text-[13px] font-semibold">{card.name}</p>
              <CircularProgress
                classNames={{
                  svg: "w-[70px] h-[70px] drop-shadow-md mt-3",
                  track: "stroke-white/10",
                  value: "text-1xl font-semibold text-white",
                }}
                showValueLabel={true}
                strokeWidth={3}
                value={card.value}
                style={{ stroke: card.color }}
              />
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
