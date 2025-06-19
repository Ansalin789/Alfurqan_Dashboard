"use client";

import { useTheme } from "@/context/ThemeContext";
import { CalendarDays, Bell, Sun, Moon, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import LeaveForm from "@/app/Academic-coach/components/leaveRequest";
import StudentForm from "@/app/Academic-coach/components/addNewStudent";
import { getSocket } from "@/app/utils/socket";
import axios from "axios";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import AddMeeting from "@/app/Academic-coach/components/addMeeting";
import AddGroupAssignClass from "@/app/Academic-coach/components/addGroupAssignClass";
type Props = {
  readonly currentSection: string;
  readonly showBackButton?: boolean;
  readonly showBackPath?: string;
  readonly students?: string[];
};
type NotificationType = {
  _id: string;
  senderName: string;
  messages: string;
  createdDate: string;
  notificationType: string;
  notificationStatus: "Seen" | "Unseen";
  isRead: boolean;
};

export default function AcademicHeader({
  currentSection,
  showBackButton = false,
  showBackPath = "",
  students = [],
}: Props) {
  const theme: any = useTheme();
  const darkMode = theme?.darkMode ?? false;
  const toggleDarkMode = theme?.toggleDarkMode ?? (() => {});
  const [showNotification, setShowNotification] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [showAddMeeting, setAddMeetings] = useState(false);
  const [showAddApplicant, setAddApplicant] = useState(false);
  const [showAssignGroupClass, setAssignGroupClass] = useState(false);
  const router = useRouter();
  const notificationRef = useRef(null);
  const [activeTab, setActiveTab] = useState<"Seen" | "Unseen">("Unseen");
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [dashboardWrite, setDashboardWrite] = useState(false); // For Notifications
  const [leaveWrite, setLeaveWrite] = useState(false); // For Leave Request
  const [trailWrite, setTrailWrite] = useState(false); // For Add New Student
  const [calendarWrite, setCalendarWrite] = useState(false); // For Add Meeting
  const [studentListWrite, setStudentListWrite] = useState(false); // For Assign Group Class


  //roleAccessuseEffect


useEffect(() => {
  const roleAccessRaw = localStorage.getItem("AcademicRolePermission");
  if (roleAccessRaw) {
    try {
      const roleAccess = JSON.parse(roleAccessRaw);
      const modules = roleAccess?.academicmodules || roleAccess;

      console.log("✅ Modules being used:", modules);
      console.log("🔐 Dashboard write:", modules?.dashboard?.write);
      console.log("🔐 Leave write:", modules?.leave);

      setDashboardWrite(modules?.dashboard?.write ?? false);
      setLeaveWrite(modules?.leave ?? modules?.dashboard?.write ?? false);
      setTrailWrite(modules?.trailmanagement?.write ?? false);
      setCalendarWrite(modules?.schedule?.write ?? false);
      setStudentListWrite(modules?.managestudents?.write ?? false);
    } catch (error) {
      console.error("❌ Invalid AcademicRolePermission JSON", error);
    }
  }
}, []);






  // Fetch old notifications
  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("AcademicCoachPortalId")
      : null;
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("AcademicCoachAuthToken")
            : null;
        const userId =
          typeof window !== "undefined"
            ? localStorage.getItem("AcademicCoachPortalId")
            : null;
        const { data } = await axios.get(
          `https://api.blackstoneinfomaticstech.com/notification/getlist?receiverId=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const notifications = data?.data?.notifications ?? [];
        setNotifications(notifications);

        const unreadCount = notifications.filter((n: any) => !n.isRead).length;
        setNotificationCount(unreadCount);
      } catch (error) {
        console.error("❌ Failed to fetch notifications:", error);
      }
    };
    fetchNotifications();
  }, []);
  // Mark as Seen
  const handleNotificationClick = async (notificationId: string) => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("AcademicCoachAuthToken")
          : null;

      if (!token) {
        console.error("❌ AcademicAuthToken not found");
        return;
      }

      await axios.put(
        `https://api.blackstoneinfomaticstech.com/notification/${notificationId}`,
        {
          isRead: true,
          notificationStatus: "Seen",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId
            ? { ...n, isRead: true, notificationStatus: "Seen" }
            : n
        )
      );

      setNotificationCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("❌ Failed to mark as seen:", error);
    }
  };

  // Real-time notifications with Socket.IO
  useEffect(() => {
    const socket = getSocket(userId ?? "");

    const handleNotification = (newNotification: NotificationType) => {
      console.log("Received new notification:", newNotification);
      setNotifications((prev) => [newNotification, ...prev]);

      if (!newNotification.isRead) {
        setNotificationCount((prev) => prev + 1);
      }
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [userId]);
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "STUDENT_NOTIFICATION":
        return "🎓";
      case "TEACHER_ADDED":
        return "👩‍🏫";
      case "SYSTEM_ALERT":
        return "⚠️";
      case "MEETING_REMINDER":
        return "📅";
      case "MESSAGE":
        return "💬";
      case "ASSIGNMENT_ALERT":
        return "📝";
      default:
        return "🔔";
    }
  };

const renderButton = () => {
if (currentSection.includes("Dashboard") && leaveWrite){
      return (
      <button
        onClick={() => setShowLeaveForm(true)}
        className="bg-[#576CBC] hover:bg-[#4459A9] text-white text-sm px-4 py-2 rounded-lg"
      >
        Request for Leave
      </button>
    );
  }
  if (currentSection.includes("Trail Management") && trailWrite) {
    return (
      <button
        onClick={() => setAddApplicant(true)}
        className="bg-[#576CBC] hover:bg-[#4459A9] text-white text-sm px-4 py-2 rounded-lg"
      >
        Add New Student
      </button>
    );
  }
  if (currentSection.includes("Calendar") && calendarWrite) {
    return (
      <button
        onClick={() => setAddMeetings(true)}
        className="bg-[#576CBC] hover:bg-[#4459A9] text-white text-sm px-4 py-2 rounded-lg"
      >
        Add Meeting
      </button>
    );
  }
  if (currentSection.includes("Student List") && studentListWrite) {
    return (
      <button
        onClick={() => setAssignGroupClass(true)}
        className="bg-[#576CBC] hover:bg-[#4459A9] text-white text-sm px-4 py-2 rounded-lg"
      >
        Assign Group Class
      </button>
    );
  }
  return null;
};


  return (
    <div>
      <div className="flex justify-between items-center py-2 pl-1 mb-1">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <IoArrowBackCircleSharp
              className="text-[25px] text-[#012a4a] cursor-pointer dark:text-white"
              onClick={() => router.push(showBackPath)}
            />
          )}
          <h1 className="text-xl font-semibold text-[#000836] dark:text-white">
            {currentSection}
          </h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {renderButton()}
          <button
            onClick={() => router.push("/Academic-coach/ui/calendar")}
            className="p-2.5 bg-white dark:bg-gray-700 rounded-lg"
          >
            <CalendarDays className="w-4 h-4 text-gray-800 dark:text-white" />
          </button>
          <button
            onClick={() => setShowNotification(true)}
            className="relative p-2.5 bg-white dark:bg-gray-700 rounded-lg"
          >
            <Bell className="w-5 h-5 text-gray-800 dark:text-white" />

            {notificationCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#576CBC] text-white text-[10px] font-normal w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-md">
                {notificationCount}
              </span>
            )}
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-2.5 bg-white dark:bg-gray-700 rounded-lg"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-gray-800 dark:text-white" />
            ) : (
              <Moon className="w-4 h-4 text-gray-800 dark:text-white" />
            )}
          </button>
          <div className="p-2.5 bg-white dark:bg-gray-700 rounded-full">
            <User className="w-4 h-4 text-gray-800 dark:text-white" />
          </div>
        </div>
      </div>
      {showLeaveForm && <LeaveForm onClose={() => setShowLeaveForm(false)} />}

      {showAddMeeting && <AddMeeting onClose={() => setAddMeetings(false)} />}

      {showAddApplicant && (
        <StudentForm onClose={() => setAddApplicant(false)} />
      )}
      {showAssignGroupClass && (
        <AddGroupAssignClass
          onClose={() => setAssignGroupClass(false)}
          students={[]}
        />
      )}
      {showNotification && (
        <div
          ref={notificationRef}
          className="absolute right-8 w-90 max-w-full bg-gradient-to-br bg-white border-[#939299] rounded-lg shadow-2xl z-30 animate-fade-in-up dark:bg-[#252525]"
        >
          <div className="pt-3 pb-2 pl-4 border-b border-white flex justify-between items-center bg-white/10 rounded-t-xl backdrop-blur-sm dark:border-[#252525] dark:bg-[#252525]">
            <h4 className="font-semibold text-[#010E30] text-lg dark:text-[#FFFFFF]">
              Notifications
            </h4>
            <button
              onClick={() => setShowNotification(false)}
              className="text-white hover:text-gray-200"
            >
              <X
                size={18}
                className="text-red-600 mr-3 font-semibold dark:text-white"
              />
            </button>
          </div>

          <div className="flex justify-start backdrop-blur-md px-3">
            <div className="flex w-full justify-start gap-3">
              {["Unseen", "Seen"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as "Seen" | "Unseen")}
                  className={`relative text-sm px-2 py-1 font-medium transition-all text-black ${
                    activeTab === tab
                      ? "text-[#576CBC] dark:text-[#576CBC]"
                      : "dark:text-white"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#576CBC] rounded-full"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 overflow-y-auto scrollbar-hide p-1 px-3">
            {notifications && notifications.length > 0 ? (
              notifications
                .filter((n) =>
                  activeTab === "Seen"
                    ? n.notificationStatus === "Seen"
                    : n.notificationStatus !== "Seen"
                )
                .map((notification) => (
                  <button
                    key={notification._id}
                    onClick={() => {
                      if (notification.notificationStatus !== "Seen") {
                        handleNotificationClick(notification._id);
                      }
                    }}
                     disabled={!dashboardWrite}
                    className={`w-full text-left p-2   flex items-start gap-3 transition-all duration-200 border-b border-[#D9D9D9]  ${
                      notification.notificationStatus === "Seen"
                        ? "bg-white/20 text-gray-900 hover:bg-white/50 dark:bg-[#252525]"
                        : "bg-white text-gray-900 font-medium hover:bg-[#bfc5e8] dark:bg-[#252525] dark:hover:bg-[#5a5858]"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#E4E7F4] flex items-center justify-center relative shrink-0 dark:bg-[#343434] ">
                      <span className="text-sm font-semibold text-[#576CBC] ">
                        {notification.senderName?.[0] || "N"}
                      </span>
                      {!notification.isRead && (
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#68D391] rounded-full border-2 border-white dark:bg-[#68D391]"></span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-xs font-semibold dark:text-white">
                          {notification.senderName || "Unknown"}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-[#bbb0b099]">
                          {new Date(
                            notification.createdDate
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="text-xs mt-0.5 text-gray-800 flex items-center gap-1">
                        <span>
                          {getNotificationIcon(notification.notificationType)}
                        </span>
                        <span className="text-xs text-[#43424299] dark:text-[#bbb0b099] dark:hover:text-white">
                          {notification.messages}
                        </span>
                      </div>
                    </div>
                  </button>
                ))
            ) : (
              <div className="p-6 text-center text-gray-800">
                <Bell size={40} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-700">No notifications found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
