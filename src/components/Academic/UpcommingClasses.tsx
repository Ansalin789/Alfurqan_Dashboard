import React, { useState, useEffect } from 'react';

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

const UpcomingClasses: React.FC = () => {
  const [classes, setClasses] = useState<
    { id: string; date: string; time: string; title: string; color: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const auth=localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5001/evaluationlist', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth}`, 
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch classes: ${response.statusText}`);
        }

        const data = await response.json();
        const upcomingClasses = data.evaluation
          .filter((item: Evaluation) => {
            const classStartDate = new Date(item.classStartDate);
            const now = new Date();
            return classStartDate > now; // Filter for future classes
          })
          .sort((a: Evaluation, b: Evaluation) => {
            return (
              new Date(a.classStartDate).getTime() -
              new Date(b.classStartDate).getTime()
            );
          })
          .slice(0, 2) // Take only the first 2 upcoming classes
          .map((item: Evaluation) => ({
            id: item._id, // Use the unique ID as the key
            date: new Date(item.classStartDate).toLocaleDateString(), // Format date
            time: `${item.classStartTime} - ${item.classEndTime}`, // Combine start and end time
            title: item.student.learningInterest || 'Class', // Use learning interest as title
            color: item.student.preferredTeacher === 'Female' ? 'blue-500' : 'red-500', // Example color logic
          }));

        setClasses(upcomingClasses);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

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

export default UpcomingClasses;
