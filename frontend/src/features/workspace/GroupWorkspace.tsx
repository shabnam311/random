import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { FileBrowser } from '../files/FileBrowser';
import { TeamPanel } from './TeamPanel';
import { ActivityPanel } from './ActivityPanel';
import { SubmissionPanel } from './SubmissionPanel';
import { CommentThread } from '../teacher/CommentThread';
import { GradeControl } from '../teacher/GradeControl';
import { groupApi } from '../../lib/api/supabase';
import { useAuth } from '../../contexts/AuthContext';
import './GroupWorkspace.css';

export function GroupWorkspace() {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();
  
  const [group, setGroup] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // In a real app we'd fetch this from the user's role in the class
  const isTeacher = true; // Placeholder for UI layout logic

  const loadData = async () => {
    if (!groupId) return;
    try {
      const groupData = await groupApi.getGroupDetails(groupId);
      setGroup(groupData);
      const filesData = await groupApi.getFiles(groupId);
      setFiles(filesData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [groupId]);

  if (isLoading) {
    return <AppShell><div aria-live="polite" style={{ padding: '40px', textAlign: 'center' }}>Loading workspace...</div></AppShell>;
  }

  if (!group) {
    return <AppShell><div aria-live="assertive" style={{ padding: '40px', textAlign: 'center' }}>Group not found.</div></AppShell>;
  }

  const projectTitle = group.projects?.title || 'Unknown Project';

  return (
    <AppShell activeTab={projectTitle}>
      <div className="page">
        <div className="brief-box">
          <span className="eyebrow">Project brief</span>
          <h3 style={{ fontSize: '16px', marginTop: '4px' }}>{projectTitle} — Group: {group.name}</h3>
          <p>{group.projects?.description}</p>
        </div>

        <div className="workspace-grid">
          <div>
            <FileBrowser files={files} groupId={group.id} onUploadSuccess={loadData} />
            <SubmissionPanel 
              status={group.status} 
              statusLabel={group.statusLabel} 
              groupId={group.id} 
              onStatusChange={loadData} 
            />
            {isTeacher && <CommentThread comments={group.comments || []} groupId={group.id} onCommentAdded={loadData} />}
          </div>

          <div>
            <TeamPanel groupName={group.name} members={[]} />
            <ActivityPanel activities={group.activity_log || []} />
            {isTeacher && <GradeControl currentStatus={group.status} groupId={group.id} onGradeUpdated={loadData} />}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
