export function computeSubmissionStatus(deadlineStr: string, submissionTimeMs: number = Date.now()): 'submitted' | 'late' {
  const deadlineMs = new Date(deadlineStr).getTime();
  if (isNaN(deadlineMs)) {
    return 'submitted'; // Default if invalid deadline
  }
  
  // A 5-minute grace period (300,000 ms) before marking it late
  if (submissionTimeMs > deadlineMs + 300000) {
    return 'late';
  }
  return 'submitted';
}
