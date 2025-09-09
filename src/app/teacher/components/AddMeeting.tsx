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
  studentId: string;
  name: string;
  studentDetails: {
    student: {
      studentId: string;
      studentFirstName: string;
      studentLastName: string;
      studentEmail: string;
      studentGender: string;
      studentPhone: number;
      studentCity: string;
      studentCountry: string;
      studentCountryCode: string;
      learningInterest: string;
      numberOfStudents: number;
      preferredTeacher: string;
      preferredFromTime: string;
      preferredToTime: string;
      timeZone: string;
      referralSource: string;
      preferredDate: string;
      evaluationStatus: string;
      status: string;
      createdDate: string;
      createdBy: string;
    };
    teacher: {
      teacherId: string;
      teacherName: string;
      teacherEmail: string;
    };
    subscription: {
      subscriptionName: string;
    };
    _id: string;
    academicCoachId: string;
    classType: string;
    classDay: string[];
    startTime: string;
    endTime: string;
    isLanguageLevel: boolean;
    languageLevel: string;
    isReadingLevel: boolean;
    readingLevel: string;
    isGrammarLevel: boolean;
    grammarLevel: string;
    hours: number;
    planTotalPrice: number;
    classStartDate: string;
    classEndDate: string;
    classStartTime: string;
    classEndTime: string;
    accomplishmentTime: string;
    studentRate: number;
    gardianName: string;
    gardianEmail: string;
    gardianPhone: string;
    gardianCity: string;
    gardianCountry: string;
    gardianTimeZone: string;
    gardianLanguage: string;
    assignedTeacher: string;
    studentStatus: string;
    classStatus: string;
    comments: string;
    trialClassStatus: string;
    invoiceStatus: string;
    paymentLink: string;
    paymentStatus: string;
    teacherStatus: string;
    status: string;
    createdDate: string;
    createdBy: string;
    updatedDate: string;
    updatedBy: string;
    expectedFinishingDate: number;
    assignedTeacherId: string;
    assignedTeacherEmail: string;
    __v: number;
  };
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
  const [selectedParticipants, setSelectedParticipants] = useState<
    Participants[]
  >([]);
  const [Participants, setParticipants] = useState<Participants[]>([]);

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
    if (!open) return; // ✅ Only run when modal is open

    const fetchTeachers = async () => {
      try {
        const teacherId = localStorage.getItem("TeacherPortalId") ?? "";
        const token = localStorage.getItem("TeacherAuthToken") ?? "";

        const params: Record<string, string> = {
          teacherId,
        };

        const response = await axios.get(
          "https://api.blackstoneinfomaticstech.com/classShedule/teacher/list",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params,
          }
        );

        const allParticipants = response.data ?? [];
        console.log("Applicants received:", allParticipants);

        const filteredParticipants =
          activeTab === "All"
            ? allParticipants
            : allParticipants.filter(
                (teacher: any) =>
                  teacher.studentDetails.student.learningInterest?.toLowerCase() ===
                  activeTab.toLowerCase()
              );

        setParticipants(filteredParticipants);
      } catch (error) {
        console.error("Error fetching teachers", error);
        setParticipants([]);
      }
    };

    fetchTeachers();
  }, [open, activeTab]);

  const toggleTeacher = (teacher: Participants) => {
    setSelectedParticipants((prev) => {
      const exists = prev.some((t) => t.studentId === teacher.studentId);
      return exists
        ? prev.filter((t) => t.studentId !== teacher.studentId)
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
      selectedParticipants.length === 0
    ) {
      alert("Please fill all required fields!");
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

    if (
  !meetingTitle ||
  !selectedDate ||
  !startTime ||
  !endTime ||
  selectedParticipants.length === 0
) {
  alert("Please fill all required fields!");
  return;
}



// ✅ Debug logs
console.log("Start Time:", startTime);
console.log("End Time:", endTime);
console.log("Selected Date:", selectedDate);


    const studentPayload = selectedParticipants.map((student) => ({
      studentId: student.studentId,
      studentName: student.name,
      studentEmail: student.studentDetails.student.studentEmail,
      _id: student.studentId,
      attendee: "absent",
    }));

    const requestData = {
      meetingId: "",
      meetingName: meetingTitle,
      selectedDate: formattedDate, // ✅ Changed from selectedDate
     startTime,
endTime,
      meetingStatus: "Scheduled",
      teacher: {
        teacherId: localStorage.getItem("TeacherPortalId"),
        teacherName: localStorage.getItem("TeacherPortalName"),
        teacherEmail: "gomathi.blackstone@gmail.com",
        teacherrRole: "Teacher",
      },
      participants: studentPayload,
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
        "https://api.blackstoneinfomaticstech.com/teacherMeeting", // ✅ NEW LOCAL API ENDPOINT
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Meeting created successfully:", response.data);

      if ([200, 201, 400].includes(response.status)) {
        setSuccess(true);
        setTimeout(() => {
          setMeetingTitle("");
          setSelectedDate("");
          setStartTime("");
          setEndTime("");
          setSelectedParticipants([]);
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
              className="absolute inset-y-0 right-0 flex items-center"
            >
              <Plus size={19} className="dark:text-[#fff] border border-[#858B94] rounded-sm -ml-7 p-[2px]"/>
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
                  {Participants.map((student) => (
                    <label
                      key={student.studentId}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedParticipants.includes(student)}
                        onChange={() => toggleTeacher(student)}
                      />
                      <span className="dark:text-white">{student.name}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <button
                    onClick={() => setOpen(false)}
                    className="px-3 py-1 border text-[#576CBC] rounded text-[12px] hover:bg-[#576bbc1a]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-1 bg-[#576CBC] text-white rounded text-[12px] hover:bg-[#576bbcaf]"
                  >
                    Done
                  </button>
                </div>
              </section>
            </div>
          </Dialog>
        </div>

        {/* Participants */}
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
              min={minDateForMeeting}
              className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C] dark:[color-scheme:dark]"
            />
          </div>

          <div className="mt-1">
            <label
              htmlFor="uyvuhvyuc"
              className="block text-sm text-gray-600 dark:text-white"
            >
              Selected Paticipants
            </label>
            <select className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]">
              <option value="">Show</option>
              {selectedParticipants.map((student: Participants) => (
                <option key={student.studentId} value={student.name}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
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
              className="w-full border rounded px-3 py-2 text-sm dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C] dark:[color-scheme:dark]"
            />
            <span className="text-gray-500 dark:text-white">-</span>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C] dark:[color-scheme:dark]"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
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
            className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-[#576CBC] border rounded hover:bg-[#576bbc1a] text-[12px]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-2 bg-[#576CBC] text-white rounded hover:bg-[#576bbcaf] text-[12px]"
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
