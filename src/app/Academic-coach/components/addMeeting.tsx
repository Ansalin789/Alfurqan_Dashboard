"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Plus } from "lucide-react";
import axios, { AxiosError } from "axios";
import SuccessPopup from "@/app/supervisor/components/successPopup";
import FailedPopup from "@/app/supervisor/components/failedPopup";

type Props = {
  readonly onClose: () => void;
  readonly onSuccess?: () => void; // notify parent to refresh table
};
export interface StudentData {
  _id: string;
  username: string;
  password: string;
  role: string;
  status: string;
  createdBy: string;
  createdDate: string; // ISO date string
  updatedDate: string; // ISO date string
  classScheduleCount: number;
  student: {
    city: string;
    country: string;
    course: string;
    gender: string;
    package: string;
    studentEmail: string;
    studentId: string;
    studentPhone: number | string;
  };
  __v?: number;
}

export default function AddMeeting({ onClose, onSuccess }: Props) {
  const [meetingTitle, setMeetingTitle] = useState("Weekly Meeting");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [failedMessage, setFailedMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [selectedTeachers, setSelectedTeachers] = useState<StudentData[]>([]);
  const [Teachers, setTeachers] = useState<StudentData[]>([]);
  const tabs = ["All", "Quran", "Arabic", "Islamic"] as const;
  type Tab = (typeof tabs)[number];

  // Compute tomorrow's date in local time to disable today in the date picker
  const formatLocalDateYYYYMMDD = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const minDateForMeeting = (() => {
    const today = new Date();
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    return formatLocalDateYYYYMMDD(tomorrow);
  })();

  useEffect(() => {
    const FetachTeachers = async () => {
      console.log("Active tabs", activeTab);
      try {
        const Id =
          typeof window !== "undefined"
            ? localStorage.getItem("AcademicCoachPortalId")
            : null;
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("AcademicCoachAuthToken")
            : null;
        const url = `https://api.blackstoneinfomaticstech.com/alstudents`;

        // const params: Record<string, string> = {
        //   academicCoachId: Id ?? "",
        // };

        // if (activeTab !== "All") {
        //   params.teacherGroup = `${activeTab} Studies`;
        //   console.log('inserted', activeTab);
        // }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setTeachers(response.data.students ?? []);
      } catch (error) {
        console.log(error);
        setTeachers([]);
      }
    };
    FetachTeachers();
  }, [activeTab]);

  const toggleTeacher = (teacher: StudentData) => {
    setSelectedTeachers((prev) => {
      const exists = prev.some((t) => t._id === teacher._id);
      return exists
        ? prev.filter((t) => t._id !== teacher._id)
        : [...prev, teacher];
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !meetingTitle ||
      !selectedDate ||
      !startTime ||
      !endTime ||
      selectedTeachers.length === 0
    ) {
      alert("Please fill all required fields!");
      return;
    }

    if (!description || description.trim().length < 5) {
      setFailedMessage("Description must contain at least 5 characters.");
      setFailed(true);
      return;
    }

    // Prevent scheduling on the same date or past dates
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const picked = selectedDate ? new Date(selectedDate) : null;
    if (!picked) {
      alert("Please select a meeting date.");
      return;
    }
    const pickedLocal = new Date(picked.getFullYear(), picked.getMonth(), picked.getDate());
    if (pickedLocal <= startOfToday) {
      alert("Meetings cannot be scheduled for today. Please pick a future date.");
      return;
    }

    const formattedDate = new Date(selectedDate).toISOString();
    const createdDate = new Date().toISOString();

    const teachers = selectedTeachers.map((teacher, idx) => ({
      studentId: teacher.student.studentId,
      studentName: teacher.username,
      studentEmail: teacher.student.studentEmail,
      _id: teacher._id,
    }));

    const requestData = {
      meetingName: meetingTitle,
      selectedDate: formattedDate,
      startTime,
      endTime,
      meetingStatus: "Scheduled",
      Academic: {
        academicCoachId: localStorage.getItem("AcademicCoachPortalId"),
      },
      student: teachers,
      description,
      status: "Active",
      createdDate,
      createdBy: localStorage.getItem("AcademicCoachPortalName"),
    };

    try {
      const token = localStorage.getItem("AcademicCoachAuthToken");
      if (!token) {
        console.error("❌ AcademicCoachAuthToken not found");
        setFailedMessage("Please login again.");
        setFailed(true);
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

      if (response.status >= 200 && response.status < 300) {
        setSuccess(true); // show popup for 5s, then onClose handler will reset and close
      } else {
        setFailedMessage("Request failed. Please try again.");
        setFailed(true);
      }
    } catch (err) {
      const error = err as AxiosError;
      const status = error.response?.status;
      if (status === 400) {
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
        setFailedMessage("Something went wrong. Please try again.");
        setFailed(true);
        console.error(`Unexpected error: ${status}`);
      }
    }
  };

  return (
<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
  <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#1D1D1D] rounded-lg shadow-xl p-5 w-full max-w-2xl mx-3 text-sm"
                style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
    <h1 className="text-xl font-semibold text-gray-800 mb-5 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
    Add Meeting
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left */}
          <div>
            <div>
              <label
                htmlFor="uyvuhvyuc"
                className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
                Meeting Name
              </label>
              <input
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                type="text"
                className="w-full border border-gray-300 dark:border-[#5C5C5C] rounded-lg px-3 py-2 text-[13px] font-light text-gray-800 dark:text-white dark:bg-[#2B2B2B] focus:ring-2 focus:ring-[#576CBC] outline-none"
                />
            </div>
            <div className="mt-4">              
              <label
                htmlFor="uyvuhvyuc"
                className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-gray-300 dark:border-[#5C5C5C] rounded-lg px-3 py-2 text-[13px] font-light text-gray-800 dark:text-white dark:bg-[#2B2B2B] focus:ring-2 focus:ring-[#576CBC] outline-none dark:[color-scheme:dark]"
                />
            </div>
            <div className="mt-4">              
              <label
                htmlFor="uyvuhvyuc"
                className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
              
                Add Students
              </label>
              <div className="relative flex items-center border border-gray-300 dark:border-[#5C5C5C] rounded-lg px-2 py-2 dark:bg-[#2B2B2B]">
              <div className="flex-1 px-2 text-[13px] text-gray-500 dark:text-gray-300 font-light">
              Select Students
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="text-[#576CBC] hover:text-blue-700 ml-2"
                >
                  <Plus size={18} />
                </button>
              </div>
              <Dialog
                open={open}
                onClose={() => setOpen(false)}
                className="relative z-50"
              >
                <div className="fixed inset-0 bg-black/50" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                <section className="bg-white dark:bg-[#1D1D1D] rounded-xl p-6 w-full max-w-md shadow-xl">
                <h2 className="text-base font-semibold mb-4 text-gray-800 dark:text-white">
                      Select Students
                    </h2>
                    <div className="flex gap-2 mb-4">
                      {tabs.map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-3 py-2 text-xs rounded-md transition ${
                            activeTab === tab
                              ? "bg-[#576CBC] text-white"
                              : "bg-gray-100 dark:bg-[#2B2B2B] text-gray-800 dark:text-white"
                            }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto text-sm pr-1">
                    {Teachers.filter((teacher) => {
                        if (activeTab === "All") return true;
                        return teacher.student.course === activeTab;
                      })
                        .reduce((unique: typeof Teachers, teacher) => {
                          const exists = unique.find(
                            (t) =>
                              t.student.studentId === teacher.student.studentId
                          );
                          if (!exists) unique.push(teacher);
                          return unique;
                        }, [])
                        .map((teacher) => (
                          <label
                            key={teacher.student.studentId}
                            className="flex items-center gap-2 px-1"
                            >
                            <input
                              type="checkbox"
                              checked={selectedTeachers.includes(teacher)}
                              onChange={() => toggleTeacher(teacher)}
                            />
                        <span className="dark:text-white text-gray-700">
                        {teacher.username}
                            </span>
                          </label>
                        ))}
                    </div>
                    <div className="flex justify-end mt-6 gap-3">
                    <button
                        onClick={() => setOpen(false)}
                        className="px-4 py-1.5 text-sm border border-gray-400 rounded-lg text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-[#2B2B2B]"
                        >
                        Cancel
                      </button>
                      <button
                        onClick={() => setOpen(false)}
                        className="px-4 py-1.5 text-sm bg-[#576CBC] text-white rounded-lg hover:bg-[#4459A9]"
                        >
                        Done
                      </button>
                    </div>
                  </section>
                </div>
              </Dialog>
            </div>
            {selectedTeachers.length > 0 && (
              <div className="mt-3">
                <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
                  Selected Students
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedTeachers.map((t) => (
                    <span
                      key={t._id}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] border border-gray-300 text-gray-700 dark:text-white dark:border-[#5C5C5C] dark:bg-[#2B2B2B]"
                    >
                      {t.username}
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedTeachers((prev) => prev.filter((p) => p._id !== t._id))
                        }
                        className="ml-1 text-gray-500 hover:text-red-600"
                        aria-label="Remove"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right */}
          <div>
            <div className="mb-3">
              <label
                htmlFor="uyvuhvyuc"
                className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
                      Date                 
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={minDateForMeeting}
                className="w-full border border-gray-300 dark:border-[#5C5C5C] rounded-lg px-3 py-2 text-[13px] font-light text-gray-800 dark:text-white dark:bg-[#2B2B2B] focus:ring-2 focus:ring-[#576CBC] outline-none dark:[color-scheme:dark]"
                />
            </div>
            <div className="mt-4">
              <label
                htmlFor="uyvuhvyuc"
               className="block text-sm mb-1 text-gray-600 dark:text-gray-300"
              >
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border border-gray-300 dark:border-[#5C5C5C] rounded-lg px-3 py-2 text-[13px] font-light text-gray-800 dark:text-white dark:bg-[#2B2B2B] focus:ring-2 focus:ring-[#576CBC] outline-none dark:[color-scheme:dark]"
                />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-5">
        <label
            htmlFor="uyvuhvyuc"
            className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 dark:border-[#5C5C5C] rounded-lg px-3 py-3 text-[13px] font-light text-gray-800 dark:text-white dark:bg-[#2B2B2B] focus:ring-2 focus:ring-[#576CBC] outline-none resize-none"
            placeholder="Write meeting details..."
          />
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4 flex justify-end gap-3">
        <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#576CBC] text-[#576CBC] rounded-lg hover:bg-[#E6E9F5] dark:hover:bg-[#2B2B2B]"
            >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#576CBC] text-white rounded-lg hover:bg-[#4459A9]"
            >
            Submit
          </button>
        </div>
      </form>

      {success && (
        <SuccessPopup
          onClose={() => {
            setSuccess(false);
            try {
              onSuccess?.();
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("meeting:created"));
              }
            } catch {}
            setMeetingTitle("");
            setSelectedDate("");
            setStartTime("");
            setEndTime("");
            setSelectedTeachers([]);
            setDescription("");
            onClose();
          }}
          title="Meeting"
        />
      )}
      {failed && (
        <FailedPopup onClose={() => setFailed(false)} title={failedMessage} />
      )}
    </div>
  );
}
