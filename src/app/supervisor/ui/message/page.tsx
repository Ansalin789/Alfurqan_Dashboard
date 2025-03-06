'use client';

import BaseLayout3 from '@/components/BaseLayout3';
import React, { useState, useEffect } from 'react';
import { GrAttachment } from "react-icons/gr";
import { FaTelegramPlane } from "react-icons/fa";
import axios from 'axios';

const Message = () => {
   
    interface ApiResponse {
        candidateFirstName: string;
        candidateLastName: string;
        applicationDate: string; // ISO date string
        candidateEmail: string;
        candidatePhoneNumber: number;
        candidateCountry: string;
        candidateCity: string;
        positionApplied: string;
        currency: string;
        expectedSalary: number;
        preferedWorkingHours: string;
        uploadResume: {
            type: string;
            data: number[]; // Array of byte values representing the resume
        };
        comments: string;
        applicationStatus: string;
        professionalExperience: string;
        skills: string;
        status: string;
        createdDate: string; // ISO date string
        createdBy: string;
        _id: string;
        __v: number;
    }
    
    interface IMessage {
        _id: string;
        roomId: string;
        teacher: {
          teacherId: string;
          teacherName: string;
          teacherEmail: string;
        };
        supervisor: {
          supervisorId: string;
          supervisorFirstName: string;
          supervisorLastName: string;
          supervisorEmail: string;
          supervisorPhone: number;
          createdBy: string;
        };
        message: string;
        attachmentsType: {
          fileName?: string;
          fileType?: string;
          fileUrl?: string;
        }[];
        sender: string;
        receiver: string;
        group: {
          groupId: string;
          groupName: string;
          members: {
            userId: string;
            userName: string;
          }[];
        }[];
        status: string;
        createdBy: string;
        updatedBy: string;
        timeZone: string;
        createdDate: string; // Date as string
        updatedDate: string;
      }
      
      

      const [uniqueTeachers, setUniqueTeachers] = useState<ApiResponse[]>([]);  // Use Teacher instead of Student
      const [teacherPortalName, setTeacherPortalName] = useState<string | null>(null);
      const [selectedTeacher, setSelectedTeacher] = useState<ApiResponse | null>(null);  // Store selected teacher
      const [messages, setMessages] = useState<IMessage[]>([]);
      const [messageText, setMessageText] = useState<string>("");
      
      useEffect(() => {
        const teacherPortal = localStorage.getItem('SupervisorPortalName');
        setTeacherPortalName(teacherPortal);
        console.log(teacherPortalName);
    
        const fetchData = async () => {
            try {
                
                const response = await axios.get("https://alfurqanacademy.tech/applicants");
                console.log("Full API Response:", response.data);

    
                // Ensure we are working with the correct array of applicants
                let applicants = [];
                if (Array.isArray(response.data)) {
                    applicants = response.data;
                } else if (Array.isArray(response.data.applicants)) { // ✅ Correct key
                    applicants = response.data.applicants;
                }
                
                // Check if applicants is an array before filtering
                if (!Array.isArray(applicants)) {
                    console.error("Expected an array but received:", applicants);
                    return;
                }
    
                // Filter applicants by applicationStatus 'APPROVED'
                const filteredData = applicants.filter((item) => item.applicationStatus === "APPROVED");
    
                // Remove duplicates based on `_id`
                const uniqueRecords = new Map();
                filteredData.forEach((item) => {
                    if (!uniqueRecords.has(item._id)) {
                        uniqueRecords.set(item._id, item);
                    }
                });
    
                const uniqueApprovedApplicants = Array.from(uniqueRecords.values());
    
                console.log("Filtered Unique Approved Applicants:", uniqueApprovedApplicants);
                setUniqueTeachers(uniqueApprovedApplicants);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    }, []);
    
    
      

    // Function to load messages when a student is selected
    const loadMessages = async (candidate: string) => {
        console.log(candidate);
        try {
            const teacherIdToFilter = localStorage.getItem('SupervisorPortalId');
            console.log(teacherIdToFilter);
    
            // Fetch messages from backend (Mock API or Database)
            const response = await axios.get(`https://alfurqanacademy.tech/message/supervisormessage`, {
                params: {
                    supervisorId: teacherIdToFilter,
                    teacherId: candidate,
                },
            });
            
            console.log('Response Data:', response.data);  // Check the full API response
    
            // Check if Message array is populated
            if (response.data.Message && response.data.Message.length > 0) {
                console.log('Messages:', response.data.Message); // Log to check if messages are loaded
                setMessages(response.data.Message);
            } else {
                console.log('No messages found');
            }
    
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    // Function to handle student click
    const handleCandidateClick = (candidate: ApiResponse) => {
        console.log('Selected candidate:', candidate); 
        setSelectedTeacher(candidate); // Keep using setSelectedTeacher but set the candidate data
        loadMessages(candidate._id); // Load messages for the selected candidate
    };
    const handleSendMessage = async () => {
        if (!selectedTeacher || !messageText.trim()) return;
    
        try {
            
            const response = await fetch("https://alfurqanacademy.tech/supervisormessage", {
                method: "POST",
                headers: { "Content-Type": "application/json" ,
                   
                },
                body: JSON.stringify({
                    teacher: {  // Still keeping the name 'teacher', but using candidate info
                        teacherId: selectedTeacher._id, // Using candidate's unique ID (as teacherId)
                        teacherName: `${selectedTeacher.candidateFirstName} ${selectedTeacher.candidateLastName}`,
                        teacherEmail: selectedTeacher.candidateEmail
                    },
                    supervisor: {
                        supervisorId: localStorage.getItem("SupervisorPortalId"),
                        supervisorFirstName: teacherPortalName,
                        supervisorLastName: teacherPortalName,
                        supervisorEmail: "johndoe@example.com",
                        supervisorPhone: 9876543210,
                         createdBy: "system"
                    },
                    attachmentsType: [
                        {
                            fileName: "document.pdf",
                            fileType: "application/pdf",
                            fileUrl: "https://example.com/document.pdf"
                        },
                        {
                            fileName: "image.png",
                            fileType: "image/png",
                            fileUrl: "https://example.com/image.png"
                        }
                    ],
                    group: [
                        {
                            groupId: "G123",
                            groupName: "Arabic Group",
                            members: [
                                { userId: "U001", userName: "Alice" },
                                { userId: "U002", userName: "Bob" }
                            ]
                        },
                        {
                            groupId: "G124",
                            groupName: "Quran Study Group",
                            members: [
                                { userId: "U003", userName: "Charlie" },
                                { userId: "U004", userName: "David" }
                            ]
                        }
                    ],
                    message: messageText,
                    sender: "supervisor",
                    receiver: "teacher",
                    status: "sent",
                    createdBy: "system",
                    timeZone: "UTC+5:30"
                }),
            });
    
            const data = await response.json();
        if (response.ok) {
            const newMessage: IMessage = {
                _id: data._id || Math.random().toString(), // API response ID or fallback
                roomId: data.roomId || "", // Ensure roomId is set
                teacher: data.teacher || selectedTeacher,
                supervisor: data. supervisor || {
                    supervisorId: localStorage.getItem("SupervisorPortalId") ?? '',
                        supervisorFirstName: teacherPortalName,
                        supervisorLastName: teacherPortalName,
                        supervisorEmail: "johndoe@example.com",
                },
                message: messageText,
                attachmentsType: data.attachmentsType || [],
                sender: "supervisor",
                receiver: "teacher",
                group: data.group || [],
                status: "sent",
                timeZone: "UTC+5:30",
                createdDate: new Date().toISOString(), // Add timestamp
                createdBy: "system",
                updatedDate: new Date().toISOString(),
                updatedBy: "system",
            };

            setMessages((prevMessages: IMessage[]) => [...prevMessages, newMessage]);
            setMessageText(""); // Clear input field
        }else {
                console.error("Failed to send message");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <BaseLayout3>
            <div className='mx-auto'>
                <h1 className='text-[30px] font-semibold mb-5'>Messages</h1>
                <div className="flex p-4 h-[80vh]">
                <main className="flex">
                    {/* Left Panel - Student List */}
                    <div className="w-[400px] bg-white p-6 ml-6 rounded-lg shadow-md flex flex-col">
                        <div className="flex items-center space-x-4">
                            <img
                                src="/assets/images/account.png"
                                alt="Teacher"
                                className="w-14 h-14 rounded-lg border border-[#dbdbdb]"
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-[#374557]">{teacherPortalName}</h3>
                                <p className="text-sm text-gray-500">Supervisor</p>
                            </div>
                        </div>

                        {/* Chat List */}
                        <div className="mt-6">
                            <h2 className="text-[19px] font-semibold text-[#06030c]">Private</h2>
                            <div className="mt-4 max-h-[300px] overflow-y-auto">
                                <ul className="space-y-4">
                                    {uniqueTeachers.map((student) => (
                                        <button 
                                            key={student._id} 
                                            className={`flex items-center justify-between border-b-2 p-1 cursor-pointer ${
                                                selectedTeacher?._id === student._id ? 'bg-gray-200' : ''
                                            }`} 
                                            onClick={() => handleCandidateClick(student)}
                                        >
                                            <div className="flex space-x-3">
                                                <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                                                <div>
                                                    <h5 className="font-semibold text-sm text-[#374557]">
                                                        {student.candidateFirstName} 
                                                    </h5>
                                                    <p className="text-[10px] text-[#A098AE]">{student.candidateEmail}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Chat Panel */}
                    <div className="w-[600px] bg-white p-4 rounded-lg shadow-md ml-6 flex flex-col justify-between">
                        {selectedTeacher ? (
                            <>
                                <div>
                                    <div className="flex items-center space-x-4 border-b border-b-[#dbdbdb] p-2">
                                        <img
                                            src="/assets/images/account1.png"
                                            alt={selectedTeacher.candidateFirstName}
                                            className="w-14 h-14 rounded-full"
                                        />
                                        <div>
                                            <h3 className="text-base font-semibold">
                                                {selectedTeacher.candidateFirstName} 
                                            </h3>
                                            <p className="text-sm text-green-500">Online</p>
                                        </div>
                                    </div>

                                    {/* Chat Messages */}
                                    <div className="mt-6 space-y-4 overflow-y-auto max-h-[49vh]">
                                    {messages.map((msg, index) => (
                                 <div key={msg._id || index} className={`flex flex-col ${msg.sender === 'supervisor' ? 'items-end' : 'items-start'}`}>
                               <div className={`${msg.sender === 'supervisor' ? 'bg-[#4CBC9A] text-white' : 'bg-gray-100'} p-3 rounded-t-xl ${msg.sender === 'supervisor' ? 'rounded-bl-xl' : 'rounded-br-xl'}`}>
                                    <p className="text-[12px]">{msg.message}</p>
                             <p className="text-[10px] text-gray-500">{new Date(msg.createdDate).toLocaleString()}</p>
                                  </div>
                             </div>
                                 ))}

                                    </div>
                                </div>

                                {/* Input Section */}
                                <div>
                                    <div className="flex items-center border border-gray-300 rounded-xl p-1 bg-white shadow-sm">
                                    <input
                                 type="text"
                          placeholder="Write your message..."
                              className="flex-1 pl-4 text-gray-500 text-[11px] outline-none bg-transparent"
                            value={messageText}
                              onChange={(e) => setMessageText(e.target.value)}
                                    />
                                        <button className="mx-3 text-[11px]"><GrAttachment /></button>
                                        <button onClick={handleSendMessage} className="bg-[#4CBC9A] text-white px-2 py-1 rounded-lg flex items-center text-[12px] font-medium">
                                            Send&nbsp;<FaTelegramPlane />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="text-center text-gray-500">Select a student to start chatting.</p>
                        )}
                    </div>
                </main>
            </div>
            </div>
        </BaseLayout3>
    );
};

export default Message;
