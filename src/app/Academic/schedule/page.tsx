import React from 'react';
import BaseLayout1 from '@/components/BaseLayout1';
import ScheduleCalender from '@/components/Academic/ScheduleCalender';

export const metadata = {
  title: 'Schedule',
  description: 'Academic Schedule Page',
};

export default function SchedulePage() {
  return (
    <BaseLayout1>
      <div className="flex flex-col h-screen bg-gray-100">
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">December 2024</h1>
            {/* <div className="space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded">+ Add Meeting</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded">+ Add ToDoList</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded">+ Add Schedule</button>
            </div> */}
          </div>
          
          <div className="grid grid-cols-4 gap-6">
            {/* Calendar */}
            <div className="col-span-3">
              <ScheduleCalender />
            </div>
            
            {/* List Schedule */}
            <div className="col-span-1 bg-white p-6 rounded shadow">
              <h2 className="text-xl font-bold mb-4">List Schedule</h2>
              <ul className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <li key={i} className="border-b pb-4">
                    <h3 className="font-bold">Activity Name</h3>
                    <p className="text-gray-600">14 Feb 2023</p>
                    <p className="text-gray-600">10:00 AM</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce fermentum vehicula commodo. Quisque semper nibh et egestas.
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout1>
  );
}