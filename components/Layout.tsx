
import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Users, BarChart3, Award, Settings, Bell, Menu, X, TableProperties, AlertCircle, Info, CheckCircle2, LogOut, ChevronDown, MessageSquare, BookOpen } from 'lucide-react';
import { Cohort, AdminUser, Notification, AdminRole } from '../types';

interface ToastState {
  message: string;
  type: 'success' | 'info' | 'error';
}

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onNavigate: (view: string) => void;
  cohorts: Cohort[];
  currentCohortId: string;
  onCohortChange: (id: string) => void;
  currentUser: AdminUser;
  notifications: Notification[];
  onMarkAllRead: () => void;
  onSwitchUser: (user: AdminUser) => void;
  availableUsers: AdminUser[];
  toast: ToastState | null;
  onCloseToast: () => void;
}

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'critical': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBg = () => {
    if (notification.isRead) return 'opacity-60';
    return 'bg-blue-50 dark:bg-blue-900/10';
  };

  return (
    <div className={`p-4 border-b border-slate-100 dark:border-slate-800 flex gap-3 ${getBg()} hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors`}>
      <div className="mt-1">{getIcon()}</div>
      <div>
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{notification.title}</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{notification.message}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{notification.timestamp}</p>
      </div>
    </div>
  );
};

const Toast: React.FC<{ message: string; type: 'success' | 'info' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-green-600 text-white',
    info: 'bg-indigo-600 text-white',
    error: 'bg-red-600 text-white',
  };

  const icons = {
    success: <CheckCircle2 size={18} />,
    info: <Info size={18} />,
    error: <AlertCircle size={18} />,
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg shadow-black/10 transition-all transform animate-in slide-in-from-bottom-5 fade-in ${styles[type]}`}>
      {icons[type]}
      <span className="font-medium text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-white/20 p-1 rounded">
        <X size={14} />
      </button>
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ 
  children, activeView, onNavigate, cohorts, currentCohortId, onCohortChange,
  currentUser, notifications, onMarkAllRead, onSwitchUser, availableUsers,
  toast, onCloseToast
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Initialize Dark Mode based on system preference
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    // Close dropdowns on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // RBAC: Filter Menu Items based on Role
  const allMenuItems = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={20} />, roles: ['Super Admin', 'Program Manager', 'Viewer'] },
    { id: 'participants', label: 'Participants', icon: <Users size={20} />, roles: ['Super Admin', 'Program Manager'] },
    { id: 'progress', label: 'Progress Matrix', icon: <TableProperties size={20} />, roles: ['Super Admin', 'Program Manager', 'Viewer'] },
    { id: 'reminders', label: 'Reminders', icon: <MessageSquare size={20} />, roles: ['Super Admin', 'Program Manager'] },
    { id: 'resources', label: 'Resources', icon: <BookOpen size={20} />, roles: ['Super Admin', 'Program Manager'] },
    { id: 'certificates', label: 'Certifications', icon: <Award size={20} />, roles: ['Super Admin'] },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} />, roles: ['Super Admin', 'Program Manager', 'Viewer'] },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, roles: ['Super Admin'] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(currentUser.role));

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="h-screen overflow-hidden flex bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={onCloseToast} />}

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-200 ease-in-out flex flex-col h-full
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                 <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="font-bold text-xl text-slate-800 dark:text-white">Leap Admin</span>
           </div>
           <button 
             className="ml-auto lg:hidden text-slate-500"
             onClick={() => setIsSidebarOpen(false)}
           >
             <X size={20} />
           </button>
        </div>

        <div className="p-4 shrink-0">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Cohort</label>
          <select 
            value={currentCohortId}
            onChange={(e) => onCohortChange(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-2 text-sm text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {cohorts.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${activeView === item.id 
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }
              `}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Profile & Role Switcher */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
           <div className="relative">
             <button 
               onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
               className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
             >
                <img src={currentUser.avatar} alt="User" className="w-8 h-8 rounded-full bg-slate-200" />
                <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                   <p className="text-xs text-indigo-600 dark:text-indigo-400 truncate font-semibold">{currentUser.role}</p>
                </div>
                <ChevronDown size={16} className="text-slate-400" />
             </button>

             {/* Role Switcher Dropdown (Demo Purpose) */}
             {isUserMenuOpen && (
               <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 overflow-hidden z-50">
                 <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-semibold text-slate-500 uppercase">Switch Role (Demo)</p>
                 </div>
                 {availableUsers.map(user => (
                   <button
                     key={user.id}
                     onClick={() => {
                        onSwitchUser(user);
                        setIsUserMenuOpen(false);
                     }}
                     className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between
                        ${currentUser.id === user.id ? 'text-indigo-600 font-medium' : 'text-slate-600 dark:text-slate-300'}
                     `}
                   >
                     <span>{user.role}</span>
                     {currentUser.id === user.id && <CheckCircle2 size={14} />}
                   </button>
                 ))}
               </div>
             )}
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <button 
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <button 
               onClick={toggleDarkMode}
               className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
               title="Toggle Theme"
            >
               {isDarkMode ? '☀️' : '🌙'}
            </button>
            
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button 
                className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={onMarkAllRead}
                        className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map(n => <NotificationItem key={n.id} notification={n} />)
                    ) : (
                      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                        <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p>All caught up!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar relative">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
