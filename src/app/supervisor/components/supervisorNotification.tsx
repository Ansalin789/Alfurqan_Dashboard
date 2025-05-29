'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Bell } from 'lucide-react';
import axios from 'axios';
import { getSocket } from '@/app/utils/socket';

type NotificationType = {
  _id: string;
  senderName: string;
  messages: string;
  createdDate: string;
  notificationType: string;
  notificationStatus: 'Seen' | 'Unseen';
  isRead: boolean;
};

type Props = {
  readonly onClose: () => void;
  readonly userId: string;
};


export default function Notification({ onClose, userId }: Props) {
  const notificationRef = useRef(null);
  const [activeTab, setActiveTab] = useState<'Seen' | 'Unseen'>('Unseen');
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);

  // Fetch old notifications
  const fetchNotifications = async (token: string) => {
    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('SupervisorAuthToken')
          : null;

      const { data } = await axios.get(
        `http://localhost:5001/notification/getlist?receiverId=${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const notifications = data?.data?.notifications ?? [];
      setNotifications(notifications);

      const unreadCount = notifications.filter((n: any) => !n.isRead).length;
      setNotificationCount(unreadCount);
    } catch (error) {
      console.error('❌ Failed to fetch notifications:', error);
    }
  };

  // Mark as Seen
  const handleNotificationClick = async (notificationId: string) => {
    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('SupervisorAuthToken')
          : null;

      if (!token) {
        console.error('❌ AdminAuthToken not found');
        return;
      }

      await axios.put(
        `https://api.blackstoneinfomaticstech.com/notification/${notificationId}`,
        {
          isRead: true,
          notificationStatus: 'Seen',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId
            ? { ...n, isRead: true, notificationStatus: 'Seen' }
            : n
        )
      );

      setNotificationCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error('❌ Failed to mark as seen:', error);
    }
  };

  // Real-time notifications with Socket.IO
  useEffect(() => {
     const socket = getSocket(userId);

    const handleNotification = (newNotification: NotificationType) => {
      console.log('Received new notification:', newNotification);
      setNotifications((prev) => [newNotification, ...prev]);

      if (!newNotification.isRead) {
        setNotificationCount((prev) => prev + 1);
      }
    };

   socket.on('notification', handleNotification);
   
  return () => {
    socket.off('notification', handleNotification);
  };
  }, [userId]);

  // Load on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('SupervisorAuthToken');
      if (token) {
        fetchNotifications(token);
      } else {
        console.log('No auth token found.');
      }
    }
  }, [userId]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'STUDENT_NOTIFICATION':
        return '🎓';
      case 'SYSTEM_ALERT':
        return '⚠️';
      default:
        return '🔔';
    }
  };

  return (
    <div
        ref={notificationRef}
        className=" w-90 max-w-full bg-gradient-to-br bg-white border-[#939299] rounded-lg shadow-2xl z-50 animate-fade-in-up"
      >
        <div className="pt-3 pb-2 pl-4 border-b border-white/100 flex justify-between items-center bg-white/10 rounded-t-xl backdrop-blur-sm">
          <h4 className="font-semibold text-[#010E30] text-lg">Notifications</h4>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={18} />
          </button>
        </div>

        <div className="flex justify-start backdrop-blur-md px-3">
  <div className="flex w-full justify-start gap-3">
    {['Unseen', 'Seen'].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab as 'Seen' | 'Unseen')}
        className={`relative text-sm px-2 py-1 font-medium transition-all text-black ${
          activeTab === tab ? 'text-[#576CBC]' : ''
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
                activeTab === 'Seen'
                  ? n.notificationStatus === 'Seen'
                  : n.notificationStatus !== 'Seen'
              )
              .map((notification) => (
                <button
                  key={notification._id}
                  onClick={() => {
                    if (notification.notificationStatus !== 'Seen') {
                      handleNotificationClick(notification._id);
                    }
                  }}
                  className={`w-full text-left p-2   flex items-start gap-3 transition-all duration-200 border-b border-[#D9D9D9]  ${
                    notification.notificationStatus === 'Seen'
                      ? 'bg-white/20 text-gray-900 hover:bg-white/50'
                      : 'bg-white text-gray-900 font-medium hover:bg-[#bfc5e8]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#E4E7F4] flex items-center justify-center relative shrink-0">
                    <span className="text-sm font-semibold text-[#576CBC]">
                      {notification.senderName?.[0] || 'N'}
                    </span>
                    {!notification.isRead && (
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#68D391] rounded-full border-2 border-white"></span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="text-xs font-semibold">
                        {notification.senderName || 'Unknown'}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="text-xs mt-0.5 text-gray-800 flex items-center gap-1">
                      <span>{getNotificationIcon(notification.notificationType)}</span>
                      <span className="text-xs text-[#43424299]">{notification.messages}</span>
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
  );
}
