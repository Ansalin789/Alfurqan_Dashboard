"use client";

import React, { useEffect, useState } from "react";
import SuccessPopup from "@/app/supervisor/components/successPopup";
import FailedPopup from "@/app/supervisor/components/failedPopup";
import axios, { AxiosError } from "axios";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type TimeSlot = {
  fromHour: string;
  fromMinute: string;
  toHour: string;
  toMinute: string;
};
interface Teacher {
  _id: string;
  userName: string;
  email: string;
  password: string;
  role: string[]; // Array of roles, e.g., "TEACHER"
  profileImage: string | null; // Could be a URL or null
  status: string; // Active/Inactive status
  createdBy: string; // Who created the record
  lastUpdatedBy: string; // Who last updated the record
  userId: string; // Unique ID for the user
  lastLoginDate: string; // Last login timestamp
  createdDate: string; // Creation timestamp
  lastUpdatedDate: string; // Last update timestamp
}
type Student = {
  studentId: string;
  studentName: string;
  studentEmail:string;
  package:string;
  course:string;
  totolHours:string;
};

type Props = {
  readonly onClose: () => void;
  students : Student[];
};

export default function AddGroupAssignClass({ onClose , students }: Readonly<Props>) {
  const [selectedDays, setSelectedDays] = useState<Record<string, TimeSlot[]>>(
    {}
  );
  const [tempSlots, setTempSlots] = useState<Record<string, TimeSlot>>({});
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [success, setSuccess] = useState(false);
    const [failed, setFailed] = useState(false);
    const [failedMessage, setFailedMessage] = useState("");
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("AcademicCoachAuthToken")
            : null;

        if (!token) {
          console.error("❌ AdminAuthToken not found");
          return;
        }
        const response = await fetch(
          "https://api.blackstoneinfomaticstech.com/users?role=TEACHER",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        console.log("Fetched data:", data);

        // Access `users` array in the response
        if (data && Array.isArray(data.users)) {
          setTeachers(data.users);
        } else {
          console.error("Unexpected API response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    fetchTeachers();
  }, []);

 const handleDayToggle = (day: string) => {
  setSelectedDays((prev) => {
    const newState = { ...prev };

    if (newState[day]) {
      delete newState[day]; // Safely remove key instead of setting to undefined
    } else {
      newState[day] = [];
    }

    return newState;
  });
};


  const handleTimeChange = (
    day: string,
    field: keyof TimeSlot,
    value: string
  ) => {
    setTempSlots((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const addTimeSlot = (day: string) => {
    const slot = tempSlots[day];
    if (!slot?.fromHour || !slot?.toHour) return;

    setSelectedDays((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), slot],
    }));

    setTempSlots((prev) => ({
      ...prev,
      [day]: { fromHour: "", fromMinute: "", toHour: "", toMinute: "" },
    }));
  };

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const minutes = ["00", "15", "30", "45"];
  const generateStructuredTimeData = () => {
    const classDay: { label: string; value: string }[] = [];
    const startTime: { label: string; value: string }[] = [];
    const endTime: { label: string; value: string }[] = [];

    for (const day in selectedDays) {
      const slots = selectedDays[day];
    if (slots?.length) {
        slots.forEach((slot) => {
          const from = `${slot.fromHour}:${slot.fromMinute}`;
          const to = `${slot.toHour}:${slot.toMinute}`;

          classDay.push({ label: day, value: day });
          startTime.push({ label: from, value: from });
          endTime.push({ label: to, value: to });
        });
      }
    }

    return { classDay, startTime, endTime };
  };
   const handleSubmit = async () => {
      const createdDate = new Date().toISOString();
       const timeData = generateStructuredTimeData();
       if (
        !timeData ||
        !selectedTeacher ||
        students
      ) {
        alert("Please fill all required fields!");
        return;
      }
      const requestData = {
        timeData,
        selectedTeacher,
        students,
        classStatus: "Scheduled",
        student: teachers,
        status: "Active",
        createdDate,
        createdBy: localStorage.getItem("AcademicCoachPortalName"),
      };
  
      try {
        const token = localStorage.getItem("AcademicCoachAuthToken");
        if (!token) {
          console.error("❌ AcademicCoachAuthToken not found");
          return;
        }
  
        const response = await axios.post(
          "https://api.blackstoneinfomaticstech.com/addMeeting",
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        if ([200, 201, 400].includes(response.status)) {
          setSuccess(true);
          setTimeout(() => {
           setTeachers([]);
           setTempSlots({});
           setSelectedDays({});
          }, 2000);
        }
      } catch (err) {
        const error = err as AxiosError;
        const status = error.response?.status;
        if (Number(status === 400)) {
          console.log("please >");
          setFailedMessage("Please check the form inputs.");
          setFailed(true);
        } else if (status === 401) {
          setFailedMessage("Please login again.");
          setFailed(true);
        } else if (status === 403) {
          setFailedMessage("You don't have permission to perform this action.");
          setFailed(true);
        } else if (status === 500) {
          setFailedMessage("Server error");
          setFailed(true);
        } else {
          setFailed(true);
          console.error(`Unexpected error: ${status}`);
        }
      }
    };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <form
        className="bg-white dark:bg-[#1D1D1D] rounded-lg shadow-xl p-5 w-full max-w-md mx-3 text-sm border border-[#DFE0EB] dark:border-[#444] scrollbar-none"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <h1 className="text-sm font-medium text-[#010E30] dark:text-white mb-3">
          Schedule Classes
        </h1>

        {daysOfWeek.map((day) => (
          <div key={day} className="mb-4 border rounded-md px-3 py-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[14px] text-[#010E30CC] dark:text-white">
                {day}
              </label>
              <input
                type="checkbox"
                checked={!!selectedDays[day]}
                onChange={() => handleDayToggle(day)}
              />
            </div>

            {selectedDays[day] && (
              <>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex gap-1 w-full">
                    <select
                      value={tempSlots[day]?.fromHour || ""}
                      onChange={(e) =>
                        handleTimeChange(day, "fromHour", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1 dark:bg-[#2A2A2A] dark:text-white"
                    >
                      <option className="text-xs scrollbar-none" value="">
                        HH
                      </option>
                      {hours.map((h) => (
                        <option key={h}>{h}</option>
                      ))}
                    </select>
                    <span className="text-[#293453] pt-1 dark:text-white">
                      :
                    </span>
                    <select
                      value={tempSlots[day]?.fromMinute || ""}
                      onChange={(e) =>
                        handleTimeChange(day, "fromMinute", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1 dark:bg-[#2A2A2A] dark:text-white"
                    >
                      <option className="text-xs scrollbar-none" value="">
                        MM
                      </option>
                      {minutes.map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <span className="text-[#293453] dark:text-white">-</span>
                  <div className="flex gap-1 w-full">
                    <select
                      value={tempSlots[day]?.toHour || ""}
                      onChange={(e) =>
                        handleTimeChange(day, "toHour", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1 dark:bg-[#2A2A2A] dark:text-white"
                    >
                      <option className="text-xs scrollbar-none" value="">
                        HH
                      </option>
                      {hours.map((h) => (
                        <option key={h}>{h}</option>
                      ))}
                    </select>
                    <span className="text-[#293453] pt-1 dark:text-white">
                      :
                    </span>
                    <select
                      value={tempSlots[day]?.toMinute || ""}
                      onChange={(e) =>
                        handleTimeChange(day, "toMinute", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1 dark:bg-[#2A2A2A] dark:text-white"
                    >
                      <option className="text-xs scrollbar-none" value="">
                        MM
                      </option>
                      {minutes.map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => addTimeSlot(day)}
                  className="w-full bg-[#576CBC] text-white py-1 rounded text-sm"
                >
                  Add
                </button>

                {selectedDays[day]?.map((slot, index ) => (
                  <div key={index} className="text-xs text-[#576CBC] mt-1">
                    {slot.fromHour}:{slot.fromMinute} - {slot.toHour}:
                    {slot.toMinute}
                  </div>
                ))}
              </>
            )}
          </div>
        ))}

        <div className="mt-4">
          <label
            htmlFor="teachers"
            className="text-[14px] text-[#010E30] dark:text-white mb-1 block"
          >
            Select Teacher
          </label>
          <select
            value={selectedTeacher?.userId ?? ""}
            onChange={(e) => {
              const selected = teachers.find(
                (teacher) => teacher.userId === e.target.value
              );
              setSelectedTeacher(selected || null);
            }}
            className="border rounded px-3 py-2 w-full dark:bg-[#2A2A2A] dark:text-white"
          >
            <option value="">Select a Teacher</option>
            {teachers.map((teacher) => (
              <option
                key={teacher.userId}
                value={teacher.userId}
                className="text-[#010E30] text-xs dark:text-white bg-white dark:bg-[#343434]"
              >
                {teacher.userName}
              </option>
            ))}
          </select>
        </div>

        <div className="border-t pt-4 mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 border border-[#576CBC] text-[#576CBC] hover:border-[#4459A9] rounded hover:bg-[#E6E9F5] dark:hover:bg-[#333]"
          >
            Cancel
          </button>
          <button
            type="submit"
             onSubmit={(e) => {
               e.preventDefault();
               handleSubmit();
            }}
            className="px-3 py-1 bg-[#576CBC] text-white  rounded hover:bg-[#4459A9]"
          >
            Submit
          </button>
        </div>
      </form>
       {success && (
              <SuccessPopup onClose={() => setSuccess(false)} title="Group Class Added Successfully" />
            )}
            {failed && (
              <FailedPopup onClose={() => setFailed(false)} title={failedMessage} />
            )}
    </div>
  );
}
