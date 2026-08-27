import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NotificationPanel } from './NotificationPanel';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/api/supabase';
import './AppShell.css';

interface AppShellProps {
  children: React.ReactNode;
  activeTab?: string;
}

export function AppShell({ children, activeTab = 'Dashboard' }: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isClassesView = location.pathname === '/classes';
  const [showNotifs, setShowNotifs] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchNotifs = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setNotifications(data);
    };
    fetchNotifs();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    if (!user) return;
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id);
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



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
          <button 
            className="btn-text" 
            style={{ fontSize: '13px', marginLeft: '10px' }}
            onClick={async () => {
              const { auth } = await import('../../lib/api/supabase');
              await auth.logout();
            }}
          >
            Sign out
          </button>
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
