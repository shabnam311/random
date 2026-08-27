import React, { useState } from 'react';
import type { SubmissionStatus } from '../../components/ui/StatusSeal';

interface GradeControlProps {
  currentGrade?: string;
  currentStatus: SubmissionStatus;
}

export function GradeControl({ currentGrade, currentStatus }: GradeControlProps) {
  const [grade, setGrade] = useState(currentGrade || '');
  const [status, setStatus] = useState<SubmissionStatus>(currentStatus);

  return (
    <div className="panel" style={{ marginTop: '20px' }}>
      <h3>Assign Grade / Status</h3>
      
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <label style={{ fontSize: '12.5px', fontWeight: 500 }}>Group Status</label>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value as SubmissionStatus)}
            style={{
              padding: '9px 12px',
              borderRadius: '6px',
              border: '1px solid var(--hairline)',
              background: 'var(--surface)',
              fontFamily: 'var(--font-body)',
              fontSize: '13.5px'
            }}
          >
            <option value="not-started">Not started</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="late">Late</option>
            <option value="reviewed">Reviewed</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <label style={{ fontSize: '12.5px', fontWeight: 500 }}>Grade (Optional)</label>
          <input 
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="e.g. A-, 85/100, Approved"
            style={{
              padding: '9px 12px',
              borderRadius: '6px',
              border: '1px solid var(--hairline)',
              background: 'var(--panel)',
              fontFamily: 'var(--font-body)',
              fontSize: '13.5px'
            }}
          />
        </div>

        <button className="btn btn-secondary" style={{ height: '38.5px' }}>Save</button>
      </div>
    </div>
  );
}
