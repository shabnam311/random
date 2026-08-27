import React from 'react';
import './ActivityPanel.css';

interface ActivityItem {
  id: string;
  timeLabel: string;
  description: string;
}

interface ActivityPanelProps {
  activities: ActivityItem[];
}

export function ActivityPanel({ activities }: ActivityPanelProps) {
  return (
    <div className="panel">
      <h3>Activity</h3>
      {activities.map(activity => (
        <div key={activity.id} className="activity-item">
          <time>{activity.timeLabel}</time>
          <span>{activity.description}</span>
        </div>
      ))}
    </div>
  );
}
