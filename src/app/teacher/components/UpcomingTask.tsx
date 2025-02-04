<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { FaBook, FaUsers, FaChalkboardTeacher } from 'react-icons/fa';
import axios from 'axios';

=======
import React, { useState } from 'react';

// Define the interface for class items
>>>>>>> 3015535774ca1c58c524ae8b46dcd48893cb376a
interface ClassItem {
  id: string;
  date: string;
  time: string;
  title: string;
  color: string;
<<<<<<< HEAD
  icon: JSX.Element;
  teacher: string;
}

const UpcomingTask: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch class data from the API
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const teacherId = localStorage.getItem('TeacherPortalId');
        const auth = localStorage.getItem('TeacherAuthToken');
        const response = await axios.get('http://localhost:5001/classShedule/teacher', {
          params: { teacherId: teacherId },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth}`,
          },
        });
        const fetchedClasses = response.data.classSchedule.map((classItem: any) => ({
          id: classItem._id,
          date: classItem.startDate,
          time: `${classItem.startTime[0]} - ${classItem.endTime[0]}`,
          title: classItem.package,
          color: 'bg-[#FAD85D] opacity-[90%]', // Customize based on your requirements
          icon: <FaBook className="text-yellow-700" />, // Customize based on your requirements
          teacher: classItem.teacher.teacherName,
        }));
        setClasses(fetchedClasses);
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

    fetchClassData();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg -ml-24 h-[33vh] overflow-y-scroll scrollbar-none">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[14px] font-semibold text-gray-800">Upcoming Task</h3>
      </div>
      <div className="space-y-3">
        {classes.map((classItem) => (
          <div key={classItem.id} className={`relative ${classItem.color} p-4 rounded-md shadow-md`}>
            <div className="flex items-center space-x-2">
              {classItem.icon}
              <h4 className="text-[13px] font-medium text-gray-800">{classItem.title}</h4>
=======
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
  const getBorderColor = (color: string) => {
    switch (color) {
      case 'blue-500':
        return 'border-blue-500';
      case 'red-500':
        return 'border-red-500';
      default:
        return 'border-green-500';
    }
  };

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
            className={`relative border-l-4 bg-white p-4 rounded-md shadow-md ${getBorderColor(classItem.color)}`}
          >
              <div className="flex justify-between items-center">
                <p className="text-[12px] text-gray-600">{classItem.date}</p>
                <p className="text-[12px] text-gray-600">{classItem.time}</p>
              </div>
              <h4 className="mt-2 text-[13px] font-medium text-gray-800">{classItem.title}</h4>
>>>>>>> 3015535774ca1c58c524ae8b46dcd48893cb376a
            </div>
            <p className="text-[10px] text-gray-600 mt-1">{classItem.date}</p>
            <p className="text-[10px] text-gray-600">{classItem.time}</p>
            {classItem.teacher && (
              <p className="absolute right-3 bottom-2 text-gray-700 text-[12px] font-medium">
                {classItem.teacher}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingClasses;
