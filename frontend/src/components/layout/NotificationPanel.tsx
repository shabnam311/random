import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, FileText, CheckCircle } from 'lucide-react';
import './NotificationPanel.css';

interface Notification {
  id: string;
  type: 'feedback' | 'status' | 'deadline';
  message: string;
  timeLabel: string;
  isRead: boolean;
  link: string;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAllRead: () => void;
  onClose: () => void;
}

export function NotificationPanel({ notifications, onMarkAllRead, onClose }: NotificationPanelProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'feedback': return <FileText size={14} />;
      case 'status': return <CheckCircle size={14} />;
      default: return <Bell size={14} />;
    }
  };

  return (
    <div className="notification-panel">
      <div className="notif-header">
        <span>Notifications</span>
        {notifications.some(n => !n.isRead) && (
          <button className="btn-text" style={{ fontSize: '11.5px', padding: '4px' }} onClick={onMarkAllRead}>
            Mark all read
          </button>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <div className="notif-empty">
          You're all caught up.
        </div>
      ) : (
        <div className="notif-list">
          {notifications.map(n => (
            <Link key={n.id} to={n.link} className={`notif-item ${!n.isRead ? 'unread' : ''}`} onClick={onClose}>
              <div className="notif-icon">
                {getIcon(n.type)}
              </div>
              <div className="notif-content">
                <div>{n.message}</div>
                <div className="notif-time">{n.timeLabel}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
