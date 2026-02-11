"use client";

import BaseLayout4 from "@/components/BaseLayout4";
import React, { useState, useRef, useEffect, Key, ReactNode } from "react";
import { GrAttachment } from "react-icons/gr";
import { FaTelegramPlane } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiMoreVertical, FiUserPlus, FiUserMinus, FiTrash2, FiMessageSquare, FiLogOut, FiX } from "react-icons/fi";
import { HiUserGroup } from "react-icons/hi";
import axios from "axios";
import { io } from "socket.io-client";
import AdminHeader from "../../components/AdminHeader";

// Define your interfaces
interface IMessage {
  _id: string;
  messages: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  createdDate: string;
  time: string;
  notificationStatus: "Unseen" | "Seen";
  isRead: boolean;
  status: "Active" | "Inactive";
}

interface IMessageData {
  _id: string;
  messages: IMessage[];
}

interface IMessageResponse {
  status: string;
  message: string;
  data: IMessageData[];
}

interface IUser {
  _id: string;
  userId: string;
  userName: string;
  email: string;
  role: string[];
  status: string;
  lastLoginDate?: string;
  lastSeen?: string;
  isRead?: boolean;
  profileImage?: string;
}

interface IMessagesend {
  messages: string;
  isRead: boolean;
  senderId: string;
  senderName: string;
  senderEmail: string;
  receiverId: string;
  receiverName: string;
  receiverEmail: string;
  notificationStatus: "Unseen" | "Seen";
  status: "Active" | "Inactive";
  createdDate: Date;
  createdBy: string;
  updatedDate: Date;
  updatedBy: string;
}

interface IGroup {
  _id: string;
  groupId: string;
  GroupName: string;
  GroupNameDescription?: string;
  CourseName?: string;
  Designation?: string;
  PreferredTeacher?: string;
  groupMessageParticipant: {
    userId: Key | null | undefined;
    userName: ReactNode;
    participantId: string;
    participantName: string;
    participantEmail?: string;
    role: string;
    isRemoved?: boolean;
    removedDate?: string;
  }[];
  groupMessageOrganizer: {
    organizerId: string;
    organizerName: string;
    organizerEmail?: string;
    role: string;
  };
  messages: string;
  status: string;
  createdDate: string;
}

interface IGroupMessage {
  _id: string;
  groupId: string;
  message: string;
  isRead: boolean;
  groupMessageParticipant: {
    participantId: string;
    participantName: string;
    participantEmail?: string;
    role: string;
    isRead?: boolean;
  }[];
  groupMessageOrganizer: {
    organizerId: string;
    organizerName: string;
    organizerEmail?: string;
    role: string;
  };
  notificationStatus: "Unseen" | "Seen";
  status: string;
  createdDate: string;
  
  senderId?: string;
  senderName?: string;
  senderRole?: string;
}

interface IGroupResponse {
  _id: string;
  groupId: string;
  GroupName: string;
  GroupNameDescription?: string;
  CourseName?: string;
  Designation?: string;
  PreferredTeacher?: string;
  groupMessageParticipant: {
    participantId: string;
    participantName: string;
    participantEmail?: string;
    role: string;
    isRemoved?: boolean;
    removedDate?: string;
  }[];
  groupMessageOrganizer: {
    organizerId: string;
    organizerName: string;
    organizerEmail?: string;
    role: string;
  };
  messages: string;
  status: string;
  createdDate: string;
}

// Add interfaces for AlStudents
interface IAlStudent {
  studentId: string;
  studentName: string;
  email: string;
  phone?: string;
  course?: string;
  package?: string;
  city?: string;
  country?: string;
  gender?: string;
}

// Type guard functions
const isTenantUser = (user: any): user is IUser => {
  return user && (user.userId !== undefined || user._id !== undefined);
};

const isAlStudent = (user: any): user is IAlStudent => {
  return user && user.studentId !== undefined;
};

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? "http://localhost:5001" 
  : "https://api.blackstoneinfomaticstech.com";

const GROUP_API_URL = `${API_BASE_URL}/groupmessage`;

const Message = () => {
  // User states - EXACTLY like Academic Coach
  const [academicCoaches, setAcademicCoaches] = useState<IUser[]>([]);
  const [admins, setAdmins] = useState<IUser[]>([]);
  const [students, setStudents] = useState<IUser[]>([]);
  const [supervisors, setSupervisors] = useState<IUser[]>([]);
  const [teachers, setTeachers] = useState<IUser[]>([]);
  const [alStudents, setAlStudents] = useState<IAlStudent[]>([]); // ADDED for AlStudents
  
  // UI states
  const [activeTab, setActiveTab] = useState<
    "all" | "teachers" | "admins" | "students" | "supervisors" | "academicCoaches"
  >("all");
  const [activeView, setActiveView] = useState<"chats" | "groups">("chats");
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<IGroup | null>(null);
  const [messages, setMessages] = useState<IMessageData[]>([]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageCount, setMessageCount] = useState<number>(0);
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [groupMessages, setGroupMessages] = useState<IGroupMessage[]>([]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  
  // Group creation states
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [selectedPreferredTeacher, setSelectedPreferredTeacher] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [searchEmp, setSearchEmp] = useState("");
  const [allUsers, setAllUsers] = useState<IUser[]>([]);

  // Wizard state
  const [groupStep, setGroupStep] = useState<1 | 2 | 3>(1);
  const [activeRoleTab, setActiveRoleTab] = useState<string>("All");
  const [allSelected, setAllSelected] = useState(false);

  // Popup states
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Group management states
  const [showGroupManagementModal, setShowGroupManagementModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'remove'>('add');
  const [selectedUsersForManagement, setSelectedUsersForManagement] = useState<string[]>([]);
  const [managementSearch, setManagementSearch] = useState("");
  
  // Loading states
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [creatingGroup, setCreatingGroup] = useState(false);
  
  // Other states
  const [groupResponse, setGroupResponse] = useState<IGroupResponse | null>(null);
  const [showGroupMenu, setShowGroupMenu] = useState(false);
  const [groupMenuPosition, setGroupMenuPosition] = useState({ x: 0, y: 0 });
  const [showGroupInfo, setShowGroupInfo] = useState<IGroup | null>(null);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // User info - USING ADMIN KEYS
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("admin");
  const [userEmail, setUserEmail] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  // Initialize user data - USING ADMIN KEYS
  useEffect(() => {
    setIsClient(true);
    
    // Try multiple localStorage keys for Admin
    const name = localStorage.getItem("AdminPortalName") || 
                 localStorage.getItem("AdminName") || 
                 localStorage.getItem("AdminUserName") ||
                 localStorage.getItem("Name") ||
                 "Admin";
    
    const id = localStorage.getItem("AdminPortalId") || 
               localStorage.getItem("AdminId") ||
               localStorage.getItem("AdminUserId") ||
               localStorage.getItem("UserId") ||
               localStorage.getItem("_id") ||
               localStorage.getItem("id") ||
               localStorage.getItem("adminId");
    
    const email = localStorage.getItem("AdminPortalEmail") || 
                  localStorage.getItem("AdminEmail") || 
                  localStorage.getItem("Email") ||
                  "admin@blackstone.com";
    
    const role = localStorage.getItem("AdminRole") || 
                 localStorage.getItem("Role") || 
                 "admin";
    
    console.log("🎯 ADMIN - User info loaded:", {
      id,
      name,
      email,
      role
    });
    
    setUserName(name);
    setUserId(id);
    setUserEmail(email);
    setUserRole(role);
  }, []);

  // Get auth token - ADMIN VERSION
  const getAuthToken = () => {
    // Check all possible localStorage keys for Admin
    const possibleKeys = [
      "AdminAuthToken", "adminAuthToken", "authToken", 
      "AdminPortalToken", "token", "accessToken",
      "access_token", "jwtToken", "jwt"
    ];
    
    let token = null;
    
    for (const key of possibleKeys) {
      const value = localStorage.getItem(key);
      if (value) {
        console.log(`✅ ADMIN - Found token in localStorage key: "${key}"`);
        token = value;
        break;
      }
    }
    
    if (!token) {
      console.error("❌ ADMIN - No auth token found in localStorage");
    }
    
    return token;
  };

  // Escape key handler for modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && (isCreatingGroup || showGroupManagementModal || showClearConfirm || showDeleteConfirm)) {
        handleCloseModal();
      }
    };

    if (isCreatingGroup || showGroupManagementModal || showClearConfirm || showDeleteConfirm) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isCreatingGroup, showGroupManagementModal, showClearConfirm, showDeleteConfirm]);

  // Role mapping - SAME as Academic Coach
  const roleMapping: Record<string, string> = {
    "TEACHER": "teacher",
    "STUDENT": "student",
    "ADMIN": "admin",
    "SUPERVISOR": "supervisor",
    "ACADEMICCOACH": "academiccoach",
    "ACADEMIC COACH": "academiccoach",
    "ACADEMIC_COACH": "academiccoach"
  };

  // Helper functions - SAME as Academic Coach
  const getUserInitials = (name: string) => {
    if (!name) return "G";
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const getGroupInitials = (name: string) => {
    if (!name) return "G";
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const getRoleColor = (role: string) => {
    const roleColors: Record<string, string> = {
      admin: "text-[#377E36]",
      teacher: "text-[#377E36]",
      student: "text-[#377E36]",
      supervisor: "text-[#377E36]",
      academiccoach: "text-[#377E36]",
      academic_coach: "text-[#377E36]",
      "academic coach": "text-[#377E36]",
    };
    
    const normalizedRole = role?.toLowerCase() || "";
    return roleColors[normalizedRole] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-gray-400";
      case "busy":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  const formatRole = (roleInput: string | string[]): string => {
    if (!roleInput) return "User";
    
    let roles: string[];
    if (Array.isArray(roleInput)) {
      roles = roleInput;
    } else {
      roles = [roleInput];
    }
    
    if (roles.length === 0) return "User";
    
    const primaryRole = roles[0];
    
    switch (primaryRole.toUpperCase()) {
      case 'ADMIN':
        return 'Admin';
      case 'TEACHER':
        return 'Teacher';
      case 'STUDENT':
        return 'Student';
      case 'SUPERVISOR':
        return 'Supervisor';
      case 'ACADEMIC_COACH':
      case 'ACADEMICCOACH':
      case 'ACADEMIC COACH':
        return 'Academic Coach';
      default:
        return primaryRole
          .toLowerCase()
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    }
  };

  // Helper function to format date
  const formatDateLabel = (dateString: string): string => {
    const inputDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const sameDay = (d1: Date, d2: Date) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    if (sameDay(inputDate, today)) return "Today";
    if (sameDay(inputDate, yesterday)) return "Yesterday";

    return inputDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

const isUserMemberOfGroup = (group: IGroup): boolean => {
  if (!userId || !userName) {
    console.log("User ID or Name not available");
    return false;
  }
  
  console.log(`🔍 ADMIN - Checking membership for group: ${group.GroupName}`);
  console.log(`Current user ID: ${userId}, Name: ${userName}, Email: ${userEmail}`);
  
  // Clean and normalize IDs for comparison (backend might be case-sensitive)
  const currentUserId = (userId || "").toString().trim().toLowerCase();
  const currentUserName = (userName || "").toString().trim().toLowerCase();
  const currentUserEmail = (userEmail || "").toString().trim().toLowerCase();
  
  // Check organizer with normalized comparison
  const organizer = group.groupMessageOrganizer || {};
  const organizerId = (organizer.organizerId || "").toString().trim().toLowerCase();
  const organizerName = (organizer.organizerName || "").toString().trim().toLowerCase();
  const organizerEmail = (organizer.organizerEmail || "").toString().trim().toLowerCase();
  
  // Check organizer match
  if (organizerId === currentUserId || 
      organizerName === currentUserName || 
      (organizerEmail && organizerEmail === currentUserEmail)) {
    console.log("✅ ADMIN - User is the organizer of this group");
    return true;
  }
  
  // Check participants with normalized comparison
  const participants = group.groupMessageParticipant || [];
  console.log(`Total participants: ${participants.length}`);
  
  for (const participant of participants) {
    // Skip removed participants
    if (participant.isRemoved) {
      console.log(`Participant ${participant.participantName} is removed, skipping`);
      continue;
    }
    
    const participantId = (participant.participantId || "").toString().trim().toLowerCase();
    const participantName = (participant.participantName || "").toString().trim().toLowerCase();
    const participantEmail = (participant.participantEmail || "").toString().trim().toLowerCase();
    
    // Check multiple possible matches
    const isMatch = 
      participantId === currentUserId ||
      participantName === currentUserName ||
      (participantEmail && participantEmail === currentUserEmail);
    
    if (isMatch) {
      console.log(`✅ ADMIN - User matched as participant: ${participant.participantName}`);
      return true;
    }
  }
  
  console.log("❌ ADMIN - User is not a member of this group");
  return false;
};

  // Modal handlers
  const handleCloseModal = () => {
    setIsCreatingGroup(false);
    setShowGroupModal(false);
    setShowGroupManagementModal(false);
    setGroupName("");
    setGroupDescription("");
    setSelectedCourse("");
    setSelectedDesignation("");
    setSelectedPreferredTeacher("");
    setSelectedEmployees([]);
    setSearchEmp("");
    setSelectedUsersForManagement([]);
    setManagementSearch("");
    setShowClearConfirm(false);
    setShowDeleteConfirm(false);
    setGroupStep(1);
    setActiveRoleTab("All");
    setAllSelected(false);
  };

// Wizard step handlers
const handleNextStep = () => {
  if (groupStep === 1) {
    // Validate required fields
    if (!groupName.trim()) {
      alert("Please enter a group name");
      return;
    }
    if (!selectedDesignation) {
      alert("Please select a designation");
      return;
    }
    // Validate course only for Teacher or Student
    if ((selectedDesignation === "Teacher" || selectedDesignation === "Student") && !selectedCourse) {
      alert("Please select a course for " + selectedDesignation.toLowerCase() + " groups");
      return;
    }
  }
  
  if (groupStep === 2 && selectedEmployees.length === 0) {
    alert("Please select at least one member");
    return;
  }
  
  if (groupStep < 3) {
    setGroupStep((prev) => (prev + 1) as 1 | 2 | 3);
  }
};

  const handlePrevStep = () => {
    if (groupStep > 1) {
      setGroupStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  // Select all handler
  const handleSelectAll = () => {
    const allFilteredIds = filteredEmployeesForWizard.map(user => {
      if (isTenantUser(user)) {
        return user.userId;
      } else if (isAlStudent(user)) {
        return user.studentId;
      }
      return "";
    }).filter(id => id);
    
    if (!allSelected) {
      // Convert to array before spreading
      setSelectedEmployees(([...selectedEmployees, ...allFilteredIds]));
    } else {
      // Use Array.from to iterate over the filtered IDs
      setSelectedEmployees(prev => prev.filter(id => !Array.from(allFilteredIds).includes(id)));
    }
    setAllSelected(!allSelected);
  };

  // Employee toggle handler
  const handleEmployeeToggle = (employeeId: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  // Get last message for a group
  const getLastMessageForGroup = (groupId: string) => {
    if (groupMessages.length > 0) {
      const groupMsgs = groupMessages.filter(msg => msg.groupId === groupId);
      if (groupMsgs.length > 0) {
        const lastMsg = groupMsgs[groupMsgs.length - 1];
        return lastMsg.message || "No messages yet";
      }
    }
    
    return "No messages yet";
  };

  const formatLastMessage = (message: string) => {
    if (!message || message === "No messages yet") return "No messages yet";
    if (message.length > 25) {
      return message.substring(0, 25) + "...";
    }
    return message;
  };

  // Handle group name click in left panel
  const handleGroupNameClick = (e: React.MouseEvent, group: IGroup) => {
    e.stopPropagation();
    setShowGroupInfo(group);
  };

  // Handle group click (select group for chat)
  const handleGroupClick = async (group: IGroup) => {
    console.log(`👆 Selecting group: ${group.GroupName} (${group.groupId})`);
    
    // Check membership immediately
    const isMember = isUserMemberOfGroup(group);
    
    if (!isMember) {
      alert(`You are not a member of "${group.GroupName}". Please ask the organizer to add you to this group.`);
      return;
    }
    
    setSelectedGroup(group);
    setSelectedUser(null);
    setGroupMessages([]);
    setShowGroupMenu(false);
    setShowGroupInfo(null);
    
    await fetchGroupMessages(group.groupId);
  };

  // Handle user click (select user for private chat)
  const handleUserClick = async (user: IUser) => {
    console.log(`👆 ADMIN - Selecting user: ${user.userName} (${user._id})`);
    
    setSelectedUser(user);
    setSelectedGroup(null);
    setGroupMessages([]);
    setShowGroupInfo(null);
    
    // Fetch messages for this user
    await fetchMessages(user._id || user.userId);
  };

const handleGroupMenuClick = (e: React.MouseEvent) => {
  e.stopPropagation();
  const rect = e.currentTarget.getBoundingClientRect();
  setGroupMenuPosition({
    x: rect.right - 180,
    y: rect.bottom + 5
  });
  setShowGroupMenu(true);
};

  // ==================== GROUP MANAGEMENT FUNCTIONS ====================

  // Open Group Management Modal - UPDATED to fetch users
  const openGroupManagementModal = async (type: 'add' | 'remove') => {
    setModalType(type);
    setSelectedUsersForManagement([]);
    setManagementSearch("");
    
    // Fetch fresh users data before opening modal (only for 'add' type)
    if (type === 'add') {
      setLoadingUsers(true);
      try {
        await fetchAllUsers(); // Fetch all users including students
      } catch (error) {
        console.error("Error fetching users for modal:", error);
      } finally {
        setLoadingUsers(false);
      }
    }
    
    setShowGroupManagementModal(true);
    setShowGroupMenu(false);
  };

  // Toggle User Selection for Management
  const handleUserToggleForManagement = (userId: string) => {
    setSelectedUsersForManagement(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Add People to Group - API Integration - UPDATED to handle AlStudents
  const handleAddPeople = async () => {
    if (!selectedGroup || selectedUsersForManagement.length === 0) {
      alert("Please select users to add");
      return;
    }
    
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Please login again");
        return;
      }

      // Get user details from allUsers AND alStudents
      const participants = selectedUsersForManagement.map(userId => {
        // First check in regular users
        const user = allUsers.find(u => 
          u.userId === userId || 
          u._id === userId
        );
        
        // Then check in AlStudents
        const student = alStudents.find(s => 
          s.studentId === userId
        );
        
        if (user) {
          const userRole = Array.isArray(user.role) ? user.role[0] : user.role || "TEACHER";
          const mappedRole = roleMapping[userRole.toUpperCase()] || "teacher";
          
          return {
            participantId: user.userId,
            participantName: user.userName,
            participantEmail: user.email,
            role: mappedRole as "teacher" | "student" | "admin" | "supervisor" | "academiccoach"
          };
        } else if (student) {
          return {
            participantId: student.studentId,
            participantName: student.studentName,
            participantEmail: student.email || "",
            role: "student" as const
          };
        }
        
        console.warn(`User ${userId} not found in either users or alStudents`);
        return null;
      }).filter(user => user !== null);

      if (participants.length === 0) {
        alert("No valid users selected");
        return;
      }

      console.log("📤 ADMIN - Adding participants:", participants);

      const response = await axios.put(
        `${GROUP_API_URL}/add-participants/${selectedGroup.groupId}`,
        {
          participants: participants,
          updatedBy: userName || "Admin"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ ADMIN - Add participants response:", response.data);

      if (response.status === 200) {
        alert("Participants added successfully!");
        
        // Update selected group state
        setSelectedGroup(prev => prev ? {
          ...prev,
          groupMessageParticipant: [
            ...prev.groupMessageParticipant,
            ...participants.map(p => ({
              ...p,
              userId: p.participantId,
              userName: p.participantName,
              isRemoved: false,
              removedDate: undefined
            }))
          ]
        } : null);
        
        // Refresh groups list
        fetchGroups();
        setShowGroupManagementModal(false);
        setSelectedUsersForManagement([]);
      }
    } catch (error: any) {
      console.error("❌ ADMIN - Error adding participants:", error);
      
      if (error.response?.status === 404) {
        alert("Group not found. It may have been deleted.");
      } else if (error.response?.status === 400) {
        alert(`Bad request: ${error.response.data.message}`);
      } else {
        alert(`Failed to add participants: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  // Remove People from Group - API Integration
  const handleRemovePeople = async () => {
    if (!selectedGroup || selectedUsersForManagement.length === 0) {
      alert("Please select users to remove");
      return;
    }
    
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Please login again");
        return;
      }

      console.log("📤 ADMIN - Removing participants:", selectedUsersForManagement);

      const response = await axios.put(
        `${GROUP_API_URL}/remove-participants/${selectedGroup.groupId}`,
        {
          participantIds: selectedUsersForManagement,
          updatedBy: userName || "Admin"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ ADMIN - Remove participants response:", response.data);

      if (response.status === 200) {
        alert("Participants removed successfully!");
        
        // Update selected group state
        setSelectedGroup(prev => prev ? {
          ...prev,
          groupMessageParticipant: prev.groupMessageParticipant.map(p => 
            selectedUsersForManagement.includes(p.participantId) 
              ? { ...p, isRemoved: true, removedDate: new Date().toISOString() }
              : p
          )
        } : null);
        
        // Refresh groups list
        fetchGroups();
        setShowGroupManagementModal(false);
        setSelectedUsersForManagement([]);
      }
    } catch (error: any) {
      console.error("❌ ADMIN - Error removing participants:", error);
      
      if (error.response?.status === 404) {
        alert("Group not found. It may have been deleted.");
      } else if (error.response?.status === 400) {
        alert(`Bad request: ${error.response.data.message}`);
      } else {
        alert(`Failed to remove participants: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  // Clear Conversation - Now uses popup
  const handleClearConversation = () => {
    setShowClearConfirm(true);
    setShowGroupMenu(false);
  };

  // Delete Group - Now uses popup
  const handleDeleteGroup = () => {
    setShowDeleteConfirm(true);
    setShowGroupMenu(false);
  };

  // Clear Conversation Confirm - API Integration
  const handleClearConversationConfirm = async () => {
    if (!selectedGroup) return;
    
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Please login again");
        return;
      }

      console.log("📤 ADMIN - Clearing conversation for group:", selectedGroup.groupId);

      const response = await axios.put(
        `${GROUP_API_URL}/clear-conversation`,
        {
          groupId: selectedGroup.groupId,
          deletedBy: userName || "Admin"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ ADMIN - Clear conversation response:", response.data);

      if (response.status === 200) {
        alert("Conversation cleared successfully!");
        setGroupMessages([]);
        
        // Refresh messages
        await fetchGroupMessages(selectedGroup.groupId);
      }
    } catch (error: any) {
      console.error("❌ ADMIN - Error clearing conversation:", error);
      
      if (error.response?.status === 404) {
        alert("Group not found. It may have been deleted.");
      } else if (error.response?.status === 400) {
        alert(`Bad request: ${error.response.data.message}`);
      } else {
        alert(`Failed to clear conversation: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  // Delete Group Confirm - API Integration
  const handleDeleteGroupConfirm = async () => {
    if (!selectedGroup) return;
    
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Please login again");
        return;
      }

      console.log("📤 ADMIN - Deleting group:", selectedGroup.groupId);

      const response = await axios.put(
        `${GROUP_API_URL}/soft-delete-group`,
        {
          groupId: selectedGroup.groupId,
          deletedBy: userName || "Admin"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ ADMIN - Delete group response:", response.data);

      if (response.status === 200) {
        alert("Group deleted successfully!");
        
        // Update state
        setGroups(prev => prev.filter(g => g.groupId !== selectedGroup.groupId));
        setSelectedGroup(null);
        setGroupMessages([]);
        setShowGroupInfo(null);
      }
    } catch (error: any) {
      console.error("❌ ADMIN - Error deleting group:", error);
      
      if (error.response?.status === 404) {
        alert("Group not found. It may have already been deleted.");
      } else if (error.response?.status === 400) {
        alert(`Bad request: ${error.response.data.message}`);
      } else {
        alert(`Failed to delete group: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  // Fetch AlStudents from your backend
  const fetchAlStudents = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await axios.get(
        `${API_BASE_URL}/alstudents`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("📊 ADMIN - AlStudents API Response:", response.data);
        
      if (response.data.status === "success" && response.data.data) {
        const studentsData = response.data.data.students || response.data.data || [];
        
        const formattedStudents: IAlStudent[] = studentsData.map((student: any) => ({
          studentId: student._id || student.studentId || `student_${Date.now()}`,
          studentName: student.studentName || student.name || student.username || "Unknown Student",
          email: student.email || student.studentEmail || "",
          phone: student.phone || student.mobile || "",
          course: student.course || student.courseName || "",
          package: student.package || student.packageName || "",
          city: student.city || "",
          country: student.country || "",
          gender: student.gender || ""
        }));

        setAlStudents(formattedStudents);
        console.log(`✅ ADMIN - Loaded ${formattedStudents.length} AlStudents`);
      }
    } catch (error: any) {
      console.error("❌ ADMIN - Error fetching AlStudents:", error);
    }
  };


// Fetch all users for group creation - INCLUDES AlStudents
const fetchAllUsers = async () => {
  setLoadingUsers(true);
  try {
    const token = getAuthToken();
    if (!token) {
      console.error("❌ ADMIN - Auth token not found");
      setLoadingUsers(false);
      return;
    }

    console.log("🔄 ADMIN - Fetching all users and students...");

    // Step 1: Fetch regular users
    let usersData: any[] = [];
    try {
      const usersResponse = await axios.get(
        `${API_BASE_URL}/users`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      console.log("📊 ADMIN - Regular Users API Response:", usersResponse.data);

      // Parse regular users data
      if (usersResponse.data.status === "success") {
        if (usersResponse.data.data && usersResponse.data.data.users) {
          usersData = usersResponse.data.data.users;
        }
        else if (usersResponse.data.users) {
          usersData = usersResponse.data.users;
        }
        else if (usersResponse.data.data && Array.isArray(usersResponse.data.data)) {
          usersData = usersResponse.data.data;
        }
      }
      else if (Array.isArray(usersResponse.data)) {
        usersData = usersResponse.data;
      }
      else if (usersResponse.data.users && Array.isArray(usersResponse.data.users)) {
        usersData = usersResponse.data.users;
      }
      else if (usersResponse.data.data && Array.isArray(usersResponse.data.data)) {
        usersData = usersResponse.data.data;
      }

      console.log(`✅ ADMIN - Found ${usersData.length} regular users`);
    } catch (error: any) {
      console.error("❌ ADMIN - Error fetching regular users:", error.message);
      usersData = [];
    }

    // Step 2: Fetch AlStudents separately
    let alStudentsData: any[] = [];
    try {
      console.log("🔄 Fetching AlStudents from /alstudents endpoint...");
      const alStudentsResponse = await axios.get(
        `${API_BASE_URL}/alstudents`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      console.log("📊 ADMIN - AlStudents API Response:", alStudentsResponse.data);

      // Parse AlStudents response - based on your backend structure
      if (alStudentsResponse.data) {
        if (alStudentsResponse.data.status === "success") {
          if (alStudentsResponse.data.data && Array.isArray(alStudentsResponse.data.data)) {
            // Direct array of students
            alStudentsData = alStudentsResponse.data.data;
          } else if (alStudentsResponse.data.data && alStudentsResponse.data.data.students) {
            // Nested students array
            alStudentsData = alStudentsResponse.data.data.students;
          } else if (alStudentsResponse.data.data) {
            // Try to parse whatever is in data
            const data = alStudentsResponse.data.data;
            if (Array.isArray(data)) {
              alStudentsData = data;
            } else if (typeof data === 'object' && data.students && Array.isArray(data.students)) {
              alStudentsData = data.students;
            }
          }
        } else if (Array.isArray(alStudentsResponse.data)) {
          // Response is directly an array
          alStudentsData = alStudentsResponse.data;
        } else if (alStudentsResponse.data.students && Array.isArray(alStudentsResponse.data.students)) {
          alStudentsData = alStudentsResponse.data.students;
        } else if (alStudentsResponse.data.data && Array.isArray(alStudentsResponse.data.data)) {
          alStudentsData = alStudentsResponse.data.data;
        }
      }

      console.log(`✅ ADMIN - Found ${alStudentsData.length} AlStudents`);
      
      // Log first few students to check structure
      if (alStudentsData.length > 0) {
        console.log("📝 Sample AlStudents (first 3):", alStudentsData.slice(0, 3));
      }
    } catch (error: any) {
      console.error("❌ ADMIN - Error fetching AlStudents:", error);
      console.error("Error details:", error.response?.data || error.message);
      alStudentsData = [];
    }

    // Step 3: Process regular users
    const normalizedUsers: IUser[] = usersData
      .filter((user: any) => user && (user.userName || user.name || user.email))
      .map((user: any) => {
        let roles: string[] = [];
        
        if (user.role) {
          if (Array.isArray(user.role)) {
            roles = user.role;
          } else if (typeof user.role === 'string') {
            roles = user.role.split(',').map((r: string) => r.trim());
          }
        } else if (user.roles) {
          if (Array.isArray(user.roles)) {
            roles = user.roles;
          } else if (typeof user.roles === 'string') {
            roles = user.roles.split(',').map((r: string) => r.trim());
          }
        }
        
        if (roles.length === 0) {
          roles = ["USER"];
        }
        
        // Standardize role format
        const formattedRoles = roles.map(role => {
          const roleStr = role.toString().toUpperCase().trim();
          
          switch (roleStr) {
            case 'ADMIN':
            case 'ADMINISTRATOR':
              return 'ADMIN';
            case 'TEACHER':
            case 'TEACHERS':
            case 'TRAINER':
              return 'TEACHER';
            case 'STUDENT':
            case 'STUDENTS':
            case 'LEARNER':
              return 'STUDENT';
            case 'SUPERVISOR':
            case 'SUPERVISORS':
            case 'MANAGER':
              return 'SUPERVISOR';
            case 'ACADEMICCOACH':
            case 'ACADEMIC_COACH':
            case 'ACADEMIC COACH':
            case 'ACADEMIC_COACHES':
            case 'COACH':
              return 'ACADEMIC_COACH';
            default:
              return roleStr;
          }
        });

        const userId = user.userId || user._id || user.id || `temp_${Math.random().toString(36).substr(2, 9)}`;
        const userName = user.userName || user.name || user.fullName || 
                        user.email?.split('@')[0] || "Unknown User";
        const email = user.email || "";

        return {
          _id: user._id || userId,
          userId: userId,
          userName: userName,
          email: email,
          role: formattedRoles,
          status: user.status || "Active",
          lastLoginDate: user.lastLoginDate,
          lastSeen: user.lastSeen,
          isRead: user.isRead,
          profileImage: user.profileImage || user.avatar,
        };
      });

    console.log("✅ ADMIN - Normalized users:", normalizedUsers.length);
    setAllUsers(normalizedUsers);

    // Step 4: Process AlStudents separately
    const formattedAlStudents: IAlStudent[] = alStudentsData.map((student: any, index: number) => {
      // Debug log for each student
      console.log(`🔍 Processing AlStudent ${index + 1}:`, student);
      
      // Extract data based on different possible field names
      const studentData = student.student || student;
      const studentId = student._id || 
                       studentData._id || 
                       studentData.studentId || 
                       `alstudent_${index + 1}`;
      
      const studentName = studentData.studentName || 
                         studentData.name || 
                         student.username || 
                         studentData.username || 
                         "Al Student";
      
      const studentEmail = studentData.studentEmail || 
                          studentData.email || 
                          student.email || 
                          "";
      
      // Log what we're getting for debugging
      console.log(`   → ID: ${studentId}`);
      console.log(`   → Name: ${studentName}`);
      console.log(`   → Email: ${studentEmail}`);
      
      return {
        studentId: studentId,
        studentName: studentName,
        email: studentEmail,
        phone: studentData.studentPhone || studentData.phone || "",
        course: studentData.course || "",
        package: studentData.package || "",
        city: studentData.city || "",
        country: studentData.country || "",
        gender: studentData.gender || "",
      };
    });

    console.log(`✅ ADMIN - Formatted ${formattedAlStudents.length} AlStudents`);
    
    // Log final formatted students
    if (formattedAlStudents.length > 0) {
      console.log("📋 Final formatted AlStudents:", formattedAlStudents.slice(0, 3));
    }
    
    setAlStudents(formattedAlStudents);

    // Step 5: Filter users by role
    const teachersList = normalizedUsers.filter(user => 
      user.role.some(role => role === 'TEACHER')
    );
    const adminsList = normalizedUsers.filter(user => 
      user.role.some(role => role === 'ADMIN')
    );
    
    // Combine regular students with AlStudents
    const regularStudentsList = normalizedUsers.filter(user => 
      user.role.some(role => role === 'STUDENT')
    );
    
    // Convert AlStudents to IUser format for consistent display
    const alStudentsAsUsers: IUser[] = formattedAlStudents.map((student, index) => ({
      _id: student.studentId || `al_${index}`,
      userId: student.studentId || `al_${index}`,
      userName: student.studentName,
      email: student.email || "",
      role: ["STUDENT"],
      status: "Active",
      lastLoginDate: "",
      lastSeen: "",
      isRead: false,
      profileImage: "",
    }));
    
    // Combine all students
    const combinedStudentsList = [...regularStudentsList, ...alStudentsAsUsers];
    
    const supervisorsList = normalizedUsers.filter(user => 
      user.role.some(role => role === 'SUPERVISOR')
    );
    const academicCoachesList = normalizedUsers.filter(user => 
      user.role.some(role => role === 'ACADEMIC_COACH')
    );

    console.log(`👨‍🏫 ADMIN - Teachers: ${teachersList.length}`);
    console.log(`👨‍💼 ADMIN - Admins: ${adminsList.length}`);
    console.log(`🎓 ADMIN - Students (Combined): ${combinedStudentsList.length} (${regularStudentsList.length} regular + ${alStudentsAsUsers.length} AlStudents)`);
    console.log(`👨‍💼 ADMIN - Supervisors: ${supervisorsList.length}`);
    console.log(`👨‍🏫 ADMIN - Academic Coaches: ${academicCoachesList.length}`);

    // Set user lists
    setAcademicCoaches(academicCoachesList);
    setAdmins(adminsList);
    setStudents(combinedStudentsList); // Use combined students list
    setSupervisors(supervisorsList);
    setTeachers(teachersList);

    // Log all students for debugging
    console.log("🎓 ALL STUDENTS FOR DISPLAY:");
    combinedStudentsList.forEach((student, index) => {
      console.log(`${index + 1}. ${student.userName} (${student.email}) - ID: ${student.userId}`);
    });

  } catch (error: any) {
    console.error("❌ ADMIN - Error in fetchAllUsers:", error);
    console.error("Full error:", error);
    
    // Reset all lists on error
    setAllUsers([]);
    setAcademicCoaches([]);
    setAdmins([]);
    setStudents([]);
    setSupervisors([]);
    setTeachers([]);
    setAlStudents([]);
  } finally {
    setLoadingUsers(false);
  }
};

// Get filtered employees for wizard step 2
const filteredEmployeesForWizard = React.useMemo(() => {
  // Combine all users and AlStudents
  const allUsersForWizard = [
    ...allUsers.map(user => ({ 
      ...user, 
      type: 'tenant' as const,
      displayName: user.userName,
      displayEmail: user.email,
      displayRole: user.role
    })),
    ...alStudents.map(student => ({ 
      ...student, 
      type: 'alstudent' as const,
      displayName: student.studentName,
      displayEmail: student.email,
      displayRole: ["STUDENT"] // AlStudents are always students
    }))
  ];

  // Filter by search
  let filtered = allUsersForWizard.filter(user => {
    const searchTerm = searchEmp.toLowerCase();
    const userName = user.displayName?.toLowerCase() || "";
    const userEmail = user.displayEmail?.toLowerCase() || "";
    
    return userName.includes(searchTerm) || 
           userEmail.includes(searchTerm);
  });

  // Filter by role tab - FIXED to properly filter teachers
  if (activeRoleTab !== "All") {
    filtered = filtered.filter(user => {
      const userRole = user.displayRole;
      const roleText = formatRole(userRole).toLowerCase();
      const tabName = activeRoleTab.toLowerCase();
      
      // Special handling for different role names
      if (tabName === "teachers") {
        return roleText.includes("teacher") || 
               roleText.includes("trainer") || 
               roleText.includes("instructor");
      } else if (tabName === "students") {
        return roleText.includes("student") || 
               roleText.includes("learner");
      } else if (tabName === "admins") {
        return roleText.includes("admin");
      } else if (tabName === "supervisors") {
        return roleText.includes("supervisor") || 
               roleText.includes("manager");
      } else if (tabName === "academic coaches") {
        return roleText.includes("academic") || 
               roleText.includes("coach");
      }
      return false;
    });
  }

  // Exclude current user
  filtered = filtered.filter(user => {
    if (user.type === 'tenant') {
      return user.userId !== userId;
    }
    return true; // Keep all AlStudents
  });

  // Sort by name
  filtered.sort((a, b) => a.displayName?.localeCompare(b.displayName || "") || 0);

  return filtered;
}, [allUsers, alStudents, searchEmp, activeRoleTab, userId]);

  // Get grouped members for step 3
  const getGroupedMembers = () => {
    const groups: Record<string, Array<any>> = {};
    
    selectedEmployees.forEach(employeeId => {
      // Find user in combined list
      const user = filteredEmployeesForWizard.find(u => {
        if (isTenantUser(u)) {
          return u.userId === employeeId;
        } else if (isAlStudent(u)) {
          return u.studentId === employeeId;
        }
        return false;
      });
      
      if (user) {
        let roleName = "Other";
        
        if (isTenantUser(user)) {
          roleName = formatRole(user.role);
        } else if (isAlStudent(user)) {
          roleName = "Student";
        }
        
        if (!groups[roleName]) {
          groups[roleName] = [];
        }
        groups[roleName].push(user);
      }
    });
    
    return groups;
  };

// Create group function with wizard steps
const createGroup = async () => {
  if (!groupName.trim()) {
    alert("Please enter a group name");
    return;
  }

  if (!selectedDesignation) {
    alert("Please select a designation");
    return;
  }

  // Validate course only for Teacher or Student
  if ((selectedDesignation === "Teacher" || selectedDesignation === "Student") && !selectedCourse) {
    alert("Please select a course for " + selectedDesignation.toLowerCase() + " groups");
    return;
  }

  if (selectedEmployees.length === 0) {
    alert("Please select at least one member");
    return;
  }

  // Check if user data is loaded
  if (!userId || !userName) {
    alert("User information not loaded. Please refresh the page.");
    return;
  }

  setCreatingGroup(true);
  try {
    const token = getAuthToken();
    if (!token) {
      console.error("❌ ADMIN - Auth token not found");
      alert("Authentication token not found");
      return;
    }

    // Generate group ID
    const generateShortId = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = 'GRP';
      
      for (let i = 0; i < 3; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      return result;
    };
    const groupId = generateShortId();

    // Include current user as participant
    const currentUserParticipant = {
      userId: userId,
      userName: userName,
      participantId: userId,
      participantName: userName,
      participantEmail: userEmail || "admin@blackstone.com",
      role: "admin" as const,
      isRemoved: false,
      removedDate: undefined
    };

    // Process selected employees (both TenantUsers and AlStudents)
    const otherParticipants = selectedEmployees.map((selectedId) => {
      // First check in TenantUsers
      const tenantUser = allUsers.find(u => u.userId === selectedId);
      if (tenantUser) {
        const userRole = Array.isArray(tenantUser.role) ? tenantUser.role[0] : tenantUser.role || "TEACHER";
        const mappedRole = roleMapping[userRole.toUpperCase()] || "teacher";

        return {
          userId: tenantUser.userId,
          userName: tenantUser.userName,
          participantId: tenantUser._id,
          participantName: tenantUser.userName,
          participantEmail: tenantUser.email || "",
          role: mappedRole as "teacher" | "student" | "admin" | "supervisor" | "academiccoach",
          isRemoved: false,
          removedDate: undefined
        };
      }

      // Then check in AlStudents
      const alStudent = alStudents.find(s => s.studentId === selectedId);
      if (alStudent) {
        return {
          userId: alStudent.studentId,
          userName: alStudent.studentName,
          participantId: alStudent.studentId,
          participantName: alStudent.studentName,
          participantEmail: alStudent.email || "",
          role: "student" as const,
          isRemoved: false,
          removedDate: undefined
        };
      }

      console.warn(`User with ID ${selectedId} not found.`);
      return null;
    }).filter(p => p !== null);

    const participants = [currentUserParticipant, ...otherParticipants];

    const groupData = {
      groupId: groupId,
      GroupName: groupName.trim(),
      GroupNameDescription: groupDescription.trim() || `Group for ${groupName}`,
      CourseName: selectedCourse || (["Teacher", "Student"].includes(selectedDesignation) ? "General" : "Not Applicable"),
      Designation: selectedDesignation || "General",
      PreferredTeacher: selectedPreferredTeacher || "Any",
      
      groupMessageParticipant: participants,
      
      groupMessageOrganizer: {
        organizerId: userId,
        organizerName: userName,
        organizerEmail: userEmail || "admin@blackstone.com",
        role: "admin" as const,
      },

      messages: `Welcome to "${groupName}" group!`,
      isRead: false,
      notificationStatus: "Unseen" as const,
      createdBy: userName,
      status: "Active" as const,
    };

    console.log("📤 ADMIN - Sending group creation data:", groupData);

    const response = await axios.post(
      GROUP_API_URL,
      groupData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ ADMIN - Group creation response:", response.data);

    if (response.status === 201 || response.status === 200) {
      handleCloseModal();

      const newGroup: IGroup = {
        groupId: groupData.groupId,
        GroupName: groupData.GroupName,
        GroupNameDescription: groupData.GroupNameDescription,
        CourseName: groupData.CourseName,
        Designation: groupData.Designation,
        PreferredTeacher: groupData.PreferredTeacher,
        groupMessageParticipant: groupData.groupMessageParticipant,
        groupMessageOrganizer: groupData.groupMessageOrganizer,
        messages: groupData.messages,
        status: groupData.status,
        createdDate: new Date().toISOString(),
        _id: response.data.data?._id || ""
      };

      setGroups(prev => [newGroup, ...prev]);
      
      alert(`Group "${groupName}" created successfully!`);

      setActiveView("groups");
      setSelectedGroup(newGroup);

      // Refresh groups
      setTimeout(() => {
        fetchGroups();
      }, 1000);
    }
  } catch (error: any) {
    console.error("❌ ADMIN - Error creating group:", error);
    alert("Failed to create group. Please check console for details.");
  } finally {
    setCreatingGroup(false);
  }
};

  // Send group message
const sendGroupMessage = async () => {
  if (!selectedGroup || !messageText.trim() || !userId || !userName) {
    console.error("❌ Missing required data for sending message");
    console.error("Selected Group:", !!selectedGroup);
    console.error("Message Text:", !!messageText.trim());
    console.error("User ID:", !!userId);
    console.error("User Name:", !!userName);
    alert("Missing required data. Please check your connection and try again.");
    return;
  }

  const token = getAuthToken();
  if (!token) {
    alert("Session expired. Please login again.");
    return;
  }

  console.log("🚀 === STARTING GROUP MESSAGE SEND ===");
  console.log(`Group: "${selectedGroup.GroupName}" (${selectedGroup.groupId})`);
  
  // Get clean user identifiers
  const cleanUserId = (userId || "").toString().trim();
  const cleanUserName = (userName || "").toString().trim();
  const cleanUserEmail = (userEmail || "").toString().trim();
  
  console.log("👤 Current User Details:", {
    id: cleanUserId,
    name: cleanUserName,
    email: cleanUserEmail,
    role: userRole
  });

  // Enhanced membership check
  console.log("🔍 Performing enhanced membership check...");
  
  const groupOrganizer = selectedGroup.groupMessageOrganizer || {};
  const groupParticipants = selectedGroup.groupMessageParticipant || [];
  
  console.log("👑 Group Organizer Details:", {
    organizerId: groupOrganizer.organizerId,
    organizerName: groupOrganizer.organizerName,
    organizerEmail: groupOrganizer.organizerEmail,
    organizerRole: groupOrganizer.role
  });
  
  console.log("👥 Group Participants:", groupParticipants.map((p, i) => ({
    index: i,
    id: p.participantId,
    name: p.participantName,
    email: p.participantEmail,
    role: p.role,
    isRemoved: p.isRemoved
  })));
  
  // Find the exact match that backend will recognize
  const findSenderMatch = () => {
    // Check organizer first
    if (groupOrganizer.organizerId === cleanUserId || 
        (groupOrganizer.organizerName && groupOrganizer.organizerName.toLowerCase() === cleanUserName.toLowerCase()) ||
        (groupOrganizer.organizerEmail && groupOrganizer.organizerEmail.toLowerCase() === cleanUserEmail.toLowerCase())) {
      return {
        type: 'organizer' as const,
        id: groupOrganizer.organizerId,
        name: groupOrganizer.organizerName,
        email: groupOrganizer.organizerEmail,
        role: groupOrganizer.role || 'admin'
      };
    }
    
    // Check participants
    const activeParticipants = groupParticipants.filter(p => !p.isRemoved);
    for (const participant of activeParticipants) {
      const participantId = (participant.participantId || "").toString().trim();
      const participantName = (participant.participantName || "").toString().trim();
      const participantEmail = (participant.participantEmail || "").toString().trim();
      
      // Try multiple matching strategies
      const matches =
        // Exact string match
        participantId === cleanUserId ||
        participantName === cleanUserName ||
        participantEmail === cleanUserEmail ||
        // Case-insensitive match
        participantId.toLowerCase() === cleanUserId.toLowerCase() ||
        participantName.toLowerCase() === cleanUserName.toLowerCase() ||
        (participantEmail && participantEmail.toLowerCase() === cleanUserEmail.toLowerCase()) ||
        // Contains match (for partial IDs)
        cleanUserId.includes(participantId) ||
        participantId.includes(cleanUserId) ||
        cleanUserName.includes(participantName) ||
        participantName.includes(cleanUserName);
      
      if (matches) {
        return {
          type: 'participant' as const,
          id: participant.participantId,
          name: participant.participantName,
          email: participant.participantEmail,
          role: participant.role || 'member'
        };
      }
    }
    
    return null;
  };

  const senderMatch = findSenderMatch();
  
  if (!senderMatch) {
    console.error("❌ NO MATCH FOUND - User is not recognized as a member");
    console.log("🤔 Trying to find ANY similarity...");
    
    // Collect all possible IDs from the group
    const allGroupIds = [
      groupOrganizer.organizerId,
      ...groupParticipants.map(p => p.participantId)
    ].filter(Boolean);
    
    const allGroupNames = [
      groupOrganizer.organizerName,
      ...groupParticipants.map(p => p.participantName)
    ].filter(Boolean);
    
    const allGroupEmails = [
      groupOrganizer.organizerEmail,
      ...groupParticipants.map(p => p.participantEmail)
    ].filter(Boolean);
    
    console.log("All Group IDs:", allGroupIds);
    console.log("All Group Names:", allGroupNames);
    console.log("All Group Emails:", allGroupEmails);
    
    // Show detailed error message to user
    alert(
      `ACCESS DENIED\n\n` +
      `You are not recognized as a member of "${selectedGroup.GroupName}".\n\n` +
      `Your Details:\n` +
      `• ID: ${cleanUserId}\n` +
      `• Name: ${cleanUserName}\n` +
      `• Email: ${cleanUserEmail}\n\n` +
      `Please contact the group organizer (${groupOrganizer.organizerName}) and:\n` +
      `1. Ask them to re-add you to the group\n` +
      `2. Provide them with your exact details above\n` +
      `3. Refresh the page after being added`
    );
    
    return;
  }

  console.log("✅ SENDER MATCH FOUND:", senderMatch);
  
  try {
    // Create the message payload with ALL possible identifiers
    const messagePayload: any = {
      groupId: selectedGroup.groupId,
      message: messageText.trim(),
      // Current user's details (what we think we are)
      senderId: cleanUserId,
      senderName: cleanUserName,
      senderEmail: cleanUserEmail,
      senderRole: userRole || "admin",
      // Matched details (what the backend recognizes)
      matchedId: senderMatch.id,
      matchedName: senderMatch.name,
      matchedEmail: senderMatch.email,
      matchedRole: senderMatch.role,
      matchedType: senderMatch.type,
      // Additional metadata
      notificationStatus: "Unseen" as const,
      status: "Active" as const,
      createdDate: new Date().toISOString(),
      createdBy: cleanUserName,
      timestamp: Date.now()
    };

    console.log("📤 Sending message payload:", JSON.stringify(messagePayload, null, 2));

    // Send the message
    const response = await axios.post(
      `${GROUP_API_URL}/send-message`,
      messagePayload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      }
    );

    console.log("✅ Message sent successfully!");
    console.log("Response:", response.data);

    if (response.data.success || response.status === 200 || response.status === 201) {
      // Create new message object for UI
      const newMessage: IGroupMessage = {
        _id: response.data.data?._id || `msg_${Date.now()}`,
        groupId: selectedGroup.groupId,
        message: messageText.trim(),
        isRead: true, // Message sent by us is read
        groupMessageParticipant: selectedGroup.groupMessageParticipant.map(p => ({
          ...p,
          isRead: p.participantId === cleanUserId
        })),
        groupMessageOrganizer: selectedGroup.groupMessageOrganizer,
        notificationStatus: "Unseen",
        status: "Active",
        createdDate: new Date().toISOString(),
        senderId: cleanUserId,
        senderName: cleanUserName,
        senderRole: userRole || "admin"
      };
      
      // Add new message to state
      setGroupMessages(prev => [...prev, newMessage]);
      setMessageText("");
      
      // Update the last message in groups list
      setGroups(prev => prev.map(g => 
        g.groupId === selectedGroup.groupId 
          ? { ...g, messages: messageText.trim() }
          : g
      ));
      
      // Scroll to bottom
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ 
            behavior: 'smooth',
            block: 'end'
          });
        }
      }, 100);

      console.log("✅ Message added to UI state");

    } else {
      console.error("❌ Unexpected response:", response.data);
      alert(`Message sent but received unexpected response: ${response.data.message || response.statusText}`);
    }

  } catch (error: any) {
    console.error("❌ ERROR SENDING MESSAGE:", error);
    
    // Detailed error handling
    if (error.response) {
      console.error("Error Response:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
      
      switch (error.response.status) {
        case 403:
          alert(
            `ACCESS DENIED (403)\n\n` +
            `The server rejected your message.\n` +
            `Reason: ${error.response.data?.message || 'Not authorized'}\n\n` +
            `This usually means:\n` +
            `1. Your user session has changed\n` +
            `2. The group was modified on the server\n` +
            `3. You've been removed from the group\n\n` +
            `Please refresh the page and try again. If the issue persists, contact the group organizer.`
          );
          break;
          
        case 404:
          alert(`Group not found. It may have been deleted. Please refresh the page.`);
          break;
          
        case 400:
          alert(`Bad request: ${error.response.data.message || 'Invalid data format'}`);
          break;
          
        case 401:
          alert(`Session expired. Please login again.`);
          break;
          
        default:
          alert(`Server error: ${error.response.data?.message || error.message}`);
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
      alert("Network error. Please check your internet connection and try again.");
    } else {
      console.error("Request setup error:", error.message);
      alert(`Error: ${error.message}`);
    }
    
    // Try to refresh group data on error
    if (selectedGroup) {
      console.log("🔄 Attempting to refresh group data...");
      refreshGroupMembership(selectedGroup.groupId);
    }
  }
  
  console.log("=== MESSAGE SEND PROCESS COMPLETE ===");
};

const refreshGroupMembership = async (groupId: string) => {
  try {
    console.log(`🔄 Refreshing group membership for: ${groupId}`);
    
    const token = getAuthToken();
    if (!token) {
      console.error("❌ No auth token for refresh");
      return;
    }

    const response = await axios.get(
      `${GROUP_API_URL}/${groupId}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        },
        params: {
          _t: Date.now() // Prevent caching
        }
      }
    );

    console.log("🔄 Refresh response:", response.data);

    if (response.data.status === "success" && response.data.data) {
      const updatedGroup = response.data.data;
      
      console.log("✅ Group data refreshed:", {
        id: updatedGroup.groupId,
        name: updatedGroup.GroupName,
        organizer: updatedGroup.groupMessageOrganizer,
        participants: updatedGroup.groupMessageParticipant?.length || 0
      });
      
      // Update the selected group in state
      setSelectedGroup(updatedGroup);
      
      // Update the groups list
      setGroups(prev => 
        prev.map(g => g.groupId === groupId ? updatedGroup : g)
      );
      
      // Show success message
      alert(`Group "${updatedGroup.GroupName}" refreshed successfully!\n\n` +
            `Organizer: ${updatedGroup.groupMessageOrganizer?.organizerName}\n` +
            `Participants: ${updatedGroup.groupMessageParticipant?.filter((p: { isRemoved: any; }) => !p.isRemoved).length || 0}`);
      
      return updatedGroup;
    } else {
      console.error("❌ Refresh failed - invalid response format");
      alert("Failed to refresh group data. Invalid server response.");
    }
  } catch (error: any) {
    console.error("❌ Error refreshing group:", error);
    
    let errorMessage = "Failed to refresh group data.";
    
    if (error.response?.status === 404) {
      errorMessage = "Group not found. It may have been deleted.";
      // Remove from local state if group doesn't exist
      setGroups(prev => prev.filter(g => g.groupId !== groupId));
      if (selectedGroup?.groupId === groupId) {
        setSelectedGroup(null);
        setGroupMessages([]);
      }
    } else if (error.response?.status === 403) {
      errorMessage = "You no longer have access to this group.";
    }
    
    alert(errorMessage);
  }
};

  // Send private message
  const handleSendMessage = async () => {
    if (!selectedUser || !messageText.trim() || !userId) {
      console.error("❌ Missing required data for private message");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      console.error("❌ Admin auth token not found");
      alert("Please login again");
      return;
    }

    try {
      const newMessage: IMessagesend = {
        messages: messageText.trim(),
        isRead: false,
        senderId: userId,
        senderName: userName || "Admin",
        senderEmail: userEmail || "admin@blackstone.com",
        receiverId: selectedUser._id || selectedUser.userId,
        receiverName: selectedUser.userName,
        receiverEmail: selectedUser.email,
        notificationStatus: "Unseen",
        status: "Active",
        createdDate: new Date(),
        createdBy: userName || "Admin",
        updatedDate: new Date(),
        updatedBy: userName || "Admin"
      };

      console.log("📤 ADMIN - Sending private message:", newMessage);

      const response = await axios.post(
        "https://api.blackstoneinfomaticstech.com/realtimemessage", 
        newMessage, 
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ ADMIN - Private message response:", response.data);

      if (response.data?.status === "success" || response.status === 200) {
        // Create a message object for UI
        const convertedMessage: IMessage = {
          _id: response.data.data?._id || `msg_${Date.now()}`,
          messages: newMessage.messages,
          senderId: newMessage.senderId,
          senderName: newMessage.senderName,
          receiverId: newMessage.receiverId,
          receiverName: newMessage.receiverName,
          createdDate: newMessage.createdDate.toISOString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          notificationStatus: newMessage.notificationStatus,
          isRead: false,
          status: newMessage.status,
        };

        // Add message to UI state
        setMessages((prev) => {
          const dateKey = new Date(convertedMessage.createdDate).toISOString().split("T")[0];
          const existingGroupIndex = prev.findIndex((group) => group._id === dateKey);

          if (existingGroupIndex !== -1) {
            const updated = [...prev];
            updated[existingGroupIndex] = {
              ...updated[existingGroupIndex],
              messages: [...updated[existingGroupIndex].messages, convertedMessage],
            };
            return updated;
          } else {
            return [
              ...prev,
              {
                _id: dateKey,
                messages: [convertedMessage],
              },
            ];
          }
        });

        setMessageText("");
        
        // Scroll to bottom
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);

      } else {
        console.error("ADMIN - Error posting message:", response.data?.message || response.statusText);
        alert(`Failed to send message: ${response.data?.message || response.statusText}`);
      }
    } catch (error: any) {
      console.error("❌ ADMIN - Error sending private message:", error);
      
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
      } else if (error.response?.status === 400) {
        alert(`Bad request: ${error.response.data.message}`);
      } else {
        alert(`Failed to send message: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  // Combined send message handler
  const handleSendMessageWrapper = async () => {
    if (selectedGroup) {
      await sendGroupMessage();
    } else if (selectedUser) {
      await handleSendMessage();
    }
  };

  // Filter users based on search and active tab
  const combinedUsers = React.useMemo(() => {
  const allCombined = [
    ...teachers,
    ...admins,
    ...students,
    ...supervisors,
    ...academicCoaches
  ];

  console.log(`📊 Combined Users Count: ${allCombined.length}`);
  console.log(`📊 Breakdown: ${teachers.length} teachers, ${admins.length} admins, ${students.length} students`);

  // Filter by active tab
  if (activeTab === "all") return allCombined;
  if (activeTab === "teachers") return teachers;
  if (activeTab === "admins") return admins;
  if (activeTab === "students") return students;
  if (activeTab === "supervisors") return supervisors;
  if (activeTab === "academicCoaches") return academicCoaches;
  
  return allCombined;
}, [activeTab, teachers, admins, students, supervisors, academicCoaches]);
  
  const filteredUsers = combinedUsers.filter(
    (user) =>
      user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Fetch groups where the user is a member
  const fetchGroups = async () => {
    console.log("🔄 Fetching groups where user is a member...");
    setLoadingGroups(true);
    
    try {
      const token = getAuthToken();
      if (!token) {
        console.error("❌ No auth token");
        setLoadingGroups(false);
        return;
      }

      const endpoint = GROUP_API_URL;
      
      const response = await axios.get(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        timeout: 15000,
      });

      console.log("✅ API Response status:", response.status);
      
      if (response.data.status === "success") {
        const groupsData = response.data.data || [];
        console.log(`📊 Found ${groupsData.length} total groups from API`);
        
        // Filter groups where user is a member
        const userGroups = groupsData.filter((group: IGroup) => {
          const isMember = isUserMemberOfGroup(group);
          return isMember;
        });
        
        console.log(`👤 User is member of ${userGroups.length} groups`);
        
        // Log detailed info about each group
        userGroups.forEach((group: IGroup) => {
          console.log(`Group: ${group.GroupName}`);
          console.log(`  Organizer: ${group.groupMessageOrganizer?.organizerName}`);
          console.log(`  Participants: ${group.groupMessageParticipant?.length || 0}`);
        });
        
        setGroups(userGroups);
      } else {
        console.error("API error:", response.data.message);
        setGroups([]);
      }
      
    } catch (error: any) {
      console.error("❌ Error fetching groups:", error);
      setGroups([]);
    } finally {
      setLoadingGroups(false);
    }
  };

  // Fetch private messages
  const fetchMessages = async (receiverId: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error("❌ Admin auth token not found");
        return;
      }

      if (!userId) {
        console.error("Admin ID not found in localStorage");
        return;
      }

      console.log(`📨 ADMIN - Fetching messages between ${userId} and ${receiverId}`);
      
      const { data } = await axios.get<IMessageResponse>(
        `https://api.blackstoneinfomaticstech.com/realtimemessage/${userId}/${receiverId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ ADMIN - Messages fetched:", data);

      const fetchedMessages = data?.data || [];
      setMessages(fetchedMessages);

      // Calculate unread count
      const allMessages = (Array.isArray(fetchedMessages) ? fetchedMessages : []).flatMap((group: any) =>
        Array.isArray(group.messages) ? group.messages : []
      );
      const unreadCount = allMessages.filter((m: any) => m.receiverId === userId && !m.isRead).length;
      setMessageCount(prev => prev + unreadCount);
      
    } catch (error: any) {
      console.error("❌ ADMIN - Error fetching messages:", error);
      if (error.response?.status === 404) {
        console.log("No messages yet between these users");
        setMessages([]);
      } else if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
      }
    }
  };

  const fetchGroupMessages = async (groupId: string) => {
    console.log(`📨 ADMIN - Fetching messages for group: ${groupId}`);
    
    try {
      const token = getAuthToken();
      if (!token) {
        setGroupMessages([]);
        return;
      }

      const response = await axios.get(
        `${GROUP_API_URL}/${groupId}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      console.log("✅ ADMIN - Messages API Response:", response.data);

      if (response.data.status === "success" && response.data.data) {
        const messages = response.data.data.messages || [];
        console.log(`📝 ADMIN - Found ${messages.length} messages for group ${groupId}`);
        
        const formattedMessages: IGroupMessage[] = messages.map((msg: any) => ({
          _id: msg._id,
          groupId: msg.groupId,
          message: msg.message || msg.messages || "",
          isRead: msg.isRead || false,
          groupMessageParticipant: msg.groupMessageParticipant || [],
          groupMessageOrganizer: msg.groupMessageOrganizer || {
            organizerId: msg.senderId || "",
            organizerName: msg.senderName || "Unknown",
            organizerEmail: "",
            role: msg.senderRole || "unknown"
          },
          notificationStatus: msg.notificationStatus || "Unseen",
          status: msg.status || "Active",
          createdDate: msg.createdDate || new Date().toISOString(),
          
          senderId: msg.senderId,
          senderName: msg.senderName || msg.createdBy,
          senderRole: msg.senderRole || msg.groupMessageOrganizer?.role
        }));

        // Sort by date in ASCENDING order (oldest first, newest last)
        const sortedMessages = formattedMessages.sort((a: any, b: any) => 
          new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
        );
        
        setGroupMessages(sortedMessages);
        
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        console.log("ADMIN - No messages found or error in response");
        setGroupMessages([]);
      }

    } catch (error: any) {
      console.error("❌ ADMIN - Error fetching messages:", error);
      setGroupMessages([]);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowGroupMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Socket.io setup
  useEffect(() => {
    if (!userId) return;

    if (!socketRef.current) {
      socketRef.current = io(API_BASE_URL, {
        transports: ["websocket"],
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to Socket.IO with ID:", socketRef.current?.id);
        socketRef.current?.emit("subscribe", userId);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from Socket.IO");
      });

      socketRef.current.on("connect_error", (err: any) => {
        console.error("Connection error:", err);
      });
    }

    const handleNewMessage = (newMessage: IMessage) => {
      const isForCurrentChat =
        (newMessage.senderId === userId &&
          newMessage.receiverId === selectedUser?._id) ||
        (newMessage.senderId === selectedUser?._id &&
          newMessage.receiverId === userId);

      if (newMessage.receiverId === userId && !newMessage.isRead) {
        setMessageCount((prev) => prev + 1);
      }

      if (isForCurrentChat) {
        setMessages((prev) => {
          const dateKey = new Date(newMessage.createdDate)
            .toISOString()
            .split("T")[0];
          const existingGroupIndex = prev.findIndex(
            (group) => group._id === dateKey
          );

          const newState = [...prev];

          if (existingGroupIndex !== -1) {
            newState[existingGroupIndex] = {
              ...newState[existingGroupIndex],
              messages: [...newState[existingGroupIndex].messages, newMessage],
            };
          } else {
            newState.unshift({
              _id: dateKey,
              messages: [newMessage],
            });
          }

          return newState;
        });

        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    };

    socketRef.current.on("newmessage", handleNewMessage);

    // Fetch initial data
    fetchAllUsers();

    return () => {
      socketRef.current?.off("newmessage", handleNewMessage);
    };
  }, [userId, selectedUser]);

  // Fetch groups when group view is active
  useEffect(() => {
    if (activeView === "groups") {
      fetchGroups();
      fetchAllUsers();
      fetchAlStudents(); // Ensure AlStudents are fetched
    } else {
      setSelectedGroup(null);
      setShowGroupInfo(null);
    }
  }, [activeView]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && (groupMessages.length > 0 || messages.length > 0)) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [groupMessages, messages]);

  if (!isClient) {
    return (
      <BaseLayout4>
        <AdminHeader currentSection="Message" />
        <div className="py-3 px-5">
          <div className="flex flex-col md:flex-row gap-4 h-[85vh]">
            <div className="w-full md:w-[350px] bg-[#fff] dark:bg-[#343434] p-4 rounded-[12px] shadow-md flex flex-col">
              <div className="animate-pulse">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              </div>
            </div>
          </div>
        </div>
      </BaseLayout4>
    );
  }

  // ==================== RENDER FUNCTIONS ====================

  // Render Group Menu
  const renderGroupMenu = () => (
    <div
      ref={menuRef}
      className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#3a3a3a] 
                 rounded-xl shadow-lg z-50 overflow-hidden"
      style={{
        top: `${groupMenuPosition.y}px`,
        left: `${groupMenuPosition.x}px`,
        position: "fixed",
      }}
    >
      {/* ADD PEOPLE */}
      <button
        onClick={() => openGroupManagementModal('add')}
        className="w-full text-left px-5 py-4 text-[15px] font-medium 
                   text-[#0A1A34] dark:text-gray-200 
                   hover:bg-gray-100 dark:hover:bg-[#4a4a4a] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span>Add People</span>
        </div>
      </button>

      <div className="border-t border-gray-200 dark:border-gray-700"></div>

      {/* REMOVE PEOPLE */}
      <button
        onClick={() => openGroupManagementModal('remove')}
        className="w-full text-left px-5 py-4 text-[15px] font-medium 
                   text-[#0A1A34] dark:text-gray-200 
                   hover:bg-gray-100 dark:hover:bg-[#4a4a4a] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span>Remove People</span>
        </div>
      </button>

      <div className="border-t border-gray-200 dark:border-gray-700"></div>

      {/* CLEAR CONVERSATION */}
      <button
        onClick={handleClearConversation}
        className="w-full text-left px-5 py-4 text-[15px] font-medium 
                   text-[#0A1A34] dark:text-gray-200 
                   hover:bg-gray-100 dark:hover:bg-[#4a4a4a] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span>Clear Conversation</span>
        </div>
      </button>

      <div className="border-t border-gray-200 dark:border-gray-700"></div>

      {/* DELETE GROUP */}
      <button
        onClick={handleDeleteGroup}
        className="w-full text-left px-5 py-4 text-[15px] font-medium 
                  text-[#0A1A34] dark:text-gray-200 
                   hover:bg-gray-100 dark:hover:bg-[#4a4a4a] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span>Delete Group</span>
        </div>
      </button>
    </div>
  );

  // Render Group Management Modal - UPDATED to show students
  const renderGroupManagementModal = () => (
    showGroupManagementModal && selectedGroup && (
      <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="relative w-full max-w-[500px] bg-white dark:bg-[#2c2c2c] rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.15)]"
        >
          {/* HEADER */}
          <div className="p-6 border-b border-gray-200 dark:border-[#505050]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-[#010E30] dark:text-white">
                  {modalType === 'add' ? 'Add People to Group' : 'Remove People from Group'}
                </h2>
                {modalType === 'add' && loadingUsers && (
                  <div className="w-4 h-4 border-2 border-[#576CBC] border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {modalType === 'add' && (
                  <button
                    onClick={async () => {
                      setLoadingUsers(true);
                      await fetchAllUsers();
                      setLoadingUsers(false);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3a3a]"
                    title="Refresh user list"
                  >
                    <svg 
                      className={`w-5 h-5 text-gray-500 dark:text-gray-300 ${loadingUsers ? 'animate-spin' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                      />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowGroupManagementModal(false);
                    setSelectedUsersForManagement([]);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3a3a]"
                >
                  <FiX size={20} className="text-gray-500 dark:text-gray-300" />
                </button>
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="max-h-[60vh] overflow-y-auto p-6">
            {modalType === 'add' ? (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Select users to add to the group "{selectedGroup.GroupName}":
                </p>
                
                {/* Search */}
                <div className="relative mb-3">
                  <FiSearch
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    className="w-full pl-10 pr-3 py-2 border rounded-lg bg-gray-100 text-sm dark:bg-[#2e2e2e] border-gray-200 dark:border-gray-600 dark:text-white"
                    value={managementSearch}
                    onChange={(e) => setManagementSearch(e.target.value)}
                  />
                </div>
                
                {/* Available users list - UPDATED to include AlStudents */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {loadingUsers ? (
                    <div className="text-center py-4">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#576CBC]"></div>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Loading users...
                      </p>
                    </div>
                  ) : (
                    <>
                      {allUsers
                        .filter(user => {
                          // Filter out current group members
                          const isAlreadyMember = selectedGroup.groupMessageParticipant.some(
                            p => p.participantId === user.userId && !p.isRemoved
                          );
                          const isCurrentUser = user.userId === userId;
                          const matchesSearch = managementSearch ? 
                            user.userName.toLowerCase().includes(managementSearch.toLowerCase()) ||
                            (user.email && user.email.toLowerCase().includes(managementSearch.toLowerCase())) : true;
                          
                          return !isAlreadyMember && !isCurrentUser && matchesSearch;
                        })
                        .map((user) => (
                          <div key={user.userId} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-[#3a3a3a] rounded-lg transition-colors">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedUsersForManagement.includes(user.userId)}
                                onChange={() => handleUserToggleForManagement(user.userId)}
                                className="w-4 h-4 accent-[#4A5ACF]"
                              />
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {user.userName}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {user.email}
                                </span>
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role?.[0] || '')}`}>
                              {formatRole(user.role)}
                            </span>
                          </div>
                        ))}
                      
                      {/* Also show AlStudents in the list */}
                      {alStudents
                        .filter(student => {
                          const isAlreadyMember = selectedGroup.groupMessageParticipant.some(
                            p => p.participantId === student.studentId && !p.isRemoved
                          );
                          const matchesSearch = managementSearch ? 
                            student.studentName.toLowerCase().includes(managementSearch.toLowerCase()) ||
                            (student.email && student.email.toLowerCase().includes(managementSearch.toLowerCase())) : true;
                          
                          return !isAlreadyMember && matchesSearch;
                        })
                        .map((student) => (
                          <div key={student.studentId} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-[#3a3a3a] rounded-lg transition-colors">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedUsersForManagement.includes(student.studentId)}
                                onChange={() => handleUserToggleForManagement(student.studentId)}
                                className="w-4 h-4 accent-[#4A5ACF]"
                              />
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {student.studentName} <span className="text-xs text-gray-500">(AlStudent)</span>
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {student.email || "No email"}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Student
                            </span>
                          </div>
                        ))}
                      
                      {allUsers.filter(user => {
                        const isAlreadyMember = selectedGroup.groupMessageParticipant.some(
                          p => p.participantId === user.userId && !p.isRemoved
                        );
                        const isCurrentUser = user.userId === userId;
                        return !isAlreadyMember && !isCurrentUser;
                      }).length === 0 && 
                      alStudents.filter(student => {
                        const isAlreadyMember = selectedGroup.groupMessageParticipant.some(
                          p => p.participantId === student.studentId && !p.isRemoved
                        );
                        return !isAlreadyMember;
                      }).length === 0 && (
                        <div className="text-center py-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            No users available to add. All users are already in this group.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Select users to remove from the group "{selectedGroup.GroupName}":
                </p>
                
                {/* Search */}
                <div className="relative mb-3">
                  <FiSearch
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search group members..."
                    className="w-full pl-10 pr-3 py-2 border rounded-lg bg-gray-100 text-sm dark:bg-[#2e2e2e] border-gray-200 dark:border-gray-600 dark:text-white"
                    value={managementSearch}
                    onChange={(e) => setManagementSearch(e.target.value)}
                  />
                </div>
                
                {/* Current group members list */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {selectedGroup.groupMessageParticipant
                    .filter(p => !p.isRemoved && p.participantId !== userId)
                    .filter(p => managementSearch ? 
                      p.participantName.toLowerCase().includes(managementSearch.toLowerCase()) ||
                      (p.participantEmail && p.participantEmail.toLowerCase().includes(managementSearch.toLowerCase())) : true)
                    .map((participant) => (
                      <div key={participant.participantId} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-[#3a3a3a] rounded-lg transition-colors">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedUsersForManagement.includes(participant.participantId)}
                            onChange={() => handleUserToggleForManagement(participant.participantId)}
                            className="w-4 h-4 accent-red-500"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {participant.participantName}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {participant.participantEmail}
                            </span>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(participant.role)}`}>
                          {participant.role}
                        </span>
                      </div>
                    ))}
                  
                  {selectedGroup.groupMessageParticipant.filter(p => !p.isRemoved && p.participantId !== userId).length === 0 && (
                    <div className="text-center py-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No other members in this group to remove.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {selectedUsersForManagement.length > 0 && (
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Selected: {selectedUsersForManagement.length} user{selectedUsersForManagement.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="p-5 border-t bg-gray-50 dark:bg-[#343434] rounded-b-xl">
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowGroupManagementModal(false);
                  setSelectedUsersForManagement([]);
                }}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white text-sm hover:bg-gray-100 dark:bg-[#2c2c2c] dark:text-gray-300 dark:border-[#505050]"
              >
                Cancel
              </button>
              <button
                onClick={modalType === 'add' ? handleAddPeople : handleRemovePeople}
                disabled={selectedUsersForManagement.length === 0}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium text-white
                  ${
                    selectedUsersForManagement.length === 0
                      ? "bg-gray-300 cursor-not-allowed dark:bg-gray-600"
                      : modalType === 'add' 
                        ? "bg-[#4A5ACF] hover:bg-[#3f4cb8]"
                        : "bg-red-600 hover:bg-red-700"
                  }`}
              >
                {modalType === 'add' ? 'Add Selected Users' : 'Remove Selected Users'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  );

  // Render Three Dot Menu
  const renderThreeDotMenu = () => (
    <div className="relative">
      <button
        onClick={handleGroupMenuClick}
        className="p-2 hover:bg-gray-100 dark:hover:bg-[#3a3a3a] rounded-full transition-colors"
      >
        <FiMoreVertical className="text-gray-600 dark:text-gray-300" size={18} />
      </button>

      {showGroupMenu && renderGroupMenu()}
    </div>
  );

  // ==================== MAIN RETURN ====================

  return (
    <BaseLayout4>
      <AdminHeader currentSection="Messages" />
      <div className="py-3 px-5">
        <div className="flex flex-col md:flex-row gap-4 h-[85vh]">
          {/* Left Panel */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full md:w-[350px] bg-[#fff] dark:bg-[#343434] dark:text-[#fff] p-4 rounded-[12px] shadow-md flex flex-col"
          >
            <div className="flex items-center space-x-3 p-2">
              <motion.div whileHover={{ scale: 1.05 }}>
                <img
                  src="/assets/images/account.png"
                  alt="Admin"
                  className="w-12 h-12 rounded-lg"
                />
              </motion.div>
              <div>
                <div className="flex">
                  <h3 className="text-[18px] font-medium text-[#010E30] dark:text-[#fff]">
                    {userName || "Admin"}
                  </h3>
                  {messageCount > 0 && (
                    <span className="ml-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {messageCount}
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-[#010e30a7] font-medium dark:text-[#fff] dark:opacity-[60%]">
                  Admin
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative mt-2 mb-3"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400 text-xs dark:border" />
              </div>
              <input
                type="text"
                placeholder="Search chats..."
                className="block w-full pl-10 pr-3 py-2 border border-[#CBCBCB] rounded-lg text-[12px] focus:outline-none focus:ring-1 focus:ring-[#576cbc] dark:text-[#fff] dark:opacity-[50%] dark:bg-[#343434] dark:border-[#504c4c]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>

            {/* Chats & Groups Tabs */}
            <div className="w-full bg-[#dfe4f6] dark:bg-[#2e2e2e] p-1 rounded-md flex mb-3">
              <button
                onClick={() => {
                  setActiveView("chats");
                  setIsCreatingGroup(false);
                  setSelectedGroup(null);
                  setShowGroupInfo(null);
                }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200
                  ${activeView === "chats"
                    ? "bg-[#4d67c1] text-white shadow-sm"
                    : "text-[#4d67c1] dark:text-white"
                  }`}
              >
                Chats
              </button>

              <button
                onClick={() => setActiveView("groups")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200
                  ${activeView === "groups"
                    ? "bg-[#4d67c1] text-white shadow-sm"
                    : "text-[#4d67c1] dark:text-white"
                  }`}
              >
                Groups
              </button>
            </div>

            {/* Content Area */}
            {activeView === "chats" ? (
              <>
                {/* Role Tabs */}
                <div className="relative border-b dark:border-[#505050]">
                  <div className="flex overflow-x-auto scrollbar-hide">
                    <button
                      className={`flex-shrink-0 px-3 py-2 text-[12px] font-medium whitespace-nowrap ${
                        activeTab === "all"
                          ? "text-[#576CBC] border-b-2 border-[#576CBC]"
                          : "text-[#010e30] dark:text-[#ffffff] hover:text-[#576CBC] dark:hover:text-[#576CBC]"
                      }`}
                      onClick={() => setActiveTab("all")}
                    >
                      All
                    </button>
                    <button
                      className={`flex-shrink-0 px-3 py-2 text-[12px] font-medium whitespace-nowrap ${
                        activeTab === "teachers"
                          ? "text-[#576CBC] border-b-2 border-[#576CBC]"
                          : "text-[#010e30] dark:text-[#ffffff] hover:text-[#576CBC] dark:hover:text-[#576CBC]"
                      }`}
                      onClick={() => setActiveTab("teachers")}
                    >
                      Teachers
                    </button>
                    <button
                      className={`flex-shrink-0 px-3 py-2 text-[12px] font-medium whitespace-nowrap ${
                        activeTab === "admins"
                          ? "text-[#576CBC] border-b-2 border-[#576CBC]"
                          : "text-[#010e30] dark:text-[#ffffff] hover:text-[#576CBC] dark:hover:text-[#576CBC]"
                      }`}
                      onClick={() => setActiveTab("admins")}
                    >
                      Admins
                    </button>
                    <button
                      className={`flex-shrink-0 px-3 py-2 text-[12px] font-medium whitespace-nowrap ${
                        activeTab === "students"
                          ? "text-[#576CBC] border-b-2 border-[#576CBC]"
                          : "text-[#010e30] dark:text-[#ffffff] hover:text-[#576CBC] dark:hover:text-[#576CBC]"
                      }`}
                      onClick={() => setActiveTab("students")}
                    >
                      Students
                    </button>
                    <button
                      className={`flex-shrink-0 px-3 py-2 text-[12px] font-medium whitespace-nowrap ${
                        activeTab === "supervisors"
                          ? "text-[#576CBC] border-b-2 border-[#576CBC]"
                          : "text-[#010e30] dark:text-[#ffffff] hover:text-[#576CBC] dark:hover:text-[#576CBC]"
                      }`}
                      onClick={() => setActiveTab("supervisors")}
                    >
                      Supervisors
                    </button>
                    <button
                      className={`flex-shrink-0 px-3 py-2 text-[12px] font-medium whitespace-nowrap ${
                        activeTab === "academicCoaches"
                          ? "text-[#576CBC] border-b-2 border-[#576CBC]"
                          : "text-[#010e30] dark:text-[#ffffff] hover:text-[#576CBC] dark:hover:text-[#576CBC]"
                      }`}
                      onClick={() => setActiveTab("academicCoaches")}
                    >
                      Academic Coaches
                    </button>
                  </div>
                </div>

                {/* User List */}
                <div className="mt-2 flex-1 overflow-y-auto scrollbar-none">
                  <AnimatePresence>
                    {filteredUsers.map((user) => (
                      <motion.button
                        key={user._id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`flex items-center border-b dark:border-b-[#505050] justify-between w-full p-2 cursor-pointer ${
                          selectedUser?._id === user._id
                            ? "bg-[#f0efef] dark:bg-[#3c3c3c] rounded"
                            : "hover:bg-[#f0efef] dark:hover:bg-[#3c3c3c] hover:rounded"
                        }`}
                        onClick={() => handleUserClick(user)}
                      >
                        <div className="flex space-x-2 items-center">
                          <div className="relative">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              className="w-9 h-9 bg-[#D0D0D0] dark:bg-[#444] rounded-lg flex items-center justify-center"
                            >
                              <span className="text-[#959595] dark:text-[#FFFFFF] font-medium text-[14px]">
                                {getUserInitials(user.userName)}
                              </span>
                            </motion.div>
                            <div
                              className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${getStatusColor(
                                user.status ?? "offline"
                              )}`}
                            ></div>
                          </div>
                          <div className="text-left">
                            <h5 className="font-medium text-[12px] text-[#010E30] dark:text-[#fff]">
                              {user.userName}
                            </h5>
                            <p className="text-[10px] text-gray-500 dark:text-[#fff] dark:text-opacity-[60%] truncate max-w-[180px]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`text-[12px] font-medium px-1.5 py-0.5 mt-0.5 rounded-full ${getRoleColor(user.role?.[0] || '')}`}>
                            {formatRole(user.role)}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              /* Groups List */
              <>
                <button
                  className="mb-4 py-2.5 px-4 bg-[#576CBC] text-white text-[13px] font-medium rounded-lg hover:bg-[#4758a5] transition-colors flex items-center justify-center"
                  onClick={() => {
                    setIsCreatingGroup(true);
                    setShowGroupModal(true);
                    setGroupStep(1);
                  }}
                >
                  Create Group
                </button>

                <div className="flex-1 overflow-y-auto">
                  {loadingGroups ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#576CBC]"></div>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                        Loading groups...
                      </p>
                    </div>
                  ) : (
                    <div>
                      {groups.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-gray-100 dark:bg-[#3a3a3a] rounded-full flex items-center justify-center mx-auto mb-4">
                            <HiUserGroup size={24} className="text-gray-400" />
                          </div>
                          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            No Groups Yet
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                            Create your first group or ask to be added to existing groups
                          </p>
                          <button
                            onClick={() => {
                              setIsCreatingGroup(true);
                              setShowGroupModal(true);
                              setGroupStep(1);
                            }}
                            className="px-4 py-2 bg-[#576CBC] text-white text-xs font-medium rounded-lg hover:bg-[#4758a5] transition-colors"
                          >
                            Create First Group
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {groups.map((group) => {
                            const lastMessage = getLastMessageForGroup(group.groupId);
                            const memberCount = group.groupMessageParticipant?.filter(p => !p.isRemoved).length || 0;
                            
                            return (
                              <div
                                key={group._id || group.groupId}
                                className={`p-3 bg-white dark:bg-[#3a3a3a] border border-gray-200 dark:border-[#505050] rounded-lg cursor-pointer hover:shadow-sm transition-all ${
                                  selectedGroup?.groupId === group.groupId
                                    ? "ring-1 ring-[#576CBC] border-[#576CBC] bg-blue-50 dark:bg-[#2a3a5a]"
                                    : ""
                                }`}
                                onClick={() => handleGroupClick(group)}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#576CBC] to-[#4758a5] text-white rounded-lg flex items-center justify-center">
                                      <HiUserGroup size={16} />
                                    </div>
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                      <h4 
                                        className="font-semibold text-sm text-gray-800 dark:text-white truncate cursor-pointer hover:text-[#576CBC] dark:hover:text-[#576CBC] transition-colors"
                                        onClick={(e) => handleGroupNameClick(e, group)}
                                      >
                                        {group.GroupName || "Unnamed Group"}
                                      </h4>
                                    </div>
                                    
                                    {/* Show member count and last message */}
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                                      {memberCount} {memberCount === 1 ? 'member' : 'members'}
                                    </p>
                                    
                                    {/* Show last message (not description) */}
                                    <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-1 truncate">
                                      {formatLastMessage(lastMessage)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>

          {/* Right Panel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full md:flex-1 bg-white dark:bg-[#2c2c2c] dark:text-[#fff] rounded-lg shadow-md flex flex-col overflow-hidden relative"
          >
            {/* === CREATE GROUP MODAL WITH WIZARD === */}
            {showGroupModal && isCreatingGroup && (
              <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseModal} />
                
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="relative w-full max-w-[520px] bg-white dark:bg-[#2c2c2c] rounded-xl shadow-xl"
                >
                  {/* HEADER */}
                  <div className="p-6 border-b border-gray-200 dark:border-[#505050] flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-[#010E30] dark:text-white">Create New Group</h2>
                    <button 
                      onClick={handleCloseModal}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3a3a]"
                    >
                      <FiX size={20} className="text-gray-500 dark:text-gray-300" />
                    </button>
                  </div>
                  {/* BODY */}
                  <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <AnimatePresence mode="wait">
                      {/* ================= STEP 1 ================= */}
                      {groupStep === 1 && (
  <motion.div
    key="step1"
    initial={{ x: 40, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -40, opacity: 0 }}
    className="space-y-4"
  >
    {/* GROUP NAME */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
        Group Name *
      </label>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Enter group name"
        className="w-full border rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#2c2c2c] border-gray-300 dark:border-[#505050] focus:ring-2 focus:ring-[#576CBC] outline-none"
        required
      />
    </div>

    {/* DESCRIPTION */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
        Description
      </label>
      <textarea
        value={groupDescription}
        onChange={(e) => setGroupDescription(e.target.value)}
        placeholder="Enter group description"
        rows={3}
        className="w-full border rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#2c2c2c] border-gray-300 dark:border-[#505050] focus:ring-2 focus:ring-[#576CBC] outline-none resize-none"
      />
    </div>

    {/* DESIGNATION */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
        Designation *
      </label>
      <select
        value={selectedDesignation}
        onChange={(e) => {
          setSelectedDesignation(e.target.value);
          // Reset course when designation changes to non-teacher/student
          if (!['Teacher', 'Student'].includes(e.target.value)) {
            setSelectedCourse("");
          }
        }}
        className="w-full border rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#2c2c2c]
                 border-gray-300 dark:border-[#505050]
                 focus:ring-2 focus:ring-[#576CBC] outline-none"
        required
      >
        <option value="">Select Designation</option>
        <option value="Teacher">Teacher</option>
        <option value="Student">Student</option>
        <option value="Academic Coach">Academic Coach</option>
        <option value="Supervisor">Supervisor</option>
        <option value="Admin">Admin</option>
      </select>
    </div>

    {/* COURSE - Only show for Teacher or Student */}
    {(selectedDesignation === "Teacher" || selectedDesignation === "Student") && (
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Course {selectedDesignation === "Teacher" || selectedDesignation === "Student" ? "*" : ""}
        </label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#2c2c2c]
                   border-gray-300 dark:border-[#505050]
                   focus:ring-2 focus:ring-[#576CBC] outline-none"
          required={selectedDesignation === "Teacher" || selectedDesignation === "Student"}
        >
          <option value="">Select Course</option>
          <option value="Arabic">Arabic</option>
          <option value="Quran">Quran</option>
          <option value="Islamic Studies">Islamic Studies</option>
        </select>
      </div>
    )}

    {/* PREFERRED TEACHER */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
        Preferred Teacher
      </label>
      <select
        value={selectedPreferredTeacher}
        onChange={(e) => setSelectedPreferredTeacher(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#2c2c2c]
                 border-gray-300 dark:border-[#505050]
                 focus:ring-2 focus:ring-[#576CBC] outline-none"
      >
        <option value="">Select Preferred Teacher</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
    </div>
  </motion.div>
)}

                      {/* ================= STEP 2 ================= */}
                      {groupStep === 2 && (
  <motion.div
    key="step2"
    initial={{ x: 40, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -40, opacity: 0 }}
    className="space-y-4"
  >
    {/* Role Tabs - Simplified */}
    <div className="flex bg-[#dfe4f6] dark:bg-[#3a3a3a] rounded-lg p-1">
      {["All", "Teachers", "Students", "Admins", "Supervisors", "Academic Coaches"].map(tab => (
        <button
          key={tab}
          onClick={() => setActiveRoleTab(tab)}
          className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${
            activeRoleTab === tab 
              ? "bg-[#576CBC] text-white" 
              : "text-[#576CBC] dark:text-gray-300 hover:text-[#576CBC] dark:hover:text-white"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>

    {/* Search */}
    <div className="relative">
      <FiSearch
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={searchEmp}
        onChange={(e) => setSearchEmp(e.target.value)}
        placeholder={`Search ${activeRoleTab.toLowerCase()} by name, email...`}
        className="w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-sm dark:bg-[#2c2c2c] border-gray-300 dark:border-[#505050] focus:ring-2 focus:ring-[#576CBC] outline-none"
      />
    </div>

    {/* All Select checkbox */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="selectAll"
          checked={allSelected}
          onChange={handleSelectAll}
          className="w-4 h-4 accent-[#576CBC]"
        />
        <label htmlFor="selectAll" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Select All
        </label>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {filteredEmployeesForWizard.length} users found
      </div>
    </div>

    {/* User List - Shows both TenantUsers and AlStudents */}
    <div className="space-y-2 max-h-[250px] overflow-y-auto">
      {loadingUsers ? (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#576CBC]"></div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Loading users...
          </p>
        </div>
      ) : filteredEmployeesForWizard.length === 0 ? (
        <div className="text-center py-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {searchEmp ? `No ${activeRoleTab.toLowerCase()} found matching your search` : `No ${activeRoleTab.toLowerCase()} available`}
          </p>
        </div>
      ) : (
        filteredEmployeesForWizard.map((user) => {
          const userId = isTenantUser(user) ? user.userId : user.studentId;
          const userName = isTenantUser(user) ? user.userName : user.studentName;
          const userEmail = isTenantUser(user) ? user.email : user.email;
          const userRole = isTenantUser(user) ? user.role : ["STUDENT"];
          const roleText = formatRole(userRole);
          
          return (
            <div 
              key={userId} 
              className={`flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-[#3a3a3a] rounded-lg transition-colors cursor-pointer ${
                selectedEmployees.includes(userId) ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700" : ""
              }`}
              onClick={() => handleEmployeeToggle(userId)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(userId)}
                    onChange={() => handleEmployeeToggle(userId)}
                    className="w-4 h-4 accent-[#576CBC]"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                    {getUserInitials(userName)}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-medium ${
                        selectedEmployees.includes(userId)
                          ? "text-[#576CBC] dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {userName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                      {userEmail || "No email"}
                    </span>
                  </div>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                roleText === "Teacher" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                roleText === "Student" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                roleText === "Admin" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
              }`}>
                {roleText}
              </span>
            </div>
          );
        })
      )}
    </div>

    {/* Selected List */}
    {selectedEmployees.length > 0 && (
      <div className="border-t border-gray-200 dark:border-[#505050] pt-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Selected ({selectedEmployees.length})
        </h4>
        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
          {selectedEmployees.map(userId => {
            const user = filteredEmployeesForWizard.find(u => {
              if (isTenantUser(u)) {
                return u.userId === userId;
              } else if (isAlStudent(u)) {
                return u.studentId === userId;
              }
              return false;
            });
            
            if (!user) return null;
            
            const userName = isTenantUser(user) ? user.userName : user.studentName;
            const userRole = isTenantUser(user) ? user.role : ["STUDENT"];
            const roleText = formatRole(userRole);
            
            return (
              <div 
                key={userId} 
                className="flex items-center gap-1 bg-gradient-to-r from-[#576CBC] to-[#4758a5] text-white px-3 py-1.5 rounded-full text-sm"
              >
                <span className="font-medium">{userName}</span>
                <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full ml-1">
                  {roleText}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEmployeeToggle(userId);
                  }}
                  className="ml-1 hover:text-red-200 transition-colors"
                >
                  <FiX size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    )}
  </motion.div>
)}

                      {/* ================= STEP 3 ================= */}
                      {groupStep === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ x: 40, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -40, opacity: 0 }}
                          className="space-y-4"
                        >
                          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            All Members <span className="text-[#576CBC]">{selectedEmployees.length}</span>
                          </h3>

                          {/* Group by role */}
                          {(() => {
                            const roleGroups = getGroupedMembers();
                            
                            if (selectedEmployees.length === 0) {
                              return (
                                <div className="text-center py-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    No members selected
                                  </p>
                                </div>
                              );
                            }
                            
                            return Object.entries(roleGroups).map(([roleName, users]) => (
                              <div key={roleName} className="mb-4">
                                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                                  {roleName} ({users.length})
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {users.map(user => {
                                    const userName = isTenantUser(user) ? user.userName : user.studentName;
                                    return (
                                      <span 
                                        key={isTenantUser(user) ? user.userId : user.studentId}
                                        className="inline-flex items-center gap-1 bg-gray-100 dark:bg-[#3a3a3a] text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                                      >
                                        {userName}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            ));
                          })()}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* FOOTER */}
                  <div className="p-4 border-t border-gray-200 dark:border-[#505050] flex justify-end gap-3 bg-gray-50 dark:bg-[#343434] rounded-b-xl">
                    {groupStep > 1 && (
                      <button
                        onClick={handlePrevStep}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white text-sm hover:bg-gray-100 dark:bg-[#2c2c2c] dark:text-gray-300 dark:border-[#505050]"
                      >
                        Back
                      </button>
                    )}

                    {groupStep < 3 ? (
                      <button
                        onClick={handleNextStep}
                        disabled={
                          (groupStep === 1 && !groupName.trim()) ||
                          (groupStep === 2 && selectedEmployees.length === 0)
                        }
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium text-white
                          ${(groupStep === 1 && !groupName.trim()) ||
                            (groupStep === 2 && selectedEmployees.length === 0)
                            ? "bg-gray-300 cursor-not-allowed dark:bg-gray-600"
                            : "bg-[#576CBC] hover:bg-[#4758a5]"
                          }`}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        onClick={createGroup}
                        disabled={!groupName.trim() || selectedEmployees.length === 0 || creatingGroup}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium text-white
                          ${
                            !groupName.trim() || selectedEmployees.length === 0 || creatingGroup
                              ? "bg-gray-300 cursor-not-allowed dark:bg-gray-600"
                              : "bg-[#576CBC] hover:bg-[#4758a5]"
                          }`}
                      >
                        {creatingGroup ? 'Creating...' : 'Done'}
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            )}

            {/* === GROUP MANAGEMENT MODAL === */}
            {renderGroupManagementModal()}

            {/* === CLEAR CONVERSATION CONFIRMATION POPUP === */}
            {showClearConfirm && (
              <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="relative w-full max-w-[400px] bg-white dark:bg-[#2c2c2c] rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.15)]"
                >
                  {/* HEADER */}
                  <div className="p-6 border-b border-gray-200 dark:border-[#505050]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <svg 
                          className="w-6 h-6 text-red-500" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                          />
                        </svg>
                        <h2 className="text-xl font-semibold text-[#010E30] dark:text-white">
                          Clear Conversation
                        </h2>
                      </div>
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3a3a]"
                      >
                        <FiX size={20} className="text-gray-500 dark:text-gray-300" />
                      </button>
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="w-16 h-16 mx-auto mb-3 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                        <svg 
                          className="w-8 h-8 text-red-500" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                          />
                        </svg>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium mb-2 text-center">
                        Are you sure you want to clear this conversation?
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        This action cannot be undone. All messages in this conversation will be permanently deleted.
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white text-sm hover:bg-gray-100 dark:bg-[#2c2c2c] dark:text-gray-300 dark:border-[#505050] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          await handleClearConversationConfirm();
                          setShowClearConfirm(false);
                        }}
                        className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* === DELETE GROUP CONFIRMATION POPUP === */}
            {showDeleteConfirm && (
              <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="relative w-full max-w-[400px] bg-white dark:bg-[#2c2c2c] rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.15)]"
                >
                  {/* HEADER */}
                  <div className="p-6 border-b border-gray-200 dark:border-[#505050]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <svg 
                          className="w-6 h-6 text-red-500" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                          />
                        </svg>
                        <h2 className="text-xl font-semibold text-[#010E30] dark:text-white">
                          Delete Group
                        </h2>
                      </div>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3a3a3a]"
                      >
                        <FiX size={20} className="text-gray-500 dark:text-gray-300" />
                      </button>
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="w-16 h-16 mx-auto mb-3 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                        <svg 
                          className="w-8 h-8 text-red-500" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                          />
                        </svg>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-medium mb-2 text-center">
                        Are you sure you want to delete this group?
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        This action cannot be undone. All messages and group data will be permanently deleted.
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white text-sm hover:bg-gray-100 dark:bg-[#2c2c2c] dark:text-gray-300 dark:border-[#505050] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          await handleDeleteGroupConfirm();
                          setShowDeleteConfirm(false);
                        }}
                        className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                      >
                        Delete Group
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* === GROUP INFO PANEL === */}
            {showGroupInfo && showGroupInfo.groupId === selectedGroup?.groupId ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-0 bg-white dark:bg-[#2c2c2c] p-4 z-20 overflow-y-auto"
              >
                {/* Back Button */}
                <button
                  onClick={() => setShowGroupInfo(null)}
                  className="flex items-center gap-1 text-2xl text-[#010e30] dark:text-white mb-3"
                >
                  ←
                </button>

                {/* Header Row */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-lg bg-gray-200 dark:bg-[#444] flex items-center justify-center text-lg font-semibold text-gray-700 dark:text-white">
                    {getGroupInitials(selectedGroup.GroupName)}
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-[15px] font-semibold text-[#010E30] dark:text-white">
                      {selectedGroup.GroupName}
                    </h2>
                    <span className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">
                      {selectedGroup.GroupNameDescription || "Loreum Ipsum..."}
                    </span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center justify-between border-b dark:border-[#505050] pb-2">
                  <button className="text-sm font-medium border-b-2 pb-1 border-[#506FD9] text-[#506FD9]">
                    All member
                  </button>
                  <span className="text-xs text-gray-400 dark:text-gray-300">
                    {selectedGroup.groupMessageParticipant?.filter(p => !p.isRemoved).length ?? 0}
                  </span>
                </div>

                {/* Search */}
                <div className="mt-3">
                  <input
                    className="w-full border border-gray-300 dark:border-[#505050] rounded-md bg-white dark:bg-[#2c2c2c] py-2 px-3 text-xs outline-none"
                    placeholder="Search"
                  />
                </div>

                {/* Member List */}
                <div className="max-h-72 overflow-y-auto mt-3">
                  {selectedGroup.groupMessageParticipant
                    ?.filter(p => !p.isRemoved)
                    .map((p) => (
                      <div
                        key={p.participantId}
                        className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-[#3a3a3a]"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-700 dark:text-gray-200">
                            {p.participantName}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {p.participantEmail}
                          </span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(p.role)}`}>
                          {p.role || "Member"}
                        </span>
                      </div>
                    ))}
                </div>
              </motion.div>
            ) : (
              /* === CHAT / EMPTY STATE === */
              <>
                {selectedUser ? (
                  /* PRIVATE CHAT VIEW */
                  <>
                    <div className="p-3 border-b dark:border-[#505050] flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-[#444] text-gray-500 rounded-lg flex items-center justify-center">
                            {getUserInitials(selectedUser.userName)}
                          </div>
                          <div
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${getStatusColor(
                              selectedUser.status ?? "offline"
                            )}`}
                          ></div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-[#010E30] dark:text-white">
                            {selectedUser.userName}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[12px] py-0.5 rounded-full text-[#010E30]/60`}>
                              {formatRole(selectedUser.role)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Private Messages */}
                    <div className="relative flex-1 h-[calc(85vh-100px)]">
                      <div className="absolute inset-0 overflow-y-auto p-4 flex flex-col bg-gray-50 dark:bg-[#2C2C2C] chat-scroll-container scrollbar-none">
                        <AnimatePresence>
                          {messages.length === 0 ? (
                            <div className="text-center py-8">
                              <div className="w-16 h-16 mx-auto bg-gray-200 dark:bg-[#444] rounded-full mb-3 flex items-center justify-center">
                                <svg
                                  className="w-8 h-8 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                  ></path>
                                </svg>
                              </div>
                              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                No Messages Yet
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Start a conversation with {selectedUser?.userName}
                              </p>
                            </div>
                          ) : (
                            messages.map((group) => (
                              <div key={group._id}>
                                <div className="text-center text-gray-500 text-xs my-2 font-medium">
                                  {formatDateLabel(group._id)}
                                </div>

                                {group.messages.map((msg) => (
                                  <motion.div 
                                    key={msg._id} 
                                    initial={{ opacity: 0, y: 10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    transition={{ duration: 0.2 }} 
                                    className={`flex flex-col mb-3 ${msg.senderId === userId ? "items-end" : "items-start"}`}
                                  >
                                    <motion.div 
                                      whileHover={{ scale: 1.01 }} 
                                      className={`p-3 rounded-lg max-w-[70%] ${
                                        msg.senderId === userId 
                                          ? "bg-[#576CBC] text-white" 
                                          : "bg-[#F1F1F1] dark:bg-[#3a3a3a]"
                                      }`}
                                    >
                                      <p className="text-sm">{msg.messages}</p>
                                      <div className={`flex items-center mt-1 ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}>
                                        <span className="text-[10px] opacity-70">
                                          {new Date(msg.createdDate).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </span>
                                        {msg.senderId === userId && (
                                          <span className="text-[10px] ml-2">{msg.isRead ? "✓✓" : "✓"}</span>
                                        )}
                                      </div>
                                    </motion.div>
                                  </motion.div>
                                ))}
                              </div>
                            ))
                          )}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                      </div>
                    </div>
                  </>
                ) : selectedGroup ? (
                  /* GROUP CHAT VIEW */
                  <>
                    <div className="p-3 border-b dark:border-[#505050] flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-10 h-10 bg-gradient-to-br from-[#576CBC] to-[#4758a5] text-white rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setShowGroupInfo(selectedGroup)}
                        >
                          {getGroupInitials(selectedGroup.GroupName)}
                        </div>
                        <div>
                          <h3
                            className="text-sm font-medium cursor-pointer hover:text-[#576CBC] dark:hover:text-[#576CBC] transition-colors"
                            onClick={() => setShowGroupInfo(selectedGroup)}
                          >
                            {selectedGroup.GroupName}
                          </h3>
                          {/* Show description if available */}
                          {selectedGroup.GroupNameDescription && (
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">
                              {selectedGroup.GroupNameDescription}
                            </p>
                          )}
                          {/* Show last message below description */}
                          <p className="text-[10px] text-gray-600 dark:text-gray-300 mt-0.5">
                            {formatLastMessage(getLastMessageForGroup(selectedGroup.groupId))}
                          </p>
                        </div>
                      </div>

                      {/* 3-dot menu */}
                      {renderThreeDotMenu()}
                    </div>

                    {/* Group Messages */}
                    <div className="relative flex-1 h-[calc(85vh-100px)]">
                      <div className="absolute inset-0 overflow-y-auto p-4 flex flex-col bg-gray-50 dark:bg-[#2C2C2C] chat-scroll-container scrollbar-none">
                        <AnimatePresence>
                          {groupMessages.length === 0 ? (
                            <div className="text-center py-8">
                              <div className="w-16 h-16 mx-auto bg-gray-200 dark:bg-[#444] rounded-full mb-3 flex items-center justify-center">
                                <HiUserGroup className="w-8 h-8 text-gray-400" />
                              </div>
                              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                No Messages Yet
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                Send the first message to start the conversation
                              </p>
                            </div>
                          ) : (
                            groupMessages.map((msg, index) => {
                              const isSentByMe = msg.senderId === userId;
                              const senderName = msg.senderName || "Unknown";
                              const senderRole = msg.senderRole || "Member";
                              const messageContent = msg.message || "";
                              
                              // Format time to match "10.00 AM" style
                              const formattedTime = new Date(msg.createdDate).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true
                              }).toUpperCase();
                              
                              // Check if we need to show date separator
                              const currentDate = new Date(msg.createdDate).toDateString();
                              const prevMessage = groupMessages[index - 1];
                              const prevDate = prevMessage ? new Date(prevMessage.createdDate).toDateString() : null;
                              const shouldShowDate = !prevMessage || currentDate !== prevDate;
                              
                              return (
                                <div key={msg._id}>
                                  {/* Date Separator - Only show when date changes */}
                                  
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mb-6 ${isSentByMe ? "text-right" : "text-left"}`}
                                  >
                                    {/* Received Message (Left side) */}
                                    {!isSentByMe && (
                                      <div className="flex items-start gap-3 mb-5">
                                        {/* Avatar */}
                                        <div className="flex-shrink-0">
                                          <div className="w-10 h-10 rounded-lg 
                                                        bg-[#EFEFEF] 
                                                        flex items-center justify-center 
                                                        text-gray-600 font-medium text-sm 
                                                        uppercase shadow-sm">
                                            {senderName ? senderName.split(" ").map(n => n[0]).join("") : "U"}
                                          </div>
                                        </div>

                                        {/* Content */}
                                        <div className="max-w-[70%]">
                                          {/* Name + Role */}
                                          <div className="mb-1">
                                            <p className="text-sm font-semibold text-[#0A1A34]">
                                              {senderName}
                                            </p>
                                            <p className="text-xs text-green-600 -mt-0.5">
                                              {senderRole}
                                            </p>
                                          </div>

                                          {/* Message Bubble */}
                                          <div className="bg-[#F7F7F7] dark:bg-[#2e2e2e] 
                                                          rounded-xl p-3 shadow-sm border border-gray-200 
                                                          dark:border-gray-600">
                                            <p className="text-[14px] text-[#0A1A34] dark:text-gray-100 leading-snug">
                                              {messageContent}
                                            </p>
                                            <div className="text-[11px] text-gray-500 dark:text-gray-400 text-right mt-1">
                                              {formattedTime}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Sent Message (Right side) */}
                                    {isSentByMe && (
                                      <div className="flex justify-end mb-5">
                                        <div className="flex flex-col items-end max-w-[70%]">
                                          {/* Avatar + Name/Role */}
                                          <div className="flex items-center gap-2 mb-1">
                                            {/* Avatar */}
                                            <div className="w-10 h-10 rounded-lg 
                                                          bg-[#EFEFEF] 
                                                          flex items-center justify-center 
                                                          text-gray-600 font-medium text-sm 
                                                          uppercase shadow-sm">
                                              {senderName ? senderName.split(" ").map(n => n[0]).join("") : "U"}
                                            </div>

                                            {/* Name + Role */}
                                            <div className="text-right">
                                              <p className="text-sm font-semibold text-[#0A1A34]">
                                                {senderName}
                                              </p>
                                              <p className="text-xs text-green-600 -mt-0.5">
                                                {senderRole}
                                              </p>
                                            </div>
                                          </div>

                                          {/* Message Bubble */}
                                          <div className="bg-[#576CBC] rounded-xl p-3 shadow-sm text-right">
                                            <p className="text-[14px] text-white leading-snug">
                                              {messageContent}
                                            </p>
                                            <div className="text-[11px] text-white/80 text-right mt-1">
                                              {formattedTime}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </motion.div>
                                </div>
                              );
                            })
                          )}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                      </div>
                    </div>
                  </>
                ) : (
                  /* EMPTY STATE */
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center h-full bg-gray-50 dark:bg-[#2C2C2C]"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto bg-gray-200 dark:bg-[#444] rounded-full mb-3 flex items-center justify-center">
                        {activeView === "chats" ? (
                          <svg
                            className="w-8 h-8 text-gray-400 dark:text-[#FFFFFF]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            ></path>
                          </svg>
                        ) : (
                          <HiUserGroup className="w-8 h-8 text-gray-400 dark:text-[#FFFFFF]" />
                        )}
                      </div>
                      <p className="text-xs text-[#010E30] dark:text-[#FFFFFF] opacity-60">
                        {activeView === "chats"
                          ? "Select a conversation to start chatting"
                          : "Select a group or create a new one"}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Message Input */}
                {(selectedUser || selectedGroup) && (
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="border-t border-gray-200 dark:border-[#505050] p-4 bg-white dark:bg-[#2c2c2c]"
                  >
                    <div className="flex items-center gap-2">
                      {/* Attachment button */}
                      <button className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <GrAttachment size={18} />
                      </button>
                      
                      {/* Message input */}
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder={
                            selectedUser 
                              ? `Message ${selectedUser.userName}...` 
                              : selectedGroup 
                                ? `Type a message...` 
                                : "Type a message..."
                          }
                          className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-[#3a3a3a] border border-gray-300 dark:border-[#505050] rounded-lg outline-none text-[#010E30] dark:text-[#FFFFFF] placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-1 focus:ring-[#576CBC] focus:border-transparent"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && messageText.trim()) {
                              handleSendMessageWrapper();
                            }
                          }}
                        />
                      </div>
                      
                      {/* Send button */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessageWrapper}
                        disabled={!messageText.trim()}
                        className={`p-3.5 rounded-lg flex items-center justify-center transition-all ${
                          messageText.trim()
                            ? "bg-gradient-to-r from-[#576CBC] to-[#4758a5] text-white hover:shadow-md"
                            : "bg-gray-200 dark:bg-[#505050] text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <FaTelegramPlane size={18} />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </BaseLayout4>
  );
};

export default Message;