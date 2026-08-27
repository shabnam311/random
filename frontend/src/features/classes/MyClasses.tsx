import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '../../components/layout/AppShell';
import { ClassCard } from './ClassCard';
import { classesApi } from '../../lib/api/supabase';
import type { SubmissionStatus } from '../../components/ui/StatusSeal';

interface EnrolledClass {
  id: string;
  term: string;
  className: string;
  teacherName: string;
  groupName: string;
  deadlineLabel: string;
  deadlineTime: string;
  status: SubmissionStatus;
  statusLabel?: string;
}

export function MyClasses() {
  const [enrolledClasses, setEnrolledClasses] = useState<EnrolledClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadClasses() {
      try {
        const data = await classesApi.getMyClasses();
        // Here we would map the real Supabase data to our UI interface.
        // For a brand new user, it will be empty!
        setEnrolledClasses(data ? (data as any) : []);
      } catch (err) {
        console.error('Failed to load classes', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadClasses();
  }, []);

  return (
    <AppShell>
      <div className="page">
        <div className="page-head">
          <div>
            <span className="eyebrow">My classes</span>
            <h1>Good afternoon</h1>
          </div>
          <button className="btn btn-secondary">Join a class</button>
        </div>
        
        {isLoading ? (
          <div aria-live="polite" style={{ padding: '40px', textAlign: 'center', color: 'var(--ink-soft)' }}>Loading classes...</div>
        ) : enrolledClasses.length === 0 ? (
          <div style={{ 
            padding: '60px 20px', 
            textAlign: 'center', 
            border: '1px dashed var(--hairline)', 
            borderRadius: 'var(--radius)', 
            background: 'var(--panel)',
            marginTop: '20px' 
          }}>
            <h3 style={{ marginBottom: '8px' }}>No classes yet</h3>
            <p style={{ color: 'var(--ink-soft)', marginBottom: '20px', fontSize: '14px' }}>You haven't joined or created any classes.</p>
            <button className="btn btn-primary">Join a class</button>
          </div>
        ) : (
          <div className="class-grid">
            {enrolledClasses.map(c => (
              <Link 
                key={c.id} 
                to={c.id === '3' ? `/classes/${c.id}/overview` : `/classes/${c.id}/group/1`} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
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
        )}
      </div>
    </AppShell>
  );
}
