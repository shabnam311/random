import React from 'react';
import './StatusSeal.css';

export type SubmissionStatus = 'draft' | 'submitted' | 'late' | 'reviewed' | 'not-started';

interface StatusSealProps {
  status: SubmissionStatus;
  label?: string;
}

const statusLabels: Record<SubmissionStatus, string> = {
  'not-started': 'Not started',
  'draft': 'Draft',
  'submitted': 'Submitted',
  'late': 'Late',
  'reviewed': 'Reviewed',
};

export function StatusSeal({ status, label }: StatusSealProps) {
  const displayLabel = label || statusLabels[status];
  
  return (
    <div className={`seal ${status}`}>
      <span className="dot"></span>
      {displayLabel}
    </div>
  );
}
