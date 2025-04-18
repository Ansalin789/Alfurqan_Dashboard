'use client';

import BaseLayout4 from '@/components/BaseLayout4';
import React, { useState, useRef, useEffect } from 'react';
import { GrAttachment } from "react-icons/gr";
import { FaTelegramPlane } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import { IoIosMore } from 'react-icons/io';

interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'supervisor' | 'academic-coach';
  avatar?: string;
  status?: 'online' | 'offline' | 'busy';
  lastSeen?: string;
}

interface IMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  isEdited?: boolean;
}

const Message = () => {
  // Raw JSON data
  const supervisors: IUser[] = [
    {
      id: 'sup1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'supervisor',
      status: 'online',
      lastSeen: '2 mins ago'
    },
    {
      id: 'sup2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      role: 'supervisor',
      status: 'busy',
      lastSeen: '30 mins ago'
    }
  ];

  const academicCoaches: IUser[] = [
    {
      id: 'ac1',
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'michael.j@example.com',
      role: 'academic-coach',
      status: 'online',
      lastSeen: 'just now'
    },
    {
      id: 'ac2',
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.w@example.com',
      role: 'academic-coach',
      status: 'offline',
      lastSeen: '2 hours ago'
    }
  ];

  const sampleMessages: Record<string, IMessage[]> = {
    sup1: [
      {
        id: 'msg1',
        senderId: 'admin1',
        receiverId: 'sup1',
        message: 'Hello supervisor, how are you?',
        timestamp: '2023-05-15T10:30:00Z',
        status: 'read'
      },
      {
        id: 'msg2',
        senderId: 'sup1',
        receiverId: 'admin1',
        message: 'I am doing well, thank you! How about the new schedule?',
        timestamp: '2023-05-15T10:32:00Z',
        status: 'read'
      },
      {
        id: 'msg3',
        senderId: 'admin1',
        receiverId: 'sup1',
        message: 'The schedule is ready. I will send it shortly.',
        timestamp: '2023-05-15T10:33:00Z',
        status: 'read',
        isEdited: true
      }
    ],
    ac1: [
      {
        id: 'msg4',
        senderId: 'admin1',
        receiverId: 'ac1',
        message: 'About the upcoming training session...',
        timestamp: '2023-05-16T09:15:00Z',
        status: 'read'
      },
      {
        id: 'msg5',
        senderId: 'ac1',
        receiverId: 'admin1',
        message: 'I have prepared all the materials',
        timestamp: '2023-05-16T09:20:00Z',
        status: 'read'
      }
    ]
  };

  const [activeTab, setActiveTab] = useState<'supervisors' | 'academic-coaches'>('supervisors');
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter users based on search query
  const filteredUsers = (activeTab === 'supervisors' ? supervisors : academicCoaches).filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUserClick = (user: IUser) => {
    setSelectedUser(user);
    // Load messages for this user
    setMessages(sampleMessages[user.id] || []);
  };

  const handleSendMessage = () => {
    if (!selectedUser || !messageText.trim()) return;

    const newMessage: IMessage = {
      id: Date.now().toString(),
      senderId: 'admin1',
      receiverId: selectedUser.id,
      message: messageText,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-400';
      case 'busy': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <BaseLayout4>
      <div className="py-3 px-5" >
      <h1 className="text-[20px] mt-3 font-semibold mb-3">Messages</h1>
      <div className="flex flex-col md:flex-row gap-4 h-[85vh]">

        {/* Left Panel */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full md:w-[350px] bg-white p-4 rounded-lg shadow-md flex flex-col border border-gray-100"
        >
          <div className="flex items-center space-x-3 p-2">
            <motion.div whileHover={{ scale: 1.05 }}>
              <img
                src="/assets/images/account.png"
                alt="Admin"
                className="w-12 h-12 rounded-lg border border-[#dbdbdb]"
              />
            </motion.div>
            <div>
              <h3 className="text-sm font-semibold text-[#374557]">Admin</h3>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
            <button className="ml-auto text-gray-500">
              <IoIosMore size={18} />
            </button>
          </div>

          {/* Search Bar */}
          <motion.div whileHover={{ scale: 1.01 }} className="relative mt-2 mb-3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 text-xs" />
            </div>
            <input
              type="text"
              placeholder="Search messages..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#4CBC9A]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`px-3 py-1.5 text-xs font-medium ${activeTab === 'supervisors' ? 'text-[#4CBC9A] border-b-2 border-[#4CBC9A]' : 'text-gray-500'}`}
              onClick={() => setActiveTab('supervisors')}
            >
              Supervisors
            </button>
            <button
              className={`px-3 py-1.5 text-xs font-medium ${activeTab === 'academic-coaches' ? 'text-[#4CBC9A] border-b-2 border-[#4CBC9A]' : 'text-gray-500'}`}
              onClick={() => setActiveTab('academic-coaches')}
            >
              Academic Coaches
            </button>
          </div>

          {/* User List */}
          <div className="mt-2 overflow-y-auto flex-1">
            <AnimatePresence>
              {filteredUsers.map((user) => (
                <motion.button
                  key={user.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-center justify-between w-full p-2 rounded-lg cursor-pointer ${selectedUser?.id === user.id ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-50'}`}
                  onClick={() => handleUserClick(user)}
                >
                  <div className="flex space-x-2 items-center">
                    <div className="relative">
                      <motion.div whileHover={{ scale: 1.05 }} className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600 text-xs">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </motion.div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${getStatusColor(user.status ?? 'offline')}`}></div>
                    </div>
                    <div className="text-left">
                      <h5 className="font-medium text-xs text-[#374557]">
                        {user.firstName} {user.lastName}
                      </h5>
                      <p className="text-[10px] text-gray-400 truncate max-w-[180px]">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-[9px] text-gray-400">{user.lastSeen}</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Chat Panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full md:flex-1 bg-white rounded-lg shadow-md flex flex-col border border-gray-100 overflow-hidden"
        >
          {selectedUser ? (
            <>
              <div className="border-b border-gray-200 p-3">
                <div className="flex items-center space-x-2">
                  <motion.div whileHover={{ scale: 1.05 }} className="relative">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-600 text-sm">
                        {selectedUser.firstName.charAt(0)}{selectedUser.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${getStatusColor(selectedUser.status ?? 'offline')}`}></div>
                  </motion.div>
                  <div>
                    <h3 className="text-xs font-semibold">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    <div className="flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full mr-1 ${getStatusColor(selectedUser.status ?? 'offline')}`}></span>
                      <p className="text-[10px] text-gray-400 capitalize">
                        {selectedUser.status} • {selectedUser.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex flex-col mb-3 ${msg.senderId === 'admin1' ? 'items-end' : 'items-start'}`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className={`p-2 rounded-lg max-w-[80%] shadow-sm ${
                          msg.senderId === 'admin1'
                            ? 'bg-[#4CBC9A] text-white rounded-tr-none'
                            : 'bg-white border border-gray-200 rounded-tl-none'
                        }`}
                      >
                        <p className="text-xs">{msg.message}</p>
                        <div className="flex items-center justify-end mt-1 space-x-1">
                          {msg.isEdited && (
                            <span className="text-[9px] italic opacity-70">edited</span>
                          )}
                          <span className="text-[9px] opacity-70">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {msg.senderId === 'admin1' && (
                            <span className="text-[9px]">
                              {msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓' : ''}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="border-t border-gray-200 p-3 bg-white"
              >
                <div className="flex items-center rounded-lg bg-gray-50 p-1">
                  <button className="p-1 text-gray-500 hover:text-gray-700 ml-1">
                    <GrAttachment size={14} />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-2 py-1.5 text-xs bg-transparent outline-none"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className={`p-1 rounded-lg flex items-center ${messageText.trim() ? 'bg-[#4CBC9A] text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                  >
                    <FaTelegramPlane size={14} />
                  </motion.button>
                </div>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-full bg-gray-50"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full mb-3 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
                <p className="text-xs text-gray-500">Select a conversation to start chatting</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
    </BaseLayout4>
  );
};

export default Message;