import { useState, useEffect } from "react";
import axios from "axios";
import { FaBook } from "react-icons/fa";

interface ClassItem {
  id: string;
  date: string;
  time: string;
  title: string;
  color: string;
  icon: JSX.Element;
  teacher: string;
}

const UpcomingTask: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const teacherId = localStorage.getItem("TeacherPortalId");
        const auth = localStorage.getItem("TeacherAuthToken");

        const response = await axios.get("http://localhost:5001/classShedule/teacher", {
          params: { teacherId: teacherId },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        });

        const fetchedClasses = response.data.classSchedule.map((classItem: any) => ({
          id: classItem._id,
          date: classItem.startDate,
          time: `${classItem.startTime[0]} - ${classItem.endTime[0]}`,
          title: classItem.package,
          color: "bg-[#FAD85D] opacity-[90%]",
          icon: <FaBook className="text-yellow-700" />,
          teacher: classItem.teacher.teacherName,
        }));

        // Sort by date (assuming startDate is in ISO format) and get the last 5 upcoming classes
        const sortedClasses = fetchedClasses
        .sort((a: ClassItem, b: ClassItem) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort ascending by date
        .slice(0, 5); // Get the first 5 upcoming classes
      
      setClasses(sortedClasses);
      

      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
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
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg -ml-14 h-[43vh] overflow-y-scroll scrollbar-none">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[14px] font-semibold text-gray-800">Upcoming Task</h3>
      </div>
      <div className="space-y-3">
        {classes.map((classItem) => (
          <div key={classItem.id} className={`relative ${classItem.color} p-4 rounded-md shadow-md`}>
            <div className="flex items-center space-x-2">
              {classItem.icon}
              <h4 className="text-[13px] font-medium text-gray-800">{classItem.title}</h4>
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

export default UpcomingTask;
