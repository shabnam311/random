import React, { useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { StatusSeal, SubmissionStatus } from '../../components/ui/StatusSeal';
import './ClassOverview.css';

interface GroupData {
  id: string;
  name: string;
  members: string;
  status: SubmissionStatus;
  statusLabel?: string;
  fileCount: number;
  lastActivity: string;
}

export function ClassOverview() {
  const [filter, setFilter] = useState('All');

  const groups: GroupData[] = [
    { id: '1', name: 'Delta Four', members: 'Rhea Sen, Dev Prabhu, Amara Ng', status: 'draft', fileCount: 3, lastActivity: '2 hrs ago' },
    { id: '2', name: 'Riverbank Collective', members: 'Owen Cole, Priya Iyer', status: 'submitted', fileCount: 6, lastActivity: '1 day ago' },
    { id: '3', name: 'Basin Works', members: 'Malik Osei, Freya Lindqvist, Noor Haddad', status: 'late', fileCount: 4, lastActivity: '4 hrs ago' },
    { id: '4', name: 'Culvert Six', members: 'Théo Marchand', status: 'not-started', fileCount: 0, lastActivity: '—' },
    { id: '5', name: 'Greywater Studio', members: 'Ines Bauer, Ravi Chandran', status: 'reviewed', statusLabel: 'Reviewed · B+', fileCount: 7, lastActivity: '3 days ago' },
  ];

  return (
    <AppShell activeTab="Urban Water Systems — Overview">
      <div className="page">
        <div className="page-head">
          <div>
            <span className="eyebrow">Environmental Design · Term 2</span>
            <h1>Urban Water Systems</h1>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary">Export CSV</button>
            <button className="btn btn-primary">Edit project</button>
          </div>
        </div>

        <div className="stat-strip">
          <div className="stat-box"><div className="num">15</div><div className="lbl">Groups</div></div>
          <div className="stat-box"><div className="num">12</div><div className="lbl">Submitted</div></div>
          <div className="stat-box"><div className="num">9</div><div className="lbl">On time</div></div>
          <div className="stat-box"><div className="num">3</div><div className="lbl">Late</div></div>
        </div>

        <div className="toolbar">
          <input className="search-input" placeholder="Search by group or student name" />
          {['All', 'Not started', 'Draft', 'Submitted', 'Late'].map(f => (
            <div 
              key={f} 
              className={`chip ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </div>
          ))}
        </div>

        <table className="ledger-table">
          <thead>
            <tr>
              <th>Group</th>
              <th>Members</th>
              <th>Status</th>
              <th className="num">Files</th>
              <th>Last activity</th>
            </tr>
          </thead>
          <tbody>
            {groups.map(g => (
              <tr key={g.id}>
                <td className="gname">{g.name}</td>
                <td className="members">{g.members}</td>
                <td><StatusSeal status={g.status} label={g.statusLabel} /></td>
                <td className="num mono">{g.fileCount}</td>
                <td className="mono">{g.lastActivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
