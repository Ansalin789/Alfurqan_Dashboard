/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useTheme } from "@/context/ThemeContext";
import { Bell, CalendarDays, Moon, Sun, User, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import axios from "axios";
import AddPackage from "./AddPackage";
import AddMeeting from "./AddMeeting";
import AddExpenses from "./AddExpenses";
import AddEmployee from "./AddEmployee";
import KnowledgeBaseForm from "./AddKnowledgeBase";
import GenerateInvoice from "./GenerateInvoice";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

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

type AdminHeaderProps = {
  currentSection: string;
  showBackButton?: boolean;
  showBackPath?: string;
  employeeActiveTab?: "teachers" | "otheremployees" | "recruitment" | "leave";
};

export default function AdminHeader({
  currentSection,
  showBackButton = false,
  showBackPath = "",
  employeeActiveTab,
}: Readonly<AdminHeaderProps>) {
  const theme: any = useTheme();
  const darkMode = theme?.darkMode ?? false;
  const toggleDarkMode = theme?.toggleDarkMode ?? (() => {});
  const pathname = usePathname();
  const router = useRouter();

  const [showNotification, setShowNotification] = useState(false);
  const [activeTab, setActiveTab] = useState<"Seen" | "Unseen">("Unseen");
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [showAddPackage, setShowAddPackage] = useState(false);
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [showAddExpenses, setShowAddExpenses] = useState(false);
  const [showKnowledge, setShowKnowledge] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showGenerateInvoice, setShowGenerateInvoice] = useState(false);

  const [permissions, setPermissions] = useState({
    leave: false,
    packages: false,
    expenses: false,
    meetings: false,
    invoice: false,
    employees: false,
    courses: false,
  });

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("AdminPortalId")
      : null;

  const handleNotificationClick = async (notificationId: string) => {
    try {
      const token = localStorage.getItem("AdminAuthToken");
      if (!token) return;
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
      console.error("Failed to mark notification as seen:", error);
    }
  };

  const loadPermissions = () => {
    try {
      const stored = localStorage.getItem("AdminRolePermission");
      if (stored) {
        const parsed = JSON.parse(stored);
        setPermissions({
          leave: parsed?.leave?.write ?? parsed?.employees?.write ?? false,
          packages: parsed?.packages?.write ?? parsed?.courses?.write ?? false,
          expenses: parsed?.expenses?.write ?? parsed?.invoice?.write ?? false,
          meetings: parsed?.meetings?.write ?? false,
          invoice: parsed?.invoice?.write ?? false,
          employees: parsed?.employees?.write ?? false,
          courses: parsed?.courses?.write ?? false,
        });
      }
    } catch (err) {
      console.error("Permission parsing error:", err);
    }
  };

  useEffect(() => {
    loadPermissions();
    window.addEventListener("storage", loadPermissions);
    return () => window.removeEventListener("storage", loadPermissions);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("AdminAuthToken");
      if (!userId || !token) return;
      try {
        const { data } = await axios.get(
          `https://api.blackstoneinfomaticstech.com/notification/getlist?receiverId=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const list = data?.data?.notifications ?? [];
        setNotifications(list);
        const unread = list.filter((n: any) => !n.isRead).length;
        setNotificationCount(unread);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, [userId]);

  useEffect(() => {
    const socket = io("https://api.blackstoneinfomaticstech.com");

    socket.on("notification", (data: any) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.disconnect(); // cleanup
    };
  }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setShowNotification(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ADMIN_NOTIFICATION":
        return "👨‍💼";
      case "PACKAGE_UPDATE":
        return "📦";
      case "MEETING_REMINDER":
        return "📅";
      case "EXPENSE_ALERT":
        return "💰";
      case "SYSTEM_ALERT":
        return "⚠️";
      default:
        return "🔔";
    }
  };
  const handleNotificationRedirect = (notification: NotificationType) => {
    const { notificationType, senderId } = notification;

    switch (notificationType) {
      case "STUDENT_NOTIFICATION":
        router.push("evaluations");
        break;

      default:
        console.warn("Unknown notification type:", notificationType);
        break;
    }
  };

  const getActionButton = () => {
    const path = pathname.toLowerCase();
    if (
      path.includes("employees") &&
      permissions.employees &&
      employeeActiveTab === "otheremployees"
    ) {
      return (
        <button
          onClick={() => setShowAddEmployee(true)}
          className="bg-[#576CBC] hover:bg-[#3a4f8a] text-white text-sm px-4 py-2 rounded-lg"
        >
          Add New
        </button>
      );
    }
    if (
      path.includes("dashboard") &&
      (permissions.leave || permissions.meetings)
    ) {
      return (
        <button
          onClick={() => router.push("/admin-main/ui/employees")}
          className="bg-[#576CBC] hover:bg-[#3a4f8a] text-white text-sm px-4 py-2 rounded-lg"
        >
          Leave Approval
        </button>
      );
    }
    if (path.includes("package") && permissions.packages) {
      return (
        <button
          onClick={() => setShowAddPackage(true)}
          className="bg-[#576CBC] hover:bg-[#3a4f8a] text-white text-sm px-4 py-2 rounded-lg"
        >
          Add Package
        </button>
      );
    }
    if (
      path.includes("expenses") &&
      (permissions.expenses || permissions.invoice)
    ) {
      return (
        <button
          onClick={() => setShowAddExpenses(true)}
          className="bg-[#576CBC] hover:bg-[#3a4f8a] text-white text-sm px-4 py-2 rounded-lg"
        >
          Add Expenses
        </button>
      );
    }
    if (currentSection === "knowledge base") {
      return (
        <button
          onClick={() => setShowKnowledge(true)}
          className="bg-[#576CBC] hover:bg-[#3a4f8a] text-white text-sm px-4 py-2 rounded-lg"
        >
          Add Knowledge Base
        </button>
      );
    }
    if (path.includes("meeting") && permissions.meetings) {
      return (
        <button
          onClick={() => setShowAddMeeting(true)}
          className="bg-[#576CBC] hover:bg-[#3a4f8a] text-white text-sm px-4 py-2 rounded-lg"
        >
          Add Meeting
        </button>
      );
    }
    if (path.includes("invoice") && permissions.invoice) {
      return (
        <button
          onClick={() => setShowGenerateInvoice(true)}
          className="bg-[#576CBC] hover:bg-[#3a4f8a] text-white text-sm px-4 py-2 rounded-lg"
        >
          Generate Invoice
        </button>
      );
    }
    return null;
  };

  const userName =
    typeof window !== "undefined"
      ? localStorage.getItem("AdminPortalName")
      : null;

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function outside(e: MouseEvent) {
      if (menuRef.current && !(menuRef.current as any).contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);

  const handleLogOut = () => {
    router.push("/admin-main/ui/login");
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
          {getActionButton()}

          <button
            onClick={() => router.push("/admin-main/ui/admincalendar")}
            className="p-2.5 bg-white dark:bg-gray-700 rounded-lg"
          >
            <CalendarDays className="w-4 h-4 text-gray-800 dark:text-white" />
          </button>

          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotification(!showNotification)}
              className="relative p-2.5 bg-white dark:bg-gray-700 rounded-lg"
            >
              <Bell className="w-5 h-5 text-gray-800 dark:text-white" />
              {notificationCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#576CBC] text-white text-[10px] font-normal w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-md">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </button>

            {showNotification && (
              <div className="absolute -right-20 mt-3 w-[380px] max-w-[95vw] overflow-hidden rounded-xl border border-gray-200 dark:border-[#3b3b3b] bg-white dark:bg-[#1F1F1F] shadow-2xl z-30 animate-fade-in-up">
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
                    className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-100 dark:hover:bg-[#333] transition"
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
                          className={`px-1.5 py-0.5 rounded-full text-[10px] ${
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

                {/* Notifications */}
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
                          onClick={() => {
                            if (notification.notificationStatus !== "Seen") {
                              handleNotificationClick(notification._id);
                            }
                          }}
                          className={`w-full rounded-lg p-3 mb-2 text-left transition-all duration-200 ${
                            notification.notificationStatus === "Seen"
                              ? "bg-gray-50 dark:bg-[#2C2C2C] hover:bg-gray-100 dark:hover:bg-[#363636]"
                              : "bg-[#EEF3FF] dark:bg-[#2F364E] hover:bg-[#E4ECFF] dark:hover:bg-[#3A466B]"
                          }`}
                        >
                          <div className="flex gap-3">
                            {/* Avatar */}
                            <div className="relative shrink-0">
                              <div className="w-9 h-9 rounded-lg bg-[#576CBC]/15 dark:bg-[#576CBC]/20 flex items-center justify-center">
                                <span className="text-sm font-semibold text-[#576CBC]">
                                  {notification.senderName?.[0] || "N"}
                                </span>
                              </div>

                              {!notification.isRead && (
                                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white dark:border-[#2F364E]" />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between gap-2">
                                <h4 className="text-xs font-semibold text-gray-900 dark:text-white truncate">
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
                                {/* <span className="mt-0.5 text-xs">
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
                    <div className="flex flex-col items-center justify-center py-12">
                      <Bell size={42} className="text-gray-300 mb-3" />
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
        <div
          className="absolute right-5 mt-2 w-40 bg-white dark:bg-[#252525] shadow-lg rounded-lg py-2 z-50"
          ref={menuRef}
        >
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

      {showAddPackage && (
        <AddPackage onClose={() => setShowAddPackage(false)} />
      )}
      {showAddMeeting && (
        <AddMeeting
          onClose={() => setShowAddMeeting(false)}
          onMeetingCreated={() => setShowAddMeeting(false)}
        />
      )}
      {showAddExpenses && (
        <AddExpenses
          onClose={() => setShowAddExpenses(false)}
          refreshExpenses={() => {}}
        />
      )}
      {showKnowledge && (
        <KnowledgeBaseForm onClose={() => setShowKnowledge(false)} />
      )}
      {showGenerateInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <GenerateInvoice onClose={() => setShowGenerateInvoice(false)} />
          </div>
        </div>
      )}
      {showAddEmployee && (
        <AddEmployee
          onClose={() => setShowAddEmployee(false)}
          onSuccess={() => {
            setShowAddEmployee(false);
            toast.success("Employee added successfully!");
          }}
        />
      )}
    </div>
  );
}
