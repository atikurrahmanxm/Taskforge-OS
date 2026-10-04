// TaskForge OS - Configuration & Constants

export const APP_CONFIG = {
  APP_NAME: 'TaskForge OS',
  VERSION: '1.0.0',
  STORAGE_PREFIX: 'taskforge_',
  DEFAULT_BOARD_ID: 'board-main',
  DEFAULT_THEME: 'dark',
};

export const PRIORITIES = {
  URGENT: { id: 'urgent', label: 'Urgent', color: '#ef4444', icon: '🔥' },
  HIGH: { id: 'high', label: 'High', color: '#f97316', icon: '⚡' },
  MEDIUM: { id: 'medium', label: 'Medium', color: '#eab308', icon: '🟡' },
  LOW: { id: 'low', label: 'Low', color: '#10b981', icon: '🟢' },
};

export const DEFAULT_COLUMNS = [
  { id: 'col-backlog', title: 'Backlog', color: '#64748b', limit: null },
  { id: 'col-in-progress', title: 'In Progress', color: '#38bdf8', limit: 4 },
  { id: 'col-review', title: 'Code Review', color: '#a855f7', limit: 3 },
  { id: 'col-done', title: 'Completed', color: '#10b981', limit: null },
];

export const DEFAULT_LABELS = [
  { id: 'lbl-feat', name: 'Feature', color: '#6366f1' },
  { id: 'lbl-bug', name: 'Bugfix', color: '#ef4444' },
  { id: 'lbl-perf', name: 'Performance', color: '#10b981' },
  { id: 'lbl-docs', name: 'Documentation', color: '#38bdf8' },
  { id: 'lbl-refactor', name: 'Refactor', color: '#f59e0b' },
];

export const VIEWS = {
  HOME: 'home',
  KANBAN: 'kanban',
  SPRINT: 'sprint',
  POMODORO: 'pomodoro',
  ANALYTICS: 'analytics',
  SETTINGS: 'settings',
};

export const POMODORO_MODES = {
  WORK: { id: 'work', label: 'Deep Focus', duration: 25 * 60 },
  SHORT_BREAK: { id: 'short', label: 'Short Break', duration: 5 * 60 },
  LONG_BREAK: { id: 'long', label: 'Long Break', duration: 15 * 60 },
};
