import { describe, it, expect } from 'vitest';
import { computeSubmissionStatus } from '../lib/utils/deadline';

describe('computeSubmissionStatus', () => {
  it('returns "submitted" if submission is exactly at deadline', () => {
    const deadlineStr = '2026-10-15T17:00:00Z';
    const submissionTimeMs = new Date('2026-10-15T17:00:00Z').getTime();
    expect(computeSubmissionStatus(deadlineStr, submissionTimeMs)).toBe('submitted');
  });

  it('returns "submitted" if submission is before deadline', () => {
    const deadlineStr = '2026-10-15T17:00:00Z';
    const submissionTimeMs = new Date('2026-10-15T16:50:00Z').getTime();
    expect(computeSubmissionStatus(deadlineStr, submissionTimeMs)).toBe('submitted');
  });

  it('returns "submitted" if submission is within 5 minute grace period', () => {
    const deadlineStr = '2026-10-15T17:00:00Z';
    const submissionTimeMs = new Date('2026-10-15T17:04:59Z').getTime();
    expect(computeSubmissionStatus(deadlineStr, submissionTimeMs)).toBe('submitted');
  });

  it('returns "late" if submission is after 5 minute grace period', () => {
    const deadlineStr = '2026-10-15T17:00:00Z';
    const submissionTimeMs = new Date('2026-10-15T17:06:00Z').getTime();
    expect(computeSubmissionStatus(deadlineStr, submissionTimeMs)).toBe('late');
  });
});
