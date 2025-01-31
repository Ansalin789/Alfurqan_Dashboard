import React, { useState } from 'react';

// Define the interface for class items
interface ClassItem {
  id: string;
  date: string;
  time: string;
  title: string;
  color: string;
}

const UpcomingClasses: React.FC = () => {
  // Hardcoded data for upcoming classes
  const [classes] = useState<ClassItem[]>([
    {
      id: '1',
      date: '01/25/2025',
      time: '10:00 AM - 11:00 AM',
      title: 'Quran Memorization',
      color: 'blue-500',
    },
    {
      id: '2',
      date: '01/26/2025',
      time: '12:00 PM - 1:00 PM',
      title: 'Arabic Grammar',
      color: 'red-500',
    },
    
  ]);

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
      <h3 className="text-[15px] font-semibold text-gray-800 mb-4 text-center">
        Upcoming Classes
      </h3>
      <div className="space-y-4">
        {classes.length === 0 ? (
          <p className="text-center text-gray-600">No upcoming classes.</p>
        ) : (
          classes.map((classItem) => (
            <div
              key={classItem.id} // Use the unique ID as the key
              className={`relative border-l-4 bg-white p-4 rounded-md shadow-md ${
                classItem.color === 'blue-500'
                  ? 'border-blue-500'
                  : classItem.color === 'red-500'
                  ? 'border-red-500'
                  : 'border-green-500'
              }`}
            >
              <div className="flex justify-between items-center">
                <p className="text-[12px] text-gray-600">{classItem.date}</p>
                <p className="text-[12px] text-gray-600">{classItem.time}</p>
              </div>
              <h4 className="mt-2 text-[13px] font-medium text-gray-800">{classItem.title}</h4>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingClasses;
