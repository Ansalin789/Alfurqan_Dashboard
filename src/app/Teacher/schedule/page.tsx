import React from 'react'
import Image from 'next/image';
import { FiMoreVertical } from 'react-icons/fi';
import BaseLayout from '@/components/BaseLayout';

export default function Schedule() {

    const scheduleData = [
        { date: 'Jan 5th, 2024', name: 'Sagar', time: '07:00 - 10:00 PM' },
        { date: 'Jan 5th, 2024', name: 'Sagar', time: '07:00 - 10:00 PM' },
        { date: 'Jan 5th, 2024', name: 'Sagar', time: '07:00 - 10:00 PM' },
        { date: 'Jan 5th, 2024', name: 'Sagar', time: '07:00 - 10:00 PM' },
        { date: 'Jan 5th, 2024', name: 'Meeting', time: '07:00 - 10:00 PM' }
      ];

  return (
    <><BaseLayout>
        <div className="flex h-screen bg-gray-200">

        {/* Main Content */}
        <div className="flex-1 p-6">
            <header className="mb-8">
            <h1 className="text-3xl font-semibold">Class Schedule</h1>
            </header>

            <main className="grid grid-cols-4 gap-4">
            {/* Calendar Section */}
            <section className="col-span-3 bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-semibold">January, 2022</h2>
                </div>
                <button className="bg-green-500 text-white px-4 py-2 rounded">+ New Schedule</button>
                </div>
                <div className="grid grid-cols-7 gap-2">
                {/* Render days of the week */}
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <div key={day} className="text-center font-medium text-gray-600">{day}</div>
                ))}
                {/* Render the days in the calendar */}
                {/* This is a placeholder, you'll need to dynamically generate the dates based on the month */}
                {Array.from({ length: 31 }, (_, i) => (
                    <div key={i} className="bg-gray-100 h-20 p-2 rounded-lg relative">
                    <span className="absolute top-2 left-2 text-gray-500">{i + 1}</span>
                    <div className="absolute bottom-2 right-2 text-gray-400">
                        <FiMoreVertical />
                    </div>
                    </div>
                ))}
                </div>
            </section>

            {/* Schedule Section */}
            <aside className="col-span-1 space-y-8">
                {/* Today's Schedules */}
                <section className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Today's Schedules</h3>
                <div className="space-y-2">
                    {scheduleData.map((item, index) => (
                    <div key={index} className="bg-gray-100 p-2 rounded-lg flex justify-between items-center">
                        <div>
                        <p className="font-medium">{item.date}</p>
                        <p>{item.name}</p>
                        <p className="text-gray-500 text-sm">{item.time}</p>
                        </div>
                        <div className="text-gray-400">
                        <FiMoreVertical />
                        </div>
                    </div>
                    ))}
                </div>
                </section>

                {/* Today's Todo Task */}
                <section className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">Today's Todo Task</h3>
                <div className="bg-gray-100 p-2 rounded-lg flex justify-between items-center">
                    <div>
                    <p className="font-medium">Jan 5th, 2024</p>
                    <p>Meeting</p>
                    <p className="text-gray-500 text-sm">07:00 - 10:00 PM</p>
                    </div>
                    <div className="text-gray-400">
                    <FiMoreVertical />
                    </div>
                </div>
                </section>
            </aside>
            </main>
        </div>
        </div>
    </BaseLayout>
    </>
  )
}
