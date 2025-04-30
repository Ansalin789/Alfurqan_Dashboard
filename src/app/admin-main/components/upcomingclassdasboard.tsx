import React, { useState, useEffect } from "react";
import axios from "axios";

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
    const fetchMeetings = async () => {
      try {
        const response = await axios.get("http://localhost:5001/allAdminMeeting");
        const meetings = response.data?.data?.meetings || [];
  
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to compare only date
  
        const filteredMeetings = meetings.filter((meeting: any) => {
          const meetingDate = new Date(meeting.selectedDate);
          meetingDate.setHours(0, 0, 0, 0);
          return meetingDate >= today; // Only keep future or today's meetings
        });
  
        const mappedMeetings: ClassItem[] = filteredMeetings.map((meeting: any) => {
          const start = meeting.startTime;
          const end = meeting.endTime;
          const title = meeting.meetingName || "Untitled";
          const date = new Date(meeting.selectedDate).toLocaleDateString();
          const color = meeting.teachers?.[0]?.[0]?.teacherName === "David"
            ? "red-500"
            : meeting.teachers?.[0]?.[0]?.teacherName === "Steve"
            ? "blue-500"
            : "green-500";
  
          return {
            id: meeting._id,
            date,
            time: `${start} - ${end}`,
            title,
            color,
          };
        });
  
        setClasses(mappedMeetings);
      } catch (err) {
        setError("Failed to load meeting data");
        console.error("API Error:", err);
      }
    };
  
    fetchMeetings();
  }, []);
  

  if (error) {
    return <div className="text-center text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="p-4 shadow-lg rounded-[20px] bg-[#e0dfdf] w-full max-w-md mx-auto h-[282px]">
      <h3 className="text-[13px] font-semibold text-gray-800 mb-3 text-center">
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
                  <h4 className="text-[12px] font-medium text-gray-800">
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
