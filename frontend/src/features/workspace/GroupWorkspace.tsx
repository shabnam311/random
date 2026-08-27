import React from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { FileBrowser } from '../files/FileBrowser';
import { TeamPanel } from './TeamPanel';
import { ActivityPanel } from './ActivityPanel';
import { SubmissionPanel } from './SubmissionPanel';
import './GroupWorkspace.css';

export function GroupWorkspace() {
  const demoFiles = [
    { id: '1', name: 'site-analysis-report.pdf', extension: 'PDF', version: 'v3', size: '4.2 MB', uploader: 'Rhea' },
    { id: '2', name: 'rainfall-data.xlsx', extension: 'XLS', version: 'v1', size: '220 KB', uploader: 'Dev' },
    { id: '3', name: 'site-plan-diagram.png', extension: 'PNG', version: 'v2', size: '1.8 MB', uploader: 'Amara' },
  ];

  const demoMembers = [
    { id: '1', initials: 'RS', name: 'Rhea Sen', isLeader: true },
    { id: '2', initials: 'DP', name: 'Dev Prabhu' },
    { id: '3', initials: 'AN', name: 'Amara Ng' },
  ];

  const demoActivity = [
    { id: '1', timeLabel: '2h ago', description: 'Amara replaced site-plan-diagram.png' },
    { id: '2', timeLabel: '1d ago', description: 'Dev uploaded rainfall-data.xlsx' },
    { id: '3', timeLabel: '2d ago', description: 'Rhea created the group' },
  ];

  return (
    <AppShell activeTab="Urban Water Systems">
      <div className="page">
        <div className="brief-box">
          <span className="eyebrow">Project brief</span>
          <h3 style={{ fontSize: '16px', marginTop: '4px' }}>Urban Water Systems — Group: Delta Four</h3>
          <p>Design a stormwater management proposal for a 2-block urban site. Submit your report, diagrams, and supporting data. Due Friday, 6:00 PM.</p>
        </div>

        <div className="workspace-grid">
          <div>
            <FileBrowser files={demoFiles} />
            <SubmissionPanel status="draft" statusLabel="Draft — not yet submitted" />
          </div>

          <div>
            <TeamPanel groupName="Delta Four" members={demoMembers} />
            <ActivityPanel activities={demoActivity} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
