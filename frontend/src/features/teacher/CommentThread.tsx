import React, { useState } from 'react';
import { groupApi } from '../../lib/api/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Comment {
  id: string;
  author_id: string;
  body: string;
  created_at: string;
}

interface CommentThreadProps {
  comments: Comment[];
  groupId: string;
  onCommentAdded: () => void;
}

export function CommentThread({ comments, groupId, onCommentAdded }: CommentThreadProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handlePost = async () => {
    if (!newComment.trim() || !user) return;
    setIsSubmitting(true);
    try {
      await groupApi.addComment(groupId, newComment.trim(), user.id);
      setNewComment('');
      onCommentAdded();
    } catch (err) {
      console.error(err);
      alert('Failed to post comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="panel" style={{ marginTop: '20px' }}>
      <h3>Feedback & Comments</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
        {comments.length === 0 && <p style={{ color: 'var(--ink-soft)', fontSize: '13.5px' }}>No comments yet.</p>}
        {comments.map(c => (
          <div key={c.id} style={{ borderBottom: '1px solid var(--hairline)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <strong style={{ fontSize: '13.5px' }}>Teacher</strong>
                <span style={{ fontSize: '11px', padding: '2px 6px', background: 'var(--surface)', borderRadius: '4px', color: 'var(--ink-soft)' }}>
                  Teacher
                </span>
              </div>
              <span style={{ fontSize: '11.5px', color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)' }}>
                {new Date(c.created_at).toLocaleDateString()}
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
          disabled={isSubmitting}
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
          <button className="btn btn-primary btn-sm" onClick={handlePost} disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? 'Posting...' : 'Post comment'}
          </button>
        </div>
      </div>
    </div>
  );
}
