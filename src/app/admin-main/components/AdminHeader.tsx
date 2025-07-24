/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useTheme } from "@/context/ThemeContext";
import { Bell, CalendarDays, Moon, Sun, User, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import axios from "axios";
import { getSocket } from "@/app/utils/socket";
import AddPackage from "./AddPackage";
import AddMeeting from "./AddMeeting";
import AddExpenses from "./AddExpenses";
import AdminCalendar from "./AdminCalendar";
import { toast } from "react-toastify";
import AddEmployee from "./AddEmployee";
import GenerateInvoice from "./GenerateInvoice";

type NotificationType = {
  _id: string;
  senderName: string;
  messages: string;
  createdDate: string;
  notificationType: string;
  notificationStatus: "Seen" | "Unseen";
  isRead: boolean;
};


// In AdminHeader.tsx
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
}: AdminHeaderProps) {
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
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [expenses, setExpenses] = useState([]);
const [showGenerateInvoice, setShowGenerateInvoice] = useState(false);

  const [permissions, setPermissions] = useState({
    leave: false,
    packages: false,
    expenses: false,
    meetings: false,
    invoice: false,
    employees: false,
  });

  const userId = typeof window !== "undefined" ? localStorage.getItem("AdminPortalId") : null;

  const refreshExpenses = async () => {
    try {
      const token = localStorage.getItem("AdminAuthToken");
      const response = await axios.get(
        "https://api.blackstoneinfomaticstech.com/expense",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setExpenses(response.data);
    } catch (error) {
      console.error("Failed to refresh expenses:", error);
      toast.error("Failed to refresh expenses");
    }
  };

  useEffect(() => {
    const loadPermissions = () => {
      try {
        const storedPermissions = localStorage.getItem("AdminRolePermission");
        if (storedPermissions) {
          const parsed = JSON.parse(storedPermissions);
          setPermissions({
            leave: parsed?.leave?.write ?? parsed?.employees?.write ?? false,
            packages: parsed?.packages?.write ?? parsed?.courses?.write ?? false,
            expenses: parsed?.expenses?.write ?? parsed?.invoice?.write ?? false,
            meetings: parsed?.meetings?.write ?? false,
            invoice: parsed?.invoice?.write ?? false,
            employees: parsed?.employees?.write ?? false,
          });
        }
      } catch (error) {
        console.error("Error loading permissions:", error);
      }
    };

    loadPermissions();
    window.addEventListener("storage", loadPermissions);
    return () => window.removeEventListener("storage", loadPermissions);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("AdminAuthToken");
      try {
        const { data } = await axios.get(
          `https://api.blackstoneinfomaticstech.com/notification/getlist?receiverId=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const notifications = data?.data?.notifications ?? [];
        setNotifications(notifications);
        setNotificationCount(notifications.filter((n: any) => !n.isRead).length);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    if (userId) fetchNotifications();
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotification(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!userId) return;
    const socket = getSocket(userId);
    const handleNotification = (newNotification: NotificationType) => {
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

  const getActionButton = () => {
    const path = pathname.toLowerCase();
    
if (
  path.includes("employees") && 
  permissions.employees &&
  employeeActiveTab === "otheremployees" // Now using the correct prop
)   if (
    path.includes("employees") && 
    permissions.employees &&
    employeeActiveTab === "otheremployees" // Now using the correct prop
  ) {
    return (
      <button
        onClick={() => setShowAddEmployee(true)}
        className="bg-[#576CBC] text-white px-3 py-1 rounded-lg transition hover:bg-[#3a4f8a] text-sm sm:text-[13px] sm:px-4"
      >
        Add New 
      </button>
    );
  }
    
    if (path.includes("dashboard") && (permissions.leave || permissions.meetings)) {
      return (
        <button
          onClick={() => router.push("/admin-main/ui/employees")}
          className="bg-[#576CBC] text-white px-3 py-1 rounded-lg transition hover:bg-[#3a4f8a] text-sm sm:text-[13px] sm:px-4"
        >
          Leave Approval
        </button>
      );
    }
    if (path.includes("package") && permissions.packages) {
      return (
        <button
          onClick={() => setShowAddPackage(true)}
          className="bg-[#576CBC] text-white px-3 py-1 rounded-lg transition hover:bg-[#3a4f8a] text-sm sm:text-[13px] sm:px-4"
        >
          Add Package
        </button>
      );
    }
    if (path.includes("expenses") && (permissions.expenses || permissions.invoice)) {
      return (
        <button
          onClick={() => setShowAddExpenses(true)}
          className="bg-[#576CBC] text-white px-3 py-1 rounded-lg transition hover:bg-[#3a4f8a] text-sm sm:text-[13px] sm:px-4"
        >
          Add Expenses
        </button>
      );
    }
    if (path.includes("meeting") && permissions.meetings) {
      return (
        <button
          onClick={() => setShowAddMeeting(true)}
          className="bg-[#576CBC] text-white px-3 py-1 rounded-lg transition hover:bg-[#3a4f8a] text-sm sm:text-[13px] sm:px-4"
        >
          Add Meeting
        </button>
      );
    }
if (path.includes("invoice") && permissions.invoice) {
  return (
    <button
      onClick={() => setShowGenerateInvoice(true)}
      className="bg-[#576CBC] text-white px-3 py-1 rounded-lg transition hover:bg-[#3a4f8a] text-[12px] sm:text-base sm:px-4"
    >
      Generate Invoice
    </button>
  );
}
    return null;
  };

  const handleNotificationClick = async (notificationId: string) => {
    try {
      const token = localStorage.getItem("AdminAuthToken");
      if (!token) {
        console.error("AdminAuthToken not found");
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
      console.error("Failed to mark as seen:", error);
    }
  };

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

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 py-2 px-1 sm:pl-1 mb-1">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {showBackButton && (
            <IoArrowBackCircleSharp
              className="text-[25px] text-[#012a4a] cursor-pointer dark:text-white hover:text-[#3a4f8a] dark:hover:text-gray-300"
              onClick={() => router.push(showBackPath)}
            />
          )}
          <h1 className="text-lg sm:text-xl font-semibold text-[#000836] dark:text-white truncate max-w-[200px] sm:max-w-none">
            {currentSection}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-normal">
          {getActionButton()}

          <div className="flex items-center gap-1 sm:gap-3">
            <button
              onClick={() => router.push("/admin-main/ui/admincalendar")}
              className="p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <CalendarDays className="w-4 h-4 text-gray-800 dark:text-white" />
            </button>

            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotification(!showNotification)}
                className="p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 relative"
              >
                <Bell className="w-4 h-4 text-gray-800 dark:text-white" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#576CBC] text-white text-[10px] font-normal w-4 h-4 flex items-center justify-center rounded-full animate-bounce shadow-md">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </button>

              {showNotification && (
                <div className="absolute -ml-24 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mt-2 w-[90vw] sm:w-[470px] bg-gradient-to-br bg-white border-[#939299] rounded-lg shadow-2xl z-30 animate-fade-in-up dark:bg-[#252525]">
                  <div className="pt-3 pb-2 pl-4 border-b border-white flex justify-between items-center bg-white/10 rounded-t-xl backdrop-blur-sm dark:border-[#252525] dark:bg-[#252525]">
                    <h4 className="font-semibold text-[#010E30] text-lg dark:text-[#FFFFFF]">
                      Notifications
                    </h4>
                    <button
                      onClick={() => setShowNotification(false)}
                      className="text-white hover:text-gray-200"
                    >
                      <X size={18} className="text-red-600 mr-3 font-semibold dark:text-white" />
                    </button>
                  </div>

                  <div className="flex justify-start backdrop-blur-md px-3">
                    <div className="flex w-full justify-start gap-3">
                      {["Unseen", "Seen"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab as "Seen" | "Unseen")}
                          className={`relative text-sm px-2 py-1 font-medium transition-all ${
                            activeTab === tab
                              ? "text-[#576CBC] dark:text-[#576CBC]"
                              : "text-black dark:text-white"
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

                  <div className="h-64 overflow-y-auto scrollbar-hide px-3 py-1">
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
                            className={`w-full text-left p-2 flex items-start gap-3 transition-all duration-200 border-b border-[#D9D9D9] ${
                              notification.notificationStatus === "Seen"
                                ? "bg-white/20 text-gray-900 hover:bg-white/50 dark:bg-[#252525]"
                                : "bg-white text-gray-900 font-medium hover:bg-[#bfc5e8] dark:bg-[#252525] dark:hover:bg-[#5a5858]"
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#E4E7F4] flex items-center justify-center relative shrink-0 dark:bg-[#343434]">
                              <span className="text-sm font-semibold text-[#576CBC]">
                                {notification.senderName?.[0] || "N"}
                              </span>
                              {!notification.isRead && (
                                <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#68D391] rounded-full border-2 border-white dark:bg-[#68D391]" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between">
                                <h4 className="text-xs font-semibold dark:text-white truncate">
                                  {notification.senderName || "Unknown"}
                                </h4>
                                <span className="text-xs text-gray-500 dark:text-[#bbb0b099] whitespace-nowrap ml-2">
                                  {new Date(notification.createdDate).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <div className="text-xs mt-0.5 text-gray-800 flex items-center gap-1 dark:text-[#bbb0b099] dark:hover:text-white">
                                <span>{getNotificationIcon(notification.notificationType)}</span>
                                <span className="truncate">{notification.messages}</span>
                              </div>
                            </div>
                          </button>
                        ))
                    ) : (
                      <div className="p-6 text-center text-gray-800 dark:text-gray-400">
                        <Bell size={40} className="mx-auto text-gray-300 mb-2" />
                        <p>No notifications found</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={toggleDarkMode}
              className="p-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-gray-800 dark:text-white" />
              ) : (
                <Moon className="w-4 h-4 text-gray-800 dark:text-white" />
              )}
            </button>

            <div className="p-2 bg-white dark:bg-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600">
              <User className="w-4 h-4 text-gray-800 dark:text-white" />
            </div>
          </div>
        </div>
      </div>

      {showAddPackage && <AddPackage onClose={() => setShowAddPackage(false)} />}

      {showAddMeeting && (
        <AddMeeting 
          onClose={() => setShowAddMeeting(false)} 
          onMeetingCreated={() => {
            setShowAddMeeting(false);
          }}
        />
      )}

      {showAddExpenses && (
        <AddExpenses 
          onClose={() => setShowAddExpenses(false)}
          refreshExpenses={refreshExpenses}
        />
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