'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import BaseLayout from '@/components/BaseLayout';
import Image from 'next/image';

export default function Home() {

    const events = [
        {
            title: "Web Design",
            start: new Date(2021, 0, 5, 9, 0),
            end: new Date(2021, 0, 5, 10, 0),
        },
        {
            title: "Interaction Design",
            start: new Date(2021, 0, 17, 9, 0),
            end: new Date(2021, 0, 17, 10, 0),
        },
    ];

    return (
        <div>
            <BaseLayout>
                <div className="flex flex-col lg:flex-row p-4 w-full">
                    {/* Main Content */}
                    <div className="flex-1 overflow-y-scroll scrollbar-hide h-[93vh] pr-4">
                        {/* Top Bar */}
                        <div className="flex justify-between items-center mb-6">
                            <input
                                type="text"
                                placeholder="Search here..."
                                className="p-2 rounded-3xl border w-full max-w-md"
                            />
                        </div>

                        {/* Your Next Class */}
                        <div className="bg-[#E63C48] p-6 rounded-3xl mb-6 flex justify-between items-center">
                            <div className="text-white text-center ml-80">
                                <h2 className="text-lg font-semibold">Your Next Class</h2>
                                <p className="text-xl">Monday - 06.05.2024</p>
                                <div className="flex items-center justify-center mt-2">
                                    <span className="mr-2">🕒</span>
                                    <p>Abi</p>
                                    <span className="mx-2">•</span>
                                    <p>9:00 AM - 10:30 AM</p>
                                </div>
                            </div>
                            <div className="bg-white p-2 rounded-3xl shadow-md">
                                <p className="text-3xl font-bold">20:12:19</p>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-[#F6F6BD] p-4 rounded-3xl text-center">
                                <div className="flex justify-center">
                                    <Image src="/assets/images/finalstd.gif" alt="Total Students" width={100} height={100} />
                                </div>
                                <p className="text-xl text-[#374557] font-bold">Total Students</p>
                                <div className="flex justify-center m-5">
                                    <h3 className="text-[16px] text-[#374557] font-semibold mr-7">12,345</h3>
                                    <p className="text-green-600">5.4% <span className="text-[#A098AE]">than last year</span></p>
                                </div>
                            </div>

                            <div className="bg-[#D0F4DE] p-4 rounded-3xl text-center">
                                <div className="flex justify-center">
                                    <Image src="/assets/images/finalclass.gif" alt="Classes" width={100} height={100} />
                                </div>
                                <p className="text-xl text-[#374557] font-bold">Classes</p>
                                <div className="flex justify-center m-5">
                                    <h3 className="text-[16px] text-[#374557] font-semibold mr-7">100</h3>
                                    <p className="text-green-600">15% <span className="text-[#A098AE]">than last month</span></p>
                                </div>
                            </div>

                            <div className="bg-[#A9DEF9] p-4 rounded-3xl text-center">
                                <div className="flex justify-center">
                                    <Image src="/assets/images/finalearnings.gif" alt="Earnings" width={130} height={130} />
                                </div>
                                <p className="text-xl text-[#374557] font-bold">Earnings</p>
                                <div className="flex justify-center m-5">
                                    <h3 className="text-[16px] text-[#374557] font-semibold mr-7">$45,741</h3>
                                    <p className="text-green-600">15% <span className="text-[#A098AE]">than last month</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Analytics and Class Analytics */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-3xl lg:col-span-2">
                                <h3 className="mb-2 font-semibold">Earning Analytics</h3>
                                <div className="h-40 bg-gray-200 rounded-3xl"></div>
                            </div>
                            <div className="bg-white p-4 rounded-3xl">
                                <h3 className="mb-2 font-semibold">Class Analytics</h3>
                                <div className="h-40 bg-gray-200 rounded-3xl"></div>
                            </div>
                        </div>

                        {/* Today's Meeting and To do List */}
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-3xl">
                                <h3 className="mb-2 font-semibold">Today&apos;s Meeting</h3>
                                <div className="flex justify-between items-center mb-4">
                                    <p>Briefing UI Project</p>
                                    <div className="flex items-center">
                                        <p className="text-sm text-gray-500 mr-4">10:30 AM - 11:30 AM</p>
                                        <button className="p-2 bg-orange-500 text-white rounded-3xl">Join</button>
                                        <button className="ml-4 p-2 bg-gray-200 text-gray-800 rounded-3xl">Reschedule</button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <p>Another Meeting</p>
                                    <div className="flex items-center">
                                        <p className="text-sm text-gray-500 mr-4">1:00 PM - 2:00 PM</p>
                                        <button className="p-2 bg-orange-500 text-white rounded-3xl">Join</button>
                                        <button className="ml-4 p-2 bg-gray-200 text-gray-800 rounded-3xl">Reschedule</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Card and Calendar */}
                    <div className="w-full lg:w-[300px] mt-6 lg:mt-0 bg-[#1c3557] p-6 rounded-[20px] h-[600px]">
                        <div className="bg-white p-1 rounded-lg flex items-center mb-4">
                            <Image
                                src="https://via.placeholder.com/40"
                                alt="Profile"
                                width={20}
                                height={20}
                                className="rounded-full w-6 h-6 mr-4"
                            />
                            <div>
                                <p className="text-lg font-semibold">Siddhesh</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-3xl mb-4">
                            <h3 className="mb-2 font-semibold">Calendar</h3>
                            <FullCalendar
                                plugins={[dayGridPlugin]}
                                initialView="dayGridMonth"
                                events={events}
                                
                            />
                        </div>

                        {/* To do List */}
                        <div className="bg-white p-4 rounded-3xl">
                            <h3 className="mb-2 font-semibold">To do List</h3>
                            <div className="mb-2">
                                <p>Web Design</p>
                                <p className="text-sm text-gray-500">January 5, 2021 • 9:00 - 10:00 AM</p>
                            </div>
                            <div className="mb-2">
                                <p>Interaction Design</p>
                                <p className="text-sm text-gray-500">January 17, 2021 • 9:00 - 10:00 AM</p>
                            </div>
                            <div className="mb-2">
                                <p>Web Development</p>
                                <p className="text-sm text-gray-500">January 20, 2021 • 9:00 - 10:00 AM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </BaseLayout>
        </div>
    );
}
