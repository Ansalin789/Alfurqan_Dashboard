"use client";
import { CircularProgress, Card, CardBody } from "@nextui-org/react";

const cards = [
  { id: "card1", name: "Level", value: 70, color: "#C1F0FF" },
  { id: "card2", name: "Attendance", value: 10, color: "#F6C5FE" },
  { id: "card3", name: "Total Classes", value: 30, color: "#FFECA7" },
  { id: "card4", name: "Duration", value: 60, color: "#93FFEB" },
];

export default function App() {
  return (
    <div className="p-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-[16px] px-4 font-bold text-gray-800 mb-0 md:mb-0">Course Overview</h2>
        <div className="relative">
          <select
            className="block appearance-none text-[10px] w-full bg-white border rounded-xl border-gray-300 font-semibold text-gray-800 py-1 px-2 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            name="quranOptions"
            id="quranDropdown"
          >
            <option value="Quran" className="text-[11px]">Quran</option>
            <option value="Tajweed" className="text-[11px]">Tajweed</option>
            <option value="Islamic Studies" className="text-[11px]">Islamic Studies</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-1">
        {cards.map((card) => (
          <Card
            key={card.id}
            className="w-full h-auto"
            style={{
              backgroundColor: "#1C3557",
              borderTop: `4px solid ${card.color}`,
            }}
          >
            <CardBody className="flex flex-col justify-center items-center p-4">
              <p className="text-white text-sm font-semibold">{card.name}</p>
              <CircularProgress
                classNames={{
                  svg: "w-16 h-16 drop-shadow-md mt-3",
                  track: "stroke-white/10",
                  value: "text-base font-semibold text-white",
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
