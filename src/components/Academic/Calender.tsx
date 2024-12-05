import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; 

const Academic = () => {
  const [value, setValue] = useState<Date | null>(new Date()); // Allow value to be Date or null

  return (
    <div className="flex items-center justify-center mt-20 bg-gray-100">
      <div className="calendar-container rounded-lg shadow-lg p-4 bg-gray-200">
        <Calendar
          onChange={(newValue) => setValue(newValue as Date)} // Cast newValue to Date
          value={value}
          tileContent={({ date, view }) => {
            // Add custom markers for specific dates
            if (view === "month") {
              if (date.getDate() === 5 || date.getDate() === 17) {
                return (
                  <div className="relative">
                    <div className="dot absolute top-1 right-1 bg-blue-500 rounded-full w-2 h-2"></div>
                  </div>
                );
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default Academic;
