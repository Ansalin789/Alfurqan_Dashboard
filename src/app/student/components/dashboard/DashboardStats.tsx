"use client";
import { CircularProgress, Card, CardBody } from "@nextui-org/react";

const cards = [
  { id: "card1", name: "Level", value: 70 ,color: "#C1F0FF"},
  { id: "card2", name: "Attendance", value: 10 ,color: "#F6C5FE"},
  { id: "card3", name: "Total Classes", value: 30 ,color: "#FFECA7" },
  { id: "card4", name: "Duration", value: 60 ,color: "#93FFEB"},
];

export default function App() {
  return (
    <div>
      <div className="justify-between flex">
        <h2 className="text-[16px] font-bold text-gray-800 px-4 -mt-4">Course Overview</h2>
        <div className="relative px-4 -mt-[15px]">
          <select
            className="block appearance-none w-full bg-white border rounded-xl border-gray-300 text-[11px] font-bold text-gray-800 py-[4px] px-2 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            name="quranOptions"
            id="quranDropdown"
          >
            <option value="Quran">Quran</option>
            <option value="Tajweed">Tajweed</option>
            <option value="Islamic Studies">Islamic Studies</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-8 -mt-1 text-gray-800">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

  

    <div className="flex justify-center gap-2 p-0 ">
     
      {cards.map((card) => (
        <Card
          key={card.id} // Unique key from the card object
          className="w-[200px] h-[130px]" // Reduced width and height
          style={{
            backgroundColor: "#1C3557",
            borderTop: `4px solid ${card.color}` // Add top border with the same color as the indicator
          }}
        >
          <CardBody className="justify-center items-center">
            {/* Add the name above the CircularProgress */}
            <p className="text-white text-[13px] font-semibold">{card.name}</p> {/* Reduced text size */}
            <CircularProgress
              classNames={{
                svg: "w-[70px] h-[70px] drop-shadow-md mt-3", // Reduced the CircularProgress size
                track: "stroke-white/10",
                value: "text-1xl font-semibold text-white", // Reduced the value text size
              }}
              showValueLabel={true}
              strokeWidth={3} // Reduced stroke width
              value={card.value}
              style={{ stroke: card.color }} // Apply the color directly through the style prop
            />
          </CardBody>
        </Card>
      ))}
    </div>
    </div>
  );
}
