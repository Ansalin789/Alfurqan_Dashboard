"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Plus } from "lucide-react";
import axios, { AxiosError } from "axios";
import SuccessPopup from "@/app/supervisor/components/successPopup";
import FailedPopup from "@/app/supervisor/components/failedPopup";

type Props = {
  readonly onClose: () => void;
};

interface Participants {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  attendee: string;
}

const tabs = ["All", "Quran", "Arabic", "Islamic"] as const;
type Tab = (typeof tabs)[number];

export default function AddMeeting({ onClose }: Props) {
  const [meetingTitle, setMeetingTitle] = useState("Weekly Sync");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [failedMessage, setFailedMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("All");
const [selectedTeachers, setSelectedTeachers] = useState<Participants[]>([]);
const [Teachers, setTeachers] = useState<Participants[]>([]);



useEffect(() => {
  if (!open) return; // ✅ Only run when modal is open

  const fetchTeachers = async () => {
    try {
      const teacherId = localStorage.getItem("TeacherPortalId") ?? "";
      const token = localStorage.getItem("TeacherAuthToken") ?? "";

      const params: Record<string, string> = {
        teacherId,
      };

      const response = await axios.get(
        "http://localhost:5001/classShedule/teacher/list",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params,
        }
      );

      const allTeachers = response.data.teachers ?? [];
      console.log("Teachers received:", allTeachers);

      const filteredTeachers =
        activeTab === "All"
          ? allTeachers
          : allTeachers.filter(
              (teacher: any) =>
                teacher.studentDetails?.learningInterest?.toLowerCase() ===
                activeTab.toLowerCase()
            );

      setTeachers(filteredTeachers);
    } catch (error) {
      console.error("Error fetching teachers", error);
      setTeachers([]);
    }
  };

  fetchTeachers();
}, [open, activeTab]); // ✅ make sure `open` is also in the dependency




const toggleTeacher = (teacher: Participants) => {
  setSelectedTeachers((prev) => {
    const exists = prev.some((t) => t.teacherId === teacher.teacherId);
    return exists
      ? prev.filter((t) => t.teacherId !== teacher.teacherId)
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

    const formattedDate = new Date(selectedDate).toISOString();
    const createdDate = new Date().toISOString();

    const teacherPayload = selectedTeachers.map((teacher) => ({
      teacherId: teacher.teacherId,
      teacherName: teacher.teacherName,
      teacherEmail: teacher.teacherEmail,
      _id: teacher.teacherId,
      attendee: "absent",
    }));

    const requestData = {
      meetingId: "",
      meetingName: meetingTitle,
      selectedDate: formattedDate,
      startTime,
      endTime,
      meetingStatus: "Scheduled",
      teacher: {
        teacher: localStorage.getItem("TeacherPortalId"),
       teacherName: localStorage.getItem("TeacherPortalName"),
        teacherEmail: localStorage.getItem("TeacherPortalEmail"),
        teacherrRole: "Teacher",
      },
      participants: teacherPayload,
      meetingminutes: " ",
      description,
      status: "Active",
      createdDate,
      createdBy: localStorage.getItem("TeacherPortalName"),
    };

    try {
      const token = localStorage.getItem("TeacherAuthToken");
      if (!token) {
        throw new Error("TeacherAuthToken not found");
      }

      const response = await axios.post(
        "http://localhost:5001/teacherMeeting", // ✅ NEW LOCAL API ENDPOINT
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
          setMeetingTitle("");
          setSelectedDate("");
          setStartTime("");
          setEndTime("");
          setSelectedTeachers([]);
          setDescription("");
        }, 2000);
      }
    } catch (err) {
      const error = err as AxiosError;
      const status = error.response?.status;

      if (status === 400) {
        setFailedMessage("Please check the form inputs.");
      } else if (status === 401) {
        setFailedMessage("Please login again.");
      } else if (status === 403) {
        setFailedMessage("You don't have permission to perform this action.");
      } else if (status === 500) {
        setFailedMessage("Server error");
      } else {
        setFailedMessage("An unexpected error occurred.");
      }

      setFailed(true);
      console.error(`Error (${status}):`, error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#1D1D1D] rounded-lg shadow-xl p-5 w-full max-w-xl mx-3 text-sm"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <h1 className="text-base font-bold text-gray-900 dark:text-white mb-4">
          Add Meeting
        </h1>

        {/* Meeting Name */}
        <div className="mb-4">
          <label
            htmlFor="meetingname"
            className="block text-sm text-gray-600 dark:text-white mb-1"
          >
            Meeting Name
          </label>
          <input
            type="text"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            placeholder="Weekly Meeting"
            className="w-full border rounded px-3 py-2 text-sm dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
          />
        </div>

        {/* Add Participants */}
        <div className="mb-4">
          <label
            htmlFor="add participants"
            className="block text-sm text-gray-600 dark:text-white mb-1"
          >
            Add Participants
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Show all name"
              readOnly
              className="w-full border rounded px-3 py-2 text-sm pr-10 dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
            />
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#576CBC]"
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
              <section className="bg-white dark:bg-[#1D1D1D] rounded-lg p-5 w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                  Select Participants
                </h2>
                <div className="flex gap-2 mb-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-2 text-xs rounded ${
                        activeTab === tab
                          ? "bg-[#576CBC] text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto text-sm">
                  {Teachers.map((teacher) => (
                    <label
                      key={teacher.teacherId}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTeachers.includes(teacher)}
                        onChange={() => toggleTeacher(teacher)}
                      />
                      <span className="dark:text-white">
                        {teacher.teacherName}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <button
                    onClick={() => setOpen(false)}
                    className="px-3 py-1 border text-[#576CBC] rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-1 bg-[#576CBC] text-white rounded"
                  >
                    Done
                  </button>
                </div>
              </section>
            </div>
          </Dialog>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="meetingdate"
              className="block text-sm text-gray-600 dark:text-white mb-1"
            >
              Meeting Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
            />
          </div>
          <div>
            <label
              htmlFor="meetingtime"
              className="block text-sm text-gray-600 dark:text-white mb-1"
            >
              Meeting Time
            </label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              />
              <span className="text-gray-500 dark:text-white">-</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-sm text-gray-600 dark:text-white mb-1"
          >
            Add Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Write a description here..."
            className="w-full border rounded px-3 py-2 text-sm dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[#576CBC] border border-[#576CBC] rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#576CBC] text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>

        {/* Success & Error Messages */}
        {success && (
          <SuccessPopup onClose={() => setSuccess(false)} title="Meeting" />
        )}
        {failed && (
          <FailedPopup onClose={() => setFailed(false)} title={failedMessage} />
        )}
      </form>
    </div>
  );
}
