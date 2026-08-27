import React, { useState } from 'react';
import type { SubmissionStatus } from '../../components/ui/StatusSeal';
import { StatusSeal } from '../../components/ui/StatusSeal';
import { groupApi } from '../../lib/api/supabase';

interface SubmissionPanelProps {
  status: SubmissionStatus;
  statusLabel?: string;
  groupId: string;
  onStatusChange: () => void;
}

export function SubmissionPanel({ status, statusLabel, groupId, onStatusChange }: SubmissionPanelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await groupApi.submitProject(groupId);
      onStatusChange();
    } catch (err) {
      console.error(err);
      alert('Failed to submit project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="panel" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h3 style={{ margin: '0 0 6px' }}>Project Status</h3>
        <StatusSeal status={status} label={statusLabel} />
      </div>
      <div>
        <button 
          className="btn btn-primary" 
          disabled={status === 'submitted' || status === 'late' || status === 'reviewed' || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? 'Submitting...' : 'Mark as submitted'}
        </button>
      </div>
    </div>
  );
}
