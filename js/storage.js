// TaskForge OS - Persistent Storage Engine & Seed Generator (Milestone 2)
import { APP_CONFIG, DEFAULT_COLUMNS, DEFAULT_LABELS, PRIORITIES } from './config.js';

const STORAGE_KEYS = {
  TASKS: `${APP_CONFIG.STORAGE_PREFIX}tasks`,
  COLUMNS: `${APP_CONFIG.STORAGE_PREFIX}columns`,
  SPRINTS: `${APP_CONFIG.STORAGE_PREFIX}sprints`,
  ACTIVE_SPRINT: `${APP_CONFIG.STORAGE_PREFIX}active_sprint`,
  SETTINGS: `${APP_CONFIG.STORAGE_PREFIX}settings`,
  POMODORO_HISTORY: `${APP_CONFIG.STORAGE_PREFIX}pomodoro_history`,
};

// Seed dataset of realistic software engineering tasks
const INITIAL_SPRINT = {
  id: 'sprint-1',
  name: 'Sprint 1 — Core Architecture & MVP',
  goal: 'Deliver primary authentication, database schema, and workstation UI layout.',
  startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  status: 'active', // 'planning', 'active', 'completed'
};

const INITIAL_TASKS = [
  {
    id: 'TASK-101',
    title: 'Implement JWT Access & Refresh Token Rotation',
    description: 'Ensure secure token issuance with sliding refresh session expiration and blacklisting on logout.',
    columnId: 'col-in-progress',
    sprintId: 'sprint-1',
    priority: PRIORITIES.URGENT.id,
    labels: ['lbl-feat'],
    estimateHours: 5,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    subtasks: [
      { id: 'sub-1', title: 'Setup RS256 key pair generator', completed: true },
      { id: 'sub-2', title: 'Write token verification middleware', completed: true },
      { id: 'sub-3', title: 'Add Redis refresh token store', completed: false },
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'TASK-102',
    title: 'Configure PostgreSQL Connection Pool & Read Replicas',
    description: 'Tune max_connections, idle_timeout, and implement pgBouncer for high concurrency spikes.',
    columnId: 'col-backlog',
    sprintId: 'sprint-1',
    priority: PRIORITIES.HIGH.id,
    labels: ['lbl-perf'],
    estimateHours: 8,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    subtasks: [
      { id: 'sub-4', title: 'Benchmark current query latency under 500 RPS', completed: false },
      { id: 'sub-5', title: 'Deploy pgBouncer config file', completed: false },
    ],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'TASK-103',
    title: 'Design Glassmorphism Dashboard UI Components',
    description: 'Craft responsive Kanban columns, drag indicators, badge tags, and modern dark mode typography.',
    columnId: 'col-review',
    sprintId: 'sprint-1',
    priority: PRIORITIES.MEDIUM.id,
    labels: ['lbl-feat'],
    estimateHours: 6,
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    subtasks: [
      { id: 'sub-6', title: 'Define CSS design tokens and variables', completed: true },
      { id: 'sub-7', title: 'Build responsive grid and sidebar', completed: true },
      { id: 'sub-8', title: 'Review accessibility contrast ratio', completed: false },
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'TASK-104',
    title: 'Setup Automated GitHub Actions CI/CD Pipeline',
    description: 'Automate linting, unit test execution, and preview branch deployments.',
    columnId: 'col-done',
    sprintId: 'sprint-1',
    priority: PRIORITIES.LOW.id,
    labels: ['lbl-docs'],
    estimateHours: 3,
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    subtasks: [
      { id: 'sub-9', title: 'Create .github/workflows/ci.yml', completed: true },
      { id: 'sub-10', title: 'Configure caching for npm dependencies', completed: true },
    ],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'TASK-105',
    title: 'Fix WebSocket Heartbeat & Reconnection Jitter',
    description: 'Address reconnect storms by implementing exponential backoff with full jitter.',
    columnId: 'col-in-progress',
    sprintId: 'sprint-1',
    priority: PRIORITIES.HIGH.id,
    labels: ['lbl-bug', 'lbl-perf'],
    estimateHours: 4,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    subtasks: [
      { id: 'sub-11', title: 'Simulate packet loss in test environment', completed: true },
      { id: 'sub-12', title: 'Implement backoff algorithm with jitter', completed: false },
    ],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export class StorageEngine {
  constructor() {
    this.seedIfEmpty();
  }

  seedIfEmpty() {
    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
      this.saveTasks(INITIAL_TASKS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.COLUMNS)) {
      this.saveColumns(DEFAULT_COLUMNS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SPRINTS)) {
      this.saveSprints([INITIAL_SPRINT]);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SPRINT, INITIAL_SPRINT.id);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.saveSettings({
        pomodoroWork: 25,
        pomodoroShortBreak: 5,
        pomodoroLongBreak: 15,
        soundEnabled: true,
        autoStartBreaks: false,
      });
    }
  }

  // Tasks
  getTasks() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }

  getTask(id) {
    return this.getTasks().find(t => t.id === id) || null;
  }

  saveTask(task) {
    const tasks = this.getTasks();
    const idx = tasks.findIndex(t => t.id === task.id);
    if (idx !== -1) {
      tasks[idx] = { ...tasks[idx], ...task, updatedAt: new Date().toISOString() };
    } else {
      tasks.unshift({ ...task, createdAt: new Date().toISOString() });
    }
    this.saveTasks(tasks);
    return task;
  }

  deleteTask(id) {
    const tasks = this.getTasks().filter(t => t.id !== id);
    this.saveTasks(tasks);
  }

  // Columns
  getColumns() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COLUMNS);
      return data ? JSON.parse(data) : DEFAULT_COLUMNS;
    } catch {
      return DEFAULT_COLUMNS;
    }
  }

  saveColumns(columns) {
    localStorage.setItem(STORAGE_KEYS.COLUMNS, JSON.stringify(columns));
  }

  // Sprints
  getSprints() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SPRINTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveSprints(sprints) {
    localStorage.setItem(STORAGE_KEYS.SPRINTS, JSON.stringify(sprints));
  }

  getActiveSprintId() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_SPRINT) || 'sprint-1';
  }

  setActiveSprintId(id) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SPRINT, id);
  }

  // Settings
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  // Pomodoro Sessions
  getPomodoroHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.POMODORO_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  savePomodoroSession(session) {
    const history = this.getPomodoroHistory();
    history.unshift({ ...session, timestamp: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.POMODORO_HISTORY, JSON.stringify(history));
  }
}

export const storage = new StorageEngine();
