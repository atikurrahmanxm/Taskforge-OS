// TaskForge OS - Reactive State Manager & Event Bus (Milestone 2)
import { storage } from './storage.js';

export const EVENTS = {
  STATE_INITIALIZED: 'state:initialized',
  TASKS_CHANGED: 'tasks:changed',
  TASK_CREATED: 'task:created',
  TASK_UPDATED: 'task:updated',
  TASK_DELETED: 'task:deleted',
  TASK_MOVED: 'task:moved',
  SPRINT_CHANGED: 'sprint:changed',
  FILTER_CHANGED: 'filter:changed',
  SEARCH_CHANGED: 'search:changed',
};

class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event).delete(callback);
  }

  publish(event, payload) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`[EventBus] Error in listener for ${event}:`, err);
        }
      });
    }
  }
}

export const bus = new EventBus();

class StateStore {
  constructor() {
    this.tasks = [];
    this.columns = [];
    this.sprints = [];
    this.activeSprintId = null;
    this.searchQuery = '';
    this.filters = {
      priority: 'all',
      label: 'all',
    };
    this.init();
  }

  init() {
    this.tasks = storage.getTasks();
    this.columns = storage.getColumns();
    this.sprints = storage.getSprints();
    this.activeSprintId = storage.getActiveSprintId();
    bus.publish(EVENTS.STATE_INITIALIZED, this.getState());
  }

  getState() {
    return {
      tasks: this.tasks,
      columns: this.columns,
      sprints: this.sprints,
      activeSprintId: this.activeSprintId,
      searchQuery: this.searchQuery,
      filters: this.filters,
    };
  }

  // Filtered Tasks Selector
  getFilteredTasks() {
    let result = [...this.tasks];

    // Search query filter
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        t.id.toLowerCase().includes(q)
      );
    }

    // Priority filter
    if (this.filters.priority && this.filters.priority !== 'all') {
      result = result.filter(t => t.priority === this.filters.priority);
    }

    // Label filter
    if (this.filters.label && this.filters.label !== 'all') {
      result = result.filter(t => t.labels && t.labels.includes(this.filters.label));
    }

    return result;
  }

  getTasksByColumn(columnId) {
    return this.getFilteredTasks().filter(t => t.columnId === columnId);
  }

  // Mutations
  createTask(taskData) {
    const nextNum = Math.floor(100 + Math.random() * 900);
    const newTask = {
      id: `TASK-${nextNum}`,
      columnId: 'col-backlog',
      sprintId: this.activeSprintId,
      subtasks: [],
      labels: [],
      ...taskData,
      createdAt: new Date().toISOString(),
    };

    storage.saveTask(newTask);
    this.tasks.unshift(newTask);

    bus.publish(EVENTS.TASK_CREATED, newTask);
    bus.publish(EVENTS.TASKS_CHANGED, this.tasks);
    return newTask;
  }

  updateTask(updatedTask) {
    storage.saveTask(updatedTask);
    const idx = this.tasks.findIndex(t => t.id === updatedTask.id);
    if (idx !== -1) {
      this.tasks[idx] = updatedTask;
    }
    bus.publish(EVENTS.TASK_UPDATED, updatedTask);
    bus.publish(EVENTS.TASKS_CHANGED, this.tasks);
    return updatedTask;
  }

  deleteTask(taskId) {
    storage.deleteTask(taskId);
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    bus.publish(EVENTS.TASK_DELETED, taskId);
    bus.publish(EVENTS.TASKS_CHANGED, this.tasks);
  }

  moveTask(taskId, targetColumnId, targetIndex = null) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.columnId = targetColumnId;
    task.updatedAt = new Date().toISOString();

    // Reorder array if targetIndex is provided
    if (targetIndex !== null) {
      this.tasks = this.tasks.filter(t => t.id !== taskId);
      this.tasks.splice(targetIndex, 0, task);
    }

    storage.saveTasks(this.tasks);

    bus.publish(EVENTS.TASK_MOVED, { task, targetColumnId });
    bus.publish(EVENTS.TASKS_CHANGED, this.tasks);
  }

  setSearchQuery(query) {
    this.searchQuery = query;
    bus.publish(EVENTS.SEARCH_CHANGED, query);
    bus.publish(EVENTS.FILTER_CHANGED, this.filters);
  }

  setFilter(filterKey, value) {
    this.filters[filterKey] = value;
    bus.publish(EVENTS.FILTER_CHANGED, this.filters);
  }

  setActiveSprint(sprintId) {
    this.activeSprintId = sprintId;
    storage.setActiveSprintId(sprintId);
    bus.publish(EVENTS.SPRINT_CHANGED, sprintId);
  }
}

export const state = new StateStore();
