import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NotificationPanel } from './NotificationPanel';
import './AppShell.css';

interface AppShellProps {
  children: React.ReactNode;
  activeTab?: string;
}

export function AppShell({ children, activeTab = 'My Classes' }: AppShellProps) {
  const location = useLocation();
  const isClassesView = location.pathname === '/classes';
  const [showNotifs, setShowNotifs] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState([
    { id: '1', type: 'feedback' as const, message: 'S. Kapoor left feedback on Urban Water Systems.', timeLabel: '2 hours ago', isRead: false, link: '/classes/1/group/1' },
    { id: '2', type: 'status' as const, message: 'Status updated to Reviewed · B+', timeLabel: '3 days ago', isRead: true, link: '/classes/1/group/1' }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div>
      <div className="appshell-top">
        <Link to="/classes" className="brand">
          <div className="mark"></div>ClassVault
        </Link>
        <div className="top-right">
          <div 
            className="bell" 
            ref={bellRef}
            onClick={() => setShowNotifs(!showNotifs)}
            style={{ cursor: 'pointer' }}
          >
            {unreadCount > 0 && <div className="dot"></div>}
            &#9679;
            {showNotifs && (
              <NotificationPanel 
                notifications={notifications}
                onMarkAllRead={handleMarkAllRead}
                onClose={() => setShowNotifs(false)}
              />
            )}
          </div>
          <div className="user-chip">
            <div className="avatar">RS</div>
            Rhea Sen
          </div>
        </div>
      </div>
      
      <div className="folder-tabs">
        <Link 
          to="/classes" 
          className={`folder-tab ${isClassesView ? 'active' : ''}`}
        >
          My Classes
        </Link>
        {!isClassesView && activeTab !== 'My Classes' && (
          <div className="folder-tab active">{activeTab}</div>
        )}
      </div>

      <main>
        {children}
      </main>
    </div>
  );
}
