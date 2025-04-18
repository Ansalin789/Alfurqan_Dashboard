import React, { useState, useEffect } from "react";

interface Student {
  studentFirstName: string;
  studentLastName: string;
  learningInterest: string;
  preferredTeacher: string;
}

interface ClassItem {
  id: string;
  date: string;
  time: string;
  title: string;
  color: string;
}

const UpcomingClasses: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Hardcoded data with future dates
      const hardcodedClasses = [
        {
          id: "1",
          date: new Date(Date.now() + 86400000).toLocaleDateString(), // Tomorrow
          time: "10:00 AM - 11:30 AM",
          title: "Islamic",
          color: "blue-500" // Female teacher
        },
        {
          id: "2",
          date: new Date(Date.now() + 2 * 86400000).toLocaleDateString(), // Day after tomorrow
          time: "02:00 PM - 03:30 PM",
          title: "Quran",
          color: "red-500" // Male teacher
        },{
          id: "3",
          date: new Date(Date.now() + 2 * 86400000).toLocaleDateString(), // Day after tomorrow
          time: "02:00 PM - 03:30 PM",
          title: "Arabic",
          color: "green-500" // Male teacher
        }
      ];

      setClasses(hardcodedClasses);
    } catch (err) {
      setError("Failed to load class data");
      console.error("Error loading classes:", err);
    }
  }, []);

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-4 shadow-lg rounded-[20px] bg-[#e0dfdf] w-full max-w-md mx-auto">
      <h3 className="text-[13px] font-semibold text-gray-800 mb-4 text-center">
        Upcoming Classes
      </h3>
      
      <div className="space-y-3">
        {classes.length === 0 ? (
          <p className="text-center text-gray-600 text-[11px]">
            No upcoming classes scheduled.
          </p>
        ) : (
          classes.map((classItem) => (
            <div
            key={classItem.id}
            className={`p-3 rounded-md shadow-sm bg-[#e5e5e5] border-t-2 border-r-2 ${
              classItem.color === "blue-500"
                ? "border-blue-500"
                : classItem.color === "red-500"
                ? "border-red-500"
                : "border-green-500"
            }`}
          >
          
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-[13px] font-medium text-gray-800">
                    {classItem.title}
                  </h4>
                  <p className="text-[11px] text-gray-600 mt-1">
                    {classItem.date}
                  </p>
                </div>
                <p className="text-[11px] text-gray-600 bg-[#e5e5e5] px-2 py-1 rounded">
                  {classItem.time}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingClasses;