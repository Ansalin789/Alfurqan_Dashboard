
'use client'


import React, {useState} from 'react';
import { GrAttachment } from "react-icons/gr";
import { FaTelegramPlane } from "react-icons/fa";
import { PiPencilSimpleLineBold } from "react-icons/pi";
import { MdOutlineCancel } from "react-icons/md";
import { IoFilter } from "react-icons/io5";
import { BsFillPeopleFill } from "react-icons/bs";
import { RiAttachmentFill } from "react-icons/ri";
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
    <div className=''>
        <h1 className='text-[30px] font-semibold'>Messages</h1>
    
        <div className="flex p-6 h-[93vh]">
        
        {/* Main Content */}
        <main className="flex">
            {/* Left Panel */}
            <div className="w-[300px] bg-white p-6 ml-6 rounded-lg shadow-md">
                {/* Profile Section */}
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

                {/* Chats Section */}
                <div className="mt-6">
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
                        Private
                    </button>
                    <button
                        className={`pb-2 px-4 text-[13px] font-semibold ${
                        activeTab === "Group"
                            ? "text-[#4CBC9A] border-b-2 border-[#4CBC9A] transition p-0.5"
                            : "text-gray-500"
                        }`}
                        onClick={() => setActiveTab("Group")}
                    >
                        Group
                    </button>
                    </div>
                    {/* Chat List */}
                    <ul className="mt-4 space-y-4">
                    {(activeTab === "Private" ? privateChats : groupChats).map((chat, index) => (
                        <li key={index} className="flex items-center justify-between border-b-2 p-1">
                            <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                            <div>
                                <h5 className="font-semibold text-sm text-[#374557]">{chat.name}</h5>
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

            {/* Chat Panel */}
            <div className="w-[500px] bg-white p-4 rounded-lg shadow-md ml-6">
                {/* Header Section */}
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

                {/* Input Section */}
                <div className="mt-[214px] flex items-center border border-gray-300 rounded-xl p-2 bg-white shadow-sm">
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
        </main>

        {/* Right Panel */}
        <aside className="w-[230px] bg-white p-4 rounded-lg shadow-lg ml-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h4 className="text-xs font-semibold text-[#242424]">Group Info</h4>
                <div className="flex gap-2 p-4">
                    {/* Edit Icon */}
                    <button>
                        <PiPencilSimpleLineBold />
                    </button>
                    {/* Close Icon */}
                    <button>
                        <MdOutlineCancel />
                    </button>
                </div>
            </div>

            {/* Group Info */}
            <div className="mt-2 text-center border-b border-b-gray-400 p-4">
                <div className="rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <img src="/assets/images/people.png" alt="" />
                </div>
                <h5 className="mt-2 font-semibold text-[12px]">Student Coordination</h5>
                <p className="text-[10px] text-gray-500">Group &bull; 12 members</p>
            </div>

            {/* Description */}
            <div className="mt-3">
                <h6 className="font-medium text-[#8a8d8e] flex items-center gap-2 text-[12px]">
                <IoFilter />
                Description
                </h6>
                <p className="text-[8px] text-[#242424] mt-2">
                This is your go-to hub for seamless communication, collaboration, and coordination among our students. This is your go-to hub for seamless communication, collaboration, and coordination among our students. 
                </p>
            </div>

            {/* Members Section */}
            <div className="mt-3">
                <h6 className="font-medium text-[#8a8d8e] flex items-center gap-2 text-[12px] justify-between">
                <div className='flex text-[10px]'><BsFillPeopleFill className='mt-[2px]'/>&nbsp; Members</div>
                <button className="text-[10px]">View All</button>
                </h6>
                <ul className="mt-3 space-y-3">
                {["Samantha William", "Tony Soap", "Karen Hope"].map(
                    (member, index) => (
                    <li key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full shadow-lg"></div>
                        <div>
                        <p className="text-[11px] font-medium text-[#374557]">{member}</p>
                        <p className="text-[10px] text-gray-500">Student</p>
                        </div>
                    </li>
                    )
                )}
                </ul>
            </div>

            {/* Attachments Section */}
            <div className="mt-3">
                <h6 className="font-medium text-[12px] text-[#8A8D8E] flex items-center justify-between">
                <div className='flex'><RiAttachmentFill className='rounded-full mt-[2px]'/>Attachment</div>
                    <button className="text-[11px] text-[#8A8D8E]">View All</button>
                </h6>
                <div className="mt-2">
                {/* Tab Section */}
                <div className="flex border-b border-gray-200">
                    {/* Media Tab */}
                    <button className="flex-1 py-2 text-[12px] font-medium text-gray-700 bg-blue-100 rounded-t-lg focus:outline-none">
                    Media • 34
                    </button>
                    {/* Files Tab */}
                    <button className="flex-1 py-2 text-[12px] font-medium text-gray-500 hover:text-gray-700 focus:outline-none">
                    Files • 12
                    </button>
                </div>

                {/* Content Section */}
                <div className="flex mt-3 gap-3">
                    <div className="flex-1 bg-gray-200 rounded-lg h-16"></div>
                    <div className="flex-1 bg-gray-200 rounded-lg h-16"></div>
                    <div className="flex-1 bg-gray-200 rounded-lg h-16"></div>
                </div>
                </div>

            </div>
        </aside>

        </div>
    </div>
    </BaseLayout2>
  );
};

export default Message;
