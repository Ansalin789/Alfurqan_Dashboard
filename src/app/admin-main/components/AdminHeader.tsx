"use client";

import { useTheme } from "@/context/ThemeContext";
import {
  Bell,
  CalendarDays,
  Moon,
  Sun,
  User,
  X,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import LeaveForm from "./LeaveForm";
import AddPackage from "./AddPackage";
import AddMeeting from "./AddMeeting";
import GenerateInvoice from "./GenerateInvoice";
import AddExpenses from "./AddExpenses";
import axios from "axios";
import { getSocket } from "@/app/utils/socket";

type NotificationType = {
  _id: string;
  senderName: string;
  messages: string;
  createdDate: string;
  notificationType: string;
  notificationStatus: "Seen" | "Unseen";
  isRead: boolean;
};

export default function AdminHeader({
  currentSection,
  showBackButton = false,
  showBackPath = "",
}: {
  currentSection: string;
  showBackButton?: boolean;
  showBackPath?: string;
}) {
  const theme: any = useTheme();
  const darkMode = theme?.darkMode ?? false;
  const toggleDarkMode = theme?.toggleDarkMode ?? (() => {});
  const pathname = usePathname();
  const router = useRouter();

  const [showNotification, setShowNotification] = useState(false);
  const [activeTab, setActiveTab] = useState<"Seen" | "Unseen">("Unseen");
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const [leaveWrite, setLeaveWrite] = useState(false);
  const [packageWrite, setPackageWrite] = useState(false);
  const [meetingWrite, setMeetingWrite] = useState(false);
  const [invoiceWrite, setInvoiceWrite] = useState(false);
  const [expenseWrite, setExpenseWrite] = useState(false);

  useEffect(() => {
    const roleAccessRaw = localStorage.getItem("AdminRolePermission");
    if (roleAccessRaw) {
      try {
        const roleAccess = JSON.parse(roleAccessRaw);
        const modules = roleAccess?.adminmodules || roleAccess;

        setLeaveWrite(modules?.dashboard?.write ?? false);
        setPackageWrite(modules?.packages?.write ?? false);
        setMeetingWrite(modules?.meeting?.write ?? false);
        setInvoiceWrite(modules?.invoice?.write ?? false);
        setExpenseWrite(modules?.expenses?.write ?? false);
      } catch (error) {
        console.error("❌ Invalid AdminRolePermission JSON", error);
      }
    }
  }, []);

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("AdminPortalId")
      : null;

  useEffect(() => {
    const fetchNotifications = async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("AdminAuthToken")
          : null;

      try {
        const { data } = await axios.get(
          `https://api.blackstoneinfomaticstech.com/notification/getlist?receiverId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const notifications = data?.data?.notifications ?? [];
        setNotifications(notifications);
        setNotificationCount(notifications.filter((n: { isRead: any; }) => !n.isRead).length);
      } catch (error) {
        console.error("❌ Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const socket = getSocket(userId ?? "");

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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "INVOICE_ALERT":
        return "💰";
      case "SYSTEM_ALERT":
        return "⚠️";
      case "MEETING_REMINDER":
        return "📅";
      default:
        return "🔔";
    }
  };

  const handleNotificationClick = async (id: string) => {
    const token = localStorage.getItem("AdminAuthToken");
    try {
      await axios.put(
        `https://api.blackstoneinfomaticstech.com/notification/${id}`,
        {
          isRead: true,
          notificationStatus: "Seen",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true, notificationStatus: "Seen" } : n
        )
      );
      setNotificationCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("❌ Error updating notification:", error);
    }
  };

  const renderButton = () => {
    const path = pathname.toLowerCase();

    if (path.includes("/dashboard") && leaveWrite) {
      return (
        <button
          onClick={() => setShowLeaveForm(true)}
          className="bg-[#576CBC] hover:bg-[#4459A9] text-white text-sm px-4 py-2 rounded-lg"
        >
          Leave Request
        </button>
      );
    }

    if (path.includes("/package") && packageWrite) {
      return (
        <button
          onClick={() => setShowAddPackage(true)}
          className="bg-[#576CBC] hover:bg-[#4459A9] text-white text-sm px-4 py-2 rounded-lg"
        >
          Add Package
        </button>
      );
    }

    if (
      (path.includes("/meeting") ||
        path.includes("/schedule") ||
        path.includes("/meetingcalendar") ||
        path.includes("/meeting&training")) &&
      meetingWrite
    ) {
      return (
        <button
          onClick={() => setShowAddMeeting(true)}
          className="bg-[#576CBC] hover:bg-[#4459A9] text-white text-sm px-4 py-2 rounded-lg"
        >
          Add Meeting
        </button>
      );
    }

    if (path.includes("/invoice") && invoiceWrite) {
      return (
        <button
          onClick={() => setShowInvoiceForm(true)}
          className="bg-[#576CBC] hover:bg-[#4459A9] text-white text-sm px-4 py-2 rounded-lg"
        >
          Generate Invoice
        </button>
      );
    }

    if (path.includes("/expenses") && expenseWrite) {
      return (
        <button
          onClick={() => setShowExpenseForm(true)}
          className="bg-[#576CBC] hover:bg-[#4459A9] text-white text-sm px-4 py-2 rounded-lg"
        >
          Add Expenses
        </button>
      );
    }

    return null;
  };

  return (
    <div className="flex justify-between items-center py-2 pl-1 mb-2">
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

        <button className="p-2.5 bg-white dark:bg-gray-700 rounded-lg">
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

      {/* Modals */}
      {showLeaveForm && <LeaveForm onClose={() => setShowLeaveForm(false)} />}
      {showAddPackage && <AddPackage onClose={() => setShowAddPackage(false)} />}
      {showAddMeeting && <AddMeeting onClose={() => setShowAddMeeting(false)} />}
      {showInvoiceForm && <GenerateInvoice onClose={() => setShowInvoiceForm(false)} />}
      {showExpenseForm && <AddExpenses onClose={() => setShowExpenseForm(false)} />}
    </div>
  );
}
