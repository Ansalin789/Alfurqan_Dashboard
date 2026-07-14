"use client";

import { useTheme } from "@/context/ThemeContext";
import { CalendarDays, Bell, Sun, Moon, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { getSocket } from "@/app/utils/socket";
import axios from "axios";
import { IoArrowBackCircleSharp } from "react-icons/io5";

type Props = {
  readonly currentSection: string;
  readonly showBackButton?: boolean;
  readonly showBackPath?: string;
};
type NotificationType = {
  _id: string;
  senderId: string;
  senderName: string;
  messages: string;
  createdDate: string;
  notificationType: string;
  notificationStatus: "Seen" | "Unseen";
  isRead: boolean;
};

export default function StudentHeader({
  currentSection,
  showBackButton = false,
  showBackPath = "",
}: Props) {
  const theme: any = useTheme();
  const darkMode = theme?.darkMode ?? false;
  const toggleDarkMode = theme?.toggleDarkMode ?? (() => {});
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();
  const notificationRef = useRef(null);
  const [activeTab, setActiveTab] = useState<"Seen" | "Unseen">("Unseen");
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [dashboardWrite, setDashboardWrite] = useState(false); // For Notifications

  useEffect(() => {
    const roleAccessRaw = localStorage.getItem("StudentRolePermission");
    if (roleAccessRaw) {
      try {
        const roleAccess = JSON.parse(roleAccessRaw);
        const modules = roleAccess?.studentmodules || roleAccess;

        console.log("✅ Modules being used:", modules);
        console.log("🔐 Dashboard write:", modules?.dashboard?.write);
        console.log("🔐 Leave write:", modules?.leave);

        setDashboardWrite(modules?.dashboard?.write ?? false);
      } catch (error) {
        console.error("❌ Invalid AcademicRolePermission JSON", error);
      }
    }
  }, []);

  // Fetch old notifications
  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("StudentPortalId")
      : null;
  const fetchNotifications = async (token: string) => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("StudentAuthToken")
          : null;
      const userId =
        typeof window !== "undefined"
          ? localStorage.getItem("StudentPortalId")
          : null;
      const { data } = await axios.get(
        `https://api.blackstoneinfomaticstech.com/notification/getlist?receiverId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const notifications = data?.data?.notifications ?? [];
      setNotifications(notifications);

      const unreadCount = notifications.filter((n: any) => !n.isRead).length;
      setNotificationCount(unreadCount);
    } catch (error) {
      console.error("❌ Failed to fetch notifications:", error);
    }
  };
  const userName =
    typeof window !== "undefined"
      ? localStorage.getItem("StudentPortalName")
      : null;
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !(menuRef.current as any).contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogOut = () => {
    router.push("/student/ui/sign");
  };

  // Mark as Seen
  const handleNotificationClick = async (notificationId: string) => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("StudentAuthToken")
          : null;

      if (!token) {
        console.error("❌ StudentAuthToken not found");
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
        },
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId
            ? { ...n, isRead: true, notificationStatus: "Seen" }
            : n,
        ),
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

  // Load on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("StudentAuthToken");
      if (token) {
        fetchNotifications(token);
      } else {
        console.log("No auth token found.");
      }
    }
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
  const handleNotificationRedirect = (notification: NotificationType) => {
    const { notificationType, senderId } = notification;

    switch (notificationType) {
      case "ADMIN_NOTIFICATION":
        router.push(`/admin/alerts/${senderId}`);
        break;

      case "REQUEST_RESCHEDULE_TEACHER":
        router.push(`/student/ui/schedule`);
        break;

      default:
        console.warn("Unknown notification type:", notificationType);
        break;
    }
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
          <button
            onClick={() => router.push("/student/ui/schedule")}
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
              <span className="absolute -top-1.5 -right-1.5 bg-[#6C78F5] text-white text-[10px] font-normal w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-md">
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
          <button
            className="p-2.5 bg-white dark:bg-gray-700 rounded-full"
            onClick={() => setOpen((prev) => !prev)}
          >
            <User className="w-4 h-4 text-gray-800 dark:text-white" />
          </button>
        </div>
      </div>
      {open && (
        <div className="absolute right-5 mt-2 w-40 bg-[#ffff] dark:bg-[#252525] shadow-lg rounded-lg py-2 z-50">
          <div className="px-4 py-2 text-sm text-gray-800 dark:text-white font-semibold">
            {userName}
          </div>
          <hr className="border-gray-300 dark:border-gray-600 my-1" />
          <button
            onClick={handleLogOut}
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Log Out
          </button>
        </div>
      )}

      {showNotification && (
        <div
          ref={notificationRef}
          className="absolute right-4 mt-0 w-[380px] max-w-[95vw] overflow-hidden rounded-xl border border-gray-200 dark:border-[#3b3b3b] bg-white dark:bg-[#1F1F1F] shadow-2xl z-30 animate-fade-in-up"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-[#333]">
            <div>
              <h4 className="text-base font-semibold text-[#010E30] dark:text-white">
                Notifications
              </h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Stay updated with recent activity
              </p>
            </div>

            <button
              onClick={() => setShowNotification(false)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-[#333] transition"
            >
              <X size={16} className="text-red-500 dark:text-gray-300" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 px-4 py-2 border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252525]">
            {["Unseen", "Seen"].map((tab) => {
              const count = notifications.filter((n) =>
                tab === "Seen"
                  ? n.notificationStatus === "Seen"
                  : n.notificationStatus !== "Seen",
              ).length;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as "Seen" | "Unseen")}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition ${
                    activeTab === tab
                      ? "bg-[#576CBC] text-white"
                      : "bg-white dark:bg-[#333] text-gray-600 dark:text-gray-300 hover:bg-[#E8ECFF] dark:hover:bg-[#444]"
                  }`}
                >
                  {tab}

                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                      activeTab === tab
                        ? "bg-white text-[#576CBC]"
                        : "bg-gray-200 dark:bg-[#555]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Notification List */}
          <div className="max-h-[320px] overflow-y-auto scrollbar-hide p-2">
            {notifications &&
            notifications.filter((n) =>
              activeTab === "Seen"
                ? n.notificationStatus === "Seen"
                : n.notificationStatus !== "Seen",
            ).length > 0 ? (
              notifications
                .filter((n) =>
                  activeTab === "Seen"
                    ? n.notificationStatus === "Seen"
                    : n.notificationStatus !== "Seen",
                )
                .map((notification) => (
                  <button
                    key={notification._id}
                    disabled={!dashboardWrite}
                    onClick={() => {
                      if (notification.notificationStatus !== "Seen") {
                        handleNotificationClick(notification._id);
                      }
                    }}
                    className={`w-full rounded-lg p-3 mb-2 text-left transition ${
                      notification.notificationStatus === "Seen"
                        ? "bg-gray-50 dark:bg-[#2C2C2C] hover:bg-gray-100 dark:hover:bg-[#363636]"
                        : "bg-[#EEF3FF] dark:bg-[#2F364E] hover:bg-[#E5EDFF] dark:hover:bg-[#3A466B]"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-lg bg-[#576CBC]/15 flex items-center justify-center">
                          <span className="text-sm font-semibold text-[#576CBC]">
                            {notification.senderName?.[0] || "N"}
                          </span>
                        </div>

                        {!notification.isRead && (
                          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white dark:border-[#2F364E]" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <h4 className="text-xs font-semibold dark:text-white truncate">
                            {notification.senderName || "Unknown"}
                          </h4>

                          <span className="text-[10px] text-gray-400 whitespace-nowrap">
                            {new Date(notification.createdDate)
                              .toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                              .replace(",", "")}
                          </span>
                        </div>

                        <div className="flex items-start gap-1 mt-1">
                          {/* <span className="text-xs mt-0.5">
                      {getNotificationIcon(notification.notificationType)}
                    </span> */}

                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotificationRedirect(notification);
                            }}
                            className="text-[11px] text-gray-500 dark:text-gray-300 hover:text-[#576CBC] dark:hover:text-[#7F9CFF] cursor-pointer line-clamp-2"
                          >
                            {notification.messages}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <Bell size={40} className="text-gray-300 mb-3" />
                <h4 className="text-sm font-semibold text-gray-700 dark:text-white">
                  No Notifications
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  You're all caught up 🎉
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
