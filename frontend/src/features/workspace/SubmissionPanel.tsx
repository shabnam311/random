import React from 'react';
import { StatusSeal } from '../../components/ui/StatusSeal';
import type { SubmissionStatus } from '../../components/ui/StatusSeal';

interface SubmissionPanelProps {
  status: SubmissionStatus;
  statusLabel: string;
}

export function SubmissionPanel({ status, statusLabel }: SubmissionPanelProps) {
  return (
    <div className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <StatusSeal status={status} label={statusLabel} />
        <button className="btn btn-primary btn-sm">Mark as submitted</button>
      </div>
    </div>
  );
}
