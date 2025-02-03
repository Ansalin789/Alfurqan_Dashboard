'use client';

import BaseLayout from '@/components/BaseLayout';
import React, { useState, useEffect } from 'react';
import { GrAttachment } from "react-icons/gr";
import { FaTelegramPlane } from "react-icons/fa";
import axios from 'axios';

const Message = () => {
    interface Student {
        studentId: string;
        studentFirstName: string;
        studentLastName: string;
        studentEmail: string;
    }

    interface Teacher {
        teacherId: string;
        teacherName: string;
        teacherEmail: string;
    }

    interface Schedule {
        student: Student;
        teacher: Teacher;
        _id: string;
        classDay: string[];
        package: string;
        preferedTeacher: string;
        totalHourse: number;
        startDate: string;
        endDate: string;
        startTime: string[];
        endTime: string[];
        scheduleStatus: string;
        status: string;
        createdBy: string;
        createdDate: string;
        lastUpdatedDate: string;
        __v: number;
    }

    interface ApiResponse {
        totalCount: number;
        students: Schedule[];
    }
     interface IMessage {
        _id: string;
        roomId: string;
        teacher: {
          teacherId: string;
          teacherName: string;
          teacherEmail: string;
        };
        student: {
          studentId: string;
          studentFirstName: string;
          studentLastName: string;
          studentEmail: string;
        };
        message: string;
        attachmentsType: { fileName?: string; fileType?: string; fileUrl?: string }[];
        sender: string;
        receiver: string;
        group: {
          groupId: string;
          groupName: string;
          members: { userId: string; userName: string; _id: string }[];
          _id: string;
        }[];
        status: string;
        createdDate: string; // Date as string
        createdBy: string;
        updatedDate: string;
        updatedBy: string;
      }
      

      const [uniqueTeachers, setUniqueTeachers] = useState<Teacher[]>([]);  // Use Teacher instead of Student
      const [teacherPortalName, setTeacherPortalName] = useState<string | null>(null);
      const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);  // Store selected teacher
      const [messages, setMessages] = useState<IMessage[]>([]);
      const [messageText, setMessageText] = useState<string>("");
      
      useEffect(() => {
          const teacherPortal = localStorage.getItem('StudentPortalName');
          setTeacherPortalName(teacherPortal);
          console.log(teacherPortalName);
      
          const fetchData = async () => {
              try {
                  const auth = localStorage.getItem('StudentAuthToken');
                  const studentIdToFilter = localStorage.getItem('StudentPortalId');  // Get studentId
      
                  if (!studentIdToFilter) {
                      console.error("No student ID found in localStorage.");
                      return;
                  }
      
                  const response = await axios.get<ApiResponse>("http://localhost:5001/classShedule", {
                      headers: {
                          Authorization: `Bearer ${auth}`,
                      },
                  });
      
                  const filteredData = response.data.students.filter(
                      (item) => item.student.studentId === studentIdToFilter  // Filter by studentId
                  );
                  
                  const teacherMap = new Map<string, Teacher>();
      
                  filteredData.forEach((item) => {
                      teacherMap.set(item.teacher.teacherId, item.teacher);  // Set teachers based on teacherId
                  });
      
                  const teacherList = Array.from(teacherMap.values());  // Get list of teachers
                  setUniqueTeachers(teacherList);  // Update unique teachers list
      
                  // Automatically select the first teacher if available
                  if (teacherList.length > 0) {
                      setSelectedTeacher(teacherList[0]);  // Select first teacher
                      loadMessages(teacherList[0].teacherId);  // Load messages based on teacherId
                  }
              } catch (error) {
                  console.error("Error fetching data:", error);
              }
          };
      
          fetchData();
      }, []);
      

    // Function to load messages when a student is selected
    const loadMessages = async (teacherId: string) => {
        console.log(teacherId);
        try {
            const auth = localStorage.getItem('StudentAuthToken');
            const teacherIdToFilter = localStorage.getItem('StudentPortalId');
            console.log(teacherIdToFilter);
            // Fetch messages from backend (Mock API or Database)
            const response = await axios.get(`http://localhost:5001/message/studentmessage`,{
                params: {
                    studentId: teacherIdToFilter,
                    teacherId: teacherId,
                },
                headers: {
                    Authorization: `Bearer ${auth}`,
                },
            });
            console.log('Response Data:', response.data);
            setMessages(response.data.Message || []);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    // Function to handle student click
    const handleStudentClick = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        loadMessages(teacher.teacherId);
    };
    const handleSendMessage = async () => {
        if (!selectedTeacher || !messageText.trim()) return;
    
        try {
            const auth = localStorage.getItem('StudentAuthToken');
            const response = await fetch("http://localhost:5001/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" ,
                    Authorization: `Bearer ${auth}`, 
                },
                body: JSON.stringify({
                    teacher: {
                        teacherId: selectedTeacher.teacherId,
                        teacherName: selectedTeacher.teacherName,
                         teacherEmail: selectedTeacher.teacherEmail
                    },
                    student: {
                        studentId: localStorage.getItem("StudentPortalId"),
                        studentFirstName: teacherPortalName,
                        studentLastName: teacherPortalName,
                        studentEmail: "johndoe@example.com",
                        studentPhone: 9876543210,
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
                    sender: "student",
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
                student: data.student || {
                    studentId: localStorage.getItem("TeacherPortalId") ?? "",
                    studentFirstName: teacherPortalName,
                    studentLastName: teacherPortalName,
                    studentEmail: "johndoe@example.com",
                },
                message: messageText,
                attachmentsType: data.attachmentsType || [],
                sender: "student",
                receiver: "teacher",
                group: data.group || [],
                status: "sent",
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
        <BaseLayout>
            <div className='justify-center align-middle h-[100vh] w-[100%] mr-5'>
                <h1 className='text-[30px] font-semibold mb-5'>Messages</h1>

                <main className="flex gap-6 h-[80vh]">
                    {/* Left Panel - Student List */}
                    <div className="w-[30%] bg-white p-6 ml-1 rounded-lg shadow-md">
                        <div className="flex items-center space-x-4">
                            <img
                                src="/assets/images/account.png"
                                alt="Teacher"
                                className="w-14 h-14 rounded-lg border border-[#dbdbdb]"
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-[#374557]">{teacherPortalName}</h3>
                                <p className="text-sm text-gray-500">Student</p>
                            </div>
                        </div>

                        {/* Chat List */}
                        <div className="mt-6">
                            <h2 className="text-[19px] font-semibold text-[#06030c]">Private</h2>
                            <div className="mt-4 max-h-[300px] overflow-y-auto">
                                <ul className="space-y-4">
                                    {uniqueTeachers.map((student) => (
                                        <button 
                                            key={student.teacherId} 
                                            className={`flex items-center justify-between border-b-2 p-1 cursor-pointer ${
                                                selectedTeacher?.teacherId === student.teacherId ? 'bg-gray-200' : ''
                                            }`} 
                                            onClick={() => handleStudentClick(student)}
                                        >
                                            <div className="flex space-x-3">
                                                <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                                                <div>
                                                    <h5 className="font-semibold text-sm text-[#374557]">
                                                        {student.teacherName} 
                                                    </h5>
                                                    <p className="text-[10px] text-[#A098AE]">{student.teacherEmail}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Chat Panel */}
                    <div className="w-[70%] bg-white p-4 rounded-lg shadow-md mt-4 md:mt-0 max-h-[100vh] flex flex-col justify-between">
                        {selectedTeacher ? (
                            <>
                                <div>
                                    <div className="flex items-center space-x-4 border-b border-b-[#dbdbdb] p-2">
                                        <img
                                            src="/assets/images/account1.png"
                                            alt={selectedTeacher.teacherName}
                                            className="w-14 h-14 rounded-full"
                                        />
                                        <div>
                                            <h3 className="text-base font-semibold">
                                                {selectedTeacher.teacherName} 
                                            </h3>
                                            <p className="text-sm text-green-500">Online</p>
                                        </div>
                                    </div>

                                    {/* Chat Messages */}
                                    <div className="mt-6 space-y-4 overflow-y-auto max-h-[60vh]">
                                    {messages.map((msg, index) => (
                                 <div key={msg._id || index} className={`flex flex-col ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}>
                               <div className={`${msg.sender === 'teacher' ? 'bg-[#4CBC9A] text-white' : 'bg-gray-100'} p-3 rounded-t-xl ${msg.sender === 'teacher' ? 'rounded-bl-xl' : 'rounded-br-xl'}`}>
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
        </BaseLayout>
    );
};

export default Message;
