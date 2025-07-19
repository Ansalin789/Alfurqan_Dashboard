"use client";
import React, { useEffect, useState } from "react";

type Student = {
  id: string;
  name: string;
};

type Attendance = {
  id: string;
  name: string;
  present: boolean;
};

type AddMeetingProps = {
  onClose: () => void;
  onSubmit: (data: any) => void;
  students: Student[];
};

const AddMeeting = ({ onClose, onSubmit, students }: AddMeetingProps) => {
  const [formData, setFormData] = useState({
    meetingId: "",
    meetingTitle: "",
    scheduledDate: "",
    meetingDuration: "",
    timeFrom: "",
    timeTo: "",
    meetingMinutes: "",
    attendance: [] as Attendance[],
  });

  useEffect(() => {
    // Populate attendance with students when component mounts
    setFormData((prev) => ({
      ...prev,
      attendance: students.map((s) => ({ id: s.id, name: s.name, present: true })),
    }));
  }, [students]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleAttendance = (index: number) => {
    const updated = [...formData.attendance];
    updated[index].present = !updated[index].present;
    setFormData((prev) => ({
      ...prev,
      attendance: updated,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[95vh] overflow-y-auto w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 scrollbar-hide">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Meeting Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Meeting ID</label>
            <input
              type="text"
              name="meetingId"
              value={formData.meetingId}
              onChange={handleChange}
              placeholder="#123456789"
              className="w-full border rounded px-3 py-2 mt-1 text-sm dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Meeting Title</label>
            <input
              type="text"
              name="meetingTitle"
              value={formData.meetingTitle}
              onChange={handleChange}
              placeholder="Weekly Meeting"
              className="w-full border rounded px-3 py-2 mt-1 text-sm dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Scheduled Date</label>
            <select
              name="scheduledDate"
              value={formData.scheduledDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1 text-sm dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select</option>
              <option value="Arabic">Arabic</option>
              <option value="Maths">Maths</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Meeting Duration</label>
            <input
              type="date"
              name="meetingDuration"
              value={formData.meetingDuration}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1 text-sm dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Scheduled Time- From</label>
            <input
              type="text"
              name="timeFrom"
              value={formData.timeFrom}
              onChange={handleChange}
              placeholder="60 Minutes"
              className="w-full border rounded px-3 py-2 mt-1 text-sm dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Scheduled Time- To</label>
            <input
              type="text"
              name="timeTo"
              value={formData.timeTo}
              onChange={handleChange}
              placeholder="09.00 AM – 10.00 AM"
              className="w-full border rounded px-3 py-2 mt-1 text-sm dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-6">
          <table className="w-full border-collapse rounded overflow-hidden text-sm">
            <thead className="bg-[#576CBC] text-white">
              <tr>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Attendance</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800">
              {formData.attendance.map((student, index) => (
                <tr key={student.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2 text-gray-800 dark:text-white">{student.name}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => toggleAttendance(index)}>
                      {student.present ? (
                        <span className="text-green-500 font-bold">✔</span>
                      ) : (
                        <span className="text-red-500 font-bold">✖</span>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meeting Minutes</label>
          <textarea
            name="meetingMinutes"
            value={formData.meetingMinutes}
            onChange={handleChange}
            placeholder="Write your comment here..."
            className="w-full border rounded px-3 py-2 text-sm resize-none h-28 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-sm font-medium bg-[#576CBC] text-white rounded hover:bg-indigo-700"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Hide scrollbar globally inside modal */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AddMeeting;
