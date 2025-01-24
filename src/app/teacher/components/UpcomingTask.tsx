import React, { useState} from 'react';

// Define interfaces for the API response
interface Student {
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  studentPhone: number;
  studentCountry: string;
  preferredTeacher: string;
  learningInterest: string;
}

interface Evaluation {
  _id: string;
  classStartDate: string;
  classStartTime: string;
  classEndTime: string;
  student: Student;
}

const UpcomingTask: React.FC = () => {
  const [classes] = useState<
    { id: string; date: string; time: string; title: string; color: string }[]
  >([]);
  const [error] = useState<string | null>(null);
  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

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
                classItem.color === 'blue-500' ? 'border-blue-500' : 'border-red-500'
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

export default UpcomingTask;
