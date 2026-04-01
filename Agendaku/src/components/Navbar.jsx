import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Moon, 
  Sun, 
  User,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Settings as SettingsIcon,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTasks } from '../context/TaskContext';
import NotificationBell from './NotificationBell';

const Navbar = ({ darkMode, setDarkMode, activeBoard, activePage }) => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { notifications, markNotificationAsRead, getUnreadCount } = useTasks();

  // Load current user from localStorage
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const getPageTitle = () => {
    if (activePage === 'dashboard') {
      const titles = {
        personal: 'Personal Tasks',
        work: 'Work Projects',
        shopping: 'Shopping List',
      };
      return titles[activeBoard] || 'Dashboard';
    }
    
    const pageTitles = {
      tasks: 'All Tasks',
      calendar: 'Calendar',
      settings: 'Settings',
    };
    return pageTitles[activePage] || 'Agendaku';
  };

  const getPageIcon = () => {
    if (activePage === 'dashboard') {
      const icons = {
        personal: '📋',
        work: '💼',
        shopping: '🛒',
      };
      return icons[activeBoard] || '📊';
    }
    
    const pageIcons = {
      tasks: '✓',
      calendar: '📅',
      settings: '⚙️',
    };
    return pageIcons[activePage] || '📌';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (currentUser?.name) {
      return currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    return 'JD';
  };

  const handleSignOut = () => {
    // Hapus data autentikasi
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    
    toast.success('Signed out successfully! 👋', {
      duration: 2000,
      icon: '👋',
    });
    
    // Redirect ke halaman login
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  };

  const handleSettingsClick = () => {
    setShowProfileMenu(false);
    navigate('/settings');
  };

  const handleProfileClick = () => {
    setShowProfileMenu(false);
    navigate('/settings');
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Left section with title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getPageIcon()}</span>
            <div>
              <h1 className="text-xl font-semibold dark:text-white">{getPageTitle()}</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Right section - Dark Mode, Notifications, and Profile */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Notification Bell */}
          <NotificationBell currentUser={currentUser} />

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Toggle dark mode"
          >
            <AnimatePresence mode="wait">
              {darkMode ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun size={20} className="text-yellow-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon size={20} className="text-gray-600" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Profile menu"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                <span className="text-xs text-white font-medium">
                  {currentUser ? getUserInitials() : 'JD'}
                </span>
              </div>
              <ChevronDown size={16} className="text-gray-600 dark:text-gray-300 hidden md:block" />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50"
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium dark:text-white">
                      {currentUser?.name || 'John Doe'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {currentUser?.role || 'User'} • @{currentUser?.username || 'username'}
                    </p>
                  </div>
                  
                  {/* Menu Items */}
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <User size={16} />
                    <span>My Profile</span>
                  </button>
                  
                  <button
                    onClick={handleSettingsClick}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <SettingsIcon size={16} />
                    <span>Settings</span>
                  </button>
                  
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  
                  {/* Sign Out Button */}
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden mt-3 space-y-3"
          >
            {/* Mobile User Info with Notifications */}
            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-xs text-white font-medium">
                    {currentUser ? getUserInitials() : 'JD'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium dark:text-white">{currentUser?.name || 'John Doe'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser?.role || 'User'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Mobile Notification Badge */}
                <div className="relative">
                  <Bell size={18} className="text-gray-600 dark:text-gray-300" />
                  {getUnreadCount(currentUser?.name) > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] flex items-center justify-center rounded-full">
                      {getUnreadCount(currentUser?.name)}
                    </span>
                  )}
                </div>
                <button 
                  onClick={handleSignOut}
                  className="text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
            
            {/* Mobile Date */}
            <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>

            {/* Mobile Menu Items */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  navigate('/settings');
                }}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-2"
              >
                <SettingsIcon size={18} />
                <span>Settings</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;