'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";

interface ClassItem {
  id: string;
  date: string;
  time: string;
  title: string;
  color: string;
  startTime: string;
}

const UpcomingClasses: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('AdminAuthToken');
      if (token) {
        fetchMeetings(token);
      } else {
        console.log("No auth token found.");
      }
    }
  }, []);

  const fetchMeetings = async (token: string) => {
    try {
      const response = await axios.get("https://api.blackstoneinfomaticstech.com/allAdminMeeting", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const meetings = response.data?.data?.meetings || [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const filteredMeetings = meetings.filter((meeting: any) => {
        const meetingDate = new Date(meeting.selectedDate);
        meetingDate.setHours(0, 0, 0, 0);
        return meetingDate >= today;
      });

      const colorMap: Record<string, string> = {
        REGULARCLASS: "red-500",
        GROUPCLASS: "blue-500",
        QURAN: "purple-500",
        ARABIC: "green-500",
        ISLAMIC: "yellow-500",
      };

      const mappedMeetings: ClassItem[] = filteredMeetings.map((meeting: any) => {
        const start = meeting.startTime;
        const end = meeting.endTime;
        const title = meeting.meetingName || "Untitled";
        const date = new Date(meeting.selectedDate).toLocaleDateString();
        const classType = meeting.classType?.trim().toUpperCase() || "DEFAULT";
        const color = colorMap[classType] || "gray-400";

        return {
          id: meeting._id,
          date,
          time: `${start} - ${end}`,
          title,
          color,
          startTime: start,
        };
      });

      mappedMeetings.sort((a, b) => a.startTime.localeCompare(b.startTime));

      setClasses(mappedMeetings);
    } catch (err) {
      setError("Failed to load meeting data");
      console.error("API Error:", err);
    }
  };

  if (error) {
    return <div className="text-center text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="bg-white dark:bg-[#343434] w-full h-[365px] rounded-xl px-4 pt-4 pb-6">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="font-semibold text-[14px] text-[#010e30] dark:text-white">Upcoming Classes</h2>
        <span className="bg-[#EBEFFF] dark:bg-[#576CBC33] text-[#6B73FF] text-xs font-medium px-2 py-1 rounded-md">
          Today
        </span>
      </div>

      {classes.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-white text-sm p-4">No upcoming classes scheduled.</p>
      ) : (
        <div className="relative">
          {/* Vertical dotted line only if there are classes */}
          <div className="absolute left-[55px] top-0 bottom-0 border-l-2 border-dotted border-black dark:border-white" />

          <div className="space-y-4 pl-[8px]">
            {classes.map((classItem) => (
              <div key={classItem.id} className="flex items-start relative w-full">
                {/* Time */}
                <div className="w-[45px] text-[12px] text-black dark:text-white mt-[7px] text-right pr-4">
                  {classItem.startTime}
                </div>

                {/* Dot */}
                <div className="absolute left-[44px] top-[12px] z-10">
                  <div className={`w-[10px] h-[10px] rounded-full bg-${classItem.color}`} />
                </div>

                {/* Card */}
                <div className="ml-[24px] flex-1 bg-[#f4f4f4] dark:bg-[#404040] rounded-md px-3 py-2 flex justify-between items-center">
                  <span className={`text-[13px] font-bold uppercase text-${classItem.color}`}>
                    {classItem.title}
                  </span>
                  {/* <p className="text-[11px] text-gray-700 dark:text-gray-300">{classItem.time}</p> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingClasses;
