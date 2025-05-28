'use client';

import React, { FormEvent, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Plus } from 'lucide-react';
import SuccessPopup from "@/app/supervisor/components/successPopup";

type Props = {
    readonly onClose : () =>void;
};


export default function AddMeeting({onClose}:Props) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSucces(true);
  }
const tabs = ['Quran', 'Arabic', 'Islamic', 'All'];

const dummyTeachers = {
  Quran: ['Quran Teacher 1', 'Quran Teacher 2'],
  Arabic: ['Arabic Teacher 1', 'Arabic Teacher 2'],
  Islamic: ['Islamic Teacher 1'],
  All: ['Quran Teacher 1', 'Arabic Teacher 1', 'Islamic Teacher 1'],
};
const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<keyof typeof dummyTeachers>('Quran');
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
   const [success,setSucces]=useState(false);

  const toggleTeacher = (name: string) => {
    setSelectedTeachers((prev) =>
      prev.includes(name)
        ? prev.filter((t) => t !== name)
        : [...prev, name]
    );
  };
  const form = {
    meetingName: 'Weekly Sync',
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#1D1D1D] rounded-lg shadow-xl p-5 w-full max-w-2xl mx-3 text-sm"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <h1 className="text-lg font-normal  mt-2 text-gray-800 mb-3 dark:text-[#FFFFFF]">
          Add Meeting
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Section */}
          <div>
            {/* Meeting Name */}
            <div className="mb-3">
              <label htmlFor='rshghvgyv' className="block text-sm font-normal text-gray-600 mb-1 dark:text-[#FFFFFF]">
                Meeting Name
              </label>
              <input
                name="meetingName"
                value={form.meetingName}
                type="text"
                className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              />
            </div>

            {/* Start Time */}
            <div className="mb-3">
              <label htmlFor='rshghvgyv' className="block text-sm font-normal text-gray-600 mb-1 dark:text-[#FFFFFF]">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              />
            </div>

            {/* Add Teacher */}
            <div className="mb-4">
      {/* Label with + icon */}
      <label
        htmlFor="teacher-select"
        className=" text-sm font-normal text-gray-600 mb-1 dark:text-white flex items-center justify-between"
      >
        Add Teacher
      </label>
      <div className="relative flex items-center border rounded px-2 py-1 dark:bg-[#343434] dark:border-[#5C5C5C]">
         <div
    id="teacher-select"
    className="flex-1 appearance-none bg-transparent text-xs px-2 py-1.5 focus:outline-none dark:text-white"
  >
    Select Teacher
  </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-[#576CBC] hover:text-blue-700 ml-2"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Dropdown with selected teachers */}
      

      {/* Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
  <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
  <div className="fixed inset-0 flex items-center justify-center p-4">
    <section className="bg-white dark:bg-[#1D1D1D] rounded-lg p-5 w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Select Teachers
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-3 py-2 text-xs rounded ${
              activeTab === tab
                ? 'bg-[#576CBC] text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
            }`}
            onClick={() => setActiveTab(tab as 'Quran' | 'Arabic' | 'Islamic' | 'All')}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Teachers List */}
      <div className="space-y-2 max-h-40 overflow-y-auto text-sm">
        {dummyTeachers[activeTab].map((teacher) => (
          <label key={teacher} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedTeachers.includes(teacher)}
              onChange={() => toggleTeacher(teacher)}
            />
            <span className="dark:text-white">{teacher}</span>
          </label>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end mt-4 gap-2">
        <button
          onClick={() => setOpen(false)}
          className="px-3 py-1 border border-[#576CBC] text-[#576CBC] rounded dark:text-[#576CBC] dark:border-gray-600"
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
          </div>
          {/* Right Section */}
          <div>
            {/* Meeting Date */}
            <div className="mb-3">
              <label htmlFor='rshghvgyv' className="block text-sm font-normal text-gray-600 mb-1 dark:text-[#FFFFFF]">
                Meeting Date
              </label>
              <input
                type="date"
                name="meetingDate"
                className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              />
            </div>

            {/* End Time */}
            <div className="mb-3">
              <label htmlFor='rshghvgyv' className="block text-sm font-normal text-gray-600 mb-1 dark:text-[#FFFFFF]">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
              />
            </div>

            {/* Selected Teacher Dropdown */}
            <div className="mb-3">
              <label htmlFor='rshghvgyv' className="block text-sm font-normal text-gray-600 mb-1 dark:text-[#FFFFFF]">
                Selected Teacher
              </label>
              <select
             id="teacher-select"
             className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
                 >
                  <option value="">Show</option>
            {selectedTeachers.map((teacher) => (
            <option key={teacher} value={teacher}>
            {teacher}
            </option>
            ))}
      </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4 mt-2">
          <label htmlFor='rshghvgyv' className="block text-sm font-normal text-gray-600 mb-1 dark:text-[#FFFFFF]">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            className="w-full border rounded px-3 py-2 text-xs dark:text-white dark:bg-[#343434] dark:border-[#5C5C5C]"
            placeholder="Write meeting details..."
          />
        </div>

        {/* Buttons */}
       <div className="border-t pt-4 mt-4 flex justify-end gap-2">
      <button
        type="button"
        onClick={onClose}
        className="px-3 py-1 border border-[#576CBC] rounded text-[#576CBC] hover:bg-gray-100 transition "
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-3 py-1 bg-[#576CBC] text-white rounded hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </div>
      </form>
      {
    success && (
        <SuccessPopup 
        onClose={()=>setSucces(false)}  
        title = 'Meeting' />
    )
  }
    </div>
  );
}
