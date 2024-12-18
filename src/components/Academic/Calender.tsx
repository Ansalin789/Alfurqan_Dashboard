import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";

const Academic = () => {
  const [value, setValue] = useState<Date | null>(new Date());

  return (
    <div className="flex items-center justify-center mt-12">
      <div className="calendar-container rounded-[50px] -ml-28">
        <Calendar
          onChange={(newValue) => setValue(newValue as Date)}
          value={value}
          className="custom-calendar"
          navigationLabel={({ date }) => {
            return `${date.toLocaleString('default', { month: 'long' }).toUpperCase()}, ${date.getFullYear()}`;
          }}
          nextLabel="›"
          prevLabel="‹"
          next2Label={null}
          prev2Label={null}
          showNeighboringMonth={false}
        />
      </div>
    </div>
  );
};

export default Academic;
