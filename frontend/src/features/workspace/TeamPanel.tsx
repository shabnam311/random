import React from 'react';
import './TeamPanel.css';

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  isLeader?: boolean;
}

interface TeamPanelProps {
  groupName: string;
  members: TeamMember[];
}

export function TeamPanel({ groupName, members }: TeamPanelProps) {
  return (
    <div className="panel">
      <h3>Group: {groupName}</h3>
      {members.map(member => (
        <div key={member.id} className="member-row">
          <div className="avatar">{member.initials}</div>
          {member.name}
          {member.isLeader && <span className="role">LEADER</span>}
        </div>
      ))}
    </div>
  );
}
