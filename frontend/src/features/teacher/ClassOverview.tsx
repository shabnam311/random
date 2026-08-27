import React, { useState } from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { StatusSeal } from '../../components/ui/StatusSeal';
import type { SubmissionStatus } from '../../components/ui/StatusSeal';
import { downloadCSV } from '../../lib/export';
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
  const [searchQuery, setSearchQuery] = useState('');

  const [groups, setGroups] = useState<GroupData[]>([]);

  const handleExport = () => {
    const exportData = groups.map(g => ({
      'Group Name': g.name,
      'Members': g.members,
      'Status': g.status,
      'Grade/Status Label': g.statusLabel || '',
      'Files': g.fileCount,
      'Last Activity': g.lastActivity
    }));
    downloadCSV(exportData, 'class_export.csv');
  };

  const filteredGroups = groups.filter(g => {
    // Search match
    const searchMatch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        g.members.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter match
    const filterMatch = filter === 'All' || 
                        g.status.replace('-', ' ') === filter.toLowerCase();

    return searchMatch && filterMatch;
  });

  return (
    <AppShell activeTab="Urban Water Systems — Overview">
      <div className="page">
        <div className="page-head">
          <div>
            <span className="eyebrow">Environmental Design · Term 2</span>
            <h1>Urban Water Systems</h1>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={handleExport}>Export CSV</button>
            <button className="btn btn-primary">Edit project</button>
          </div>
        </div>

        <div className="stat-strip">
          <div className="stat-box"><div className="num">{groups.length}</div><div className="lbl">Groups</div></div>
          <div className="stat-box"><div className="num">{groups.filter(g => g.status === 'submitted' || g.status === 'reviewed').length}</div><div className="lbl">Submitted</div></div>
          <div className="stat-box"><div className="num">{groups.filter(g => g.status !== 'late' && g.status !== 'not-started').length}</div><div className="lbl">On time</div></div>
          <div className="stat-box"><div className="num">{groups.filter(g => g.status === 'late').length}</div><div className="lbl">Late</div></div>
        </div>

        <div className="toolbar">
          <input 
            className="search-input" 
            placeholder="Search by group or student name" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
            {filteredGroups.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--ink-soft)' }}>
                  No groups match your search filters.
                </td>
              </tr>
            ) : (
              filteredGroups.map(g => (
                <tr key={g.id}>
                  <td className="gname">{g.name}</td>
                  <td className="members">{g.members}</td>
                  <td><StatusSeal status={g.status} label={g.statusLabel} /></td>
                  <td className="num mono">{g.fileCount}</td>
                  <td className="mono">{g.lastActivity}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
