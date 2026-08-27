import React from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { ClassCard } from './ClassCard';

export function MyClasses() {
  // Hardcoded demo data to match the UI demo exact content
  const enrolledClasses = [
    {
      id: '1',
      term: 'Environmental Design · Term 2',
      className: 'Urban Water Systems',
      teacherName: 'S. Kapoor',
      groupName: 'Delta Four',
      deadlineLabel: 'Deadline',
      deadlineTime: '3 days, 4 hrs left',
      status: 'draft' as const,
    },
    {
      id: '2',
      term: 'Data Structures · Term 2',
      className: 'Graph Traversal Visualizer',
      teacherName: 'A. Fenn',
      groupName: '',
      deadlineLabel: 'Deadline',
      deadlineTime: '9 days left',
      status: 'not-started' as const,
    },
    {
      id: '3',
      term: 'Modern History · Term 1',
      className: 'Oral History Archive',
      teacherName: 'L. Ferreira',
      groupName: 'The Archivists',
      deadlineLabel: 'Deadline',
      deadlineTime: 'Closed',
      status: 'reviewed' as const,
      statusLabel: 'Reviewed · A−',
    }
  ];

  return (
    <AppShell>
      <div className="page">
        <div className="page-head">
          <div>
            <span className="eyebrow">My classes</span>
            <h1>Good afternoon, Rhea</h1>
          </div>
          <button className="btn btn-secondary">Join a class</button>
        </div>
        
        <div className="class-grid">
          {enrolledClasses.map(c => (
            <Link key={c.id} to={`/classes/${c.id}/group/1`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <ClassCard
                term={c.term}
                className={c.className}
                teacherName={c.teacherName}
                groupName={c.groupName}
                deadlineLabel={c.deadlineLabel}
                deadlineTime={c.deadlineTime}
                status={c.status}
                statusLabel={c.statusLabel}
              />
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
