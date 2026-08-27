import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AppShell.css';

interface AppShellProps {
  children: React.ReactNode;
  activeTab?: string;
}

export function AppShell({ children, activeTab = 'My Classes' }: AppShellProps) {
  const location = useLocation();
  const isClassesView = location.pathname === '/classes';

  return (
    <div>
      <div className="appshell-top">
        <Link to="/classes" className="brand">
          <div className="mark"></div>ClassVault
        </Link>
        <div className="top-right">
          <div className="bell">
            <div className="dot"></div>
            &#9679;
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
