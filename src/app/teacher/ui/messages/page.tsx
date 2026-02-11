"use client";

import BaseLayout2 from "@/components/BaseLayout2";
import React, { useState, useRef, useEffect, Key, ReactNode } from "react";
import { GrAttachment } from "react-icons/gr";
import { FaTelegramPlane } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiMoreVertical, FiUserPlus, FiUserMinus, FiTrash2, FiMessageSquare, FiLogOut, FiX } from "react-icons/fi";
import { HiUserGroup } from "react-icons/hi";
import axios from "axios";
import { io } from "socket.io-client";
import TeacherHeader from "@/app/teacher/components/TeacherHeader";

// Define interfaces
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
  senderId: string | null;
  isRead: boolean;
  createdDate: string;
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

// Add interfaces for Students
interface IStudent {
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

const isStudent = (user: any): user is IStudent => {
  return user && user.studentId !== undefined;
};

const API_BASE_URL = "http://localhost:5001";
const GROUP_API_URL = "http://localhost:5001/groupmessage";

const Message = () => {
  // User states
  const [academicCoaches, setAcademicCoaches] = useState<IUser[]>([]);
  const [admins, setAdmins] = useState<IUser[]>([]);
  const [students, setStudents] = useState<IUser[]>([]);
  const [supervisors, setSupervisors] = useState<IUser[]>([]);
  const [teachers, setTeachers] = useState<IUser[]>([]);
  const [allStudents, setAllStudents] = useState<IStudent[]>([]); // ADDED for Students
  
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

  // Teacher info - USING TEACHER KEYS
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("teacher");
  const [userEmail, setUserEmail] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  // Initialize teacher data - USING TEACHER KEYS
  useEffect(() => {
    setIsClient(true);
    
    // Try multiple localStorage keys for Teacher
    const name = localStorage.getItem("TeacherPortalName") || 
                 localStorage.getItem("TeacherName") || 
                 localStorage.getItem("TeacherUserName") ||
                 localStorage.getItem("Name") ||
                 "Teacher";
    
    const id = localStorage.getItem("TeacherPortalId") || 
               localStorage.getItem("TeacherId") ||
               localStorage.getItem("TeacherUserId") ||
               localStorage.getItem("UserId") ||
               localStorage.getItem("_id") ||
               localStorage.getItem("id") ||
               localStorage.getItem("teacherId");
    
    const email = localStorage.getItem("TeacherPortalEmail") || 
                  localStorage.getItem("TeacherEmail") || 
                  localStorage.getItem("Email") ||
                  "teacher@blackstone.com";
    
    const role = localStorage.getItem("TeacherRole") || 
                 localStorage.getItem("Role") || 
                 "teacher";
    
    console.log("🎯 TEACHER - User info loaded:", {
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

  // Get auth token - TEACHER VERSION
  const getAuthToken = () => {
    // Check all possible localStorage keys for Teacher
    const possibleKeys = [
      "TeacherAuthToken", "teacherAuthToken", "authToken", 
      "TeacherPortalToken", "token", "accessToken",
      "access_token", "jwtToken", "jwt"
    ];
    
    let token = null;
    
    for (const key of possibleKeys) {
      const value = localStorage.getItem(key);
      if (value) {
        console.log(`✅ TEACHER - Found token in localStorage key: "${key}"`);
        token = value;
        break;
      }
    }
    
    if (!token) {
      console.error("❌ TEACHER - No auth token found in localStorage");
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

  // Role mapping
  const roleMapping: Record<string, string> = {
    "TEACHER": "teacher",
    "STUDENT": "student",
    "ADMIN": "admin",
    "SUPERVISOR": "supervisor",
    "ACADEMICCOACH": "academiccoach",
    "ACADEMIC COACH": "academiccoach",
    "ACADEMIC_COACH": "academiccoach"
  };

  // Helper functions
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

  // Check if user is a member of a group
  const isUserMemberOfGroup = (group: IGroup): boolean => {
    if (!userId || !userName) {
      console.log("User ID or Name not available");
      return false;
    }
    
    // Clean and normalize IDs for comparison
    const currentUserId = userId.toString().trim().toLowerCase();
    const currentUserName = userName.toString().trim().toLowerCase();
    
    // Check if user is the organizer
    const organizerId = group.groupMessageOrganizer?.organizerId?.toString().trim().toLowerCase() || '';
    if (organizerId === currentUserId) {
      return true;
    }
    
    // Check organizer name as well
    const organizerName = group.groupMessageOrganizer?.organizerName?.toString().trim().toLowerCase() || '';
    if (organizerName === currentUserName) {
      return true;
    }
    
    // Check if user is a participant
    const isParticipant = group.groupMessageParticipant?.some(participant => {
      // Skip removed participants
      if (participant.isRemoved) return false;
      
      // Check participant ID
      const participantId = participant.participantId?.toString().trim().toLowerCase() || '';
      if (participantId === currentUserId) {
        return true;
      }
      
      // Check participant name as fallback - safely convert to string
      const participantName = participant.participantName || participant.userName;
      if (participantName) {
        const participantNameStr = String(participantName).trim().toLowerCase();
        if (participantNameStr === currentUserName) {
          return true;
        }
      }
      
      // Check participant email if available
      if (participant.participantEmail && userEmail) {
        const participantEmail = participant.participantEmail.toString().trim().toLowerCase();
        const currentUserEmail = userEmail.toString().trim().toLowerCase();
        if (participantEmail === currentUserEmail) {
          return true;
        }
      }
      
      return false;
    });
    
    return isParticipant;
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
    if (groupStep === 1 && !groupName.trim()) {
      alert("Please enter a group name");
      return;
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
      } else if (isStudent(user)) {
        return user.studentId;
      }
      return "";
    }).filter(id => id);
    
    if (!allSelected) {
      // Convert to array before spreading
      setSelectedEmployees([...selectedEmployees, ...allFilteredIds]);
    } else {
      // Use Array.from to iterate over the filtered IDs
      setSelectedEmployees(prev => prev.filter(id => !allFilteredIds.includes(id)));
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
    console.log(`👆 TEACHER - Selecting group: ${group.GroupName} (${group.groupId})`);
    setSelectedGroup(group);
    setSelectedUser(null);
    setGroupMessages([]);
    setShowGroupMenu(false);
    setShowGroupInfo(null);
    
    await fetchGroupMessages(group.groupId);
  };

  // Handle 3-dot menu click
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

  // Open Group Management Modal
  const openGroupManagementModal = (type: 'add' | 'remove') => {
    setModalType(type);
    setSelectedUsersForManagement([]);
    setManagementSearch("");
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

  // Add People to Group - API Integration
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

      // Get user details from allUsers
      const participants = selectedUsersForManagement.map(userId => {
        const user = allUsers.find(u => 
          u.userId === userId || 
          u._id === userId
        );
        
        if (!user) {
          console.warn(`User ${userId} not found`);
          return null;
        }
        
        const userRole = Array.isArray(user.role) ? user.role[0] : user.role || "TEACHER";
        const mappedRole = roleMapping[userRole.toUpperCase()] || "teacher";
        
        return {
          participantId: user.userId,
          participantName: user.userName,
          participantEmail: user.email,
          role: mappedRole as "teacher" | "student" | "admin" | "supervisor" | "academiccoach"
        };
      }).filter(user => user !== null);

      if (participants.length === 0) {
        alert("No valid users selected");
        return;
      }

      console.log("📤 TEACHER - Adding participants:", participants);

      const response = await axios.put(
        `${GROUP_API_URL}/add-participants/${selectedGroup.groupId}`,
        {
          participants: participants,
          updatedBy: userName || "Teacher"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ TEACHER - Add participants response:", response.data);

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
      console.error("❌ TEACHER - Error adding participants:", error);
      
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

      console.log("📤 TEACHER - Removing participants:", selectedUsersForManagement);

      const response = await axios.put(
        `${GROUP_API_URL}/remove-participants/${selectedGroup.groupId}`,
        {
          participantIds: selectedUsersForManagement,
          updatedBy: userName || "Teacher"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ TEACHER - Remove participants response:", response.data);

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
      console.error("❌ TEACHER - Error removing participants:", error);
      
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

      console.log("📤 TEACHER - Clearing conversation for group:", selectedGroup.groupId);

      const response = await axios.put(
        `${GROUP_API_URL}/clear-conversation`,
        {
          groupId: selectedGroup.groupId,
          deletedBy: userName || "Teacher"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ TEACHER - Clear conversation response:", response.data);

      if (response.status === 200) {
        alert("Conversation cleared successfully!");
        setGroupMessages([]);
        
        // Refresh messages
        await fetchGroupMessages(selectedGroup.groupId);
      }
    } catch (error: any) {
      console.error("❌ TEACHER - Error clearing conversation:", error);
      
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

      console.log("📤 TEACHER - Deleting group:", selectedGroup.groupId);

      const response = await axios.put(
        `${GROUP_API_URL}/soft-delete-group`,
        {
          groupId: selectedGroup.groupId,
          deletedBy: userName || "Teacher"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ TEACHER - Delete group response:", response.data);

      if (response.status === 200) {
        alert("Group deleted successfully!");
        
        // Update state
        setGroups(prev => prev.filter(g => g.groupId !== selectedGroup.groupId));
        setSelectedGroup(null);
        setGroupMessages([]);
        setShowGroupInfo(null);
      }
    } catch (error: any) {
      console.error("❌ TEACHER - Error deleting group:", error);
      
      if (error.response?.status === 404) {
        alert("Group not found. It may have already been deleted.");
      } else if (error.response?.status === 400) {
        alert(`Bad request: ${error.response.data.message}`);
      } else {
        alert(`Failed to delete group: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  // Fetch Students from your backend
  const fetchStudents = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await axios.get(
        `${API_BASE_URL}/students`, // Adjust this endpoint based on your backend
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("📊 TEACHER - Students API Response:", response.data);

      if (response.data.status === "success" && response.data.data) {
        const studentsData = response.data.data.students || response.data.data || [];
        
        const formattedStudents: IStudent[] = studentsData.map((student: any) => ({
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

        setAllStudents(formattedStudents);
        console.log(`✅ TEACHER - Loaded ${formattedStudents.length} Students`);
      }
    } catch (error: any) {
      console.error("❌ TEACHER - Error fetching Students:", error);
    }
  };

  // Fetch all users for group creation - INCLUDES Students
  const fetchAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = getAuthToken();
      if (!token) {
        console.error("❌ TEACHER - Auth token not found");
        setLoadingUsers(false);
        return;
      }

      console.log("🔄 TEACHER - Fetching all users...");

      // Fetch regular users
      const usersResponse = await axios.get(
        `${API_BASE_URL}/users`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("📊 TEACHER - Users API Response:", usersResponse.data);

      let usersData: any[] = [];

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

      // Normalize user data
      const normalizedUsers: IUser[] = usersData
        .filter((user: any) => user && (user.userName || user.name || user.email))
        .map((user: any) => {
          // Extract role
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

      console.log("✅ TEACHER - Normalized users:", normalizedUsers.length);
      setAllUsers(normalizedUsers);

      // Filter users by role
      const teachersList = normalizedUsers.filter(user => 
        user.role.some(role => role === 'TEACHER')
      );
      const adminsList = normalizedUsers.filter(user => 
        user.role.some(role => role === 'ADMIN')
      );
      const studentsList = normalizedUsers.filter(user => 
        user.role.some(role => role === 'STUDENT')
      );
      const supervisorsList = normalizedUsers.filter(user => 
        user.role.some(role => role === 'SUPERVISOR')
      );
      const academicCoachesList = normalizedUsers.filter(user => 
        user.role.some(role => role === 'ACADEMIC_COACH')
      );

      console.log(`👨‍🏫 TEACHER - Teachers: ${teachersList.length}`);
      console.log(`👨‍💼 TEACHER - Admins: ${adminsList.length}`);
      console.log(`🎓 TEACHER - Students: ${studentsList.length}`);
      console.log(`👨‍💼 TEACHER - Supervisors: ${supervisorsList.length}`);
      console.log(`👨‍🏫 TEACHER - Academic Coaches: ${academicCoachesList.length}`);

      // Set user lists
      setAcademicCoaches(academicCoachesList);
      setAdmins(adminsList);
      setStudents(studentsList);
      setSupervisors(supervisorsList);
      setTeachers(teachersList);

      // Also fetch Students
      await fetchStudents();

    } catch (error: any) {
      console.error("❌ TEACHER - Error fetching all users:", error);
      setAllUsers([]);
      setAcademicCoaches([]);
      setAdmins([]);
      setStudents([]);
      setSupervisors([]);
      setTeachers([]);
      setAllStudents([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Get filtered employees for wizard step 2
  const filteredEmployeesForWizard = React.useMemo(() => {
    // Combine all users and Students
    const allUsersForWizard = [
      ...allUsers.map(user => ({ ...user, type: 'tenant' as const })),
      ...allStudents.map(student => ({ ...student, type: 'student' as const }))
    ];

    // Filter by search
    let filtered = allUsersForWizard.filter(user => {
      if (user.type === 'tenant') {
        const userName = user.userName.toLowerCase();
        const userEmail = user.email.toLowerCase();
        const userRoles = user.role.join(' ').toLowerCase();
        const searchTerm = searchEmp.toLowerCase();
        
        return userName.includes(searchTerm) || 
               userEmail.includes(searchTerm) || 
               userRoles.includes(searchTerm);
      } else {
        const studentName = user.studentName.toLowerCase();
        const studentEmail = user.email.toLowerCase();
        const searchTerm = searchEmp.toLowerCase();
        
        return studentName.includes(searchTerm) || 
               studentEmail.includes(searchTerm);
      }
    });

    // Filter by role tab
    if (activeRoleTab !== "All") {
      filtered = filtered.filter(user => {
        if (user.type === 'tenant') {
          const roleText = formatRole(user.role);
          return roleText.toLowerCase() === activeRoleTab.toLowerCase();
        } else {
          // Students are always "Student" role
          return activeRoleTab.toLowerCase() === "students";
        }
      });
    }

    // Exclude current user
    filtered = filtered.filter(user => {
      if (user.type === 'tenant') {
        return user.userId !== userId;
      }
      return true; // Keep all Students
    });

    return filtered;
  }, [allUsers, allStudents, searchEmp, activeRoleTab, userId]);

  // Get grouped members for step 3
  const getGroupedMembers = () => {
    const groups: Record<string, Array<any>> = {};
    
    selectedEmployees.forEach(employeeId => {
      // Find user in combined list
      const user = filteredEmployeesForWizard.find(u => {
        if (isTenantUser(u)) {
          return u.userId === employeeId;
        } else if (isStudent(u)) {
          return u.studentId === employeeId;
        }
        return false;
      });
      
      if (user) {
        let roleName = "Other";
        
        if (isTenantUser(user)) {
          roleName = formatRole(user.role);
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
        console.error("❌ TEACHER - Auth token not found");
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
        participantEmail: userEmail || "teacher@blackstone.com",
        role: "teacher" as const,
        isRemoved: false,
        removedDate: undefined
      };

      // Process selected employees (both TenantUsers and Students)
      const otherParticipants = selectedEmployees.map((selectedId) => {
        // First check in TenantUsers
        const tenantUser = allUsers.find(u => u.userId === selectedId);
        if (tenantUser) {
          const userRole = Array.isArray(tenantUser.role) ? tenantUser.role[0] : tenantUser.role || "TEACHER";
          const mappedRole = roleMapping[userRole.toUpperCase()] || "teacher";

          return {
            userId: tenantUser.userId,
            userName: tenantUser.userName,
            participantId: tenantUser.userId,
            participantName: tenantUser.userName,
            participantEmail: tenantUser.email || "",
            role: mappedRole as "teacher" | "student" | "admin" | "supervisor" | "academiccoach",
            isRemoved: false,
            removedDate: undefined
          };
        }

        // Then check in Students
        const student = allStudents.find(s => s.studentId === selectedId);
        if (student) {
          return {
            userId: student.studentId,
            userName: student.studentName,
            participantId: student.studentId,
            participantName: student.studentName,
            participantEmail: student.email || "",
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
        CourseName: selectedCourse || "General",
        Designation: selectedDesignation || "Teacher",
        PreferredTeacher: selectedPreferredTeacher || "Male",
        
        groupMessageParticipant: participants,
        
        groupMessageOrganizer: {
          organizerId: userId,
          organizerName: userName,
          organizerEmail: userEmail || "teacher@blackstone.com",
          role: "teacher" as const,
        },

        messages: `Welcome to "${groupName}" group!`,
        isRead: false,
        notificationStatus: "Unseen" as const,
        createdBy: userName,
        status: "Active" as const,
      };

      console.log("📤 TEACHER - Sending group creation data");

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

      console.log("✅ TEACHER - Group creation response:", response.data);

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
      console.error("❌ TEACHER - Error creating group:", error);
      alert("Failed to create group. Please check console for details.");
    } finally {
      setCreatingGroup(false);
    }
  };

  // Send group message
  const sendGroupMessage = async () => {
    if (!selectedGroup || !messageText.trim() || !userId || !userName) {
      console.error("❌ TEACHER - Missing required data for sending message");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      alert("Please login again");
      return;
    }

    // Check membership
    const isMember = isUserMemberOfGroup(selectedGroup);
    
    if (!isMember) {
      alert("You are not a member of this group. Only members can send messages.");
      return;
    }

    try {
      const messagePayload = {
        groupId: selectedGroup.groupId,
        message: messageText,
        senderId: userId,
        senderName: userName,
        senderRole: "teacher",
        notificationStatus: "Unseen",
        status: "Active"
      };

      const response = await axios.post(
        `${GROUP_API_URL}/send-message`,
        messagePayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success || response.status === 200) {
        // Create new message object
        const newMessage: IGroupMessage = {
          _id: response.data.data?._id || `msg_${Date.now()}`,
          groupId: selectedGroup.groupId,
          message: messageText,
          isRead: false,
          groupMessageParticipant: selectedGroup.groupMessageParticipant.map(p => ({
            ...p,
            isRead: p.participantId === userId
          })),
          groupMessageOrganizer: {
            organizerId: userId,
            organizerName: userName,
            organizerEmail: userEmail || "teacher@blackstone.com",
            role: "teacher"
          },
          notificationStatus: "Unseen",
          status: "Active",
          createdDate: new Date().toISOString(),
          
          senderId: userId,
          senderName: userName,
          senderRole: "teacher"
        };
        
        // Add new message to END of array
        setGroupMessages(prev => [...prev, newMessage]);
        setMessageText("");
        
        // Scroll to bottom
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);

      } else {
        alert(`Failed: ${response.data.message}`);
      }

    } catch (error: any) {
      console.error("❌ TEACHER - Error sending message:", error);
      alert(`Failed to send message: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleUserClick = (user: IUser) => {
    setSelectedUser(user);
    setSelectedGroup(null);
    setMessages([]);
    setShowGroupInfo(null);
  };

  const handleSendMessage = async () => {
    if (selectedGroup) {
      await sendGroupMessage();
    }
  };

  // Filter users based on search and active tab
  const combinedUsers =
    activeTab === "all"
      ? [...teachers, ...admins, ...students, ...supervisors, ...academicCoaches]
      : activeTab === "teachers"
      ? teachers
      : activeTab === "admins"
      ? admins
      : activeTab === "students"
      ? students
      : activeTab === "supervisors"
      ? supervisors
      : academicCoaches;
  
  const filteredUsers = combinedUsers.filter(
    (user) =>
      user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Fetch groups where the user is a member
  const fetchGroups = async () => {
    console.log("🔄 TEACHER - Fetching groups where user is a member...");
    setLoadingGroups(true);
    
    try {
      const token = getAuthToken();
      if (!token) {
        console.error("❌ TEACHER - No auth token");
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

      console.log("✅ TEACHER - API Response status:", response.status);
      
      if (response.data.status === "success") {
        const groupsData = response.data.data || [];
        console.log(`📊 TEACHER - Found ${groupsData.length} total groups from API`);
        
        // Filter groups where teacher is a member
        const userGroups = groupsData.filter((group: IGroup) => {
          const isMember = isUserMemberOfGroup(group);
          return isMember;
        });
        
        console.log(`👤 TEACHER - User is member of ${userGroups.length} groups`);
        
        setGroups(userGroups);
      } else {
        console.error("TEACHER - API error:", response.data.message);
        setGroups([]);
      }
      
    } catch (error: any) {
      console.error("❌ TEACHER - Error fetching groups:", error);
      setGroups([]);
    } finally {
      setLoadingGroups(false);
    }
  };

  const fetchGroupMessages = async (groupId: string) => {
    console.log(`📨 TEACHER - Fetching messages for group: ${groupId}`);
    
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

      console.log("✅ TEACHER - Messages API Response:", response.data);

      if (response.data.status === "success" && response.data.data) {
        const messages = response.data.data.messages || [];
        console.log(`📝 TEACHER - Found ${messages.length} messages for group ${groupId}`);
        
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
        console.log("TEACHER - No messages found or error in response");
        setGroupMessages([]);
      }

    } catch (error: any) {
      console.error("❌ TEACHER - Error fetching messages:", error);
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
              isRead: false, // Fixed: Added missing property
              createdDate: dateKey // Fixed: Added missing property
            };
          } else {
            newState.unshift({
              _id: dateKey,
              messages: [newMessage],
              senderId: null,
              isRead: false, // Fixed: Added missing property
              createdDate: dateKey // Fixed: Added missing property
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
      <BaseLayout2>
        <TeacherHeader currentSection="Message" />
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
      </BaseLayout2>
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

  // Render Group Management Modal
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
              <h2 className="text-xl font-semibold text-[#010E30] dark:text-white">
                {modalType === 'add' ? 'Add People to Group' : 'Remove People from Group'}
              </h2>
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
                
                {/* Available users list */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
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
                  
                  {allUsers.filter(user => {
                    const isAlreadyMember = selectedGroup.groupMessageParticipant.some(
                      p => p.participantId === user.userId && !p.isRemoved
                    );
                    const isCurrentUser = user.userId === userId;
                    return !isAlreadyMember && !isCurrentUser;
                  }).length === 0 && (
                    <div className="text-center py-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No users available to add. All users are already in this group.
                      </p>
                    </div>
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
    <BaseLayout2>
      <TeacherHeader currentSection="Messages" />
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
                  alt="Teacher"
                  className="w-12 h-12 rounded-lg"
                />
              </motion.div>
              <div>
                <div className="flex">
                  <h3 className="text-[18px] font-medium text-[#010E30] dark:text-[#fff]">
                    {userName || "Teacher"}
                  </h3>
                  {messageCount > 0 && (
                    <span className="ml-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {messageCount}
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-[#010e30a7] font-medium dark:text-[#fff] dark:opacity-[60%]">
                  Teacher
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
                                    
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                                      {memberCount} {memberCount === 1 ? 'member' : 'members'}
                                    </p>
                                    
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

            {selectedUser ? (
              <>
                <div className="border-b border-gray-200 p-3">
                  <div className="flex items-center space-x-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative"
                    >
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600  text-sm">
                          {selectedUser.userName.charAt(0)}
                        </span>
                      </div>
                      <div
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${getStatusColor(
                          selectedUser.status ?? "offline"
                        )}`}
                      ></div>
                    </motion.div>
                    <div>
                      <h3 className="text-xs dark:text-[#FFFFFF] font-semibold">
                        {selectedUser.userName}
                      </h3>
                      <div className="flex items-center">
                        <span
                          className={`inline-block w-2 h-2 rounded-full mr-1 ${getStatusColor(
                            selectedUser.status ?? "offline"
                          )}`}
                        ></span>
                        <p className="text-[10px] dark:text-[#FFFFFF99]/60 text-gray-400 capitalize">
                          {selectedUser.status} • {selectedUser.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-3 overflow-y-auto dark:text-[#FFFFFF] dark:bg-[#343434] scrollbar-none bg-gray-50 flex flex-col">
                  {" "}
                  {/* Added flex-col-reverse */}
                  <AnimatePresence>
                    {[...messages].reverse().map(
                      (
                        msg // Reverse the messages array
                      ) => (
                        <motion.div
                          key={msg._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`flex flex-col mb-3 ${
                            msg.senderId === userId
                              ? "items-end"
                              : "items-start"
                          }`}
                        >
                          <motion.div
                            whileHover={{ scale: 1.01 }}
                            className={`p-2 rounded-lg max-w-[80%] shadow-sm dark:bg-[#343434] ${
                              msg.senderId === userId
                                ? "bg-[#576CBC]  text-white shadow-lg rounded-tr-none"
                                : "bg-[#F1F1F1] shadow-lg rounded-tl-none"
                            }`}
                          >
                            <p className="text-xs dark:text-[#FFFFFF]">{
                              // Fixed: Access the messages property correctly
                              msg.messages.length > 0 ? msg.messages[0]?.messages || "" : ""
                            }</p>
                            <div className="flex items-center justify-end mt-1 space-x-1">
                              <span className="text-[9px] opacity-70 dark:text-[#FFFFFF]">
                                {new Date(msg.createdDate).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                              {msg.senderId === userId && (
                                <span className="text-[9px]">
                                  {msg.isRead ? "✓✓" : "✓"}
                                </span>
                              )}
                            </div>
                          </motion.div>
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>
              </>
            ) : null}

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
                              Group Name
                            </label>
                            <input
                              type="text"
                              value={groupName}
                              onChange={(e) => setGroupName(e.target.value)}
                              placeholder="Name a Group"
                              className="w-full border rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#2c2c2c] border-gray-300 dark:border-[#505050] focus:ring-2 focus:ring-[#576CBC] outline-none"
                            />
                          </div>

                          {/* DESCRIPTION */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                              Description
                            </label>
                            <input
                              type="text"
                              value={groupDescription}
                              onChange={(e) => setGroupDescription(e.target.value)}
                              placeholder="Description"
                              className="w-full border rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#2c2c2c] border-gray-300 dark:border-[#505050] focus:ring-2 focus:ring-[#576CBC] outline-none"
                            />
                          </div>

                          {/* COURSE */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                              Course
                            </label>
                            <select
                              value={selectedCourse}
                              onChange={(e) => setSelectedCourse(e.target.value)}
                              className="w-full border rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#2c2c2c]
                                       border-gray-300 dark:border-[#505050]
                                       focus:ring-2 focus:ring-[#576CBC] outline-none"
                            >
                              <option value="">Select Course</option>
                              <option>Arabic</option>
                              <option>Quran</option>
                              <option>Islamic</option>
                              <option>General</option>
                            </select>
                          </div>

                          {/* DESIGNATION */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                              Designation
                            </label>
                            <select
                              value={selectedDesignation}
                              onChange={(e) => setSelectedDesignation(e.target.value)}
                              className="w-full border rounded-lg px-3 py-2 text-sm bg-white dark:bg-[#2c2c2c]
                                       border-gray-300 dark:border-[#505050]
                                       focus:ring-2 focus:ring-[#576CBC] outline-none"
                            >
                              <option value="">Select Designation</option>
                              <option>Teacher</option>
                              <option>Student</option>
                              <option>Academic Coach</option>
                              <option>Supervisor</option>
                              <option>Admin</option>
                            </select>
                          </div>

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
                              <option value="">Select Teacher</option>
                              <option>Male</option>
                              <option>Female</option>
                              <option>General</option>
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
                          {/* Role Tabs */}
                          <div className="flex bg-[#dfe4f6] dark:bg-[#3a3a3a] rounded-lg p-1">
                            {["All", "Teachers", "Students", "Supervisor", "Academic Coach", "Admin"].map(tab => (
                              <button
                                key={tab}
                                onClick={() => setActiveRoleTab(tab)}
                                className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${activeRoleTab === tab 
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
                              placeholder="Search by name, email, or role"
                              className="w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-sm dark:bg-[#2c2c2c] border-gray-300 dark:border-[#505050] focus:ring-2 focus:ring-[#576CBC] outline-none"
                            />
                          </div>

                          {/* All Select checkbox */}
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="selectAll"
                              checked={allSelected}
                              onChange={handleSelectAll}
                              className="w-4 h-4 accent-[#576CBC]"
                            />
                            <label htmlFor="selectAll" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              All Select
                            </label>
                          </div>

                          {/* User List - Shows both TenantUsers and Students */}
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
                                  {searchEmp ? 'No users found matching your search' : 'No users available. Please refresh the page.'}
                                </p>
                              </div>
                            ) : (
                              filteredEmployeesForWizard.map((user) => {
                                const userId = isTenantUser(user) ? user.userId : user.studentId;
                                const userName = isTenantUser(user) ? user.userName : user.studentName;
                                const userEmail = isTenantUser(user) ? user.email : user.email;
                                const userRole = isTenantUser(user) ? user.role : "student";
                                const roleText = formatRole(userRole);
                                
                                return (
                                  <div key={userId} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-[#3a3a3a] rounded-lg transition-colors">
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={selectedEmployees.includes(userId)}
                                        onChange={() => handleEmployeeToggle(userId)}
                                        className="w-4 h-4 accent-[#576CBC]"
                                      />
                                      <div className="flex flex-col">
                                        <span
                                          className={`text-sm font-medium ${
                                            selectedEmployees.includes(userId)
                                              ? "text-[#576CBC]"
                                              : "text-gray-700 dark:text-gray-300"
                                          }`}
                                        >
                                          {userName}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                                          {userEmail}
                                        </span>
                                      </div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(roleText)}`}>
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
                                Selected List ({selectedEmployees.length})
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedEmployees.map(userId => {
                                  const user = filteredEmployeesForWizard.find(u => {
                                    if (isTenantUser(u)) {
                                      return u.userId === userId;
                                    } else if (isStudent(u)) {
                                      return u.studentId === userId;
                                    }
                                    return false;
                                  });
                                  
                                  if (!user) return null;
                                  
                                  const userName = isTenantUser(user) ? user.userName : user.studentName;
                                  
                                  return (
                                    <div key={userId} className="flex items-center gap-1 bg-[#576CBC]/10 dark:bg-[#576CBC]/20 text-[#576CBC] dark:text-blue-300 px-3 py-1 rounded-full text-sm">
                                      <span>{userName}</span>
                                      <button
                                        onClick={() => handleEmployeeToggle(userId)}
                                        className="ml-1 hover:text-red-500"
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
                        <div ref={messagesEndRef} />
                        {/* Messages would go here */}
                      </div>
                    </div>
                  </>
                ) : selectedGroup ? (
                  /* GROUP CHAT VIEW */
                  <>
                    <div className="p-3 border-b dark:border-[#505050] flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-10 h-10 bg-gray-200 text-gray-500 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
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
                          <p className="text-[10px] text-gray-400">
                            {selectedGroup.GroupNameDescription || "Group chat"}
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
                              handleSendMessage();
                            }
                          }}
                        />
                      </div>
                      
                      {/* Send button */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSendMessage}
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
    </BaseLayout2>
  );
};

export default Message;