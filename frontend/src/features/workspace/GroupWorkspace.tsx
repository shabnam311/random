import React from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { FileBrowser } from '../files/FileBrowser';
import { TeamPanel } from './TeamPanel';
import { ActivityPanel } from './ActivityPanel';
import { SubmissionPanel } from './SubmissionPanel';
import { CommentThread } from '../teacher/CommentThread';
import { GradeControl } from '../teacher/GradeControl';
import './GroupWorkspace.css';

export function GroupWorkspace() {
  const isTeacher = true; // Hardcoded for demo/Milestone 4

  const demoFiles: any[] = [];
  const demoMembers: any[] = [];
  const demoActivity: any[] = [];

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
            {isTeacher && <CommentThread />}
          </div>

          <div>
            <TeamPanel groupName="Delta Four" members={demoMembers} />
            <ActivityPanel activities={demoActivity} />
            {isTeacher && <GradeControl currentStatus="draft" />}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
