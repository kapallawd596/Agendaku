// components/NotificationBell.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, Trash2, X } from 'lucide-react';
import { useTasks } from '../context/TaskContext'; // Ganti dari NotificationContext ke TaskContext
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

const NotificationBell = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    deleteNotification 
  } = useTasks(); // Ambil dari TaskContext
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Filter notifikasi untuk user yang sedang login
  const userNotifications = notifications.filter(n => n.recipient === currentUser?.name);
  const unreadCount = userNotifications.filter(n => !n.read).length;

  // Close dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    markNotificationAsRead(notification.id);
    setIsOpen(false);
    
    // Navigasi ke task yang dimaksud
    if (notification.taskId && notification.boardId) {
      navigate(`/project/${notification.boardId}`);
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  if (!currentUser) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon dengan badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <Bell size={20} className="text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown Notifikasi */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50"
          >
            {/* Header */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold dark:text-white">Notifications</h3>
              <div className="flex items-center space-x-1">
                {userNotifications.length > 0 && (
                  <>
                    <button
                      onClick={() => markAllNotificationsAsRead()}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      title="Mark all as read"
                    >
                      <CheckCheck size={14} className="text-gray-500" />
                    </button>
                    <button
                      onClick={() => {
                        userNotifications.forEach(n => deleteNotification(n.id));
                      }}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      title="Clear all"
                    >
                      <Trash2 size={14} className="text-gray-500" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* List Notifikasi */}
            <div className="max-h-96 overflow-y-auto">
              {userNotifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                  No notifications
                </div>
              ) : (
                userNotifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                      !notif.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                    }`}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className="flex items-start space-x-2">
                      {/* Avatar Sender */}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs text-white font-medium flex-shrink-0">
                        {notif.sender?.avatar || '📬'}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className="text-xs font-medium dark:text-white">
                            {notif.title}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notif.id);
                            }}
                            className="text-gray-400 hover:text-red-500 ml-1"
                          >
                            <X size={12} />
                          </button>
                        </div>
                        
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                          {notif.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-1.5">
                          <div className="flex items-center space-x-1">
                            {notif.priority && (
                              <span className={`text-[8px] px-1 py-0.5 rounded ${getPriorityColor(notif.priority)}`}>
                                {notif.priority}
                              </span>
                            )}
                            {notif.dueDate && (
                              <span className="text-[8px] text-gray-500">
                                📅 {new Date(notif.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                              </span>
                            )}
                          </div>
                          <span className="text-[8px] text-gray-400">
                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: id })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;