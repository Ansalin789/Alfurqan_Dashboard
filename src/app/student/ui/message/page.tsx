'use client'


import React, {useState} from 'react';
import { GrAttachment } from "react-icons/gr";
import { FaTelegramPlane } from "react-icons/fa";
import BaseLayout2 from '@/components/BaseLayout2';



const Message = () => {

    const [activeTab, setActiveTab] = useState("Private"); // State to track active tab

    const privateChats = [
      { name: "Samantha William", message: "Lorem ipsum...", time: "12:45 PM", notifications: 2 },
      { name: "Tony Soap", message: "Lorem ipsum...", time: "12:45 PM", notifications: 2 },
      { name: "Karen Hope", message: "Lorem ipsum...", time: "12:45 PM", notifications: 1 },
      { name: "Johnny Ahmad", message: "Lorem ipsum...", time: "12:45 PM", notifications: 0 },
      { name: "Nadila Adja", message: "Lorem ipsum...", time: "12:45 PM", notifications: 4 },
    ];
  
    const groupChats = [
      { name: "Project Alpha", message: "Team meeting at 4 PM", time: "11:30 AM", notifications: 3 },
      { name: "Family Group", message: "Let's plan the weekend", time: "9:15 AM", notifications: 1 },
      { name: "Gym Buddies", message: "New workout schedule", time: "8:00 AM", notifications: 0 },
    ];
  return (
    <BaseLayout2>
    <div className='mx-auto'>
        <h1 className='text-2xl font-semibold text-gray-800 p-2'>Messages</h1>
    
        <div className="flex p-6 h-[93vh]">
        
            <main className="flex">
                <div className="w-[400px] bg-white p-6 ml-6 rounded-lg shadow-md flex flex-col justify-between">
                    {/* Profile Section */}
                    <div>
                        <div className="flex items-center space-x-4">
                            <img
                            src="/assets/images/account.png"
                            alt="Student"
                            className="w-14 h-14 rounded-lg border border-[#dbdbdb]"
                            />
                            <div>
                            <h3 className="text-lg font-semibold text-[#374557]">Allen border</h3>
                            <p className="text-sm text-gray-500">Student</p>
                            </div>
                        </div>

                        {/* Contacts Section */}
                        <div className="mt-6">
                            <div className="flex justify-between items-center">
                            <h4 className="text-base font-semibold text-[#374557]">Contacts</h4>
                            <span className="text-sm text-[#374557] cursor-pointer">View All</span>
                            </div>
                            <div className="grid grid-cols-5 gap-3 mt-4">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                    </div>

                    {/* Chats Section */}
                    <div>
                        <div className="">
                            <h4 className="text-base font-semibold text-[#374557]">Chats</h4>
                            {/* Tabs */}
                            <div className="flex mt-2 border-b justify-between px-4">
                            <button
                                className={`pb-2 px-4 text-[13px] font-semibold ${
                                activeTab === "Private"
                                    ? "text-[#4CBC9A] border-b-2 border-[#4CBC9A] transition p-0.5"
                                    : "text-gray-500"
                                }`}
                                onClick={() => setActiveTab("Private")}
                            >
                                Private chat
                            </button>
                            </div>
                            {/* Chat List */}
                            <ul className="mt-4 space-y-4">
                            {privateChats.map((chat, index) => (
                                <li key={index} className="flex items-center justify-between border-b-2 p-1">
                                    <div className="flex items-center space-x-3">
                                    <div className="w-7 h-7 bg-gray-300 rounded-lg"></div>
                                    <div>
                                        <h5 className="font-semibold text-[10px] text-[#374557]">{chat.name}</h5>
                                        <p className="text-[10px] text-[#A098AE]">{chat.message}</p>
                                    </div>
                                    </div>
                                    <div className="flex flex-col items-center space-y-1">
                                    <span className="text-[10px] text-gray-400">{chat.time}</span>
                                    {chat.notifications > 0 && (
                                        <span className="text-[8px] bg-[#4CBC9A] text-[#fff] font-bold w-3 h-3 flex items-center justify-center rounded-[4px]">
                                        {chat.notifications}
                                        </span>
                                    )}
                                    </div>
                                </li>
                            ))}

                            </ul>
                        </div>
                    </div>
                </div>  

                {/* Chat Panel */}
                <div className="w-[600px] bg-white p-4 rounded-lg shadow-md ml-6 flex flex-col justify-between">
                    {/* Header Section */}
                    <div>
                        <div className="flex items-center space-x-4 border-b border-b-[#dbdbdb] p-2">
                            <img
                            src="/assets/images/account1.png"
                            alt="Karen Hope"
                            className="w-14 h-14 rounded-full"
                            />
                            <div>
                            <h3 className="text-base font-semibold">Sai Hope</h3>
                            <p className="text-sm text-green-500">Online</p>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="mt-6 space-y-4">
                            {/* Received Message */}
                            <div className="flex flex-col items-start">
                                <div className="bg-gray-100 p-3 rounded-t-xl rounded-br-xl">
                                    <p className="text-[12px]">Hello Nella!</p>
                                </div>
                                <div className="bg-gray-100 p-3 rounded-t-xl rounded-br-xl mt-2">
                                    <p className="text-[12px]">Can you arrange schedule for next class?</p>
                                </div>
                            <span className="text-[10px] text-gray-400 mt-1">12:45 PM</span>
                            </div>

                            {/* Sent Message */}
                            <div className="flex flex-col items-end">
                                <div className="bg-[#4CBC9A] text-white p-3 rounded-t-xl rounded-bl-xl">
                                    <p className="text-[12px]">Hello Karen!</p>
                                </div>
                                <div className="bg-[#4CBC9A] text-white p-3 rounded-t-xl rounded-bl-xl mt-2">
                                    <p className="text-[12px]">
                                    Okay, I'll arrange it soon. I'll notify you when it's done.
                                    </p>
                                </div>
                            <span className="text-[10px] text-gray-400 mt-1">12:45 PM</span>
                            </div>
                        </div>
                    </div>

                    {/* Input Section */}
                    <div>
                        <div className="flex items-center border border-gray-300 rounded-xl p-2 bg-white shadow-sm">
                            {/* Input field */}
                            <input
                                type="text"
                                placeholder="Write your message..."
                                className="flex-1 pl-4 text-gray-500 text-sm outline-none bg-transparent"
                            />

                            {/* Attachment Icon */}
                            <button className="mx-3">
                            <GrAttachment />
                            </button>

                            {/* Send Button */}
                            <button className="bg-[#4CBC9A] text-white px-5 py-2 rounded-xl flex items-center text-sm font-medium">
                                Send
                                <FaTelegramPlane />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    </div>
    </BaseLayout2>
  );
};

export default Message;
