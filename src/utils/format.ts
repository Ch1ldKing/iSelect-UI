import type { Subtask } from '../types';

/**
 * Format file size from bytes to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Format date string to localized date-time format
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Format number to percentage string
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Calculate overall progress from subtasks considering current round
 */
export function calculateProgress(subtasks: Subtask[], currentRound: number = 1, maxRounds: number = 1): number {
  if (subtasks.length === 0) return 0;
  
  // Calculate progress for current round
  const totalProgress = subtasks.reduce((sum, subtask) => {
    const progress = parseFloat(subtask.progress.replace('%', ''));
    return sum + progress;
  }, 0);
  const currentRoundProgress = totalProgress / subtasks.length;
  
  // Calculate overall progress considering all rounds
  const completedRounds = currentRound - 1;
  const progressPerRound = 100 / maxRounds;
  const overallProgress = (completedRounds * progressPerRound) + (currentRoundProgress * progressPerRound / 100);
  
  return Math.min(overallProgress, 100);
}
