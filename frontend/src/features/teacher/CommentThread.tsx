import React, { useState } from 'react';

interface Comment {
  id: string;
  author: string;
  role: 'Teacher' | 'Student';
  body: string;
  timestamp: string;
}

export function CommentThread() {
  const [comments] = useState<Comment[]>([
    {
      id: '1',
      author: 'S. Kapoor',
      role: 'Teacher',
      body: 'Excellent site analysis, but please clarify the rainfall data sources in your final presentation.',
      timestamp: '2 hours ago'
    }
  ]);
  const [newComment, setNewComment] = useState('');

  return (
    <div className="panel" style={{ marginTop: '20px' }}>
      <h3>Feedback & Comments</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
        {comments.map(c => (
          <div key={c.id} style={{ borderBottom: '1px solid var(--hairline)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <strong style={{ fontSize: '13.5px' }}>{c.author}</strong>
                <span style={{ fontSize: '11px', padding: '2px 6px', background: 'var(--surface)', borderRadius: '4px', color: 'var(--ink-soft)' }}>
                  {c.role}
                </span>
              </div>
              <span style={{ fontSize: '11.5px', color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)' }}>
                {c.timestamp}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--ink)' }}>{c.body}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
        <textarea 
          placeholder="Leave feedback for this group..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid var(--hairline)',
            fontFamily: 'var(--font-body)',
            fontSize: '13.5px',
            minHeight: '80px',
            resize: 'vertical'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary btn-sm">Post comment</button>
        </div>
      </div>
    </div>
  );
}
