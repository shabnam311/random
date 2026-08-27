import React from 'react';
import { StatusSeal, SubmissionStatus } from '../../components/ui/StatusSeal';
import './ClassCard.css';

export interface ClassCardProps {
  term: string;
  className: string;
  teacherName: string;
  groupName?: string;
  deadlineLabel: string;
  deadlineTime: string;
  status: SubmissionStatus;
  statusLabel?: string;
}

export function ClassCard({
  term,
  className,
  teacherName,
  groupName,
  deadlineLabel,
  deadlineTime,
  status,
  statusLabel
}: ClassCardProps) {
  return (
    <div className="class-card">
      <span className="eyebrow">{term}</span>
      <h3>{className}</h3>
      <div className="meta">
        Taught by {teacherName} &middot; Group: {groupName || 'Not joined'}
      </div>
      <div className="countdown">
        <span>{deadlineLabel}</span>
        <span>{deadlineTime}</span>
      </div>
      <div className="divider"></div>
      <StatusSeal status={status} label={statusLabel} />
    </div>
  );
}
