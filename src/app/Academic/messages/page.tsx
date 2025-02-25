"use client";

import React, { useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { FaTelegramPlane } from "react-icons/fa";
import BaseLayout1 from "@/components/BaseLayout1";

const Messages = () => {
  const [activeTab, setActiveTab] = useState("Private");

  const privateChats = [
    { name: "Samantha William", message: "Lorem ipsum...", time: "12:45 PM" },
    { name: "Tony Soap", message: "Lorem ipsum...", time: "12:45 PM" },
    { name: "Karen Hope", message: "Lorem ipsum...", time: "12:45 PM" },
    { name: "Johnny Ahmad", message: "Lorem ipsum...", time: "12:45 PM" },
    { name: "Nadila Adja", message: "Lorem ipsum...", time: "12:45 PM" },
    { name: "Adam Jones", message: "Lorem ipsum...", time: "12:45 PM" },
    { name: "Jijo", message: "Lorem ipsum...", time: "12:45 PM" },
    { name: "Nadila Adja", message: "Lorem ipsum...", time: "12:45 PM" },
    { name: "Nadila Adja", message: "Lorem ipsum...", time: "12:45 PM" },
  ];

  return (
    <BaseLayout1>
      <div className="mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 p-2">Messages</h1>

        <div className="flex p-4 h-[93vh]">
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
                    <h3 className="text-lg font-semibold text-[#374557]">
                      Allen border
                    </h3>
                    <p className="text-[12px] font-medium text-gray-500">
                      Teacher
                    </p>
                  </div>
                </div>

                {/* Contacts Section */}
                {/* <div className="mt-6">
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
                        </div> */}
              </div>

              {/* Chats Section */}
              <div>
                <div className="">
                  <h4 className="text-base font-medium text-[#fff] bg-[#223857] rounded-lg rounded-br-sm mb-6 justify-center align-middle w-20 text-center">
                    Chats
                  </h4>
                  {/* Tabs */}
                  <div className="flex mt-2 border-b justify-between px-4">
                    <button
                      className={`pb-2 px-4 text-[13px] font-semibold ${
                        activeTab === "Private"
                          ? "text-[#223857] border-b-2 border-[#223857] transition p-0.5"
                          : "text-gray-500"
                      }`}
                      onClick={() => setActiveTab("Private")}
                    >
                      Teachers
                    </button>
                  </div>
                  {/* Chat List */}
                  <ul className="mt-4 space-y-4 overflow-scroll h-96 scrollbar-none">
                    {privateChats.map((chat, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between border-b-2 p-1 cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-7 h-7 bg-gray-300 rounded-lg"></div>
                          <div>
                            <h5 className="font-semibold text-[10px] text-[#374557]">
                              {chat.name}
                            </h5>
                            <p className="text-[10px] text-[#A098AE]">
                              {chat.message}
                            </p>
                          </div>
                        </div>
                        {/* <div className="flex flex-col items-center space-y-1">
                                        <span className="text-[10px] text-gray-400">{chat.time}</span>
                                        {chat.notifications > 0 && (
                                            <span className="text-[8px] bg-[#223857] text-[#fff] font-bold w-3 h-3 flex items-center justify-center rounded-[4px]">
                                            {chat.notifications}
                                            </span>
                                        )}
                                    </div> */}
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
                    <p className="text-[12px] text-[#223857]">Online</p>
                  </div>
                </div>
                {/* Chat Messages */}
                <div className="mt-6 space-y-4">
                  {/* Received Message */}
                  <div className="flex flex-col items-start">
                    <div className="relative bg-gray-200 text-gray-800 p-2 rounded-t-lg rounded-br-lg">
                      <p className="text-[11px]">Hello Nella!</p>
                      {/* Tail */}
                      <div className="absolute top-[20px] left-[-5px] w-0 h-0 border-t-[13px] border-t-transparent border-b-[0px] border-b-transparent border-r-[10px] border-r-gray-200  shadow-inner"></div>
                    </div>
                    <div className="relative bg-gray-200 text-gray-800 p-2 rounded-t-lg rounded-br-lg mt-2">
                      <p className="text-[11px]">
                        Can you arrange schedule for next class?
                      </p>
                      {/* Tail */}
                      <div className="absolute top-[20px] left-[-5px] w-0 h-0 border-t-[12px] border-t-transparent border-b-[0px] border-b-transparent border-r-[10px] border-r-gray-200  shadow-inner"></div>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1">
                      12:45 PM
                    </span>
                  </div>

                  {/* Sent Message */}
                  <div className="flex flex-col items-end">
                    <div className="relative bg-[#223857] text-white p-2 rounded-t-lg rounded-bl-lg shadow">
                      <p className="text-[11px]">Hello Karen!</p>
                      <div className="absolute top-[17px] right-[-4px] w-0 h-0 border-t-[16px] border-t-transparent border-b-[0px] border-b-transparent border-l-[10px] border-l-[#223857]"></div>
                    </div>
                    <div className="relative bg-[#223857] text-white p-2 rounded-t-lg rounded-bl-lg mt-2 shadow">
                      <p className="text-[11px]">
                        Okay, I'll arrange it soon. I'll notify you when it's
                        done.
                      </p>
                      <div className="absolute top-[16px] right-[-4px] w-0 h-0 border-t-[16px] border-t-transparent border-b-[0px] border-b-transparent border-l-[10px] border-l-[#223857]"></div>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1">
                      12:45 PM
                    </span>
                  </div>
                </div>
              </div>

              {/* Input Section */}
              <div>
                <div className="flex items-center border border-gray-300 rounded-xl p-1 bg-white shadow-sm">
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
                  <button className="bg-[#223857] text-white px-3 py-[5px] rounded-lg flex items-center text-[12px] font-medium">
                    Send &nbsp;
                    <FaTelegramPlane />
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </BaseLayout1>
  );
};

export default Messages;
