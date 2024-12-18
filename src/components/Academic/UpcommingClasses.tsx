import React from 'react';

const UpcomingClasses = () => {
  // Example data for the upcoming classes
  const classes = [
    { date: '06 May 2024', time: '10:00 AM - 11:30 AM', title: 'Evaluation Class', color: 'blue-500' },
    { date: '06 May 2024', time: '10:00 AM - 11:30 AM', title: 'Evaluation Class', color: 'red-500' },

  ];

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
      <h3 className="text-[15px] font-semibold text-gray-800 mb-4 text-center">
        Upcoming Classes
      </h3>
      <div className="space-y-4">
        {classes.map((classItem, index) => (
          <div
            key={index}
            className={`relative border-l-4 border-${classItem.color} bg-white p-4 rounded-md shadow-md`}
          >
            <div className="flex justify-between items-center">
              <p className="text-[12px] text-gray-600">{classItem.date}</p>
              <p className="text-[12px] text-gray-600">{classItem.time}</p>
            </div>
            <h4 className="mt-2 text-[13px] font-medium text-gray-800">{classItem.title}</h4>
            <div
              className={`absolute top-0 right-0 h-full w-1 border-r-4 border-${classItem.color} rounded-md`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingClasses;
