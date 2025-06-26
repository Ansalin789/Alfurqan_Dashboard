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

interface Teacher {
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
  const [selectedTeachers, setSelectedTeachers] = useState<Teacher[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teacherId = localStorage.getItem("TeacherPortalId") ?? "";
        const token = localStorage.getItem("TeacherAuthToken") ?? "";

        const params: Record<string, string> = {
          teacherId,
        };

        if (activeTab !== "All") {
          params.teacherGroup = `${activeTab} Teacher`;
        }

        const response = await axios.get(
          "https://api.blackstoneinfomaticstech.com/teacher",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params,
          }
        );

        setTeachers(response.data.teachers ?? []);
      } catch (error) {
        console.error("Error fetching teachers", error);
        setTeachers([]);
      }
    };

    fetchTeachers();
  }, [activeTab]);

  const toggleTeacher = (teacher: Teacher) => {
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
      supervisor: {
        supervisorId: localStorage.getItem("SupervisorPortalId"),
        supervisorName: localStorage.getItem("SupervisorPortalName"),
        supervisorEmail: "arthi.blackstoneinfomatics@gmail.com",
        supervisorRole: "SUPERVISOR",
      },
      teacher: teacherPayload,
      meetingminutes: " ",
      description,
      status: "Active",
      createdDate,
      createdBy: localStorage.getItem("SupervisorPortalName"),
    };

    try {
      const token = localStorage.getItem("SupervisorAuthToken");
      if (!token) {
        throw new Error("SupervisorAuthToken not found");
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
          className="block text-sm text-gray-600 dark:text-white mb-1">
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
          className="block text-sm text-gray-600 dark:text-white mb-1">
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
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
            htmlFor="meetingdate"
            className="block text-sm text-gray-600 dark:text-white mb-1">
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
            className="block text-sm text-gray-600 dark:text-white mb-1">
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
          className="block text-sm text-gray-600 dark:text-white mb-1">
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
