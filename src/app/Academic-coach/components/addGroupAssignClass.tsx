"use client";

import React, { useEffect, useMemo, useState } from "react";
import SuccessPopup from "@/app/supervisor/components/successPopup";
import FailedPopup from "@/app/supervisor/components/failedPopup";
import axios, { AxiosError } from "axios";
import { getSocket } from "@/app/utils/socket";
import dayjs from "dayjs";

export interface Student {
  _id: string;
  teacherName: string;
  sessionClassType: string;
  username: string;
  password: string;
  role: string;
  status: string;
  createdDate: string | number | Date;
  createdBy: string;
  updatedDate: string | number | Date;
  __v: number;
  student: {
    studentId: string;
    studentEmail: string;
    studentPhone: string | number;
    course: string;
    package: string;
    city: string;
    country: string;
    gender: string;
  };
}
export interface StudentInfo {
  studentId: string;
  studentName: string;
  studentEmail: string;
}

export interface TeacherInfo {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
}

export interface TimeOption {
  value: string;
  label: string;
}

export interface DayOption {
  value: string;
  label: string;
}

export interface ScheduleData {
  students: StudentInfo[];
  teacher: TeacherInfo;
  package: string;
  preferedTeacher: string;
  sessionClassType: string;
  sessionStarttime: string;
  sessionsEndtime: string;
  totalHourse: string;
  weeklySlots:WeeklySlotMap; 
  startDate: string;
  endDate: string;
  classDay: DayOption[];
  startTime: TimeOption[];
  endTime: TimeOption[];
  scheduleStatus: string;
  studentAttendee: string;
  teacherAttendee: string;
}

type Props = {
  readonly onClose: () => void;
  students: Student[];
};
interface TeacherList {
  teacherId: string;
  teacherName: string;
}
interface TimeSlots {
  startTime: string;
  endTime: string;
}

interface ScheduleItem {
  day: string;
  times: TimeSlots[];
  isSelected: boolean;
}
type WeeklySlotMap = {
  [day: string]: { from: string; to: string }[];
};

export default function AddGroupAssignClass({
  onClose,
  students,
}: Readonly<Props>) {
  const [teachers, setTeachers] = useState<TeacherList[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherList | null>(
    null
  );
  const [studentInfos, setStudentInfos] = useState<StudentInfo[]>([]);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [failedMessage, setFailedMessage] = useState("");
  useEffect(() => {
    console.log(JSON.stringify(students));
  }, [students]);

  const [startDate, setStartDate] = useState("");
  const [schedule, setSchedule] = useState<ScheduleItem[]>(
    [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ].map((day) => ({
      day,
      times: [],
      isSelected: false,
    }))
  );
  const scheduleHash = useMemo(() => {
    return JSON.stringify({ startDate, schedule });
  }, [startDate, schedule]);
  const buildWeeklySlots = () => {
    const map: WeeklySlotMap = {};
    schedule.forEach((item) => {
      if (item.isSelected && item.times.length > 0) {
        map[item.day] = item.times.map((t) => ({
          from: t.startTime,
          to: t.endTime,
        }));
      }
    });
    return map;
  };
  useEffect(() => {
    const mapped = students.map((stu) => ({
      studentId: stu._id,
      studentName: stu.username,
      studentEmail: stu.student.studentEmail,
    }));
    setStudentInfos(mapped);
  }, [students]);
  useEffect(() => {
    const academicId =
      typeof window !== "undefined"
        ? localStorage.getItem("AcademicCoachPortalId")
        : null;
    if (!academicId) return;

    const hasSelection = schedule.some(
      (item) => item.isSelected && item.times.length > 0
    );
    if (!hasSelection || !startDate) return;

    const socket = getSocket(academicId);
    console.log("📤 Sending availableTeachersListRequest");

    socket.emit("availableTeachersListRequest", {
      requestId: academicId,
      startDate,
      WeeklySlots: buildWeeklySlots(),
    });

    const handleResponse = (data: TeacherList[]) => {
      console.log("📥 Teacher list received:", data);
      setTeachers(data);
    };

    socket.on("availableTeachersListResponse", handleResponse);

    return () => {
      socket.off("availableTeachersListResponse", handleResponse);
    };
  }, [scheduleHash]);
  const handleClassSelection = (index: number) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[index].isSelected = !updatedSchedule[index].isSelected;
    setSchedule(updatedSchedule);
  };
  const handleAddTimeSlot = (index: number) => {
    const updatedSchedule = [...schedule];
    if (updatedSchedule[index].times.length > 0) {
      const lastSlot =
        updatedSchedule[index].times[updatedSchedule[index].times.length - 1];
      if (!lastSlot.startTime || !lastSlot.endTime) {
        alert("⚠️ Please fill the last time slot before adding a new one.");
        return;
      }
    }
    updatedSchedule[index].times.push({ startTime: "09:00", endTime: "09:30" });

    setSchedule(updatedSchedule);
  };
  const handleRemoveTimeSlot = (dayIndex: number, timeIndex: number) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex].times.splice(timeIndex, 1);
    setSchedule(updatedSchedule);
  };

  const handleTimeChange = (
    dayIndex: number,
    timeIndex: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex].times[timeIndex][field] = value;
    setSchedule(updatedSchedule);
  };

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const minutes = ["00", "30"];

  const handleSubmit = async () => {
    console.log(startDate);
    console.log(selectedTeacher);
    console.log(studentInfos);
    if (!startDate || !selectedTeacher?.teacherId || !studentInfos) {
      alert("Please fill all required fields!");
      return;
    }
    const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
    const formattedEndDate = dayjs(startDate)
      .add(28, "day")
      .format("YYYY-MM-DD");
    const requestData: ScheduleData = {
      students: studentInfos,
      teacher: {
        teacherId: selectedTeacher?.teacherId ?? "",
        teacherName: selectedTeacher?.teacherName ?? "",
        teacherEmail: "",
      },
      package: "",
      preferedTeacher: selectedTeacher?.teacherName ?? "",
      sessionClassType: "GROUPCLASS",
      sessionStarttime: "",
      sessionsEndtime: "",
      totalHourse: "",
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      weeklySlots: buildWeeklySlots(),
      classDay: schedule
        .filter((item) => item.isSelected)
        .map((item) => ({ label: item.day, value: item.day })),
      startTime: schedule
        .filter((item) => item.isSelected)
        .flatMap((item) =>
          item.times.map((time) => ({
            label: time.startTime,
            value: time.startTime,
          }))
        ),
      endTime: schedule
        .filter((item) => item.isSelected)
        .flatMap((item) =>
          item.times.map((time) => ({
            label: time.endTime,
            value: time.endTime,
          }))
        ),
      scheduleStatus: "Scheduled",
      studentAttendee: "Absent",
      teacherAttendee: "Absent",
    };
    console.log("payload", requestData);
    try {
      const token = localStorage.getItem("AcademicCoachAuthToken");
      if (!token) {
        console.error("❌ AcademicCoachAuthToken not found");
        return;
      }

      const response = await axios.post(
        " http://localhost:5001/groupclassschedule/bulkcreate",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if ([200, 201].includes(response.status)) {
        setSuccess(true);
        setTimeout(() => {
          setTeachers([]);
          setSchedule([]);
        }, 2000);
      }
    } catch (err) {
      const error = err as AxiosError;
      const status = error.response?.status;
      if (Number(status === 400)) {
        const message =
          (error.response?.data as any)?.message ?? "Please check the form inputs.";
        setFailedMessage(message);
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
        <label
          htmlFor="ugcuc"
          className="text-[14px] text-[#010E30] dark:text-white mb-3"
        >
          Join Date:
        </label>
        <input
          type="date"
          id="ugcuc"
          className="w-full border text-xs rounded px-3 py-2 dark:bg-[#2A2A2A] dark:text-white mb-2"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        {schedule.map((item, dayIndex) => (
          <div key={item.day} className="mb-4 border rounded-md px-3 py-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[14px] text-[#010E30CC] dark:text-white">
                {item.day}
              </label>
              <input
                type="checkbox"
                checked={item.isSelected}
                onChange={() => handleClassSelection(dayIndex)}
              />
            </div>

            {item.isSelected && (
              <>
                {item.times.map((time, timeIndex) => (
                  <div
                    key={timeIndex}
                    className="flex items-center justify-between gap-2 mb-2"
                  >
                    <div className="flex gap-1 w-full">
                      {/* From Time - HH */}
                      <select
                        value={time.startTime.split(":")[0]}
                        onChange={(e) =>
                          handleTimeChange(
                            dayIndex,
                            timeIndex,
                            "startTime",
                            `${e.target.value}:${time.startTime.split(":")[1]}`
                          )
                        }
                        className="w-full border rounded px-2 py-1 dark:bg-[#2A2A2A] dark:text-white"
                      >
                        {hours.map((h) => (
                          <option key={h}>{h}</option>
                        ))}
                      </select>

                      {/* From Time - MM */}
                      <span className="text-[#293453] pt-1 dark:text-white">
                        :
                      </span>
                      <select
                        value={time.startTime.split(":")[1]}
                        onChange={(e) =>
                          handleTimeChange(
                            dayIndex,
                            timeIndex,
                            "startTime",
                            `${time.startTime.split(":")[0]}:${e.target.value}`
                          )
                        }
                        className="w-full border rounded px-2 py-1 dark:bg-[#2A2A2A] dark:text-white"
                      >
                        {minutes.map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    {/* Separator */}
                    <span className="text-[#293453] dark:text-white">-</span>

                    <div className="flex gap-1 w-full">
                      {/* To Time - HH */}
                      <select
                        value={time.endTime.split(":")[0]}
                        onChange={(e) =>
                          handleTimeChange(
                            dayIndex,
                            timeIndex,
                            "endTime",
                            `${e.target.value}:${time.endTime.split(":")[1]}`
                          )
                        }
                        className="w-full border rounded px-2 py-1 dark:bg-[#2A2A2A] dark:text-white"
                      >
                        <option value="">HH</option>
                        {hours.map((h) => (
                          <option key={h}>{h}</option>
                        ))}
                      </select>

                      {/* To Time - MM */}
                      <span className="text-[#293453] pt-1 dark:text-white">
                        :
                      </span>
                      <select
                        value={time.endTime.split(":")[1]}
                        onChange={(e) =>
                          handleTimeChange(
                            dayIndex,
                            timeIndex,
                            "endTime",
                            `${time.endTime.split(":")[0]}:${e.target.value}`
                          )
                        }
                        className="w-full border rounded px-2 py-1 dark:bg-[#2A2A2A] dark:text-white"
                      >
                        <option value="">MM</option>
                        {minutes.map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveTimeSlot(dayIndex, timeIndex)}
                      className="ml-2 text-red-500 hover:text-red-700 text-[8px]"
                      title="Remove this time slot"
                    >
                      ❌
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => handleAddTimeSlot(dayIndex)}
                  className="w-full bg-[#576CBC] text-white py-1 rounded text-sm"
                >
                  Add
                </button>
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
            value={selectedTeacher?.teacherId ?? ""}
            onChange={(e) => {
              const selected = teachers.find(
                (teacher) => teacher.teacherId === e.target.value
              );
              setSelectedTeacher(selected || null);
            }}
            className="border rounded px-3 py-2 w-full dark:bg-[#2A2A2A] dark:text-white"
          >
            <option value="">Select a Teacher</option>
            {teachers.map((teacher) => (
              <option
                key={teacher.teacherId}
                value={teacher.teacherId}
                className="text-[#010E30] text-xs dark:text-white bg-white dark:bg-[#343434]"
              >
                {teacher.teacherName}
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
            type="button"
            onClick={handleSubmit}
            className="px-3 py-1 bg-[#576CBC] text-white  rounded hover:bg-[#4459A9]"
          >
            Submit
          </button>
        </div>
      </form>
      {success && (
        <SuccessPopup
          onClose={() => setSuccess(false)}
          title="Group Class Added Successfully"
        />
      )}
      {failed && (
        <FailedPopup onClose={() => setFailed(false)} title={failedMessage} />
      )}
    </div>
  );
}
