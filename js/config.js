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

export const FONTS_CONFIG = {
  SANS_OPTIONS: [
    { id: 'geist', name: 'Geist', desc: 'Vercel / Next.js modern signature developer font' },
    { id: 'inter', name: 'Inter', desc: 'Linear, Figma & GitHub gold-standard UI font' },
    { id: 'jakarta', name: 'Plus Jakarta Sans', desc: 'Sleek geometric SaaS & Raycast aesthetic' },
    { id: 'system', name: 'System Native', desc: 'Apple SF Pro / Segoe UI / Roboto OS native' },
  ],
  MONO_OPTIONS: [
    { id: 'geist', name: 'Geist Mono', desc: 'Vercel developer code font with crisp tabular numbers' },
    { id: 'jetbrains', name: 'JetBrains Mono', desc: 'VS Code & JetBrains IDE engineering favorite' },
    { id: 'fira', name: 'Fira Code', desc: 'Mozilla classic developer font with programming ligatures' },
    { id: 'system', name: 'System Mono', desc: 'Consolas / SFMono / Menlo native' },
  ],
  DENSITY_OPTIONS: [
    { id: 'compact', name: 'Compact', desc: 'Dense high-efficiency Linear mode' },
    { id: 'comfortable', name: 'Comfortable', desc: 'Balanced default readability' },
    { id: 'spacious', name: 'Spacious', desc: 'Relaxed larger typography' },
  ],
};
